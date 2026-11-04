import path from 'node:path';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import AxeBuilder from '@axe-core/playwright';

const { Given, When, Then } = createBdd();

/*
 * Cada passo existe em português (features/pt) e em inglês (features/en), com a mesma
 * implementação: as duas suítes testam o mesmo site, cada uma na sua língua.
 * Each step exists in Portuguese and in English, sharing one implementation.
 */
type Define = typeof Given;
type StepFn = Extract<Parameters<Define>[1], (...args: never[]) => unknown>;
const step = (define: Define, pt: string, en: string, fn: StepFn) => {
  define(pt, fn);
  define(en, fn);
};

// Caminho de cada idioma a partir da base do site (definida no playwright.config.ts).
const IDIOMAS: Record<string, string> = { português: './', inglês: './en/', Portuguese: './', English: './en/' };
const FIXTURES = path.resolve('tests/e2e/fixtures');
const RELATORIOS: Record<string, string> = {
  aprovado: 'aprovado',
  'com-falha': 'com-falha',
  passing: 'aprovado',
  failing: 'com-falha',
};

const abrirSite = async ({ page }: { page: Page }, idioma: string) => {
  const destino = IDIOMAS[idioma];
  if (!destino) throw new Error(`Idioma desconhecido no cenário: ${idioma}`);
  await page.goto(destino);
  // A IDE é uma ilha React: só interage depois da hidratação.
  await expect(page.locator('.ide[data-ready="true"]')).toBeVisible();
};

step(Given, 'que abri o site em {string}', 'I opened the site in {string}', abrirSite);
step(When, 'eu abro o site em {string}', 'I open the site in {string}', abrirSite);

/* ---------- Arquivos / Files ---------- */

const janelaDeProjeto = (page: Page) => page.getByRole('complementary', { name: /Projeto|Project/ });

const clicarNoArquivo = async ({ page }: { page: Page }, arquivo: string) => {
  await janelaDeProjeto(page).getByRole('button', { name: arquivo }).click();
};
step(Given, 'que abri o arquivo {string}', 'I opened the file {string}', clicarNoArquivo);
step(When, 'eu clico no arquivo {string} na janela de projeto', 'I click the file {string} in the project window', clicarNoArquivo);

step(When, 'eu clico na aba {string}', 'I click the tab {string}', async ({ page }, aba: string) => {
  await page.getByRole('tab', { name: aba }).click();
});

step(When, 'eu acesso o endereço com {string}', 'I visit the address with {string}', async ({ page }, hash: string) => {
  const url = new URL(page.url());
  url.hash = hash;
  await page.goto(url.toString());
});

step(When, 'eu pressiono {string}', 'I press {string}', async ({ page }, tecla: string) => {
  await page.keyboard.press(tecla);
});

step(Then, 'o editor mostra o arquivo {string}', 'the editor shows the file {string}', async ({ page }, arquivo: string) => {
  await expect(page.getByTestId('editor-title')).toHaveText(arquivo);
  await expect(page.getByRole('tab', { selected: true })).toContainText(arquivo);
});

step(Then, 'o editor contém {string}', 'the editor contains {string}', async ({ page }, texto: string) => {
  await expect(page.getByTestId('code')).toContainText(texto);
});

/* ---------- Celular / Phone ---------- */

step(Given, 'que estou usando um celular', 'I am using a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
});

step(Then, 'a página não tem rolagem horizontal', 'the page has no horizontal scroll', async ({ page }) => {
  const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(sobra).toBeLessThanOrEqual(0);
});

/* ---------- Idioma / Language ---------- */

step(When, 'eu troco o idioma para {string}', 'I switch the language to {string}', async ({ page }, idioma: string) => {
  await page.getByRole('link', { name: idioma }).click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('.ide[data-ready="true"]')).toBeVisible();
});

step(Then, 'a página está no idioma {string}', 'the page is in language {string}', async ({ page }, lang: string) => {
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
});

/* ---------- Relatório do CI, com a rede simulada / CI report, mocked network ---------- */

step(Given, 'que o CI publicou o relatório {string}', 'the CI published the {string} report', async ({ page }, nome: string) => {
  const arquivo = RELATORIOS[nome];
  if (!arquivo) throw new Error(`Relatório desconhecido no cenário: ${nome}`);
  await page.route('**/last-run.json', (route) => route.fulfill({ path: path.join(FIXTURES, `report-${arquivo}.json`) }));
});

step(Given, 'que o CI ainda não publicou nenhum relatório', 'the CI has not published any report yet', async ({ page }) => {
  await page.route('**/last-run.json', (route) => route.fulfill({ status: 404, body: 'not found' }));
});

step(When, 'eu clico no botão de executar', 'I click the run button', async ({ page }) => {
  await expect(page.getByTestId('run-state')).not.toHaveText(/Carregando|Loading/);
  await page.getByTestId('run-btn').click();
});

step(Then, 'a saída mostra {string}', 'the output shows {string}', async ({ page }, texto: string) => {
  await expect(page.getByTestId('output')).toContainText(texto, { timeout: 10_000 });
});

/* ---------- Teste de performance / Performance test ---------- */

step(Given, 'que abri o teste de performance', 'I opened the performance test', async ({ page }) => {
  await page.getByTestId('perf-open').click();
  await expect(page.getByTestId('perf-game')).toBeVisible();
});

step(Then, 'o teste de performance está fechado', 'the performance test is closed', async ({ page }) => {
  await expect(page.getByTestId('perf-game')).toBeHidden();
  // O foco volta para o botão que abriu o jogo.
  await expect(page.getByTestId('perf-open')).toBeFocused();
});

step(Then, 'os bugs caem só dentro da janela do jogo', 'the bugs only fall inside the game window', async ({ page }) => {
  // Um único canvas na página, e ele fica dentro da área do jogo.
  await expect(page.locator('canvas')).toHaveCount(1);
  const area = await page.locator('.game-area').boundingBox();
  const canvas = await page.locator('canvas').boundingBox();
  expect(area && canvas).toBeTruthy();
  expect(canvas!.x).toBeGreaterThanOrEqual(area!.x);
  expect(canvas!.y).toBeGreaterThanOrEqual(area!.y);
  expect(canvas!.x + canvas!.width).toBeLessThanOrEqual(area!.x + area!.width);
  expect(canvas!.y + canvas!.height).toBeLessThanOrEqual(area!.y + area!.height);
});

step(When, 'eu escolho {int} bugs', 'I choose {int} bugs', async ({ page }, quantidade: number) => {
  await page.getByTestId('perf-count').fill(String(quantidade));
});

step(When, 'eu solto os bugs', 'I release the bugs', async ({ page }) => {
  await page.getByTestId('perf-run').click();
});

step(Then, 'o teste de performance mostra {string}', 'the performance test shows {string}', async ({ page }, texto: string) => {
  // A chuva de bugs leva alguns segundos até o último bug sair da tela.
  await expect(page.getByTestId('perf-output')).toContainText(texto, { timeout: 15_000 });
});

step(Then, 'o contador de FPS aparece na tela', 'the FPS counter appears on screen', async ({ page }) => {
  await expect(page.getByTestId('perf-hud')).toContainText('FPS');
});

step(Given, 'que prefiro movimento reduzido', 'I prefer reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

step(Then, 'a tela de erro previsto está visível', 'the expected error screen is visible', async ({ page }) => {
  await expect(page.getByRole('alertdialog', { name: /ERRO PREVISTO|EXPECTED ERROR/ })).toBeVisible();
});

step(Then, 'a tela de erro previsto não está visível', 'the expected error screen is not visible', async ({ page }) => {
  await expect(page.getByTestId('crash')).toBeHidden();
});

/* ---------- Acessibilidade / Accessibility ---------- */

step(
  Then,
  'a página não tem violações de acessibilidade graves',
  'the page has no serious accessibility violations',
  async ({ page }) => {
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    const graves = violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id}: ${v.help} (${v.nodes.length} elementos)`);
    expect(graves).toEqual([]);
  },
);

step(Then, 'o diálogo de ajuda está visível', 'the help dialog is visible', async ({ page }) => {
  await expect(page.getByRole('dialog')).toBeVisible();
});

step(Then, 'o diálogo de ajuda não está visível', 'the help dialog is not visible', async ({ page }) => {
  await expect(page.getByRole('dialog')).toBeHidden();
});

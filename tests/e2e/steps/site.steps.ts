import path from 'node:path';
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import AxeBuilder from '@axe-core/playwright';

const { Given, When, Then } = createBdd();

// Caminho de cada idioma a partir da base do site (definida no playwright.config.ts).
const IDIOMAS: Record<string, string> = { português: './', inglês: './en/' };
const FIXTURES = path.resolve('tests/e2e/fixtures');

const abrirSite = async ({ page }: { page: import('@playwright/test').Page }, idioma: string) => {
  const destino = IDIOMAS[idioma];
  if (!destino) throw new Error(`Idioma desconhecido no cenário: ${idioma}`);
  await page.goto(destino);
  // A IDE é uma ilha React: só interage depois da hidratação.
  await expect(page.locator('.ide[data-ready="true"]')).toBeVisible();
};

Given('que abri o site em {string}', abrirSite);
When('eu abro o site em {string}', abrirSite);

/* ---------- Arquivos ---------- */

const janelaDeProjeto = (page: import('@playwright/test').Page) =>
  page.getByRole('complementary', { name: /Projeto|Project/ });

Given('que abri o arquivo {string}', async ({ page }, arquivo: string) => {
  await janelaDeProjeto(page).getByRole('button', { name: arquivo }).click();
});

When('eu clico no arquivo {string} na janela de projeto', async ({ page }, arquivo: string) => {
  await janelaDeProjeto(page).getByRole('button', { name: arquivo }).click();
});

When('eu clico na aba {string}', async ({ page }, aba: string) => {
  await page.getByRole('tab', { name: aba }).click();
});

When('eu acesso o endereço com {string}', async ({ page }, hash: string) => {
  const url = new URL(page.url());
  url.hash = hash;
  await page.goto(url.toString());
});

When('eu pressiono {string}', async ({ page }, tecla: string) => {
  await page.keyboard.press(tecla);
});

Then('o editor mostra o arquivo {string}', async ({ page }, arquivo: string) => {
  await expect(page.getByTestId('editor-title')).toHaveText(arquivo);
  await expect(page.getByRole('tab', { selected: true })).toContainText(arquivo);
});

Then('o editor contém {string}', async ({ page }, texto: string) => {
  await expect(page.getByTestId('code')).toContainText(texto);
});

/* ---------- Celular ---------- */

Given('que estou usando um celular', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
});

Then('a página não tem rolagem horizontal', async ({ page }) => {
  const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(sobra).toBeLessThanOrEqual(0);
});

/* ---------- Idioma ---------- */

When('eu troco o idioma para {string}', async ({ page }, idioma: string) => {
  await page.getByRole('link', { name: idioma }).click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('.ide[data-ready="true"]')).toBeVisible();
});

Then('a página está no idioma {string}', async ({ page }, lang: string) => {
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
});

/* ---------- Relatório do CI (rede simulada) ---------- */

Given('que o CI publicou o relatório {string}', async ({ page }, nome: string) => {
  await page.route('**/last-run.json', (route) => route.fulfill({ path: path.join(FIXTURES, `report-${nome}.json`) }));
});

Given('que o CI ainda não publicou nenhum relatório', async ({ page }) => {
  await page.route('**/last-run.json', (route) => route.fulfill({ status: 404, body: 'not found' }));
});

When('eu clico no botão de executar', async ({ page }) => {
  await expect(page.getByTestId('run-state')).not.toHaveText(/Carregando|Loading/);
  await page.getByTestId('run-btn').click();
});

Then('a saída mostra {string}', async ({ page }, texto: string) => {
  await expect(page.getByTestId('output')).toContainText(texto, { timeout: 10_000 });
});

/* ---------- Teste de performance ---------- */

When('eu escolho {int} bugs', async ({ page }, quantidade: number) => {
  await page.getByTestId('perf-count').fill(String(quantidade));
});

When('eu solto os bugs', async ({ page }) => {
  await page.getByTestId('perf-run').click();
});

Then('o teste de performance mostra {string}', async ({ page }, texto: string) => {
  // A chuva de bugs leva alguns segundos até o último bug sair da tela.
  await expect(page.getByTestId('perf-output')).toContainText(texto, { timeout: 15_000 });
});

Then('o contador de FPS aparece na tela', async ({ page }) => {
  await expect(page.getByTestId('perf-hud')).toContainText('FPS');
});

Given('que prefiro movimento reduzido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

Then('a tela de erro previsto está visível', async ({ page }) => {
  await expect(page.getByRole('alertdialog', { name: 'ERRO PREVISTO' })).toBeVisible();
});

Then('a tela de erro previsto não está visível', async ({ page }) => {
  await expect(page.getByTestId('crash')).toBeHidden();
});

/* ---------- Acessibilidade ---------- */

Then('a página não tem violações de acessibilidade graves', async ({ page }) => {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const graves = violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.help} (${v.nodes.length} elementos)`);
  expect(graves).toEqual([]);
});

Then('o diálogo de ajuda está visível', async ({ page }) => {
  await expect(page.getByRole('dialog')).toBeVisible();
});

Then('o diálogo de ajuda não está visível', async ({ page }) => {
  await expect(page.getByRole('dialog')).toBeHidden();
});

# natalia-pandolfi-qa

Site pessoal da **Natalia Pandolfi, Senior QA Engineer**. Ele imita uma IDE de tela azul dos anos 90, a apresentação é escrita em Gherkin (em português e em inglês) e os testes do próprio site rodam com **Playwright + BDD** a cada push. O painel "Saída" mostra o resultado real da última execução do CI.

```gherkin
# language: pt
Funcionalidade: Este repositório
  Cenário: Push na main
    Dado que os testes unitários e E2E passaram
    Quando o GitHub Actions termina
    Então o site é publicado no GitHub Pages
    E a janela "Saída" mostra o relatório dessa execução
```

## Stack

| Camada | Tecnologia |
|---|---|
| Site | [Astro](https://astro.build) (HTML estático) + uma ilha [React](https://react.dev) para a IDE interativa |
| Linguagem | TypeScript |
| Testes unitários | [Vitest](https://vitest.dev) + `@cucumber/gherkin` (valida todo o conteúdo em Gherkin) |
| Testes E2E | [Playwright](https://playwright.dev) + [playwright-bdd](https://github.com/vitalets/playwright-bdd), cenários em português |
| Acessibilidade | [axe-core](https://github.com/dequelabs/axe-core) dentro dos cenários E2E |
| CI/CD | GitHub Actions → GitHub Pages |

## Estrutura

```
content/
  pt/*.feature            apresentação em português (o que aparece em features/)
  en/*.feature            a mesma apresentação em inglês
src/
  components/Ide.tsx      a IDE: menu, projeto, editor, saída, status, ajuda
  components/Page.astro   <head>, SEO, hreflang e a ilha React
  pages/index.astro       / (português)
  pages/en/index.astro    /en/ (inglês)
  data/content-map.ts     liga cada arquivo pt ao seu equivalente en
  lib/highlight.ts        realce de sintaxe Gherkin e TypeScript
  lib/report.ts           formato do last-run.json e texto da janela Saída
  i18n/ui.ts              textos da interface nos dois idiomas
tests/
  unit/                   Vitest
  e2e/features/           cenários E2E (também aparecem no site, pasta e2e/)
  e2e/steps/site.steps.ts step definitions (também aparecem no site)
  e2e/fixtures/           relatórios falsos usados para simular a rede
scripts/
  summarize-report.mjs    converte reports/cucumber.json em last-run.json
```

## Rodando localmente

Requer Node 20 ou superior.

```bash
npm install
npx playwright install chromium   # só na primeira vez
npm run dev                       # http://localhost:4321
```

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run check` | checagem de tipos |
| `npm run test:unit` | testes unitários |
| `npm run build` | gera o site em `dist/` |
| `npm run test:e2e` | gera os testes a partir dos `.feature` e roda no site compilado |
| `npm test` | unitários + build + E2E |
| `npm run report` | gera `public/last-run.json` a partir do último E2E, para ver o painel Saída com dados reais no `dev` |

Relatórios ficam em `reports/`: `cucumber.html`, `cucumber.json` e `playwright/index.html`.

Depois do primeiro `npm install`, faça commit do `package-lock.json`. O CI passa a usar `npm ci`, que é mais rápido e reproduzível.

## Publicando no GitHub Pages

1. Crie o repositório no GitHub e faça o push da branch `main`.
2. Em **Settings → Pages → Build and deployment**, escolha **Source: GitHub Actions**.
3. A cada push na `main`, o workflow `.github/workflows/ci.yml` roda os testes. Se tudo passar, ele publica em `https://<seu-usuario>.github.io/<repositorio>/`.

Se o repositório se chamar `<seu-usuario>.github.io`, o site vai para a raiz do domínio. O workflow detecta isso sozinho.

## Como editar a apresentação

1. Edite o arquivo em `content/pt/` **e** o equivalente em `content/en/`.
2. Rode `npm run test:unit`. O teste `content.test.ts` falha se algum arquivo não for Gherkin válido ou se as duas versões tiverem números diferentes de cenários ou de passos.

Para criar um arquivo novo, adicione os dois `.feature` e uma entrada em `src/data/content-map.ts`.

## Como o painel "Saída" funciona

1. O Playwright roda os cenários de `tests/e2e/features/` e grava `reports/cucumber.json`.
2. `scripts/summarize-report.mjs` converte esse relatório em `dist/last-run.json`, com commit, link da execução, cenários e tempos.
3. O site baixa `last-run.json` e, ao clicar em **Executar** (ou apertar F9), reproduz essa execução linha por linha.

Nos testes E2E, `last-run.json` é simulado com `page.route()` usando os arquivos de `tests/e2e/fixtures/`. Assim os cenários de sucesso, falha e "sem relatório" são testados sem depender do CI.

## Atalhos

`F9` executa · `F1` abre a ajuda · `Alt+1` a `Alt+5` trocam de arquivo · `Esc` fecha menus e diálogos. Cada arquivo também abre por link: `#about`, `#experience`, `#skills`, `#education`, `#contact`.

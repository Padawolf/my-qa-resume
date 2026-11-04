# CLAUDE.md

Site pessoal da Natalia Pandolfi (QA Engineer): uma IDE vintage em Astro + React onde a apresentação é escrita em Gherkin, em português e em inglês. Veja o README.md para a visão geral.

## Comandos

- `npm install` e `npx playwright install chromium` na primeira vez
- `npm run check`: tipos (astro check)
- `npm run test:unit`: Vitest
- `npm run build && npm run test:e2e`: E2E com Playwright + playwright-bdd contra o site compilado
- `npm test`: tudo

## Estado do projeto

O projeto foi escrito numa sessão sem acesso ao npm. Por isso **ainda não passou por `npm install`, `astro check`, build nem E2E**. Só `src/lib/*.ts` e `scripts/cucumber-to-run.mjs` foram testados, e passaram. Na primeira sessão:

1. Rode `npm install`, `npm run check`, `npm run test:unit`, `npm run build` e `npm run test:e2e`, nessa ordem, e corrija o que falhar.
2. Confira se as versões do `package.json` ainda estão atuais e se as APIs usadas existem nelas, principalmente `defineBddConfig` e `cucumberReporter` do playwright-bdd, e `import.meta.glob` com `query: '?raw'`.
3. Faça commit do `package-lock.json`.

## Convenções

- **Conteúdo:** `content/pt/*.feature` e `content/en/*.feature` precisam ter os mesmos cenários e o mesmo número de passos. O `tests/unit/content.test.ts` garante isso. Novos arquivos também entram em `src/data/content-map.ts`.
- **Ids dos arquivos** (`about`, `experience`, ...) são iguais nos dois idiomas e servem de `#hash`. Trocar de idioma mantém o arquivo aberto.
- **E2E:** cada cenário existe em `tests/e2e/features/pt/` (`# language: pt`, contra o site em português) e em `tests/e2e/features/en/` (`# language: en`, contra o site em inglês), com o mesmo número de cenários e de passos. O `content.test.ts` garante isso, e arquivos novos entram no `E2E` de `src/data/content-map.ts`. Os steps ficam em `tests/e2e/steps/site.steps.ts`, cada passo registrado nas duas línguas com `step(Given, pt, en, fn)`. Os testes não aparecem no site: a janela de projeto tem um link para o repositório no GitHub.
- **Interação nos testes:** espere `.ide[data-ready="true"]` antes de interagir, porque a IDE é uma ilha React hidratada no cliente.
- **Relatório do CI:** `last-run.json` segue `RunReport` (`src/lib/report.ts`). Nos E2E ele é simulado com `page.route()` usando `tests/e2e/fixtures/`.
- **Visual:** é um tema único. Os tokens de cor ficam em `src/styles/ide.css`. Mantenha o contraste WCAG AA, porque o cenário de acessibilidade com axe falha se não for respeitado.
- **Currículo em PDF:** `public/curriculo-natalia-pandolfi.pdf` e `public/resume-natalia-pandolfi.pdf` são gerados por `npm run resume` a partir de `scripts/build-resume.mjs`. Ao mudar experiência, habilidades ou formação em `content/`, atualize o script e gere os PDFs de novo. O PDF tem empresas e datas; o site, não.
- **Textos da interface** ficam em `src/i18n/ui.ts`. Sempre atualize os dois idiomas.
- **Dados pessoais:** o telefone do currículo ficou fora de propósito. Não adicione sem a Natalia pedir.

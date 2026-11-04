import type { IdeFile, Lang } from './types';
import { CONTENT, E2E } from './content-map';

// Os arquivos são lidos como texto na hora do build. O que aparece no site é exatamente
// o que está no repositório, inclusive os testes E2E que rodam no CI.
// (O Vite exige as opções do glob escritas literalmente em cada chamada.)

const PT = import.meta.glob('../../content/pt/*.feature', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const EN = import.meta.glob('../../content/en/*.feature', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const E2E_PT = import.meta.glob('../../tests/e2e/features/pt/*.feature', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const E2E_EN = import.meta.glob('../../tests/e2e/features/en/*.feature', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const STEPS = import.meta.glob('../../tests/e2e/steps/site.steps.ts', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function pick(modules: Record<string, string>, name: string): string {
  const key = Object.keys(modules).find((k) => k.endsWith('/' + name));
  if (!key) throw new Error(`Arquivo de conteúdo não encontrado: ${name}`);
  return modules[key];
}

const baseName = (path: string) => path.split('/').pop() ?? path;

export function getFiles(lang: Lang): IdeFile[] {
  const source = lang === 'pt' ? PT : EN;
  const e2eSource = lang === 'pt' ? E2E_PT : E2E_EN;

  const content: IdeFile[] = CONTENT.map((c) => ({
    id: c.id,
    name: c[lang],
    dir: 'features',
    kind: 'gherkin',
    text: pick(source, c[lang]),
  }));

  const e2e: IdeFile[] = E2E.map((e): IdeFile => ({
    id: e.id,
    name: e[lang],
    dir: 'e2e',
    kind: 'gherkin',
    text: pick(e2eSource, e[lang]),
  })).sort((a, b) => a.name.localeCompare(b.name));

  // Os steps são um arquivo só, com cada passo escrito nas duas línguas.
  const steps: IdeFile[] = Object.keys(STEPS).map((path) => ({
    id: 'steps',
    name: baseName(path),
    dir: 'steps',
    kind: 'ts',
    text: STEPS[path],
  }));

  return [...content, ...e2e, ...steps];
}

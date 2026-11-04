import type { IdeFile, Lang } from './types';
import { CONTENT } from './content-map';

// Os arquivos são lidos como texto na hora do build: o que aparece no site é exatamente
// o que está em content/. Os testes do site ficam no GitHub (link na janela de projeto).
// (O Vite exige as opções do glob escritas literalmente em cada chamada.)

const PT = import.meta.glob('../../content/pt/*.feature', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const EN = import.meta.glob('../../content/en/*.feature', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function pick(modules: Record<string, string>, name: string): string {
  const key = Object.keys(modules).find((k) => k.endsWith('/' + name));
  if (!key) throw new Error(`Arquivo de conteúdo não encontrado: ${name}`);
  return modules[key];
}

export function getFiles(lang: Lang): IdeFile[] {
  const source = lang === 'pt' ? PT : EN;
  return CONTENT.map((c) => ({
    id: c.id,
    name: c[lang],
    dir: 'features',
    kind: 'gherkin',
    text: pick(source, c[lang]),
  }));
}

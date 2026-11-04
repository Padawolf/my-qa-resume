/**
 * Mapa dos arquivos de apresentação. Cada entrada existe em `content/pt` e em `content/en`
 * com nomes diferentes, mas o mesmo `id`, que é o que permite trocar de idioma sem perder
 * o arquivo aberto. O teste `tests/unit/content.test.ts` garante essa paridade.
 */
export const CONTENT = [
  { id: 'about', pt: 'sobre_mim.feature', en: 'about_me.feature' },
  { id: 'experience', pt: 'experiencia.feature', en: 'experience.feature' },
  { id: 'skills', pt: 'habilidades.feature', en: 'skills.feature' },
  { id: 'education', pt: 'formacao.feature', en: 'education.feature' },
  { id: 'contact', pt: 'contato.feature', en: 'contact.feature' },
] as const;

/**
 * Features E2E. Existem em `tests/e2e/features/pt` e `tests/e2e/features/en` e as duas versões
 * rodam no CI, cada uma contra o site no seu idioma. O mesmo `id` mantém o arquivo aberto ao
 * trocar de idioma, e o `tests/unit/content.test.ts` garante que as duas têm os mesmos cenários.
 */
export const E2E = [
  { id: 'e2e-accessibility', pt: 'acessibilidade.feature', en: 'accessibility.feature' },
  { id: 'e2e-execution', pt: 'execucao.feature', en: 'execution.feature' },
  { id: 'e2e-language', pt: 'idioma.feature', en: 'language.feature' },
  { id: 'e2e-navigation', pt: 'navegacao.feature', en: 'navigation.feature' },
  { id: 'e2e-performance', pt: 'performance.feature', en: 'performance.feature' },
] as const;

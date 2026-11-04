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

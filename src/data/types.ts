export type Lang = 'pt' | 'en';

export type CodeKind = 'gherkin' | 'ts';

/** Um "arquivo" exibido na IDE: conteúdo da apresentação, feature E2E ou step definitions. */
export interface IdeFile {
  /** Identificador estável, igual nos dois idiomas. Também é o #hash da URL. */
  id: string;
  name: string;
  dir: 'features' | 'e2e' | 'steps';
  kind: CodeKind;
  text: string;
}

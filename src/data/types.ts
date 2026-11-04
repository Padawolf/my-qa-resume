export type Lang = 'pt' | 'en';

export type CodeKind = 'gherkin' | 'ts';

/** Um "arquivo" da apresentação exibido na IDE. */
export interface IdeFile {
  /** Identificador estável, igual nos dois idiomas. Também é o #hash da URL. */
  id: string;
  name: string;
  dir: 'features';
  kind: CodeKind;
  text: string;
}

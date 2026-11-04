import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { AstBuilder, GherkinClassicTokenMatcher, Parser, compile } from '@cucumber/gherkin';
import { IdGenerator } from '@cucumber/messages';
import { CONTENT } from '../../src/data/content-map';

const ROOT = new URL('../../', import.meta.url).pathname;

/** Faz o parse com o parser oficial do Cucumber e devolve os "pickles" (cenários executáveis). */
function parse(file: string) {
  const text = readFileSync(join(ROOT, file), 'utf8');
  const newId = IdGenerator.uuid();
  const doc = new Parser(new AstBuilder(newId), new GherkinClassicTokenMatcher()).parse(text);
  return { doc, pickles: compile(doc, file, newId) };
}

const featuresIn = (dir: string) => readdirSync(join(ROOT, dir)).filter((f) => f.endsWith('.feature'));

describe('conteúdo da apresentação', () => {
  for (const lang of ['pt', 'en'] as const) {
    it(`content/${lang} tem exatamente os arquivos do content-map`, () => {
      expect(featuresIn(`content/${lang}`).sort()).toEqual(CONTENT.map((c) => c[lang]).sort());
    });
  }

  for (const entry of CONTENT) {
    it(`${entry.pt} e ${entry.en} são Gherkin válido e têm os mesmos cenários`, () => {
      const pt = parse(`content/pt/${entry.pt}`);
      const en = parse(`content/en/${entry.en}`);
      expect(pt.doc.feature?.language).toBe('pt');
      expect(en.doc.feature?.language).toBe('en');
      expect(pt.pickles.length).toBeGreaterThan(0);
      expect(pt.pickles.length).toBe(en.pickles.length);
      expect(pt.pickles.map((p) => p.steps.length)).toEqual(en.pickles.map((p) => p.steps.length));
    });
  }
});

describe('features E2E', () => {
  for (const file of featuresIn('tests/e2e/features')) {
    it(`${file} é Gherkin válido em português`, () => {
      const { doc, pickles } = parse(`tests/e2e/features/${file}`);
      expect(doc.feature?.language).toBe('pt');
      expect(pickles.length).toBeGreaterThan(0);
    });
  }
});

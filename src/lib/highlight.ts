import type { CodeKind } from '../data/types';

export interface HlLine {
  /** HTML seguro (texto escapado) com spans de realce. */
  html: string;
  /** Texto original da linha. */
  text: string;
  /** Linha de tabela do Gherkin (`| ... |`): não quebra, rola na horizontal. */
  table: boolean;
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const span = (cls: string, html: string) => `<span class="${cls}">${html}</span>`;

// Palavras-chave de bloco e de passo do Gherkin em português e inglês.
const BLOCK_RE =
  /^(\s*)(Esquema do Cenário|Delineação do Cenário|Funcionalidade|Característica|Contexto|Cenários|Cenário|Exemplos|Regra|Scenario Outline|Scenario Template|Feature|Background|Scenarios|Scenario|Examples|Example|Rule)(:)(.*)$/;
const STEP_RE = /^(\s*)(Dado|Dada|Dados|Dadas|Quando|Então|Entao|E|Mas|Given|When|Then|And|But|\*)(\s+)(.*)$/;
const TAG_RE = /@[\wÀ-ſ-]+/g;
const PARAM_RE = /&lt;[\wÀ-ſ_-]+&gt;/g;
const LINK_RE = /\b((?:linkedin\.com|github\.com)\/[\w\-/]+)|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

const params = (s: string) => s.replace(PARAM_RE, (m) => span('param', m));

/** Realça strings entre aspas e parâmetros `<x>` de um trecho já escapado. */
function inline(escaped: string): string {
  return escaped
    .split(/("[^"]*")/g)
    .map((part) => (part.length >= 2 && part.startsWith('"') && part.endsWith('"') ? span('str', params(part)) : params(part)))
    .join('');
}

function linkify(escaped: string): string {
  return escaped.replace(LINK_RE, (m, url: string | undefined, email: string | undefined) => {
    if (url) return `<a href="https://${url}" target="_blank" rel="noopener">${url}</a>`;
    if (email) return `<a href="mailto:${email}">${email}</a>`;
    return m;
  });
}

export function highlightGherkin(source: string): HlLine[] {
  let previousWasTable = false;
  return source
    .replace(/\r\n/g, '\n')
    .replace(/\n$/, '')
    .split('\n')
    .map((text) => {
      const trimmed = text.trim();
      const escaped = escapeHtml(text);
      let html: string;
      let table = false;
      let m: RegExpMatchArray | null;

      if (trimmed === '') {
        html = '';
      } else if (trimmed.startsWith('#')) {
        html = span('c', escaped);
      } else if (trimmed.startsWith('@')) {
        html = escaped.replace(TAG_RE, (t) => span('tag', t));
      } else if (trimmed.startsWith('|')) {
        table = true;
        html = linkify(escaped).replace(/\|/g, span('pipe', '|'));
        if (!previousWasTable) html = span('th', html);
      } else if ((m = text.match(BLOCK_RE))) {
        html = escapeHtml(m[1]) + span('kw', m[2] + m[3]) + span('ttl', inline(escapeHtml(m[4])));
      } else if ((m = text.match(STEP_RE))) {
        html = escapeHtml(m[1]) + span('stp', m[2]) + m[3] + inline(escapeHtml(m[4]));
      } else {
        html = span('desc', escaped);
      }

      previousWasTable = table;
      return { html, text, table };
    });
}

const TS_RE =
  /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(import|from|export|const|let|async|await|return|new|type|interface|function|if|else|as|default|for|of)\b|\b(string|number|boolean|true|false|null|undefined)\b|\b([A-Z][A-Za-z0-9]*)\b/g;

export function highlightTs(source: string): HlLine[] {
  return source
    .replace(/\r\n/g, '\n')
    .replace(/\n$/, '')
    .split('\n')
    .map((text) => {
      let html = '';
      let last = 0;
      TS_RE.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = TS_RE.exec(text))) {
        html += escapeHtml(text.slice(last, m.index));
        if (m[1]) html += span('c', escapeHtml(m[1]));
        else if (m[2]) html += span('jstr', escapeHtml(m[2]));
        else if (m[3]) html += span('jkw', m[3]);
        else if (m[4]) html += span('jty', m[4]);
        else if (m[5]) html += span('jcls', m[5]);
        last = TS_RE.lastIndex;
      }
      html += escapeHtml(text.slice(last));
      return { html, text, table: false };
    });
}

export function highlight(source: string, kind: CodeKind): HlLine[] {
  return kind === 'ts' ? highlightTs(source) : highlightGherkin(source);
}

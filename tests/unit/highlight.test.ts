import { describe, expect, it } from 'vitest';
import { escapeHtml, highlightGherkin, highlightTs } from '../../src/lib/highlight';

describe('highlightGherkin', () => {
  it('realça palavras-chave de bloco em português e em inglês', () => {
    const [pt, en] = highlightGherkin('Funcionalidade: Conhecer\nFeature: Meet');
    expect(pt.html).toContain('<span class="kw">Funcionalidade:</span>');
    expect(en.html).toContain('<span class="kw">Feature:</span>');
  });

  it('reconhece Esquema do Cenário e Scenario Outline antes de Cenário/Scenario', () => {
    const [pt, en] = highlightGherkin('  Esquema do Cenário: X\n  Scenario Outline: Y');
    expect(pt.html).toContain('<span class="kw">Esquema do Cenário:</span>');
    expect(en.html).toContain('<span class="kw">Scenario Outline:</span>');
  });

  it('realça passos, strings e parâmetros de exemplo', () => {
    const [line] = highlightGherkin('    Dado um sistema com a camada "<camada>"');
    expect(line.html).toContain('<span class="stp">Dado</span>');
    expect(line.html).toContain('<span class="str">"<span class="param">&lt;camada&gt;</span>"</span>');
  });

  it('não confunde a palavra "E" no meio da frase com um passo', () => {
    const [line] = highlightGherkin('  Uma descrição E outra coisa');
    expect(line.html).toContain('class="desc"');
  });

  it('marca o cabeçalho da tabela e transforma contatos em links', () => {
    const lines = highlightGherkin(
      '      | canal    | endereço                     |\n      | LinkedIn | linkedin.com/in/nat-pandolfi |\n      | E-mail   | nataliaspandolfi@gmail.com   |',
    );
    expect(lines.every((l) => l.table)).toBe(true);
    expect(lines[0].html.startsWith('<span class="th">')).toBe(true);
    expect(lines[1].html.startsWith('<span class="th">')).toBe(false);
    expect(lines[1].html).toContain('href="https://linkedin.com/in/nat-pandolfi"');
    expect(lines[2].html).toContain('href="mailto:nataliaspandolfi@gmail.com"');
  });

  it('realça comentários e tags', () => {
    const [c, t] = highlightGherkin('# language: pt\n@perfil @smoke');
    expect(c.html).toBe('<span class="c"># language: pt</span>');
    expect(t.html).toBe('<span class="tag">@perfil</span> <span class="tag">@smoke</span>');
  });

  it('escapa HTML do conteúdo', () => {
    const [line] = highlightGherkin('  <script>alert(1)</script>');
    expect(line.html).not.toContain('<script>');
    expect(line.html).toContain('&lt;script&gt;');
  });

  it('mantém o número de linhas do arquivo, sem a quebra final', () => {
    expect(highlightGherkin('a\nb\n')).toHaveLength(2);
  });
});

describe('highlightTs', () => {
  it('realça palavras-chave, strings e comentários', () => {
    const [imp, str, com] = highlightTs("import { expect } from '@playwright/test';\nconst a = 'x';\n// nota");
    expect(imp.html).toContain('<span class="jkw">import</span>');
    expect(imp.html).toContain("<span class=\"jstr\">'@playwright/test'</span>");
    expect(str.html).toContain('<span class="jkw">const</span>');
    expect(com.html).toBe('<span class="c">// nota</span>');
  });
});

describe('escapeHtml', () => {
  it('escapa &, < e >', () => {
    expect(escapeHtml('a & <b>')).toBe('a &amp; &lt;b&gt;');
  });
});

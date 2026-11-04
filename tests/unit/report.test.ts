import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { countLine, formatDuration, formatNoReport, formatRun, isRunReport, totals } from '../../src/lib/report';
import type { RunReport } from '../../src/lib/report';
import { cucumberToRun } from '../../scripts/cucumber-to-run.mjs';

const fixture = (name: string): RunReport =>
  JSON.parse(readFileSync(new URL(`../e2e/fixtures/report-${name}.json`, import.meta.url), 'utf8'));

describe('isRunReport', () => {
  it('aceita os relatórios de exemplo', () => {
    expect(isRunReport(fixture('aprovado'))).toBe(true);
    expect(isRunReport(fixture('com-falha'))).toBe(true);
  });

  it.each([null, {}, { generatedAt: 'x', durationMs: 1, features: [{ name: 'f', scenarios: [{ name: 's', status: 'ok' }] }] }])(
    'rejeita JSON inválido: %j',
    (data) => {
      expect(isRunReport(data)).toBe(false);
    },
  );
});

describe('totals e linhas de resumo', () => {
  it('soma cenários e passos no formato do Cucumber', () => {
    const t = totals(fixture('com-falha'));
    expect(countLine('Scenarios', t.scenarios)).toBe('4 Scenarios (1 failed, 3 passed)');
    expect(countLine('Steps', t.steps)).toBe('15 Steps (1 failed, 14 passed)');
  });

  it('formata a duração como o Cucumber', () => {
    expect(formatDuration(4213)).toBe('0m4.213s');
    expect(formatDuration(65_500)).toBe('1m5.500s');
  });
});

describe('formatRun', () => {
  it('termina com BUILD SUCCESS quando tudo passa', () => {
    const out = formatRun(fixture('aprovado'), 'pt');
    expect(out.at(-1)).toEqual({ kind: 'build-ok', text: expect.stringContaining('BUILD SUCCESS') });
    expect(out.some((l) => l.text === '4 Scenarios (4 passed)')).toBe(true);
  });

  it('mostra o erro e BUILD FAILURE quando algo falha', () => {
    const out = formatRun(fixture('com-falha'), 'en');
    expect(out.some((l) => l.kind === 'fail' && l.text.includes('Scenario: Trocar de arquivo pelo teclado'))).toBe(true);
    expect(out.some((l) => l.kind === 'err')).toBe(true);
    expect(out.at(-1)?.kind).toBe('build-fail');
  });

  it('explica como gerar o relatório quando ele não existe', () => {
    expect(formatNoReport('pt')[1].text).toBe('Nenhum relatório do CI encontrado.');
    expect(formatNoReport('en')[1].text).toBe('No CI report found.');
  });
});

describe('cucumberToRun', () => {
  const ns = (ms: number) => ms * 1e6;
  const cucumberJson = [
    {
      name: 'Navegar pelos arquivos da IDE',
      uri: 'tests/e2e/features/navegacao.feature',
      elements: [
        { type: 'background', name: '', steps: [{ keyword: 'Dado ', name: 'que abri o site', result: { status: 'passed', duration: ns(300) } }] },
        {
          type: 'scenario',
          name: 'Abrir um arquivo',
          steps: [
            { keyword: 'Quando ', name: 'clico', result: { status: 'passed', duration: ns(100) } },
            { keyword: 'Então ', name: 'vejo', result: { status: 'passed', duration: ns(50) } },
          ],
        },
        { type: 'background', name: '', steps: [{ keyword: 'Dado ', name: 'que abri o site', result: { status: 'passed', duration: ns(200) } }] },
        {
          type: 'scenario',
          name: 'Trocar pelo teclado',
          steps: [
            { keyword: 'Quando ', name: 'pressiono', result: { status: 'failed', duration: ns(1000), error_message: 'Error: timeout\n  at x' } },
            { keyword: 'Então ', name: 'vejo', result: { status: 'skipped' } },
          ],
        },
      ],
    },
  ];

  it('soma o Contexto em cada cenário e converte nanossegundos', () => {
    const run = cucumberToRun(cucumberJson, { generatedAt: '2026-11-04T00:00:00.000Z', commit: 'abc1234' });
    expect(isRunReport(run)).toBe(true);
    const [ok, fail] = run.features[0].scenarios;
    expect(ok).toEqual({ name: 'Abrir um arquivo', status: 'passed', durationMs: 450, steps: { passed: 3, failed: 0, skipped: 0 } });
    expect(fail.status).toBe('failed');
    expect(fail.steps).toEqual({ passed: 1, failed: 1, skipped: 1 });
    expect(fail.error).toBe('Error: timeout');
    expect(run.durationMs).toBe(1650);
  });
});

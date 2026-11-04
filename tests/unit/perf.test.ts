import { describe, expect, it } from 'vitest';
import { capForScreen, fpsStats, hitTest, parseBugCount } from '../../src/lib/perf';

describe('parseBugCount', () => {
  it('lê números simples', () => {
    expect(parseBugCount('0')).toEqual({ kind: 'normal', value: 0 });
    expect(parseBugCount('500')).toEqual({ kind: 'normal', value: 500 });
  });

  it('limita a 1000 bugs', () => {
    expect(parseBugCount('5000')).toEqual({ kind: 'normal', value: 1000 });
  });

  it('reconhece um bilhão com ou sem separadores', () => {
    for (const raw of ['1000000000', '1.000.000.000', '1,000,000,000', '1 000 000 000', '99999999999']) {
      expect(parseBugCount(raw)).toEqual({ kind: 'billion' });
    }
  });

  it('recusa o que não é número', () => {
    expect(parseBugCount('')).toEqual({ kind: 'invalid' });
    expect(parseBugCount('-3')).toEqual({ kind: 'invalid' });
    expect(parseBugCount('mil')).toEqual({ kind: 'invalid' });
  });
});

describe('fpsStats', () => {
  it('calcula média, pior quadro e duração', () => {
    const s = fpsStats([20, 20, 20, 40]);
    expect(s.avg).toBe(40);
    expect(s.min).toBe(25);
    expect(s.seconds).toBe(0.1);
    expect(s.passed).toBe(true);
  });

  it('reprova abaixo de 30 fps', () => {
    expect(fpsStats([50, 50, 50]).passed).toBe(false);
  });

  it('não quebra sem quadros', () => {
    expect(fpsStats([])).toEqual({ avg: 0, min: 0, seconds: 0, passed: true });
  });
});

describe('capForScreen', () => {
  it('limita a 500 bugs no celular', () => {
    expect(capForScreen(1000, true)).toBe(500);
    expect(capForScreen(200, true)).toBe(200);
  });

  it('não limita em telas grandes', () => {
    expect(capForScreen(1000, false)).toBe(1000);
  });
});

describe('hitTest', () => {
  const bugs = [
    { x: 100, y: 100, alive: true },
    { x: 110, y: 100, alive: true },
    { x: 300, y: 300, alive: false },
  ];

  it('acerta o bug mais próximo do clique', () => {
    expect(hitTest(bugs, 108, 101)).toBe(1);
    expect(hitTest(bugs, 98, 99)).toBe(0);
  });

  it('ignora cliques longe e bugs já corrigidos', () => {
    expect(hitTest(bugs, 200, 200)).toBe(-1);
    expect(hitTest(bugs, 300, 300)).toBe(-1);
  });
});

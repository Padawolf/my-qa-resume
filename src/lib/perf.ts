/** Teste de performance da janela lateral: quantos bugs caem na tela e com quantos FPS. */

export const MAX_BUGS = 1000;
/** Em telas pequenas (celular) a chuva é limitada para não travar o aparelho. */
export const MOBILE_MAX_BUGS = 500;
/** Com movimento reduzido os bugs ficam parados na tela por este tempo. */
export const STATIC_MS = 3000;
/** Easter egg: a partir daqui o "sistema" cai de propósito. */
export const BILLION = 1_000_000_000;
/** Abaixo disso o teste reprova. */
export const MIN_FPS = 30;

export type BugCount = { kind: 'normal'; value: number } | { kind: 'billion' } | { kind: 'invalid' };

/** Lê o que a pessoa digitou. Aceita "1.000.000.000", "1,000,000,000" e "1 000 000 000". */
export function parseBugCount(raw: string): BugCount {
  const digits = raw.replace(/[\s.,_]/g, '');
  if (!/^\d+$/.test(digits)) return { kind: 'invalid' };
  const n = Number(digits);
  if (n >= BILLION) return { kind: 'billion' };
  return { kind: 'normal', value: Math.min(n, MAX_BUGS) };
}

export interface FpsStats {
  avg: number;
  min: number;
  seconds: number;
  passed: boolean;
}

/**
 * Recebe a duração de cada quadro em ms. O "mínimo" é o pior quadro, então um único
 * engasgo derruba o número, como num relatório de performance de verdade.
 */
export function fpsStats(frameMs: number[]): FpsStats {
  const valid = frameMs.filter((ms) => ms > 0 && Number.isFinite(ms));
  const total = valid.reduce((s, ms) => s + ms, 0);
  if (valid.length === 0 || total === 0) return { avg: 0, min: 0, seconds: 0, passed: true };
  const avg = Math.round((valid.length * 1000) / total);
  const min = Math.round(1000 / Math.max(...valid));
  return { avg, min, seconds: Math.round(total / 100) / 10, passed: avg >= MIN_FPS };
}

/** Quantos bugs a tela aguenta: no celular, no máximo MOBILE_MAX_BUGS. */
export function capForScreen(count: number, smallScreen: boolean): number {
  return smallScreen ? Math.min(count, MOBILE_MAX_BUGS) : count;
}

export interface Target {
  x: number;
  y: number;
  alive: boolean;
}

/** Índice do bug vivo mais próximo do clique, dentro do raio, ou -1 se o clique não acertou nenhum. */
export function hitTest(targets: Target[], x: number, y: number, radius = 20): number {
  let best = -1;
  let bestDist = radius * radius;
  targets.forEach((t, i) => {
    if (!t.alive) return;
    const d = (t.x - x) ** 2 + (t.y - y) ** 2;
    if (d <= bestDist) {
      best = i;
      bestDist = d;
    }
  });
  return best;
}

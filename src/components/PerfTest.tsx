import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { MAX_BUGS, MIN_FPS, STATIC_MS, capForScreen, fpsStats, hitTest, parseBugCount } from '../lib/perf';
import type { FpsStats } from '../lib/perf';
import { UI } from '../i18n/ui';
import type { Lang } from '../data/types';

interface Props {
  lang: Lang;
}

interface Bug {
  /** Posição desenhada no quadro atual (é a que o clique testa). */
  x: number;
  y: number;
  /** Coluna de origem; x oscila em volta dela. */
  x0: number;
  vy: number;
  amp: number;
  phase: number;
  color: string;
  /** Ainda caindo e clicável. */
  alive: boolean;
  /** Segundo em que foi corrigido, ou -1. */
  fixedAt: number;
}

type Result =
  | { status: 'idle' }
  | { status: 'invalid' }
  | { status: 'done'; bugs: number; fixed: number; stats: FpsStats; notes: string[] };

// Mesmas cores do tema (src/styles/ide.css).
const COLORS = ['#ff6b6b', '#55ff55', '#ffff55', '#55ffff', '#ff7cff', '#ffb86c'];
const GLYPH = 'Ж';
const FIXED_GLYPH = '✔';
/** Quanto tempo o ✔ fica no lugar do bug corrigido. */
const SPLAT_S = 0.4;
/** Raio do acerto em px: um pouco maior que o desenho do bug, porque ele está em movimento. */
const HIT_RADIUS = 24;
const SMALL_SCREEN = '(max-width: 860px)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export default function PerfTest({ lang }: Props) {
  const t = UI[lang];
  const [raw, setRaw] = useState('100');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Result>({ status: 'idle' });
  const [crash, setCrash] = useState(false);
  // Portais só depois da hidratação (no build não existe document.body).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const crashRef = useRef<HTMLDivElement>(null);
  /** Encerra a chuva em andamento: para a animação, solta o clique e limpa a tela. */
  const cancelRain = useRef<(() => void) | null>(null);

  const parsed = parseBugCount(raw);
  const slider = parsed.kind === 'normal' ? parsed.value : parsed.kind === 'billion' ? MAX_BUGS : 0;
  const fmt = (n: number) => n.toLocaleString(t.htmlLang);

  const stop = useCallback(() => {
    cancelRain.current?.();
    cancelRain.current = null;
    setRunning(false);
  }, []);
  useEffect(() => () => cancelRain.current?.(), []);

  /* ---------- A chuva de bugs ---------- */
  const rain = (count: number, reduced: boolean, notes: string[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = "26px 'VT323', 'Courier New', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Velocidade proporcional à altura da tela: a chuva dura uns 2 a 4 segundos em qualquer aparelho.
    // Com movimento reduzido os bugs já nascem espalhados pela tela e não se mexem.
    const bugs: Bug[] = Array.from({ length: count }, () => {
      const x0 = Math.random() * w;
      return {
        x: x0,
        x0,
        y: reduced ? 30 + Math.random() * (h - 60) : -20 - Math.random() * h * 0.5,
        vy: reduced ? 0 : h * (0.35 + Math.random() * 0.45),
        amp: reduced ? 0 : 4 + Math.random() * 14,
        phase: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alive: true,
        fixedAt: -1,
      };
    });

    const frames: number[] = [];
    let fixed = 0;
    let elapsed = 0;
    let last = 0;
    let lastHud = -Infinity;
    let raf = 0;

    // O acerto é testado ao apertar o botão (pointerdown), não ao soltar (click): num clique de
    // ~100 ms um bug caindo já andou 30 a 70 px e sairia de baixo do cursor.
    // Se acertou, o clique que vem depois é engolido para não abrir o que estiver embaixo.
    // O botão Parar sempre funciona.
    let swallowClick = false;
    const onPointerDown = (e: PointerEvent) => {
      if (!e.isPrimary || e.button !== 0) return;
      if ((e.target as Element | null)?.closest?.('[data-testid="perf-run"]')) return;
      const i = hitTest(bugs, e.clientX, e.clientY, HIT_RADIUS);
      if (i < 0) return;
      e.preventDefault(); // também evita começar uma seleção de texto no editor
      e.stopPropagation();
      swallowClick = true;
      bugs[i].alive = false;
      bugs[i].fixedAt = elapsed;
      fixed++;
    };
    const onClick = (e: MouseEvent) => {
      if (!swallowClick) return;
      swallowClick = false;
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('click', onClick, true);

    const cancel = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', onPointerDown, true);
      // O clique engolido pode chegar logo depois do fim da chuva.
      window.setTimeout(() => window.removeEventListener('click', onClick, true), 600);
      ctx.clearRect(0, 0, w, h);
    };
    cancelRain.current = cancel;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 250);
      last = now;
      elapsed += dt / 1000;
      frames.push(dt);

      ctx.clearRect(0, 0, w, h);
      let pending = 0;
      for (const b of bugs) {
        if (b.fixedAt >= 0) {
          if (elapsed - b.fixedAt < SPLAT_S) {
            pending++;
            ctx.fillStyle = COLORS[1];
            ctx.fillText(FIXED_GLYPH, b.x, b.y);
          }
          continue;
        }
        if (!b.alive) continue;
        b.y += (b.vy * dt) / 1000;
        if (b.y > h + 30) {
          b.alive = false; // foi para produção
          continue;
        }
        pending++;
        b.x = b.x0 + Math.sin(elapsed * 3 + b.phase) * b.amp;
        if (b.y < -30) continue;
        ctx.fillStyle = b.color;
        ctx.fillText(GLYPH, b.x, b.y);
      }

      if (now - lastHud > 250 && hudRef.current) {
        lastHud = now;
        hudRef.current.textContent = t.perfHud(fpsStats(frames.slice(-30)).avg, fixed);
      }

      const done = reduced ? elapsed * 1000 >= STATIC_MS : pending === 0;
      if (!done) {
        raf = requestAnimationFrame(tick);
        return;
      }
      cancel();
      cancelRain.current = null;
      setRunning(false);
      // O primeiro quadro mede o tempo até a chuva começar, não a chuva em si.
      setResult({ status: 'done', bugs: count, fixed, stats: fpsStats(frames.slice(1)), notes });
    };
    raf = requestAnimationFrame((now) => {
      last = now;
      tick(now);
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (running) {
      stop();
      return;
    }
    if (parsed.kind === 'invalid') {
      setResult({ status: 'invalid' });
      return;
    }
    if (parsed.kind === 'billion') {
      setCrash(true);
      return;
    }
    const count = capForScreen(parsed.value, window.matchMedia(SMALL_SCREEN).matches);
    const reduced = window.matchMedia(REDUCED_MOTION).matches;
    const notes: string[] = [];
    if (count < parsed.value) notes.push(t.perfMobileCap(fmt(count)));
    if (reduced) notes.push(t.perfReduced);

    setRaw(String(count));
    setRunning(true);
    setResult({ status: 'idle' });
    rain(count, reduced, notes);
  };

  /* ---------- Easter egg: a tela preta ---------- */
  const closeCrash = useCallback(() => {
    setCrash(false);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!crash) return;
    crashRef.current?.focus();
    // Na fase de captura, para que F1/F9/Esc não acionem a IDE "por trás" da tela preta.
    const onKey = (e: KeyboardEvent) => {
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      closeCrash();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [crash, closeCrash]);

  return (
    <section className="win perf" aria-label={t.perfTitle} data-testid="perf">
      <span className="wbtn l" aria-hidden="true">
        [<b>■</b>]
      </span>
      <span className="wtitle">{t.perfTitle}</span>

      <form onSubmit={onSubmit}>
        <div className="perf-row">
          <label htmlFor="perf-range">{t.perfLabel}</label>
          <input
            ref={inputRef}
            className="perf-num"
            type="text"
            inputMode="numeric"
            aria-label={t.perfAmount}
            data-testid="perf-count"
            value={raw}
            disabled={running}
            onChange={(e) => setRaw(e.target.value)}
          />
        </div>
        <input
          id="perf-range"
          type="range"
          min={0}
          max={MAX_BUGS}
          step={10}
          value={slider}
          disabled={running}
          onChange={(e) => setRaw(e.target.value)}
        />
        <div className="perf-scale" aria-hidden="true">
          <span>0</span>
          <span>{fmt(MAX_BUGS)}</span>
        </div>
        <p className="perf-hint">
          {t.perfHint}
          <br />
          {t.perfHintFix}
        </p>
        <button type="submit" className="run" data-testid="perf-run">
          {running ? `■ ${t.perfStop}` : `▶ ${t.perfRun}`}
        </button>
      </form>

      <pre className="out perf-out" data-testid="perf-output" aria-live="polite">
        {running && <span className="o-info">{t.perfRunning(fmt(slider))}</span>}
        {!running && result.status === 'idle' && <span className="o-info">{t.perfIdle}</span>}
        {!running && result.status === 'invalid' && <span className="o-err">{t.perfInvalid}</span>}
        {!running && result.status === 'done' && (
          <>
            <span className="o-cmd">{`> perf --bugs ${result.bugs}`}</span>
            {'\n'}
            <span className="o-info">{t.perfSummary(fmt(result.bugs), result.stats.seconds.toLocaleString(t.htmlLang))}</span>
            {'\n'}
            <span className="o-info">{t.perfFps(result.stats.avg, result.stats.min)}</span>
            {'\n'}
            <span className={result.fixed > 0 ? 'o-ok' : 'o-info'}>
              {t.perfFixed(fmt(result.fixed), fmt(result.bugs - result.fixed))}
            </span>
            {'\n'}
            <span className={result.stats.passed ? 'o-build-ok' : 'o-build-fail'}>
              {result.stats.passed ? `✔ ${t.perfPassed(MIN_FPS)}` : `✘ ${t.perfFailed(MIN_FPS)}`}
            </span>
            {result.notes.map((note) => (
              <span key={note} className="o-skip">
                {'\n'}
                {note}
              </span>
            ))}
          </>
        )}
      </pre>

      {mounted && createPortal(<canvas ref={canvasRef} className="bug-rain" aria-hidden="true" />, document.body)}

      {/* FPS ao vivo. O texto é trocado direto no DOM a cada 250 ms, sem re-renderizar o React. */}
      {mounted &&
        running &&
        createPortal(<div ref={hudRef} className="perf-hud" data-testid="perf-hud" aria-hidden="true" />, document.body)}

      {mounted &&
        crash &&
        createPortal(
          <div
            ref={crashRef}
            className="crash"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="crash-title"
            aria-describedby="crash-body"
            tabIndex={-1}
            data-testid="crash"
            onClick={closeCrash}
          >
            <div className="crash-box">
              <h2 id="crash-title">{t.crashTitle}</h2>
              <div id="crash-body">
                {t.crashBody.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <pre className="crash-scenario">{t.crashScenario}</pre>
              </div>
              <p className="crash-key">
                {t.crashKey}
                <span className="cursor" aria-hidden="true" />
              </p>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}

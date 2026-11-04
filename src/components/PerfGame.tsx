import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent, PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { MAX_BUGS, MIN_FPS, STATIC_MS, capForScreen, fpsStats, hitTest, parseBugCount } from '../lib/perf';
import type { FpsStats } from '../lib/perf';
import { UI } from '../i18n/ui';
import type { Lang } from '../data/types';

interface Props {
  lang: Lang;
  onClose: () => void;
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

interface Game {
  bugs: Bug[];
  fixed: number;
  elapsed: number;
  cancel: () => void;
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

/** O teste de performance como um joguinho: os bugs caem dentro de uma janela modal. */
export default function PerfGame({ lang, onClose }: Props) {
  const t = UI[lang];
  const [raw, setRaw] = useState('100');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Result>({ status: 'idle' });
  const [crash, setCrash] = useState(false);

  const areaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const crashRef = useRef<HTMLDivElement>(null);
  const game = useRef<Game | null>(null);
  const crashOpen = useRef(false);
  crashOpen.current = crash;

  const parsed = parseBugCount(raw);
  const slider = parsed.kind === 'normal' ? parsed.value : parsed.kind === 'billion' ? MAX_BUGS : 0;
  const fmt = (n: number) => n.toLocaleString(t.htmlLang);

  const stop = useCallback(() => {
    game.current?.cancel();
    game.current = null;
    setRunning(false);
  }, []);
  useEffect(() => () => game.current?.cancel(), []);

  const close = useCallback(() => {
    stop();
    onClose();
  }, [stop, onClose]);

  /* ---------- Teclado: Esc fecha, e a IDE por trás não recebe atalhos ---------- */
  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (crashOpen.current) return; // a tela preta cuida das próprias teclas
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close();
      } else if (e.key === 'F1' || e.key === 'F9' || e.altKey) {
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [close]);

  /* ---------- A chuva de bugs ---------- */
  const rain = (count: number, reduced: boolean, notes: string[]) => {
    const canvas = canvasRef.current;
    const area = areaRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !area || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = area.clientWidth;
    const h = area.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = "26px 'VT323', 'Courier New', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Velocidade proporcional à altura da área: a chuva dura uns 2 a 4 segundos em qualquer tela.
    // Com movimento reduzido os bugs já nascem espalhados e não se mexem.
    const bugs: Bug[] = Array.from({ length: count }, () => {
      const x0 = 12 + Math.random() * (w - 24);
      return {
        x: x0,
        x0,
        y: reduced ? 20 + Math.random() * (h - 40) : -20 - Math.random() * h * 0.5,
        vy: reduced ? 0 : h * (0.35 + Math.random() * 0.45),
        amp: reduced ? 0 : 4 + Math.random() * 14,
        phase: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alive: true,
        fixedAt: -1,
      };
    });

    const frames: number[] = [];
    let last = 0;
    let lastHud = -Infinity;
    let raf = 0;
    const g: Game = {
      bugs,
      fixed: 0,
      elapsed: 0,
      cancel: () => {
        cancelAnimationFrame(raf);
        ctx.clearRect(0, 0, w, h);
      },
    };
    game.current = g;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 250);
      last = now;
      g.elapsed += dt / 1000;
      frames.push(dt);

      ctx.clearRect(0, 0, w, h);
      let pending = 0;
      let escaped = 0;
      for (const b of bugs) {
        if (b.fixedAt >= 0) {
          if (g.elapsed - b.fixedAt < SPLAT_S) {
            pending++;
            ctx.fillStyle = COLORS[1];
            ctx.fillText(FIXED_GLYPH, b.x, b.y);
          }
          continue;
        }
        if (!b.alive) {
          escaped++;
          continue;
        }
        b.y += (b.vy * dt) / 1000;
        if (b.y > h + 20) {
          b.alive = false; // foi para produção
          escaped++;
          continue;
        }
        pending++;
        b.x = b.x0 + Math.sin(g.elapsed * 3 + b.phase) * b.amp;
        if (b.y < -20) continue;
        ctx.fillStyle = b.color;
        ctx.fillText(GLYPH, b.x, b.y);
      }

      if (now - lastHud > 250 && hudRef.current) {
        lastHud = now;
        hudRef.current.textContent = t.perfHud(fpsStats(frames.slice(-30)).avg, g.fixed, escaped);
      }

      const done = reduced ? g.elapsed * 1000 >= STATIC_MS : pending === 0;
      if (!done) {
        raf = requestAnimationFrame(tick);
        return;
      }
      g.cancel();
      game.current = null;
      setRunning(false);
      // O primeiro quadro mede o tempo até a chuva começar, não a chuva em si.
      setResult({ status: 'done', bugs: count, fixed: g.fixed, stats: fpsStats(frames.slice(1)), notes });
    };
    raf = requestAnimationFrame((now) => {
      last = now;
      tick(now);
    });
  };

  // O acerto é testado ao apertar (pointerdown), não ao soltar: num clique de ~100 ms
  // um bug caindo já andou 30 a 70 px e sairia de baixo do cursor.
  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const g = game.current;
    if (!g || !e.isPrimary) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const i = hitTest(g.bugs, e.clientX - rect.left, e.clientY - rect.top, HIT_RADIUS);
    if (i < 0) return;
    e.preventDefault();
    g.bugs[i].alive = false;
    g.bugs[i].fixedAt = g.elapsed;
    g.fixed++;
  };

  const start = () => {
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
    if (hudRef.current) hudRef.current.textContent = t.perfHud(0, 0, 0);
    rain(count, reduced, notes);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (running) stop();
    else start();
  };

  /* ---------- Easter egg: a tela preta ---------- */
  const closeCrash = useCallback(() => {
    setCrash(false);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!crash) return;
    crashRef.current?.focus();
    // Na fase de captura, para que F1/F9/Esc não acionem nada "por trás" da tela preta.
    const onKey = (e: KeyboardEvent) => {
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      closeCrash();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [crash, closeCrash]);

  return createPortal(
    <div className="overlay game-overlay">
      <div className="win dialog game" role="dialog" aria-modal="true" aria-labelledby="game-title" data-testid="perf-game">
        <span className="wbtn l" aria-hidden="true">
          [<b>■</b>]
        </span>
        <span className="wtitle" id="game-title">
          {t.perfGameTitle}
        </span>

        <form className="game-controls" onSubmit={onSubmit}>
          <label htmlFor="perf-range">{t.perfLabel}</label>
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
          <button type="submit" className="run" data-testid="perf-run">
            {running ? `■ ${t.perfStop}` : `▶ ${t.perfRun}`}
          </button>
        </form>
        <p className="perf-hint">
          {t.perfHint} {t.perfHintFix}
        </p>

        <div className="game-area" ref={areaRef}>
          <canvas ref={canvasRef} className="game-canvas" aria-hidden="true" onPointerDown={onPointerDown} />
          {/* Placar ao vivo. O texto é trocado direto no DOM a cada 250 ms, sem re-renderizar o React. */}
          <div ref={hudRef} className="game-hud" data-testid="perf-hud" aria-hidden="true" hidden={!running} />

          {!running && (
            <div className="game-screen">
              <pre className="out perf-out" data-testid="perf-output" aria-live="polite">
                {result.status === 'idle' && (
                  <>
                    <span className="game-logo">{GLYPH} BUG RAIN {GLYPH}</span>
                    {'\n\n'}
                    <span className="o-info">{t.perfIdle}</span>
                  </>
                )}
                {result.status === 'invalid' && <span className="o-err">{t.perfInvalid}</span>}
                {result.status === 'done' && (
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
            </div>
          )}
        </div>

        <div className="actions">
          <button type="button" className="ok" data-testid="perf-close" onClick={close}>
            [ {t.perfClose} ]
          </button>
        </div>
      </div>

      {crash && (
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
        </div>
      )}
    </div>,
    document.body,
  );
}

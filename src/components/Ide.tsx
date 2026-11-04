import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import type { IdeFile, Lang } from '../data/types';
import { highlight } from '../lib/highlight';
import { formatNoReport, formatRun, isRunReport } from '../lib/report';
import type { OutLine, RunReport } from '../lib/report';
import { UI } from '../i18n/ui';
import PerfTest from './PerfTest';

interface Props {
  lang: Lang;
  files: IdeFile[];
  /** import.meta.env.BASE_URL: "/" localmente, "/<repositorio>/" no GitHub Pages. */
  base: string;
}

type ReportState = { status: 'loading' } | { status: 'none' } | { status: 'ready'; report: RunReport };
type Phase = 'idle' | 'running' | 'done';

export default function Ide({ lang, files, base }: Props) {
  const t = UI[lang];
  const baseUrl = base.endsWith('/') ? base : base + '/';
  const contentFiles = useMemo(() => files.filter((f) => f.dir === 'features'), [files]);

  const [currentId, setCurrentId] = useState(files[0]?.id ?? '');
  const [cursor, setCursor] = useState<{ line: number; col: number } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [report, setReport] = useState<ReportState>({ status: 'loading' });
  const [out, setOut] = useState<OutLine[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const timers = useRef<number[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const okRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const current = files.find((f) => f.id === currentId) ?? files[0];
  const lines = useMemo(() => highlight(current.text, current.kind), [current]);
  const tabs = contentFiles.some((f) => f.id === current.id) ? contentFiles : [...contentFiles, current];

  /* ---------- Arquivos e #hash ---------- */
  const open = useCallback(
    (id: string) => {
      if (!files.some((f) => f.id === id)) return;
      setCurrentId(id);
      setCursor(null);
      setMenuOpen(false);
      try {
        history.replaceState(null, '', '#' + id);
      } catch {
        /* alguns ambientes bloqueiam history: o arquivo abre do mesmo jeito */
      }
    },
    [files],
  );

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (id && files.some((f) => f.id === id)) {
        setCurrentId(id);
        setCursor(null);
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [files]);

  /* ---------- Relatório do CI ---------- */
  useEffect(() => {
    let alive = true;
    fetch(baseUrl + 'last-run.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((data: unknown) => {
        if (!alive) return;
        if (isRunReport(data)) {
          setReport({ status: 'ready', report: data });
          setOut(formatRun(data, lang));
        } else {
          setReport({ status: 'none' });
          setOut(formatNoReport(lang));
        }
      });
    return () => {
      alive = false;
    };
  }, [baseUrl, lang]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const run = useCallback(() => {
    if (phase === 'running' || report.status === 'loading') return;
    const all = report.status === 'ready' ? formatRun(report.report, lang) : formatNoReport(lang);
    clearTimers();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setOut(all);
      setPhase('done');
      return;
    }
    setPhase('running');
    setOut([]);
    let delay = 0;
    all.forEach((line, i) => {
      delay += line.kind === 'ok' || line.kind === 'fail' ? 70 : 140;
      timers.current.push(
        window.setTimeout(() => {
          setOut(all.slice(0, i + 1));
          if (i === all.length - 1) setPhase('done');
        }, delay),
      );
    });
  }, [phase, report, lang]);

  /* ---------- Ajuda ---------- */
  const openHelp = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setMenuOpen(false);
    setHelpOpen(true);
  }, []);
  const closeHelp = useCallback(() => {
    setHelpOpen(false);
    lastFocus.current?.focus?.();
  }, []);
  useEffect(() => {
    if (helpOpen) okRef.current?.focus();
  }, [helpOpen]);

  /* ---------- Menu Arquivo ---------- */
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    return () => document.removeEventListener('click', onDoc);
  }, [menuOpen]);

  const onMenuKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
    const idx = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = e.key === 'ArrowDown' ? (idx + 1) % items.length : (idx - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  /* ---------- Teclado global ---------- */
  const latest = useRef({ run, open, openHelp, closeHelp, contentFiles, helpOpen });
  latest.current = { run, open, openHelp, closeHelp, contentFiles, helpOpen };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const l = latest.current;
      if (e.key === 'F9') {
        e.preventDefault();
        l.run();
      } else if (e.key === 'F1') {
        e.preventDefault();
        l.openHelp();
      } else if (e.key === 'Escape') {
        setMenuOpen(false);
        if (l.helpOpen) l.closeHelp();
      } else if (e.altKey && /^Digit[1-9]$/.test(e.code)) {
        const file = l.contentFiles[Number(e.code.slice(5)) - 1];
        if (file) {
          e.preventDefault();
          l.open(file.id);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ---------- Idioma ---------- */
  const otherHref = baseUrl + (t.otherLangCode === 'en' ? 'en/' : '');
  const switchLang = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = otherHref + window.location.hash;
  };

  const stateLabel =
    phase === 'running'
      ? t.stateRunning
      : phase === 'done'
        ? t.stateDone
        : report.status === 'loading'
          ? t.stateLoading
          : report.status === 'none'
            ? t.stateNone
            : t.stateLast;

  const pos = cursor ?? { line: 1, col: 1 };

  const fileButton = (f: IdeFile) => (
    <li key={f.id}>
      <button
        type="button"
        className={'file ' + (f.kind === 'ts' ? 'ext-ts' : 'ext-f')}
        aria-current={f.id === current.id ? 'true' : undefined}
        onClick={() => open(f.id)}
      >
        {f.name}
      </button>
    </li>
  );

  return (
    <div className="ide" data-ready={ready ? 'true' : 'false'}>
      <nav className="menubar" aria-label="Menu">
        <div className="item" ref={menuRef}>
          <button
            type="button"
            className="m"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls="menu-file"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
          >
            <span className="hk">{t.menuFile[0]}</span>
            {t.menuFile.slice(1)}
          </button>
          {menuOpen && (
            <div className="dropdown" id="menu-file" role="menu" onKeyDown={onMenuKey}>
              {contentFiles.map((f, i) => (
                <button key={f.id} type="button" role="menuitem" onClick={() => open(f.id)}>
                  <span>{f.name}</span>
                  <span>Alt+{i + 1}</span>
                </button>
              ))}
              <hr />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  run();
                }}
              >
                <span>{t.runAll}</span>
                <span>F9</span>
              </button>
            </div>
          )}
        </div>
        <button type="button" className="m" onClick={run}>
          {t.menuRun}
        </button>
        <button type="button" className="m" onClick={openHelp}>
          {t.menuHelp}
        </button>
        <a className="m lang" href={otherHref} hrefLang={t.otherLangCode} lang={t.otherLangCode} onClick={switchLang}>
          ⇄ {t.otherLang}
        </a>
        <span className="brand">natalia-pandolfi-qa · Turbo Gherkin 2.0</span>
      </nav>

      <main className="desk">
        <div className="side">
          <aside className="win proj" aria-label={t.project}>
            <span className="wbtn l" aria-hidden="true">
              [<b>■</b>]
            </span>
            <span className="wtitle">{t.project}</span>
            <ul className="tree">
              <li>
                <span className="dir">natalia-pandolfi-qa/</span>
                <ul>
                  <li>
                    <span className="dir">features/</span>
                    <ul>{contentFiles.map(fileButton)}</ul>
                  </li>
                  <li>
                    <span className="dir" title={t.e2eHint}>
                      e2e/ <span className="badge">CI</span>
                    </span>
                    <ul>{files.filter((f) => f.dir === 'e2e').map(fileButton)}</ul>
                  </li>
                  <li>
                    <span className="dir">steps/</span>
                    <ul>{files.filter((f) => f.dir === 'steps').map(fileButton)}</ul>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="card">
              <p className="name">Natalia Pandolfi</p>
              <p>
                {t.role}
                <br />
                {t.company}
              </p>
              <div className="tags">
                <span>@web</span>
                <span>@mobile</span>
                <span>@api</span>
                <span>@performance</span>
              </div>
            </div>
          </aside>
          <PerfTest lang={lang} />
        </div>

        <section className="win editor" aria-label={t.editor}>
          <span className="wbtn l" aria-hidden="true">
            [<b>■</b>]
          </span>
          <span className="wtitle" data-testid="editor-title">
            {current.name}
          </span>
          <span className="wbtn r" aria-hidden="true">
            1 [↕]
          </span>
          <div className="tabs" role="tablist" aria-label={t.files}>
            {tabs.map((f, i) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                id={'tab-' + f.id}
                aria-selected={f.id === current.id}
                aria-controls="code"
                onClick={() => open(f.id)}
              >
                {f.dir === 'features' ? `${i + 1} ` : ''}
                {f.name}
              </button>
            ))}
          </div>
          <div className="code" id="code" role="tabpanel" aria-labelledby={'tab-' + current.id} data-testid="code" tabIndex={0}>
            {lines.map((l, i) => (
              <div
                key={current.id + ':' + i}
                className={'ln' + (l.table ? ' tbl' : '') + (cursor?.line === i + 1 ? ' cur' : '')}
                onClick={() => setCursor({ line: i + 1, col: (l.text.match(/^\s*/)?.[0].length ?? 0) + 1 })}
              >
                <span className="g" aria-hidden="true">
                  {i + 1}
                </span>
                <span
                  className="t"
                  dangerouslySetInnerHTML={{
                    __html: (l.html || ' ') + (i === lines.length - 1 ? '<span class="cursor" aria-hidden="true"></span>' : ''),
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="win output" aria-label={t.output}>
          <span className="wtitle">{t.output}</span>
          <div className="bar">
            <span data-testid="run-state">{stateLabel}</span>
            <span className="bar-actions">
              {report.status === 'ready' && report.report.runUrl && (
                <a href={report.report.runUrl} target="_blank" rel="noopener">
                  {t.viewRun}
                </a>
              )}
              <button type="button" className="run" data-testid="run-btn" onClick={run} disabled={phase === 'running'}>
                ▶ {t.run} <span className="hk">F9</span>
              </button>
            </span>
          </div>
          <pre className="out" data-testid="output" aria-live="polite" aria-busy={phase === 'running'}>
            {out.map((l, i) => (
              <span key={i} className={'o-' + l.kind}>
                {l.text}
                {'\n'}
              </span>
            ))}
          </pre>
        </section>
      </main>

      <footer className="status">
        <button type="button" onClick={openHelp}>
          <span className="hk">F1</span> {t.help}
        </button>
        <button type="button" onClick={run}>
          <span className="hk">F9</span> {t.run}
        </button>
        <span className="opt">
          <span className="hk">Alt+1…5</span> {t.files}
        </span>
        <span className="right">
          <span className="opt">{current.kind === 'ts' ? t.tsLabel : t.langLabel}</span>
          <span className="pos">{t.position(pos.line, pos.col)}</span>
        </span>
      </footer>

      {helpOpen && (
        <div
          className="overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeHelp();
          }}
        >
          <div className="win dialog" role="dialog" aria-modal="true" aria-labelledby="help-title">
            <span className="wbtn l" aria-hidden="true">
              [<b>■</b>]
            </span>
            <span className="wtitle">{t.help}</span>
            <h2 id="help-title">{t.helpTitle}</h2>
            {t.helpBody.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="keys">{t.helpKeys}</p>
            <div className="actions">
              <button type="button" className="ok" ref={okRef} onClick={closeHelp}>
                [ {t.ok} ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

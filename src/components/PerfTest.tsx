import { useCallback, useEffect, useRef, useState } from 'react';
import PerfGame from './PerfGame';
import { UI } from '../i18n/ui';
import type { Lang } from '../data/types';

interface Props {
  lang: Lang;
}

/** Janela da coluna lateral: só apresenta o teste e abre o joguinho num modal. */
export default function PerfTest({ lang }: Props) {
  const t = UI[lang];
  const [open, setOpen] = useState(false);
  const openRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Ao fechar o modal, o foco volta para o botão que o abriu.
  useEffect(() => {
    if (wasOpen.current && !open) openRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <section className="win perf" aria-label={t.perfTitle} data-testid="perf">
      <span className="wbtn l" aria-hidden="true">
        [<b>■</b>]
      </span>
      <span className="wtitle">{t.perfTitle}</span>
      <p className="perf-intro">{t.perfIntro}</p>
      <button
        ref={openRef}
        type="button"
        className="run"
        data-testid="perf-open"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        ▶ {t.perfOpen}
      </button>
      {open && <PerfGame lang={lang} onClose={close} />}
    </section>
  );
}

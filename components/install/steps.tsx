/**
 * Passos numerados de um guia. O marcador é o hexágono da marca, com o número
 * dentro; uma linha fina liga os passos. A numeração é do `<ol>` (a lista já
 * é ordenada para o leitor de tela), o hexágono só a repete visualmente.
 */
export function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="space-y-8">{children}</ol>;
}

export function Step({ n, title, children, last = false }: { n: number; title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <li className="relative flex gap-4 sm:gap-5">
      <div className="flex flex-col items-center">
        <span aria-hidden="true" className="relative flex size-10 shrink-0 items-center justify-center">
          <svg viewBox="0 0 48 48" className="absolute inset-0 size-full">
            <path d="M13 3.5h22L46 24 35 44.5H13L2 24z" fill="var(--color-amber)" stroke="var(--color-amber)" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <span className="relative font-display text-[15px] font-bold text-ink-900">{n}</span>
        </span>
        {!last && <span aria-hidden="true" className="mt-2 w-px flex-1 bg-line-strong" />}
      </div>
      <div className="min-w-0 flex-1 space-y-3 pb-1">
        <h3 className="pt-1.5 font-display text-lg font-semibold tracking-[-0.02em] text-ink">{title}</h3>
        {children}
      </div>
    </li>
  );
}

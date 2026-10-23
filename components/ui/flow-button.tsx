"use client";

import { ArrowRight } from "lucide-react";

interface FlowButtonProps {
  children: React.ReactNode;
  /** Com `href` vira um link (`<a>`), sem ele um `<button>`. */
  href?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Botão "flow": no hover o círculo de cor cresce do centro e engole o botão
 * (que também troca a pílula por um retângulo de cantos suaves), a seta de
 * dentro sai pela direita e outra entra pela esquerda, e o texto desliza.
 *
 * Portado do componente do 21st.dev com duas adaptações:
 * - o preenchimento do hover é o âmbar da marca (`bg-amber`, #ffb800), não o
 *   preto — por isso o texto e as setas ficam escuros no hover (branco sobre
 *   âmbar não passa no contraste);
 * - as cores de repouso (#111, #333) viram tokens do tema (`ink`), para o botão
 *   funcionar tanto sobre a navbar clara quanto sobre a escura.
 *
 * O teclado ganha o mesmo efeito do mouse (`group-focus-visible`) e, com
 * `prefers-reduced-motion`, as transições são cortadas.
 */
export function FlowButton({ children, href, onClick, className = "" }: FlowButtonProps) {
  const classes = `group relative flex cursor-pointer items-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] border-ink/40 bg-transparent px-8 py-3 text-sm font-semibold text-ink transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] hover:border-transparent hover:text-ink-900 focus-visible:rounded-[12px] focus-visible:border-transparent focus-visible:text-ink-900 active:scale-[0.95] motion-reduce:transition-none ${className}`;

  const content = (
    <>
      {/* Seta da esquerda: espera fora do botão e entra no hover. */}
      <ArrowRight
        aria-hidden="true"
        className="absolute left-[-25%] z-[9] size-4 fill-none stroke-ink transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-4 group-hover:stroke-ink-900 group-focus-visible:left-4 group-focus-visible:stroke-ink-900 motion-reduce:transition-none"
      />

      <span className="relative z-[1] -translate-x-3 transition-all duration-[800ms] ease-out group-hover:translate-x-3 group-focus-visible:translate-x-3 motion-reduce:transition-none">
        {children}
      </span>

      {/* O círculo âmbar que cresce do centro. */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-amber opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:size-[220px] group-hover:opacity-100 group-focus-visible:size-[220px] group-focus-visible:opacity-100 motion-reduce:transition-none"
      />

      {/* Seta da direita: sai pela borda no hover. */}
      <ArrowRight
        aria-hidden="true"
        className="absolute right-4 z-[9] size-4 fill-none stroke-ink transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:right-[-25%] group-hover:stroke-ink-900 group-focus-visible:right-[-25%] group-focus-visible:stroke-ink-900 motion-reduce:transition-none"
      />
    </>
  );

  if (href !== undefined) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}

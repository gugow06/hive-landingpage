"use client";

import { useRef } from "react";
import { useOffscreenPause } from "@/lib/motion";

interface ShinyButtonProps {
  children: React.ReactNode;
  /** Com `href` vira um link (`<a>`), sem ele um `<button>`. */
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  /** `lg` é o tamanho do original (hero); `md` e `sm` para menus e barras. */
  size?: "lg" | "md" | "sm";
  className?: string;
}

/**
 * Botão com a borda de luz girando: um feixe âmbar (`conic-gradient`) percorre
 * o contorno, uma camada de pontinhos aparece só perto dele e, no hover ou no
 * foco, o feixe se alarga e um halo respira por dentro. O desenho todo está em
 * `.shiny-cta` (globals.css) — aqui só há a marcação e a pausa fora da tela.
 *
 * Portado do botão "shiny" do 21st.dev: o azul virou o âmbar da marca
 * (`--shiny-cta-highlight`), a fonte é a da página (sem `@import` do Google
 * Fonts) e a animação para quando o botão sai da tela e com
 * `prefers-reduced-motion`. O `<span>` interno é necessário: o halo é o
 * `::before` dele.
 */
export function ShinyButton({ children, href, onClick, type = "button", size = "lg", className = "" }: ShinyButtonProps) {
  const ref = useRef<HTMLElement>(null);
  useOffscreenPause(ref);
  const classes = `shiny-cta ${className}`;
  const inner = <span>{children}</span>;

  if (href !== undefined) {
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} onClick={onClick} data-size={size} className={classes}>
        {inner}
      </a>
    );
  }
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} type={type} onClick={onClick} data-size={size} className={classes}>
      {inner}
    </button>
  );
}

import { useEffect, type RefObject } from "react";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * A linguagem de movimento da página, num lugar só. Toda revelação usa estes
 * valores; os equivalentes em CSS estão em `globals.css` (`--ease-out`,
 * `--duration-*`).
 */
export const MOTION = {
  duration: 0.6,
  y: 16,
  stagger: 0.07,
  ease: "power2.out",
  /** Onde a revelação dispara: o topo do bloco a 85% da altura da tela. */
  start: "top 85%",
} as const;

/**
 * Marca o elemento com `data-offscreen` enquanto ele está fora da tela. O CSS
 * usa a marca para pausar as animações contínuas (`.bob`, `.beam-pulse`) — o
 * navegador não precisa redesenhar o que ninguém vê.
 */
export function useOffscreenPause(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver !== "function") return;
    node.setAttribute("data-offscreen", "");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) node.removeAttribute("data-offscreen");
      else node.setAttribute("data-offscreen", "");
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
}

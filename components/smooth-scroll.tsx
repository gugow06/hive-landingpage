"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** Altura da navbar fixa — o alvo da âncora para logo abaixo dela (WCAG 2.4.11). */
const HEADER = 96;

/**
 * Scroll suave (Lenis) costurado ao ScrollTrigger do GSAP, para as revelações
 * dispararem no deslocamento interpolado e não no nativo.
 *
 * Com `prefers-reduced-motion` nada é instalado: o scroll nativo é a
 * experiência correta, e tomá-lo de quem pediu menos movimento quebraria tanto
 * o conforto quanto a navegação por teclado.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let destroy = () => {};
    let cancelled = false;

    void Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
        // Âncoras (#faq, #lista…) precisam continuar funcionando sob o Lenis.
        const onAnchor = (event: MouseEvent) => {
          const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
            'a[href^="#"]',
          );
          const id = link?.getAttribute("href");
          if (!link || !id || id === "#") return;
          const target = document.querySelector(id);
          if (!target) return;
          event.preventDefault();
          // Posição absoluta calculada aqui: o `offset` do Lenis já rendeu
          // um destino 96px fora do lugar, e a conta explícita não tem dúvida.
          const top = target.getBoundingClientRect().top + window.scrollY - HEADER;
          lenis.scrollTo(Math.max(top, 0));
          history.pushState(null, "", id);
          // Mover o foco junto: sem isso o teclado continua no topo da página.
          (target as HTMLElement).setAttribute("tabindex", "-1");
          (target as HTMLElement).focus({ preventScroll: true });
        };

        document.addEventListener("click", onAnchor);
        lenis.on("scroll", ScrollTrigger.update);

        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        destroy = () => {
          document.removeEventListener("click", onAnchor);
          gsap.ticker.remove(tick);
          lenis.destroy();
        };
      },
    );

    return () => {
      cancelled = true;
      destroy();
    };
  }, []);

  return null;
}

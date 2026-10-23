"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** Altura da navbar fixa — o alvo da âncora para logo abaixo dela (WCAG 2.4.11). */
const HEADER = 80;

/**
 * Rolagem da página: âncoras sem `#` na URL e, quando o movimento permite,
 * scroll suave (Lenis) costurado ao ScrollTrigger do GSAP.
 *
 * **A URL fica limpa.** Os links internos (`#faq`, `#comunidade`…) rolam até a
 * seção e movem o foco, mas não escrevem o `#id` na barra de endereço — o
 * endereço só deve mudar quando houver uma página de verdade. Isso vale também
 * com `prefers-reduced-motion`, quando o Lenis não é instalado: o clique é
 * interceptado do mesmo jeito, só que a rolagem é a nativa. O preço é que o
 * botão Voltar não volta para a seção anterior; quando existirem rotas reais,
 * elas usam links normais (sem `#`) e este código não encosta neles.
 *
 * O Lenis fica de fora com `prefers-reduced-motion`: o scroll nativo é a
 * experiência correta, e tomá-lo de quem pediu menos movimento quebraria tanto
 * o conforto quanto a navegação por teclado.
 */
export function SmoothScroll() {
  useEffect(() => {
    let lenis: { scrollTo(top: number): void; destroy(): void } | null = null;
    let cancelled = false;
    let stopTicker = () => {};

    const goTo = (top: number) => {
      const target = Math.max(top, 0);
      if (lenis) lenis.scrollTo(target);
      else window.scrollTo({ top: target, behavior: "auto" });
    };

    // Âncoras (#faq, #comunidade…) funcionam com ou sem Lenis, e sem tocar na URL.
    const onAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute("href");
      if (!link || !id || id === "#") return;
      const target = document.querySelector<HTMLElement>(id);
      if (!target) return;
      event.preventDefault();
      // Posição absoluta calculada aqui: o `offset` do Lenis já rendeu
      // um destino 96px fora do lugar, e a conta explícita não tem dúvida.
      goTo(target.getBoundingClientRect().top + window.scrollY - HEADER);
      // Mover o foco junto: sem isso o teclado continua no topo da página.
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onAnchor);

    // Quem chega por um link com `#` (compartilhado, favorito) cai na seção
    // pelo comportamento nativo; depois disso o `#` é tirado da barra.
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    if (!prefersReducedMotion()) {
      void Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(
        ([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
          if (cancelled) return;
          gsap.registerPlugin(ScrollTrigger);

          const instance = new Lenis({ duration: 1.05, smoothWheel: true });
          lenis = instance;
          instance.on("scroll", ScrollTrigger.update);

          const tick = (time: number) => instance.raf(time * 1000);
          gsap.ticker.add(tick);
          gsap.ticker.lagSmoothing(0);

          stopTicker = () => gsap.ticker.remove(tick);
        },
      );
    }

    return () => {
      cancelled = true;
      document.removeEventListener("click", onAnchor);
      stopTicker();
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}

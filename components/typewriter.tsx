"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Datilografa a frase em ciclo: escreve, segura, apaga, escreve de novo.
 *
 * O texto completo fica num `sr-only` e a cópia animada é `aria-hidden`: o
 * leitor de tela lê a frase inteira uma vez, em vez de acompanhar cada letra —
 * e o ciclo não fica reanunciando a mesma frase para sempre.
 *
 * A cópia animada nasce com o texto completo, então sem JS (ou com movimento
 * reduzido) a frase simplesmente já está lá, parada.
 */
export function Typewriter({
  text,
  highlight,
  className = "",
}: {
  text: string;
  /** Trecho final destacado em âmbar. */
  highlight: string;
  className?: string;
}) {
  const plain = useRef<HTMLSpanElement>(null);
  const accent = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const first = plain.current;
    const second = accent.current;
    if (!first || !second || prefersReducedMotion()) return;

    let kill = () => {};
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/TextPlugin")]).then(
      ([{ gsap }, { ScrollTrigger }, { TextPlugin }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger, TextPlugin);

        const speed = 0.035;
        const context = gsap.context(() => {
          const loop = gsap.timeline({
            repeat: -1,
            paused: true,
            // Sem isso o ciclo continuaria rodando fora da tela.
            scrollTrigger: {
              trigger: first.parentElement,
              start: "top 85%",
              end: "bottom 15%",
              onToggle: ({ isActive }) => (isActive ? loop.play() : loop.pause()),
            },
          });

          loop
            .set([first, second], { text: "" })
            .to(first, { text, duration: text.length * speed, ease: "none" })
            .to(second, { text: highlight, duration: highlight.length * speed, ease: "none" })
            // Segura a frase inteira antes de apagar.
            .to({}, { duration: 2.4 })
            // Apaga na ordem inversa, mais rápido do que escreve.
            .to(second, { text: "", duration: highlight.length * speed * 0.45, ease: "none" })
            .to(first, { text: "", duration: text.length * speed * 0.45, ease: "none" })
            .to({}, { duration: 0.4 });
        }, first.parentElement ?? undefined);

        kill = () => context.revert();
      },
    );

    return () => {
      cancelled = true;
      kill();
    };
  }, [text, highlight]);

  return (
    <span className={className}>
      <span className="sr-only">
        {text} {highlight}
      </span>
      <span aria-hidden="true">
        <span ref={plain}>{text}</span>{" "}
        <span ref={accent} className="text-accent-display dark:text-amber">
          {highlight}
        </span>
        <span className="caret" />
      </span>
    </span>
  );
}

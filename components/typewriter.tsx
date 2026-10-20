"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Datilografa a frase quando ela entra em cena.
 *
 * O texto completo fica num `sr-only` e a cópia animada é `aria-hidden`: leitor
 * de tela lê a frase inteira de uma vez em vez de acompanhar letra por letra.
 * A cópia animada nasce com o texto completo, então sem JS (ou com movimento
 * reduzido) a frase simplesmente já está lá.
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

        const context = gsap.context(() => {
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: first.parentElement, start: "top 80%", once: true },
          });
          // `delimiter: ""` digita caractere a caractere; a velocidade sai da
          // duração dividida pelo tamanho de cada trecho.
          timeline
            .set([first, second], { text: "" })
            .to(first, { text: text, duration: text.length * 0.035, ease: "none" })
            .to(second, { text: highlight, duration: highlight.length * 0.035, ease: "none" }, ">");
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

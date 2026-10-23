"use client";

import { useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Pergunta do FAQ com abertura suave.
 *
 * Continua sendo um `<details>` nativo — semântica, teclado e busca do
 * navegador de graça. A altura é animada à mão porque `<details>` não anima
 * sozinho: ao fechar, seguramos o `open` até a animação terminar, senão o
 * conteúdo sumiria antes de encolher.
 */
export function FaqItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  const details = useRef<HTMLDetailsElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const animating = useRef(false);

  async function onClick(event: React.MouseEvent) {
    const node = details.current;
    const content = body.current;
    if (!node || !content || prefersReducedMotion()) return;

    event.preventDefault();
    if (animating.current) return;
    animating.current = true;

    const { gsap } = await import("gsap");
    const opening = !node.open;

    if (opening) node.open = true;

    gsap.fromTo(
      content,
      { height: opening ? 0 : content.scrollHeight, opacity: opening ? 0 : 1 },
      {
        height: opening ? content.scrollHeight : 0,
        opacity: opening ? 1 : 0,
        duration: 0.38,
        ease: opening ? "power2.out" : "power2.in",
        onComplete: () => {
          gsap.set(content, { height: "auto" });
          if (!opening) node.open = false;
          animating.current = false;
        },
      },
    );
  }

  return (
    <details ref={details} className="card group px-7 py-5">
      <summary
        onClick={onClick}
        className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-lg font-medium text-ink marker:hidden"
      >
        {question}
        <span
          aria-hidden="true"
          className="mt-1 shrink-0 text-2xl leading-none font-light text-ink-faint transition-transform duration-300 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div ref={body} className="overflow-hidden">
        {/* Texto simples vira parágrafo; conteúdo rico (código, listas) vem pronto. */}
        {typeof answer === "string" ? (
          <p className="mt-4 max-w-[60ch] text-ink-soft">{answer}</p>
        ) : (
          <div className="mt-4 max-w-[60ch] space-y-3 text-ink-soft">{answer}</div>
        )}
      </div>
    </details>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export interface Step {
  title: string;
  body: string;
}

/**
 * Linha do tempo horizontal. O trilho se preenche conforme o scroll avança, e
 * o marco que está "na vez" cresce e acende enquanto os outros recuam — a
 * transição entre pontos é o próprio scroll.
 *
 * Abaixo de `md` vira pilha vertical: quatro marcos lado a lado em 390px
 * dariam colunas de 80px.
 *
 * Nada disso é necessário para entender a sequência — ela já está na ordem do
 * `<ol>`, então sem JS ou com movimento reduzido a lista continua completa.
 */
export function Timeline({ steps }: { steps: Step[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const node = scope.current;
    if (!node || prefersReducedMotion()) return;

    let kill = () => {};
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const context = gsap.context(() => {
          // O trilho se preenche ao longo da seção inteira.
          gsap.fromTo(
            "[data-track]",
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: { trigger: node, start: "top 70%", end: "bottom 80%", scrub: 0.5 },
            },
          );

          // Qual marco está na vez: vem da posição do scroll dentro da seção.
          ScrollTrigger.create({
            trigger: node,
            start: "top 70%",
            end: "bottom 80%",
            onUpdate: ({ progress }) =>
              setActive(Math.min(steps.length - 1, Math.floor(progress * steps.length))),
          });
        }, node);

        kill = () => context.revert();
      },
    );

    return () => {
      cancelled = true;
      kill();
    };
  }, [steps.length]);

  return (
    <div ref={scope} className="mt-16">
      {/* Trilho: só na horizontal, onde os marcos ficam lado a lado. */}
      <div className="relative mb-8 hidden md:block">
        <span aria-hidden="true" className="absolute top-5 right-[12.5%] left-[12.5%] h-0.5 bg-line" />
        <span
          aria-hidden="true"
          data-track
          className="absolute top-5 right-[12.5%] left-[12.5%] h-0.5 origin-left bg-amber"
        />
        <ol className="relative grid grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex justify-center">
              <span
                data-dot
                aria-hidden="true"
                className={`flex size-10 items-center justify-center rounded-full font-display text-base font-bold transition-all duration-500 [box-shadow:0_0_0_6px_var(--bg)] ${
                  index <= active
                    ? "scale-110 bg-amber text-ink-900"
                    : "scale-100 bg-bg-weak text-ink-faint [box-shadow:0_0_0_6px_var(--bg),inset_0_0_0_2px_var(--line-strong)]"
                }`}
              >
                {index + 1}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-5 md:block md:px-2 md:text-left">
            {/* No empilhado o número volta para o lado do texto. */}
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber font-display text-base font-bold text-ink-900 md:hidden"
            >
              {index + 1}
            </span>
            {/* O marco da vez se destaca pela cor do título, não por apagar os
                outros: texto a 55% de opacidade cairia abaixo do AA. */}
            <div>
              <h3
                className={`font-display text-lg font-semibold transition-colors duration-500 ${
                  index === active ? "text-accent dark:text-amber" : "text-ink"
                }`}
              >
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

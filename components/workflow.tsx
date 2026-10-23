"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, ClipboardList, History, Play, Users } from "lucide-react";
import { MOTION, prefersReducedMotion } from "@/lib/motion";
import { SectionHead } from "./primitives";

const steps = [
  {
    icon: ClipboardList,
    title: "Tarefa",
    body: "Você descreve o objetivo e atribui a tarefa ao agente que coordena.",
  },
  {
    icon: Users,
    title: "Equipe",
    body: "O coordenador divide o trabalho em subtarefas, uma para cada agente.",
  },
  {
    icon: Play,
    title: "Execução",
    body: "Cada agente trabalha no executor configurado, como Claude Code, Codex ou Cursor.",
  },
  {
    icon: BookOpen,
    title: "Memória",
    body: "Decisões e resultados viram documentos que a equipe consulta depois.",
  },
  {
    icon: History,
    title: "Auditoria",
    body: "Cada ação fica registrada com quem fez, o que fez e quando.",
  },
];

/**
 * O fluxo em cinco passos, numa faixa só. A linha âmbar se preenche conforme a
 * página rola e acende o passo da vez — a rolagem é o próprio controle, sem
 * prender a tela. Abaixo de `lg` vira lista vertical, com a linha descendo pela
 * lateral.
 *
 * Sem JS ou com movimento reduzido os cinco passos nascem acesos e a linha
 * inteira preenchida: a sequência já está completa na ordem do `<ol>`.
 */
export function Workflow() {
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(steps.length - 1);

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
          setActive(0);
          // Os passos chegam em sequência uma vez, ao entrar na tela.
          gsap.from("[data-step]", {
            opacity: 0,
            y: MOTION.y,
            duration: MOTION.duration,
            ease: MOTION.ease,
            stagger: 0.1,
            scrollTrigger: { trigger: node, start: MOTION.start, once: true },
          });

          // A linha acompanha a rolagem; `scrub` suaviza, não prende nada.
          const range = { trigger: node, start: "top 72%", end: "bottom 55%", scrub: 0.4 };
          gsap.fromTo("[data-fill-x]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: range });
          gsap.fromTo("[data-fill-y]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: range });

          // Qual passo está na vez, pela mesma posição de rolagem.
          ScrollTrigger.create({
            trigger: node,
            start: range.start,
            end: range.end,
            onUpdate: ({ progress }) =>
              setActive(Math.min(steps.length - 1, Math.floor(progress * (steps.length - 1) + 0.05))),
          });
        }, node);

        kill = () => context.revert();
      },
    );

    return () => {
      cancelled = true;
      kill();
    };
  }, []);

  return (
    <section id="como-funciona" aria-labelledby="como-funciona-titulo" className="section bg-bg-weak">
      <div className="shell">
        <SectionHead
          id="como-funciona-titulo"
          title="Como o Hive trabalha: da tarefa ao registro."
          lead="Um caminho só, do pedido ao que fica guardado."
        />

        <div ref={scope} className="relative mt-12 lg:mt-16">
          {/* Trilho: horizontal no desktop, vertical no empilhado. Cada um tem
              a linha base e a que se preenche com a rolagem. */}
          <span aria-hidden="true" className="absolute top-6 right-[10%] left-[10%] hidden h-px bg-line-strong lg:block" />
          <span
            aria-hidden="true"
            data-fill-x
            className="absolute top-[23px] right-[10%] left-[10%] hidden h-0.5 origin-left bg-amber lg:block"
          />
          <span aria-hidden="true" className="absolute top-6 bottom-6 left-6 w-px bg-line-strong lg:hidden" />
          <span
            aria-hidden="true"
            data-fill-y
            className="absolute top-6 bottom-6 left-[23px] w-0.5 origin-top bg-amber lg:hidden"
          />

          <ol className="relative grid gap-8 lg:grid-cols-5 lg:gap-6">
            {steps.map((step, index) => (
              <li key={step.title} data-step className="flex gap-5 lg:flex-col lg:items-center lg:text-center">
                <span aria-hidden="true" className="relative flex size-12 shrink-0 items-center justify-center">
                  {/* Hexágono com contorno de verdade: `clip-path` cortaria o anel. */}
                  <svg viewBox="0 0 48 48" className="absolute inset-0 size-full [&_path]:transition-[fill,stroke] [&_path]:duration-300">
                    <path
                      d="M13 3.5h22L46 24 35 44.5H13L2 24z"
                      fill={index <= active ? "var(--color-amber)" : "var(--bg)"}
                      stroke={index <= active ? "var(--color-amber)" : "var(--line-strong)"}
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <step.icon
                    className={`relative size-5 transition-colors duration-300 ${index <= active ? "text-ink-900" : "text-ink-faint"}`}
                    strokeWidth={1.75}
                  />
                </span>
                <div className="pt-1 lg:pt-0">
                  <h3
                    className={`font-display text-lg font-semibold tracking-[-0.02em] transition-colors duration-300 ${
                      index === active ? "text-accent" : "text-ink"
                    }`}
                  >
                    <span className="sr-only">Passo {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-1.5 max-w-[30ch] text-[15px] leading-6 text-ink-soft lg:mx-auto">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

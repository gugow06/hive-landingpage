"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** Marca do Hive: o hexágono do logo, desenhado em SVG para herdar currentColor. */
export function HiveMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="6" strokeLinejoin="round">
        <path d="M60 4 70 10v12l-10 6-10-6V10z" />
        <path d="M60 30 78 40v20L60 70 42 60V40z" fill="currentColor" />
        <path d="M26 50 44 60v20l-18 10-18-10V60z" fill="currentColor" />
        <path d="M60 70 78 80v20l-18 10-18-10V80z" fill="currentColor" />
        <path d="M94 50 112 60v20l-18 10-18-10V60z" fill="currentColor" />
      </g>
    </svg>
  );
}

/** Logo da marca — o lettering oficial, recortado de `images/` pelo build-logos. */
export function HiveLogo({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/hive-wordmark.png"
      alt="Hive"
      width={985}
      height={497}
      className={`h-9 w-auto ${className}`}
    />
  );
}

/**
 * Revela o bloco quando ele entra na viewport, via ScrollTrigger do GSAP.
 * O conteúdo nasce visível no HTML — a animação só o esconde depois que o GSAP
 * assume, então sem JS (ou com movimento reduzido) nada fica invisível.
 */
export function Rise({
  children,
  delay = 0,
  stagger,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  /** Seletor dos filhos a escalonar, em vez de animar o bloco inteiro. */
  stagger?: string;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header" | "ul" | "ol";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    let kill = () => {};
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const targets = stagger ? node.querySelectorAll(stagger) : node;
        const context = gsap.context(() => {
          gsap.from(targets, {
            opacity: 0,
            y: 20,
            duration: 0.7,
            ease: "power2.out",
            delay: delay / 1000,
            stagger: stagger ? 0.08 : 0,
            scrollTrigger: { trigger: node, start: "top 85%", once: true },
          });
        }, node);

        kill = () => context.revert();
      },
    );

    return () => {
      cancelled = true;
      kill();
    };
  }, [delay, stagger]);

  return (
    // @ts-expect-error — ref polimórfico entre as tags permitidas acima
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { MOTION, prefersReducedMotion } from "@/lib/motion";

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

/** Cabeçalho de seção: título curto e, se houver, uma linha de apoio. O título
 *  carrega o assunto sozinho — sem rótulo em caixa-alta acima dele. */
export function SectionHead({
  id,
  title,
  lead,
  center = false,
  className = "",
}: {
  /** Id do título, para a seção apontar `aria-labelledby` para ele. */
  id?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-xl"} ${className}`}>
      <h2 id={id} className="h2">
        {title}
      </h2>
      {lead && <p className="lead mt-4">{lead}</p>}
    </div>
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
            y: MOTION.y,
            duration: MOTION.duration,
            ease: MOTION.ease,
            delay: delay / 1000,
            stagger: stagger ? MOTION.stagger : 0,
            scrollTrigger: { trigger: node, start: MOTION.start, once: true },
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

"use client";

import { useEffect, useRef } from "react";
import { CONNECTORS } from "@/lib/connectors";
import { prefersReducedMotion } from "@/lib/motion";
import { Rise } from "./primitives";

// Duas faixas, cada uma correndo para um lado.
const half = Math.ceil(CONNECTORS.length / 2);
const rows = [CONNECTORS.slice(0, half), CONNECTORS.slice(half)];

function Card({ connector }: { connector: (typeof CONNECTORS)[number] }) {
  return (
    // Medidas fixas: nome de uma ou duas linhas não pode mexer na altura do
    // card nem empurrar o logo para cima em relação aos vizinhos.
    <li className="flex h-[140px] w-[140px] shrink-0 flex-col items-center gap-3 rounded-2xl bg-surface px-3 py-5 [box-shadow:var(--ring)]">
      {/* Boa parte das marcas é desenhada em tinta escura e nem todas têm
          variante clara no catálogo. A plaquinha branca no modo escuro deixa
          todas legíveis, em vez de algumas sumirem no fundo. */}
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl dark:bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/connectors/${connector.logo}`}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          className="max-h-8 max-w-8 object-contain"
        />
      </span>
      <span className="flex flex-1 items-start justify-center text-center text-xs leading-tight font-medium text-ink-soft">
        {connector.name}
      </span>
    </li>
  );
}

/**
 * Carrossel dos conectores que o Hive já fala.
 *
 * A lista vem de `lib/connectors.ts`, gerado por `npm run connectors` a partir
 * do catálogo do produto — não é uma lista escrita à mão que envelhece.
 *
 * As faixas correm em loop infinito: cada uma tem o conteúdo duplicado e anda
 * exatamente metade da própria largura, então a emenda cai num ponto idêntico
 * e não se vê. Com movimento reduzido elas param e viram uma lista rolável.
 */
export function Connectors() {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scope.current;
    if (!node || prefersReducedMotion()) return;

    let kill = () => {};
    let cancelled = false;

    void import("gsap").then(({ gsap }) => {
      if (cancelled) return;

      const context = gsap.context(() => {
        node.querySelectorAll<HTMLElement>("[data-marquee]").forEach((track, index) => {
          const reverse = index % 2 === 1;
          gsap.to(track, {
            xPercent: reverse ? 0 : -50,
            ease: "none",
            duration: 75,
            repeat: -1,
            startAt: { xPercent: reverse ? -50 : 0 },
          });
        });
      }, node);

      kill = () => context.revert();
    });

    return () => {
      cancelled = true;
      kill();
    };
  }, []);

  return (
    <section id="conexoes" className="overflow-hidden py-28">
      <div className="shell">
        <Rise>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Conexões</p>
            <h2 className="display mt-4 text-[clamp(2rem,4.5vw,2.75rem)] text-ink">
              Seus agentes já falam{" "}
              <span className="text-accent-display dark:text-amber">com o resto da sua stack.</span>
            </h2>
            <p className="lead mt-5">
              {CONNECTORS.length} conectores prontos — GitHub, Slack, Notion, Linear, Stripe e o
              resto. Mais qualquer servidor MCP que você quiser plugar.
            </p>
          </div>
        </Rise>
      </div>

      <div
        ref={scope}
        className="relative mt-14 space-y-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        {rows.map((row, index) => (
          <div key={index} className="overflow-hidden">
            <ul data-marquee className="flex w-max gap-4">
              {/* Duplicado para o loop emendar sem salto. */}
              {[...row, ...row].map((connector, position) => (
                <Card key={`${connector.slug}-${position}`} connector={connector} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

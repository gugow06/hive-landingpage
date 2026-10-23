"use client";

import { useEffect, useRef, useState } from "react";
import { CARD_H, CARD_W, ORG, STATUS_DOT, STATUS_LABEL, buildLayout, type OrgNode } from "@/lib/org";
import { prefersReducedMotion } from "@/lib/motion";

const { nodes, links, width, height } = buildLayout();

function Avatar({ hibee, status }: { hibee: string; status: string }) {
  return (
    <span className="relative shrink-0">
      <span className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-bg-weak">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/hibees/${hibee}.svg`}
          alt=""
          width={34}
          height={34}
          className="size-[34px] translate-y-[3px] object-contain"
        />
      </span>
      <span
        className={`absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-[var(--surface-raised)] ${status === "running" ? "pulse-dot" : ""}`}
        style={{ backgroundColor: STATUS_DOT[status] }}
      />
      <span className="sr-only">{STATUS_LABEL[status] ?? status}</span>
    </span>
  );
}

function CardBody({ node }: { node: Omit<OrgNode, "reports"> }) {
  return (
    <>
      <div className="flex items-start gap-3">
        <Avatar hibee={node.hibee} status={node.status} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm leading-tight font-semibold text-ink">{node.name}</span>
          <span className="mt-0.5 block text-xs leading-tight text-ink-soft">{node.title}</span>
          <span className="mt-1 block font-mono text-xs leading-tight text-ink-faint">
            {node.adapter}
          </span>
        </span>
      </div>
      <p className="mt-1.5 text-xs leading-snug text-ink-soft">{node.capabilities}</p>
    </>
  );
}

/** Mesma hierarquia, empilhada. Abaixo de 768px a árvore só caberia encolhida
 *  a ponto de o texto virar borrão, então o recuo é que passa a indicar quem
 *  reporta a quem. */
function StackedOrg({ node }: { node: OrgNode }) {
  return (
    <li>
      <div
        className="rounded-2xl bg-surface-raised px-4 py-3 [box-shadow:inset_0_0_0_1px_var(--line-strong)]"
        data-org-card
      >
        <CardBody node={node} />
      </div>
      {node.reports.length > 0 && (
        <ul className="mt-3 space-y-3 border-l border-line-strong pl-4">
          {node.reports.map((child) => (
            <StackedOrg key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * O organograma como o app desenha: cards de 200×100, arestas ortogonais,
 * avatar com ponto de status. Entra em cena de cima para baixo, no ritmo em que
 * o Hive contrataria o time.
 */
export function OrgChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Em telas intermediárias a árvore encolhe o suficiente para caber e ainda
  // continuar legível; o recorte para a versão empilhada é feito por CSS.
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver !== "function") return;

    const observer = new ResizeObserver(([entry]) => {
      const available = entry?.contentRect.width ?? width;
      setScale(Math.min(1, available / width));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scope = ref.current;
    if (!scope || prefersReducedMotion()) return;

    let kill = () => {};
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const context = gsap.context(() => {
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: scope, start: "top 78%", once: true },
          });

          // Cada nível aparece depois do seu pai: a contratação desce a árvore.
          timeline.from("[data-org-card]", {
            opacity: 0,
            y: 18,
            scale: 0.96,
            duration: 0.5,
            ease: "power2.out",
            stagger: { each: 0.09 },
          });

          // As linhas se desenham sozinhas. DrawSVG é plugin pago do GSAP, então
          // o traço vem de dash-offset medido no próprio path.
          scope.querySelectorAll<SVGPathElement>("[data-org-link]").forEach((path, index) => {
            const length = path.getTotalLength();
            timeline.fromTo(
              path,
              { strokeDasharray: length, strokeDashoffset: length },
              { strokeDashoffset: 0, duration: 0.45, ease: "none" },
              0.25 + index * 0.08,
            );
          });

          // Com o desenho pronto, um pulso desce por cada ligação: a tarefa
          // indo de quem coordena para quem executa. É CSS, pausa fora da tela.
          timeline.to("[data-org-pulse]", { opacity: 1, duration: 0.6, ease: "none" }, ">");
        }, scope);

        kill = () => context.revert();
      },
    );

    return () => {
      cancelled = true;
      kill();
    };
  }, []);

  return (
    <div ref={ref}>
      <ul className="space-y-3 md:hidden">
        <StackedOrg node={ORG} />
      </ul>

      {/* `mx-auto` não centraliza um filho mais largo que o pai, então a posição
          vem de left:50% + translateX(-50%), com a escala no mesmo ponto. */}
      <div className="relative hidden md:block" style={{ height: height * scale }}>
        <div
          className="absolute top-0 left-1/2"
          style={{
            width,
            height,
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <svg
            className="pointer-events-none absolute inset-0"
            width={width}
            height={height}
            aria-hidden="true"
          >
            {links.map(({ parent, child }) => {
              const x1 = parent.x + CARD_W / 2;
              const y1 = parent.y + CARD_H;
              const x2 = child.x + CARD_W / 2;
              const y2 = child.y;
              const midY = (y1 + y2) / 2;
              const d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
              return (
                <g key={`${parent.id}-${child.id}`}>
                  <path data-org-link d={d} fill="none" stroke="var(--line-strong)" strokeWidth={1.5} />
                  <path
                    data-org-pulse
                    d={d}
                    fill="none"
                    stroke="var(--color-amber)"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    className="beam-pulse"
                    style={{ opacity: 0, animationDelay: `${(parent.y / (CARD_H + 80)) * 0.9}s` }}
                  />
                </g>
              );
            })}
          </svg>

          <ul className="absolute inset-0 list-none">
            {nodes.map((node) => (
              <li
                key={node.id}
                data-org-card
                className="absolute rounded-2xl bg-surface-raised px-4 py-3 [box-shadow:inset_0_0_0_1px_var(--line-strong)]"
                style={{ left: node.x, top: node.y, width: CARD_W, minHeight: CARD_H }}
              >
                <CardBody node={node} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

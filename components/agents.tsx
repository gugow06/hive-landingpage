"use client";

import { useEffect, useRef, useState } from "react";
import { ORG, STATUS_DOT } from "@/lib/org";
import { prefersReducedMotion } from "@/lib/motion";
import { LiveHibee } from "./live-hibee";
import { Typewriter } from "./typewriter";

const cto = ORG.reports[0]!;
const team = cto.reports;

/** Um agente da colmeia: Hibee grande por cima, ficha por baixo. */
function Agent({
  node,
  size,
  delay = 0,
}: {
  node: Omit<(typeof team)[number], "reports">;
  size: number;
  /** Defasagem da flutuação, para a colmeia não respirar em uníssono. */
  delay?: number;
}) {
  return (
    <>
      <span className="relative block" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/hibees/${node.hibee}.svg`}
          alt=""
          width={size}
          height={size}
          className="bob block size-full"
          style={{ animationDelay: `${delay}s` }}
        />
        <span
          className="absolute right-[15%] bottom-[17%] size-3 rounded-full border-2 border-[var(--bg)]"
          style={{ backgroundColor: STATUS_DOT[node.status] }}
        />
      </span>
      <span className="mt-1 font-display text-lg font-bold tracking-tight text-ink">
        {node.name}
      </span>
      <span className="text-sm text-ink-soft">{node.title}</span>
      <span className="font-mono text-[11px] text-ink-faint">
        {node.adapter}
      </span>
    </>
  );
}

/** Traço do organograma. Sai do layout real em vez de coordenadas fixas — com
 *  SVG de viewBox fechada, qualquer mudança de altura jogava a linha por cima
 *  do nome do agente. */
function Link({
  kind,
  className,
}: {
  kind: "cto" | "trunk" | "bar" | "drop";
  className: string;
}) {
  return (
    <span
      aria-hidden="true"
      data-link={kind}
      className={`absolute bg-line-strong ${className}`}
    />
  );
}

/**
 * O organograma se montando conforme a página desce.
 *
 * Darnold fica fixo no centro — é o mesmo Hibee vivo em Three.js, que continua
 * seguindo o cursor o tempo todo. O resto do time entra conforme o scroll
 * avança, na ordem em que o Hive contrataria: CTO primeiro, depois quem o CTO
 * precisa. A seção termina com a colmeia inteira em pé.
 *
 * Só o Darnold roda o runtime 3D. É a mesma regra do produto, cujo
 * `agent-character-slot.ts` diz: "The app gets one live hero. Other placements
 * retain their static image." Medido aqui: cinco personagens ao vivo derrubam
 * a seção para 49 fps com quadros de 83 ms; com um só, 161 fps e pior quadro
 * de 14,6 ms. Os outros quatro usam o SVG estático com uma flutuação em CSS
 * defasada, que lê como vida sem custo de quadro.
 */
export function Agents() {
  const scope = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  // Depois de acordar, o Darnold cinza fica invisível para sempre: manter o
  // contexto WebGL dele vivo é um sexto personagem desenhando atrás de outro.
  const [asleep, setAsleep] = useState(true);

  // O palco é preso na viewport e tem overflow-hidden: numa tela baixa o
  // organograma inteiro não cabe e o título some por cima. Encolher é melhor
  // do que cortar — a hierarquia completa é o que a seção tem a dizer.
  useEffect(() => {
    const box = stage.current;
    const inner = content.current;
    if (!box || !inner || typeof ResizeObserver !== "function") return;

    const fit = () => {
      // Uma folga: encaixado no limite, o olho do título encosta na navbar.
      const available = box.clientHeight - 28;
      const needed = inner.scrollHeight;
      setScale(needed > available ? Math.max(available / needed, 0.62) : 1);
    };

    const observer = new ResizeObserver(fit);
    observer.observe(box);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = scope.current;
    // Sem movimento: o organograma já nasce completo, sem depender do scroll.
    if (!node || prefersReducedMotion()) return;

    let kill = () => {};
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const context = gsap.context(() => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: node,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
            },
          });

          // Darnold ganha cor logo no começo: o primeiro agente acabou de ser
          // configurado, e é isso que destrava o resto da contratação.
          timeline
            // `fromTo` e não `to`: no HTML ele nasce acordado, para quem pediu
            // movimento reduzido (onde o GSAP nem carrega) não ficar olhando
            // um boneco cinza dormindo para sempre.
            .fromTo(
              "[data-wake]",
              { opacity: 0 },
              { opacity: 1, duration: 0.8, ease: "none" },
              0,
            )
            // O cinza sai só no fim: o "z" de quem dorme fica fora da silhueta
            // do acordado e continuaria aparecendo por cima dele.
            .fromTo(
              "[data-sleep]",
              { opacity: 1 },
              {
                opacity: 0,
                duration: 0.3,
                ease: "none",
                onComplete: () => setAsleep(false),
                onReverseComplete: () => setAsleep(true),
              },
              0.5,
            );

          // A linha desce, o CTO aparece.
          timeline
            .from(
              "[data-link='cto']",
              { scaleY: 0, duration: 0.5, ease: "none" },
              0.3,
            )
            .from(
              "[data-cto]",
              { opacity: 0, y: 28, duration: 0.5, ease: "power2.out" },
              0.7,
            );

          // O tronco abre, os ramos descem, o time entra um a um.
          timeline
            .from(
              "[data-link='trunk']",
              { scaleY: 0, duration: 0.3, ease: "none" },
              1.3,
            )
            .from(
              "[data-link='bar']",
              { scaleX: 0, duration: 0.4, ease: "power1.inOut" },
              1.6,
            )
            .from(
              "[data-link='drop']",
              { scaleY: 0, duration: 0.3, ease: "none", stagger: 0.3 },
              1.9,
            )
            .from(
              "[data-agent]",
              {
                opacity: 0,
                y: 28,
                scale: 0.94,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.4,
              },
              2.1,
            )
            .from("[data-closing]", { opacity: 0, y: 12, duration: 0.5 }, 3.4);
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
    <section id="agentes" ref={scope} className="relative mt-[30px] h-[320vh]">
      <div
        ref={stage}
        className="sticky top-[88px] flex h-[calc(100vh-88px)] min-h-[560px] items-center overflow-hidden"
      >
        <div
          ref={content}
          className="shell flex w-full flex-col items-center"
          style={{ scale, transformOrigin: "center" }}
        >
          <p className="eyebrow">Os Hibees</p>
          <h2 className="display mt-3 max-w-3xl text-center text-[clamp(1.5rem,3.6vw,2.25rem)] text-ink">
            <Typewriter
              text="Um objetivo entra."
              highlight="Um time inteiro sai."
            />
          </h2>

          {/* Darnold acorda conforme a página desce. Dois bonecos empilhados —
              o cinza dormindo embaixo, o colorido acordado por cima — e a cor
              chega pela opacidade. É a mesma técnica do onboarding do app, que
              desenha o agente apagado até a configuração passar; a troca seca
              de paleta cortaria o movimento no meio. */}
          <div className="mt-4 flex flex-col items-center">
            <span
              className="relative block"
              style={{ width: 128, height: 128 }}
            >
              {asleep && (
                <span data-sleep className="absolute inset-0">
                  <LiveHibee
                    palette={ORG.palette}
                    pose="sleepy"
                    muted
                    fallback="dorminhoco-sleepy"
                    size={128}
                    label="Darnold, o agente CEO da colmeia, ainda sem configuração"
                  />
                </span>
              )}
              <span data-wake className="absolute inset-0">
                <LiveHibee
                  palette={ORG.palette}
                  pose="idle"
                  fallback="rainha-idle"
                  size={128}
                  label=""
                />
              </span>
            </span>
            <p className="-mt-1 font-display text-xl font-bold tracking-tight text-ink">
              {ORG.name}
            </p>
            <p className="text-sm text-ink-soft">{ORG.title}</p>
          </div>

          {/* CTO, pendurado por um traço que se desenha. */}
          <div
            data-cto
            className="relative mt-6 flex flex-col items-center pt-7"
          >
            <Link
              kind="cto"
              className="top-0 left-1/2 h-7 w-px origin-top -translate-x-1/2"
            />
            <Agent node={cto} size={90} delay={0.7} />
          </div>

          {/* O time do CTO: tronco, barra e três ramos. */}
          <div className="relative mt-6 w-full max-w-3xl pt-14">
            <Link
              kind="trunk"
              className="top-0 left-1/2 h-7 w-px origin-top -translate-x-1/2"
            />
            <Link
              kind="bar"
              className="top-7 right-[16.666%] left-[16.666%] h-px origin-center"
            />

            <ul className="grid grid-cols-3 gap-x-4">
              {team.map((node, index) => (
                <li
                  key={node.id}
                  className="relative flex flex-col items-center text-center"
                >
                  <Link
                    kind="drop"
                    className="-top-7 left-1/2 h-7 w-px origin-top -translate-x-1/2"
                  />
                  <span data-agent className="flex flex-col items-center">
                    <Agent node={node} size={82} delay={0.3 + index * 0.6} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p data-closing className="mt-7 max-w-lg text-center text-ink-soft">
            Uma hierarquia, um objetivo, uma memória só. Os agentes se viram
            sozinhos — e cada contratação ainda passa por você.
          </p>
        </div>
      </div>
    </section>
  );
}

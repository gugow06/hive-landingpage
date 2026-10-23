"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CONNECTORS, type Connector } from "@/lib/connectors";
import { useOffscreenPause } from "@/lib/motion";
import { Rise, SectionHead } from "./primitives";

/** As seis em destaque, na ordem do diagrama: três à esquerda, três à direita. */
const FEATURED = ["github", "slack", "linear", "notion", "google-drive", "gmail"];
const featured = FEATURED.map((slug) => CONNECTORS.find((item) => item.slug === slug)!).filter(Boolean);

/**
 * Quem executa o trabalho de cada agente. Não são integrações: são os
 * adaptadores do produto (`ui/src/adapters/adapter-display-registry.ts`),
 * com os mesmos rótulos.
 */
const EXECUTORS = [
  "Claude Code",
  "Codex",
  "Cursor",
  "Gemini CLI",
  "OpenCode",
  "Grok Build",
  "Kimi Code",
  "Hermes",
  "Pi",
  "OpenClaw Gateway",
  "Process",
  "HTTP",
];

/** Logo sobre plaquinha branca nos dois temas: boa parte das marcas é
 *  desenhada em tinta escura, e assim só um arquivo é baixado por marca. */
function Logo({ connector, size = 28 }: { connector: Connector; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/connectors/${connector.logo}`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className="object-contain"
      style={{ maxWidth: size, maxHeight: size }}
    />
  );
}

/**
 * Conexões animadas entre o Hive e as ferramentas. A ideia é a do Animated
 * Beam do Magic UI (MIT): o caminho é medido nos próprios elementos e
 * recalculado quando o layout muda. Aqui o pulso que percorre a curva é um
 * traço tracejado em CSS (`.beam-pulse`), sem a biblioteca `motion`, e pausa
 * fora da tela. No celular o diagrama vira uma grade estática.
 */
function Beams() {
  const box = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLLIElement | null)[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = box.current;
    const center = hub.current;
    if (!container || !center || typeof ResizeObserver !== "function") return;

    const measure = () => {
      const frame = container.getBoundingClientRect();
      const target = center.getBoundingClientRect();
      const hx = target.left + target.width / 2 - frame.left;
      const hy = target.top + target.height / 2 - frame.top;
      setSize({ width: frame.width, height: frame.height });
      setPaths(
        nodes.current.map((node) => {
          if (!node) return "";
          const rect = node.getBoundingClientRect();
          const left = rect.left + rect.width / 2 < frame.left + frame.width / 2;
          const x = (left ? rect.right : rect.left) - frame.left;
          const y = rect.top + rect.height / 2 - frame.top;
          // Curva quadrática com o controle no meio do caminho, na altura do
          // nó: sai reta da ferramenta e entra suave no hexágono.
          const cx = (x + hx) / 2;
          return `M ${x.toFixed(1)},${y.toFixed(1)} Q ${cx.toFixed(1)},${y.toFixed(1)} ${hx.toFixed(1)},${hy.toFixed(1)}`;
        }),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    // Os tiles também: quando a fonte carrega, a largura deles muda sem mexer
    // no container, e as linhas precisam seguir a borda real.
    nodes.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const tile = (connector: Connector, index: number) => (
    <li
      key={connector.slug}
      ref={(node) => {
        nodes.current[index] = node;
      }}
      className="flex items-center gap-3 rounded-xl bg-surface py-2 pr-4 pl-2 [box-shadow:var(--ring-soft),var(--shadow-card)]"
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-white [box-shadow:inset_0_0_0_1px_rgba(23,23,23,0.08)]">
        <Logo connector={connector} size={24} />
      </span>
      <span className="text-sm font-medium text-ink">{connector.name}</span>
    </li>
  );

  return (
    <div ref={box} className="relative">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        width={size.width}
        height={size.height}
        fill="none"
      >
        {paths.map((d, index) => (
          <g key={index}>
            <path d={d} stroke="var(--line-strong)" strokeWidth={1.25} />
            <path
              d={d}
              stroke="var(--color-amber)"
              strokeWidth={2}
              strokeLinecap="round"
              className="beam-pulse"
              style={{ animationDelay: `${index * 0.6}s` }}
            />
          </g>
        ))}
      </svg>

      <div className="relative grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-16">
        <ul className="flex flex-wrap justify-center gap-3 md:grid md:grid-cols-1 md:justify-items-start md:gap-6">
          {featured.slice(0, 3).map((connector, index) => tile(connector, index))}
        </ul>

        <div
          ref={hub}
          className="order-first mx-auto mb-3 flex size-24 items-center justify-center md:order-none md:mb-0"
        >
          <span className="relative flex size-24 items-center justify-center">
            <svg viewBox="0 0 96 96" aria-hidden="true" className="absolute inset-0 size-full">
              <path
                d="M27 6h42l23 42-23 42H27L4 48z"
                fill="var(--surface)"
                stroke="var(--color-amber)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            {/* O símbolo oficial da marca, não um redesenho. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/hive-symbol-trim.png"
              alt="Hive"
              width={544}
              height={708}
              className="relative h-14 w-auto"
            />
          </span>
        </div>

        <ul className="flex flex-wrap justify-center gap-3 md:grid md:grid-cols-1 md:justify-items-end md:gap-6">
          {featured.slice(3).map((connector, index) => tile(connector, index + 3))}
        </ul>
      </div>
    </div>
  );
}

export function Connectors() {
  const scope = useRef<HTMLElement>(null);
  const [all, setAll] = useState(false);
  useOffscreenPause(scope);

  const rest = CONNECTORS.filter((item) => !FEATURED.includes(item.slug));

  return (
    <section id="integracoes" ref={scope} aria-labelledby="integracoes-titulo" className="section bg-bg-weak">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
          <div>
            <SectionHead
              id="integracoes-titulo"
              title="Conectado ao que a sua equipe já usa."
              lead={`${CONNECTORS.length} integrações prontas no catálogo, além de servidores MCP que você mesmo configura.`}
            />

            <div className="mt-10">
              <h3 className="text-[15px] font-semibold text-ink">Executores de agentes</h3>
              <p className="mt-1 text-sm leading-6 text-ink-soft">
                Não são integrações: é onde cada agente roda. Você escolhe um por agente.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {EXECUTORS.map((name) => (
                  <li key={name} className="chip">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Rise>
            <Beams />
          </Rise>
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <button
            type="button"
            onClick={() => setAll((value) => !value)}
            aria-expanded={all}
            aria-controls="integracoes-todas"
            className="btn btn-secondary btn-sm mx-auto flex"
          >
            {all ? "Mostrar menos" : `Ver todas as ${CONNECTORS.length} integrações`}
            <ChevronDown
              className={`size-4 transition-transform duration-300 ${all ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {/* Só entra no DOM quando pedida: são dezenas de logos que ninguém
              precisa baixar para ler a seção. */}
          <div id="integracoes-todas" hidden={!all}>
            {all && (
              <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {rest.map((connector) => (
                  <li
                    key={connector.slug}
                    className="flex items-center gap-2.5 rounded-lg bg-surface px-3 py-2 [box-shadow:var(--ring-soft)]"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white">
                      <Logo connector={connector} size={18} />
                    </span>
                    <span className="truncate text-[13px] text-ink-soft">{connector.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

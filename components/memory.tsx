"use client";

import { useState } from "react";
import { FileText, Folder } from "lucide-react";
import { DOCS, DOC_IDS, FOLDERS, GRAPH_LAYOUT, LINKS, NEIGHBORS, type DocId } from "@/lib/memory";
import { Rise, SectionHead } from "./primitives";

/** Rótulo curto no grafo — o título inteiro fica no documento. */
const LABEL: Partial<Record<DocId, string>> = { visao: "Visão geral" };

/** Posição do nó em % da área do grafo, com folga para os rótulos. */
function at(id: DocId) {
  const point = GRAPH_LAYOUT[id];
  return { x: 50 + point.x * 40, y: 48 + point.y * 38 };
}

const points = [
  {
    title: "Documentos em Markdown",
    body: "Organizados em pastas, editados no próprio app, por você ou pelo agente que coordena.",
  },
  {
    title: "Referências viram ligações",
    body: "Um [[título]] no texto liga dois documentos. O grafo é desenhado a partir dessas ligações.",
  },
  {
    title: "Consultados antes de agir",
    body: "Com a skill de memória, os agentes leem o que já foi decidido antes de começar a próxima tarefa.",
  },
];

function Doc({ id, onOpen }: { id: DocId; onOpen: (id: DocId) => void }) {
  const doc = DOCS[id];
  const folder = FOLDERS.find((item) => item.id === doc.folder);

  const link = (target: DocId, key: number) => (
    <button
      key={key}
      type="button"
      onClick={() => onOpen(target)}
      className="rounded-sm font-medium text-accent underline decoration-current/40 underline-offset-[3px] hover:decoration-current"
    >
      {DOCS[target].title}
    </button>
  );

  return (
    <article aria-live="polite" aria-atomic="true" className="min-w-0">
      <p className="flex items-center gap-1.5 text-xs text-ink-faint">
        <Folder className="size-3.5" aria-hidden="true" />
        {folder?.name ?? "Memória"}
        <FileText className="size-3.5" aria-hidden="true" />
        <span className="sr-only">{doc.title}</span>
      </p>
      <div className="mt-4 space-y-3 text-[15px] leading-6 text-ink-soft">
        {doc.blocks.map((block, index) => {
          if (block.type === "h1")
            return (
              <h3 key={index} className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
                {block.text}
              </h3>
            );
          if (block.type === "quote")
            return (
              <p key={index} className="border-l-2 border-line-strong pl-3 text-xs text-ink-faint">
                {block.text}
              </p>
            );
          if (block.type === "p")
            return (
              <p key={index}>
                {block.parts.map((part, i) => (typeof part === "string" ? part : link(part.link, i)))}
              </p>
            );
          return (
            <ul key={index} className="list-disc space-y-1 pl-5 marker:text-ink-faint">
              {block.items.map((item, i) => (
                <li key={i}>
                  {item.map((part, j) => (typeof part === "string" ? part : link(part.link, j)))}
                </li>
              ))}
            </ul>
          );
        })}
      </div>
    </article>
  );
}

/**
 * Memória e grafo: o grafo à esquerda e o documento à direita, como a tela de
 * Memory do app. Selecionar um nó abre o documento e acende os vizinhos; os
 * links do texto fazem o mesmo. Os dados são os da demonstração do herói.
 */
export function Memory() {
  const [selected, setSelected] = useState<DocId>("posic");
  const near = NEIGHBORS[selected];

  return (
    // Faixa de largura total, não um cartão: a interface lá dentro é o único
    // cartão da seção, sem cartão dentro de cartão.
    <section id="memoria" aria-labelledby="memoria-titulo" className="section panel relative overflow-hidden">
      <div className="shell">
        <div className="relative">
          {/* A textura de favo, só num canto: a assinatura da marca sem
              disputar com a interface. */}
          <div
            aria-hidden="true"
            className="comb pointer-events-none absolute inset-0 opacity-[0.12] [mask-image:radial-gradient(520px_at_100%_0,black,transparent_70%)]"
          />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-end lg:gap-16">
            <SectionHead
              id="memoria-titulo"
              title="O trabalho termina. O conhecimento fica."
              lead="Decisões, planos e resultados viram documentos ligados entre si. A próxima tarefa começa de onde a última parou."
            />
            <Rise as="ul" stagger="li" className="grid gap-5 sm:grid-cols-3 lg:gap-6">
              {points.map((point) => (
                <li key={point.title} className="border-t border-[var(--panel-card-line)] pt-4">
                  <h3 className="text-[15px] font-semibold text-[var(--panel-ink)]">{point.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--panel-ink-soft)]">{point.body}</p>
                </li>
              ))}
            </Rise>
          </div>

          <Rise className="relative mt-12 overflow-hidden rounded-[var(--radius-frame)] bg-[var(--panel-card)] [box-shadow:inset_0_0_0_1px_var(--panel-card-line),var(--shadow-float)]">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <p className="text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase">Memory · Graph</p>
              <p className="hidden text-xs text-ink-faint sm:block">Selecione um documento para ver as ligações</p>
            </div>

            <div className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              {/* Grafo: arestas em SVG, nós como botões de verdade (foco e
                  teclado de graça). */}
              <div className="relative aspect-square border-b border-line sm:aspect-[4/3] md:aspect-auto md:min-h-[400px] md:border-r md:border-b-0">
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 size-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {LINKS.map(([a, b]) => {
                    const lit = a === selected || b === selected;
                    const from = at(a);
                    const to = at(b);
                    return (
                      <line
                        key={`${a}-${b}`}
                        x1={from.x.toFixed(2)}
                        y1={from.y.toFixed(2)}
                        x2={to.x.toFixed(2)}
                        y2={to.y.toFixed(2)}
                        vectorEffect="non-scaling-stroke"
                        stroke={lit ? "var(--color-amber)" : "var(--line-strong)"}
                        strokeWidth={lit ? 1.75 : 1}
                        className="transition-[stroke] duration-300"
                      />
                    );
                  })}
                </svg>

                <ul aria-label="Documentos da memória" className="absolute inset-0">
                  {DOC_IDS.map((id) => {
                    const point = at(id);
                    const active = id === selected;
                    const neighbor = near.has(id);
                    return (
                      <li
                        key={id}
                        className="absolute -translate-x-1/2 -translate-y-[7px]"
                        style={{ left: `${point.x.toFixed(2)}%`, top: `${point.y.toFixed(2)}%` }}
                      >
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSelected(id)}
                          className="group flex flex-col items-center gap-1 rounded-md px-1 pb-0.5"
                        >
                          <span
                            aria-hidden="true"
                            className={`block rounded-full transition-all duration-300 ${
                              active
                                ? "size-3.5 bg-amber ring-4 ring-amber/25"
                                : neighbor
                                  ? "size-2.5 bg-amber"
                                  : "size-2 bg-ink-faint group-hover:bg-ink"
                            }`}
                          />
                          <span
                            className={`max-w-[11ch] text-center text-xs leading-tight transition-colors sm:max-w-none sm:whitespace-nowrap ${
                              active ? "font-semibold text-ink" : neighbor ? "text-ink" : "text-ink-faint group-hover:text-ink"
                            }`}
                          >
                            {LABEL[id] ?? DOCS[id].title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="p-5 sm:p-7">
                <Doc id={selected} onOpen={setSelected} />
              </div>
            </div>
          </Rise>
          <p className="relative mt-4 text-center text-sm text-[var(--panel-ink-soft)]">
            Os mesmos documentos da demonstração. No app, o grafo fica na tela de Memory, ao lado do
            texto.
          </p>
        </div>
      </div>
    </section>
  );
}

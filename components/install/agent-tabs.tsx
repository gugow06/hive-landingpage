"use client";

import { useId, useRef, useState } from "react";
import { BrandIcon, type BrandIconName } from "../brand-icons";
import type { Agent } from "./path-commands";

const OPTIONS: { id: Agent; label: string; icon: BrandIconName }[] = [
  { id: "claude", label: "Claude Code", icon: "claude" },
  { id: "codex", label: "Codex", icon: "openai" },
  { id: "gemini", label: "Gemini CLI", icon: "gemini" },
];

/**
 * Abas por agente (Claude Code, Codex, Gemini CLI), cada uma com o logo à esquerda.
 * Padrão WAI-ARIA de abas: setas movem entre elas, Home e End vão às pontas, e só a aba
 * ativa entra na ordem de Tab. Diferente das abas de sistema, a escolha aqui é local ao
 * bloco: quem usa um agente não precisa ver os outros, mas cada agente tem o seu passo a passo.
 */
export function AgentTabs({
  panels,
  label = "Agente",
}: {
  panels: Record<Agent, React.ReactNode>;
  label?: string;
}) {
  const [agent, setAgent] = useState<Agent>("claude");
  const group = useId();
  const refs = useRef<Partial<Record<Agent, HTMLButtonElement | null>>>({});

  function onKeyDown(event: React.KeyboardEvent) {
    const index = OPTIONS.findIndex((option) => option.id === agent);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % OPTIONS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + OPTIONS.length) % OPTIONS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = OPTIONS.length - 1;
    else return;
    event.preventDefault();
    const target = OPTIONS[next]!.id;
    setAgent(target);
    refs.current[target]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex flex-wrap gap-1 border-b border-line">
        {OPTIONS.map((option) => {
          const selected = option.id === agent;
          return (
            <button
              key={option.id}
              ref={(node) => {
                refs.current[option.id] = node;
              }}
              type="button"
              role="tab"
              id={`${group}-tab-${option.id}`}
              aria-selected={selected}
              aria-controls={`${group}-panel-${option.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setAgent(option.id)}
              className={`-mb-px inline-flex h-11 items-center gap-2 border-b-2 px-4 text-sm font-semibold transition-colors ${
                selected ? "border-amber text-ink" : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              <BrandIcon name={option.icon} className="size-[18px]" />
              {option.label}
            </button>
          );
        })}
      </div>

      {OPTIONS.map((option) => (
        <div
          key={option.id}
          role="tabpanel"
          id={`${group}-panel-${option.id}`}
          aria-labelledby={`${group}-tab-${option.id}`}
          hidden={option.id !== agent}
          className="space-y-4 pt-5"
        >
          {panels[option.id]}
        </div>
      ))}
    </div>
  );
}

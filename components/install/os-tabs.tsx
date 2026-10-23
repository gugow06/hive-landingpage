"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { OsIcon } from "./os-icons";

export type Os = "windows" | "macos" | "linux";

const OPTIONS: { id: Os; label: string }[] = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
];

const OsContext = createContext<{ os: Os; setOs: (os: Os) => void } | null>(null);

function detectOs(): Os {
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "windows";
  if (/Mac|iPhone|iPad/i.test(ua)) return "macos";
  return "linux";
}

/**
 * Guarda o sistema escolhido para a página inteira: quem escolhe "Windows" numa
 * aba vê Windows em todas as outras. O padrão é o sistema detectado pelo
 * navegador; a escolha da pessoa vale pela sessão.
 *
 * O HTML do servidor sai em macOS (não há como saber o sistema ali) e troca
 * logo depois de montar, se for outro.
 */
export function OsProvider({ children }: { children: React.ReactNode }) {
  const [os, setOsState] = useState<Os>("macos");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem("hive-install-os");
    } catch {
      /* sem armazenamento: segue com o detectado */
    }
    setOsState(saved === "windows" || saved === "macos" || saved === "linux" ? saved : detectOs());
  }, []);

  const setOs = useCallback((next: Os) => {
    setOsState(next);
    try {
      sessionStorage.setItem("hive-install-os", next);
    } catch {
      /* ignora */
    }
  }, []);

  return <OsContext.Provider value={{ os, setOs }}>{children}</OsContext.Provider>;
}

/**
 * Abas Windows / macOS / Linux. Teclado: setas movem entre as abas, Home e End
 * vão às pontas (padrão WAI-ARIA de abas, com foco "roving").
 */
export function OsTabs({ panels, label = "Sistema operacional" }: { panels: Record<Os, React.ReactNode>; label?: string }) {
  const context = useContext(OsContext);
  if (!context) throw new Error("OsTabs precisa estar dentro de <OsProvider>.");
  const { os, setOs } = context;
  const group = useId();
  const refs = useRef<Partial<Record<Os, HTMLButtonElement | null>>>({});

  function onKeyDown(event: React.KeyboardEvent) {
    const index = OPTIONS.findIndex((option) => option.id === os);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % OPTIONS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + OPTIONS.length) % OPTIONS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = OPTIONS.length - 1;
    else return;
    event.preventDefault();
    const target = OPTIONS[next]!.id;
    setOs(target);
    refs.current[target]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="inline-flex rounded-full bg-bg-weak p-1 [box-shadow:var(--ring-soft)]"
      >
        {OPTIONS.map((option) => {
          const selected = option.id === os;
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
              onClick={() => setOs(option.id)}
              className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${
                selected ? "bg-amber text-ink-900" : "text-ink-soft hover:text-ink"
              }`}
            >
              <OsIcon os={option.id} />
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
          hidden={option.id !== os}
          className="mt-5 space-y-4"
        >
          {panels[option.id]}
        </div>
      ))}
    </div>
  );
}

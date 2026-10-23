"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  /** Um comando por linha. Linhas que começam com `#` são comentários. */
  code: string;
  /** Rótulo do cabeçalho, ex.: "Terminal" ou "PowerShell". */
  label?: string;
  /** Prefixo de cada comando (não é copiado). */
  prompt?: string;
  className?: string;
}

/**
 * Bloco de comandos: sempre escuro (a classe `dark` redeclara os tokens só
 * aqui), com a borda de vidro do site e um botão para copiar.
 *
 * O prompt (`$`) e os comentários são só visuais: o botão copia os comandos
 * sem `$`, prontos para colar. O texto dos comandos fica selecionável e o
 * bloco rola na horizontal sem quebrar linha — um comando quebrado no meio
 * engana quem lê e quem copia à mão.
 */
export function CodeBlock({ code, label = "Terminal", prompt = "$", className = "" }: CodeBlockProps) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lines = code.split("\n");
  const commands = lines.filter((line) => line.trim() && !line.trim().startsWith("#")).join("\n");

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(commands);
      ok = true;
    } catch {
      // Sem a API de área de transferência (página sem HTTPS, navegador antigo):
      // cai no método antigo, com um campo temporário.
      try {
        const field = document.createElement("textarea");
        field.value = commands;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        ok = document.execCommand("copy");
        document.body.removeChild(field);
      } catch {
        ok = false;
      }
    }
    setState(ok ? "copied" : "error");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2200);
  }

  return (
    <figure className={`dark rounded-[var(--radius-frame)] bg-bg text-ink [box-shadow:var(--ring)] ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
        <figcaption className="text-xs font-medium tracking-[0.04em] text-ink-faint">{label}</figcaption>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-ink-soft transition-colors hover:bg-white/10 hover:text-ink"
        >
          {state === "copied" ? (
            <Check className="size-3.5 text-accent" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
          <span aria-live="polite">
            {state === "copied" ? "Copiado" : state === "error" ? "Não foi possível copiar" : "Copiar"}
          </span>
          <span className="sr-only"> os comandos</span>
        </button>
      </div>
      {/* `tabIndex` para o teclado poder rolar comandos longos. */}
      <pre tabIndex={0} aria-label={`Comandos: ${label}`} className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-6">
        <code>
          {lines.map((line, index) =>
            line.trim().startsWith("#") ? (
              <span key={index} className="block text-ink-faint">
                {line}
              </span>
            ) : line.trim() === "" ? (
              <span key={index} className="block h-3" aria-hidden="true" />
            ) : (
              <span key={index} className="block whitespace-pre">
                <span aria-hidden="true" className="mr-2.5 text-accent select-none">
                  {prompt}
                </span>
                {line}
              </span>
            ),
          )}
        </code>
      </pre>
    </figure>
  );
}

"use client";

import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
  /** Marca o item com um ponto âmbar (e "recomendado" para o leitor de tela). */
  recommended?: boolean;
}

/**
 * Índice da página. No desktop fica fixo ao lado do texto e destaca a seção
 * que está na tela; no celular vira uma linha de atalhos. Os links são
 * âncoras `#id` comuns: o SmoothScroll as intercepta e rola sem escrever o `#`
 * na URL.
 */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    if (!sections.length || typeof IntersectionObserver !== "function") return;
    // A seção "da vez" é a última cujo topo já passou da faixa de leitura (um
    // pouco abaixo da navbar).
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Neste guia" className="lg:sticky lg:top-28">
      <p className="text-xs font-semibold tracking-[0.08em] text-ink-faint uppercase">Neste guia</p>
      <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-0.5">
        {items.map((item) => {
          const current = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={`tap block rounded-md px-2.5 py-1.5 text-sm transition-colors lg:-ml-2.5 ${
                  current ? "bg-bg-weak font-medium text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.label}
                {item.recommended && (
                  <>
                    <span aria-hidden="true" className="ml-2 inline-block size-1.5 rounded-full bg-amber align-middle" />
                    <span className="sr-only"> (recomendado)</span>
                  </>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

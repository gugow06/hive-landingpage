import { Info, TriangleAlert } from "lucide-react";

type Kind = "nota" | "atencao" | "beta";

const STYLE: Record<Kind, { label: string; icon: typeof Info }> = {
  nota: { label: "Nota", icon: Info },
  atencao: { label: "Atenção", icon: TriangleAlert },
  beta: { label: "Beta", icon: Info },
};

/**
 * Destaque dentro do texto. Não é um cartão: é uma faixa com um filete âmbar
 * à esquerda, para não competir com os blocos de código.
 *
 * O rótulo ("Nota", "Atenção") é texto de verdade, não só ícone e cor, para o
 * leitor de tela e para quem não distingue as cores.
 */
export function Callout({ kind = "nota", title, children }: { kind?: Kind; title?: string; children: React.ReactNode }) {
  const { label, icon: Icon } = STYLE[kind];
  return (
    <aside
      role="note"
      className={`relative rounded-r-xl bg-bg-weak py-3.5 pr-4 pl-5 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:rounded-full ${
        kind === "atencao" ? "before:bg-amber" : "before:bg-line-strong"
      }`}
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
        <Icon className={`size-4 ${kind === "atencao" ? "text-accent" : "text-ink-soft"}`} aria-hidden="true" />
        {title ?? label}
      </p>
      <div className="mt-1.5 max-w-[60ch] space-y-2 text-[15px] leading-6 text-ink-soft">{children}</div>
    </aside>
  );
}

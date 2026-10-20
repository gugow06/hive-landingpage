import { Brain, GitBranch, Plug, ShieldCheck } from "lucide-react";
import { Rise } from "./primitives";

const benefits = [
  {
    icon: GitBranch,
    title: "Hierarquia de verdade",
    body: "Cada agente com papel, chefe e escopo. Ninguém sai inventando.",
  },
  {
    icon: Brain,
    title: "Memória compartilhada",
    body: "O que foi decidido fica decidido. Nenhuma sessão começa do zero.",
  },
  {
    icon: ShieldCheck,
    title: "Governança real",
    body: "Auditoria em tempo real e teto de gasto por agente. Você dorme.",
  },
  {
    icon: Plug,
    title: "Seus agentes",
    body: "Claude Code, Codex, Cursor. Se recebe uma chamada, está contratado.",
  },
];

/** Os quatro cards do AbacatePay — 280×262 — agora como seção própria, depois
 *  do organograma: primeiro você vê a colmeia montar, depois por que importa. */
export function Benefits() {
  return (
    <section id="beneficios" className="py-28">
      <div className="shell flex flex-col items-center">
        <Rise className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Por que funciona</p>
          <h2 className="display mt-4 text-[clamp(2rem,4.5vw,2.75rem)] text-ink">
            Quatro coisas que{" "}
            <span className="text-accent-display dark:text-amber">um chat solto não te dá.</span>
          </h2>
        </Rise>

        <Rise as="ul" stagger="li" delay={80} className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <li
              key={benefit.title}
              className="flex h-[262px] w-full flex-col items-center justify-center gap-5 rounded-[var(--radius-card)] bg-surface px-6 py-12 text-center [box-shadow:var(--ring)] lg:w-[280px]"
            >
              <span className="inline-flex size-20 items-center justify-center rounded-3xl bg-amber/12 text-accent dark:text-amber">
                <benefit.icon className="size-9" aria-hidden="true" strokeWidth={1.5} />
              </span>
              <span>
                {/* Altura fixa no título: sem ela, um título de duas linhas
                    desalinha o ícone deste card em relação aos vizinhos. */}
                <span className="flex min-h-[3.5rem] items-start justify-center font-display text-xl font-semibold tracking-[-0.03em] text-ink">
                  {benefit.title}
                </span>
                <span className="block text-sm text-ink-soft">{benefit.body}</span>
              </span>
            </li>
          ))}
        </Rise>
      </div>
    </section>
  );
}

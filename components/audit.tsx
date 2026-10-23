import { History, PauseCircle, ShieldCheck, Wallet } from "lucide-react";
import { Rise, SectionHead } from "./primitives";

/**
 * Linhas no formato do feed de auditoria do app (`ui/src/pages/audit/
 * AuditFeed.tsx`): ator, verbo, entidade, código da ação e hora relativa. Os
 * verbos são os de `activity-format.ts`; as ações de documento da memória
 * ainda não têm verbo próprio no app e aparecem com o texto padrão — aqui
 * também. O conteúdo é o do exemplo do organograma (empresa Encurtador).
 */
const rows = [
  {
    actor: "Vera",
    hibee: "guardia-listening",
    verb: "commented on",
    entity: "ENC-5",
    excerpt: "Teste de carga passou. Regressão do redirect ok.",
    action: "issue.comment_added",
    run: true,
    time: "2m ago",
  },
  {
    actor: "Rubi",
    hibee: "escriba-working",
    verb: "updated",
    entity: "ENC-3",
    action: "issue.updated",
    run: true,
    time: "9m ago",
  },
  {
    actor: "Darnold",
    hibee: "rainha-idle",
    verb: "memory document created",
    entity: "Expiração de links",
    action: "memory_document.created",
    run: true,
    time: "14m ago",
  },
  {
    actor: "Íris",
    hibee: "arquiteta-working",
    verb: "created",
    entity: "ENC-4",
    action: "issue.created",
    run: true,
    time: "21m ago",
  },
  {
    actor: "Darnold",
    hibee: "rainha-idle",
    verb: "created",
    entity: "Vera",
    action: "agent.created",
    run: true,
    time: "26m ago",
  },
  {
    actor: "Board",
    verb: "created",
    entity: "ENC-1",
    action: "issue.created",
    run: false,
    time: "31m ago",
  },
];

const controls = [
  {
    icon: History,
    title: "Registro de cada ação",
    body: "Quem fez, o que fez, em qual tarefa e quando, seja de uma pessoa, de um agente ou do sistema.",
  },
  {
    icon: Wallet,
    title: "Orçamento mensal",
    body: "Um teto de gasto por agente e outro para a empresa.",
  },
  {
    icon: PauseCircle,
    title: "Pausa a qualquer momento",
    body: "Qualquer agente para quando você mandar.",
  },
  {
    icon: ShieldCheck,
    title: "Aprovação de contratações",
    body: "Se você ativar, novos agentes só entram depois do seu aval.",
  },
];

export function Audit() {
  return (
    <section id="controle" aria-labelledby="controle-titulo" className="section">
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-16">
        <div>
          <SectionHead
            id="controle-titulo"
            title="Autonomia para a equipe. Visibilidade para você."
            lead="Os agentes trabalham por conta própria e tudo o que fazem fica registrado."
          />
          <Rise as="ul" stagger="li" className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {controls.map((item) => (
              <li key={item.title}>
                <item.icon className="size-5 text-accent" aria-hidden="true" strokeWidth={1.75} />
                <h3 className="mt-3 text-[15px] font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-ink-soft">{item.body}</p>
              </li>
            ))}
          </Rise>
        </div>

        <figure>
          <div className="frame overflow-hidden">
            <div className="border-b border-line px-5 py-4">
              <p className="text-sm font-semibold text-ink">Activity</p>
              <p className="mt-0.5 text-xs text-ink-faint">
                Everything happening in your organization, newest first.
              </p>
            </div>
            {/* Revelação em sequência, de cima para baixo: o registro mais
                recente chega primeiro, como no feed. */}
            <Rise as="ol" stagger="li" className="divide-y divide-line" >
              {rows.map((row) => (
                <li key={`${row.action}-${row.time}`} className="flex items-start justify-between gap-3 px-5 py-3 text-sm">
                  <div className="min-w-0 space-y-1">
                    <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                        <span className="flex size-5 items-center justify-center overflow-hidden rounded-full bg-bg-weak">
                          {row.hibee ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`/hibees/${row.hibee}.svg`}
                              alt=""
                              width={20}
                              height={20}
                              loading="lazy"
                              className="size-5 translate-y-px"
                            />
                          ) : (
                            <span aria-hidden="true" className="text-[10px] font-semibold text-ink-soft">
                              B
                            </span>
                          )}
                        </span>
                        {row.actor}
                      </span>
                      <span className="text-ink-faint">{row.verb}</span>
                      <span className="font-medium text-accent">{row.entity}</span>
                    </p>
                    {row.excerpt && (
                      <p className="border-l-2 border-line pl-2 text-ink-soft">“{row.excerpt}”</p>
                    )}
                    <p className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
                      {row.run && <span className="text-accent">View run</span>}
                      <span className="font-mono">{row.action}</span>
                    </p>
                  </div>
                  <span className="shrink-0 text-xs whitespace-nowrap text-ink-faint">{row.time}</span>
                </li>
              ))}
            </Rise>
          </div>
          <figcaption className="mt-3 text-center text-sm text-ink-faint">
            Recriação do feed de atividades no formato do app, com os dados do exemplo.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

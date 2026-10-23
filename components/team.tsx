"use client";

import { useRef } from "react";
import { ORG } from "@/lib/org";
import { useOffscreenPause } from "@/lib/motion";
import { LiveHibee } from "./live-hibee";
import { OrgChart } from "./org-chart";
import { Rise, SectionHead } from "./primitives";

const cto = ORG.reports[0]!;
const [front, back, qa] = cto.reports as [typeof cto, typeof cto, typeof cto];

/** Um Hibee parado, flutuando — só o Darnold roda o runtime 3D (veja o README). */
function Bee({ hibee, delay }: { hibee: string; delay: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/hibees/${hibee}.svg`}
      alt=""
      width={56}
      height={56}
      loading="lazy"
      className="bob -mx-1 size-14"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

const roles = [
  {
    verb: "Coordena",
    who: `${ORG.name} (${ORG.title}) e ${cto.name} (${cto.title})`,
    body: "Recebem o objetivo, quebram em subtarefas e respondem pelo resultado.",
  },
  {
    verb: "Executa",
    who: `${front.name} e ${back.name}`,
    body: `Cada um no seu executor: ${front.adapter} e ${back.adapter}.`,
  },
  {
    verb: "Revisa",
    who: `${qa.name} (${qa.title})`,
    body: "Testa e devolve o que não passou antes de a tarefa fechar.",
  },
];

/**
 * Equipe e execução: quem coordena, quem executa e quem revisa, ao lado do
 * organograma do produto montado para uma tarefa concreta. O organograma é o
 * mesmo layout do app (`lib/org.ts`) e desenha as conexões ao entrar na tela.
 */
export function Team() {
  const scope = useRef<HTMLElement>(null);
  useOffscreenPause(scope);

  return (
    <section id="produto" ref={scope} aria-labelledby="produto-titulo" className="section dark bg-bg">
      <div className="shell grid gap-12 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:items-center xl:gap-16">
        <div>
          <SectionHead
            id="produto-titulo"
            title="Cada agente com um papel, um chefe e uma tarefa."
            lead="Os Hibees são os agentes da sua empresa. O organograma mostra quem responde a quem, e é por ele que o trabalho desce."
          />

          <Rise as="ul" stagger="li" className="mt-10 space-y-6">
            {roles.map((role, index) => (
              <li key={role.verb} className="flex items-center gap-4">
                <span className="flex w-[124px] shrink-0 items-end justify-start">
                  {index === 0 ? (
                    <>
                      <LiveHibee
                        palette={ORG.palette}
                        pose="idle"
                        fallback="rainha-idle"
                        size={64}
                        label={`${ORG.name}, o agente CEO`}
                      />
                      <Bee hibee={cto.hibee} delay={0.6} />
                    </>
                  ) : index === 1 ? (
                    <>
                      <Bee hibee={front.hibee} delay={0.2} />
                      <Bee hibee={back.hibee} delay={1.1} />
                    </>
                  ) : (
                    <Bee hibee={qa.hibee} delay={0.8} />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-ink">
                    <strong className="font-display font-semibold">{role.verb}</strong>
                    <span className="text-ink-soft"> · {role.who}</span>
                  </span>
                  <span className="mt-0.5 block text-[15px] leading-6 text-ink-soft">{role.body}</span>
                </span>
              </li>
            ))}
          </Rise>
        </div>

        {/* A tarefa que deu origem ao time, com o organograma logo abaixo. */}
        <Rise className="frame-md overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-5 py-4">
            <p className="min-w-0 text-sm">
              <span className="font-mono text-xs text-ink-faint">ENC-1</span>{" "}
              <span className="font-semibold text-ink">Lançar a API pública do encurtador</span>
            </p>
            <span className="chip">Atribuída a {ORG.name} · 4 subtarefas</span>
          </div>
          <div className="px-4 py-6 sm:px-6">
            <OrgChart />
          </div>
          <p className="border-t border-line px-5 py-3 text-xs text-ink-faint">
            Mesmo layout do organograma do app: cartões, ligações e status de cada agente.
          </p>
        </Rise>
      </div>
    </section>
  );
}

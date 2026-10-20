import { ArrowRight } from "lucide-react";
import { Rise } from "./primitives";

export function Hero() {
  return (
    // O herói ocupa a tela toda menos a navbar fixa; `svh` evita que a barra
    // do navegador no celular empurre o conteúdo para fora.
    <section
      id="topo"
      className="relative flex min-h-[calc(100svh-88px)] items-center overflow-hidden pb-16"
    >
      {/* Halo âmbar na base do herói, como o halo verde do AbacatePay. O pico
          fica acima da borda inferior: a seção tem overflow-hidden, e um halo
          ainda forte na borda viraria um corte reto atravessando a página. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(1100px_560px_at_50%_84%,var(--halo),transparent_70%)]"
      />

      <div className="shell relative flex w-full flex-col items-center text-center">
        <Rise className="flex flex-col items-center">
          <p className="eyebrow">Orquestração de agentes com memória</p>

          <h1 className="display mt-5 max-w-5xl text-[clamp(2.5rem,6.5vw,4rem)] text-ink">
            O time de IA da sua empresa,{" "}
            <span className="text-accent-display dark:text-amber">
              ordenado, contextualizado e sob controle.
            </span>
          </h1>

          <p className="lead mx-auto mt-7 max-w-xl text-balance">
            Você já usa IA. O que falta é uma que lembre do que vocês combinaram ontem. O Hive dá aos
            seus agentes um chefe, um organograma e uma memória que não zera.
          </p>

          <div className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <a href="#lista" className="btn btn-primary btn-lg w-full sm:w-auto">
              Entrar na lista de espera
              <ArrowRight className="size-5" aria-hidden="true" />
            </a>
            <a href="#agentes" className="btn btn-secondary btn-lg w-full sm:w-auto">
              Ver a colmeia trabalhando
            </a>
          </div>

          <p className="mt-5 text-sm text-ink-faint">
            Sem cartão. Acesso antecipado para quem está construindo agora.
          </p>
        </Rise>
      </div>
    </section>
  );
}

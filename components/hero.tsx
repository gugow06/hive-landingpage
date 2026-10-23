import { ArrowRight } from "lucide-react";
import { HexField } from "./hex-field";
import { HeroVideo } from "./hero-video";
import { ShinyButton } from "./ui/shiny-button";

/**
 * A abertura é uma faixa escura. No tema escuro ela nasce do mesmo cinza da
 * página e da navbar — sem emenda no topo, só os cantos de baixo arredondados —
 * e ganha cor no degradê âmbar que sobe até a base. No tema claro é um painel
 * escuro sobre o branco, com todos os cantos arredondados. Título grande e
 * leve, as duas chamadas e, no fim, a interface do produto emergindo: o vídeo
 * encosta na base da faixa e é cortado reto por ela. Na primeira tela só o topo
 * dele aparece — `--peek` é quanto.
 *
 * A faixa é escura nos dois temas: a classe `dark` nela redeclara os tokens só
 * ali dentro, então botões, malha e legendas já saem com as cores certas sem
 * ramificar cada componente. O arredondamento e a borda de vidro ficam em
 * `.hero-band` (globals.css), porque a variante `dark:` do Tailwind valeria
 * sempre dentro de um elemento que já é `.dark`.
 */
export function Hero() {
  return (
    <section
      id="topo"
      style={{ "--peek": "clamp(120px, 19svh, 176px)" } as React.CSSProperties}
      className="px-3 pt-3 pb-5 sm:px-5"
    >
      <div className="hero-band dark relative overflow-hidden bg-bg text-ink">
        <div className="relative">
          {/* Malha da colmeia, discreta, sumindo antes da base. */}
          <HexField className="absolute inset-0 size-full [mask-image:linear-gradient(to_bottom,black_30%,transparent_75%)]" />

          {/* O degradê âmbar atrás do vídeo: o equivalente do azul da referência.
              Começa um pouco acima do topo do vídeo — por isso já aparece na
              primeira tela — e engrossa até a base da faixa. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 top-[calc(100svh-72px-12px-var(--peek)-300px)] [background:linear-gradient(to_bottom,transparent,rgba(255,184,0,0.14)_26%,rgba(236,156,0,0.42)_66%,rgba(222,130,0,0.64))]"
          />

          <div className="shell relative">
            {/* Primeira tela: tudo menos a faixa do vídeo. Sem revelação animada —
                o título é o primeiro conteúdo da página, e escondê-lo até o GSAP
                carregar só atrasaria a leitura. */}
            <div className="flex min-h-[max(460px,calc(100svh-72px-12px-var(--peek)))] flex-col items-center justify-center py-14 text-center">
              <h1 className="display max-w-[1020px] text-[clamp(2.5rem,5.6vw,5rem)] leading-[1.06] font-medium tracking-[-0.045em] text-balance text-ink">
                <span className="block">Sua equipe de IA.</span>
                <span className="block text-accent-display">Com direção, memória e controle.</span>
              </h1>

              <p className="lead mx-auto mt-7 max-w-xl text-balance text-[clamp(1.0625rem,1.6vw,1.375rem)] leading-[1.55]">
                Organize agentes, delegue tarefas e conecte o conhecimento da sua operação.
              </p>

              <div className="mt-10 flex w-full flex-col items-center gap-4 sm:w-auto">
                <ShinyButton href="/install" className="w-full sm:w-auto">
                  Instalar o Hive
                  <ArrowRight className="nudge size-5" aria-hidden="true" />
                </ShinyButton>
                {/* O que tira o medo de clicar: quanto custa e onde roda. */}
                <p className="text-sm text-ink-soft">Gratuito e de código aberto. Para Windows, macOS e Linux.</p>
              </div>
            </div>

            {/* Sem padding embaixo: o vídeo encosta na base da faixa. */}
            <div id="demo" className="scroll-mt-24">
              <HeroVideo />
            </div>
        </div>
        </div>
      </div>

      {/* A legenda fica fora da faixa, no cinza logo abaixo: o vídeo encosta na
          base e não sobra lugar para ela ali. */}
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-ink-soft">
        Interface recriada a partir do app, com uma empresa fictícia e o tempo de execução
        comprimido.
      </p>
    </section>
  );
}

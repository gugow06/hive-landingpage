import {
  AlertTriangle,
  ArrowRight,
  FileText,
  FolderTree,
  GitBranch,
  Lock,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { GithubMark, REPO } from "./github";
import { FaqItem } from "./faq-item";
import { Rise } from "./primitives";
import { Timeline } from "./timeline";

function SectionHead({
  eyebrow,
  title,
  highlight,
  lead,
  center = false,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  lead?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display mt-4 text-[clamp(2rem,4.5vw,2.75rem)] text-ink">
        {title} {highlight && <span className="text-accent-display dark:text-amber">{highlight}</span>}
      </h2>
      {lead && <p className="lead mt-5">{lead}</p>}
    </div>
  );
}

/**
 * Print do produto rodando — não é mock, sai do app em `pnpm dev`.
 * As duas versões vão no HTML e o CSS escolhe: assim o print acompanha o tema
 * da página sem esperar o JS decidir, e sem piscar o tema errado na carga.
 */
function Shot({ name, alt, caption }: { name: string; alt: string; caption: string }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-[var(--radius-card)] [box-shadow:var(--ring),var(--shadow-float)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/app/${name}-light.png`}
          alt={alt}
          width={1800}
          height={1025}
          className="block w-full dark:hidden"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/app/${name}-dark.png`}
          alt={alt}
          width={1800}
          height={1025}
          className="hidden w-full dark:block"
        />
      </div>
      <figcaption className="mt-3 text-center text-sm text-ink-faint">{caption}</figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- problema */

export function Problem() {
  return (
    <section id="problema" className="py-28">
      <div className="shell">
        <Rise>
          <SectionHead
            eyebrow="O que é o Hive"
            title="O problema não é a falta de IA."
            highlight="É a falta de contexto."
            center
          />
        </Rise>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Rise className="card p-10">
            <h3 className="flex items-center gap-3 font-display text-xl font-semibold text-ink">
              <AlertTriangle className="size-5 text-ink-faint" aria-hidden="true" />
              Hoje
            </h3>
            <p className="mt-5 text-ink-soft">
              Quatro abas de IA abertas, cada uma com metade da história. Você reexplica o projeto
              pela terceira vez hoje. A decisão de terça já virou pó. E delegar dá medo — porque você
              não sabe o que a IA vai decidir sozinha.
            </p>
          </Rise>

          {/* O lado da solução ganha o anel âmbar — é onde o olho deve parar. */}
          <Rise delay={100} className="card relative overflow-hidden p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit] [box-shadow:inset_0_0_0_1px_var(--color-amber)]"
            />
            <h3 className="flex items-center gap-3 font-display text-xl font-semibold text-ink">
              <Sparkles className="size-5 text-accent dark:text-amber" aria-hidden="true" />
              Com o Hive
            </h3>
            <p className="mt-5 text-ink-soft">
              Um time de agentes com organograma e uma memória integrada — o segundo cérebro da
              empresa. Eles agem com base no que já foi decidido, você aprova o que importa, e o
              contexto para de evaporar.
            </p>
          </Rise>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- como funciona */

const steps = [
  {
    title: "Você diz o que quer",
    body: "Em português, do jeito que você explicaria para um sócio. Esse objetivo vira o topo de tudo — toda tarefa depois precisa traçar um caminho de volta até ele.",
  },
  {
    title: "Darnold monta o time",
    body: "O agente no topo da colmeia lê o objetivo, propõe a estratégia e diz de quem precisa: CTO, front, back, QA. Você aprova antes de qualquer um rodar.",
  },
  {
    title: "A colmeia trabalha",
    body: "Cada agente consulta a memória da empresa antes de agir. Ninguém começa do zero, ninguém contradiz o que já ficou decidido na semana passada.",
  },
  {
    title: "Você acompanha de longe",
    body: "Log de auditoria em tempo real, teto de gasto por agente, aprovações esperando você. Autonomia para a colmeia, controle para quem assina embaixo.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative overflow-hidden py-28">
      <div className="shell">
        <Rise>
          <SectionHead
            eyebrow="Como funciona"
            title="Um time hierárquico"
            highlight="com memória compartilhada."
            lead="Não são robôs soltos. É um time com papéis claros, coordenados entre si e ligados na mesma memória."
          />
        </Rise>

        <Timeline steps={steps} />

        <Rise delay={80} className="mt-16">
          <Shot
            name="org"
            alt="Organograma dentro do Hive: Darnold, CEO, no topo; abaixo Íris, CTO; e abaixo dela Nico (Dev Front-end), Rubi (Dev Back-end) e Vera (QA), cada um com o adaptador que executa — Claude Code, Codex, Cursor e Process."
            caption="O mesmo time, dentro do produto."
          />
        </Rise>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- memória */

const memoryFeatures = [
  {
    icon: FolderTree,
    title: "Pastas, como você já organiza",
    body: "O conhecimento da empresa em hierarquia — por área, tema ou processo.",
  },
  {
    icon: FileText,
    title: "Markdown, editado ali mesmo",
    body: "Sem exportar, sem copiar e colar. Simples, versionado e acessível.",
  },
  {
    icon: Lock,
    title: "Guardado com cuidado",
    body: "Criptografado e isolado por empresa. O que é seu continua seu.",
  },
];

export function Memory() {
  return (
    <section id="memoria" className="py-28">
      <div className="shell">
        <Rise>
          <SectionHead
            eyebrow="Grafo de conhecimento"
            title="A memória que faz a IA"
            highlight="parar de se contradizer."
            lead="O Grafo de Conhecimento guarda o que a empresa é, sabe e decidiu. Os agentes consultam, criam e editam conforme o trabalho pede — e a decisão de ontem continua valendo amanhã."
            center
          />
        </Rise>

        <Rise delay={80} className="mt-14">
          <Shot
            name="memoria"
            alt="Tela de memória do Hive: à esquerda a base de conhecimento com as pastas decisoes e produto; à direita o documento “Decisão: stack do encurtador”, com a escolha de Node.js e Postgres, quem decidiu e a data."
            caption="A memória do Hive, rodando de verdade."
          />
        </Rise>

        <Rise as="ul" stagger="li" delay={120} className="mt-14 grid gap-8 md:grid-cols-3">
          {memoryFeatures.map((feature) => (
            <li key={feature.title} className="flex gap-4">
              <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber/12 text-accent dark:text-amber">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-ink">{feature.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{feature.body}</p>
              </div>
            </li>
          ))}
        </Rise>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- diferencial */

const pillars = [
  {
    icon: GitBranch,
    title: "Orquestramento hierárquico",
    body: "Agentes com função e chefe — não robôs isolados. Um time coordenado que entrega.",
  },
  {
    icon: ScrollText,
    title: "Memória integrada persistente",
    body: "O Grafo de Conhecimento registra o que a empresa é, sabe e decidiu. A IA nunca mais se contradiz.",
  },
  {
    icon: ShieldCheck,
    title: "Governança real",
    body: "Log de auditoria em tempo real. Autonomia para os agentes, visibilidade total para o founder.",
  },
];

export function Differential() {
  return (
    <section id="diferencial" className="py-10">
      <div className="shell">
        <Rise className="panel relative overflow-hidden rounded-[var(--radius-panel)] px-6 py-24 md:px-16">
          <div
            aria-hidden="true"
            className="comb pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(700px_at_80%_0,black,transparent_70%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background:radial-gradient(700px_at_80%_0,rgba(255,184,0,0.22),transparent_65%)]"
          />
          <div className="relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[13px] font-semibold tracking-[0.12em] text-[var(--panel-accent)] uppercase">
                Diferencial
              </p>
              <h2 className="display mt-4 text-[clamp(2rem,4.5vw,2.75rem)]">
                Inteligência <span className="text-accent-display dark:text-amber">com propósito.</span>
              </h2>
              <p className="mt-5 text-lg leading-8 tracking-[-0.03em] text-[var(--panel-ink-soft)]">
                Orquestramento, memória e governança no mesmo lugar. É o encontro dos três que faz um
                monte de agente virar uma operação em que dá para confiar.
              </p>
            </div>

            <Rise as="ul" stagger="li" className="mt-16 grid gap-6 md:grid-cols-3">
              {pillars.map((pillar) => (
                <li
                  key={pillar.title}
                  className="rounded-[var(--radius-card)] bg-[var(--panel-card)] p-8 [box-shadow:inset_0_0_0_1px_var(--panel-card-line)]"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-amber text-ink-900">
                    <pillar.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold">{pillar.title}</h3>
                  <p className="mt-3 text-[var(--panel-ink-soft)]">{pillar.body}</p>
                </li>
              ))}
            </Rise>
          </div>
        </Rise>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- público */

const audience = [
  { title: "Solopreneur", body: "O time que você ainda não pode contratar." },
  { title: "Founder / Startup", body: "Delegar sem perder o fio da meada." },
  { title: "Indie Hacker", body: "A memória que você nunca teve tempo de montar." },
  { title: "PME tech", body: "Organiza a operação antes que ela organize você." },
];

export function Audience() {
  return (
    <section id="publico" className="py-28">
      <div className="shell">
        <Rise>
          <SectionHead
            eyebrow="Para quem é"
            title="Feito para quem"
            highlight="está construindo."
            center
          />
        </Rise>

        <Rise as="ul" stagger="li" className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {audience.map((person) => (
            <li key={person.title} className="card px-7 py-9">
              <span aria-hidden="true" className="block h-1 w-10 rounded-full bg-amber" />
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">{person.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{person.body}</p>
            </li>
          ))}
        </Rise>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- FAQ */

const faq = [
  {
    q: "O Hive substitui o Claude Code, o Codex ou o meu agente favorito?",
    a: "Não, ele manda neles. O Hive é o plano de controle: organiza, contrata e coordena os agentes que você já usa. Se o agente consegue receber uma chamada, está contratado.",
  },
  {
    q: "Preciso do Grafo de Conhecimento para usar?",
    a: "Não. O agente funciona sem o grafo. Com a skill de memória ligada, ele passa a consultar, criar, editar e remover conteúdo — e aí para de te perguntar as mesmas coisas.",
  },
  {
    q: "Como eu mantenho o controle sobre o que a IA decide?",
    a: "Toda tarefa traça um caminho até o objetivo da empresa, e o log de auditoria registra cada passo em tempo real. Você aprova contratações, define teto de gasto por agente e pausa qualquer um a qualquer momento.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "O conhecimento da empresa é guardado criptografado, com isolamento entre empresas. Segredos só chegam a quem precisa deles.",
  },
  {
    q: "Quanto custa?",
    a: "Ainda estamos definindo isso junto com os primeiros usuários. Quem entra na lista participa dessa conversa — e entra antes.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-28">
      <div className="shell grid items-start gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-24">
        {/* A coluna da esquerda é curta: fixá-la evita o vazio ao rolar a lista. */}
        <Rise className="lg:sticky lg:top-28">
          <p className="eyebrow">FAQ</p>
          <h2 className="display mt-4 text-[clamp(2rem,4.5vw,2.75rem)] text-ink">
            Perguntas <span className="text-accent-display dark:text-amber">honestas.</span>
          </h2>
          <p className="lead mt-5">
            Ficou algo de fora? Escreve pra gente:{" "}
            <a className="text-accent underline underline-offset-4 dark:text-amber" href="mailto:contato@hive.dev.br">
              contato@hive.dev.br
            </a>
            .
          </p>
        </Rise>

        <Rise delay={100} stagger="details" className="space-y-3">
          {faq.map((item) => (
            <FaqItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </Rise>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- rodapé */

const PARTNERS: { name: string; href: string; logo?: string }[] = [
  { name: "Oracle", href: "https://www.oracle.com/br/", logo: "parceiros/oracle-logo.png" },
  { name: "FIAP", href: "https://www.fiap.com.br/", logo: "parceiros/logo-fiap.png" },
];


export function Footer() {
  return (
    <footer className="footer-gold relative mt-10 overflow-hidden">
      {/* Mesma composição do diferencial: malha hexagonal e brilho radial,
          aqui em marrom claro sobre o degradê dourado. */}
      <div
        aria-hidden="true"
        className="comb-brown pointer-events-none absolute inset-0 opacity-35 [mask-image:radial-gradient(1300px_700px_at_50%_122%,black_20%,rgba(0,0,0,0.35)_75%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(700px_at_50%_125%,rgba(255,255,255,0.35),transparent_60%)]"
      />

      <div className="shell relative py-20">
        <p className="display max-w-3xl text-[clamp(1.75rem,3.5vw,2.25rem)] text-ink-900">
          Toda colmeia começa com <span className="text-[#6b3f00]">uma rainha e uma visão.</span>
        </p>

        <div className="mt-14 grid gap-10 border-t border-[rgba(23,23,23,0.16)] pt-8 md:grid-cols-[1fr_auto] md:gap-16">
          {/* Informação à esquerda, parceiros à direita. */}
          <div className="space-y-4 text-sm text-[#5c4a1f]">
            <p className="max-w-xl">
              O Hive é um fork do{" "}
              <a
                href="https://github.com/paperclipai/paperclip"
                className="font-medium text-ink-900 underline underline-offset-4"
                target="_blank"
                rel="noreferrer"
              >
                Paperclip
              </a>
              , o plano de controle open source para times de agentes de IA — com o Grafo de
              Conhecimento e a identidade da colmeia por cima.
            </p>
            <p>
              © {new Date().getFullYear()} Hive · feito no Brasil, com uma colmeia inteira de
              agentes.
            </p>
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="tap inline-flex items-center gap-2 font-medium text-ink-900 transition-opacity hover:opacity-70"
            >
              <GithubMark className="size-5" />
              Código no GitHub
            </a>
          </div>

          {/* Os arquivos entram em `images/parceiros/` e são publicados por
              `npm run sync:brand`; sem eles, o nome aparece como texto. */}
          <div>
            <p className="text-sm font-medium text-[#5c4a1f]">Parceiros</p>
            <ul className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-4">
              {PARTNERS.map((partner) => (
                <li key={partner.name}>
                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noreferrer"
                    className="tap transition-opacity hover:opacity-70"
                  >
                    {partner.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/brand/${partner.logo}`}
                        alt={partner.name}
                        height={32}
                        className="h-5 w-auto"
                      />
                    ) : (
                      <span className="font-display text-base font-bold tracking-tight text-ink-900">
                        {partner.name}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

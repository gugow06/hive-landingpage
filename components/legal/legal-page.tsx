import { LEGAL, PENDENTE } from "@/lib/legal";
import { Footer } from "../footer";
import { Nav } from "../nav";
import { SmoothScroll } from "../smooth-scroll";
import { Toc, type TocItem } from "../install/toc";

/**
 * Valor de um campo do controlador. Se ainda não foi preenchido, aparece em destaque como
 * "a definir", para ninguém publicar a página sem perceber.
 */
export function Campo({ valor }: { valor: string }) {
  if (valor !== PENDENTE) return <>{valor}</>;
  return (
    <mark className="rounded bg-amber/25 px-1.5 py-0.5 font-medium text-ink" title="Campo ainda não preenchido em lib/legal.ts">
      a definir
    </mark>
  );
}

const text = "max-w-[62ch] text-[16px] leading-7 text-ink-soft";

export function P({ children }: { children: React.ReactNode }) {
  return <p className={text}>{children}</p>;
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul className={`${text} list-disc space-y-2 pl-5 marker:text-ink-faint`}>{children}</ul>;
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="pt-2 text-balance font-display text-lg font-semibold tracking-[-0.02em] text-ink">{children}</h3>;
}

/** Tabela simples, com rolagem horizontal no celular em vez de estourar a página. */
export function Tabela({ colunas, linhas }: { colunas: string[]; linhas: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-frame)] [box-shadow:var(--ring)]" tabIndex={0} role="region" aria-label="Tabela">
      <table className="w-full min-w-[640px] border-collapse text-left text-[15px] leading-6">
        <thead>
          <tr className="border-b border-line bg-bg-weak">
            {colunas.map((coluna) => (
              <th key={coluna} scope="col" className="px-4 py-3 font-semibold text-ink">
                {coluna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {linhas.map((linha, i) => (
            <tr key={i} className="align-top">
              {linha.map((celula, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? "font-medium text-ink" : "text-ink-soft"}`}>
                  {celula}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalSection({ id, titulo, children }: { id: string; titulo: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="space-y-4">
      <h2 id={`${id}-titulo`} className="font-display text-balance text-[clamp(1.375rem,2.4vw,1.75rem)] leading-tight font-bold tracking-[-0.03em] text-ink">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

/**
 * Moldura das páginas legais: navbar, título, data de atualização, índice lateral e rodapé.
 * O conteúdo vai como filhos, em `LegalSection`.
 */
export function LegalPage({
  titulo,
  resumo,
  toc,
  children,
}: {
  titulo: string;
  resumo: string;
  toc: TocItem[];
  children: React.ReactNode;
}) {
  return (
    <>
      <SmoothScroll />
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Nav />
      <main id="conteudo" tabIndex={-1}>
        <header className="shell pt-12 pb-10 md:pt-20 md:pb-14">
          <div className="max-w-3xl">
            <h1 className="display text-[clamp(2.25rem,4.8vw,3.5rem)] font-medium tracking-[-0.045em] text-balance text-ink">{titulo}</h1>
            <p className="lead mt-5 max-w-2xl text-balance">{resumo}</p>
            <p className="mt-4 text-sm text-ink-faint">
              Atualizado em <time dateTime={LEGAL.atualizadoIso}>{LEGAL.atualizadoEm}</time>
            </p>
          </div>
        </header>
        <div className="shell grid gap-10 pb-24 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-16">
          <aside>
            <Toc items={toc} />
          </aside>
          <article className="min-w-0 max-w-[760px] space-y-14">{children}</article>
        </div>
      </main>
      <Footer />
    </>
  );
}

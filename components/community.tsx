import { Star } from "lucide-react";
import { CUSTOMERS, TESTIMONIALS } from "@/lib/social-proof";
import { BrandIcon } from "./brand-icons";
import { GithubMark, REPO } from "./github";
import { Rise, SectionHead } from "./primitives";
import { WHATSAPP_URL } from "./whatsapp-button";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`size-4 ${index < rating ? "fill-amber text-amber" : "text-line-strong"}`}
        />
      ))}
    </span>
  );
}

/**
 * Prova social e comunidade. É a última seção antes do rodapé.
 *
 * Os cartões vêm de `lib/social-proof.ts`, que nasce vazio de propósito:
 * depoimento inventado numa página de produto é propaganda enganosa. Enquanto não
 * houver relato real, a seção mostra um convite para a comunidade, e os cartões
 * aparecem sozinhos assim que a lista for preenchida.
 */
export function Community() {
  const hasProof = TESTIMONIALS.length > 0;

  return (
    <section id="comunidade" aria-labelledby="comunidade-titulo" className="section">
      <div className="shell">
        <Rise>
          <SectionHead
            id="comunidade-titulo"
            center
            title="Quem está construindo com o Hive"
            lead="O Hive é novo e a comunidade está começando. Os primeiros relatos de quem usa entram aqui."
          />
        </Rise>

        {hasProof ? (
          <Rise as="ul" stagger="li" delay={80} className="mt-14 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((person) => (
              <li key={`${person.name}-${person.company}`} className="card flex flex-col gap-5 p-8">
                <Stars rating={person.rating} />
                <blockquote className="flex-1 text-ink">“{person.quote}”</blockquote>
                <figcaption className="flex items-center gap-3">
                  {person.avatar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/social/${person.avatar}`}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                  )}
                  <span>
                    <span className="block text-sm font-semibold text-ink">{person.name}</span>
                    <span className="block text-sm text-ink-soft">
                      {person.role} · {person.company}
                    </span>
                  </span>
                </figcaption>
              </li>
            ))}
          </Rise>
        ) : (
          <Rise className="card mx-auto mt-12 max-w-3xl px-6 py-10 sm:px-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-md">
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
                  Seja uma das primeiras vozes
                </h3>
                <p className="mt-2 text-[15px] leading-6 text-ink-soft">
                  Instalou o Hive e montou uma equipe de agentes? Conte na comunidade o que funcionou e o que
                  faltou. O seu relato pode aparecer aqui.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2.5 rounded-[var(--radius-pill)] bg-[#25D366] px-6 text-[15px] font-semibold whitespace-nowrap text-[#04210f] transition-[filter] hover:brightness-95"
                >
                  <BrandIcon name="whatsapp" className="size-5" />
                  Entrar na comunidade
                  <span className="sr-only"> (abre em uma nova aba)</span>
                </a>
                <a
                  href={REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <GithubMark className="size-5" />
                  Ver o código no GitHub
                  <span className="sr-only"> (abre em uma nova aba)</span>
                </a>
              </div>
            </div>
          </Rise>
        )}

        {CUSTOMERS.length > 0 && (
          <Rise className="mt-16 flex flex-col items-center gap-8">
            <p className="text-sm text-ink-faint">Times que já usam o Hive</p>
            <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {CUSTOMERS.map((customer) => (
                <li key={customer.name} className="flex items-center">
                  {customer.logo ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/social/${customer.logo}`}
                        alt={customer.name}
                        height={28}
                        className="h-7 w-auto opacity-70 transition-opacity hover:opacity-100 dark:hidden"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/social/${customer.darkLogo ?? customer.logo}`}
                        alt={customer.name}
                        height={28}
                        className="hidden h-7 w-auto opacity-70 transition-opacity hover:opacity-100 dark:block"
                      />
                    </>
                  ) : (
                    <span className="font-display text-lg font-semibold text-ink-faint">{customer.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </Rise>
        )}
      </div>
    </section>
  );
}

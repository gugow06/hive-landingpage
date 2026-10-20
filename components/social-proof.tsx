import { Star } from "lucide-react";
import { CUSTOMERS, TESTIMONIALS } from "@/lib/social-proof";
import { Rise } from "./primitives";

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
 * Depoimentos. Some da página enquanto `TESTIMONIALS` estiver vazio — é
 * melhor não ter a seção do que ter a seção com gente inventada.
 */
export function SocialProof() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section id="depoimentos" className="py-28">
      <div className="shell">
        <Rise>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Quem já usa</p>
            <h2 className="display mt-4 text-[clamp(2rem,4.5vw,2.75rem)] text-ink">
              Founders que pararam de{" "}
              <span className="text-accent-display dark:text-amber">reexplicar o projeto.</span>
            </h2>
          </div>
        </Rise>

        <Rise as="ul" stagger="li" delay={80} className="mt-16 grid gap-6 md:grid-cols-3">
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
      </div>
    </section>
  );
}

/**
 * Faixa de logos de clientes. Fica logo abaixo do herói quando houver logos:
 * é onde ela trabalha — confirma a promessa antes de a pessoa rolar.
 */
export function Customers() {
  if (CUSTOMERS.length === 0) return null;

  return (
    <section id="clientes" className="pt-6 pb-16">
      <div className="shell">
        <Rise className="flex flex-col items-center gap-8">
          <p className="text-sm text-ink-faint">Times que já rodam a colmeia</p>
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
                  <span className="font-display text-lg font-semibold text-ink-faint">
                    {customer.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Rise>
      </div>
    </section>
  );
}

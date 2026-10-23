import type { Testimonial } from "@/lib/social-proof";
import { TestimonialCard } from "./testimonial-card";

/**
 * Carrossel contínuo de depoimentos, adaptado do componente "testimonials-with-marquee" ao
 * design do site (tokens próprios, sem shadcn nem Radix). Duas trilhas idênticas correm lado a
 * lado, então o laço não tem emenda. A segunda é só visual: `aria-hidden` e `inert`, para leitor
 * de tela e teclado passarem uma vez só pelos depoimentos.
 *
 * Pausa no hover e no foco. Com `prefers-reduced-motion` não anima: vira uma fileira que rola
 * com o dedo ou o mouse (veja `.marquee-*` em globals.css).
 */
export function TestimonialsMarquee({ items, label }: { items: Testimonial[]; label: string }) {
  // Repete a lista até a trilha passar da largura de uma tela larga.
  const track = Array.from({ length: Math.max(1, Math.ceil(8 / items.length)) }, () => items).flat();
  const key = (person: Testimonial, index: number) => `${person.name}-${person.company}-${index}`;

  return (
    <div className="relative" role="region" aria-label={label}>
      <div className="marquee-row" style={{ "--duration": `${Math.max(30, track.length * 9)}s` } as React.CSSProperties}>
        <ul className="marquee-track">
          {track.map((person, index) => (
            <li key={key(person, index)} className="flex">
              <TestimonialCard person={person} />
            </li>
          ))}
        </ul>
        <ul className="marquee-track" aria-hidden="true" inert>
          {track.map((person, index) => (
            <li key={key(person, index)} className="flex">
              <TestimonialCard person={person} />
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/5 bg-linear-to-r from-bg to-transparent sm:block" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/5 bg-linear-to-l from-bg to-transparent sm:block" />
    </div>
  );
}

import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/social-proof";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

/** Estrelas com preenchimento parcial: 4,9 enche a quinta estrela em 90%. */
function Stars({ rating }: { rating: number }) {
  const label = rating.toFixed(1).replace(".", ",");
  return (
    <span className="flex items-center gap-2">
      <span className="flex gap-0.5" role="img" aria-label={`Nota ${label} de 5`}>
        {Array.from({ length: 5 }, (_, index) => {
          const fill = Math.min(1, Math.max(0, rating - index));
          return (
            <span key={index} aria-hidden="true" className="relative size-4">
              <Star className="absolute inset-0 size-4 text-line-strong" />
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="size-4 fill-amber text-amber" />
              </span>
            </span>
          );
        })}
      </span>
      <span aria-hidden="true" className="text-sm font-semibold text-ink">
        {label}
      </span>
    </span>
  );
}

/** Iniciais para quem não mandou foto: "Ana Souza" vira "AS". */
function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "")).toUpperCase();
}

/**
 * Cartão de depoimento do carrossel. Usa os mesmos tokens dos demais cartões do site
 * (`.card`: superfície e borda de vidro), então acompanha o tema sem regra própria. O avatar é o do
 * Radix (`./avatar`), com as iniciais como reserva se a foto faltar.
 */
export function TestimonialCard({ person, className = "" }: { person: Testimonial; className?: string }) {
  const Tag = person.href ? "a" : "div";
  const linkProps = person.href ? { href: person.href, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Tag
      {...linkProps}
      className={`card flex w-[300px] shrink-0 flex-col gap-4 p-6 text-start transition-[box-shadow,transform] duration-300 sm:w-[340px] ${
        person.href ? "hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber" : ""
      } ${className}`}
    >
      <Stars rating={person.rating} />
      <blockquote className="flex-1 text-[15px] leading-6 text-ink">“{person.quote}”</blockquote>
      <figcaption className="flex items-center gap-3">
        <Avatar>
          {person.avatar && <AvatarImage src={`/social/${person.avatar}`} alt="" />}
          <AvatarFallback aria-hidden="true">{initials(person.name)}</AvatarFallback>
        </Avatar>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-ink">{person.name}</span>
          <span className="block truncate text-sm text-ink-soft">
            {person.role ? `${person.role} · ${person.company}` : person.company}
            {person.href && <span className="sr-only"> (abre em uma nova aba)</span>}
          </span>
        </span>
      </figcaption>
    </Tag>
  );
}

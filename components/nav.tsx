"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { HiveLogo } from "./primitives";
import { FlowButton } from "./ui/flow-button";
import { WhatsAppButton } from "./whatsapp-button";

/**
 * `id` aponta para uma seção da página inicial; `page` para uma página própria.
 * Dentro da página inicial a âncora é só `#id` (o SmoothScroll rola sem mexer
 * na URL); em qualquer outra página vira `/#id`, que leva de volta à inicial.
 */
const links: ({ id: string; label: string } | { page: string; label: string })[] = [
  { id: "produto", label: "Produto" },
  { id: "como-funciona", label: "Como funciona" },
  { id: "integracoes", label: "Integrações" },
  { id: "faq", label: "FAQ" },
  { id: "comunidade", label: "Comunidade" },
];

/**
 * Páginas próprias usam o `Link` do Next (navegação sem recarregar). Âncoras
 * (`#id` ou `/#id`) ficam como `<a>` comum: o `Link` chama `preventDefault` e o
 * SmoothScroll, que rola sem escrever o `#` na URL, passaria a ignorar o clique.
 */
function NavLink({
  href,
  page,
  current,
  className,
  onClick,
  children,
}: {
  href: string;
  page: boolean;
  current: boolean;
  className: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const props = { className, onClick, "aria-current": current ? ("page" as const) : undefined };
  return page ? (
    <Link href={href} {...props}>
      {children}
    </Link>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

export function Nav() {
  const pathname = usePathname();
  const home = pathname === "/";
  // O botão principal leva à instalação; já na página de instalação, ao começo do passo a passo.
  const installHref = pathname.startsWith("/install") ? "#local" : "/install";
  const hrefOf = (link: (typeof links)[number]) => ("page" in link ? link.page : home ? `#${link.id}` : `/#${link.id}`);
  const isCurrent = (link: (typeof links)[number]) => "page" in link && pathname.startsWith(link.page);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    // Esc fecha e devolve o foco ao botão (WCAG 2.1.2 e 2.4.3).
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    // Coluna estreita centrada, links no meio (centralizados de verdade, numa grade de três colunas) e ações à direita. Ao rolar ganha
    // fundo quase sólido e borda — sem vidro: o texto que passa por baixo não
    // pode competir com os links.
    <header className="sticky top-0 z-50">
      <div
        // No topo a barra é transparente e herda o fundo da página — no tema
        // escuro, o mesmo cinza da faixa do herói, sem emenda; ao rolar ganha
        // vidro (90–93% opaco) e borda de luz.
        className={`border-b transition-colors duration-300 ${
          scrolled || open ? "glass border-transparent" : "border-transparent"
        }`}
      >
        <nav
          aria-label="Principal"
          className="mx-auto grid h-[72px] w-full max-w-[1120px] grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-6 lg:grid-cols-[1fr_auto_1fr]"
        >
          <a href={home ? "#topo" : "/"} className="shrink-0 justify-self-start" aria-label="Hive, início">
            <HiveLogo />
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <li key={hrefOf(link)}>
                <NavLink
                  href={hrefOf(link)}
                  page={"page" in link}
                  current={isCurrent(link)}
                  className="tap rounded-md text-[15px] font-medium text-ink-soft transition-colors hover:text-ink aria-[current=page]:text-ink"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-self-end gap-2">
            <WhatsAppButton />
            <FlowButton href={installHref} className="hidden sm:flex">
              Instalar
            </FlowButton>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="menu-mobile"
              className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface lg:hidden"
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto glass lg:hidden"
      >
        <ul className="shell flex flex-col gap-1 py-6">
          {links.map((link) => (
            <li key={hrefOf(link)}>
              <NavLink
                href={hrefOf(link)}
                page={"page" in link}
                current={isCurrent(link)}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3.5 font-display text-xl font-semibold tracking-tight text-ink transition-colors hover:bg-bg-weak aria-[current=page]:text-accent"
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="mt-4 px-4">
            <FlowButton href={installHref} className="w-full justify-center" onClick={() => setOpen(false)}>
              Instalar
            </FlowButton>
          </li>
        </ul>
      </div>
    </header>
  );
}

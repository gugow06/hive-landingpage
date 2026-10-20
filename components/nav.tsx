"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, X } from "lucide-react";
import { GithubMark, REPO } from "./github";
import { HiveLogo } from "./primitives";

const links = [
  { href: "#agentes", label: "Os Hibees" },
  { href: "#beneficios", label: "Por que" },
  { href: "#memoria", label: "Memória" },
  { href: "#conexoes", label: "Conexões" },
  { href: "#diferencial", label: "Diferencial" },
  { href: "#faq", label: "FAQ" },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      // Antes da hidratação não sabemos o tema; o ícone fica neutro mas o botão
      // já ocupa o lugar certo, então o header não pula.
      aria-label={mounted ? (dark ? "Ativar modo claro" : "Ativar modo escuro") : "Alternar tema"}
      aria-pressed={mounted ? dark : undefined}
      className="inline-flex size-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface hover:text-ink"
    >
      {mounted && dark ? (
        <Sun className="size-5" aria-hidden="true" />
      ) : (
        <Moon className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}

export function Nav() {
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
    // Navbar do AbacatePay: coluna estreita de ~1018px centrada, fundo
    // translúcido sobre o halo do herói, links no meio e ações à direita.
    <header className="sticky top-0 z-50">
      <div
        className={`transition-colors duration-300 ${
          scrolled ? "border-b border-line bg-bg/70 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <nav
          aria-label="Principal"
          className="mx-auto flex h-[88px] w-full max-w-[1018px] items-center justify-between px-6"
        >
          <a href="#topo" className="shrink-0" aria-label="Hive, início">
            <HiveLogo />
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="tap text-sm text-ink-soft transition-colors hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              aria-label="Repositório do Hive no GitHub"
              className="inline-flex size-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface hover:text-ink"
            >
              <GithubMark className="size-5" />
            </a>
            <ThemeToggle />
            <a href="#lista" className="btn btn-primary hidden sm:inline-flex">
              Entrar na lista
            </a>
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
        className="fixed inset-x-0 top-[88px] bottom-0 z-40 border-t border-line bg-bg lg:hidden"
      >
        <ul className="shell flex flex-col gap-1 py-6">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-4 font-display text-2xl font-semibold tracking-tight text-ink transition-colors hover:bg-surface"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-4 px-4">
            <a href="#lista" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Entrar na lista
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

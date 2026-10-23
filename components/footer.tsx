"use client";

import { usePathname } from "next/navigation";
import { BrandIcon } from "./brand-icons";
import { GithubMark, REPO } from "./github";
import { HiveLogo } from "./primitives";
import { WHATSAPP_URL } from "./whatsapp-button";

/**
 * Parceiros: o arquivo vai em `images/parceiros/` e é publicado por
 * `npm run sync:brand`. A relação de cada um com o Hive ainda não foi descrita
 * por quem a conhece, então o rótulo continua genérico.
 */
const PARTNERS: { name: string; href: string; logo: string; height: string }[] = [
  { name: "Oracle", href: "https://www.oracle.com/br/", logo: "parceiros/oracle-logo.png", height: "h-3.5" },
  { name: "FIAP", href: "https://www.fiap.com.br/", logo: "parceiros/logo-fiap.png", height: "h-4" },
];

type FooterLink = { label: string; href: string; external?: boolean; anchor?: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Produto",
    links: [
      { label: "Equipe e execução", anchor: "produto", href: "" },
      { label: "Como funciona", anchor: "como-funciona", href: "" },
      { label: "Memória e grafo", anchor: "memoria", href: "" },
      { label: "Controle e auditoria", anchor: "controle", href: "" },
      { label: "Integrações", anchor: "integracoes", href: "" },
    ],
  },
  {
    title: "Instalar",
    links: [
      { label: "Guia de instalação", href: "/install" },
      { label: "Instalação local", href: "/install#local" },
      { label: "Primeiros passos", href: "/install#primeiros-passos" },
      { label: "Dúvidas frequentes", href: "/install#problemas" },
    ],
  },
  {
    title: "Comunidade",
    links: [
      { label: "Grupo no WhatsApp", href: WHATSAPP_URL, external: true },
      { label: "Código no GitHub", href: REPO, external: true },
      { label: "Reportar um problema", href: `${REPO}/issues`, external: true },
      { label: "Perguntas frequentes", anchor: "faq", href: "" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de privacidade", href: "/privacidade" },
      { label: "Termos de serviço", href: "/termos" },
      { label: "Política de cookies", href: "/cookies" },
      { label: "Seus dados (LGPD)", href: "/lgpd" },
    ],
  },
];

/**
 * Rodapé: uma faixa escura nos dois temas, com a mesma borda de vidro da hero
 * (`.glass-band`), para a página fechar como abriu. Âncoras da inicial viram
 * `#id` na própria inicial (o SmoothScroll rola sem escrever `#` na URL) e
 * `/#id` nas outras páginas.
 */
export function Footer() {
  const pathname = usePathname();
  const home = pathname === "/";
  const hrefOf = (link: FooterLink) => (link.anchor ? (home ? `#${link.anchor}` : `/#${link.anchor}`) : link.href);

  return (
    <footer className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="glass-band dark relative overflow-hidden bg-bg text-ink">
        <div className="shell relative py-14 md:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-16">
            <div className="max-w-sm">
              <HiveLogo />
              <p className="mt-5 text-[15px] leading-6 text-ink-soft">
                O Hive organiza uma equipe de agentes de IA, com hierarquia, memória e registro de tudo o que
                acontece. Código aberto, em beta.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Comunidade do Hive no WhatsApp (abre em uma nova aba)"
                  className="inline-flex size-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-white/10 hover:text-ink"
                >
                  <BrandIcon name="whatsapp" className="size-5" />
                </a>
                <a
                  href={REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Repositório do Hive no GitHub (abre em uma nova aba)"
                  className="inline-flex size-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-white/10 hover:text-ink"
                >
                  <GithubMark className="size-5" />
                </a>
              </div>
            </div>

            <nav aria-label="Rodapé" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              {COLUMNS.map((column) => (
                <div key={column.title}>
                  <h2 className="text-sm font-semibold text-ink">{column.title}</h2>
                  <ul className="mt-4 space-y-1">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={hrefOf(link)}
                          {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="tap rounded-md text-[15px] text-ink-soft transition-colors hover:text-ink"
                        >
                          {link.label}
                          {link.external && <span className="sr-only"> (abre em uma nova aba)</span>}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-12 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl space-y-2 text-sm leading-6 text-ink-soft">
              <p>
                O Hive é um fork do{" "}
                <a
                  href="https://github.com/paperclipai/paperclip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-ink underline decoration-current/40 underline-offset-4 hover:decoration-current"
                >
                  Paperclip
                </a>
                , o plano de controle de código aberto para equipes de agentes de IA, com o Grafo de Conhecimento e a
                identidade da colmeia por cima.
              </p>
              <p>© {new Date().getFullYear()} Hive. Feito no Brasil.</p>
            </div>

            <div>
              <p className="text-sm text-ink-faint">Parceiros</p>
              <ul className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                {PARTNERS.map((partner) => (
                  <li key={partner.name}>
                    <a
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tap opacity-80 transition-opacity hover:opacity-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/brand/${partner.logo}`} alt={partner.name} className={`${partner.height} w-auto`} />
                      <span className="sr-only"> (abre em uma nova aba)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * SEO do site: endereço, páginas e dados estruturados (JSON-LD).
 *
 * Só entra no JSON-LD o que existe de verdade na página e no produto: nada de avaliação
 * (`aggregateRating`) nem de número de usuários, porque ainda não há dados reais, e dado
 * estruturado inventado é motivo de ação manual do Google.
 */

import { FAQ } from "./faq.ts";
import { LEGAL } from "./legal.ts";

/** Endereço público do site. É a base das URLs de Open Graph, do sitemap e do JSON-LD. */
export const SITE_URL = "https://hiveagents.com.br";
export const SITE_NAME = "Hive";
export const REPO_URL = "https://github.com/gugow06/hive";

/** Páginas indexáveis, com a prioridade que cada uma tem no sitemap. */
export const PAGES = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/install", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/privacidade", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/termos", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/lgpd", priority: 0.3, changeFrequency: "yearly" as const },
] as const;

type Json = Record<string, unknown>;

const url = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

export function organizationLd(): Json {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organizacao`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/hive-symbol.png`,
    sameAs: [REPO_URL],
    email: LEGAL.email,
  };
}

export function websiteLd(): Json {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#site`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "pt-BR",
    publisher: { "@id": `${SITE_URL}/#organizacao` },
  };
}

export function softwareLd(): Json {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: SITE_NAME,
    description:
      "Software de código aberto que organiza uma equipe de agentes de IA, com hierarquia, memória compartilhada em Markdown e auditoria de tudo o que acontece.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux",
    inLanguage: "pt-BR",
    license: "https://opensource.org/license/mit",
    isAccessibleForFree: true,
    // Gratuito: o Hive é MIT e não tem plano pago. Os modelos de IA são pagos ao provedor.
    offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
    codeRepository: REPO_URL,
    softwareHelp: url("/install"),
    url: SITE_URL,
  };
}

export function faqLd(): Json {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: url(item.path),
    })),
  };
}

export function installArticleLd(): Json {
  return {
    "@type": "TechArticle",
    "@id": `${SITE_URL}/install#artigo`,
    headline: "Como instalar o Hive no Windows, macOS e Linux",
    description:
      "Guia passo a passo para instalar o Hive no Windows, no macOS ou no Linux, com npm ou Docker, e dar os primeiros passos.",
    inLanguage: "pt-BR",
    url: url("/install"),
    dateModified: LEGAL.atualizadoIso,
    author: { "@id": `${SITE_URL}/#organizacao` },
    publisher: { "@id": `${SITE_URL}/#organizacao` },
    about: { "@id": `${SITE_URL}/#software` },
  };
}

/** Junta vários objetos num único `@graph`, o formato que o Google prefere. */
export function graph(...nodes: Json[]): Json {
  return { "@context": "https://schema.org", "@graph": nodes };
}

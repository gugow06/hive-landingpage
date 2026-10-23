import type { MetadataRoute } from "next";
import { LEGAL } from "@/lib/legal";
import { PAGES, SITE_URL } from "@/lib/seo";

/**
 * Mapa do site. Toda página nova em `app/` entra em `PAGES` (lib/seo.ts); o teste de SEO
 * falha se uma rota existir e não estiver lá.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(LEGAL.atualizadoIso);
  return PAGES.map((page) => ({
    url: page.path === "/" ? SITE_URL : `${SITE_URL}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}

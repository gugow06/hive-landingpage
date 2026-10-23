import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Tudo é público e indexável, inclusive para os rastreadores de IA (a ideia é o Hive ser
 * citado). Só a API fica de fora: não tem conteúdo para buscadores e recebe formulários.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

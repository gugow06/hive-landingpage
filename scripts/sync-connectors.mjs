// Lê o catálogo de conectores do produto e publica o que o site precisa.
//
//   npm run connectors
//
// A lista não é escrita à mão: sai de `packages/shared/src/app-definitions/`,
// o mesmo catálogo que o app usa para montar a tela de Connectors. Rode de novo
// quando o produto ganhar conectores novos.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = process.env.HIVE_REPO ?? resolve(here, "../../hive");
const definitions = resolve(repo, "packages/shared/src/app-definitions");
const brands = resolve(repo, "ui/public/brands/apps");
const out = resolve(here, "../public/connectors");

if (!existsSync(definitions)) {
  console.error(`Não encontrei ${definitions}. Defina HIVE_REPO se o produto estiver em outro lugar.`);
  process.exit(1);
}

// Conectores genéricos (“API key”, “OAuth”) são andaimes de configuração, não
// marcas que alguém reconheça num carrossel.
const skip = new Set(["api-key-generic", "oauth-generic", "mcp-generic"]);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const connectors = [];

for (const file of readdirSync(definitions).filter((name) => name.endsWith(".json")).sort()) {
  const definition = JSON.parse(readFileSync(resolve(definitions, file), "utf8"));
  if (skip.has(definition.slug)) continue;

  const logo = definition.branding?.logoUrl?.split("/").pop();
  const darkLogo = definition.branding?.darkLogoUrl?.split("/").pop();
  if (!logo || !existsSync(resolve(brands, logo))) continue;

  copyFileSync(resolve(brands, logo), resolve(out, logo));
  const hasDark = darkLogo && existsSync(resolve(brands, darkLogo));
  if (hasDark) copyFileSync(resolve(brands, darkLogo), resolve(out, darkLogo));

  connectors.push({
    slug: definition.slug,
    name: definition.name,
    logo,
    // Nem toda marca tem variante escura; quem não tem reusa a clara.
    darkLogo: hasDark ? darkLogo : logo,
    featured: Boolean(definition.featured),
    categories: definition.categories ?? [],
  });
}

const file = `// Gerado por \`npm run connectors\` a partir do catálogo do produto.
// Não edite à mão.

export interface Connector {
  slug: string;
  name: string;
  logo: string;
  darkLogo: string;
  featured: boolean;
  categories: string[];
}

export const CONNECTORS: Connector[] = ${JSON.stringify(connectors, null, 2)};
`;

writeFileSync(resolve(here, "../lib/connectors.ts"), file);
console.log(`${connectors.length} conectores publicados (${connectors.filter((c) => c.featured).length} em destaque)`);

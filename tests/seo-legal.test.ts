// SEO, páginas legais e formulários da LGPD.

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { FAQ } from "../lib/faq.ts";
import { LEGAL, camposPendentes } from "../lib/legal.ts";
import { validarLgpd } from "../lib/lgpd.ts";
import { PAGES, breadcrumbLd, faqLd, graph, installArticleLd, organizationLd, softwareLd, websiteLd } from "../lib/seo.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path: string) => readFileSync(join(root, path), "utf8");

/** Rotas públicas: toda pasta de `app/` que tem `page.tsx` (a home e as páginas internas). */
const routes = [
  "/",
  ...readdirSync(join(root, "app"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(root, "app", entry.name, "page.tsx")))
    .map((entry) => `/${entry.name}`),
];

// ------------------------------------------------------------------------------------- SEO

test("SEO: toda página tem título (até 60 caracteres) e descrição (70 a 160)", () => {
  const layout = read("app/layout.tsx");
  const homeTitle = layout.match(/const TITLE = "([^"]+)"/)?.[1] ?? "";
  const homeDescription = layout.match(/const description =\s*"([^"]+)"/)?.[1] ?? "";
  const cases: [string, string, string][] = [["/", homeTitle, homeDescription]];

  for (const route of routes.filter((r) => r !== "/")) {
    const page = read(`app${route}/page.tsx`);
    const title = page.match(/metadata: Metadata = \{[\s\S]*?title: "([^"]+)"/)?.[1] ?? "";
    const description = page.match(/description:\s*"([^"]+)"/)?.[1] ?? "";
    cases.push([route, title, description]);
  }

  for (const [route, title, description] of cases) {
    assert.ok(title, `${route}: sem título`);
    // O template acrescenta " · Hive" (7 caracteres) às páginas internas.
    const shown = route === "/" ? title.length : title.length + " · Hive".length;
    assert.ok(shown <= 60, `${route}: título com ${shown} caracteres (máximo 60): "${title}"`);
    assert.ok(description.length >= 70 && description.length <= 160, `${route}: descrição com ${description.length} caracteres (70 a 160)`);
  }
});

test("SEO: toda rota pública está no sitemap, e só ela", () => {
  const known = PAGES.map((page) => page.path).sort();
  assert.deepEqual(known, [...routes].sort(), "PAGES (lib/seo.ts) e as páginas de app/ não coincidem");
});

test("SEO: cada página tem canonical e uma única h1", () => {
  assert.match(read("app/layout.tsx"), /alternates: \{ canonical: "\/" \}/);
  for (const route of routes.filter((r) => r !== "/")) {
    const page = read(`app${route}/page.tsx`);
    assert.match(page, new RegExp(`canonical: "${route}"`), `${route}: sem canonical`);
    const h1 = (page.match(/<h1\b/g) ?? []).length + (read("components/legal/legal-page.tsx").includes("<h1") && page.includes("<LegalPage") ? 1 : 0);
    assert.equal(h1, 1, `${route}: deveria ter exatamente uma h1`);
  }
  assert.equal((read("components/hero.tsx").match(/<h1\b/g) ?? []).length, 1, "a home deveria ter uma única h1 (hero)");
});

test("SEO: JSON-LD válido, com o mesmo FAQ que a página mostra e sem dados inventados", () => {
  const data = graph(organizationLd(), websiteLd(), softwareLd(), faqLd(), installArticleLd(), breadcrumbLd([{ name: "Início", path: "/" }]));
  const json = JSON.stringify(data);
  assert.doesNotThrow(() => JSON.parse(json));
  const faq = (data["@graph"] as { "@type": string; mainEntity?: { name: string; acceptedAnswer: { text: string } }[] }[]).find((n) => n["@type"] === "FAQPage")!;
  assert.equal(faq.mainEntity!.length, FAQ.length);
  assert.equal(faq.mainEntity![0]!.acceptedAnswer.text, FAQ[0]!.a);
  // Sem avaliação nem número de usuários: ainda não há dado real.
  assert.ok(!/aggregateRating|reviewCount|ratingValue|interactionStatistic/.test(json), "JSON-LD com dado de prova social inventado");
  assert.match(json, /"price":"0"/);
});

test("SEO: robots, sitemap e llms.txt existem e são coerentes", () => {
  assert.match(read("app/robots.ts"), /disallow: "\/api\/"/);
  assert.match(read("app/robots.ts"), /sitemap\.xml/);
  const llms = read("public/llms.txt");
  assert.match(llms, /^# Hive/);
  for (const page of PAGES.filter((p) => p.path !== "/")) assert.ok(llms.includes(`https://hiveagents.com.br${page.path}`), `llms.txt não cita ${page.path}`);
});

// ------------------------------------------------------------------------------------- textos

test("copy: a lista de espera não existe mais em lugar nenhum do site", () => {
  const walk = (dir: string): string[] =>
    readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory() ? walk(`${dir}/${entry.name}`) : /\.(tsx?|txt|md)$/.test(entry.name) ? [`${dir}/${entry.name}`] : [],
    );
  const files = [...walk("app"), ...walk("components"), ...walk("lib"), "public/llms.txt"];
  const offenders = files.filter((f) => /lista de espera|fila de espera|Entrar na lista/i.test(read(f)));
  assert.deepEqual(offenders, [], "ainda há texto sobre lista de espera");
});

test("copy: sem a marca de texto de IA que as skills de copy mandam evitar", () => {
  // Revelações "não é X, é Y" e travessão em título/subtítulo/botão.
  const visible = [read("components/hero.tsx"), read("components/community.tsx"), read("lib/faq.ts"), read("app/install/page.tsx")].join("\n");
  assert.ok(!/(não é|nao é) [^.<]{1,40}, (é|e) /i.test(visible), "revelação 'não é X, é Y' no texto");
  assert.ok(!/\bseamless|robusto|poderoso|revolucion|libere o poder|nunca mais\b/i.test(visible), "palavra de buzzword no texto");
});

// ------------------------------------------------------------------------------------- legal / LGPD

test("legal: as quatro páginas existem, e o rodapé e o aviso de cookies apontam para elas", () => {
  for (const route of ["/privacidade", "/termos", "/cookies", "/lgpd"]) {
    assert.ok(existsSync(join(root, "app", route, "page.tsx")), `${route} não existe`);
    assert.ok(read("components/footer.tsx").includes(`"${route}"`), `o rodapé não linka ${route}`);
  }
  assert.match(read("components/cookie-notice.tsx"), /href="\/cookies"/);
});

test("legal: a política de cookies lista o que o aviso realmente guarda", () => {
  const key = read("components/cookie-notice.tsx").match(/COOKIE_NOTICE_KEY = "([^"]+)"/)?.[1];
  assert.ok(key);
  assert.ok(read("app/cookies/page.tsx").includes(key!), `a política de cookies não lista "${key}"`);
  assert.ok(read("app/cookies/page.tsx").includes("hive-install-os"), "a política de cookies não lista a escolha de sistema do guia");
});

test("legal: a política de privacidade diz a verdade sobre a telemetria do aplicativo", () => {
  const policy = read("app/privacidade/page.tsx");
  assert.match(policy, /ligada por\s+padrão/, "deve dizer que a telemetria vem ligada");
  assert.match(policy, /PAPERCLIP_TELEMETRY_DISABLED=1/);
});

test("legal: dados do controlador e do encarregado preenchidos", { todo: `preencher em lib/legal.ts: ${camposPendentes().join(", ")}` }, () => {
  assert.deepEqual(camposPendentes(), [], "campos pendentes em lib/legal.ts");
  assert.ok(LEGAL.email.includes("@"));
});

test("LGPD: a validação aceita pedido correto e recusa os incorretos", () => {
  const ok = {
    kind: "titular" as const,
    nome: "Maria da Silva",
    email: "maria@exemplo.com.br",
    assunto: "acesso",
    mensagem: "Quero saber quais dados vocês têm sobre mim.",
    declaracao: true,
  };
  assert.equal(validarLgpd(ok), null);
  assert.equal(validarLgpd({ ...ok, kind: "encarregado", assunto: "incidente" }), null);
  assert.match(validarLgpd({ ...ok, email: "não-é-email" })!, /e-mail/);
  assert.match(validarLgpd({ ...ok, nome: "A" })!, /nome/);
  assert.match(validarLgpd({ ...ok, assunto: "inventado" })!, /opções/);
  assert.match(validarLgpd({ ...ok, assunto: "incidente" })!, /opções/, "assunto de outro formulário não vale");
  assert.match(validarLgpd({ ...ok, mensagem: "curta" })!, /mais/);
  assert.match(validarLgpd({ ...ok, declaracao: false })!, /declaração/);
  assert.match(validarLgpd({ ...ok, kind: "x" as never })!, /inválido/);
});

test("LGPD: a rota não deixa um pedido legal sumir em silêncio", () => {
  const route = read("app/api/lgpd/route.ts");
  assert.match(route, /status: 503/, "em produção, sem webhook, deve responder 503 em vez de fingir que recebeu");
  assert.match(route, /LGPD_WEBHOOK_URL/);
  // Sem dado pessoal nos logs.
  const logs = [...route.matchAll(/console\.(?:info|error)\(([^;]+);/g)].map((m) => m[1]).join("\n");
  assert.ok(!/payload\.(nome|email|mensagem)|\bnome\b.*,\s*email/.test(logs), "log com dado pessoal");
});

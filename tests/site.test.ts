// Testes de regressão do que a página promete. Sem dependências: rodam com o
// `node --test` do Node (>= 22.18, que já entende TypeScript sem compilar).
//
//   npm test

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { DOCS, DOC_IDS, GRAPH_LAYOUT, LINKS, NEIGHBORS } from "../lib/memory.ts";
import { CUSTOMERS, TESTIMONIALS } from "../lib/social-proof.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path: string) => readFileSync(join(root, path), "utf8");
const components = readdirSync(join(root, "components")).filter((f) => f.endsWith(".tsx"));
const allSource = components.map((f) => read(`components/${f}`)).join("\n");
const installPage = read("app/install/page.tsx");
const installSource = [installPage, ...readdirSync(join(root, "components", "install")).map((f) => read(`components/install/${f}`))].join("\n");

test("o grafo da memória: toda ligação aponta para um documento que existe", () => {
  for (const [from, to] of LINKS) {
    assert.ok(DOCS[from], `origem desconhecida: ${from}`);
    assert.ok(DOCS[to], `destino desconhecido: ${to}`);
    assert.notEqual(from, to, `${from} liga a si mesmo`);
  }
});

test("o grafo da memória: vizinhança é simétrica e todo documento está ligado", () => {
  for (const id of DOC_IDS) {
    assert.ok(NEIGHBORS[id].size > 0, `${id} ficou sem ligações`);
    for (const other of NEIGHBORS[id]) assert.ok(NEIGHBORS[other].has(id), `${id} ↔ ${other} não é simétrica`);
  }
});

test("o grafo da memória: o layout é finito e cabe na área [-1, 1]", () => {
  for (const id of DOC_IDS) {
    const { x, y } = GRAPH_LAYOUT[id];
    assert.ok(Number.isFinite(x) && Number.isFinite(y), `${id} sem posição`);
    assert.ok(Math.abs(x) <= 1.0001 && Math.abs(y) <= 1.0001, `${id} fora da área: ${x}, ${y}`);
  }
});

test("a navegação: todo link do menu aponta para uma seção ou página que existe", () => {
  const nav = read("components/nav.tsx");
  // `id` é uma seção da página inicial; `page` é uma rota própria.
  const ids = [...nav.matchAll(/\{ id: "([\w-]+)"/g)].map((m) => m[1]!);
  const pages = [...nav.matchAll(/\{ page: "(\/[\w-]+)"/g)].map((m) => m[1]!);
  assert.ok(ids.length >= 4, "menu sem âncoras");
  for (const id of [...ids, "demo", "topo"]) {
    assert.ok(new RegExp(`id="${id}"`).test(allSource), `nenhuma seção com id="${id}" — o link ficaria morto`);
  }
  for (const page of pages) {
    assert.ok(existsSync(join(root, "app", page, "page.tsx")), `o menu aponta para ${page}, que não tem app${page}/page.tsx`);
  }
});

test("a página de instalação: o índice e as âncoras internas apontam para seções que existem", () => {
  const tocIds = [...installPage.matchAll(/\{ id: "([\w-]+)", label:/g)].map((m) => m[1]!);
  assert.ok(tocIds.length >= 5, "índice sem itens");
  for (const id of tocIds) assert.ok(installPage.includes(`id="${id}"`), `o índice cita "${id}", mas não há <section id="${id}">`);
  // links `#algo` dentro do texto da página
  for (const [, id] of installPage.matchAll(/href="#([\w-]+)"/g)) {
    if (id === "conteudo") continue;
    assert.ok(installPage.includes(`id="${id}"`), `link para #${id} sem destino na página`);
  }
  // cada seção aponta para o próprio título
  for (const [, id] of installPage.matchAll(/aria-labelledby="([\w-]+)"/g)) {
    assert.ok(installPage.includes(`id="${id}"`), `aria-labelledby="${id}" sem alvo`);
  }
});

test("a página de instalação: os comandos usam o que o produto realmente tem", () => {
  // Pré-requisitos e portas vêm do próprio repositório do produto; se mudarem lá, mude aqui.
  assert.match(installPage, /Node\.js 24\.11/);
  assert.match(installPage, /localhost:3100/);
  assert.match(installPage, /pnpm dev/);
  assert.match(installPage, /core\.autocrlf=false/, "o aviso de quebra de linha no Windows sumiu");
  // O segredo de sessão precisa de gerador criptográfico: `Get-Random` não serve.
  const withoutComments = installSource.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.ok(!/Get-Random/.test(withoutComments), "Get-Random não é criptograficamente seguro para o BETTER_AUTH_SECRET");
  assert.match(installPage, /RandomNumberGenerator/);
});

test("as seções com título apontam para um título que existe", () => {
  const labelled = [...allSource.matchAll(/aria-labelledby="([\w-]+)"/g)].map((m) => m[1]!);
  assert.ok(labelled.length > 0);
  for (const id of labelled) assert.ok(allSource.includes(`id="${id}"`), `aria-labelledby="${id}" sem alvo`);
});

test("sem promessas que o produto não sustenta", () => {
  // Só o que a pessoa lê: strings entre aspas e texto de JSX, sem className.
  const copy = allSource
    .replace(/className=(\{`[^`]*`\}|"[^"]*")/g, "")
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
  const banned = [/nunca mais/i, /elimina (os )?erros/i, /100\s?%/, /à prova de/i, /versionad/i];
  for (const pattern of banned) {
    assert.ok(!pattern.test(copy), `texto proibido na página: ${pattern}`);
  }
});

test("prova social: só há depoimento ou cliente com dados completos", () => {
  for (const item of TESTIMONIALS) {
    assert.ok(item.name && item.company && item.quote, `depoimento incompleto: ${item.name}`);
    assert.ok(item.rating >= 1 && item.rating <= 5, `nota fora de 1–5: ${item.name}`);
  }
  for (const customer of CUSTOMERS) assert.ok(customer.name, "cliente sem nome");
});

test("os Hibees animados: um <style> por arquivo, rosto marcado e script idempotente", async () => {
  const dir = join(root, "public", "hibees");
  const files = readdirSync(dir).filter((f) => f.endsWith(".svg"));
  assert.ok(files.length >= 16);
  for (const file of files) {
    const svg = readFileSync(join(dir, file), "utf8");
    assert.equal(svg.match(/<style id="hibee-anim">/g)?.length, 1, `${file}: <style> ausente ou duplicado`);
    assert.ok(/class="hb-eye"/.test(svg), `${file}: olhos sem animação`);
    assert.ok(/prefers-reduced-motion/.test(svg), `${file}: sem regra de movimento reduzido`);
  }

  const before = files.map((f) => readFileSync(join(dir, f), "utf8"));
  await import(`../scripts/animate-hibees.mjs?again=${Date.now()}`);
  const after = files.map((f) => readFileSync(join(dir, f), "utf8"));
  assert.deepEqual(after, before, "rodar o script de novo mudou os SVGs");
});

test("o vídeo do herói: arquivos, capas e tamanho reservado existem", () => {
  const video = read("components/hero-video.tsx");
  for (const path of [...video.matchAll(/"(\/video\/[\w.-]+)"/g)].map((m) => m[1]!)) {
    assert.ok(readFileSync(join(root, "public", path)).length > 0, `${path} vazio`);
  }
  assert.match(video, /aspect-\[1750\/984\]/, "o espaço do vídeo deixou de ser reservado");
  assert.match(video, /\bmuted\b/);
  assert.match(video, /\bplaysInline\b/);
  assert.match(video, /\bloop\b/);
});

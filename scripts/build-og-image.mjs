// Gera a imagem de compartilhamento (Open Graph / Twitter): 1200×630, em `app/`.
//
//   node scripts/build-og-image.mjs
//
// Renderiza um HTML com o navegador (Playwright), usando as fontes do site, o logo e o Hibee
// que já estão em `public/`. O texto é o mesmo da hero. Quando a frase principal do site mudar,
// mude `COPY` aqui e rode de novo: a imagem que aparece ao compartilhar o link precisa
// acompanhar o site.
//
// O Playwright não é dependência do site. Instale-o (`npm i -D playwright`) ou aponte para
// uma instalação existente com `PLAYWRIGHT_PATH=/caminho/para/playwright`.

import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const COPY = {
  line1: "Sua equipe de IA.",
  line2: "Com direção, memória e controle.",
  sub: "Organize agentes, delegue tarefas e conecte o conhecimento da sua operação.",
  foot: "hive.dev.br  ·  Gratuito e de código aberto",
};

const asDataUri = (path, type) => `data:${type};base64,${readFileSync(join(root, path)).toString("base64")}`;
const logo = asDataUri("public/brand/hive-wordmark.png", "image/png");
const bee = asDataUri("public/hibees/rainha-idle.svg", "image/svg+xml");

// O favo do site (`.comb` em globals.css), em âmbar.
const comb =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'><path fill='#ffb800' fill-rule='evenodd' d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/></svg>`,
  );

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Montserrat:wght@500;600&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0}
  body{width:1200px;height:630px;overflow:hidden;background:#000;color:#fff;font-family:Inter,sans-serif;position:relative}
  .glow{position:absolute;inset:0;background:radial-gradient(700px 520px at 100% 0%,rgba(255,184,0,.22),transparent 70%)}
  .comb{position:absolute;right:0;top:0;width:520px;height:630px;opacity:.16;background:url("${comb}");background-size:84px 147px;
    -webkit-mask-image:radial-gradient(520px 520px at 100% 0%,#000,transparent 75%);mask-image:radial-gradient(520px 520px at 100% 0%,#000,transparent 75%)}
  .wrap{position:absolute;left:80px;top:64px;width:760px}
  .logo{height:54px;display:block}
  h1{font-family:Montserrat,sans-serif;font-weight:600;font-size:74px;line-height:1.08;letter-spacing:-.045em;margin-top:44px}
  h1 span{display:block;color:#ffb800}
  p.sub{margin-top:30px;font-size:27px;line-height:1.45;color:#a1a1aa;max-width:640px}
  .foot{position:absolute;left:80px;bottom:52px;font-size:22px;color:#8a8a91}
  .bee{position:absolute;right:92px;bottom:70px;width:210px;filter:drop-shadow(0 24px 30px rgba(0,0,0,.6))}
</style></head><body>
  <div class="glow"></div><div class="comb"></div>
  <div class="wrap">
    <img class="logo" src="${logo}" alt="">
    <h1>${COPY.line1}<span>${COPY.line2}</span></h1>
    <p class="sub">${COPY.sub}</p>
  </div>
  <img class="bee" src="${bee}" alt="">
  <div class="foot">${COPY.foot}</div>
</body></html>`;

const playwrightPath = process.env.PLAYWRIGHT_PATH;
let chromium;
try {
  ({ chromium } = await import(playwrightPath ? pathToFileURL(join(playwrightPath, "index.mjs")).href : "playwright"));
} catch {
  console.error("Playwright não encontrado. Rode `npm i -D playwright` ou defina PLAYWRIGHT_PATH.");
  process.exit(1);
}

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const out = join(root, "app", "opengraph-image.png");
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();

// O cartão do Twitter/X usa a mesma imagem.
copyFileSync(out, join(root, "app", "twitter-image.png"));
writeFileSync(
  join(root, "app", "opengraph-image.alt.txt"),
  `Hive: "${COPY.line1} ${COPY.line2}", ao lado de um Hibee, o personagem do produto, sobre fundo escuro com favos âmbar.`,
);
copyFileSync(join(root, "app", "opengraph-image.alt.txt"), join(root, "app", "twitter-image.alt.txt"));
console.log("app/opengraph-image.png e app/twitter-image.png atualizados");

// Publica os arquivos de marca soltos em `images/` para `public/brand/`.
//
//   npm run sync:brand
//
// `images/` é a pasta onde você joga o que sai do Canva, com o nome que vier.
// O Next só serve o que está em `public/`, então os arquivos são copiados com
// nomes normalizados (sem espaço, sem acento) — é por esses nomes que o site
// referencia as logos.
import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const from = resolve(here, "../images");
const to = resolve(here, "../public/brand");

/** Nomes estáveis para o que o site já referencia; o resto vai normalizado. */
const known = {
  "logo hive fundo transparente": "hive-logo",
  "logo2 hive fundo transparente": "hive-symbol",
};

const slug = (name) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

if (!existsSync(from)) {
  console.error(`Pasta ${from} não existe.`);
  process.exit(1);
}

mkdirSync(to, { recursive: true });

let count = 0;

/** Copia uma pasta, preservando subpastas (`parceiros/` vira `brand/parceiros/`). */
function publish(sourceDir, targetDir, prefix = "") {
  mkdirSync(targetDir, { recursive: true });
  for (const file of readdirSync(sourceDir)) {
    const full = resolve(sourceDir, file);
    if (statSync(full).isDirectory()) {
      publish(full, resolve(targetDir, slug(file)), `${prefix}${slug(file)}/`);
      continue;
    }
    const ext = extname(file).toLowerCase();
    if (![".png", ".svg", ".jpg", ".jpeg", ".webp"].includes(ext)) continue;
    const base = file.slice(0, -ext.length);
    const name = known[base.toLowerCase()] ?? slug(base);
    copyFileSync(full, resolve(targetDir, name + ext));
    console.log(`${file} → public/brand/${prefix}${name}${ext}`);
    count++;
  }
}

publish(from, to);

console.log(`${count} arquivo(s) de marca publicados`);

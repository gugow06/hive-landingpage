// Copia o runtime do ClipLab compilado do produto para dentro do site.
//
//   npm run sync:cliplab
//
// O site precisa do runtime vivo (Three.js, segue o cursor) no herói, e não só
// dos SVGs estáticos. Importar direto do repo do produto faria o deploy do site
// depender de um checkout vizinho compilado, então o runtime é vendorizado —
// mesma decisão que o produto tomou ao trazer o ClipLab de upstream.
//
// Rode de novo quando o personagem mudar no produto (`cap-v1` → nova versão).
import { copyFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = process.env.HIVE_REPO ?? resolve(here, "../../hive");
const from = resolve(repo, "packages/shared/dist/cliplab");
const src = resolve(repo, "packages/shared/src/cliplab");
const to = resolve(here, "../lib/cliplab");

// Grafo fechado a partir de runtime.js e definition.js; só `three` fica de fora.
const files = [
  "runtime.js",
  "definition.js",
  "character.js",
  "model.js",
  "palette-tokens.js",
  "gaze.js",
  "face-morph.js",
  "particles.js",
  "renderer.js",
];

if (!existsSync(from)) {
  console.error(`Não encontrei ${from}. Compile packages/shared no repo do produto, ou defina HIVE_REPO.`);
  process.exit(1);
}

mkdirSync(to, { recursive: true });
for (const file of files) copyFileSync(resolve(from, file), resolve(to, file));
copyFileSync(resolve(src, "LICENSE"), resolve(to, "LICENSE"));

writeFileSync(
  resolve(to, "README.md"),
  `# ClipLab (vendorizado)

Não edite estes arquivos à mão — eles são gerados por \`npm run sync:cliplab\`,
que copia \`packages/shared/dist/cliplab\` do repositório do produto.

É o mesmo runtime que desenha os agentes dentro do Hive, então o Hibee vivo do
herói e o avatar do app são literalmente o mesmo personagem.

Origem: ClipLab (MIT) → Paperclip/Hive → este site. Licença em \`LICENSE\`.
Única dependência externa: \`three\`.

Sincronizado em ${new Date().toISOString().slice(0, 10)}.
`,
);

console.log(`${files.length} arquivos do ClipLab sincronizados em lib/cliplab`);

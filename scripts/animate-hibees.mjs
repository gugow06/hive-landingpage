// Dá vida ao rosto dos Hibees estáticos: os olhos piscam e olham de lado, a
// boca se mexe. A animação vai DENTRO de cada SVG (um <style> próprio), então
// o `<img>` continua igual e não custa JavaScript nem WebGL.
//
// Roda depois de `npm run hibees`, que regenera os SVGs sem animação — é
// idempotente: arquivo já animado é regravado do zero.
//
// O rosto exportado pelo ClipLab é o grupo `*-face-visible` com, depois dos
// <defs>, os <path> do rosto: olho esquerdo, olho direito e a boca (em uma ou
// duas peças).

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "hibees");

/** Defasagem estável por arquivo: os Hibees não piscam em uníssono. */
function seed(name) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}

function style(name) {
  const h = seed(name);
  const blink = 4.6 + (h % 17) / 10; // 4,6 a 6,2 s
  const gaze = 7 + ((h >> 3) % 40) / 10; // 7 a 11 s
  const talk = 3.4 + ((h >> 6) % 24) / 10; // 3,4 a 5,7 s
  const offset = (n) => `-${((h >> n) % 60) / 10}s`;
  return `<style id="hibee-anim">
.hb-eye,.hb-mouth{transform-box:fill-box;transform-origin:center}
.hb-eye{animation:hb-blink ${blink}s ${offset(1)} infinite}
.hb-mouth{animation:hb-talk ${talk}s ${offset(4)} ease-in-out infinite}
.hb-gaze{animation:hb-gaze ${gaze}s ${offset(7)} ease-in-out infinite}
@keyframes hb-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.08)}}
@keyframes hb-talk{0%,52%,100%{transform:scale(1,1)}58%{transform:scale(1.07,1.9)}64%{transform:scale(.96,1.1)}70%{transform:scale(1.07,1.7)}78%{transform:scale(1,1)}}
@keyframes hb-gaze{0%,30%,100%{transform:translate(0,0)}38%,52%{transform:translate(-4px,-1px)}62%,80%{transform:translate(4px,0)}}
@media (prefers-reduced-motion:reduce){.hb-eye,.hb-mouth,.hb-gaze{animation:none}}
</style>`;
}

let touched = 0;
for (const file of readdirSync(dir).filter((f) => f.endsWith(".svg"))) {
  const path = join(dir, file);
  let svg = readFileSync(path, "utf8");

  // Limpa o que uma execução anterior deixou.
  svg = svg.replace(/<style id="hibee-anim">[\s\S]*?<\/style>/, "");
  svg = svg.replace(/ class="hb-(eye|mouth|gaze)"/g, "");

  // O grupo do rosto em si é o que tem o clip `*-face-visible`. Em poses como
  // `thinking` há outros grupos antes dele (o "?" sobre a cabeça), então não
  // dá para pegar o primeiro <defs> depois de `*-face`.
  const wrapper = svg.search(/<g clip-path="url\(#[^"]*-face-visible\)"/);
  if (wrapper < 0) continue;
  const defsEnd = svg.indexOf("</defs>", wrapper);
  if (defsEnd < 0) continue;

  // O grupo que embrulha os paths do rosto também faz o "olhar de lado".
  svg = svg.slice(0, wrapper) + '<g class="hb-gaze" ' + svg.slice(wrapper + "<g ".length);

  const from = svg.indexOf("</defs>", wrapper) + "</defs>".length;
  const to = svg.indexOf("</g>", from);
  const faceBody = svg.slice(from, to);
  const paths = [...faceBody.matchAll(/<path /g)].map((m) => m.index);
  // Dois olhos e o resto é boca (em algumas poses a boca vem em duas peças).
  const classes = paths.map((_, i) => (i < 2 ? "hb-eye" : "hb-mouth"));
  let rebuilt = faceBody;
  // Do último para o primeiro, para os índices não se deslocarem.
  for (let i = paths.length - 1; i >= 0; i--) {
    rebuilt = rebuilt.slice(0, paths[i]) + `<path class="${classes[i]}" ` + rebuilt.slice(paths[i] + "<path ".length);
  }
  svg = svg.slice(0, from) + rebuilt + svg.slice(to);

  svg = svg.replace(/(<svg [^>]*>)/, `$1${style(file)}`);
  writeFileSync(path, svg);
  touched++;
  console.log(file, "→", classes.join(", ") || "só olhar");
}
console.log(`${touched} Hibees animados.`);

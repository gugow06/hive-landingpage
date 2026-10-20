// Gera o favo "manuscrito" do rodapé.
//
//   npm run comb
//
// O tile geométrico do resto do site é limpo demais para o rodapé, que pede
// traço de caderno. Cada aresta do favo vira uma curva com os pontos de
// controle deslocados, desenhada duas vezes com espessuras diferentes — é o
// mesmo truque do Rough.js, feito à mão para não puxar a biblioteca.
//
// O ruído é determinístico: o mesmo seed devolve sempre o mesmo desenho, então
// o SVG versionado não muda a cada execução.
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

/** PRNG pequeno e determinístico (mulberry32). */
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = rng(20261019);
const jitter = (amount) => (random() - 0.5) * 2 * amount;

/** Uma aresta tremida: curva cúbica com os controles fora da reta. */
function stroke([x1, y1], [x2, y2], wobble) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const c1 = [x1 + dx * 0.3 + jitter(wobble), y1 + dy * 0.3 + jitter(wobble)];
  const c2 = [x1 + dx * 0.7 + jitter(wobble), y1 + dy * 0.7 + jitter(wobble)];
  const n = (v) => Math.round(v * 10) / 10;
  return `M${n(x1 + jitter(wobble * 0.6))} ${n(y1 + jitter(wobble * 0.6))}C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(x2 + jitter(wobble * 0.6))} ${n(y2 + jitter(wobble * 0.6))}`;
}

/** Vértices de um hexágono de topo plano. */
function hexagon(cx, cy, r) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
}

const R = 58;
const width = 1600;
const height = 620;
const stepX = R * 1.5;
const stepY = R * Math.sqrt(3);

const paths = [];
for (let col = -1; col * stepX < width + R; col++) {
  for (let row = -1; row * stepY < height + R; row++) {
    const cx = col * stepX;
    const cy = row * stepY + (col % 2 ? stepY / 2 : 0);
    const points = hexagon(cx, cy, R);
    for (let i = 0; i < 6; i++) {
      // Só metade das arestas: o favo fica esboçado, não fechado, como um
      // desenho interrompido. Arestas compartilhadas não dobram o traço.
      if (i > 2) continue;
      const a = points[i];
      const b = points[(i + 1) % 6];
      paths.push(`<path d="${stroke(a, b, 5.5)}" stroke-width="${(1.6 + random() * 1.4).toFixed(2)}"/>`);
      if (random() > 0.55) {
        paths.push(`<path d="${stroke(a, b, 7.5)}" stroke-width="${(0.8 + random() * 0.6).toFixed(2)}" opacity="0.55"/>`);
      }
    }
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="none" stroke="#000" stroke-linecap="round">
${paths.join("\n")}
</svg>
`;

writeFileSync(resolve(here, "../public/brand/comb-sketch.svg"), svg);
console.log(`comb-sketch.svg — ${paths.length} traços, ${(svg.length / 1024).toFixed(0)} KB`);

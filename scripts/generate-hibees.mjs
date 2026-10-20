// Gera os Hibees do site a partir da mesma biblioteca que o produto usa para
// desenhar os agentes (ClipLab, vendorizada em @paperclipai/shared). Assim o
// mascote do site e o avatar que aparece no app são literalmente o mesmo desenho.
//
//   npm run hibees
//
// Aponte HIVE_REPO para o checkout do produto se ele não estiver ao lado deste
// projeto. O pacote shared precisa estar compilado (packages/shared/dist).
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = process.env.HIVE_REPO ?? resolve(here, "../../hive");
const entry = resolve(repo, "packages/shared/dist/cliplab/static.js");

if (!existsSync(entry)) {
  console.error(`Não encontrei o ClipLab em ${entry}.`);
  console.error("Compile o pacote shared do produto ou defina HIVE_REPO.");
  process.exit(1);
}

const { renderAgentSvg } = await import(pathToFileURL(entry).href);

// Cada Hibee é um papel do organograma. A paleta vem dos tokens cap-v1 do
// produto — âmbar para a rainha, as demais escolhidas para ler bem no escuro e
// no claro sem brigar com o #FFB800 da marca.
const cast = [
  { name: "rainha", palette: "golden-hour", poses: ["idle", "listening", "success"] },
  { name: "arquiteta", palette: "tangerine-cobalt", poses: ["idle", "thinking", "working"] },
  { name: "operaria", palette: "solar-flare", poses: ["idle", "working", "success"] },
  { name: "guardia", palette: "arctic-blue", poses: ["idle", "listening", "thinking"] },
  { name: "escriba", palette: "electric-grove", poses: ["idle", "thinking", "working"] },
  { name: "dorminhoco", palette: "muted-dream", poses: ["sleepy"] },
];

const out = resolve(here, "../public/hibees");
mkdirSync(out, { recursive: true });

let count = 0;
for (const { name, palette, poses } of cast) {
  for (const pose of poses) {
    const appearance =
      palette === "muted-dream"
        ? { schemaVersion: 1, characterVersion: "cap-v1", paletteId: "golden-hour" }
        : { schemaVersion: 1, characterVersion: "cap-v1", paletteId: palette };
    // IDs de gradiente são globais no DOM: prefixar por arquivo evita colisão
    // caso alguém passe a inlinar os SVGs em vez de usá-los como <img>.
    const svg = renderAgentSvg(appearance, 512, 1, pose, palette === "muted-dream").replaceAll(
      "agent-",
      `${name}-${pose}-`,
    );
    writeFileSync(resolve(out, `${name}-${pose}.svg`), svg);
    count++;
  }
}

console.log(`${count} Hibees gerados em public/hibees`);

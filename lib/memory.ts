/**
 * A memória da demonstração: os mesmos documentos e ligações do vídeo do
 * herói, copiados de `hive-demo/src/hero/memoryData.ts` e `graph.ts`. Se o
 * vídeo mudar, copie de novo — os dois precisam contar a mesma história.
 */

export type DocId =
  | "visao" | "posic" | "plano" | "decis" | "cal"
  | "tom" | "conc" | "personas" | "empresa" | "faq" | "metricas";

export interface MemoryDoc {
  id: DocId;
  title: string;
  folder: "lancamento" | "marca" | null;
  /** Parágrafos e listas do corpo, já em blocos simples. */
  blocks: Array<
    | { type: "h1"; text: string }
    | { type: "quote"; text: string }
    | { type: "p"; parts: Array<string | { link: DocId }> }
    | { type: "ul"; items: Array<Array<string | { link: DocId }>> }
  >;
}

const STAMP = "Criado em: 22/10/2026 14:41 · Atualizado em: 22/10/2026 14:41";

export const DOCS: Record<DocId, MemoryDoc> = {
  visao: {
    id: "visao",
    title: "Lançamento do produto — Visão geral",
    folder: "lancamento",
    blocks: [
      { type: "h1", text: "Lançamento do produto — Visão geral" },
      { type: "quote", text: STAMP },
      { type: "p", parts: ["Objetivo: lançar o produto com posicionamento claro e conteúdo pronto para o mercado."] },
      {
        type: "ul",
        items: [
          [{ link: "posic" }, " — como o produto é apresentado"],
          [{ link: "plano" }, " — canais, formatos e ritmo de publicação"],
          [{ link: "decis" }, " — o que foi decidido e por quê"],
        ],
      },
    ],
  },
  posic: {
    id: "posic",
    title: "Posicionamento",
    folder: "lancamento",
    blocks: [
      { type: "h1", text: "Posicionamento" },
      { type: "quote", text: STAMP },
      { type: "p", parts: ["O produto é o time de IA da empresa: ordenado, contextualizado e sob controle."] },
      {
        type: "ul",
        items: [
          ["Para quem: ", { link: "personas" }],
          ["Contra quem: ", { link: "conc" }],
          ["Decisões: ", { link: "decis" }],
        ],
      },
    ],
  },
  plano: {
    id: "plano",
    title: "Plano de conteúdo",
    folder: "lancamento",
    blocks: [
      { type: "h1", text: "Plano de conteúdo" },
      { type: "quote", text: STAMP },
      { type: "p", parts: ["Três frentes: site, e-mail e redes. Mensagem base em ", { link: "posic" }, "."] },
      { type: "ul", items: [[{ link: "cal" }], [{ link: "tom" }]] },
    ],
  },
  decis: {
    id: "decis",
    title: "Decisões do lançamento",
    folder: "lancamento",
    blocks: [
      { type: "h1", text: "Decisões do lançamento" },
      { type: "quote", text: STAMP },
      { type: "p", parts: ["Lançar em duas fases. Mensagem principal definida em ", { link: "posic" }, "; execução em ", { link: "plano" }, "."] },
    ],
  },
  cal: {
    id: "cal",
    title: "Calendário editorial",
    folder: "lancamento",
    blocks: [
      { type: "h1", text: "Calendário editorial" },
      { type: "quote", text: STAMP },
      { type: "p", parts: ["Publicações semanais, alinhadas ao ", { link: "plano" }, "."] },
    ],
  },
  tom: {
    id: "tom",
    title: "Tom de voz",
    folder: "marca",
    blocks: [
      { type: "h1", text: "Tom de voz" },
      { type: "quote", text: STAMP },
      { type: "p", parts: ["Direto, humano e sem jargão. Parte de ", { link: "empresa" }, "."] },
    ],
  },
  conc: {
    id: "conc",
    title: "Concorrentes",
    folder: "marca",
    blocks: [
      { type: "h1", text: "Concorrentes" },
      { type: "quote", text: STAMP },
      { type: "p", parts: ["Mapa de alternativas e diferenças que sustentam o ", { link: "posic" }, "."] },
    ],
  },
  personas: {
    id: "personas",
    title: "Personas",
    folder: "marca",
    blocks: [
      { type: "h1", text: "Personas" },
      { type: "quote", text: STAMP },
      { type: "p", parts: ["Quem usa e quem decide. Contexto em ", { link: "empresa" }, "."] },
    ],
  },
  empresa: {
    id: "empresa",
    title: "Visão da empresa",
    folder: null,
    blocks: [
      { type: "h1", text: "Visão da empresa" },
      { type: "quote", text: STAMP },
      { type: "p", parts: ["Missão, valores e o que a empresa quer ser."] },
    ],
  },
  faq: {
    id: "faq",
    title: "FAQ do produto",
    folder: null,
    blocks: [
      { type: "h1", text: "FAQ do produto" },
      { type: "quote", text: STAMP },
      { type: "p", parts: ["Perguntas frequentes, respondidas com base em ", { link: "posic" }, "."] },
    ],
  },
  metricas: {
    id: "metricas",
    title: "Métricas de sucesso",
    folder: null,
    blocks: [
      { type: "h1", text: "Métricas de sucesso" },
      { type: "quote", text: STAMP },
      { type: "p", parts: ["Como medir o lançamento, conforme as ", { link: "decis" }, "."] },
    ],
  },
};

export const FOLDERS: Array<{ id: "lancamento" | "marca"; name: string }> = [
  { id: "lancamento", name: "Lançamento do produto" },
  { id: "marca", name: "Marca" },
];

/** As conexões do grafo: cada `[[wikilink]]` resolvido nos corpos acima, sem repetição. */
export const LINKS: Array<[DocId, DocId]> = (() => {
  const seen = new Set<string>();
  const out: Array<[DocId, DocId]> = [];
  for (const doc of Object.values(DOCS)) {
    for (const block of doc.blocks) {
      const parts = block.type === "p" ? block.parts : block.type === "ul" ? block.items.flat() : [];
      for (const part of parts) {
        if (typeof part === "string") continue;
        const key = `${doc.id}>${part.link}`;
        if (part.link === doc.id || seen.has(key)) continue;
        seen.add(key);
        out.push([doc.id, part.link]);
      }
    }
  }
  return out;
})();

export const DOC_IDS = Object.keys(DOCS) as DocId[];

/**
 * Layout do grafo, calculado uma vez e de forma determinística (sem aleatório):
 * nós se repelem, arestas puxam, tudo é atraído ao centro. O resultado é o
 * mesmo do vídeo e o mesmo em servidor e cliente — sem divergir na hidratação.
 */
export interface GraphPoint {
  x: number;
  y: number;
}

function layout(): Record<DocId, GraphPoint> {
  const n = DOC_IDS.length;
  const pos = DOC_IDS.map((_, i) => ({
    x: Math.cos((i / n) * Math.PI * 2) * 0.6,
    y: Math.sin((i / n) * Math.PI * 2) * 0.6,
  }));
  const index = new Map(DOC_IDS.map((id, i) => [id, i] as const));

  for (let step = 0; step < 420; step++) {
    const cooling = 1 - step / 420;
    const force = pos.map(() => ({ x: 0, y: 0 }));
    for (let a = 0; a < n; a++) {
      for (let b = a + 1; b < n; b++) {
        const dx = pos[a]!.x - pos[b]!.x;
        const dy = pos[a]!.y - pos[b]!.y;
        const dist2 = Math.max(dx * dx + dy * dy, 0.01);
        const push = 0.06 / dist2;
        const dist = Math.sqrt(dist2);
        force[a]!.x += (dx / dist) * push;
        force[a]!.y += (dy / dist) * push;
        force[b]!.x -= (dx / dist) * push;
        force[b]!.y -= (dy / dist) * push;
      }
    }
    for (const [from, to] of LINKS) {
      const a = index.get(from)!;
      const b = index.get(to)!;
      const dx = pos[b]!.x - pos[a]!.x;
      const dy = pos[b]!.y - pos[a]!.y;
      const dist = Math.max(Math.hypot(dx, dy), 0.001);
      const pull = (dist - 0.42) * 0.9;
      force[a]!.x += (dx / dist) * pull * 0.5;
      force[a]!.y += (dy / dist) * pull * 0.5;
      force[b]!.x -= (dx / dist) * pull * 0.5;
      force[b]!.y -= (dy / dist) * pull * 0.5;
    }
    for (let i = 0; i < n; i++) {
      force[i]!.x -= pos[i]!.x * 0.35;
      force[i]!.y -= pos[i]!.y * 0.35;
      pos[i]!.x += force[i]!.x * 0.05 * cooling;
      pos[i]!.y += force[i]!.y * 0.05 * cooling;
    }
  }

  // Normaliza para [-1, 1] mantendo a proporção.
  const minX = Math.min(...pos.map((p) => p.x));
  const maxX = Math.max(...pos.map((p) => p.x));
  const minY = Math.min(...pos.map((p) => p.y));
  const maxY = Math.max(...pos.map((p) => p.y));
  const span = Math.max(maxX - minX, maxY - minY) || 1;
  const out = {} as Record<DocId, GraphPoint>;
  DOC_IDS.forEach((id, i) => {
    out[id] = {
      x: ((pos[i]!.x - (minX + maxX) / 2) / span) * 2,
      y: ((pos[i]!.y - (minY + maxY) / 2) / span) * 2,
    };
  });
  return out;
}

export const GRAPH_LAYOUT = layout();


/** Vizinhos de cada documento (conexões nos dois sentidos). */
export const NEIGHBORS: Record<DocId, Set<DocId>> = (() => {
  const map = Object.fromEntries(DOC_IDS.map((id) => [id, new Set<DocId>()])) as Record<DocId, Set<DocId>>;
  for (const [a, b] of LINKS) {
    map[a].add(b);
    map[b].add(a);
  }
  return map;
})();

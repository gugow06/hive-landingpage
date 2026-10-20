/**
 * Organograma do herói.
 *
 * O layout é portado de `ui/src/pages/OrgChart.tsx` do produto — mesmas
 * constantes de card e espaçamento, mesmo `subtreeWidth`/`layoutTree`, mesmas
 * arestas ortogonais. O site desenha o organograma do jeito que o app desenha,
 * não uma aproximação.
 */

export const CARD_W = 200;
export const CARD_H = 100;
export const GAP_X = 32;
export const GAP_Y = 80;
export const PADDING = 8;

/** Cores do ponto de status, iguais às do app. */
export const STATUS_DOT: Record<string, string> = {
  running: "#22d3ee",
  active: "#4ade80",
  paused: "#facc15",
  idle: "#facc15",
  error: "#f87171",
  terminated: "#a3a3a3",
};

export const STATUS_LABEL: Record<string, string> = {
  running: "executando",
  active: "ativo",
  idle: "ocioso",
  paused: "pausado",
};

export interface OrgNode {
  id: string;
  name: string;
  /** Papel, nos mesmos identificadores de AGENT_ROLE_LABELS do produto. */
  role: string;
  title: string;
  status: keyof typeof STATUS_DOT | string;
  adapter: string;
  capabilities: string;
  /** Qual Hibee representa este agente (paletas cap-v1). */
  hibee: string;
  /** Paleta e pose do personagem vivo, para o runtime 3D. */
  palette: string;
  pose: string;
  reports: OrgNode[];
}

/** O time que o Hive monta para o pedido do herói. */
export const ORG: OrgNode = {
  id: "ceo",
  name: "Darnold",
  role: "ceo",
  title: "CEO",
  status: "running",
  adapter: "Claude Code",
  capabilities: "Recebe o objetivo, propõe a estratégia e contrata o time.",
  hibee: "rainha-listening",
  palette: "golden-hour",
  pose: "listening",
  reports: [
    {
      id: "cto",
      name: "Íris",
      role: "cto",
      title: "CTO",
      status: "running",
      adapter: "Codex",
      capabilities: "Define arquitetura, stack e divide o trabalho.",
      hibee: "arquiteta-working",
      palette: "tangerine-cobalt",
      pose: "working",
      reports: [
        {
          id: "front",
          name: "Nico",
          role: "engineer",
          title: "Dev Front-end",
          status: "running",
          adapter: "Cursor",
          capabilities: "Painel de métricas e a tela de criação de links.",
          hibee: "operaria-working",
          palette: "solar-flare",
          pose: "working",
          reports: [],
        },
        {
          id: "back",
          name: "Rubi",
          role: "engineer",
          title: "Dev Back-end",
          status: "active",
          adapter: "Claude Code",
          capabilities: "API pública, expiração de links e o redirect.",
          hibee: "escriba-working",
          palette: "electric-grove",
          pose: "working",
          reports: [],
        },
        {
          id: "qa",
          name: "Vera",
          role: "qa",
          title: "QA",
          status: "idle",
          adapter: "Process",
          capabilities: "Testa carga, regressão e aprova antes do deploy.",
          hibee: "guardia-listening",
          palette: "arctic-blue",
          pose: "listening",
          reports: [],
        },
      ],
    },
  ],
};

export interface LayoutNode extends Omit<OrgNode, "reports"> {
  x: number;
  y: number;
  children: LayoutNode[];
}

/** Largura que cada subárvore precisa. */
function subtreeWidth(node: OrgNode): number {
  if (node.reports.length === 0) return CARD_W;
  const childrenW = node.reports.reduce(
    (sum, child) => sum + subtreeWidth(child),
    0,
  );
  return Math.max(CARD_W, childrenW + (node.reports.length - 1) * GAP_X);
}

/** Atribui x,y recursivamente. */
function layoutTree(node: OrgNode, x: number, y: number): LayoutNode {
  const totalW = subtreeWidth(node);
  const children: LayoutNode[] = [];

  if (node.reports.length > 0) {
    const childrenW = node.reports.reduce(
      (sum, child) => sum + subtreeWidth(child),
      0,
    );
    let cx = x + (totalW - childrenW - (node.reports.length - 1) * GAP_X) / 2;
    for (const child of node.reports) {
      children.push(layoutTree(child, cx, y + CARD_H + GAP_Y));
      cx += subtreeWidth(child) + GAP_X;
    }
  }

  const { reports: _reports, ...rest } = node;
  return { ...rest, x: x + (totalW - CARD_W) / 2, y, children };
}

export function flatten(node: LayoutNode): LayoutNode[] {
  return [node, ...node.children.flatMap(flatten)];
}

export function edges(
  node: LayoutNode,
): Array<{ parent: LayoutNode; child: LayoutNode }> {
  return node.children.flatMap((child) => [
    { parent: node, child },
    ...edges(child),
  ]);
}

export function buildLayout() {
  const root = layoutTree(ORG, PADDING, PADDING);
  const nodes = flatten(root);
  return {
    root,
    nodes,
    links: edges(root),
    width: Math.max(...nodes.map((n) => n.x + CARD_W)) + PADDING,
    height: Math.max(...nodes.map((n) => n.y + CARD_H)) + PADDING,
  };
}

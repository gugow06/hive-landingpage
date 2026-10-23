"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

interface Node {
  x: number;
  y: number;
  links: number[];
}

interface Particle {
  from: number;
  to: number;
  /** Progresso na aresta atual, 0 a 1. */
  t: number;
  speed: number;
  trail: { x: number; y: number }[];
}

/**
 * Projeção de monitor curvo, côncavo — a tela abraça quem olha.
 *
 * O favo é tratado como se estivesse colado na face interna de um cilindro
 * vertical: o centro é o ponto mais distante e as bordas vêm na direção do
 * observador. Perto significa maior, então as colunas das bordas **abrem** e
 * esticam na vertical, em vez de comprimir.
 *
 * A distorção é aplicada nos próprios nós, não no desenho — assim as
 * partículas, que andam pelas arestas, curvam junto em vez de descolar da malha.
 */
function curve(x: number, y: number, width: number, height: number) {
  const ANGLE = 0.78; // abertura do cilindro na borda, em radianos
  const DEPTH = 0.4; // quanto a borda avança na direção de quem olha
  const halfW = width / 2;
  const u = Math.max(-1, Math.min(1, (x - halfW) / halfW));
  const theta = u * ANGLE;
  // Menor que 1 nas bordas: elas estão mais perto, e tudo ali cresce.
  const depth = 1 - DEPTH * (1 - Math.cos(theta));
  const eye = height * 0.42;
  return {
    x: halfW + (halfW * Math.sin(theta)) / Math.sin(ANGLE) / depth,
    y: eye + (y - eye) / depth,
  };
}

/** Lattice hexagonal como grafo: nós e as arestas que saem de cada um. */
function lattice(width: number, height: number, radius: number) {
  const nodes: Node[] = [];
  const index = new Map<string, number>();
  const key = (x: number, y: number) => `${Math.round(x)}:${Math.round(y)}`;

  const stepX = radius * 1.5;
  const stepY = radius * Math.sqrt(3);
  // Sobra nas bordas: a projeção puxa os extremos para dentro, e sem essa
  // folga a curva deixaria faixas vazias nos cantos.
  const overX = width * 0.3;
  const overY = height * 0.35;

  for (let col = Math.floor(-overX / stepX) - 1; col * stepX < width + overX; col++) {
    for (let row = Math.floor(-overY / stepY) - 1; row * stepY < height + overY; row++) {
      const cx = col * stepX;
      const cy = row * stepY + (col % 2 ? stepY / 2 : 0);
      // Os seis vértices do hexágono; os compartilhados colapsam pelo mapa.
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        if (index.has(key(x, y))) continue;
        index.set(key(x, y), nodes.length);
        const projected = curve(x, y, width, height);
        nodes.push({ x: projected.x, y: projected.y, links: [] });
      }
      // Liga vértice a vértice ao redor do hexágono.
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const b = (Math.PI / 3) * ((i + 1) % 6);
        const from = index.get(key(cx + radius * Math.cos(a), cy + radius * Math.sin(a)));
        const to = index.get(key(cx + radius * Math.cos(b), cy + radius * Math.sin(b)));
        if (from === undefined || to === undefined || from === to) continue;
        if (!nodes[from]!.links.includes(to)) nodes[from]!.links.push(to);
        if (!nodes[to]!.links.includes(from)) nodes[to]!.links.push(from);
      }
    }
  }

  return nodes;
}

/**
 * Fundo do herói: a malha da colmeia em traço muito fraco, percorrida por
 * partículas âmbar que deixam cauda brilhante.
 *
 * As partículas andam sobre as arestas do próprio favo e sorteiam para onde ir
 * a cada vértice — por isso cada uma faz um caminho diferente, e o movimento
 * lê como a colmeia conduzindo informação em vez de pontos flutuando.
 *
 * É decorativo (`aria-hidden`), não acende com `prefers-reduced-motion` e pausa
 * quando a seção sai da tela.
 */
export function HexField({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    if (!element || prefersReducedMotion()) return;

    const context = element.getContext("2d");
    if (!context) return;

    const RADIUS = 46;
    let nodes: Node[] = [];
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;

    const pick = (node: Node, avoid: number) => {
      const options = node.links.filter((link) => link !== avoid);
      const pool = options.length ? options : node.links;
      return pool[Math.floor(Math.random() * pool.length)]!;
    };

    function build() {
      const rect = element!.getBoundingClientRect();
      // O devicePixelRatio é limitado: a malha é difusa, e 3× só custa pixels.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      element!.width = Math.round(width * dpr);
      element!.height = Math.round(height * dpr);
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = lattice(width, height, RADIUS);
      // Poucas partículas: o fundo acompanha, quem conduz o olhar é o vídeo.
      const count = Math.max(2, Math.min(4, Math.round(width / 420)));
      particles = Array.from({ length: count }, () => {
        const from = Math.floor(Math.random() * nodes.length);
        return {
          from,
          to: pick(nodes[from]!, -1),
          t: Math.random(),
          speed: 0.01 + Math.random() * 0.008,
          trail: [],
        };
      });
    }

    function draw() {
      context!.clearRect(0, 0, width, height);

      // A malha: degradê de cima para baixo, bem apagada. A cor sai de uma
      // variável CSS, porque no claro o âmbar some contra o branco.
      const style = getComputedStyle(element!);
      const line = style.getPropertyValue("--hex-line").trim() || "255,184,0";
      // A opacidade também vem do tema: o cinza do claro precisa de peso, o
      // âmbar do escuro já salta e viraria uma grade gritante no mesmo valor.
      const alpha = Number(style.getPropertyValue("--hex-alpha")) || 0.85;
      const mesh = context!.createLinearGradient(0, 0, 0, height);
      mesh.addColorStop(0, `rgba(${line},${alpha * 0.55})`);
      mesh.addColorStop(0.42, `rgba(${line},${alpha})`);
      mesh.addColorStop(1, `rgba(${line},0)`);
      context!.strokeStyle = mesh;
      context!.lineWidth = 1;
      context!.beginPath();
      // Cada aresta uma vez só: `link > i` evita o par espelhado sem precisar
      // procurar o índice do nó (o indexOf aqui era O(n²) por quadro).
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!;
        for (const link of node.links) {
          if (link <= i) continue;
          context!.moveTo(node.x, node.y);
          context!.lineTo(nodes[link]!.x, nodes[link]!.y);
        }
      }
      context!.stroke();

      // Vinheta: apaga a malha nas pontas, para ela nascer do centro em vez de
      // bater nas bordas da tela. Vai só na malha — as partículas mantêm o
      // brilho inteiro por onde passarem.
      context!.save();
      context!.globalCompositeOperation = "destination-out";
      context!.translate(width / 2, height / 2);
      // O gradiente radial do canvas é circular; a escala vertical transforma
      // o círculo numa elipse. O fator abaixo de 1 a deixa mais alta que a
      // seção: o aperto fica nas laterais, e topo e base não são comidos.
      context!.scale(1, (height / width) * 0.82);
      // Raio em 0,62 da largura: no espaço já escalado, o meio das bordas cai
      // em ~0,81 do raio e os cantos passam de 1 — então as pontas apagam de
      // vez e sobra um núcleo claramente central.
      const vignette = context!.createRadialGradient(0, 0, 0, 0, 0, width * 0.62);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(0.3, "rgba(0,0,0,0)");
      vignette.addColorStop(0.55, "rgba(0,0,0,0.38)");
      vignette.addColorStop(0.78, "rgba(0,0,0,0.85)");
      vignette.addColorStop(1, "rgba(0,0,0,1)");
      context!.fillStyle = vignette;
      context!.fillRect(-width, -height, width * 2, height * 2);
      context!.restore();

      // As partículas e suas caudas.
      context!.lineCap = "round";
      for (const particle of particles) {
        particle.t += particle.speed;
        while (particle.t >= 1) {
          particle.t -= 1;
          const next = pick(nodes[particle.to]!, particle.from);
          particle.from = particle.to;
          particle.to = next;
        }

        const a = nodes[particle.from]!;
        const b = nodes[particle.to]!;
        const x = a.x + (b.x - a.x) * particle.t;
        const y = a.y + (b.y - a.y) * particle.t;

        particle.trail.push({ x, y });
        if (particle.trail.length > 90) particle.trail.shift();

        // A cauda desenha segmento a segmento, cada um mais apagado e mais
        // fino que o seguinte — um gradiente ao longo do caminho, que um
        // gradiente linear não daria porque o rastro faz curvas.
        for (let i = 1; i < particle.trail.length; i++) {
          const previous = particle.trail[i - 1]!;
          const point = particle.trail[i]!;
          // Um salto grande é a partícula reaparecendo noutro ponto da malha.
          if (Math.hypot(point.x - previous.x, point.y - previous.y) > RADIUS * 1.2) continue;
          // Quadrática: a ponta da cauda apaga rápido e a cabeça concentra o
          // brilho; linear deixaria um rastro uniforme, sem direção.
          const fade = (i / particle.trail.length) ** 2;
          context!.strokeStyle = `rgba(255,184,0,${(fade * 0.4).toFixed(3)})`;
          context!.lineWidth = 0.4 + fade * 1.6;
          context!.beginPath();
          context!.moveTo(previous.x, previous.y);
          context!.lineTo(point.x, point.y);
          context!.stroke();
        }

        context!.fillStyle = "rgba(255,184,0,0.75)";
        context!.shadowColor = "rgba(255,184,0,0.6)";
        context!.shadowBlur = 6;
        context!.beginPath();
        context!.arc(x, y, 1.8, 0, Math.PI * 2);
        context!.fill();
        context!.shadowBlur = 0;
      }

      frame = requestAnimationFrame(draw);
    }

    function start() {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(draw);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    build();

    const resize = new ResizeObserver(() => {
      build();
    });
    resize.observe(element);

    // Fora da tela ou com a aba escondida, nada é desenhado.
    const seen = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? start() : stop()));
    seen.observe(element);
    const visibility = () => {
      if (document.hidden) stop();
      else if (element.getBoundingClientRect().bottom > 0) start();
    };
    document.addEventListener("visibilitychange", visibility);

    return () => {
      stop();
      resize.disconnect();
      seen.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}

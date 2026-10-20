"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type Player = { destroy(): void };

/**
 * O Hibee vivo: o mesmo personagem 3D (Three.js) que o Hive desenha para cada
 * agente dentro do app, rodando aqui pelo runtime vendorizado em `lib/cliplab`.
 * Ele acompanha o cursor pela página inteira.
 *
 * O SVG estático fica por baixo e aparece sozinho quando o runtime não pode
 * rodar — movimento reduzido, WebGL indisponível ou erro de contexto. É o
 * mesmo fallback que o app usa.
 */
export function LiveHibee({
  palette = "golden-hour",
  pose = "idle",
  fallback,
  size = 220,
  label,
  className = "",
}: {
  palette?: string;
  pose?: string;
  fallback: string;
  size?: number;
  label: string;
  className?: string;
}) {
  const host = useRef<HTMLSpanElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const node = host.current;
    if (!node || prefersReducedMotion()) return;

    let player: Player | null = null;
    let cancelled = false;

    // Só acende quando entra na viewport: nada de contexto WebGL fora de tela.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || player || cancelled) return;
      observer.disconnect();

      void Promise.all([import("@/lib/cliplab/runtime.js"), import("@/lib/cliplab/definition.js")])
        .then(([runtime, library]) => {
          if (cancelled || !host.current) return;
          const appearance = { schemaVersion: 1, characterVersion: "cap-v1", paletteId: palette };
          player = runtime.createCharacter(host.current, library.characterDefinition(appearance, false), {
            animation: library.animationId(pose),
            trackingScope: "page",
            followCursor: true,
            followRotation: true,
            displaySize: size,
            onError: () => setLive(false),
          });
          setLive(true);
        })
        .catch(() => setLive(false));
    });

    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
      player?.destroy();
    };
  }, [palette, pose, size]);

  return (
    <span
      role="img"
      aria-label={label}
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/hibees/${fallback}.svg`}
        alt=""
        width={size}
        height={size}
        className={`size-full object-contain transition-opacity duration-300 ${live ? "opacity-0" : "opacity-100"}`}
      />
      <span ref={host} aria-hidden="true" className="absolute inset-0" />
    </span>
  );
}

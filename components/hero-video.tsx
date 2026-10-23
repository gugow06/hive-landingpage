"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * O vídeo da demonstração sai de `../hive-demo` (Remotion): a interface do
 * app recriada a partir do código do produto, com dados fictícios. O herói é
 * uma faixa escura nos dois temas, então só o corte escuro é usado aqui; o
 * original fica em `images/videos/` e é recortado para `public/video/`.
 */
const SOURCE = "/video/hive-demo-dark.mp4";
const POSTER = "/video/hive-demo-dark-poster.webp";

/**
 * Vídeo da demonstração no herói.
 *
 * - Toca sozinho, mudo e em loop — mas só enquanto estiver na tela.
 * - Se o navegador recusar o autoplay, fica na capa com o botão de reproduzir.
 * - Com `prefers-reduced-motion` nem o arquivo é baixado: a capa fica parada
 *   até a pessoa pedir para tocar.
 * - A capa é fundo CSS e o espaço da mídia está reservado pelo `aspect-ratio`
 *   desde o HTML, então nada pula quando o vídeo chega.
 */
export function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [armed, setArmed] = useState(false);
  // Quem pausou foi a pessoa: voltar à tela não pode retomar sozinho.
  const userPaused = useRef(false);

  // Sem movimento reduzido, o vídeo é "armado": recebe a fonte e passa a
  // tocar quando entra na tela.
  useEffect(() => {
    if (!prefersReducedMotion()) setArmed(true);
  }, []);

  const tryPlay = useCallback(() => {
    const node = video.current;
    if (!node) return;
    node.play().catch(() => {
      // Autoplay bloqueado (economia de dados, política do navegador): a capa
      // continua, com o botão de reproduzir à vista.
      setPlaying(false);
    });
  }, []);

  // A fonte só entra quando o vídeo é armado — com movimento reduzido, nada é
  // baixado até o primeiro clique.
  useEffect(() => {
    const node = video.current;
    if (!node || !armed || node.getAttribute("src")) return;
    node.src = SOURCE;
    node.load();
  }, [armed]);

  // Fora da tela, pausa; de volta, retoma — a menos que a pessoa tenha pausado.
  useEffect(() => {
    const node = video.current;
    const box = frame.current;
    if (!node || !box || !armed) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !userPaused.current) tryPlay();
        else if (!entry?.isIntersecting) node.pause();
      },
      { threshold: 0.2 },
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, [armed, tryPlay]);

  function toggle() {
    const node = video.current;
    if (!node) return;
    if (!armed) {
      // Movimento reduzido: o primeiro clique é o que baixa e toca.
      userPaused.current = false;
      setArmed(true);
      return;
    }
    if (node.paused) {
      userPaused.current = false;
      tryPlay();
    } else {
      userPaused.current = true;
      node.pause();
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      {/* O vídeo é recortado na janela do app (1750×984): sem o fundo do quadro
          original, o app assenta direto na página. Só o topo é arredondado: a
          base é cortada reta pela faixa do herói, como a interface saindo de
          baixo. O raio acompanha o da janela e esconde os cantos cinza que
          sobram do recorte. */}
      <div ref={frame} className="relative">
        <div className="relative aspect-[1750/984] overflow-hidden rounded-t-[14px] bg-[#0b0b0b] bg-cover bg-center [background-image:url(/video/hive-demo-dark-poster.webp)] [box-shadow:0_-10px_60px_-20px_rgba(0,0,0,0.6)]">
          <video
            ref={video}
            className="absolute inset-0 size-full object-cover"
            muted
            loop
            playsInline
            preload="none"
            poster={POSTER}
            aria-label="Demonstração do Hive: uma tarefa é criada, o coordenador monta a equipe, o organograma aparece e os documentos da memória se ligam no grafo."
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />

          {/* Sem botões sobre o vídeo: ele mesmo é o controle. Clicar (ou Enter/
              Espaço, já que é um <button>) pausa e retoma — requisito para
              movimento que dura mais de 5 s (WCAG 2.2.2). O ícone de tocar só
              aparece quando parado: com autoplay negado ou movimento reduzido,
              é o convite para começar. */}
          <button
            type="button"
            onClick={toggle}
            className={`absolute inset-0 flex items-center justify-center transition-colors ${
              playing ? "cursor-pointer" : "bg-ink-900/10 hover:bg-ink-900/20"
            }`}
            aria-label={playing ? "Pausar a demonstração" : "Reproduzir a demonstração"}
          >
            {!playing && (
              <span className="inline-flex size-16 items-center justify-center rounded-full bg-amber text-ink-900 shadow-lg">
                <Play className="size-7 translate-x-0.5 fill-current" aria-hidden="true" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

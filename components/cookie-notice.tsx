"use client";

import { useEffect, useState } from "react";

/** Chave do armazenamento local: guarda a data em que a pessoa viu o aviso. */
export const COOKIE_NOTICE_KEY = "hive-cookie-notice";
const VALIDADE_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Aviso de cookies. O site hoje só guarda armazenamento essencial no navegador (veja
 * `/cookies`), então o aviso informa e pede um "entendi"; não há o que aceitar ou recusar. Se um
 * dia entrarem cookies de análise ou publicidade, este componente vira um pedido de
 * consentimento de verdade, com escolha por categoria, ANTES de carregar qualquer um deles.
 *
 * Não bloqueia a página nem rouba o foco: é uma faixa discreta no canto, que se lembra da
 * escolha por 12 meses. Aparece só depois de montar, para o HTML do servidor não variar.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let seen: number | null = null;
    try {
      const raw = localStorage.getItem(COOKIE_NOTICE_KEY);
      if (raw) seen = Date.parse(raw);
    } catch {
      /* sem armazenamento: o aviso aparece a cada visita, e tudo bem */
    }
    if (!seen || Number.isNaN(seen) || Date.now() - seen > VALIDADE_MS) setVisible(true);
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(COOKIE_NOTICE_KEY, new Date().toISOString());
    } catch {
      /* ignora */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section
      role="region"
      aria-label="Aviso de cookies"
      className="dark glass fixed right-4 bottom-4 left-4 z-[60] rounded-2xl p-5 text-ink sm:right-auto sm:max-w-[420px]"
    >
      <p className="text-[15px] leading-6 text-ink-soft">
        Este site guarda só o essencial no seu navegador, para lembrar de escolhas como este aviso. Não usamos cookies de
        publicidade nem de análise.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <button type="button" onClick={dismiss} className="btn btn-primary btn-sm">
          Entendi
        </button>
        <a href="/cookies" className="tap text-[15px] text-ink underline decoration-current/40 underline-offset-[3px] hover:decoration-current">
          Saiba mais
        </a>
      </div>
    </section>
  );
}

import { BrandIcon } from "./brand-icons";

/** Convite da comunidade do Hive no WhatsApp. */
export const WHATSAPP_URL = "https://chat.whatsapp.com/LHrZ5vK090F1FmcyivB0dz";

/**
 * Botão da comunidade no WhatsApp, para a barra de navegação.
 *
 * Em repouso é só o ícone, branco num círculo escuro (o branco precisa de um fundo para existir
 * no tema claro também). No hover ou no foco do teclado o círculo fica verde e abaixo dele
 * aparece "Entre na nossa comunidade", em branco como o ícone. O texto fica embaixo, e não
 * ao lado, para não cobrir os links da barra.
 *
 * O verde é `#0F8247`, um tom mais fechado que o #25D366 da marca: texto branco sobre #25D366
 * tem só 2:1 de contraste, e sobre este passa de 4,5:1. O nome acessível existe o tempo todo
 * (`aria-label`), então o leitor de tela e o toque no celular, que não têm hover, também
 * entendem o botão.
 */
export function WhatsAppButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Entre na nossa comunidade no WhatsApp (abre em uma nova aba)"
      className={`group relative inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white [box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.16)] transition-[background-color,box-shadow] duration-200 hover:bg-[#0F8247] hover:[box-shadow:none] focus-visible:bg-[#0F8247] focus-visible:[box-shadow:none] motion-reduce:transition-none ${className}`}
    >
      <BrandIcon name="whatsapp" className="size-[22px] text-white" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-full right-0 z-10 mt-2 translate-y-1 rounded-full bg-[#0F8247] px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-white opacity-0 shadow-[0_8px_24px_rgb(0_0_0/0.18)] transition-[opacity,transform] duration-200 ease-[var(--ease-out)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
      >
        Entre na nossa comunidade
      </span>
    </a>
  );
}

import { BrandIcon } from "./brand-icons";

/** Convite da comunidade do Hive no WhatsApp. */
export const WHATSAPP_URL = "https://chat.whatsapp.com/LHrZ5vK090F1FmcyivB0dz";

/**
 * Botão da comunidade no WhatsApp, para a barra de navegação.
 *
 * Em repouso é só o ícone, branco num círculo escuro (o branco precisa de um fundo para existir
 * no tema claro também). No hover ou no foco do teclado o botão cresce para a esquerda, na mesma
 * linha do ícone, mostra "Entre na nossa comunidade" em branco e fica verde.
 *
 * Ele faz parte do fluxo da barra (não é sobreposto): a barra é uma grade de três colunas, e a
 * coluna das ações cresce junto com o botão. Os links só se deslocam para a esquerda quando não
 * há espaço sobrando, então nada fica coberto. Abaixo de `sm` ele não cresce: ali não há hover
 * e a barra não tem espaço.
 *
 * O verde é `#0F8247`, um tom mais fechado que o #25D366 da marca: texto branco sobre #25D366
 * tem só 2:1 de contraste, e sobre este passa de 4,5:1. O nome acessível existe o tempo todo
 * (`aria-label`), então o leitor de tela e o toque no celular também entendem o botão.
 */
export function WhatsAppButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Entre na nossa comunidade no WhatsApp (abre em uma nova aba)"
      className={`group inline-flex h-11 w-11 shrink-0 items-center justify-end overflow-hidden rounded-full bg-[#171717] text-white [box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.16)] transition-[width,background-color,box-shadow] duration-300 ease-[var(--ease-out)] hover:bg-[#0F8247] hover:[box-shadow:none] focus-visible:bg-[#0F8247] focus-visible:[box-shadow:none] sm:hover:w-[244px] sm:focus-visible:w-[244px] motion-reduce:transition-none ${className}`}
    >
      <span
        aria-hidden="true"
        className="hidden pr-1 pl-4 text-sm font-semibold whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block motion-reduce:transition-none"
      >
        Entre na nossa comunidade
      </span>
      <span className="flex size-11 shrink-0 items-center justify-center">
        <BrandIcon name="whatsapp" className="size-[22px] text-white" />
      </span>
    </a>
  );
}

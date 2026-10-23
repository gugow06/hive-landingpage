/**
 * Dados do controlador e datas dos documentos legais (privacidade, termos, cookies, LGPD).
 *
 * PREENCHER ANTES DE PUBLICAR. Os campos com `PENDENTE` aparecem nas páginas como
 * "a definir" (em destaque) e `npm test` os lista como pendência. Nada aqui foi
 * inventado: se a informação não existe, ela fica pendente.
 *
 * Este texto é um ponto de partida técnico, não um parecer jurídico. Peça a revisão de uma
 * pessoa advogada antes de colocar as páginas no ar.
 */

/** Marca de campo ainda não preenchido. */
export const PENDENTE = "[a definir]";

export const LEGAL = {
  /** Data da última atualização de todos os documentos, por extenso. */
  atualizadoEm: "22 de outubro de 2026",
  /** Mesma data em ISO, para `<time>` e JSON-LD. */
  atualizadoIso: "2026-10-22",
  /** Quem decide sobre o tratamento dos dados do site (controlador). */
  controlador: {
    nome: PENDENTE, // razão social ou nome completo
    documento: PENDENTE, // CNPJ ou CPF
    endereco: PENDENTE, // endereço completo
  },
  /** Encarregado pelo tratamento de dados (art. 41 da LGPD). */
  encarregado: {
    nome: PENDENTE,
    email: "contato@hive.dev.br",
  },
  /** E-mail de contato geral, o mesmo que já aparece no site. */
  email: "contato@hive.dev.br",
  /** Comarca para disputas que não envolvam consumidor. */
  foro: PENDENTE,
  /** Provedor de hospedagem do site (operador que guarda os registros de acesso). */
  hospedagem: PENDENTE,
} as const;

/** Campos ainda pendentes, para o teste e para quem for preencher. */
export function camposPendentes(): string[] {
  const out: string[] = [];
  const visit = (value: unknown, path: string) => {
    if (value === PENDENTE) out.push(path);
    else if (value && typeof value === "object") {
      for (const [key, inner] of Object.entries(value)) visit(inner, path ? `${path}.${key}` : key);
    }
  };
  visit(LEGAL, "");
  return out;
}

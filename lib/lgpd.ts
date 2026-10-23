/**
 * Tipos de solicitação dos formulários da LGPD. Ficam num módulo à parte porque o
 * formulário (cliente) e a rota (servidor) precisam concordar nos valores aceitos.
 */

export type LgpdKind = "titular" | "encarregado";

/** Direitos do titular, art. 18 da LGPD (e a revisão de decisões automatizadas, art. 20). */
export const PEDIDOS_TITULAR = [
  { value: "confirmacao", label: "Confirmar se vocês tratam dados meus" },
  { value: "acesso", label: "Acessar os meus dados" },
  { value: "correcao", label: "Corrigir dados incompletos, inexatos ou desatualizados" },
  { value: "eliminacao", label: "Anonimizar, bloquear ou eliminar dados" },
  { value: "portabilidade", label: "Portabilidade dos dados a outro fornecedor" },
  { value: "compartilhamento", label: "Saber com quem os dados foram compartilhados" },
  { value: "revogacao", label: "Revogar um consentimento que dei" },
  { value: "oposicao", label: "Opor-me a um tratamento de dados" },
  { value: "revisao", label: "Pedir a revisão de uma decisão automatizada" },
] as const;

export const ASSUNTOS_ENCARREGADO = [
  { value: "duvida", label: "Dúvida sobre privacidade e proteção de dados" },
  { value: "incidente", label: "Comunicar um incidente ou falha de segurança" },
  { value: "sugestao", label: "Sugestão ou reclamação" },
  { value: "outro", label: "Outro assunto" },
] as const;

export const VALORES_VALIDOS: Record<LgpdKind, readonly string[]> = {
  titular: PEDIDOS_TITULAR.map((item) => item.value),
  encarregado: ASSUNTOS_ENCARREGADO.map((item) => item.value),
};

export interface LgpdPayload {
  kind: LgpdKind;
  nome: string;
  email: string;
  /** Tipo do pedido (titular) ou assunto (encarregado). */
  assunto: string;
  mensagem: string;
  /** Marcado: a pessoa declarou que os dados são verdadeiros e autorizou o uso para atender. */
  declaracao: boolean;
  /** Campo-isca: pessoas não o veem, robôs preenchem. Tem que chegar vazio. */
  site?: string;
}

export const LIMITES = { nomeMax: 120, mensagemMin: 10, mensagemMax: 4000 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Valida o pedido. Devolve a mensagem do primeiro erro, ou `null` se estiver tudo certo. */
export function validarLgpd(input: Partial<LgpdPayload>): string | null {
  if (input.kind !== "titular" && input.kind !== "encarregado") return "Tipo de formulário inválido.";
  const nome = (input.nome ?? "").trim();
  if (nome.length < 2 || nome.length > LIMITES.nomeMax) return "Informe o seu nome completo.";
  const email = (input.email ?? "").trim();
  if (!EMAIL.test(email) || email.length > 254) return "Confira o e-mail digitado.";
  if (!VALORES_VALIDOS[input.kind].includes(input.assunto ?? "")) return "Escolha uma das opções da lista.";
  const mensagem = (input.mensagem ?? "").trim();
  if (mensagem.length < LIMITES.mensagemMin) return "Conte um pouco mais, para conseguirmos responder bem.";
  if (mensagem.length > LIMITES.mensagemMax) return `A mensagem passou de ${LIMITES.mensagemMax} caracteres.`;
  if (input.declaracao !== true) return "Marque a declaração para enviarmos o pedido.";
  return null;
}

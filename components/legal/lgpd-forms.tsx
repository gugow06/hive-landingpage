"use client";

import { useId, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import {
  ASSUNTOS_ENCARREGADO,
  LIMITES,
  PEDIDOS_TITULAR,
  validarLgpd,
  type LgpdKind,
  type LgpdPayload,
} from "@/lib/lgpd";

type Status = "idle" | "sending" | "done" | "error";

const campo =
  "w-full rounded-xl bg-bg-weak px-4 text-base text-ink placeholder:text-ink-faint [box-shadow:inset_0_0_0_1px_var(--field-border)]";

/**
 * Formulário da LGPD. Mesmo componente para os dois usos: o pedido do titular (art. 18) e o
 * contato com o encarregado. Só mudam as opções do campo "assunto" e os textos.
 *
 * Acessibilidade: todo campo tem rótulo visível (não só placeholder), o erro é ligado ao
 * campo por `aria-describedby` e o resultado é anunciado por `aria-live` sem roubar o foco.
 */
export function LgpdForm({ kind }: { kind: LgpdKind }) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [mensagemErro, setMensagemErro] = useState("");
  const [protocolo, setProtocolo] = useState("");

  const titular = kind === "titular";
  const opcoes = titular ? PEDIDOS_TITULAR : ASSUNTOS_ENCARREGADO;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload: LgpdPayload = {
      kind,
      nome: String(data.get("nome") ?? ""),
      email: String(data.get("email") ?? ""),
      assunto: String(data.get("assunto") ?? ""),
      mensagem: String(data.get("mensagem") ?? ""),
      declaracao: data.get("declaracao") === "on",
      site: String(data.get("site") ?? ""),
    };

    const erro = validarLgpd(payload);
    if (erro) {
      setStatus("error");
      setMensagemErro(erro);
      return;
    }

    setStatus("sending");
    setMensagemErro("");
    try {
      const resposta = await fetch("/api/lgpd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const corpo = (await resposta.json()) as { error?: string; protocolo?: string };
      if (!resposta.ok) {
        setStatus("error");
        setMensagemErro(corpo.error ?? "Não conseguimos enviar agora. Tente de novo em instantes.");
        return;
      }
      setProtocolo(corpo.protocolo ?? "");
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
      setMensagemErro("Não conseguimos enviar agora. Tente de novo em instantes.");
    }
  }

  return (
    <div aria-live="polite">
      {status === "done" ? (
        <div className="max-w-[62ch] rounded-xl bg-amber/12 px-5 py-4 text-ink">
          <p className="flex items-start gap-2 font-medium">
            <Check className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
            Recebemos o seu {titular ? "pedido" : "contato"}.
          </p>
          <p className="mt-2 text-[15px] leading-6 text-ink-soft">
            Guarde o número do protocolo: <strong className="font-mono font-semibold text-ink">{protocolo}</strong>.{" "}
            {titular
              ? "Respondemos em até 15 dias, o prazo da lei, no e-mail que você informou."
              : "Respondemos pelo e-mail que você informou."}
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="max-w-[62ch] space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-nome`} className="mb-1.5 block text-sm font-medium text-ink">
                Nome completo
              </label>
              <input
                id={`${id}-nome`}
                name="nome"
                autoComplete="name"
                maxLength={LIMITES.nomeMax}
                required
                className={`${campo} h-12`}
              />
            </div>
            <div>
              <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-medium text-ink">
                E-mail para resposta
              </label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`${campo} h-12`}
              />
            </div>
          </div>

          <div>
            <label htmlFor={`${id}-assunto`} className="mb-1.5 block text-sm font-medium text-ink">
              {titular ? "O que você quer pedir?" : "Sobre o que é?"}
            </label>
            <select id={`${id}-assunto`} name="assunto" defaultValue="" required className={`${campo} h-12`}>
              <option value="" disabled>
                Escolha uma opção
              </option>
              {opcoes.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${id}-mensagem`} className="mb-1.5 block text-sm font-medium text-ink">
              {titular ? "Detalhes do pedido" : "Mensagem"}
            </label>
            <textarea
              id={`${id}-mensagem`}
              name="mensagem"
              rows={5}
              maxLength={LIMITES.mensagemMax}
              required
              aria-describedby={`${id}-ajuda`}
              className={`${campo} resize-y py-3 leading-6`}
            />
            <p id={`${id}-ajuda`} className="mt-1.5 text-sm text-ink-faint">
              Não envie senhas, chaves de acesso nem documentos aqui. Se precisarmos confirmar a sua identidade, pedimos
              por e-mail.
            </p>
          </div>

          {/* Campo-isca: pessoas não o veem nem o alcançam pelo teclado; robôs costumam preenchê-lo. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor={`${id}-site`}>Não preencha este campo</label>
            <input id={`${id}-site`} name="site" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="flex items-start gap-3">
            <input
              id={`${id}-declaracao`}
              name="declaracao"
              type="checkbox"
              required
              className="mt-1 size-5 shrink-0 accent-[var(--color-amber)]"
            />
            <label htmlFor={`${id}-declaracao`} className="text-[15px] leading-6 text-ink-soft">
              Declaro que as informações acima são verdadeiras e autorizo o uso destes dados apenas para atender{" "}
              {titular ? "o meu pedido" : "a minha mensagem"}, como descreve a{" "}
              <a href="/privacidade" className="text-accent underline underline-offset-[3px]">
                política de privacidade
              </a>
              .
            </label>
          </div>

          {status === "error" && (
            <p role="alert" className="text-[15px] font-medium text-ink">
              {mensagemErro}
            </p>
          )}

          <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-70">
            {status === "sending" ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                Enviando
              </>
            ) : titular ? (
              "Enviar pedido"
            ) : (
              "Enviar mensagem"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

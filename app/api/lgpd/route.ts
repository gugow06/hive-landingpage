import { NextResponse } from "next/server";
import { validarLgpd, type LgpdPayload } from "@/lib/lgpd";

/**
 * Recebe os formulários da LGPD (pedido do titular e contato com o encarregado).
 *
 * Um pedido legal não pode sumir em silêncio. Por isso:
 * - com `LGPD_WEBHOOK_URL` definida, o pedido é encaminhado para lá (e-mail, planilha, n8n,
 *   o que a equipe usar) e o protocolo só é devolvido se o encaminhamento der certo;
 * - em produção, sem a variável, a rota responde 503 em vez de fingir que recebeu;
 * - fora de produção, aceita e registra só o protocolo e o tipo, nunca os dados pessoais.
 */

// Limite simples por IP contra abuso. A memória é por instância: freia o grosso do spam, mas
// não é um controle forte. Para isso, coloque um WAF ou o limite do provedor na frente.
const JANELA_MS = 10 * 60 * 1000;
const MAX_POR_JANELA = 5;
const acessos = new Map<string, number[]>();

function excedeLimite(ip: string): boolean {
  const agora = Date.now();
  const recentes = (acessos.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);
  recentes.push(agora);
  acessos.set(ip, recentes);
  if (acessos.size > 5000) for (const [chave, lista] of acessos) if (!lista.some((t) => agora - t < JANELA_MS)) acessos.delete(chave);
  return recentes.length > MAX_POR_JANELA;
}

function novoProtocolo(): string {
  const data = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const sufixo = crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
  return `HV-${data}-${sufixo}`;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconhecido";
  if (excedeLimite(ip)) {
    return NextResponse.json({ error: "Muitos envios em pouco tempo. Tente de novo em alguns minutos." }, { status: 429 });
  }

  let payload: Partial<LgpdPayload>;
  try {
    payload = (await request.json()) as Partial<LgpdPayload>;
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  // O campo-isca preenchido é robô: responde como se tivesse dado certo e descarta.
  if (payload.site) return NextResponse.json({ ok: true, protocolo: novoProtocolo() });

  const erro = validarLgpd(payload);
  if (erro) return NextResponse.json({ error: erro }, { status: 400 });

  const protocolo = novoProtocolo();
  const webhook = process.env.LGPD_WEBHOOK_URL;

  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      console.error("[lgpd] LGPD_WEBHOOK_URL não está definida: o pedido NÃO foi recebido.");
      return NextResponse.json(
        { error: "O envio está indisponível agora. Escreva para contato@hive.dev.br, por favor." },
        { status: 503 },
      );
    }
    console.info("[lgpd] (desenvolvimento) pedido aceito", { protocolo, kind: payload.kind, assunto: payload.assunto });
    return NextResponse.json({ ok: true, protocolo });
  }

  try {
    const resposta = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        protocolo,
        origem: "site",
        recebidoEm: new Date().toISOString(),
        kind: payload.kind,
        nome: payload.nome?.trim(),
        email: payload.email?.trim(),
        assunto: payload.assunto,
        mensagem: payload.mensagem?.trim(),
      }),
    });
    if (!resposta.ok) {
      console.error("[lgpd] o webhook respondeu", resposta.status, { protocolo });
      return NextResponse.json({ error: "Não conseguimos registrar agora. Tente de novo em instantes." }, { status: 502 });
    }
  } catch (error) {
    console.error("[lgpd] o webhook falhou", { protocolo, erro: error instanceof Error ? error.message : "desconhecido" });
    return NextResponse.json({ error: "Não conseguimos registrar agora. Tente de novo em instantes." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, protocolo });
}

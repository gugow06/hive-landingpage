import { NextResponse } from "next/server";

/**
 * Recebe as inscrições da lista de espera.
 *
 * Sem backend próprio ainda: se `WAITLIST_WEBHOOK_URL` estiver definida, a
 * inscrição é encaminhada para lá (Formspree, Resend, n8n, uma rota do próprio
 * Hive — tanto faz). Sem a variável, a inscrição só é registrada no log do
 * servidor, para o site funcionar em desenvolvimento sem depender de ninguém.
 */
export async function POST(request: Request) {
  let payload: { email?: unknown; perfil?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const perfil = typeof payload.perfil === "string" ? payload.perfil.trim().slice(0, 40) : "";

  // Validação deliberadamente frouxa: o e-mail é confirmado pelo envio, não pela regex.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Confira o e-mail digitado." }, { status: 400 });
  }

  const webhook = process.env.WAITLIST_WEBHOOK_URL;

  if (!webhook) {
    console.info("[lista de espera]", { email, perfil, at: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, perfil, origem: "site", at: new Date().toISOString() }),
    });

    if (!response.ok) {
      console.error("[lista de espera] webhook respondeu", response.status);
      return NextResponse.json({ error: "Não consegui registrar agora." }, { status: 502 });
    }
  } catch (error) {
    console.error("[lista de espera] webhook falhou", error);
    return NextResponse.json({ error: "Não consegui registrar agora." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Rise } from "./primitives";

type Status = "idle" | "sending" | "done" | "error";

export function Waitlist() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/lista", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), perfil: data.get("perfil") }),
      });
      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(body.error ?? "Não consegui registrar agora. Tente de novo em instantes.");
        return;
      }

      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Não consegui registrar agora. Tente de novo em instantes.");
    }
  }

  return (
    <section id="lista" className="py-28">
      <div className="shell">
        <Rise className="card relative overflow-hidden px-6 py-20 text-center md:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-72 [background:radial-gradient(600px_at_50%_120%,var(--halo),transparent_70%)]"
          />

          <div className="relative mx-auto max-w-xl">
            <h2 className="display text-[clamp(2rem,4.5vw,2.75rem)] text-ink">
              Sua colmeia está <span className="text-accent-display">quase pronta.</span>
            </h2>
            <p className="lead mt-5">
              Estamos abrindo em levas, junto com os primeiros founders. Deixa o e-mail que a
              gente chama você.
            </p>

            {/* O resultado é anunciado por leitor de tela sem roubar o foco. */}
            <div aria-live="polite" className="contents">
              {status === "done" ? (
                <p className="mt-10 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-amber/12 px-6 py-4 font-medium text-accent">
                  <Check className="size-5 shrink-0" aria-hidden="true" />
                  Pronto, você está na fila. A gente avisa assim que sua vaga abrir.
                </p>
              ) : (
                <form onSubmit={onSubmit} className="mt-10 space-y-3 text-left" noValidate>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <label className="sr-only" htmlFor="email">
                      Seu e-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="voce@suaempresa.com"
                      aria-describedby={status === "error" ? "lista-erro" : undefined}
                      aria-invalid={status === "error" || undefined}
                      // `flex-1` só a partir de sm: numa coluna flex ele zera o
                      // flex-basis e engole o h-14, achatando o campo.
                      className="h-14 w-full rounded-[var(--radius-pill)] bg-bg-weak px-6 text-base text-ink placeholder:text-ink-faint sm:flex-1 [box-shadow:inset_0_0_0_1px_var(--field-border)]"
                    />
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="btn btn-primary btn-lg disabled:opacity-70"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                          Enviando
                        </>
                      ) : (
                        <>
                          Entrar na lista
                          <ArrowRight className="size-5" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>

                  <label className="sr-only" htmlFor="perfil">
                    Qual o seu perfil?
                  </label>
                  <select
                    id="perfil"
                    name="perfil"
                    defaultValue=""
                    className="h-12 w-full rounded-[var(--radius-pill)] bg-bg-weak px-6 text-sm text-ink-soft [box-shadow:inset_0_0_0_1px_var(--field-border)]"
                  >
                    <option value="">Qual o seu perfil? (opcional)</option>
                    <option value="solopreneur">Solopreneur</option>
                    <option value="founder">Founder / startup</option>
                    <option value="indie-hacker">Indie hacker</option>
                    <option value="pme">PME tech</option>
                    <option value="outro">Outro</option>
                  </select>

                  {status === "error" && (
                    <p id="lista-erro" className="pt-1 text-sm text-ink">
                      {message}
                    </p>
                  )}

                  <p className="pt-2 text-center text-sm text-ink-faint">
                    Só usamos para avisar do acesso. Nada de newsletter que você não pediu.
                  </p>
                </form>
              )}
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}

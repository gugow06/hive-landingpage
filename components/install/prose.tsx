/** Pequenos elementos de texto compartilhados pelas páginas de guia. */

/** Código dentro de uma frase. */
export function C({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-bg-weak px-1.5 py-0.5 font-mono text-[0.88em] whitespace-nowrap text-ink [box-shadow:var(--ring-soft)]">
      {children}
    </code>
  );
}

/** Link de texto. Endereços `http` abrem em outra aba, e o leitor de tela é avisado. */
export function A({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-accent underline decoration-current/40 underline-offset-[3px] hover:decoration-current"
    >
      {children}
      {external && <span className="sr-only"> (abre em uma nova aba)</span>}
    </a>
  );
}

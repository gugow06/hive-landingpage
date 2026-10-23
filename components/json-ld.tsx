/**
 * Dados estruturados (JSON-LD) em um `<script>`. O `<` vira `<` para um texto como
 * "</script>" dentro de um campo nunca fechar a tag antes da hora.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

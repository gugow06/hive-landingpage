import { FaqItem } from "./faq-item";
import { FAQ } from "@/lib/faq";
import { Rise, SectionHead } from "./primitives";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-titulo" className="section">
      <div className="shell grid items-start gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28">
          <SectionHead
            id="faq-titulo"
            title="Perguntas frequentes"
            lead={
              <>
                Não achou a sua? Escreva para{" "}
                <a className="text-accent underline underline-offset-4" href="mailto:contato@hiveagents.com.br">
                  contato@hiveagents.com.br
                </a>
                .
              </>
            }
          />
        </div>

        <Rise stagger="details" className="space-y-3">
          {FAQ.map((item) => (
            <FaqItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </Rise>
      </div>
    </section>
  );
}

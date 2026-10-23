import type { Metadata } from "next";
import { A } from "@/components/install/prose";
import { Campo, LegalPage, LegalSection, P, UL } from "@/components/legal/legal-page";
import { LgpdForm } from "@/components/legal/lgpd-forms";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Seus dados (LGPD)",
  description:
    "Peça acesso, correção ou eliminação dos seus dados, revogue um consentimento ou fale com o encarregado de dados do Hive. Respondemos em até 15 dias.",
  alternates: { canonical: "/lgpd" },
};

const toc = [
  { id: "seus-direitos", label: "Seus direitos" },
  { id: "pedido", label: "Fazer um pedido" },
  { id: "encarregado", label: "Falar com o encarregado" },
  { id: "prazos", label: "Prazos e reclamação" },
];

export default function LgpdPage() {
  return (
    <LegalPage
      titulo="Seus dados (LGPD)"
      resumo="Você manda nos seus dados pessoais. Use os formulários abaixo para pedir o que a lei garante ou para falar com quem cuida da privacidade no Hive."
      toc={toc}
    >
      <LegalSection id="seus-direitos" titulo="Seus direitos">
        <P>
          A Lei Geral de Proteção de Dados (Lei 13.709/2018) garante a você, por exemplo, saber se tratamos dados seus,
          acessá-los, corrigi-los, pedir que sejam eliminados e revogar consentimentos. A{" "}
          <A href="/privacidade#direitos">política de privacidade</A> traz a lista completa e explica quais dados o site
          trata.
        </P>
        <P>
          Os pedidos abaixo valem para o <strong className="font-semibold text-ink">site</strong>. O aplicativo Hive roda na
          sua máquina, e os dados dele ficam com você. Se você quer falar da telemetria de uso do aplicativo, veja como
          desligá-la no <A href="/install#problemas">guia de instalação</A>.
        </P>
      </LegalSection>

      <LegalSection id="pedido" titulo="Fazer um pedido sobre os seus dados">
        <LgpdForm kind="titular" />
      </LegalSection>

      <LegalSection id="encarregado" titulo="Falar com o encarregado">
        <P>
          Dúvida de privacidade, sugestão ou aviso de falha de segurança? O encarregado pelo tratamento de dados é{" "}
          <Campo valor={LEGAL.encarregado.nome} />. Você também pode escrever direto para{" "}
          <A href={`mailto:${LEGAL.encarregado.email}`}>{LEGAL.encarregado.email}</A>.
        </P>
        <LgpdForm kind="encarregado" />
      </LegalSection>

      <LegalSection id="prazos" titulo="Prazos e reclamação">
        <UL>
          <li>
            <strong className="font-semibold text-ink">Confirmação e acesso:</strong> em formato simplificado, de
            imediato, ou em declaração completa em até 15 dias (art. 19).
          </li>
          <li>
            <strong className="font-semibold text-ink">Outros pedidos:</strong> respondemos o quanto antes e dentro dos
            prazos que a lei e a ANPD estabelecerem.
          </li>
          <li>
            <strong className="font-semibold text-ink">Para confirmar quem você é,</strong> podemos pedir um dado a mais
            por e-mail. Isso evita que outra pessoa peça os seus dados em seu nome.
          </li>
          <li>
            <strong className="font-semibold text-ink">Reclamação:</strong> se a resposta não resolver, você pode recorrer à{" "}
            <A href="https://www.gov.br/anpd">Autoridade Nacional de Proteção de Dados (ANPD)</A>.
          </li>
        </UL>
      </LegalSection>
    </LegalPage>
  );
}

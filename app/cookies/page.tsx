import type { Metadata } from "next";
import { A, C } from "@/components/install/prose";
import { LegalPage, LegalSection, P, Tabela, UL } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "O que o site do Hive guarda no seu navegador (e o que não guarda), para quê, por quanto tempo e como apagar.",
  alternates: { canonical: "/cookies" },
};

const toc = [
  { id: "resumo", label: "Em resumo" },
  { id: "o-que-guardamos", label: "O que guardamos" },
  { id: "terceiros", label: "Sites de terceiros" },
  { id: "como-gerenciar", label: "Como gerenciar" },
  { id: "mudancas", label: "Se isso mudar" },
];

export default function CookiesPage() {
  return (
    <LegalPage
      titulo="Política de cookies"
      resumo="O site do Hive guarda muito pouco no seu navegador, só o necessário para lembrar das suas escolhas. Aqui está tudo, item por item."
      toc={toc}
    >
      <LegalSection id="resumo" titulo="Em resumo">
        <UL>
          <li>O site não define cookies de publicidade, de rastreamento nem de análise de audiência.</li>
          <li>
            O que existe é armazenamento <strong className="font-semibold text-ink">essencial</strong>, no próprio navegador,
            para lembrar de escolhas suas. Ele não identifica você.
          </li>
          <li>Você apaga tudo a qualquer momento, nas configurações do navegador.</li>
        </UL>
      </LegalSection>

      <LegalSection id="o-que-guardamos" titulo="O que guardamos">
        <Tabela
          colunas={["Item", "Onde", "Para quê", "Quanto tempo"]}
          linhas={[
            [<C key="a">hive-cookie-notice</C>, "localStorage", "Lembrar que você já viu o aviso de cookies, para não mostrá-lo de novo", "12 meses"],
            [<C key="b">hive-install-os</C>, "sessionStorage", "Lembrar o sistema escolhido (Windows, macOS ou Linux) no guia de instalação", "Até fechar a aba"],
            [<C key="c">theme</C>, "localStorage", "Lembrar o tema (claro ou escuro), se você já tinha uma preferência salva de visitas anteriores", "Até você apagar"],
          ]}
        />
        <P>
          O site também não define cookies HTTP. As fontes e as imagens são servidas pelo próprio site, sem pedir nada a
          terceiros enquanto você navega.
        </P>
      </LegalSection>

      <LegalSection id="terceiros" titulo="Sites de terceiros">
        <P>
          Ao clicar em links para o WhatsApp, o GitHub ou outros sites, você sai do nosso e passa a seguir as regras e os
          cookies deles. Cada um tem a sua própria política, e não temos controle sobre eles.
        </P>
      </LegalSection>

      <LegalSection id="como-gerenciar" titulo="Como gerenciar">
        <P>
          Para ver ou apagar o que o site guarda, abra as configurações do seu navegador e procure por “dados do site” ou
          “armazenamento”. Se você apagar, o aviso de cookies volta a aparecer, e as suas escolhas (tema, sistema) voltam ao
          padrão.
        </P>
      </LegalSection>

      <LegalSection id="mudancas" titulo="Se isso mudar">
        <P>
          Se um dia o site passar a usar cookies que não sejam essenciais, como os de análise de audiência, atualizaremos
          esta política e pediremos o seu consentimento antes, quando a lei exigir. Para falar sobre os seus dados, veja{" "}
          <A href="/lgpd">Seus dados (LGPD)</A> ou escreva para <A href={`mailto:${LEGAL.email}`}>{LEGAL.email}</A>.
        </P>
      </LegalSection>
    </LegalPage>
  );
}

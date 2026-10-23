import type { Metadata } from "next";
import { A } from "@/components/install/prose";
import { Campo, LegalPage, LegalSection, P, UL } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Termos de serviço",
  description:
    "As regras de uso do site e do software Hive: licença MIT, beta aberto, responsabilidades de quem usa os agentes e como funciona a comunidade.",
  alternates: { canonical: "/termos" },
};

const toc = [
  { id: "aceitacao", label: "Aceitação" },
  { id: "o-que-e", label: "O que é o Hive" },
  { id: "licenca", label: "Licença e marcas" },
  { id: "por-sua-conta", label: "Uso por sua conta" },
  { id: "terceiros", label: "Serviços de terceiros" },
  { id: "conduta", label: "Conduta e comunidade" },
  { id: "relatos", label: "Relatos e depoimentos" },
  { id: "garantias", label: "Garantias e limites" },
  { id: "beta", label: "Versão beta" },
  { id: "alteracoes", label: "Alterações" },
  { id: "lei", label: "Lei e foro" },
  { id: "contato", label: "Contato" },
];

export default function TermosPage() {
  return (
    <LegalPage
      titulo="Termos de serviço"
      resumo="As regras de uso do site e do software Hive, em linguagem clara. Em resumo: o código é aberto, está em beta e as decisões dos agentes são suas."
      toc={toc}
    >
      <LegalSection id="aceitacao" titulo="Aceitação">
        <P>
          Ao usar o site ou o software Hive, você concorda com estes termos. Se não concordar, não use. Eles se somam à{" "}
          <A href="/privacidade">política de privacidade</A> e à <A href="/cookies">política de cookies</A>.
        </P>
      </LegalSection>

      <LegalSection id="o-que-e" titulo="O que é o Hive">
        <P>
          O Hive é um software de código aberto que organiza uma equipe de agentes de IA, com hierarquia, memória e
          auditoria. É um fork do Paperclip, com o Grafo de Conhecimento e a identidade da colmeia por cima. O site apresenta o
          projeto e orienta a instalação. O software roda na sua máquina ou no seu servidor, não em um serviço nosso.
        </P>
      </LegalSection>

      <LegalSection id="licenca" titulo="Licença e marcas">
        <UL>
          <li>
            O código é distribuído sob a <strong className="font-semibold text-ink">licença MIT</strong>: você pode usar,
            copiar, modificar e distribuir, mantendo o aviso de direitos autorais e a licença. O texto completo está no{" "}
            <A href="https://github.com/gugow06/hive">repositório</A>.
          </li>
          <li>
            Parte do código vem do Paperclip, também sob licença MIT, e os créditos permanecem nos arquivos de origem.
          </li>
          <li>
            Os nomes e logos de terceiros que aparecem no site (por exemplo, Claude, Codex, Gemini, WhatsApp, GitHub, Oracle e
            FIAP) pertencem aos seus donos e aparecem só para identificá-los. Isso não indica endosso, a não ser quando dito
            expressamente.
          </li>
          <li>
            O nome e a identidade visual do Hive (incluindo os Hibees) não estão cobertos pela licença do código. Peça
            autorização para usá-los em produtos que não sejam o próprio Hive.
          </li>
        </UL>
      </LegalSection>

      <LegalSection id="por-sua-conta" titulo="Uso por sua conta">
        <P>Agentes de IA agem com autonomia. Por isso, quem usa o Hive é responsável por:</P>
        <UL>
          <li>supervisionar o que os agentes fazem e revisar o resultado antes de usá-lo;</li>
          <li>configurar orçamentos e permissões adequados ao seu caso, e pausar agentes quando preciso;</li>
          <li>guardar as próprias chaves de acesso e as credenciais das integrações;</li>
          <li>os custos dos modelos de IA e de qualquer serviço que os agentes usem;</li>
          <li>
            o conteúdo que coloca no Hive e o cumprimento da lei ao tratar dados de outras pessoas com os agentes,
            incluindo a LGPD.
          </li>
        </UL>
      </LegalSection>

      <LegalSection id="terceiros" titulo="Serviços de terceiros">
        <P>
          Os agentes usam serviços como o Claude Code (Anthropic), o Codex (OpenAI) e o Gemini CLI (Google), e as integrações
          conectam o Hive a ferramentas como GitHub, Slack e Notion. Cada um tem os próprios termos, preços e limites, e é
          você quem os aceita. Não controlamos esses serviços e não respondemos por eles.
        </P>
      </LegalSection>

      <LegalSection id="conduta" titulo="Conduta e comunidade">
        <P>Ao usar o site, o repositório e a comunidade do WhatsApp, você se compromete a:</P>
        <UL>
          <li>não usar o Hive para atividades ilegais nem para prejudicar outras pessoas;</li>
          <li>tratar os outros membros com respeito e não enviar spam, golpes ou propaganda não solicitada;</li>
          <li>não compartilhar dados pessoais de terceiros, segredos ou chaves de acesso nos canais públicos;</li>
          <li>não tentar atacar, sobrecarregar ou burlar a segurança do site.</li>
        </UL>
        <P>
          A comunidade do WhatsApp funciona dentro da plataforma da Meta e está sujeita aos termos dela. Podemos remover
          quem violar estas regras.
        </P>
      </LegalSection>

      <LegalSection id="relatos" titulo="Relatos e depoimentos">
        <P>
          Se você nos enviar um relato sobre o uso do Hive, só o publicaremos no site com a sua autorização expressa, que
          você pode retirar depois. Nunca publicaremos depoimentos inventados.
        </P>
      </LegalSection>

      <LegalSection id="garantias" titulo="Garantias e limites">
        <P>
          O software é fornecido “como está”, sem garantia de funcionamento ininterrupto, de adequação a um fim específico
          ou de ausência de erros, como diz a licença MIT. Agentes de IA podem errar, e o Hive não elimina esse risco.
        </P>
        <P>
          Na medida em que a lei permitir, não respondemos por perdas decorrentes do uso do software ou do que os agentes
          fizerem. Isso não afasta direitos que a lei garanta a você, inclusive os do Código de Defesa do Consumidor, quando
          ele se aplicar.
        </P>
      </LegalSection>

      <LegalSection id="beta" titulo="Versão beta">
        <P>
          O Hive está em beta aberto: recursos mudam, podem quebrar e podem ser removidos. Não há prazo de atendimento
          garantido. Fazemos o possível para corrigir problemas, e você ajuda muito ao nos avisar.
        </P>
      </LegalSection>

      <LegalSection id="alteracoes" titulo="Alterações">
        <P>
          Podemos atualizar estes termos. A data no topo da página mostra a última revisão. Continuar usando o Hive depois
          da mudança significa que você concorda com a nova versão.
        </P>
      </LegalSection>

      <LegalSection id="lei" titulo="Lei e foro">
        <P>
          Valem as leis do Brasil. Para consumidores, o foro é o do seu domicílio. Para os demais casos, fica eleito o foro de{" "}
          <Campo valor={LEGAL.foro} />.
        </P>
      </LegalSection>

      <LegalSection id="contato" titulo="Contato">
        <P>
          Dúvidas sobre estes termos: <A href={`mailto:${LEGAL.email}`}>{LEGAL.email}</A>.
        </P>
      </LegalSection>
    </LegalPage>
  );
}

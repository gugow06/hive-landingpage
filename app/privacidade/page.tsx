import type { Metadata } from "next";
import { A, C } from "@/components/install/prose";
import { Campo, H3, LegalPage, LegalSection, P, Tabela, UL } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Quais dados o site do Hive trata, para quê e por quanto tempo, como exercer os seus direitos pela LGPD e o que o aplicativo envia (e como desligar).",
  alternates: { canonical: "/privacidade" },
};

const toc = [
  { id: "quem-somos", label: "Quem somos" },
  { id: "dados-do-site", label: "Dados do site" },
  { id: "aplicativo", label: "O aplicativo Hive" },
  { id: "compartilhamento", label: "Com quem compartilhamos" },
  { id: "transferencia", label: "Transferência internacional" },
  { id: "retencao", label: "Por quanto tempo guardamos" },
  { id: "direitos", label: "Seus direitos" },
  { id: "seguranca", label: "Segurança" },
  { id: "criancas", label: "Crianças e adolescentes" },
  { id: "alteracoes", label: "Alterações" },
  { id: "contato", label: "Contato" },
];

export default function PrivacidadePage() {
  return (
    <LegalPage
      titulo="Política de privacidade"
      resumo="Explicamos, sem juridiquês, quais dados o site do Hive trata, para quê, e como você tem controle sobre eles. Seguimos a Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018)."
      toc={toc}
    >
      <LegalSection id="quem-somos" titulo="Quem somos">
        <P>
          O Hive é um software de código aberto para organizar equipes de agentes de IA, em beta aberto. Esta política vale
          para o <strong className="font-semibold text-ink">site</strong> do Hive. O aplicativo instalado na sua máquina tem
          uma seção própria, mais abaixo.
        </P>
        <P>
          O controlador, ou seja, quem decide sobre o tratamento dos dados do site, é{" "}
          <Campo valor={LEGAL.controlador.nome} />, inscrito sob o documento <Campo valor={LEGAL.controlador.documento} />,
          com endereço em <Campo valor={LEGAL.controlador.endereco} />.
        </P>
      </LegalSection>

      <LegalSection id="dados-do-site" titulo="Dados que tratamos no site">
        <P>
          Tratamos pouca coisa, e só o necessário. Não usamos ferramentas de análise de audiência nem cookies de
          publicidade neste momento. Se isso mudar, atualizamos esta política e pedimos o seu consentimento quando a lei
          exigir.
        </P>
        <Tabela
          colunas={["Dado", "Quando", "Para quê", "Base legal"]}
          linhas={[
            [
              "Nome, e-mail e o conteúdo da solicitação",
              "Quando você envia um formulário em /lgpd",
              "Atender o seu pedido e comprovar que o atendemos",
              "Cumprimento de obrigação legal (art. 7º, II) e exercício regular de direitos (art. 7º, VI)",
            ],
            [
              "Endereço IP, navegador, data e hora do acesso",
              "Quando você navega",
              "Manter o site no ar, evitar abusos e proteger a segurança",
              "Legítimo interesse (art. 7º, IX). Os registros ficam com o provedor de hospedagem",
            ],
            [
              "Escolhas guardadas no seu navegador (que viu o aviso de cookies, o sistema escolhido no guia)",
              "Quando você usa o site",
              "Lembrar as suas escolhas",
              "Fica só no seu navegador. Veja a política de cookies",
            ],
          ]}
        />
        <P>
          Os formulários da página <A href="/lgpd">Seus dados (LGPD)</A> só pedem o que é preciso para responder. Não peça
          nem envie, neles, documentos ou dados sensíveis, a menos que a gente solicite expressamente para confirmar a sua
          identidade.
        </P>
      </LegalSection>

      <LegalSection id="aplicativo" titulo="O aplicativo Hive">
        <P>
          O Hive roda no seu computador ou no seu servidor. As tarefas, os documentos da memória e as chaves de acesso ficam
          lá, com você. Não temos acesso a eles.
        </P>
        <H3>Telemetria de uso</H3>
        <P>
          Nesta versão beta, o aplicativo vem com a telemetria de uso <strong className="font-semibold text-ink">ligada por
          padrão</strong>. Ela envia eventos técnicos (por exemplo, quais recursos foram usados) a serviços do projeto
          original, o Paperclip, de quem herdamos o código. Pelas regras desse projeto, os eventos não devem incluir o
          conteúdo das tarefas, dos documentos, prompts, respostas dos modelos nem as suas chaves. O tratamento desses dados é
          feito por esse projeto, conforme a política dele, e não por nós.
        </P>
        <P>
          Você pode desligar a telemetria antes de iniciar o Hive, definindo <C>PAPERCLIP_TELEMETRY_DISABLED=1</C> (ou{" "}
          <C>DO_NOT_TRACK=1</C>). O <A href="/install#problemas">guia de instalação</A> mostra o passo a passo, e o nosso
          arquivo de configuração do Docker já vem com ela desligada.
        </P>
        <H3>Provedores de IA</H3>
        <P>
          Quando um agente usa o Claude Code, o Codex, o Gemini CLI ou outro, o que ele envia ao modelo segue os termos e a
          política de privacidade do provedor, de quem é a sua assinatura ou a sua chave. O Hive apenas coordena esses
          agentes na sua máquina.
        </P>
      </LegalSection>

      <LegalSection id="compartilhamento" titulo="Com quem compartilhamos">
        <P>Não vendemos nem alugamos dados pessoais. Os dados do site podem passar por:</P>
        <UL>
          <li>
            <strong className="font-semibold text-ink">Hospedagem do site</strong>, que guarda os registros de acesso:{" "}
            <Campo valor={LEGAL.hospedagem} />.
          </li>
          <li>
            <strong className="font-semibold text-ink">Autoridades</strong>, quando a lei ou uma ordem judicial exigir.
          </li>
          <li>
            <strong className="font-semibold text-ink">Serviços que você escolhe usar</strong>: ao entrar na comunidade do
            WhatsApp (Meta) ou ao abrir o repositório no GitHub (Microsoft), você passa a ser atendido pela política deles.
            O site só tem o link: não recebemos os seus dados desses serviços por esse caminho.
          </li>
        </UL>
      </LegalSection>

      <LegalSection id="transferencia" titulo="Transferência internacional">
        <P>
          Provedores de hospedagem e plataformas como o WhatsApp e o GitHub podem armazenar dados fora do Brasil. Quando isso
          ocorre, exigimos garantias compatíveis com o art. 33 da LGPD, como cláusulas contratuais adequadas ou provedores
          que ofereçam proteção equivalente.
        </P>
      </LegalSection>

      <LegalSection id="retencao" titulo="Por quanto tempo guardamos">
        <UL>
          <li>
            <strong className="font-semibold text-ink">Solicitações de privacidade:</strong> pelo tempo necessário para
            atender o pedido e para comprovar o atendimento, observados os prazos legais.
          </li>
          <li>
            <strong className="font-semibold text-ink">Registros de acesso:</strong> pelo período definido pelo provedor de
            hospedagem, que costuma ser curto, e pelo prazo que a lei exigir.
          </li>
          <li>
            <strong className="font-semibold text-ink">Escolhas no navegador:</strong> ficam com você e podem ser apagadas a
            qualquer momento nas configurações do navegador.
          </li>
        </UL>
      </LegalSection>

      <LegalSection id="direitos" titulo="Seus direitos">
        <P>Pela LGPD (art. 18), você pode pedir, a qualquer momento:</P>
        <UL>
          <li>a confirmação de que tratamos dados seus;</li>
          <li>o acesso a esses dados;</li>
          <li>a correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados fora da lei;</li>
          <li>a portabilidade dos dados a outro fornecedor;</li>
          <li>a eliminação dos dados tratados com o seu consentimento;</li>
          <li>informações sobre com quem compartilhamos os dados;</li>
          <li>informações sobre a possibilidade de não consentir e as consequências;</li>
          <li>a revogação do consentimento;</li>
          <li>a oposição a um tratamento feito com base em outra hipótese que não o consentimento;</li>
          <li>a revisão de decisões tomadas apenas por tratamento automatizado.</li>
        </UL>
        <P>
          Para pedir, use o formulário em <A href="/lgpd">Seus dados (LGPD)</A>. A confirmação da existência de tratamento
          e o acesso aos dados saem em formato simplificado, de imediato, ou em declaração completa em até 15 dias, como
          manda o art. 19. Se não gostar da resposta, você pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
        </P>
      </LegalSection>

      <LegalSection id="seguranca" titulo="Segurança">
        <P>
          Usamos conexão segura (HTTPS), limitamos quem acessa os dados das solicitações e mantemos só o necessário.
          Nenhum sistema é infalível: se houver um incidente que possa trazer risco relevante a você, comunicaremos você e a
          ANPD, nos termos do art. 48 da LGPD.
        </P>
      </LegalSection>

      <LegalSection id="criancas" titulo="Crianças e adolescentes">
        <P>
          O Hive é uma ferramenta profissional e o site não é dirigido a menores de 18 anos. Se você acredita que uma
          criança nos enviou dados, escreva para nós e apagaremos.
        </P>
      </LegalSection>

      <LegalSection id="alteracoes" titulo="Alterações">
        <P>
          Quando esta política mudar de forma relevante, atualizamos a data no topo da página e, se a mudança afetar o que
          você já nos informou, avisamos pelos canais que tivermos.
        </P>
      </LegalSection>

      <LegalSection id="contato" titulo="Contato e encarregado">
        <P>
          Encarregado pelo tratamento de dados (DPO): <Campo valor={LEGAL.encarregado.nome} />. Escreva para{" "}
          <A href={`mailto:${LEGAL.encarregado.email}`}>{LEGAL.encarregado.email}</A> ou use os formulários de{" "}
          <A href="/lgpd">Seus dados (LGPD)</A>.
        </P>
      </LegalSection>
    </LegalPage>
  );
}

import type { Metadata } from "next";
import { BadgeCheck } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { Callout } from "@/components/install/callout";
import { CodeBlock } from "@/components/install/code-block";
import { OsProvider, OsTabs } from "@/components/install/os-tabs";
import { PathAnswer } from "@/components/install/path-faq";
import { A, C } from "@/components/install/prose";
import { Step, Steps } from "@/components/install/steps";
import { Toc, type TocItem } from "@/components/install/toc";
import { FaqItem } from "@/components/faq-item";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { breadcrumbLd, graph, installArticleLd, organizationLd, softwareLd, websiteLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Como instalar o Hive no Windows, macOS e Linux",
  description:
    "Guia para instalar o Hive no Windows, macOS ou Linux, com npm ou Docker, e dar os primeiros passos com Claude Code, Codex e Gemini.",
  alternates: { canonical: "/install" },
  openGraph: {
    type: "article",
    url: "/install",
    title: "Como instalar o Hive no Windows, macOS e Linux",
    description:
      "Passo a passo para instalar o Hive no Windows, macOS ou Linux, com npm ou Docker.",
  },
};

const REPO_URL = "https://github.com/gugow06/hive";
const CLONE_URL = `${REPO_URL}.git`;

const toc: TocItem[] = [
  { id: "requisitos", label: "Antes de começar" },
  { id: "local", label: "Instalação local", recommended: true },
  { id: "docker", label: "Docker" },
  { id: "primeiros-passos", label: "Primeiros passos" },
  { id: "manutencao", label: "Atualizar, parar, remover" },
  { id: "problemas", label: "Dúvidas frequentes" },
];

const h2 = "font-display text-[clamp(1.5rem,2.6vw,1.875rem)] leading-tight font-bold tracking-[-0.03em] text-ink";
const h3 = "font-display text-lg font-semibold tracking-[-0.02em] text-ink";
const body = "max-w-[60ch] text-[16px] leading-7 text-ink-soft";

const COMPOSE = "docker compose -f docker-compose.hive.yml";

// PowerShell compatível com o Windows PowerShell 5.1 (que já vem no Windows) e
// com gerador criptográfico — `Get-Random` não serve para um segredo de sessão.
const WIN_SECRET =
  "$b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); ($b | ForEach-Object { $_.ToString('x2') }) -join ''";

export default function InstallPage() {
  return (
    <>
      <JsonLd
        data={graph(
          organizationLd(),
          websiteLd(),
          softwareLd(),
          installArticleLd(),
          breadcrumbLd([
            { name: "Início", path: "/" },
            { name: "Instalação", path: "/install" },
          ]),
        )}
      />
      <SmoothScroll />
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Nav />
      <main id="conteudo" tabIndex={-1}>
        <header className="shell pt-12 pb-10 md:pt-20 md:pb-14">
          <div className="max-w-3xl">
            <h1 className="display text-[clamp(2.25rem,4.8vw,3.5rem)] font-medium tracking-[-0.045em] text-balance text-ink">
              Instale o Hive
            </h1>
            <p className="lead mt-5 max-w-2xl text-balance">
              Rode o Hive no seu computador. Este guia leva você do download até o primeiro agente trabalhando, no
              Windows, no macOS ou no Linux.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              <li className="chip">Código aberto (MIT)</li>
              <li className="chip">Windows, macOS e Linux</li>
              <li className="chip">Porta padrão 3100</li>
            </ul>
          </div>
          <div className="mt-8 max-w-3xl">
            <Callout kind="beta" title="Beta aberto">
              <p>
                O Hive é um fork do Paperclip, com o Grafo de Conhecimento e a identidade da colmeia por cima. Ele
                funciona, mas ainda muda depressa. Se algo não sair como este guia descreve, nos conte:{" "}
                <A href={`${REPO_URL}/issues`}>abrir uma issue</A> ajuda todo mundo.
              </p>
            </Callout>
          </div>
        </header>

        <OsProvider>
          <div className="shell grid gap-10 pb-24 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-16">
            <aside>
              <Toc items={toc} />
            </aside>

            <article className="min-w-0 max-w-[760px] space-y-20">
              {/* ------------------------------------------------ requisitos */}
              <section id="requisitos" aria-labelledby="requisitos-titulo" className="space-y-6">
                <h2 id="requisitos-titulo" className={h2}>
                  Antes de começar
                </h2>
                <p className={body}>Você precisa de pouco. Veja o que cada caminho pede:</p>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-3">
                    <h3 className={h3}>Instalação local</h3>
                    <ul className={`${body} list-disc space-y-1.5 pl-5 marker:text-ink-faint`}>
                      <li>Node.js 24.11 ou superior</li>
                      <li>Windows, macOS ou Linux. No Windows, direto no PowerShell: o WSL2 é opcional</li>
                      <li>pnpm 9 ou superior (o Corepack, que vem com o Node, ativa). O npm também serve</li>
                      <li>Git, só se for instalar pelo código-fonte</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className={h3}>Docker</h3>
                    <ul className={`${body} list-disc space-y-1.5 pl-5 marker:text-ink-faint`}>
                      <li>Docker Desktop (Windows e macOS) ou Docker Engine com Compose (Linux)</li>
                      <li>Git</li>
                      <li>Memória: a compilação do servidor usa até 4 GB. Se faltar, aumente o limite do Docker Desktop.</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className={h3}>Chaves de IA (podem esperar)</h3>
                  <p className={body}>
                    O Hive sobe sem elas. Para os agentes trabalharem, configure ao menos uma: Anthropic (Claude),
                    OpenAI (Codex) ou Google (Gemini). O assistente de primeiros passos pede a chave na etapa de
                    conectar um modelo.
                  </p>
                </div>
              </section>

              {/* ------------------------------------------------ instalação local */}
              <section id="local" aria-labelledby="local-titulo" className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <h2 id="local-titulo" className={h2}>
                      Instalação local
                    </h2>
                    {/* O selo é o destaque visual da forma recomendada de usar o Hive. */}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber px-3 py-1 text-[13px] font-semibold text-ink-900">
                      <BadgeCheck className="size-4" aria-hidden="true" />
                      Recomendado
                    </span>
                  </div>
                  <p className={body}>
                    É o caminho que recomendamos. O Hive roda no seu computador, com um banco de dados embutido: não
                    é preciso instalar o PostgreSQL.
                  </p>
                </div>
                <Steps>
                  <Step n={1} title="Prepare o Node.js">
                    <OsTabs
                      panels={{
                        windows: (
                          <>
                            <p className={body}>
                              Baixe o instalador do Node.js 24.11 ou superior em <A href="https://nodejs.org">nodejs.org</A>{" "}
                              e execute. Depois, abra um novo PowerShell e confira:
                            </p>
                            <CodeBlock label="PowerShell" prompt="PS>" code="node --version" />
                            <Callout kind="nota" title="Preciso do WSL?">
                              <p>
                                Não. O Hive roda direto no Windows. O WSL2 só é uma opção para quem já trabalha num
                                ambiente Linux: veja as vantagens em <A href="#problemas">Dúvidas frequentes</A>.
                              </p>
                            </Callout>
                          </>
                        ),
                        macos: (
                          <>
                            <p className={body}>
                              Instale o Node.js 24.11 ou superior, pelo Homebrew ou pelo instalador de{" "}
                              <A href="https://nodejs.org">nodejs.org</A>:
                            </p>
                            <CodeBlock label="Terminal" code={"brew install node\nnode --version"} />
                          </>
                        ),
                        linux: (
                          <>
                            <p className={body}>
                              Instale o Node.js 24.11 ou superior pelo gerenciador que preferir (nvm, fnm) ou em{" "}
                              <A href="https://nodejs.org">nodejs.org</A>. Exemplo com o nvm:
                            </p>
                            <CodeBlock
                              label="Terminal"
                              code={"curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash\n# feche e abra o terminal, depois:\nnvm install 24\nnode --version"}
                            />
                          </>
                        ),
                      }}
                    />
                    <p className={body}>
                      O <C>node --version</C> deve mostrar <C>v24.11</C> ou mais recente.
                    </p>
                  </Step>
                  <Step n={2} title="Prepare o pnpm">
                    <p className={body}>O Node traz o Corepack, que ativa o pnpm. Depois, o <C>pnpm setup</C> cria a pasta dos programas globais:</p>
                    <OsTabs
                      panels={{
                        windows: <CodeBlock label="PowerShell" prompt="PS>" code={`corepack enable pnpm
pnpm setup`} />,
                        macos: <CodeBlock label="Terminal" code={`corepack enable pnpm
pnpm setup`} />,
                        linux: <CodeBlock label="Terminal" code={`corepack enable pnpm
pnpm setup`} />,
                      }}
                    />
                    <p className={body}>
                      Feche e abra o terminal, para o novo PATH valer. Se o <C>corepack enable</C> acusar falta de
                      permissão (comum no Windows), instale o pnpm pelo npm: <C>npm.cmd install -g pnpm</C> no
                      PowerShell, ou <C>npm install -g pnpm</C> nos outros sistemas.
                    </p>
                  </Step>
                  <Step n={3} title="Instale o Hive">
                    <CodeBlock code="pnpm add -g hive-agents" />
                    <p className={body}>
                      No pnpm 10 aparece o aviso “Ignored build scripts”. Pode ignorar: o Hive prepara o que precisa na
                      primeira execução. Prefere o npm? Use <C>npm install -g hive-agents</C> (no PowerShell,{" "}
                      <C>npm.cmd</C>).
                    </p>
                  </Step>
                  <Step n={4} title="Inicie o Hive" last>
                    <CodeBlock code="hive onboard --yes" />
                    <p className={body}>
                      Esse comando cria a configuração inicial e já inicia o Hive. Quando o endereço aparecer no
                      terminal, abra <C>http://localhost:3100</C> no navegador. No modo local o Hive não pede login.
                      Nas próximas vezes, inicie com <C>hive run</C>.
                    </p>
                    <Callout kind="nota" title="Telemetria de uso">
                      <p>
                        Nesta versão beta o Hive envia eventos técnicos de uso ao projeto original. Se preferir que não
                        enviem, veja como desligar em <A href="#problemas">Dúvidas frequentes</A>.
                      </p>
                    </Callout>
                  </Step>
                </Steps>
                <div className="space-y-3 border-t border-line pt-6">
                  <h3 className={h3}>Pelo código-fonte</h3>
                  <p className={body}>
                    Para contribuir com o Hive ou testar uma alteração, rode direto do repositório. Precisa do Git e do
                    Node.js 24.11 ou superior:
                  </p>
                  <CodeBlock code={`corepack enable
git clone ${CLONE_URL}
cd hive
pnpm install
pnpm dev`} />
                  <p className={body}>
                    O endereço é o mesmo, <C>http://localhost:3100</C>. A primeira instalação leva alguns minutos.
                  </p>
                </div>
              </section>

              {/* ------------------------------------------------ docker */}
              <section id="docker" aria-labelledby="docker-titulo" className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <h2 id="docker-titulo" className={h2}>
                      Docker
                    </h2>
                    <span className="chip">Em validação</span>
                  </div>
                  <p className={body}>
                    O Hive isolado num contêiner, com o banco de dados dentro dele e os dados guardados num volume.
                  </p>
                </div>
                <Callout kind="atencao" title="Em validação">
                  <p>
                    A imagem do Hive ainda está sendo validada, e a compilação pode falhar nesta versão (veja{" "}
                    <A href="#problemas">Dúvidas frequentes</A>). Se isso acontecer, use a{" "}
                    <A href="#local">instalação local</A>. Os passos abaixo são o caminho previsto.
                  </p>
                </Callout>
                <Steps>
                  <Step n={1} title="Baixe o código">
                    <OsTabs
                      panels={{
                        windows: (
                          <>
                            <CodeBlock
                              label="PowerShell"
                              prompt="PS>"
                              code={`git clone --config core.autocrlf=false ${CLONE_URL}\ncd hive\\docker`}
                            />
                            <p className={body}>
                              A opção <C>core.autocrlf=false</C> importa: o Git do Windows troca as quebras de linha dos
                              arquivos e isso quebra a compilação (veja <A href="#problemas">Dúvidas frequentes</A>).
                            </p>
                          </>
                        ),
                        macos: <CodeBlock code={`git clone ${CLONE_URL}\ncd hive/docker`} />,
                        linux: <CodeBlock code={`git clone ${CLONE_URL}\ncd hive/docker`} />,
                      }}
                    />
                  </Step>
                  <Step n={2} title="Crie o arquivo de configuração">
                    <OsTabs
                      panels={{
                        windows: (
                          <>
                            <CodeBlock
                              label="PowerShell"
                              prompt="PS>"
                              code={`Copy-Item .env.hive.example .env\n# gera o segredo de sessão:\n${WIN_SECRET}`}
                            />
                          </>
                        ),
                        macos: <CodeBlock code={"cp .env.hive.example .env\n# gera o segredo de sessão:\nopenssl rand -hex 32"} />,
                        linux: <CodeBlock code={"cp .env.hive.example .env\n# gera o segredo de sessão:\nopenssl rand -hex 32"} />,
                      }}
                    />
                    <p className={body}>
                      Abra o arquivo <C>.env</C> e cole o valor gerado em <C>BETTER_AUTH_SECRET</C>: é o segredo que
                      protege as sessões de login. Se quiser, preencha também as chaves de IA.
                    </p>
                  </Step>
                  <Step n={3} title="Suba o Hive">
                    <CodeBlock code={`${COMPOSE} up -d --build`} />
                    <p className={body}>
                      A primeira vez compila a imagem e leva vários minutos; as próximas usam o cache. Para acompanhar:
                    </p>
                    <CodeBlock code={`${COMPOSE} logs -f`} />
                  </Step>
                  <Step n={4} title="Abra o Hive" last>
                    <p className={body}>
                      Acesse <C>http://localhost:3100</C>. No Docker o Hive roda no modo autenticado (o login é
                      obrigatório) e a porta só abre na sua máquina.
                    </p>
                  </Step>
                </Steps>
              </section>

              {/* ------------------------------------------------ primeiros passos */}
              <section id="primeiros-passos" aria-labelledby="primeiros-titulo" className="space-y-6">
                <div className="space-y-2">
                  <h2 id="primeiros-titulo" className={h2}>
                    Primeiros passos
                  </h2>
                  <p className={body}>
                    Com o Hive aberto, o assistente conduz a configuração inicial em quatro etapas. A interface do
                    produto ainda está em inglês; os nomes abaixo seguem a tela.
                  </p>
                </div>
                <Steps>
                  <Step n={1} title="Name your organization">
                    <p className={body}>Dê um nome à organização: é a empresa ou o projeto que o Hive vai organizar.</p>
                  </Step>
                  <Step n={2} title="Create your first agent">
                    <p className={body}>
                      Crie o primeiro agente e escolha quem executa o trabalho dele: Claude Code, Codex, Cursor ou outro
                      executor. Ele será o coordenador da equipe.
                    </p>
                  </Step>
                  <Step n={3} title="Connect a model">
                    <p className={body}>
                      Informe a chave do provedor de IA (Anthropic, OpenAI ou Google) para o agente poder trabalhar.
                    </p>
                  </Step>
                  <Step n={4} title="Review" last>
                    <p className={body}>Confira o resumo e confirme. A organização está pronta.</p>
                  </Step>
                </Steps>
                <div className="space-y-3">
                  <h3 className={h3}>Depois disso</h3>
                  <ul className={`${body} list-disc space-y-1.5 pl-5 marker:text-ink-faint`}>
                    <li>Crie a primeira tarefa e atribua ao coordenador: ele divide o trabalho em subtarefas para a equipe.</li>
                    <li>Abra a Memória para ver os documentos que o time consulta e o grafo que liga todos eles.</li>
                    <li>Acompanhe tudo na Auditoria: quem fez o quê, e quando.</li>
                  </ul>
                  <p className={body}>
                    Quer entender como as peças se encaixam? Veja <A href="/#como-funciona">como o Hive trabalha</A>.
                  </p>
                </div>
              </section>

              {/* ------------------------------------------------ manutenção */}
              <section id="manutencao" aria-labelledby="manutencao-titulo" className="space-y-6">
                <h2 id="manutencao-titulo" className={h2}>
                  Atualizar, parar e remover
                </h2>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="min-w-0 space-y-3">
                    <h3 className={h3}>Instalação local</h3>
                    <p className={body}>Para atualizar para a versão mais recente:</p>
                    <CodeBlock code="pnpm add -g hive-agents@latest" />
                    <p className={body}>
                      Para parar, pressione <C>Ctrl+C</C> no terminal. Para desinstalar, use{" "}
                      <C>pnpm remove -g hive-agents</C>. Se instalou pelo npm, troque <C>pnpm add -g</C> por{" "}
                      <C>npm install -g</C>, e <C>pnpm remove -g</C> por <C>npm uninstall -g</C>. Seus dados ficam na
                      pasta <C>.paperclip</C>, dentro da sua pasta de usuário, e continuam lá até você apagá-la. Se
                      instalou pelo código-fonte, atualize com <C>git pull</C> e <C>pnpm install</C>.
                    </p>
                  </div>
                  <div className="min-w-0 space-y-3">
                    <h3 className={h3}>Docker</h3>
                    <p className={body}>Para atualizar, dentro da pasta docker:</p>
                    <CodeBlock code={`git pull\n${COMPOSE} up -d --build`} />
                    <p className={body}>Para parar, ou para remover o contêiner mantendo os dados:</p>
                    <CodeBlock code={`${COMPOSE} stop\n${COMPOSE} down`} />
                  </div>
                </div>
                <Callout kind="atencao" title="Cuidado com o -v">
                  <p>
                    <C>down -v</C> apaga também o volume com todos os seus dados. Use só se quiser recomeçar do zero.
                  </p>
                </Callout>
              </section>

              {/* ------------------------------------------------ problemas */}
              <section id="problemas" aria-labelledby="problemas-titulo" className="space-y-6">
                <h2 id="problemas-titulo" className={h2}>
                  Dúvidas frequentes
                </h2>
                <div className="space-y-3">
                  <FaqItem
                    question="Preciso instalar o WSL no Windows? Quais as vantagens?"
                    answer={
                      <>
                        <p>
                          Não. O Hive roda direto no Windows, pelo PowerShell, e foi assim que o testamos. O WSL2 é um
                          Linux dentro do Windows e é opcional.
                        </p>
                        <p>Ele vale a pena se você já trabalha num ambiente Linux:</p>
                        <ul className="list-disc space-y-1.5 pl-5 marker:text-ink-faint">
                          <li>Os agentes executam comandos no mesmo ambiente do Hive. No WSL2 eles usam bash e as ferramentas de Linux, como na maioria dos tutoriais e servidores.</li>
                          <li>Projetos guardados dentro do sistema de arquivos do Linux abrem e compilam mais rápido do que os que ficam nas pastas do Windows.</li>
                          <li>O ambiente fica igual ao do macOS e do Linux, o que reduz diferenças de caminho e de scripts.</li>
                        </ul>
                        <p>
                          O custo é manter tudo em dois lugares: Node.js, o Hive e as CLIs dos agentes precisam ser
                          instalados dentro do Ubuntu, com os próprios logins. Se não precisa disso, fique no
                          PowerShell.
                        </p>
                      </>
                    }
                  />
                  <FaqItem
                    question="A imagem Docker não compila (“Generated contract drift”)"
                    answer={
                      <>
                        <p>
                          É um problema conhecido da versão atual: a imagem ainda não compila de ponta a ponta. Use a{" "}
                          <A href="#local">instalação local</A> por enquanto. Acompanhamos a correção no{" "}
                          <A href={REPO_URL}>repositório</A>.
                        </p>
                      </>
                    }
                  />
                  <FaqItem
                    question="No Windows, a compilação diz “The generated PRP contract manifest is stale”"
                    answer={
                      <>
                        <p>
                          Só acontece ao compilar pelo código-fonte. O Git do Windows converte as quebras de linha dos
                          arquivos, e o Hive confere arquivos por assinatura. Clone de novo sem a conversão:
                        </p>
                        <CodeBlock label="PowerShell" prompt="PS>" code={`git clone --config core.autocrlf=false ${CLONE_URL}`} />
                        <p>
                          Se já clonou, apague a pasta e clone de novo com o comando acima. Evite “consertar” com{" "}
                          <C>git reset --hard</C> sem antes salvar o que você alterou.
                        </p>
                      </>
                    }
                  />
                  <FaqItem
                    question="O Docker diz que BETTER_AUTH_SECRET não está definida"
                    answer={
                      <p>
                        O arquivo <C>.env</C> não existe ou está sem o valor. Volte ao passo 2 da instalação com Docker: copie o{" "}
                        <C>.env.hive.example</C> para <C>.env</C> e cole o segredo gerado.
                      </p>
                    }
                  />
                  <FaqItem
                    question="O Docker não responde (“Cannot connect to the Docker daemon”)"
                    answer={
                      <p>
                        O Docker está fechado. Abra o Docker Desktop e espere o aviso “Engine running”; no Linux, inicie
                        o serviço do Docker. Depois repita o comando.
                      </p>
                    }
                  />
                  <FaqItem
                    question="A porta 3100 já está em uso"
                    answer={
                      <>
                        <p>
                          No Docker, acrescente <C>HIVE_PORT=3200</C> ao arquivo <C>.env</C> e suba de novo. Na instalação
                          local, defina a variável antes do comando:
                        </p>
                        <CodeBlock code="PORT=3200 pnpm dev" />
                      </>
                    }
                  />
                  <FaqItem
                    question="Os agentes não trabalham"
                    answer={
                      <p>
                        Falta uma chave de IA, ou o executor escolhido (Claude Code, Codex…) não está instalado. O Hive
                        mostra na tela o que falta na verificação do ambiente do agente: comece por ela.
                      </p>
                    }
                  />
                  <FaqItem
                    question="Como adicionar o Claude Code, o Codex e o Gemini ao PATH?"
                    answer={<PathAnswer />}
                  />
                  <FaqItem
                    question="O Hive envia dados para fora da minha máquina?"
                    answer={
                      <>
                        <p>
                          As suas tarefas, os documentos e as chaves ficam com você. Nesta versão beta, porém, o Hive vem
                          com a telemetria de uso ligada por padrão e envia eventos técnicos ao projeto original, o
                          Paperclip. Pelas regras do projeto, esses eventos não incluem o conteúdo das tarefas, dos
                          documentos nem as suas chaves.
                        </p>
                        <p>Para desligar, defina a variável antes de iniciar o Hive:</p>
                        <CodeBlock code={"export PAPERCLIP_TELEMETRY_DISABLED=1\npnpm dev"} />
                        <p>
                          Para deixar fixo, acrescente a primeira linha ao <C>~/.bashrc</C> ou ao <C>~/.zshrc</C>. A
                          variável <C>DO_NOT_TRACK=1</C> também funciona. No Docker, o nosso arquivo de configuração já
                          vem com a telemetria desligada. A <A href="/privacidade">política de privacidade</A> explica o
                          que cada parte trata.
                        </p>
                      </>
                    }
                  />
                  <FaqItem
                    question="Onde ficam os meus dados?"
                    answer={
                      <p>
                        Na instalação local, na pasta <C>.paperclip</C> da sua pasta de usuário (a pasta pode ser trocada com a variável{" "}
                        <C>PAPERCLIP_HOME</C>). No Docker, no volume <C>hive-data</C>.
                      </p>
                    }
                  />
                </div>
                <p className={body}>
                  Não achou o seu caso? <A href={`${REPO_URL}/issues`}>Abra uma issue</A> ou escreva para{" "}
                  <A href="mailto:contato@hiveagents.com.br">contato@hiveagents.com.br</A>.
                </p>
              </section>
            </article>
          </div>
        </OsProvider>
      </main>
      <Footer />
    </>
  );
}

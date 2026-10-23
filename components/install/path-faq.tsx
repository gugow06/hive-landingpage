import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { AgentTabs } from "./agent-tabs";
import { OsTabs } from "./os-tabs";
import {
  AGENT_COMMAND,
  AGENT_DOCS,
  CLAUDE_DIR_UNIX,
  CLAUDE_DIR_WINDOWS,
  installCommands,
  pathUnix,
  pathWindows,
  type Agent,
} from "./path-commands";
import { A, C } from "./prose";

const LOGIN: Record<Agent, string> = {
  claude:
    "Ele funciona com a sua assinatura do Claude (Pro, Max, Team ou Enterprise) ou com uma conta do Console. No primeiro uso, o claude abre o login no navegador.",
  codex:
    "Ele entra com a sua conta ou com uma chave da OpenAI, conforme o seu plano. No primeiro uso, o codex pede o login.",
  gemini:
    "Ele entra com a sua conta Google ou com uma chave do Gemini. No primeiro uso, o gemini pede o login.",
};

/** Onde o instalador deixa o comando, por sistema. */
function folder(agent: Agent, os: "windows" | "unix") {
  if (agent === "claude") return os === "windows" ? CLAUDE_DIR_WINDOWS : CLAUDE_DIR_UNIX;
  return os === "windows" ? "npm.cmd prefix -g" : "$(npm prefix -g)/bin";
}

function FolderSentence({ agent, os }: { agent: Agent; os: "windows" | "unix" }) {
  if (agent === "claude") {
    return (
      <>
        O instalador do Claude Code deixa o comando em <C>{folder(agent, os)}</C>. Para pôr essa pasta no PATH
        {os === "windows" ? " do seu usuário, sem precisar de administrador" : ""}:
      </>
    );
  }
  return (
    <>
      O npm instala os pacotes globais na pasta <C>{folder(agent, os)}</C>. Para pôr essa pasta no PATH
      {os === "windows" ? " do seu usuário, sem precisar de administrador" : ""}:
    </>
  );
}

/** As três abas de sistema de um agente: instalar (se faltar) e pôr no PATH. */
function osPanels(agent: Agent) {
  const unix = (rc: string, shell: string) => (
    <>
      <p>Se ainda não instalou:</p>
      <CodeBlock code={installCommands(agent, "macos")} />
      <p>
        <FolderSentence agent={agent} os="unix" /> {shell}
      </p>
      <CodeBlock code={pathUnix(agent, rc)} />
    </>
  );

  return {
    windows: (
      <>
        <Callout kind="nota" title="Usa o Hive pelo WSL2?">
          <p>
            Então instale e ajuste o PATH dentro do Ubuntu: siga a aba Linux. O que está instalado no Windows não vale
            dentro do WSL2.
          </p>
        </Callout>
        <p>Se ainda não instalou (PowerShell):</p>
        <CodeBlock label="PowerShell" prompt="PS>" code={installCommands(agent, "windows")} />
        <p>
          <FolderSentence agent={agent} os="windows" />
        </p>
        <CodeBlock label="PowerShell" prompt="PS>" code={pathWindows(agent)} />
        {agent !== "claude" && (
          <p>
            Usamos <C>npm.cmd</C> porque, na configuração padrão do Windows, o PowerShell bloqueia o <C>npm</C> com o
            erro “a execução de scripts está desabilitada”.
          </p>
        )}
      </>
    ),
    macos: unix("~/.zshrc", "No macOS o shell padrão é o zsh:"),
    linux: (
      <>
        {unix("~/.bashrc", "No bash, o padrão da maioria das distribuições:")}
        <p>
          Usa zsh? Troque <C>~/.bashrc</C> por <C>~/.zshrc</C>.
          {agent !== "claude" &&
            " Com nvm ou fnm, a pasta dos pacotes globais já entra no PATH sozinha quando a versão do Node está ativa."}
        </p>
      </>
    ),
  };
}

function AgentPanel({ agent }: { agent: Agent }) {
  const command = AGENT_COMMAND[agent];
  return (
    <>
      <p>{LOGIN[agent]}</p>
      <p>Primeiro, confira se o terminal já encontra o comando:</p>
      <CodeBlock code={`${command} --version`} />
      <p>
        Se responder “command not found” (ou “não é reconhecido”, no Windows), a pasta dele não está no PATH. Escolha o
        seu sistema:
      </p>
      <OsTabs label={`Sistema operacional (${command})`} panels={osPanels(agent)} />
      <p>
        Guia oficial: <A href={AGENT_DOCS[agent]}>{agent === "claude" ? "Claude Code" : agent === "codex" ? "Codex" : "Gemini CLI"}</A>.
      </p>
    </>
  );
}

/**
 * Resposta da pergunta "Como adicionar o Claude Code, o Codex e o Gemini ao PATH?".
 * Cada agente tem a sua aba, com as abas de sistema dentro; a escolha de sistema vale para
 * a página inteira (veja `OsProvider`).
 */
export function PathAnswer() {
  return (
    <>
      <p>
        O Hive chama <C>claude</C>, <C>codex</C> e <C>gemini</C> como qualquer comando do terminal. Se o terminal em que
        você roda o Hive não encontra o comando, o agente não executa. Escolha o agente que você usa:
      </p>
      <AgentTabs
        label="Agente"
        panels={{
          claude: <AgentPanel agent="claude" />,
          codex: <AgentPanel agent="codex" />,
          gemini: <AgentPanel agent="gemini" />,
        }}
      />
      <p>
        Os demais agentes, como Cursor, OpenCode e Kimi, seguem o mesmo padrão: instale a CLI, deixe o comando no PATH e
        entre com a sua assinatura (ou com uma chave de API, quando o agente aceitar). Cada um tem o seu guia oficial.
      </p>
      <p>
        Depois de ajustar o PATH, feche e abra o terminal, rode o <C>--version</C> de novo e inicie o Hive outra vez com{" "}
        <C>pnpm dev</C>. Ele só enxerga o PATH do terminal que o iniciou.
      </p>
      <p>
        Preferiu não mexer no PATH? No agente, preencha o campo <C>command</C> com o caminho completo, por exemplo{" "}
        <C>/home/voce/.local/bin/claude</C>.
      </p>
    </>
  );
}

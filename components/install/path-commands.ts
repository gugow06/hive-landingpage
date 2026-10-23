/**
 * Comandos de PATH e de instalação das CLIs dos agentes, por sistema.
 *
 * Ficam num módulo à parte (e não dentro do JSX) por um motivo prático: já
 * houve aqui um erro de escape que fazia o comando do macOS/Linux expandir o
 * PATH na hora, em vez de gravar a linha certa no `~/.zshrc`. `tests/` executa
 * estes comandos de verdade (bash e PowerShell) para isso não voltar.
 */

export type Agent = "claude" | "codex" | "gemini";

/** Guias oficiais de cada CLI. */
export const AGENT_DOCS: Record<Agent, string> = {
  claude: "https://code.claude.com/docs/en/setup",
  codex: "https://github.com/openai/codex",
  gemini: "https://github.com/google-gemini/gemini-cli",
};

/** Comando que cada agente instala (e que o Hive chama pelo PATH). */
export const AGENT_COMMAND: Record<Agent, string> = { claude: "claude", codex: "codex", gemini: "gemini" };

/** Pasta onde o instalador nativo do Claude Code deixa o `claude`. */
export const CLAUDE_DIR_UNIX = "~/.local/bin";
export const CLAUDE_DIR_WINDOWS = "%USERPROFILE%\\.local\\bin";

// --------------------------------------------------------------------------- instalar

export function installCommands(agent: Agent, os: "windows" | "macos" | "linux"): string {
  if (agent === "claude") {
    // Instalador nativo (o recomendado pela documentação da Anthropic).
    return os === "windows" ? "irm https://claude.ai/install.ps1 | iex" : "curl -fsSL https://claude.ai/install.sh | bash";
  }
  const pkg = agent === "codex" ? "@openai/codex" : "@google/gemini-cli";
  // `npm.cmd` no PowerShell: na configuração padrão do Windows o `npm` (npm.ps1) é bloqueado
  // com "running scripts is disabled on this system"; o .cmd roda sem depender disso.
  return os === "windows" ? `npm.cmd install -g ${pkg}` : `npm install -g ${pkg}`;
}

// --------------------------------------------------------------------------- PATH (macOS e Linux)

/**
 * Grava no arquivo de inicialização do shell uma linha `export PATH="…:$PATH"` **literal**.
 * Aspas simples e `printf` para nada ser expandido na hora de gravar. O `npm prefix -g` é
 * resolvido uma vez, agora, e o caminho fica gravado (sem chamar o npm a cada terminal aberto).
 */
export function pathUnix(agent: Agent, rc: string): string {
  const add =
    agent === "claude"
      ? `echo 'export PATH="$HOME/.local/bin:$PATH"' >> ${rc}`
      : `printf 'export PATH="%s/bin:$PATH"\\n' "$(npm prefix -g)" >> ${rc}`;
  return [add, `source ${rc}`].join("\n");
}

// --------------------------------------------------------------------------- PATH (Windows)

/**
 * Acrescenta uma pasta ao PATH do **usuário** (não precisa de administrador), sem duplicar se
 * ela já estiver lá. No Windows o npm põe os binários globais na própria pasta do prefixo.
 */
export function pathWindows(agent: Agent): string {
  const dir = agent === "claude" ? '"$env:USERPROFILE\\.local\\bin"' : "(npm.cmd prefix -g)";
  return [
    `$dir = ${dir}`,
    '$path = [Environment]::GetEnvironmentVariable("Path", "User")',
    'if (($path -split ";") -notcontains $dir) {',
    '  [Environment]::SetEnvironmentVariable("Path", "$path;$dir", "User")',
    "}",
  ].join("\n");
}

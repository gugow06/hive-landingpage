// Os comandos de PATH e instalação que a página entrega (components/install/path-commands.ts).
// Eles mexem no ambiente das pessoas, então não basta "parecerem certos": quando há bash ou
// PowerShell na máquina, os testes os EXECUTAM, em arquivos temporários, nunca no ambiente real.

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { AGENT_DOCS, installCommands, pathUnix, pathWindows, type Agent } from "../components/install/path-commands.ts";

const AGENTS: Agent[] = ["claude", "codex", "gemini"];

function which(cmd: string): boolean {
  const probe = process.platform === "win32" ? "where" : "which";
  return spawnSync(probe, [cmd], { stdio: "ignore" }).status === 0;
}

test("instalação: Claude pelo instalador nativo; Codex e Gemini pelo npm, com npm.cmd no Windows", () => {
  assert.match(installCommands("claude", "macos"), /claude\.ai\/install\.sh \| bash/);
  assert.match(installCommands("claude", "linux"), /claude\.ai\/install\.sh \| bash/);
  assert.match(installCommands("claude", "windows"), /claude\.ai\/install\.ps1 \| iex/);
  assert.equal(installCommands("codex", "macos"), "npm install -g @openai/codex");
  assert.equal(installCommands("gemini", "linux"), "npm install -g @google/gemini-cli");
  // No PowerShell padrão do Windows o `npm` (npm.ps1) é bloqueado; o `.cmd` não é.
  assert.equal(installCommands("codex", "windows"), "npm.cmd install -g @openai/codex");
  assert.equal(installCommands("gemini", "windows"), "npm.cmd install -g @google/gemini-cli");
});

test("PATH no macOS/Linux: a linha gravada é literal (sem escape perdido nem expansão na hora)", () => {
  for (const agent of AGENTS) {
    const script = pathUnix(agent, "~/.zshrc");
    // O erro que já houve: o shell expandia $PATH ao gravar, porque os escapes sumiram.
    assert.ok(!/\\"/.test(script), `${agent}: sobrou \\" no comando`);
    assert.ok(!/echo "export PATH="/.test(script), `${agent}: aspas aninhadas`);
    assert.match(script, /source ~\/\.zshrc$/);
  }
  assert.match(pathUnix("claude", "~/.bashrc"), /echo 'export PATH="\$HOME\/\.local\/bin:\$PATH"' >> ~\/\.bashrc/);
  assert.match(pathUnix("codex", "~/.bashrc"), /printf 'export PATH="%s\/bin:\$PATH"\\n' "\$\(npm prefix -g\)" >> ~\/\.bashrc/);
});

test("PATH no macOS/Linux: executado de verdade, grava linhas literais e válidas", { skip: !which("bash") }, () => {
  for (const agent of AGENTS) {
    const dir = mkdtempSync(join(tmpdir(), "hive-path-"));
    try {
      writeFileSync(join(dir, "rc"), "");
      // `npm` falso: o teste não depende de ter o npm instalado.
      writeFileSync(join(dir, "npm"), '#!/usr/bin/env bash\n[ "$1" = prefix ] && echo /opt/globais\n', { mode: 0o755 });
      const script = pathUnix(agent, '"$RC"').replace('"$RC"\nsource "$RC"', '"$RC"') // `source` abaixo
        .replace(/source "\$RC"$/m, "");
      const run = spawnSync("bash", ["-c", `export PATH="./:$PATH" RC=./rc; ${script}\nbash -n ./rc && cat ./rc`], { cwd: dir, encoding: "utf8" });
      assert.equal(run.status, 0, `${agent}: ${run.stderr}`);
      const rc = readFileSync(join(dir, "rc"), "utf8");
      if (agent === "claude") assert.equal(rc.trim(), 'export PATH="$HOME/.local/bin:$PATH"');
      else assert.equal(rc.trim(), 'export PATH="/opt/globais/bin:$PATH"');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

test(
  "PATH no Windows: executado de verdade, acrescenta a pasta e não duplica",
  { skip: process.platform !== "win32" || !which("powershell") || !which("npm.cmd") },
  () => {
    const run = (path: string, agent: Agent) => {
      // Troca a leitura e a gravação do PATH do usuário por uma variável e uma impressão:
      // o PATH real da pessoa que roda o teste nunca é tocado.
      const script = pathWindows(agent)
        .replace('$path = [Environment]::GetEnvironmentVariable("Path", "User")', `$path = '${path}'`)
        .replace('[Environment]::SetEnvironmentVariable("Path", "$path;$dir", "User")', 'Write-Output "$path;$dir"');
      const dir = mkdtempSync(join(tmpdir(), "hive-ps-"));
      try {
        const file = join(dir, "t.ps1");
        writeFileSync(file, `${script}\nWrite-Output "FIM"`);
        const out = spawnSync("powershell", ["-NoProfile", "-Command", `Invoke-Expression (Get-Content -Raw '${file}')`], { encoding: "utf8" });
        return out.stdout.trim();
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    };

    // PATH sem a pasta: ela é acrescentada.
    assert.match(run("C:\\fake", "claude"), /^C:\\fake;.*\\\.local\\bin\s+FIM$/s);
    assert.match(run("C:\\fake", "codex"), /^C:\\fake;.+\s+FIM$/s);
    // PATH que já tem a pasta: nada é impresso (nada seria gravado).
    const home = process.env.USERPROFILE ?? "";
    assert.equal(run(`C:\\fake;${home}\\.local\\bin`, "claude"), "FIM");
    assert.ok(existsSync(home), "USERPROFILE existe");
  },
);

test("os guias oficiais de cada CLI estão linkados", () => {
  for (const agent of AGENTS) assert.match(AGENT_DOCS[agent], /^https:\/\//);
});

test("página de instalação: o caminho recomendado é o pacote pelo pnpm, e o WSL é opcional", () => {
  const page = readFileSync(new URL("../app/install/page.tsx", import.meta.url), "utf8");
  assert.match(page, /pnpm add -g hive-agents/, "pnpm é o método principal");
  assert.match(page, /npm install -g hive-agents/, "npm como alternativa");
  assert.match(page, /pnpm setup/);
  assert.match(page, /hive onboard --yes/);
  assert.ok(!/O Hive não roda direto no Windows/.test(page), "o WSL não é requisito");
  assert.match(page, /WSL2 é opcional/);
});

# Contexto de marketing do Hive

> Documento-base lido pelas skills de copy e SEO (`.claude/skills/`). Só entra aqui o que dá para
> provar. O que ainda não existe fica em **Lacunas**, e nenhuma skill deve inventar.
>
> **Versão:** 1.0 · 2026-10-22

## 1. O produto

- **Em uma linha:** o Hive organiza uma equipe de agentes de IA, com hierarquia, memória
  compartilhada e registro de tudo que acontece.
- **O que faz:** você define o objetivo, o agente coordenador divide o trabalho em subtarefas, cada
  agente executa no seu executor (Claude Code, Codex, Cursor, Gemini CLI e outros), os documentos
  ficam numa memória em Markdown ligada por `[[referências]]`, e a auditoria mostra quem fez o quê e
  quando.
- **Categoria:** orquestração de agentes de IA / plano de controle para equipes de agentes.
- **Tipo:** software de código aberto (MIT) que roda na máquina ou no servidor de quem usa. Beta aberto.
- **É um fork do Paperclip**, com o Grafo de Conhecimento (memória) e a identidade da colmeia por cima.
- **Preço:** o Hive é gratuito. Quem usa paga os modelos de IA ao provedor (assinatura ou API).
  Não há plano pago definido.

## 2. Público

- Fundadores, solopreneurs, indie hackers e PMEs de tecnologia que já usam IA para trabalhar.
- **Perfil técnico médio:** sabe abrir um terminal. Já usa Claude Code, Codex ou Gemini CLI,
  na maioria das vezes com assinatura (login), não com chave de API.
- **Tarefa que contrata o Hive:** delegar trabalho a vários agentes sem perder o fio, sem reexplicar o
  projeto a cada sessão e sem perder o controle do que foi decidido e do que foi gasto.

## 3. Problemas

- Várias abas de IA abertas, cada uma com metade da história.
- O contexto some entre uma sessão e outra; o que foi decidido na semana passada vive num histórico de chat.
- Delegar dá medo: não se sabe o que o agente decidiu sozinho nem quanto gastou.

## 4. Diferenciais (verificáveis no produto)

- **Hierarquia real:** organograma com coordenador, executores e revisor; cada tarefa desce por ele.
- **Memória:** documentos em Markdown em pastas, com referências entre eles e visão em grafo; o
  coordenador escreve, os demais consultam.
- **Auditoria:** feed com autor, ação e horário; pausa de agentes; orçamento mensal por agente;
  aprovação de contratações (opcional).
- **Traga seus agentes:** o Hive não substitui Claude Code, Codex ou Cursor; ele os coordena.
- **Código aberto (MIT).**

## 5. Objeções e como responder

| Objeção | Resposta sustentável |
| --- | --- |
| "Mais uma ferramenta de IA?" | Ele não gera nada sozinho: organiza os agentes que você já usa. |
| "É seguro dar autonomia a agentes?" | Pausa a qualquer momento, orçamento por agente, aprovação opcional e registro de cada ação. Não prometer que erros deixam de acontecer. |
| "Quanto custa?" | O Hive é gratuito e de código aberto. Os modelos de IA são pagos ao provedor. |
| "É maduro?" | Beta aberto. Dizer isso com todas as letras. |
| "Meus dados saem da máquina?" | A telemetria anônima vem **ligada por padrão** e vai ao projeto original; desliga com `PAPERCLIP_TELEMETRY_DISABLED=1`. Dizer isso. |

## 6. Linguagem

- **Palavras a usar:** equipe de IA, agentes, memória, grafo, auditoria, coordenar, executar, revisar,
  instalar, comunidade.
- **Palavras a evitar:** revolucionário, poderoso, seamless, "o futuro de", "libere", "nunca mais",
  "100%", qualquer promessa absoluta; também "fila de espera" e "lista de espera" (não existem mais).
- **Termos do produto em inglês na interface** (a UI ainda está em inglês): Memory, Audit, Agents, Tasks.

## 7. Voz

- **Direta:** diz o que acontece, sem rodeio. *Não:* "soluções inovadoras de orquestração".
- **Humana:** fala com "você", frases curtas, sem jargão onde dá para evitar; explica o termo técnico
  quando ele é inevitável.
- **Honesta:** assume que é beta, mostra o limite, não infla.
- **Técnica sem ser fria:** guia de instalação e dúvidas soam como alguém que já passou pelo problema.
- **Em português do Brasil.** Sem travessão em título, subtítulo e botão.

## 8. Prova

- **Hoje:** código aberto no GitHub, licença MIT, beta aberto, comunidade no WhatsApp.
- **Depoimentos, clientes, números de uso:** nenhum ainda. A seção de prova social está pronta para
  receber cartões (`lib/social-proof.ts`). Não inventar.

## 9. Meta de conversão

- **Ação principal:** instalar o Hive (`/install`).
- **Ação secundária:** entrar na comunidade no WhatsApp; ver o código no GitHub.

## 10. Lacunas

- [ ] Razão social, CNPJ, endereço e e-mail do encarregado (LGPD): `lib/legal.ts`.
- [ ] Domínio definitivo (hoje `hive.dev.br` em `metadataBase`).
- [ ] Depoimentos reais e logos de quem usa.
- [ ] Relação exata com Oracle e FIAP (hoje só "Parceiros").
- [ ] Decisão sobre a telemetria padrão do produto (hoje ligada, envia ao projeto original).

## 11. Registro de mudanças

- 1.0 (2026-10-22): primeira versão, a partir do README do produto, do site e da página de instalação.

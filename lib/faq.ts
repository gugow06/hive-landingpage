/**
 * Perguntas frequentes da página inicial. É dado puro (texto, sem JSX) porque alimenta duas
 * coisas ao mesmo tempo: o que a pessoa lê (`components/sections.tsx`) e o JSON-LD `FAQPage`
 * que o Google recebe (`lib/seo.ts`). O texto precisa ser o mesmo nos dois lugares.
 */

export const FAQ: { q: string; a: string }[] = [
  {
    q: "O Hive substitui o Claude Code, o Codex ou o Cursor?",
    a: "Não. Eles continuam fazendo o trabalho, cada agente no executor que você escolher. O Hive cuida do que fica em volta: as tarefas, a hierarquia, a memória e o registro de tudo.",
  },
  {
    q: "É gratuito?",
    a: "Sim. O Hive é de código aberto (licença MIT) e não tem plano pago. Você paga só os modelos de IA que usar, direto ao provedor, seja por assinatura ou por API.",
  },
  {
    q: "Preciso saber programar para instalar?",
    a: "Você precisa abrir o terminal e colar alguns comandos. O guia de instalação mostra cada passo para Windows, macOS e Linux, e a comunidade ajuda quando algo trava.",
  },
  {
    q: "O que fica guardado na memória?",
    a: "Documentos em Markdown, organizados em pastas e ligados por [[referências]]. O agente que coordena registra decisões e resultados, e os outros consultam antes de agir. Você pode ler e editar tudo.",
  },
  {
    q: "Como eu controlo o que os agentes fazem?",
    a: "Cada agente tem um orçamento mensal e pode ser pausado a qualquer momento. Se você ativar, novos agentes só entram depois da sua aprovação. Tudo aparece no feed de atividades, com autor e horário.",
  },
  {
    q: "Meus dados saem da minha máquina?",
    a: "O Hive roda no seu computador ou no seu servidor, e as tarefas, os documentos e as chaves ficam lá. Nesta versão beta, ele também envia eventos técnicos de uso ao projeto original, que você desliga com uma variável de ambiente. O guia de instalação mostra como, e a política de privacidade explica o resto.",
  },
  {
    q: "O Hive já está pronto?",
    a: "Está em beta aberto: funciona, mas ainda muda depressa. Se encontrar algo errado, conte na comunidade do WhatsApp ou abra uma issue no GitHub.",
  },
];

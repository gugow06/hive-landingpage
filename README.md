# Site da Hive

Landing page da Hive — o time de IA da sua empresa, ordenado, contextualizado e sob controle.

Next.js 15 (App Router) · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · Three.js
· modo claro e escuro · pt-BR · WCAG 2.2 AA.

## Rodando

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm start
```

```bash
npm test        # node --test: grafo da memória, âncoras do menu, Hibees animados, vídeo…
```

Os testes não têm dependências (usam o `node --test`, Node ≥ 22.18). Cobrem o que
a página promete e que quebra em silêncio: ligações do grafo, links do menu sem
alvo, Hibees sem animação, texto com promessa que o produto não sustenta e
espaço do vídeo.

> `dev` e `build` usam pastas diferentes (`.next-dev` e `.next`, em
> `next.config.mjs`), então dá para rodar um build com o dev no ar. Antes disso
> os dois escreviam em `.next` e o build apagava os chunks do dev, que passava a
> responder 500 (`MODULE_NOT_FOUND`).

## Seções

Ordem: Herói → Fluxo → Equipe e execução → Memória e grafo → Controle e
auditoria → Integrações → Depoimentos (só com dados reais) → FAQ → Inscrição →
Rodapé.

1. **Herói** (`hero.tsx`, `hero-video.tsx`) — uma faixa escura, recuada das
   bordas e de cantos arredondados, nos dois temas: título grande e leve, as
   duas chamadas e a interface do produto (o vídeo) emergindo de um degradê
   âmbar. Na primeira tela só o topo do vídeo aparece (`--peek`, em
   `hero.tsx`). A classe `dark` na faixa redeclara os tokens só ali dentro, e
   por isso o vídeo é sempre o corte escuro. A malha da colmeia
   (`hex-field.tsx`) fica discreta e some antes da base.
2. **Como o Hive trabalha** (`workflow.tsx`) — Tarefa → Equipe → Execução →
   Memória → Auditoria. A linha âmbar se preenche com a rolagem (`scrub`) e
   acende o passo da vez; abaixo de `lg` vira lista vertical. Nada prende a
   rolagem.
3. **Equipe e execução** (`team.tsx`) — quem coordena, executa e revisa, com os
   Hibees, ao lado do organograma do app (`org-chart.tsx`) montado para uma
   tarefa concreta. As ligações se desenham ao entrar na tela e, depois, um
   pulso desce por cada uma; agentes em execução ganham um anel pulsando.
4. **Memória e grafo** (`memory.tsx`) — grafo à esquerda, documento à direita.
   Clicar num nó (ou num link do texto) abre o documento e acende os vizinhos.
   Os documentos são os mesmos do vídeo (`lib/memory.ts`).
5. **Controle e auditoria** (`audit.tsx`) — o feed de atividades no formato do
   app (`AuditFeed.tsx`) e os controles que o produto tem: orçamento mensal,
   pausa, aprovação opcional de contratações.
6. **Integrações** (`connectors.tsx`) — seis em destaque ligadas ao Hive por
   conexões animadas (estáticas no celular) e o símbolo oficial da marca no
   centro (`hive-symbol-trim.png`, gerado por `build-logos.py`), os executores de agentes à parte e
   o catálogo inteiro atrás de um botão.
7. **FAQ**, **inscrição** e **rodapé**.

## Vídeo da demonstração

Sai do projeto `../hive-demo` (Remotion): a interface do app recriada a partir
do código do produto, com dados fictícios. Os originais ficam em
`images/videos/`; o site serve as cópias de `public/video/`:

| Arquivo | O quê |
| --- | --- |
| `hive-demo-dark.mp4` | 1750×984, 30 fps, 22 s, sem áudio, `+faststart` — o render de 1920×1080 recortado na janela do app (sem o fundo do quadro) |
| `hive-demo-dark-poster.webp` | capa (quadro de 9,8 s) |

Para trocar o vídeo, copie o novo render para `public/video/` com esses nomes e
gere a capa:

```bash
# recorta a janela do app (x=85, y=96, 1750×984) do render de 1920×1080
ffmpeg -i images/videos/hive-hero-loop.mp4 -vf "crop=1750:984:85:96" -c:v libx264 -crf 20 -pix_fmt yuv420p -an -movflags +faststart public/video/hive-demo-dark.mp4
ffmpeg -ss 9.8 -i public/video/hive-demo-dark.mp4 -frames:v 1 -vf scale=1600:-1 -c:v libwebp -quality 80 public/video/hive-demo-dark-poster.webp
```

Comportamento: autoplay mudo, em loop e `playsInline`, só enquanto estiver na
tela. Se o navegador negar o autoplay, fica na capa com o botão de reproduzir.
Com `prefers-reduced-motion` o vídeo nem é baixado: a capa fica parada até a
pessoa clicar. A capa é fundo CSS e o espaço está reservado por `aspect-ratio`.

## Os Hibees

Os mascotes **não são desenhos novos**: são os mesmos avatares que o produto
gera para cada agente, pela biblioteca ClipLab vendorizada em
`packages/shared/src/cliplab` do repositório do produto.

O site usa isso de duas formas:

| | Como | Onde |
| --- | --- | --- |
| **Vivo** | runtime 3D em Three.js, acompanha o cursor | só o Darnold, na seção "Equipe e execução" |
| **Estático** | SVG exportado sem DOM nem WebGL | os outros quatro, o fallback e o print |

**Um personagem vivo por vez.** É a regra do próprio produto, cujo
`ui/src/lib/agent-character-slot.ts` traz um slot global com o comentário *"The
app gets one live hero. Other placements retain their static image."*

Medido aqui, em headless com renderização por software:

| | fps | pior quadro |
| --- | --- | --- |
| cinco vivos | 49 | 83 ms |
| só o Darnold | 155 | 17 ms |
| rolando pela seção | 141 | 40 ms |

Os outros quatro usam o SVG estático com a flutuação `.bob` em CSS, defasada
por personagem — lê como vida e não custa quadro, e pausa fora da tela.

**Rosto animado.** `scripts/animate-hibees.mjs` embute em cada SVG um `<style>`
que faz os olhos piscarem e olharem de lado e a boca se mexer, com tempos
diferentes por arquivo para não piscarem em uníssono. Segue sendo um `<img>`:
sem JS e sem WebGL, e desliga com `prefers-reduced-motion`. `npm run hibees`
já roda os dois passos; se regenerar os SVGs à mão, rode também
`node scripts/animate-hibees.mjs`.

O site também baixa o `pixelRatio` do runtime de 2× o `devicePixelRatio` para
1,5 (veja o ajuste documentado em `scripts/sync-cliplab.mjs`): 2× faz sentido
num app com um personagem por vez e numa página inteira é desperdício.

O runtime só acende o personagem quando ele entra na viewport. Com
`prefers-reduced-motion` nenhum acende e todos caem no SVG.

```bash
npm run hibees        # exporta os SVGs para public/hibees/
npm run sync:cliplab  # copia o runtime 3D para lib/cliplab/
```

Os dois leem `../hive/packages/shared/dist/...` — defina `HIVE_REPO` se o
checkout do produto estiver em outro lugar, e garanta que `packages/shared`
esteja compilado. `lib/cliplab/` é gerado: não edite à mão.

O Hibee vivo cai no SVG estático sozinho quando o runtime não pode rodar —
`prefers-reduced-motion`, WebGL indisponível ou perda de contexto. É o mesmo
fallback do app.

Papéis e paletas (tokens `cap-v1` do produto):

| Hibee | Paleta | Papel |
| --- | --- | --- |
| `rainha` | `golden-hour` | o Agente no topo da colmeia |
| `arquiteta` | `tangerine-cobalt` | CTO |
| `operaria` | `solar-flare` | dev front-end |
| `escriba` | `electric-grove` | dev back-end |
| `guardia` | `arctic-blue` | QA |

A pose `thinking` desenha um "?" sobre a cabeça — use só onde a dúvida for
proposital.

## Prints do produto

As imagens em `public/app/` **não são mock**: saem do Hive rodando. Para
regerá-las, suba o produto e capture as telas:

```bash
cd ../hive && pnpm dev          # Postgres embutido, sem configurar nada
```

O servidor sobe em `:3100` e a UI roteia por prefixo da empresa — `/<PREFIXO>/org`,
`/<PREFIXO>/memory`. A empresa usada nos prints é a **Encurtador** (`ENC`), com
Darnold, Íris, Nico, Rubi e Vera — os mesmos nomes do organograma do site. Cada
print mostra exatamente o que a seção ao lado afirma.

A página atual não exibe esses prints — o organograma é desenhado pelo port do
layout do app e a memória pelo grafo interativo —, mas eles continuam sendo a
referência para conferir que os dois batem com o produto.

Cada tela é capturada **nos dois temas** (`paperclip.theme` no localStorage do
app) e salva como `<tela>-light.png` e `<tela>-dark.png`. O componente `Shot`
põe as duas no HTML e deixa o CSS escolher, para o print acompanhar o tema da
página sem esperar o JS nem piscar o tema errado na carga.

## Conexões

A lista não é escrita à mão: sai de `packages/shared/src/app-definitions/` do
produto, o mesmo catálogo que monta a tela de Connectors no app.

```bash
npm run connectors
```

Gera `lib/connectors.ts` e copia os SVGs das marcas para `public/connectors/`.
Rode de novo quando o produto ganhar conectores novos.

A seção mostra seis em destaque (`FEATURED` em `components/connectors.tsx`) e
o resto atrás de um botão — os logos só são baixados quando a lista é aberta.
Os logos vão sobre plaquinha branca nos dois temas: boa parte das marcas é
desenhada em tinta escura, e assim um arquivo por marca basta.

Os **executores de agentes** (Claude Code, Codex, Cursor…) não são
integrações: são os adaptadores do produto, listados à parte com os rótulos de
`ui/src/adapters/adapter-display-registry.ts`.

## Prova social

`lib/social-proof.ts` tem duas listas **vazias de propósito**: `TESTIMONIALS` e
`CUSTOMERS`. As seções correspondentes não renderizam enquanto estiverem
vazias — depoimento inventado numa landing é propaganda enganosa, então não há
texto de exemplo que alguém possa confundir com cliente de verdade.

Para publicar, preencha as listas (a forma está documentada no arquivo) e ponha
as imagens em `public/social/`. A seção aparece sozinha.

## O organograma

`lib/org.ts` **porta o algoritmo de layout do app** (`ui/src/pages/OrgChart.tsx`):
mesmas constantes de card (200×100, gaps de 32 e 80), mesmo `subtreeWidth`/
`layoutTree`, mesmas arestas ortogonais, mesmas cores de ponto de status. O
desenho do site é o desenho do produto, não uma aproximação.

Mudar o time exibido é mexer só na constante `ORG`.

## Movimento

Uma linguagem só: revelação de baixo para cima (16 px, 0,6 s, `power2.out`),
disparada uma vez a 85% da tela. Os valores ficam em `MOTION` (`lib/motion.ts`)
e os equivalentes em CSS em `globals.css` (`--ease-out`, `--duration-*`).

- **Lenis** faz o scroll suave e alimenta o `ScrollTrigger` do GSAP.
- **GSAP** revela os blocos (`Rise`), desenha a linha do fluxo e as arestas do
  organograma por dash-offset — `DrawSVG` é plugin pago.
- **CSS** cuida do contínuo: a flutuação dos Hibees e o pulso das conexões das
  integrações. Os dois pausam fora da tela (`useOffscreenPause`).
- **Three.js** roda só o Hibee vivo, e só quando ele entra na viewport.
- Nenhuma seção prende a rolagem.

Com `prefers-reduced-motion: reduce` nada disso é instalado. O conteúdo nasce
visível no HTML e o GSAP só o esconde depois de assumir, então sem JS também não
fica nada invisível.

## Página de instalação (`/install`)

`app/install/page.tsx` + `components/install/`. Guia técnico, em português,
para Windows, macOS e Linux: requisitos, instalação local (pelo código-fonte: `git clone`,
`pnpm install`, `pnpm dev`), Docker, primeiros passos, manutenção e problemas comuns.
Por enquanto o Hive só se instala pelo código-fonte: o pacote npm `hive-agents` ainda não
existe, então a página não deve citá-lo até ele ser publicado. A rota antiga `/instalacao`
redireciona (308) para `/install` (`next.config.mjs`).

O Windows roda direto no PowerShell: o WSL2 é opcional, e o FAQ da página explica quando
vale a pena.

- **Abas de sistema** (`os-tabs.tsx`): detectam o sistema pelo navegador e a
  escolha vale para a página inteira (e pela sessão). Teclado: setas, Home e End.
- **Blocos de comando** (`code-block.tsx`): sempre escuros, com botão de copiar
  que entrega os comandos **sem** o `$` e sem os comentários.
- **Índice lateral** (`toc.tsx`) destaca a seção da vez.
- **Navbar:** a lista de links tem seções da inicial (`id`) e páginas (`page`).
  Dentro da inicial a âncora é `#id`; em outras páginas vira `/#id`. Âncoras são
  `<a>` comuns (não `Link`), para o `SmoothScroll` rolar sem escrever `#` na URL.
- **Conteúdo.** Os comandos, requisitos (Node 24.11+; pnpm 9+ só pelo código-fonte) e a porta 3100 vêm
  do repositório do produto (`docs/start/quickstart.md`, `package.json`,
  `docs/deploy/docker.md`). Se mudarem lá, mude aqui — o teste da página confere
  o que dá para conferir.
- **Pendências conhecidas** (também sinalizadas na própria página): a imagem Docker
  ainda não compila de ponta a ponta (a verificação `Generated contract drift:
  generated/capability/capabilities.yaml` falha) e o primeiro acesso no modo
  autenticado do Docker ainda não foi verificado.

## Botão "flow"

`components/ui/flow-button.tsx` — o botão da barra de navegação e do menu do
celular. Em repouso é uma pílula contornada; no hover um círculo **âmbar**
(`#ffb800`) cresce do centro e engole o botão, que vira um retângulo de cantos
suaves, enquanto uma seta sai pela direita e outra entra pela esquerda.

Portado do componente do 21st.dev com duas adaptações: o preenchimento do hover
é o âmbar da marca (por isso texto e setas ficam **escuros** no hover — branco
sobre âmbar não passa no contraste) e as cores de repouso viram tokens do tema
(`ink`), para funcionar sobre a navbar clara e a escura. O foco do teclado dispara o mesmo
efeito do mouse e `prefers-reduced-motion` corta as transições.

## Botão "shiny"

`components/ui/shiny-button.tsx` + o bloco `.shiny-cta` em `app/globals.css`.
Portado do botão do 21st.dev, com o azul trocado pelo âmbar da marca
(`--shiny-cta-highlight`). Um feixe de luz percorre a borda, pontinhos aparecem
perto dele e, no hover ou no foco, o feixe se alarga e um halo respira por
dentro.

- Usado só no CTA do herói. A barra de navegação e o menu do celular usam o
  `FlowButton` (abaixo); o botão de enviar do formulário continua o âmbar
  sólido do `.btn-primary`. Os tamanhos `md` e `sm` seguem disponíveis.
- Aceita `href` (vira `<a>`) ou `onClick` (vira `<button>`); o `<span>` interno
  é obrigatório — o halo é o `::before` dele.
- A fonte é a da página (o original importava o Inter do Google Fonts) e a
  animação **para fora da tela** (`useOffscreenPause`) e com
  `prefers-reduced-motion`.
- O `@property` fica fora das camadas do CSS; sem suporte, o feixe fica parado.
- O halo âmbar aciona a regra `dark-glow` do Impeccable. É a assinatura do
  botão, então a regra está ignorada só nas varreduras em `localhost`
  (`.impeccable/config.json`).

## Bordas de vidro

O acabamento de borda vem do `vidro.css` do painel do produto, traduzido para
os tokens do Hive (`app/globals.css`). A borda é só `box-shadow`: filetes de
luz de 1px por dentro (o de cima é o mais forte), um anel fino por fora no
claro e, no escuro, um brilho interno que sobe e desce.

| Token | Onde |
| --- | --- |
| `--ring` | borda completa — `.card`, `.frame`, `.frame-md` e a faixa do herói (`.hero-band`, num `::after`, sempre com o brilho do tema escuro) |
| `--ring-soft` | versão curta, só filetes — `.chip` e tiles das integrações |
| `.glass` | placa translúcida com desfoque, **sem borda** — navbar ao rolar e menu do celular |

O vídeo do herói e a navbar não levam borda.

Regra herdada do painel: só o que fica **por cima** do conteúdo é vidro de
verdade; os cartões da página continuam sólidos e só ganham a borda. Os campos
de formulário não mudam — o contorno deles (`--field-border`) precisa de 3:1.

Não escreva `-webkit-backdrop-filter` junto do `backdrop-filter`: o compilador
do CSS gera os dois sozinho e, escritos juntos, ele descartava o sem prefixo.

## Acessibilidade

Auditado nos dois temas com um script próprio (contraste calculado a partir do
`getComputedStyle`, convertendo o `oklab()` que o Tailwind v4 emite):

- **1.4.3** — os dois temas passam AA. No claro, o âmbar de **texto** é
  `#8a5d00` (5,8:1 sobre branco) e o de títulos `#946300` (5,2:1); como
  **preenchimento** (botões, pontos, traços) continua o `#FFB800`, onde o
  contraste é com o `#171717` por cima.
- **2.5.8** — nenhum alvo abaixo de 24×24 px.
- **2.4.1 / 2.4.3** — link de pular para o conteúdo, foco visível, foco
  acompanha a âncora, `Esc` fecha o menu e devolve o foco ao botão.
- **2.4.11** — âncoras param 80 px abaixo do topo, livres da navbar fixa (72 px).
- **1.1.1** — Hibees decorativos são `aria-hidden`; os vivos têm rótulo.
- No grafo da memória, os nós fora da seleção usam `--ink-faint` em vez de
  opacidade: texto a 55% cairia abaixo do AA.
- O rodapé tem `background-color` sólido sob o gradiente: é fallback de verdade
  e dá ao auditor uma cor de referência para medir o contraste.

## Comunidade e prova social

A seção `#comunidade` (`components/community.tsx`) mostra os depoimentos de
`lib/social-proof.ts` quando houver. Enquanto as listas estiverem vazias, ela
mostra um convite para o grupo do WhatsApp e o link do GitHub. Não há lista de
espera: o CTA da navbar e do hero leva direto a `/install`.

O botão do WhatsApp na navbar (`components/whatsapp-button.tsx`) substituiu o
seletor de tema. O tema padrão continua claro. O link do grupo está em
`WHATSAPP_URL`.

## Rodapé

`components/footer.tsx`: faixa escura com a borda glass (`.glass-band`), colunas
de Produto, Instalar, Comunidade e Legal, e os parceiros (Oracle e FIAP) com
logos pequenos. As âncoras se adaptam à página (`#id` na home, `/#id` fora dela).

## Páginas legais e LGPD

| Rota | Conteúdo |
| --- | --- |
| `/privacidade` | Política de privacidade (inclui a telemetria do aplicativo, ligada por padrão) |
| `/termos` | Termos de serviço |
| `/cookies` | Política de cookies (o aviso grava `hive-cookie-notice`) |
| `/lgpd` | Formulários do titular e do encarregado |

Os dados do controlador ficam em `lib/legal.ts`. Enquanto estiverem como
`[a definir]`, as páginas mostram o campo destacado e o teste "legal: dados do
controlador" aparece como `todo`. Preencha nome, CNPJ, endereço, encarregado
(DPO), foro e hospedagem, e peça uma revisão jurídica antes de publicar.

`POST /api/lgpd` valida o pedido, gera o protocolo `HV-AAAAMMDD-XXXXXX` e o
encaminha para `LGPD_WEBHOOK_URL`. Em produção, sem a variável, responde 503
em vez de fingir que recebeu. Os logs nunca levam nome, e-mail nem mensagem.

```bash
# .env.local
LGPD_WEBHOOK_URL=https://...
```

## SEO

- `lib/seo.ts`: `SITE_URL`, a lista `PAGES` (sitemap) e o JSON-LD
  (Organization, WebSite, SoftwareApplication, FAQPage, TechArticle). Sem
  avaliação nem número de usuários: ainda não há dado real.
- `app/sitemap.ts`, `app/robots.ts` e `public/llms.txt`.
- `npm run build:og` (`scripts/build-og-image.mjs`) regenera
  `app/opengraph-image.png` e `app/twitter-image.png` com o título atual. Precisa
  do Playwright (`PLAYWRIGHT_PATH`, `CHROMIUM_PATH`).
- As skills de marketing ficam em `.claude/skills/` e o contexto do produto em
  `.agents/product-marketing.md`.

## Marca

Tokens em `app/globals.css`. Paleta e tipografia vêm da apresentação de
identidade visual: `#FFB800` destaque, `#171717` background, `#262626` cards,
`#FFFFFF` texto. Montserrat display, Inter interface.

A textura de favo (`.comb`) é um tile SVG de hexágonos âmbar — controle a
intensidade pela opacidade.

`images/` é a pasta onde você larga o que sai do Canva, com o nome que vier.
Dois comandos consomem essa pasta:

```bash
npm run sync:brand                 # copia tudo para public/brand/ com nomes normalizados
python scripts/build-logos.py      # recorta a margem transparente e gera o que o site usa
```

O segundo gera `public/brand/hive-wordmark.png` (o lettering da navbar),
`public/brand/hive-symbol-trim.png` (o símbolo, no hub das integrações) e
`app/icon.svg` (o favicon, derivado de `images/logo-hive-favicon.svg` com o
`viewBox` recortado no logo). Os originais vêm em 2000×2000 com muita margem
vazia: sem recortar, a logo fica minúscula dentro da própria caixa. Precisa de
Pillow (`pip install pillow`).


## Antes de publicar

- O domínio é `hiveagents.com.br`, definido em `SITE_URL` (`lib/seo.ts`). Ele é a base das
  URLs de Open Graph, do sitemap e do JSON-LD. Se mudar, troque também `public/llms.txt`.
- O e-mail `contato@hiveagents.com.br` aparece no FAQ e nas páginas legais.
- Preencha `lib/legal.ts` e defina `LGPD_WEBHOOK_URL`.
- `app/opengraph-image.png` é a imagem de compartilhamento (1200×630).

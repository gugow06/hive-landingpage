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

> Não rode `npm run build` com o `dev` no ar: os dois escrevem em `.next` e o
> dev server passa a servir chunks que não existem mais.

## Seções

1. **Herói** — ocupa a viewport menos a navbar (`100svh - 88px`), com a
   estrutura e a navbar portadas do AbacatePay. No plano de trás, a malha da
   colmeia em canvas percorrida por poucas partículas âmbar de cauda longa
   (`components/hex-field.tsx`): elas andam pelas arestas do próprio favo e
   sorteiam o caminho a cada vértice, então cada uma faz um trajeto diferente.
   O halo passa por cima e integra o reticulado ao fundo.

   Cor e opacidade da malha vêm de `--hex-line` / `--hex-alpha`: no claro é um
   cinza `#c1c1c1` com peso, porque o âmbar sumia no branco; no escuro é o
   âmbar bem discreto, que no mesmo valor viraria uma grade gritante.

   A malha é projetada como se estivesse colada na face **interna** de um
   cilindro: o centro é o ponto mais distante e as bordas vêm na direção de
   quem olha, então ali ela abre e estica em vez de comprimir. A distorção é
   aplicada nos **nós**, não no desenho: assim as partículas, que andam pelas
   arestas, curvam junto em vez de descolar da malha. Uma vinheta elíptica
   apaga as pontas — só da malha, para as partículas manterem o brilho inteiro
   por onde passarem.

   O comprimento da cauda é velocidade × quadros guardados — aumentar só o
   número de pontos não alonga nada se a partícula anda devagar.

   30px separam o herói da próxima seção.
2. **Os Hibees** — o organograma se monta ao redor de Darnold conforme a
   página desce, via ScrollTrigger com `scrub`. Os **cinco** agentes rodam o
   runtime 3D.

   Darnold começa cinza e dormindo e ganha cor com o scroll, como se o primeiro
   agente tivesse acabado de ser configurado. São dois bonecos empilhados — o
   cinza (`muted`, pose `sleepy`) embaixo, o colorido acordado por cima — e a
   cor chega pela opacidade. É a mesma técnica do onboarding do app
   (`ui/src/components/onboarding/OnboardingCharacter.tsx`), que desenha o
   agente apagado até a configuração passar; a troca seca de paleta cortaria o
   movimento no meio. O cinza só some no fim, porque o "z" de quem dorme fica
   fora da silhueta do acordado. O título é datilografado ao entrar em cena, e o palco se encolhe
   para caber em telas baixas — a hierarquia inteira é o que a seção tem a dizer.
3. **Por que funciona** — os quatro cards de 280×262 do AbacatePay, aqui depois
   do organograma: primeiro você vê a colmeia montar, depois por que importa.
4. **Como funciona** — linha do tempo horizontal; o trilho se preenche com o
   scroll e o marco da vez muda de cor. Vira pilha vertical abaixo de `md`.
5. **Conexões** — carrossel dos conectores que o produto já fala.
6. **Depoimentos** e **clientes** — só aparecem quando houver dados reais
   (veja abaixo). As demais seções seguem a apresentação de identidade.

## Os Hibees

Os mascotes **não são desenhos novos**: são os mesmos avatares que o produto
gera para cada agente, pela biblioteca ClipLab vendorizada em
`packages/shared/src/cliplab` do repositório do produto.

O site usa isso de duas formas:

| | Como | Onde |
| --- | --- | --- |
| **Vivo** | runtime 3D em Three.js, acompanha o cursor | só o Darnold, na seção "Os Hibees" |
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
por personagem — lê como vida e não custa quadro. Para voltar aos cinco vivos,
troque o `<img>` por `<LiveHibee>` em `components/agents.tsx`.

O site também baixa o `pixelRatio` do runtime de 2× o `devicePixelRatio` para
1,5 (veja o ajuste documentado em `scripts/sync-cliplab.mjs`): 2× faz sentido
num app com um personagem por vez e numa página inteira é desperdício.

O runtime só acende o personagem quando ele entra na viewport e devolve o
contexto ao sair, e o Darnold cinza é desmontado depois de acordar. Com
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

Os cards têm medida fixa (140×140) para o nome de duas linhas não desalinhar o
logo em relação aos vizinhos. No modo escuro o logo vai sobre uma plaquinha
branca: boa parte das marcas é desenhada em tinta escura e nem todas têm
variante clara no catálogo — sem a plaquinha, algumas sumiam no fundo.

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

- **Lenis** faz o scroll suave e alimenta o `ScrollTrigger` do GSAP, para as
  revelações dispararem no deslocamento interpolado.
- **GSAP** revela as seções (`Rise`) e desenha as arestas do organograma por
  dash-offset — `DrawSVG` é plugin pago, então o traço é medido no próprio path.
- **Three.js** roda só o Hibee vivo, e só quando ele entra na viewport: nada de
  contexto WebGL fora de tela.

Com `prefers-reduced-motion: reduce` nada disso é instalado. O conteúdo nasce
visível no HTML e o GSAP só o esconde depois de assumir, então sem JS também não
fica nada invisível.

GSAP, Lenis e Three entram por `import()` dinâmico — não pesam no bundle inicial.

## Acessibilidade

Auditado nos dois temas com um script próprio (contraste calculado a partir do
`getComputedStyle`, convertendo o `oklab()` que o Tailwind v4 emite):

- **1.4.3** — o modo escuro passa AA inteiro. O **modo claro não**: por decisão
  de identidade o âmbar foi padronizado em `#FFB800` em todo o site, e sobre
  branco ele dá **1,7:1**, abaixo do mínimo de 4,5:1 (3:1 para texto grande).
  São 23 elementos: eyebrows e os trechos destacados dos títulos.

  Os valores que passavam estão comentados ao lado dos tokens em
  `app/globals.css` (`--accent`, `--accent-display`, `--panel-accent`) — trocar
  os três resolve, ao custo de um âmbar mais escuro no claro. Como
  **preenchimento** (botões, pontos, estrelas) o `#FFB800` nunca foi problema:
  ali o contraste é com o `#171717` por cima.
- **2.5.8** — nenhum alvo abaixo de 24×24 px.
- **2.4.1 / 2.4.3** — link de pular para o conteúdo, foco visível, foco
  acompanha a âncora, `Esc` fecha o menu e devolve o foco ao botão.
- **2.4.11** — âncoras param 96 px abaixo do topo, livres da navbar fixa.
- **1.1.1** — Hibees decorativos são `aria-hidden`; os vivos têm rótulo.
- Na linha do tempo, o marco da vez se destaca **pela cor do título**, não por
  apagar os outros: texto a 55% de opacidade cai abaixo do AA, e o auditor não
  enxerga opacidade herdada — esse é um buraco que só a conta pega.
- O rodapé tem `background-color` sólido sob o gradiente: é fallback de verdade
  e dá ao auditor uma cor de referência para medir o contraste.

## Lista de espera

O formulário posta em `POST /api/lista`. A rota valida o e-mail e, se
`WAITLIST_WEBHOOK_URL` estiver definida, encaminha a inscrição:

```bash
# .env.local
WAITLIST_WEBHOOK_URL=https://...
```

Sem a variável, a inscrição só é escrita no log do servidor — o site roda em
desenvolvimento sem depender de serviço nenhum.

## Rodapé

Base bem clara com o âmbar forte (`#FFB800`) subindo pelo gradiente da borda
de baixo, como o brilho radial do diferencial entra pelo canto. Por cima, a
mesma malha hexagonal do diferencial em marrom claro translúcido
(`.comb-brown`). É bloco de marca: não troca com o tema.

Informação à esquerda (fork, copyright, GitHub), parceiros à direita. Os logos
dos parceiros entram em `images/parceiros/`; `npm run sync:brand` publica e
`python scripts/build-logos.py` recorta a margem transparente — sem arquivo, o
nome aparece como texto. Não tem CTA: o formulário está logo acima.

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

O segundo gera `public/brand/hive-wordmark.png` (o lettering da navbar) e
`app/icon.png` (o ícone da aba). Os originais vêm em 2000×2000 com muita margem
vazia: sem recortar, a logo fica minúscula dentro da própria caixa. Precisa de
Pillow (`pip install pillow`).

O hexágono também existe como componente (`HiveMark`) para herdar
`currentColor` onde um SVG for melhor que o PNG.

## Antes de publicar

- `metadataBase` em `app/layout.tsx` está em `https://hive.dev.br` — troque pelo
  domínio real; ele é a base das URLs de Open Graph.
- O e-mail `contato@hive.dev.br` aparece na seção de FAQ.
- `app/opengraph-image.png` é a imagem de compartilhamento (1200×630).

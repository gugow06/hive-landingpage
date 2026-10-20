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
   estrutura e a navbar portadas do AbacatePay: coluna de 1018px centrada e
   translúcida, halo de cor na base. 30px separam o herói da próxima seção.
2. **Os agentes** — o organograma se monta ao redor de Darnold conforme a
   página desce, via ScrollTrigger com `scrub`. Os **cinco** agentes rodam o
   runtime 3D. O título é datilografado ao entrar em cena, e o palco se encolhe
   para caber em telas baixas — a hierarquia inteira é o que a seção tem a dizer.
3. **Por que funciona** — os quatro cards de 280×262 do AbacatePay, aqui depois
   do organograma: primeiro você vê a colmeia montar, depois por que importa.
4. **Como funciona** — linha do tempo horizontal; o trilho se preenche com o
   scroll e o marco da vez muda de cor. Vira pilha vertical abaixo de `md`.
5. As demais seções seguem o conteúdo da apresentação de identidade.

## Os Hibees

Os mascotes **não são desenhos novos**: são os mesmos avatares que o produto
gera para cada agente, pela biblioteca ClipLab vendorizada em
`packages/shared/src/cliplab` do repositório do produto.

O site usa isso de duas formas:

| | Como | Onde |
| --- | --- | --- |
| **Vivo** | runtime 3D em Three.js, acompanha o cursor | os cinco agentes da seção "Os agentes" |
| **Estático** | SVG exportado sem DOM nem WebGL | fallback, e o print do produto |

São cinco contextos WebGL na mesma tela. O runtime só acende o personagem
quando ele entra na viewport e devolve o contexto ao sair; medido em headless
com renderização por software, os cinco juntos ficam em ~53 fps, sem perda de
contexto. Com `prefers-reduced-motion` nenhum acende e todos caem no SVG.

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

- **1.4.3 / 1.4.11** — todo texto passa AA nos dois temas. `#FFB800` puro só
  alcança 1,7:1 sobre branco, então no claro o âmbar **de texto** escurece:
  `--accent` (5,5:1) para texto miúdo e `--accent-display` (3,6:1) só em títulos
  grandes, onde AA pede 3:1. Como **preenchimento** (botões, pontos, barras) o
  âmbar da marca continua, porque ali o contraste é com o `#171717` por cima.
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

Ouro da marca (`#FFB800`) descendo para amarelo claro, com um favo
**manuscrito** por cima — gerado por `npm run comb`, que desenha cada aresta do
hexágono como curva com os pontos de controle deslocados e traça duas vezes com
espessuras diferentes (o truque do Rough.js, feito à mão para não puxar a
biblioteca). O ruído tem seed fixo, então o SVG versionado não muda a cada
execução. Ele entra como `mask-image`, e a cor sai do `background-color`.

É bloco de marca: não troca com o tema.

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

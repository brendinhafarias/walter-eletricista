# Walter Eletricista — Landing Page

Landing page estática (uma página) para **Walter, eletricista profissional em Nova Friburgo e Região — RJ**.

- HTML5 semântico + **Tailwind CSS** (via CLI/PostCSS, **não** CDN)
- Build de produção com CSS **purgado e minificado**
- JS vanilla mínimo (menu mobile, tema claro/escuro, depoimentos, ano do rodapé)
- Modo **claro/escuro** com toggle no header (respeita o sistema e lembra a escolha)
- Foco em carregar rápido no 4G

## Estrutura

```
.
├── src/                 # Fonte
│   ├── index.html
│   ├── css/main.css     # entrada do Tailwind + tokens de tema (@tailwind ...)
│   └── js/main.js
├── assets/images/       # logo, favicon, fotos dos serviços e imagens de SEO
├── dist/                # build final (gerado — não editar à mão)
├── scripts/
│   ├── copy.js          # copia HTML/JS/assets para /dist (sem dependências)
│   └── images.js        # gera .webp otimizado das fotos (usa "sharp")
├── tailwind.config.js   # paleta, fontes, tokens de tema e purge
└── postcss.config.js
```

## Como usar

```bash
npm install       # instala as dependências (só dev)
npm run dev       # servidor local com live reload em http://localhost:3000
npm run build     # gera o /dist final (CSS minificado + purgado)
npm run images    # gera os .webp otimizados a partir das fotos (rode ao trocar uma foto)
```

Para publicar, suba **apenas o conteúdo da pasta `dist/`** para a hospedagem —
ou conecte o repositório a um host que roda `npm run build` (ver **DEPLOY.md**).

## Galeria de fotos (carrossel)

A seção **Galeria** (`#galeria` em `src/index.html`) é um carrossel com scroll horizontal
nativo (arrastar/swipe + setas, sem biblioteca de JS) e tem **13 fotos reais**:
`assets/images/servico-1.jpg` até `servico-13.jpg`. As fotos são exibidas em proporção
retrato (3:4), que é o formato da maioria das fotos de celular.

**Para trocar uma foto:**

1. Salve a nova foto em `assets/images/`, usando **exatamente o mesmo nome** que ela vai
   substituir (ex.: `servico-3.jpg` — pode sobrescrever a que já existe).
2. Rode `npm run images` — isso gera a versão `.webp` otimizada (mais leve, carrega mais
   rápido; o `.jpg` fica como reserva para navegadores antigos) e redimensiona para no
   máximo 1600px no lado maior.
3. Em `src/index.html`, na seção `<!-- 5) GALERIA -->`, ajuste o `alt="..."` e o
   `aria-label="..."` do bloco `<a>` correspondente pra descrever a foto certa.
4. Rode `npm run dev` para ver o resultado, ou `npm run build` para gerar o site final.

**Para adicionar mais fotos** (além das 13): duplique um bloco `<a href="assets/images/servico-1.jpg">...</a>`
inteiro dentro da `<div id="galeria-track">`, troque `servico-1` pelo novo nome
(ex.: `servico-14.jpg`) em todos os lugares dentro do bloco, atualize o "(N de 13)" de
**todos** os slides pro novo total, salve a foto com esse nome em `assets/images/`,
adicione o nome no array `SOURCES` de `scripts/images.js`, e rode `npm run images` de novo.

O mesmo vale para a foto de cliente nos **depoimentos** (`assets/images/cliente-1.jpg`,
editável no array `DEPOIMENTOS` em `src/js/main.js`) — hoje é um avatar genérico provisório.

As fotos originais (não otimizadas) ficam em `fotos-originais/` na raiz do projeto —
essa pasta não é usada pelo site nem entra no build, é só arquivo de referência.

## SEO

- Meta tags, canonical, Open Graph, Twitter Card e favicons completos no `<head>`.
- Dados estruturados **JSON-LD** (`schema.org/Electrician`) — sem endereço fixo (atendimento
  no local do cliente), com telefone, e-mail e área de atendimento.
- `robots.txt`, `sitemap.xml` e `site.webmanifest` na raiz (copiados para `/dist` no build).
- **Pendências fora do código** (domínio, Google Business Profile, Search Console, og:image
  definitivo) estão listadas em um comentário no topo de `src/index.html`.

## O que você ainda pode trocar

| Onde | O quê |
|------|-------|
| `assets/images/cliente-1.jpg` | Foto do cliente no depoimento — hoje é um avatar genérico provisório |
| `src/index.html` | Texto da seção "Sobre" — procure `[TEXTO SOBRE O WALTER — SUBSTITUIR]` |
| `assets/images/logo.svg` | **Logo provisório** (wordmark). Substitua pelo logo definitivo quando tiver |
| `assets/images/favicon.svg` | Ícone da aba do navegador |
| `src/index.html` | og:image definitivo (1200×630) — o atual é um placeholder |

## Tema claro/escuro

As cores que mudam entre os temas são variáveis CSS definidas em `src/css/main.css`
(`:root` = escuro, `:root[data-theme="light"]` = claro) e viram classes Tailwind como
`bg-page`, `text-ink`, `text-muted`, `border-line`, `text-accent-ink` etc. — use essas
classes (em vez de `graphite-*`/`slate-*`/`white` fixos) em qualquer novo trecho de HTML
para que ele também se adapte ao tema automaticamente.

## Design

- Fundo grafite `#1A1D23` + amarelo elétrico `#F5C518` (definidos em `tailwind.config.js`)
- Tipografia: **Sora** (títulos) + **Inter** (corpo), via Google Fonts
- Motivo sutil de "circuito" em divisores e fundos (`.circuit-divider`, `.circuit-dots`)

# Como publicar o site (grátis) e configurar o domínio

O projeto tem uma etapa de build (Tailwind gera o CSS). Por isso o ideal é um host
que rode `npm run build` sozinho e publique a pasta `dist/`. As opções gratuitas
recomendadas são **Netlify** ou **Cloudflare Pages** (ambas conectam direto ao GitHub).

Abaixo, o passo a passo com **Netlify** (mais simples para começar).

---

## Parte 1 — Subir o código para o GitHub

1. Crie uma conta em <https://github.com> (se ainda não tiver).
2. Instale o Git: <https://git-scm.com/download/win>.
3. No terminal, dentro da pasta do projeto:

   ```bash
   git init
   git add .
   git commit -m "Site do Walter Eletricista"
   ```

4. No GitHub, clique em **New repository**, dê um nome (ex.: `walter-eletricista`),
   deixe **público** ou privado, e **não** marque "Add README".
5. Copie os comandos que o GitHub mostra em "…or push an existing repository" e cole
   no terminal. Fica parecido com:

   ```bash
   git remote add origin https://github.com/SEU_USUARIO/walter-eletricista.git
   git branch -M main
   git push -u origin main
   ```

> O `.gitignore` já ignora `node_modules/` e `dist/` — isso é o esperado: o host
> vai gerar o `dist/` no servidor.

---

## Parte 2 — Publicar na Netlify (build automático)

1. Crie conta em <https://app.netlify.com> usando **"Sign up with GitHub"**.
2. Clique em **Add new site → Import an existing project → GitHub** e autorize.
3. Escolha o repositório `walter-eletricista`.
4. Em **Build settings**, preencha:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Clique em **Deploy site**. Em ~1 minuto o site fica no ar num endereço tipo
   `https://nome-aleatorio.netlify.app`.
6. Toda vez que você fizer `git push`, a Netlify **rebuilda e republica sozinha**.

> Opcional: para não digitar as configurações a cada vez, o repositório pode ter um
> arquivo `netlify.toml`. Peça que eu gere se quiser (não é obrigatório).

### Alternativa: Cloudflare Pages
Mesma ideia, em <https://pages.cloudflare.com>:
- Framework preset: **None**
- Build command: `npm run build`
- Output directory: `dist`

### Alternativa: GitHub Pages
O GitHub Pages não roda `npm run build` sozinho — precisa de um workflow do GitHub
Actions para buildar e publicar o `dist/`. Dá mais trabalho que Netlify/Cloudflare.
Se preferir esse caminho, peça que eu gere o arquivo `.github/workflows/deploy.yml`.

---

## Parte 3 — Configurar um domínio próprio (depois de comprado)

Você compra o domínio (ex.: `waltereletricista.com.br`) num registrador
(Registro.br para `.com.br`, ou GoDaddy/Namecheap/Hostinger para `.com`).

### Na Netlify
1. No painel do site: **Domain management → Add a domain**.
2. Digite `waltereletricista.com.br` e confirme.
3. A Netlify mostra os **registros DNS** que você precisa cadastrar no registrador.
   Normalmente:
   - Um registro **A** do domínio raiz apontando para o IP da Netlify
     (`75.2.60.5`), **ou** um registro **ALIAS/ANAME** para `apex-loadbalancer.netlify.com`.
   - Um registro **CNAME** de `www` apontando para `SEU-SITE.netlify.app`.
4. No painel do registrador (ex.: Registro.br → **Editar Zona / DNS**), cadastre
   exatamente esses registros.
5. Volte na Netlify e deixe ela provisionar o **HTTPS/SSL** (botão "Verify DNS
   configuration" / certificado Let's Encrypt automático).
6. A propagação do DNS leva de alguns minutos até ~24h.

> Dica: escolha uma versão **canônica** — recomendo `www.` como principal e o domínio
> raiz redirecionando para ele (a Netlify faz isso automático).

---

## Parte 4 — Ajustes finais no código após ter o domínio

Troque o placeholder `https://www.waltereletricista.com.br` pelo domínio real em:

- `src/index.html` → `<link rel="canonical">`, `og:url`, `twitter:image`, e no JSON-LD
- `robots.txt` → linha `Sitemap:`
- `sitemap.xml` → `<loc>`
- `site.webmanifest` (se usar caminhos absolutos)

Depois faça `git add . && git commit -m "Ajusta domínio" && git push` — o host republica.

### E fora do código (importante para aparecer no Google)
1. **Google Business Profile** (Perfil da Empresa) — cadastre o negócio; é o que mais
   faz aparecer no mapa e nas buscas locais ("eletricista em Nova Friburgo").
2. **Google Search Console** <https://search.google.com/search-console> — verifique a
   propriedade do domínio e **envie o `sitemap.xml`** (`.../sitemap.xml`).
3. Gere o **og:image definitivo** (1200×630) e troque as fotos placeholder pelas reais
   (rodando `npm run images` depois).

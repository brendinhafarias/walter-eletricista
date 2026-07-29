'use strict';

/* Walter Eletricista — JS mínimo, sem dependências (carrega rápido no 4G).
   Responsabilidades: menu mobile, alternância de tema, depoimentos, ano do rodapé. */

/* =========================================================================
   DEPOIMENTOS
   [DEPOIMENTOS GENÉRICOS — SUBSTITUIR pelos depoimentos reais assim que
   tiver. Por enquanto estão sem foto de propósito (campo "foto" omitido);
   pra usar foto depois, adicione foto: 'assets/images/cliente-2.jpg', etc.]
   Adicione/edite itens neste array — os cards são gerados automaticamente.
   foto: caminho da imagem (opcional, pode omitir). estrelas: 1 a 5.
   ========================================================================= */
const DEPOIMENTOS = [
  {
    nome: 'Cliente satisfeito',
    local: 'Nova Friburgo - RJ',
    estrelas: 5,
    texto: 'Serviço rápido, limpo e caprichado. O Walter explicou tudo e deixou a instalação segura. Recomendo!',
  },
  {
    nome: 'Morador de condomínio',
    local: 'Nova Friburgo - RJ',
    estrelas: 5,
    texto: 'Contratamos para revisar o quadro de distribuição do prédio. Trabalho pontual, organizado e dentro da norma.',
  },
  {
    nome: 'Proprietário de comércio local',
    local: 'Nova Friburgo - RJ',
    estrelas: 5,
    texto: 'Instalação elétrica da loja ficou impecável. Preço justo e sem enrolação — fechou exatamente o que foi orçado.',
  },
  {
    nome: 'Síndico de prédio',
    local: 'Nova Friburgo - RJ',
    estrelas: 5,
    texto: 'Laudo técnico e medição feitos com atenção aos detalhes. Explicou cada ponto do relatório antes de fechar.',
  },
  {
    nome: 'Cliente da Região Serrana',
    local: 'Bom Jardim - RJ',
    estrelas: 4,
    texto: 'Bom atendimento e serviço bem executado na instalação industrial. Só demorou um pouco pra agendar, mas valeu a espera.',
  },
  {
    nome: 'Dono de sítio',
    local: 'Nova Friburgo - RJ',
    estrelas: 5,
    texto: 'Instalou a tomada com proteção para o carregador do meu carro elétrico. Rápido, seguro e explicou tudo direitinho.',
  },
  // { nome: '...', local: '...', estrelas: 5, texto: '...' }, // foto: 'assets/images/cliente-2.jpg' opcional
];

document.addEventListener('DOMContentLoaded', () => {
  /* ---------------------------------------------------------------------
     1) Menu mobile
  --------------------------------------------------------------------- */
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  if (toggle && menu) {
    const setMenu = (open) => {
      menu.classList.toggle('hidden', !open);
      iconOpen?.classList.toggle('hidden', open);
      iconClose?.classList.toggle('hidden', !open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };

    toggle.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) setMenu(false);
    });
  }

  /* ---------------------------------------------------------------------
     2) Tema claro/escuro
        O tema inicial já é aplicado por um script inline no <head> (evita
        flash de tema errado). Aqui só cuidamos do botão: alternar, salvar
        a escolha e manter os ícones/aria-label corretos.
  --------------------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const root = document.documentElement;

  const applyThemeUI = (theme) => {
    const isLight = theme === 'light';
    iconSun?.classList.toggle('hidden', isLight);
    iconMoon?.classList.toggle('hidden', !isLight);
    themeToggle?.setAttribute('aria-pressed', String(isLight));
    themeToggle?.setAttribute('aria-label', isLight ? 'Ativar modo escuro' : 'Ativar modo claro');
    if (metaThemeColor) metaThemeColor.setAttribute('content', isLight ? '#FAFAF9' : '#1A1D23');
  };

  // Sincroniza os ícones com o tema que já foi aplicado ao carregar a página.
  applyThemeUI(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      /* localStorage indisponível (modo privado etc.) — tema ainda funciona, só não persiste */
    }
    applyThemeUI(next);
  });

  /* ---------------------------------------------------------------------
     3) Carrossel da galeria (scroll horizontal nativo + setas)
        O arrastar/swipe já funciona sozinho via scroll-snap no CSS; aqui só
        adicionamos as setas de "página anterior/próxima" e desativamos a
        seta quando chega no início/fim.
  --------------------------------------------------------------------- */
  const galeriaTrack = document.getElementById('galeria-track');
  const galeriaPrev = document.getElementById('galeria-prev');
  const galeriaNext = document.getElementById('galeria-next');

  if (galeriaTrack && galeriaPrev && galeriaNext) {
    const scrollByPage = (direction) => {
      const firstSlide = galeriaTrack.querySelector('a');
      const gap = parseFloat(getComputedStyle(galeriaTrack).columnGap || '20') || 20;
      const amount = firstSlide ? firstSlide.getBoundingClientRect().width + gap : galeriaTrack.clientWidth * 0.8;
      galeriaTrack.scrollBy({ left: direction * amount, behavior: 'smooth' });
    };

    galeriaPrev.addEventListener('click', () => scrollByPage(-1));
    galeriaNext.addEventListener('click', () => scrollByPage(1));

    const updateArrows = () => {
      const maxScroll = galeriaTrack.scrollWidth - galeriaTrack.clientWidth - 1;
      galeriaPrev.disabled = galeriaTrack.scrollLeft <= 0;
      galeriaNext.disabled = galeriaTrack.scrollLeft >= maxScroll;
    };

    galeriaTrack.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();
  }

  /* ---------------------------------------------------------------------
     4) Depoimentos (renderiza os cards a partir do array DEPOIMENTOS)
  --------------------------------------------------------------------- */
  const lista = document.getElementById('depoimentos-lista');

  if (lista && DEPOIMENTOS.length) {
    const estrelasSVG = (qtd) => {
      const cheia =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
      const vazia =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
      const n = Math.max(0, Math.min(5, qtd | 0));
      return cheia.repeat(n) + vazia.repeat(5 - n);
    };

    // Escapa texto para evitar injeção de HTML acidental via conteúdo editável.
    const esc = (s) =>
      String(s ?? '').replace(/[&<>"']/g, (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
      );

    lista.innerHTML = DEPOIMENTOS.map((d) => {
      const fotoWebp = d.foto ? esc(d.foto).replace(/\.(jpe?g|png)$/i, '.webp') : '';
      const foto = d.foto
        ? `<picture>
             <source type="image/webp" srcset="${fotoWebp}" />
             <img src="${esc(d.foto)}" alt="Foto de ${esc(d.nome)}, cliente do Walter Eletricista" width="56" height="56" loading="lazy" decoding="async" class="h-14 w-14 shrink-0 rounded-full border border-line object-cover" />
           </picture>`
        : '';
      return `
        <figure class="card flex flex-col">
          <div class="flex items-center gap-1 text-accent-ink" aria-label="${esc(d.estrelas)} de 5 estrelas">
            ${estrelasSVG(d.estrelas)}
          </div>
          <blockquote class="mt-4 grow text-muted">"${esc(d.texto)}"</blockquote>
          <figcaption class="mt-5 flex items-center gap-3 border-t border-line pt-4">
            ${foto}
            <span>
              <span class="block font-display text-sm font-semibold text-ink">${esc(d.nome)}</span>
              <span class="block text-xs text-subtle">${esc(d.local)}</span>
            </span>
          </figcaption>
        </figure>`;
    }).join('');
  }

  /* ---------------------------------------------------------------------
     5) Ano automático no rodapé (scroll suave é feito por CSS)
  --------------------------------------------------------------------- */
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = String(new Date().getFullYear());
});

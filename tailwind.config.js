/** @type {import('tailwindcss').Config} */
module.exports = {
  // Purge: só o CSS realmente usado nesses arquivos vai para o build final.
  content: ['./src/**/*.html', './src/**/*.js'],
  theme: {
    extend: {
      colors: {
        // Fundo grafite/chumbo (mantido fixo — usado em elementos que não trocam com o tema)
        graphite: {
          950: '#14161B',
          900: '#1A1D23',
          800: '#22262E',
          700: '#2C313B',
          600: '#3A4150',
        },
        // Amarelo elétrico (destaque) — cor de marca, igual nos dois temas
        electric: {
          DEFAULT: '#F5C518',
          400: '#F7D24B',
          500: '#F5C518',
          600: '#D9A90A',
        },
        // Tokens semânticos que TROCAM entre modo claro/escuro (ver :root em main.css).
        // Usar estes em vez de graphite-*/slate-*/white sempre que a cor precisar
        // se adaptar ao tema.
        page: {
          DEFAULT: 'rgb(var(--bg) / <alpha-value>)',
          alt: 'rgb(var(--bg-alt) / <alpha-value>)',
        },
        surface: 'rgb(var(--surface) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        body: 'rgb(var(--body-text) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        subtle: 'rgb(var(--subtle) / <alpha-value>)',
        faint: 'rgb(var(--faint) / <alpha-value>)',
        // Amarelo elétrico usado como COR DE TEXTO — mais escuro no modo claro
        // para manter contraste AA; igual ao electric no modo escuro.
        'accent-ink': 'rgb(var(--accent-ink) / <alpha-value>)',
      },
      fontFamily: {
        // Títulos grandes e fortes
        display: ['Sora', 'system-ui', 'sans-serif'],
        // Corpo de texto
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(0, 0, 0, 0.45)',
        glow: '0 0 0 1px rgba(245, 197, 24, 0.25), 0 12px 40px -12px rgba(245, 197, 24, 0.25)',
      },
      maxWidth: {
        content: '72rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};

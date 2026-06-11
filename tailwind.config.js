/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        // Theme-aware tokens driven by CSS variables (see style.css :root / .dark).
        // RGB-channel vars support Tailwind opacity modifiers (e.g. bg-surface-3/90).
        surface: {
          0: 'rgb(var(--c-surface-0) / <alpha-value>)',
          1: 'rgb(var(--c-surface-1) / <alpha-value>)',
          2: 'rgb(var(--c-surface-2) / <alpha-value>)',
          3: 'rgb(var(--c-surface-3) / <alpha-value>)',
          4: 'rgb(var(--c-surface-4) / <alpha-value>)',
        },
        border: {
          subtle: 'var(--c-border-subtle)',
          DEFAULT: 'var(--c-border)',
          strong: 'var(--c-border-strong)',
        },
        accent: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          soft: 'var(--c-accent-soft)',
          hover: 'rgb(var(--c-accent-hover) / <alpha-value>)',
        },
        content: {
          primary: 'rgb(var(--c-content-primary) / <alpha-value>)',
          secondary: 'rgb(var(--c-content-secondary) / <alpha-value>)',
          muted: 'rgb(var(--c-content-muted) / <alpha-value>)',
        },
        // Neutral hover wash that adapts to the theme.
        hover: 'var(--c-hover)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        mono: ['SF Mono', 'JetBrains Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        panel: '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 30px rgba(0,0,0,0.35)',
        pop: '0 12px 40px rgba(0,0,0,0.5)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        // Surface scale — tuned for a deep, calm macOS dark UI.
        surface: {
          0: '#0b0b0f',
          1: '#121218',
          2: '#17171f',
          3: '#1e1e28',
          4: '#262633',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          DEFAULT: 'rgba(255,255,255,0.09)',
          strong: 'rgba(255,255,255,0.14)',
        },
        accent: {
          DEFAULT: '#6366f1',
          soft: 'rgba(99,102,241,0.14)',
          hover: '#7c7ff5',
        },
        content: {
          primary: '#f4f4f6',
          secondary: '#a3a3b2',
          muted: '#6e6e80',
        },
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

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Monaspace Neon', 'MesloLGS Nerd Font Mono', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        // Vesper-inspired surfaces
        surface: {
          0: '#101010',
          1: '#181818',
          2: '#222222',
          3: '#7a7e85',
        },
        // Vesper/Islands Dark palette
        accent: {
          blue: '#56a8f5',
          green: '#6aab73',
          red: '#f85149',
          orange: '#cf8e6d',
          purple: '#c77dbb',
          teal: '#2aacb8',
          gold: '#d5b778',
          cyan: '#42c3d4',
        },
        text: {
          DEFAULT: '#bcbec4',
          dim: '#7a7e85',
        },
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-10': 'span 10 / span 10',
      },
      colors: {
        dark: {
          bg: '#0d1117',
          surface: '#161b22',
          surface2: '#1c2330',
          border: '#30363d',
          text: '#e6edf3',
          muted: '#8b949e',
          accent: '#39d353',
          accent2: '#58a6ff',
          danger: '#f85149',
          warn: '#d29922',
        }
      }
    },
  },
  plugins: [],
}

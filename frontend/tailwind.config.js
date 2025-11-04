/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ffffff', // base branca
        secondary: '#FBBF24', // amarelo
        tertiary: '#EF4444' // vermelho
      }
    }
  },
  plugins: []
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ffffff', // base branca
        secondary: '#FBBF24', // amarelo
        tertiary: '#EF4444' // vermelho
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 400ms ease-out forwards',
        pop: 'pop 180ms ease-out'
      }
    }
  },
  plugins: []
}

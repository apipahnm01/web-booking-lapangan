/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8f2e9',
          100: '#eee2cf',
          200: '#dfc9a8',
          300: '#cdb184',
          400: '#bd9665',
          500: '#a77c4f',
          600: '#8d6540',
          700: '#705035',
          800: '#59402e',
          900: '#453226',
        },
        navy: {
          50: '#f7f3ed',
          100: '#eee7dd',
          200: '#d9cbbb',
          300: '#bca994',
          400: '#9a836b',
          500: '#574537',
          600: '#403126',
          700: '#2b201a',
          800: '#1b130f',
          900: '#100b08',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.55s ease-out',
        'scale-in': 'scaleIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(22px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.97)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
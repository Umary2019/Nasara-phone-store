/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        paper: '#f8fafc',
        brand: {
          50: '#eefbf9',
          100: '#d6f5ef',
          200: '#adeadb',
          300: '#78d8c0',
          400: '#42bf9f',
          500: '#1f9d80',
          600: '#187e68',
          700: '#156553',
          800: '#145245',
          900: '#12443a'
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12'
        }
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};

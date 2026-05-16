/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a0e1a',
          900: '#0d1226',
          800: '#111827',
          700: '#1a2340',
        },
        lavender: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        sky: {
          400: '#60a5fa',
          500: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
}

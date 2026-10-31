/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      screens: {
        xs: '375px',
      },
      colors: {
        primary: {
          '50': '#f2ffe6',
          '100': '#e2ffc8',
          '200': '#c6ff97',
          '300': '#a1fb5b',
          '400': '#7ef12a',
          '500': '#5dd80a',
          '600': '#45ad03',
          '700': '#3c9309',
          '800': '#2e670d',
          '900': '#285710',
          '950': '#113102',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      fontFamily: {
        sans: ['Google Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Merriweather', 'Google Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

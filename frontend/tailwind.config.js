/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F3FF0',
          50: '#EEF0FD',
          100: '#D9DCFB',
          200: '#B3BAF7',
          300: '#8D97F3',
          400: '#6775EF',
          500: '#4F3FF0',
          600: '#3929D9',
          700: '#2B1EB8',
          800: '#1E1592',
          900: '#130E6B',
        },
        navy: '#0B0B2B',
        dark: '#202430',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.07)',
        'card-hover': '0 8px 40px rgba(79,63,240,0.15)',
      },
    },
  },
  plugins: [],
};

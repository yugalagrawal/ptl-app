/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1A2B4A',
          'navy-light': '#243560',
          'navy-dark': '#111D33',
          orange: '#D94F1C',
          'orange-light': '#F4743B',
          'orange-dark': '#A83710',
        },
        pastel: {
          blue: '#E6EEFB',
          peach: '#FDEBDD',
          rose: '#FDE8E6',
          mint: '#E2F5EA',
          lavender: '#EEE9FB',
          butter: '#FFF3D6',
        },
        ink: {
          blue: '#2F5FBF',
          peach: '#C2410C',
          rose: '#BE3A34',
          mint: '#15803D',
          lavender: '#6D4FC2',
          butter: '#A16207',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
        card: '0 2px 10px -2px rgb(15 23 42 / 0.08)',
      },
    },
  },
  plugins: [],
}

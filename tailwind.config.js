/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#165DFF',
        mint: '#36D399',
        accent: '#FF9F43',
        text: {
          dark: '#333333',
          medium: '#666666',
        },
      },
      boxShadow: {
        soft: '0 12px 32px rgba(22, 93, 255, 0.08)',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

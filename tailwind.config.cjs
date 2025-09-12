/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#111827',
          secondary: '#1F2937',
          accent: '#3B82F6',
          text: '#F9FAFB',
          muted: '#6B7280'
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}
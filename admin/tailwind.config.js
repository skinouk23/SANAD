/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Extending palette if needed, but using standard Tailwind colors 
        // (teal, rose, amber, emerald, stone) as requested in the design system.
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
}
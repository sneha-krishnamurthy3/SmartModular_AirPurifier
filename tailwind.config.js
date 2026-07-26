/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#D7FF2F',
          hover: '#C2EB1B',
        },
        brand: {
          black: '#09090B',
          bg: '#F8F7F3',
          purple: '#6C3EF4',
          white: '#FFFFFF',
          gray: '#666666',
        }
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

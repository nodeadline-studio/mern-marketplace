/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./client/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#93c5ae',
          DEFAULT: '#375a53',
          dark: '#2d4944',
        },
        secondary: {
          light: '#5f7c8b',
          DEFAULT: '#455a64',
          dark: '#37474f',
        }
      }
    },
  },
  plugins: [],
}

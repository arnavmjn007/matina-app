// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Set Inter as the default sans-serif font
      },
      colors: { // <-- Add this new 'colors' section
        matinaRed: '#DC0A21',
        chipRed: '#D92C54', // Define your custom color
      },
    },
  },
  plugins: [],
}
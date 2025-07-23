/** @type {import('tailwindcss').Config} */
const textStroke = require('tailwindcss-text-stroke'); 

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    textStroke, // ✅ Now it's defined
  ],
};

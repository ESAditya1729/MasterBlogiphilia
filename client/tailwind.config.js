/** @type {import('tailwindcss').Config} */
module.exports = {
   darkMode: 'class', 
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 20px 4px rgba(0, 191, 255, 0.5)",
          },
          "50%": {
            boxShadow: "0 0 30px 8px rgba(0, 191, 255, 0.8)",
          },
        },
      },
      animation: {
        glow: "glow 3s ease-in-out infinite",
      },
      colors: {
        "sky-glow": "#00BFFF",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        gradientFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.05)" },
        },
        glowPulse: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
        },
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

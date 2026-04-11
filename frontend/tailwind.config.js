/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0f1117",
          secondary: "#181c25",
          card: "#1e2330",
          hover: "#252b3b",
        },
        accent: {
          blue: "#4f8ef7",
          cyan: "#36d9d9",
          green: "#4ade80",
        },
        text: {
          primary: "#e8eaf0",
          secondary: "#8892a4",
          muted: "#556070",
        },
      },
      fontFamily: {
        display: ["'DM Serif Display'", "serif"],
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nova: {
          bg: "#080B12",
          card: "#0F1420",
          cardHover: "#151C2C",
          border: "#20283A",
          primary: "#4F7CFF",
          primaryHover: "#3B69EE",
          accent: "#7C5CFF",
          text: "#F5F7FA",
          muted: "#8993A4",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
        }
      },
      borderRadius: {
        'nova': '10px',
      }
    },
  },
  plugins: [],
};

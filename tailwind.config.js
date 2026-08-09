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
          // Base backgrounds
          bg: "#050812",
          bg2: "#070B14",
          bg3: "#0A0F1C",
          card: "rgba(10,15,28,0.65)",
          cardSolid: "#0A0F1C",
          cardHover: "#111827",
          border: "rgba(148,163,184,0.12)",
          borderStrong: "rgba(148,163,184,0.2)",
          // Primary palette
          primary: "#4D7CFF",
          primaryHover: "#3B69EE",
          secondary: "#6366F1",
          accent: "#8B5CF6",
          // Status colors
          active: "#00D084",
          paused: "#F59E0B",
          danger: "#F43F5E",
          dangerHover: "#E11D48",
          // Text colors
          text: "#F8FAFC",
          secondaryText: "#94A3B8",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(77,124,255,0.25)',
        'glow-blue-sm': '0 0 12px rgba(77,124,255,0.2)',
        'glow-violet': '0 0 20px rgba(139,92,246,0.25)',
        'glow-green': '0 0 20px rgba(0,208,132,0.2)',
        'glow-amber': '0 0 20px rgba(245,158,11,0.2)',
        'glow-red': '0 0 20px rgba(244,63,94,0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4D7CFF 0%, #8B5CF6 100%)',
        'gradient-primary-soft': 'linear-gradient(135deg, rgba(77,124,255,0.2) 0%, rgba(139,92,246,0.2) 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, rgba(10,15,28,0.9) 0%, rgba(7,11,20,0.95) 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-in-out',
        'slide-up': 'slide-up 0.25s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 12s linear infinite',
      },
    },
  },
  plugins: [],
};

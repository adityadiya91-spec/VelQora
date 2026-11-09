/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#CCFF00",
        "primary-blue": "#0052FF",
        "primary-warm": "#D4FF00",
        "primary-wash": "rgba(204, 255, 0, 0.12)",
        ink: "#FFFFFF",
        canvas: "#07090E",
        surface: "#121622",
        muted: "#94A3B8",
        hairline: "rgba(255, 255, 255, 0.12)",
        destructive: "#EF4444",
      },
      fontFamily: {
        heading: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "1.25rem",
      },
      boxShadow: {
        card: "0 20px 44px -28px rgba(0,0,0,.60)",
        glow: "0 0 30px rgba(204, 255, 0, 0.35)",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};
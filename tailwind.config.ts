import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1C1917",
          50: "#F5F3EF",
          100: "#E7E2DB",
          700: "#44403C",
          900: "#1C1917",
        },
        offwhite: "#FAF9F6",
        accent: {
          DEFAULT: "#B45309",
          light: "#D97706",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": [
          "clamp(2.5rem, 5vw + 1rem, 5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em" },
        ],
        "display-md": [
          "clamp(2rem, 3vw + 1rem, 3.25rem)",
          { lineHeight: "1.1", letterSpacing: "-0.01em" },
        ],
      },
    },
  },
  plugins: [],
};
export default config;

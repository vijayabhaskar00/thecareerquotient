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
          DEFAULT: "#0B1220",
          50: "#F4F6FA",
          100: "#E4E9F2",
          700: "#1B2740",
          900: "#0B1220",
        },
        offwhite: "#FAF9F6",
        accent: {
          DEFAULT: "#2557E8",
          light: "#5C82F0",
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

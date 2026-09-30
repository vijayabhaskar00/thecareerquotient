import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#F4F2EC",
          soft: "#A7A9B4",
        },
        line: {
          DEFAULT: "rgba(255,255,255,0.10)",
          soft: "rgba(255,255,255,0.06)",
        },
        surface: {
          DEFAULT: "#0E0F15",
          2: "#14151D",
        },
        accent: {
          DEFAULT: "#C6F432",
          light: "#DDFF6E",
        },
        aurora: {
          violet: "#8B5CF6",
          cyan: "#22D3EE",
          pink: "#F472B6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(2.75rem, 7vw + 0.5rem, 6.5rem)",
          { lineHeight: "0.98", letterSpacing: "-0.04em" },
        ],
        "display-lg": [
          "clamp(2.5rem, 4.5vw + 1rem, 4.75rem)",
          { lineHeight: "1.02", letterSpacing: "-0.035em" },
        ],
        "display-md": [
          "clamp(2rem, 3vw + 1rem, 3.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.03em" },
        ],
      },
    },
  },
  plugins: [],
};
export default config;

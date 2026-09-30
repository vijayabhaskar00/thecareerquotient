import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // text
        ink: {
          DEFAULT: "#0D2B24",
          soft: "#46605A",
        },
        // hairlines
        line: {
          DEFAULT: "rgba(13,43,36,0.16)",
          soft: "rgba(13,43,36,0.06)",
        },
        // cards sit on the sage page background
        surface: {
          DEFAULT: "#F8FAF7",
          2: "#FFFFFF",
        },
        forest: {
          DEFAULT: "#0D2B24",
          soft: "#16403A",
        },
        sage: "#E9EEE9",
        accent: {
          DEFAULT: "#FF5A1F", // fills
          ink: "#B8330A", // text on light backgrounds (AA)
          light: "#FF7443",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(3.25rem, 9.5vw, 8.25rem)",
          { lineHeight: "0.9", letterSpacing: "-0.015em" },
        ],
        "display-lg": [
          "clamp(2.75rem, 6vw, 5.5rem)",
          { lineHeight: "0.94", letterSpacing: "-0.015em" },
        ],
        "display-md": [
          "clamp(2.25rem, 4.2vw, 4rem)",
          { lineHeight: "0.98", letterSpacing: "-0.01em" },
        ],
      },
    },
  },
  plugins: [],
};
export default config;

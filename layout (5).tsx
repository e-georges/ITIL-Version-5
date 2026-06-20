import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)",
        surface: "var(--color-surface)",
        ink: "var(--color-ink)",
        "ink-muted": "var(--color-ink-muted)",
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        border: "var(--color-border)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        card: "16px",
        tab: "10px 10px 0 0",
      },
    },
  },
  plugins: [],
};

export default config;

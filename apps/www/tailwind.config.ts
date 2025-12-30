import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "hsl(var(--brand-primary))",
          "primary-hover": "hsl(var(--brand-primary-hover))",
        },
        background: {
          light: "hsl(var(--color-background-light))",
          dark: "hsl(var(--color-background-dark))",
        },
        text: {
          primary: "hsl(var(--color-text-primary))",
          secondary: "hsl(var(--color-text-secondary))",
          muted: "hsl(var(--color-text-muted))",
          label: "hsl(var(--color-text-label))",
        },
        border: {
          DEFAULT: "hsl(var(--color-border))",
          focus: "hsl(var(--color-border-focus))",
        },
        error: {
          DEFAULT: "hsl(var(--color-error))",
          bg: "hsl(var(--color-error-bg))",
          border: "hsl(var(--color-error-border))",
        },
        promo: {
          bg: "hsl(var(--color-promo-bg))",
          surface: "hsl(var(--color-promo-surface))",
        },
      },
    },
  },
};

export default config;

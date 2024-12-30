import type { Config } from "tailwindcss"

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          light: "#eaeaea",
          lighter: "#f9f4ed",
          dark: "#af695c",
          darker: "#2a2a2a"
        }
      },
    },
  },
  plugins: [],
} satisfies Config

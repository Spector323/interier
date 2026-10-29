import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  future: { hoverOnlyWhenSupported: true },
  theme: { extend: {
    colors: { accent: "#E2431F", milk: "#FFFFFF", graphite: "#2B2B2E", blush: "#F2F2F4", sand: "#E9E9EC" },
    fontFamily: { display: ["Georgia", "Times New Roman", "serif"] },
  } },
  plugins: [],
} satisfies Config;

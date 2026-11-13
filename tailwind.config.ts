import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14213D",
        paper: "#F6F7F9",
        steel: "#C9D1D9",
        tag: "#F5C518",
        wa: "#1FA855",
      },
      fontFamily: { sans: ["Cairo", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;

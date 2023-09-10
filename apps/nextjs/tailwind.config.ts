import type { Config } from "tailwindcss";

import baseConfig from "@chatmebot/tailwind-config";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig],
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;

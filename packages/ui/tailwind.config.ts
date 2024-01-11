import type { Config } from "tailwindcss";
import { theme } from "@next-monorepo/tailwind-config";

const config: Config = {
  content: [],
  theme: { ...theme },
  plugins: [],
};
export default config;

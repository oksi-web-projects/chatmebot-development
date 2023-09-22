// Importing env files here to validate on build
import "./src/env.mjs";
import "@chatmebot/auth/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@chatmebot/api", "@chatmebot/auth", "@chatmebot/db"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    serverActions: true,
  },
  serverComponents: {
    debug: true,
  },
  env: {
    chatBaseWSUrl: process.env.CHAT_BASE_WS_URL || "",
  },
};

export default config;

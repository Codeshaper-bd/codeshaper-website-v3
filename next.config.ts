import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Playwright MCP writes accessibility snapshots/console logs into
  // .playwright-mcp/ (and screenshots into the project root) on every tool
  // call, since it's sandboxed to write only inside the project directory.
  // Without this, the dev server's file watcher treats each of those writes
  // as a source change and triggers a Fast Refresh — reliably enough, amid
  // a burst of test calls, that a client-only boot animation (Preloader)
  // never gets an uninterrupted ~2s window to complete before being reset.
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/node_modules/**", "**/.git/**", "**/.playwright-mcp/**", "**/*.png"],
    };
    return config;
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * 301s (statusCode, not `permanent: true`, which sends 308) for:
   *  - URLs from the previous live site, mapped onto the new service structure
   *  - /services/ai, the flagship AI page's previous URL
   *  - the three engagement models that moved to top-level hiring pages
   */
  async redirects() {
    return [
      // Previous live site
      { source: "/software-development", destination: "/services/ai-software-development", statusCode: 301 },
      { source: "/web-development", destination: "/services/web-application-development", statusCode: 301 },
      { source: "/mobile-apps-development", destination: "/services/mobile-app-development", statusCode: 301 },
      { source: "/wordpress-development", destination: "/services/wordpress-development", statusCode: 301 },
      { source: "/ui-and-ux", destination: "/services/ui-ux-design", statusCode: 301 },
      { source: "/ecommerce-soluations", destination: "/services/websites-commerce", statusCode: 301 },
      // Moved within this site
      { source: "/services/ai", destination: "/services/ai-agents-automation", statusCode: 301 },
      { source: "/engagement/dedicated-team", destination: "/hire-dedicated-developers", statusCode: 301 },
      { source: "/engagement/team-augmentation", destination: "/staff-augmentation", statusCode: 301 },
      { source: "/engagement/global-delivery", destination: "/offshore-development-center", statusCode: 301 },
    ];
  },
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

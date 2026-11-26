// `pnpm lint`. Next.js's own rules: correctness (hooks, links, images, accessibility basics), not style.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: path.dirname(fileURLToPath(import.meta.url)) });

const config = [
  { ignores: [".next*/**", "node_modules/**", "public/**", "next-env.d.ts", ".leads-spool/**", ".content-backup/**", ".worktrees/**", ".ai-shots/**"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Found in older marketing pages when lint was added (26 Nov 2026) and left alone then: warnings
    // until those pages are next edited. Every other rule stays as strict as Next.js ships it.
    rules: { "react/no-unescaped-entities": "warn", "@next/next/no-html-link-for-pages": "warn" },
  },
];

export default config;

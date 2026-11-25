import { readFile } from "node:fs/promises";
import path from "node:path";
import { SITE } from "@/lib/siteSettings";

/**
 * /favicon.ico: browsers and crawlers ask for it even when the page names another icon (it used to
 * answer 404). Serves the CMS site icon when one is set (CMS › Search and sharing › Site icon, a
 * local copy in public/cms after the sync), else the 48 × 48 CodeShaper mark. Modern browsers read a
 * PNG here without trouble.
 */
export const dynamic = "force-static";

const TYPES: Record<string, string> = { ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif" };

export async function GET() {
  const local = SITE.seo.favicon?.startsWith("/") && !SITE.seo.favicon.includes("..") ? SITE.seo.favicon : "/brand/icon-48.png";
  const file = await readFile(path.join(process.cwd(), "public", local)).catch(() => readFile(path.join(process.cwd(), "public/brand/icon-48.png")));
  const type = TYPES[path.extname(local).toLowerCase()] ?? "image/png";
  return new Response(new Uint8Array(file), { headers: { "Content-Type": type, "Cache-Control": "public, max-age=86400" } });
}

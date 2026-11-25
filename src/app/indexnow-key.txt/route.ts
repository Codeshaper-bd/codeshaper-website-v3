import { SITE } from "@/lib/siteSettings";

/**
 * The IndexNow key file (indexnow.org). The publish script names this file
 * as `keyLocation` when it tells Bing and others about updated pages, and
 * they fetch it to check the key is ours. The key comes from the CMS and is
 * absent when IndexNow is turned off there (CMS › Settings › AI and search
 * engines).
 */
export const dynamic = "force-static";

export function GET() {
  const key = SITE.crawlers?.indexnow;
  return key ? new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } }) : new Response("Not found", { status: 404 });
}

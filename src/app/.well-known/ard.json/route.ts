import { SITE_URL, SITE_NAME } from "@/lib/site";

/**
 * /.well-known/ard.json: an Agentic Resource Discovery manifest (ARD v0.91,
 * https://agenticresourcediscovery.org/spec/). It lists the machine-readable
 * resources the site publishes for AI agents: the sitemap. (llms.txt is
 * found at its standard /llms.txt address; ARD reserves text/markdown
 * entries for agent-skill files, which llms.txt is not.) Required per entry: identifier (urn:air:<publisher-fqdn>:...),
 * displayName, type (a media type) and exactly one of url / data.
 * Static at build time; the publisher follows SITE_URL.
 */
export const dynamic = "force-static";

export function GET() {
  const host = new URL(SITE_URL).hostname;
  const manifest = {
    entries: [
      {
        identifier: `urn:air:${host}:site:sitemap`,
        displayName: `${SITE_NAME} sitemap`,
        type: "application/xml",
        url: `${SITE_URL}/sitemap.xml`,
        description: `Every public page on the ${SITE_NAME} website.`,
        representativeQueries: ["List the pages on the CodeShaper website", "Find CodeShaper case studies"],
      },
    ],
  };
  return Response.json(manifest);
}

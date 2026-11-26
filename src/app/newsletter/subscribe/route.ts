import { newsletterFormResponse } from "@/lib/briefHandoff";
import { submit, tooMany } from "@/lib/intake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Where the newsletter box POSTs when the page's script is not running. Same limit and delivery as /api/newsletter. */
export async function POST(request: Request) {
  return newsletterFormResponse(request, {
    limited: () => tooMany(request, "newsletter"),
    subscribe: (email) => submit({ kind: "subscribers", data: { email } }),
  });
}

export function GET() {
  return new Response(null, { status: 303, headers: { Location: "/blog" } });
}

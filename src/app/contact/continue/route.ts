import { continueResponse } from "@/lib/briefHandoff";
import { contactChannels } from "@/lib/publishedContact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Where the enquiry boxes POST when the page's script is not running (see lib/briefHandoff). */
export async function POST(request: Request) {
  return continueResponse(request, contactChannels());
}

/** Someone reloading or opening the address directly. */
export function GET() {
  return new Response(null, { status: 303, headers: { Location: "/contact" } });
}

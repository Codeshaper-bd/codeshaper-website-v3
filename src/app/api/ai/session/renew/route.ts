import { aiGateway } from "@/lib/ai/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = (request: Request) => aiGateway()("session.renew", request);

import { aiGateway } from "@/lib/ai/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = (request: Request) => aiGateway()("status", request);

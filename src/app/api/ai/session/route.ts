import { aiGateway } from "@/lib/ai/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = (request: Request) => aiGateway()("session.create", request);
export const GET = (request: Request) => aiGateway()("session.show", request);
export const DELETE = (request: Request) => aiGateway()("session.end", request);

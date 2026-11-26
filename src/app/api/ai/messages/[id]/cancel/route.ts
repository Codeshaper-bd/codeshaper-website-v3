import { aiGateway } from "@/lib/ai/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export const POST = async (request: Request, { params }: Context) => aiGateway()("messages.cancel", request, (await params).id);

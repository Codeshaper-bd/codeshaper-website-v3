import { aiGateway } from "@/lib/ai/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export const GET = async (request: Request, { params }: Context) => aiGateway()("messages.show", request, (await params).id);

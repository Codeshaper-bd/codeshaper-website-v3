import { spawn } from "node:child_process";
import path from "node:path";
import { NextResponse } from "next/server";
import { acceptsPublish } from "@/lib/credentials.mjs";
import { tooMany } from "@/lib/intake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // only the CMS may ask for an update, with the publish secret and no other
  if (!acceptsPublish(request.headers.get("authorization"))) return NextResponse.json({ ok: false }, { status: 401 });
  // counted after the check, so a stranger cannot use up the CMS's allowance
  if (tooMany(request, "publish")) return NextResponse.json({ ok: false }, { status: 429 });
  const body = await request.json().catch(() => null);
  const id = Number(body?.id);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ ok: false }, { status: 422 });

  // it outlives this request, and in production this process is restarted by it
  const root = process.cwd();
  spawn(process.execPath, [path.join(root, "scripts", "publish.mjs"), String(id), new URL(request.url).origin.replace(/host.docker.internal/, "127.0.0.1")], { cwd: root, detached: true, stdio: "ignore", windowsHide: true }).unref();
  return NextResponse.json({ ok: true }, { status: 202 });
}

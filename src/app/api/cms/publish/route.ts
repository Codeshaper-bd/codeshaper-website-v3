import { spawn } from "node:child_process";
import { timingSafeEqual } from "node:crypto";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Only the CMS may ask for an update. */
function allowed(request: Request) {
  const want = Buffer.from(`Bearer ${process.env.CMS_INTAKE_TOKEN ?? ""}`);
  const got = Buffer.from(request.headers.get("authorization") ?? "");
  return Boolean(process.env.CMS_INTAKE_TOKEN) && want.length === got.length && timingSafeEqual(want, got);
}

export async function POST(request: Request) {
  if (!allowed(request)) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await request.json().catch(() => null);
  const id = Number(body?.id);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ ok: false }, { status: 422 });

  // it outlives this request, and in production this process is restarted by it
  const root = process.cwd();
  spawn(process.execPath, [path.join(root, "scripts", "publish.mjs"), String(id), new URL(request.url).origin.replace(/host.docker.internal/, "127.0.0.1")], { cwd: root, detached: true, stdio: "ignore", windowsHide: true }).unref();
  return NextResponse.json({ ok: true }, { status: 202 });
}

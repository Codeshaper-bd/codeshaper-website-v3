import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { OG_CARDS, ogKey } from "@/lib/ogPages";

/**
 * Branded share cards, 1200 × 630, one per page in lib/ogPages.ts (/og/services, /og/industries/saas…),
 * drawn once at build time. Same look as public/brand/og-default.png: pastel brand gradient, logo,
 * a small label and the page's headline. A share image set in the CMS replaces the card.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return [...OG_CARDS.keys()].map((p) => ({ path: ogKey(p).split("/") }));
}

/** Urbanist (the brand heading face) from Google Fonts at build time; the built-in font if that fails. */
let font: Promise<ArrayBuffer | null> | null = null;
function urbanist(): Promise<ArrayBuffer | null> {
  font ??= (async () => {
    try {
      const css = await (await fetch("https://fonts.googleapis.com/css2?family=Urbanist:wght@700&display=swap", { signal: AbortSignal.timeout(8000) })).text();
      const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/)?.[1];
      return url ? await (await fetch(url, { signal: AbortSignal.timeout(8000) })).arrayBuffer() : null;
    } catch {
      return null;
    }
  })();
  return font;
}

let logo: Promise<string> | null = null;
const logoSrc = () => (logo ??= readFile(path.join(process.cwd(), "public/brand/logo.png")).then((b) => `data:image/png;base64,${b.toString("base64")}`));

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const card = OG_CARDS.get(`/${parts.join("/")}`);
  if (!card) return new Response("Not found", { status: 404 });
  const [f, src] = await Promise.all([urbanist(), logoSrc()]);
  const size = card.title.length > 60 ? 56 : card.title.length > 38 ? 64 : 72;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#f6f4f1",
          backgroundImage:
            "radial-gradient(circle at 12% 20%, #cfc8ff 0%, rgba(207,200,255,0) 45%), radial-gradient(circle at 92% 18%, #c3e1ff 0%, rgba(195,225,255,0) 40%), radial-gradient(circle at 70% 110%, #ffcfb2 0%, rgba(255,207,178,0) 50%)",
          fontFamily: f ? "Urbanist" : undefined,
          color: "#0b0f19",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- drawn into the card, not a page */}
        <img src={src} height={56} alt="" style={{ height: 56, width: 158 }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#4f46e5" }}>{card.eyebrow}</div>
          <div style={{ marginTop: 18, fontSize: size, fontWeight: 700, lineHeight: 1.06, letterSpacing: -1.5, maxWidth: 1000 }}>{card.title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, fontWeight: 700 }}>
          <div style={{ color: "#4f46e5" }}>codeshaper.net</div>
          <div style={{ backgroundColor: "#0b0f19", color: "#ffffff", borderRadius: 999, padding: "14px 28px" }}>Book a call</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, ...(f ? { fonts: [{ name: "Urbanist", data: f, weight: 700 as const, style: "normal" as const }] } : {}) },
  );
}

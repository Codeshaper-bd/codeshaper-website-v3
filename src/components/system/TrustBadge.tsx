import Image from "next/image";
import { SiEnvato, SiUpwork } from "react-icons/si";
import { RiOpenaiFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { ArrowUpRight, BadgeCheck } from "lucide-react";

/**
 * A recognition badge as a pill (artwork or brand icon, title, line), shared
 * by "Our journey" and the footer. Links out only when a real https proof URL
 * is set. Only real badges belong here (CMS › Home › Our journey).
 */
export type Badge = { title: string; text?: string; href?: string };

/** Which recognised badge this is, from its words (so the CMS needs no extra field). */
type Kind = "clutch" | "openai" | "google" | "envato" | "upwork" | "other";
const kindOf = (b: Badge): Kind => {
  const t = `${b.title} ${b.text ?? ""}`.toLowerCase();
  if (t.includes("clutch")) return "clutch";
  if (t.includes("openai")) return "openai";
  if (t.includes("google")) return "google";
  if (t.includes("envato")) return "envato";
  if (t.includes("upwork")) return "upwork";
  return "other";
};
/** Review platforms get the five stars the owner's badges show. */
const STARRED: Kind[] = ["google", "envato"];

function BadgeVisual({ kind }: { kind: Kind }) {
  if (kind === "clutch")
    // the official Clutch award artwork supplied by the owner
    return <Image src="/media/badges/clutch-top-software-developers-auckland-2026.png" alt="" width={60} height={64} style={{ width: 30, height: 32 }} className="shrink-0 object-contain" />;
  const icon =
    kind === "openai" ? <RiOpenaiFill size={16} className="text-[#0b0f19]" aria-hidden />
    : kind === "google" ? <FcGoogle size={16} aria-hidden />
    : kind === "envato" ? <SiEnvato size={14} className="text-[#81b441]" aria-hidden />
    : kind === "upwork" ? <SiUpwork size={14} className="text-[#14a800]" aria-hidden />
    : <BadgeCheck size={15} strokeWidth={2} className="text-brand" aria-hidden />;
  return <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-white">{icon}</span>;
}

export default function TrustBadge({ b }: { b: Badge }) {
  const kind = kindOf(b);
  const proof = b.href?.startsWith("https://");
  const inner = (
    <>
      <BadgeVisual kind={kind} />
      <span className="min-w-0 flex-1 text-left">
        <span className="block whitespace-nowrap font-urbanist text-[13px] font-semibold leading-tight text-content">{b.title}</span>
        {(b.text || STARRED.includes(kind)) && (
          <span className="mt-0.5 flex items-center gap-x-1.5 whitespace-nowrap font-urbanist text-[11.5px] leading-tight text-content-muted">
            {STARRED.includes(kind) && (
              <span aria-label="Five stars" className="text-[10px] tracking-[0.04em] text-[#f5a524]">
                ★★★★★
              </span>
            )}
            {b.text}
          </span>
        )}
      </span>
      {proof && <ArrowUpRight size={15} strokeWidth={2} aria-hidden className="shrink-0 text-content-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
    </>
  );
  const cls = "group inline-flex items-center gap-2.5 rounded-full border border-border bg-white/80 py-1.5 pl-1.5 pr-4 shadow-[0_1px_2px_rgba(11,15,25,0.04)] backdrop-blur-sm";
  return proof ? (
    <a
      href={b.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${b.title}${b.text ? `, ${b.text}` : ""} (opens the source)`}
      className={`${cls} transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-[0_10px_24px_-14px_rgba(11,15,25,0.3)]`}
    >
      {inner}
    </a>
  ) : (
    <span className={cls}>{inner}</span>
  );
}


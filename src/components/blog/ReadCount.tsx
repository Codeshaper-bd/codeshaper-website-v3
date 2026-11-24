"use client";

import { Eye } from "lucide-react";
import { compactCount, MIN_PUBLIC_READS } from "@/lib/blogReactions";
import { useBlogStats } from "./blogStatsClient";

/**
 * "1.2k reads" for one article (how often it was opened). Nothing below MIN_PUBLIC_READS (50).
 * `badge`: a dark glass pill in the bottom-left corner of a card image (owner, 24 Nov 2026).
 */
export default function ReadCount({
  slug,
  min = MIN_PUBLIC_READS,
  badge = false,
  withDot = true,
  dotClassName = "mx-1.5",
  className = "",
}: {
  slug: string;
  /** Show from this many reads (cards: 50; the article page itself: 1). */
  min?: number;
  badge?: boolean;
  withDot?: boolean;
  dotClassName?: string;
  className?: string;
}) {
  const stats = useBlogStats();
  const n = stats?.[slug]?.reads ?? 0;
  if (n < Math.max(1, min)) return null;
  const label = `${compactCount(n)} ${n === 1 ? "read" : "reads"}`;
  if (badge) {
    return (
      <span
        // owner, 24 Nov 2026: bottom-left, dark glass so it reads on any cover (busy or light)
        className={`pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#0b0f19]/70 px-2.5 py-1 font-urbanist text-[12px] font-semibold tabular-nums text-white shadow-[0_4px_12px_-4px_rgba(11,15,25,0.5)] ring-1 ring-white/15 backdrop-blur-md ${className}`}
      >
        <Eye size={13} strokeWidth={2} aria-hidden />
        {label}
      </span>
    );
  }
  return (
    // plain inline text (not flex), so it sits on the line's baseline; the dot wraps with the count
    <span className={`whitespace-nowrap ${className}`}>
      {withDot && (
        <span aria-hidden className={dotClassName}>
          ·
        </span>
      )}
      <Eye size={12} strokeWidth={1.9} aria-hidden className="mr-1 inline-block align-[-1.5px]" />
      {label}
    </span>
  );
}

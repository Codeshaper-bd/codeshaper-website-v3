"use client";

import { Eye } from "lucide-react";
import { compactCount, MIN_PUBLIC_READS } from "@/lib/blogReactions";
import { useBlogStats } from "./blogStatsClient";

/** An author's total reads across their articles (hidden below MIN_PUBLIC_READS, like every public count). */
export default function AuthorReads({ slugs }: { slugs: string[] }) {
  const stats = useBlogStats();
  const n = slugs.reduce((sum, s) => sum + (stats?.[s]?.reads ?? 0), 0);
  if (n < MIN_PUBLIC_READS) return null;
  return (
    <li className="flex items-center gap-2">
      <Eye size={15} strokeWidth={1.9} aria-hidden className="text-ink-faint" />
      <span>
        <b className="font-semibold text-ink">{compactCount(n)}</b> reads
      </span>
    </li>
  );
}

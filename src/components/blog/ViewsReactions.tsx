"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, ThumbsUp, Lightbulb, PartyPopper } from "lucide-react";
import { REACTIONS, type PostStats } from "@/lib/blogStats";

const REACTION_ICONS = {
  helpful: ThumbsUp,
  insightful: Lightbulb,
  love: PartyPopper,
} as const;

function reactedKey(slug: string, reactionId: string) {
  return `codeshaper:blog:reacted:${slug}:${reactionId}`;
}

export default function ViewsReactions({ slug }: { slug: string }) {
  const [stats, setStats] = useState<PostStats | null>(null);
  const [reacted, setReacted] = useState<Set<string>>(new Set());
  const countedRef = useRef(false);

  useEffect(() => {
    if (countedRef.current) return;
    countedRef.current = true;

    fetch("/api/blog/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, action: "view" }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setStats(data));

    try {
      const already = new Set<string>();
      for (const r of REACTIONS) {
        if (localStorage.getItem(reactedKey(slug, r.id))) already.add(r.id);
      }
      setReacted(already);
    } catch {
      // localStorage unavailable (private mode, etc.) — reactions just won't be remembered locally
    }
  }, [slug]);

  const react = async (reactionId: string) => {
    if (reacted.has(reactionId)) return; // one reaction of each kind per browser
    setReacted((s) => new Set(s).add(reactionId));
    try {
      localStorage.setItem(reactedKey(slug, reactionId), "1");
    } catch {
      // ignore — the click still counts server-side this session
    }
    const res = await fetch("/api/blog/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, action: "react", reaction: reactionId }),
    }).catch(() => null);
    if (res?.ok) setStats(await res.json());
  };

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-hairline-light bg-light-raised px-5 py-4">
      <span className="inline-flex items-center gap-1.5 font-urbanist text-[13px] text-ink-faint">
        <Eye size={15} strokeWidth={1.75} />
        {stats ? stats.views.toLocaleString() : "—"} views
      </span>
      <div className="h-4 w-px bg-hairline-light" aria-hidden />
      <div className="flex items-center gap-2">
        {REACTIONS.map((r) => {
          const count = stats?.reactions[r.id] ?? 0;
          const active = reacted.has(r.id);
          const Icon = REACTION_ICONS[r.id];
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => react(r.id)}
              disabled={active}
              aria-pressed={active}
              title={r.label}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-urbanist text-[12.5px] font-medium transition-colors duration-200 ${
                active
                  ? "border-aurora-violet bg-aurora-violet/10 text-aurora-violet"
                  : "border-hairline-light text-ink-dim hover:border-ink-faint hover:text-ink"
              }`}
            >
              <Icon size={14} strokeWidth={1.75} aria-hidden />
              {count > 0 ? count : r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

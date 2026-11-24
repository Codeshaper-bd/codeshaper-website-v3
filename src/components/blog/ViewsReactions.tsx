"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, Lightbulb, Heart } from "lucide-react";
import { REACTIONS, type ReactionId } from "@/lib/blogReactions";
import { sendEvent, useBlogStats } from "./blogStatsClient";

const REACTION_ICONS = { helpful: ThumbsUp, insightful: Lightbulb, love: Heart } as const;
const key = (slug: string, id: string) => `codeshaper:blog:reacted:${slug}:${id}`;

/**
 * "Was this article helpful?" at the end of the article. Each reaction once
 * per browser; counts are the real totals from the CMS. A small pop on
 * click, so the reader feels it landed.
 */
export default function ViewsReactions({ slug }: { slug: string }) {
  const stats = useBlogStats();
  const [reacted, setReacted] = useState<Set<string>>(new Set());
  const [popped, setPopped] = useState<string | null>(null);

  useEffect(() => {
    try {
      setReacted(new Set(REACTIONS.filter((r) => localStorage.getItem(key(slug, r.id))).map((r) => r.id)));
    } catch {
      // storage unavailable
    }
  }, [slug]);

  const react = (id: ReactionId) => {
    if (reacted.has(id)) return;
    setReacted((s) => new Set(s).add(id));
    setPopped(id);
    window.setTimeout(() => setPopped(null), 600);
    try {
      localStorage.setItem(key(slug, id), "1");
    } catch {
      // ignore
    }
    sendEvent({ slug, event: "react", reaction: id });
  };

  return (
    <div>
      <p aria-live="polite" className="font-urbanist text-[15px] font-semibold text-ink">
        {reacted.size > 0 ? "Thanks, that helps us write better." : "Was this article helpful?"}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {REACTIONS.map((r) => {
          const count = stats?.[slug]?.reactions[r.id] ?? 0;
          const active = reacted.has(r.id);
          const Icon = REACTION_ICONS[r.id];
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => react(r.id)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 font-urbanist text-[13px] font-semibold transition-[background-color,border-color,color,transform] duration-200 active:scale-95 ${
                active ? "cursor-default border-[#4f46e5]/40 bg-[#eef0ff] text-[#4f46e5]" : "border-hairline-light bg-white text-ink-dim hover:-translate-y-0.5 hover:border-[#0b0f19]/[0.2] hover:text-ink"
              }`}
            >
              <Icon
                size={14}
                strokeWidth={1.9}
                aria-hidden
                className={`transition-transform duration-300 ${popped === r.id ? "scale-150 -rotate-12" : ""} ${active ? "fill-current" : ""}`}
              />
              {r.label}
              {count > 0 && <span className="tabular-nums opacity-70">{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

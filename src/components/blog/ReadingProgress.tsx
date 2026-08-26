"use client";

import { useEffect, useState } from "react";

/** Thin fixed bar just below the header, filling as the reader scrolls through the article content specifically (not the related-posts/CTA sections after it). */
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const scrolled = window.scrollY - articleTop + viewportHeight * 0.5;
      const total = articleHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-[3px] bg-transparent" aria-hidden>
      <div
        className="h-full bg-aurora-violet transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

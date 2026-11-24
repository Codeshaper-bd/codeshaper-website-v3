"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

const X_PATH = "M3 3h4.6l4 5.8L16.2 3H21l-6.9 8.9L21.4 21h-4.6l-4.4-6.3L6.6 21H2l7.3-9.3L3 3Z";

/**
 * Select a sentence in the article → a small dark bar above it: post the
 * quote on X (with the link) or copy it (quote + link). Mouse and touch;
 * disappears on scroll, click elsewhere or Esc.
 */
export default function SelectionShare({ articleId, url, title }: { articleId: string; url: string; title: string }) {
  const [box, setBox] = useState<{ x: number; y: number; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const article = document.getElementById(articleId);
    if (!article) return;
    let t = 0;
    const read = () => {
      const sel = window.getSelection();
      const text = sel?.toString().replace(/\s+/g, " ").trim() ?? "";
      if (!sel || sel.rangeCount === 0 || text.length < 12 || text.length > 280 || !article.contains(sel.anchorNode)) {
        setBox(null);
        return;
      }
      const r = sel.getRangeAt(0).getBoundingClientRect();
      setCopied(false);
      setBox({ x: r.left + r.width / 2, y: r.top, text });
    };
    const later = () => {
      window.clearTimeout(t);
      t = window.setTimeout(read, 120);
    };
    const hide = (e?: Event) => {
      if (e && barRef.current?.contains(e.target as Node)) return;
      setBox(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBox(null);
    const onScroll = () => hide();
    document.addEventListener("selectionchange", later);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("selectionchange", later);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
    };
  }, [articleId]);

  if (!box) return null;
  const quote = `“${box.text}”`;
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${quote} — ${title}`)}&url=${encodeURIComponent(url)}`;

  return (
    <div
      ref={barRef}
      role="toolbar"
      aria-label="Share the selected text"
      onMouseDown={(e) => e.preventDefault()} // keep the selection
      className="fixed z-[70] flex -translate-x-1/2 -translate-y-full items-center gap-0.5 rounded-full bg-[#0b0f19] p-1 shadow-[0_12px_30px_-10px_rgba(11,15,25,0.55)]"
      style={{ left: Math.min(Math.max(box.x, 110), window.innerWidth - 110), top: box.y - 10 }}
    >
      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-urbanist text-[12.5px] font-semibold text-white transition-colors hover:bg-white/10"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d={X_PATH} />
        </svg>
        Post quote
      </a>
      <span aria-hidden className="h-4 w-px bg-white/15" />
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(`${quote}\n${title}\n${url}`);
            setCopied(true);
            window.setTimeout(() => setBox(null), 900);
          } catch {
            // clipboard unavailable
          }
        }}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-urbanist text-[12.5px] font-semibold text-white transition-colors hover:bg-white/10"
      >
        {copied ? <Check size={13} strokeWidth={2.2} aria-hidden /> : <Copy size={13} strokeWidth={2} aria-hidden />}
        {copied ? "Copied" : "Copy"}
      </button>
      <span aria-hidden className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-[#0b0f19]" />
    </div>
  );
}

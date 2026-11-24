"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { slugifyHeading } from "@/lib/blog";

type Heading = string | { id: string; text: string };
const idOf = (h: Heading) => (typeof h === "string" ? slugifyHeading(h) : h.id);
const textOf = (h: Heading) => (typeof h === "string" ? h : h.text);

/** The heading the reader is in, and how far through the article they are (0–1). */
function useReading(headings: Heading[], articleId: string) {
  const [activeId, setActiveId] = useState(() => (headings[0] ? idOf(headings[0]) : ""));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(idOf(h))).filter((el): el is HTMLElement => Boolean(el));
    const article = document.getElementById(articleId);
    let raf = 0;
    const update = () => {
      raf = 0;
      // the last heading whose top has passed a line 30% down the screen
      const line = window.innerHeight * 0.3;
      let current = els[0]?.id ?? "";
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
      setActiveId(current);
      if (article) {
        const r = article.getBoundingClientRect();
        const total = r.height - window.innerHeight * 0.6;
        setProgress(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [headings, articleId]);

  return { activeId, progress };
}

function Links({ headings, activeId, onPick }: { headings: Heading[]; activeId: string; onPick?: () => void }) {
  return (
    <ol className="space-y-1 border-l border-[#0b0f19]/[0.08]">
      {headings.map((h) => {
        const id = idOf(h);
        const active = activeId === id;
        return (
          <li key={id} className="-ml-px">
            <a
              href={`#${id}`}
              onClick={onPick}
              aria-current={active ? "location" : undefined}
              className={`block border-l-2 py-1.5 pl-4 font-urbanist text-[13.5px] leading-snug transition-colors duration-200 ${
                active ? "border-[#4f46e5] font-semibold text-ink" : "border-transparent text-ink-dim hover:text-ink"
              }`}
            >
              {textOf(h)}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * "On this page". Desktop: a quiet list in the sticky rail with the reading
 * progress above it. Phones: one collapsed row above the article that opens
 * the same list (so it never pushes the article a screen down).
 */
export default function TableOfContents({
  headings,
  articleId,
  readingMinutes = 0,
  variant = "rail",
}: {
  headings: Heading[];
  articleId: string;
  readingMinutes?: number;
  variant?: "rail" | "mobile";
}) {
  const { activeId, progress } = useReading(headings, articleId);
  const [open, setOpen] = useState(false);
  if (headings.length === 0) return null;
  const pct = Math.round(progress * 100);
  const left = Math.ceil(readingMinutes * (1 - progress));
  const status = pct >= 98 ? "Finished" : progress > 0.02 && readingMinutes ? `${left} min left` : readingMinutes ? `${readingMinutes} min read` : `${pct}%`;

  if (variant === "mobile") {
    return (
      <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent lg:hidden">
        <div className="h-full bg-[#4f46e5] transition-[width] duration-150" style={{ width: `${pct}%` }} />
      </div>
      <nav aria-label="On this page" className="rounded-[20px] border border-hairline-light bg-white">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-urbanist"
        >
          <span className="text-[14px] font-semibold text-ink">On this page</span>
          <span className="flex items-center gap-2 text-[12.5px] text-ink-faint">
            {status}
            <ChevronDown size={16} strokeWidth={2} aria-hidden className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </span>
        </button>
        {open && (
          <div className="px-5 pb-5">
            <Links headings={headings} activeId={activeId} onPick={() => setOpen(false)} />
          </div>
        )}
      </nav>
      </>
    );
  }

  return <RailList headings={headings} activeId={activeId} pct={pct} status={status} />;
}

/**
 * The rail's list (owner, 24 Nov 2026: the rail looked cut off). The list
 * takes the room left in the sticky rail and scrolls on its own: a fade shows
 * there is more below, and the section being read is kept in view.
 */
function RailList({ headings, activeId, pct, status }: { headings: Heading[]; activeId: string; pct: number; status: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState({ up: false, down: false });

  const measure = useCallback(() => {
    const el = box.current;
    if (!el) return;
    setMore({ up: el.scrollTop > 4, down: el.scrollTop + el.clientHeight < el.scrollHeight - 4 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // keep the current section visible inside the list
  useEffect(() => {
    const el = box.current;
    const item = el?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!el || !item) return;
    const top = item.offsetTop;
    if (top < el.scrollTop + 8 || top + item.offsetHeight > el.scrollTop + el.clientHeight - 24) {
      el.scrollTo({ top: Math.max(0, top - el.clientHeight / 3), behavior: "smooth" });
    }
  }, [activeId]);

  const fade = `linear-gradient(to bottom, ${more.up ? "transparent, black 28px" : "black"}, ${more.down ? "black calc(100% - 40px), transparent" : "black"})`;

  return (
    <nav aria-label="On this page" className="flex min-h-0 flex-col">
      <div className="mb-4 flex items-center justify-between font-urbanist">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">On this page</p>
        <p aria-live="off" className="text-[12px] font-medium tabular-nums text-ink-faint">{status}</p>
      </div>
      <div aria-hidden className="mb-5 h-[3px] shrink-0 overflow-hidden rounded-full bg-[#0b0f19]/[0.07]">
        <div className="h-full rounded-full bg-[#4f46e5] transition-[width] duration-150" style={{ width: `${pct}%` }} />
      </div>
      <div
        ref={box}
        data-lenis-prevent
        onScroll={measure}
        className="no-scrollbar relative min-h-0 overflow-y-auto overscroll-contain pr-1"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      >
        <Links headings={headings} activeId={activeId} />
      </div>
    </nav>
  );
}

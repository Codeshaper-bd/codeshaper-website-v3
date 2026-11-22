"use client";

import { useEffect, useState } from "react";
import { slugifyHeading } from "@/lib/blog";

type Heading = string | { id: string; text: string };
const idOf = (h: Heading) => (typeof h === "string" ? slugifyHeading(h) : h.id);
const textOf = (h: Heading) => (typeof h === "string" ? h : h.text);

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>(() => (headings[0] ? idOf(headings[0]) : ""));

  useEffect(() => {
    const ids = headings.map(idOf);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-2xl border border-hairline-light bg-light-raised p-5">
      <p className="mb-3 font-urbanist text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        Table of Contents
      </p>
      <ul className="space-y-2.5 border-l border-hairline-light">
        {headings.map((heading) => {
          const id = idOf(heading);
          const active = activeId === id;
          return (
            <li key={id} className="-ml-px">
              <a
                href={`#${id}`}
                className={`block border-l-2 py-0.5 pl-3 font-urbanist text-[13px] leading-snug transition-colors duration-200 ${
                  active ? "border-aurora-violet font-semibold text-aurora-violet" : "border-transparent text-ink-dim hover:text-ink"
                }`}
              >
                {textOf(heading)}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

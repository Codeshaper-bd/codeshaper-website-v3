"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

/** A small "copy link to this section" button beside an article heading (shows on hover/focus). */
export default function HeadingLink({ id, label }: { id: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const url = `${window.location.origin}${window.location.pathname}#${id}`;
        try {
          await navigator.clipboard.writeText(url);
          window.history.replaceState(window.history.state, "", `#${id}`);
          setDone(true);
          window.setTimeout(() => setDone(false), 1400);
        } catch {
          // clipboard unavailable
        }
      }}
      aria-label={`Copy link to “${label}”`}
      className="ml-2 inline-grid h-8 w-8 translate-y-[-3px] place-items-center rounded-full align-middle text-ink-faint opacity-0 transition-[opacity,background-color,color] duration-200 hover:bg-white hover:text-ink focus-visible:opacity-100 group-hover/h:opacity-100 max-lg:hidden"
    >
      {done ? <Check size={15} strokeWidth={2.2} className="text-[#4f46e5]" aria-hidden /> : <Link2 size={15} strokeWidth={2} aria-hidden />}
      {done && (
        <span role="status" className="sr-only">
          Link copied
        </span>
      )}
    </button>
  );
}

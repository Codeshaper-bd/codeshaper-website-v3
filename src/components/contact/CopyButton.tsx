"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies a value (an email or a number) and says so for a moment. Sits above the card's link (z-10). */
export default function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={done ? "Copied" : label}
      title={done ? "Copied" : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          window.setTimeout(() => setDone(false), 1600);
        } catch {
          /* clipboard blocked: the link still works */
        }
      }}
      className="relative z-10 grid h-9 w-9 place-items-center rounded-full border border-[#0b0f19]/[0.08] bg-white text-ink-dim transition-colors hover:border-[#0b0f19]/[0.16] hover:text-ink"
    >
      {done ? <Check size={15} className="text-[#16a34a]" aria-hidden /> : <Copy size={15} aria-hidden />}
    </button>
  );
}

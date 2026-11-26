"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { saveBrief } from "@/lib/briefHandoff";

/**
 * UX01 prototype only: the hero's quiet way to a person, in place of "Rather talk? Book a call"
 * (owner, 26 Nov 2026; booking stays in the navigation). Whatever is typed in the hero box goes
 * with it, kept in this tab and never in the address.
 */
export default function HeroContactLink() {
  const carry = (e: MouseEvent<HTMLAnchorElement>) => {
    const box = document.getElementById("hero-brief") as HTMLTextAreaElement | null;
    if (!box?.value.trim() || saveBrief(box.value)) return;
    // the browser would not keep the words: let the box's own plain form take them
    e.preventDefault();
    box.form?.submit();
  };

  return (
    <Link href="/contact" onClick={carry} className="group inline-flex min-h-10 items-center gap-1.5 text-[#4b5263] transition-colors duration-200 hover:text-[#0b0f19]">
      Prefer to write?
      <span className="font-semibold text-[#0b0f19] underline decoration-[#0b0f19]/25 underline-offset-[5px] transition-[text-decoration-color] duration-200 group-hover:decoration-[#0b0f19]">Contact form</span>
      <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5 text-[#0b0f19] transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </Link>
  );
}

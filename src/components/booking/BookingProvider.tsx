"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Founder } from "@/lib/founders";

/**
 * Every "Book a call" on the site opens one booking window instead of
 * leaving the page (owner, 24 Nov 2026): CodeShaper and both founders on the
 * left, the calendar on the right.
 *
 * Nothing on the pages changes: a click on a link to /contact whose words ask
 * to book ("Book a Call", "Book a free call", "Book your free call"), or any
 * link marked data-booking, opens the window. Ctrl/⌘/middle clicks, and
 * visitors without JavaScript, still go to /contact as before. The window
 * itself (and the calendar) loads only on the first click.
 */
const BookingDialog = dynamic(() => import("./BookingDialog"), { ssr: false });

const ASKS_TO_BOOK = /\bbook\b/i;

export type Channels = { email: string; phone: string; whatsapp: string };

export default function BookingProvider({ calLink, founders, minutes, channels }: { calLink?: string; founders: Founder[]; minutes: number; channels: Channels }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const marked = a.hasAttribute("data-booking");
      let toContact = false;
      try {
        const url = new URL(a.href, window.location.href);
        toContact = url.origin === window.location.origin && url.pathname.replace(/\/$/, "") === "/contact" && !url.hash;
      } catch {
        return;
      }
      if (!marked && !(toContact && ASKS_TO_BOOK.test(a.textContent ?? ""))) return;
      e.preventDefault();
      setOpen(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return open ? <BookingDialog calLink={calLink} founders={founders} minutes={minutes} channels={channels} onClose={() => setOpen(false)} /> : null;
}

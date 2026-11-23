"use client";

import { useEffect, useState } from "react";

/**
 * An office's local time ("3:42 PM"), from the visitor's own clock and the
 * office's IANA time zone, refreshed each minute. Empty on the server (and
 * for one frame in the browser), so the page never shows a stale or
 * mismatched time.
 */
export default function LocalTime({ zone }: { zone: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "numeric", minute: "2-digit" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [zone]);
  return (
    <span className="inline-flex items-center gap-1.5 tabular-nums" aria-label={time ? `Local time ${time}` : undefined}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#16a34a] shadow-[0_0_0_3px_rgba(22,163,74,0.15)]" />
      <span className="min-w-[4.2em]">{time}</span>
    </span>
  );
}

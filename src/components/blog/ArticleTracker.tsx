"use client";

import { useEffect } from "react";
import { once, sendEvent } from "./blogStatsClient";

/**
 * Counts how the article is read (numbers go to the CMS):
 *  · view: the page was opened (once per tab session);
 *  · read: the reader went through 60% of the article AND spent real time
 *    on it (20 s, or a quarter of the reading time if longer; once a day);
 *  · time: seconds actually spent with the tab visible, sent as they leave.
 */
export default function ArticleTracker({ slug, articleId, readingMinutes }: { slug: string; articleId: string; readingMinutes: number }) {
  useEffect(() => {
    if (once(`view:${slug}`, "session")) sendEvent({ slug, event: "view" });

    const needSeconds = Math.max(20, Math.round(readingMinutes * 60 * 0.25));
    let active = 0; // ms with the tab visible
    let since = document.visibilityState === "visible" ? performance.now() : 0;
    let deepest = 0;
    let readSent = false;
    let timeSent = false;

    const activeSeconds = () => (active + (since ? performance.now() - since : 0)) / 1000;
    const checkRead = () => {
      if (readSent || deepest < 0.6 || activeSeconds() < needSeconds) return;
      readSent = true;
      if (once(`read:${slug}`, "day")) sendEvent({ slug, event: "read" });
    };
    const onScroll = () => {
      const el = document.getElementById(articleId);
      if (!el) return;
      const r = el.getBoundingClientRect();
      deepest = Math.max(deepest, Math.min(1, (window.innerHeight - r.top) / r.height));
      checkRead();
    };
    const flushTime = () => {
      const s = Math.round(activeSeconds());
      if (timeSent || s < 5) return;
      timeSent = true;
      sendEvent({ slug, event: "time", seconds: Math.min(s, 3600) }, true);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (since) active += performance.now() - since;
        since = 0;
        flushTime();
      } else {
        since = performance.now();
        timeSent = false; // a returning reader adds the new time on the next leave
        active = 0;
      }
    };
    const tick = window.setInterval(checkRead, 5000);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flushTime);
    return () => {
      flushTime(); // client-side navigation away
      window.clearInterval(tick);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flushTime);
    };
  }, [slug, articleId, readingMinutes]);

  return null;
}

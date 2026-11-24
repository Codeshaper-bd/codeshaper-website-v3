"use client";

import { useSyncExternalStore } from "react";
import type { BlogEvent, PublicStats, ReactionId } from "@/lib/blogReactions";

/**
 * The public blog numbers in the browser: fetched once per page load
 * (shared by every card and the article), and updated in place when this
 * reader opens an article or reacts.
 */
type Totals = Record<string, PublicStats>;

let totals: Totals | null = null;
let started = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function load() {
  if (started) return;
  started = true;
  fetch("/api/blog/stats")
    .then((r) => (r.ok ? r.json() : null))
    .then((d: Totals | null) => {
      if (d) {
        // keep anything this reader already added before the numbers arrived
        totals = { ...d, ...Object.fromEntries(Object.entries(totals ?? {}).filter(([k]) => !d[k])) };
        emit();
      }
    })
    .catch(() => {});
}

export function useBlogStats(): Totals | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      load();
      return () => listeners.delete(l);
    },
    () => totals,
    () => null,
  );
}

function bump(slug: string, f: (s: PublicStats) => void) {
  if (!totals?.[slug]) return;
  const next = { ...totals[slug], reactions: { ...totals[slug].reactions } };
  f(next);
  totals = { ...totals, [slug]: next };
  emit();
}

/** Sends an event. `beacon` for the last one as the page closes. */
export function sendEvent(e: BlogEvent, beacon = false) {
  if (e.event === "view") bump(e.slug, (s) => (s.reads += 1));
  if (e.event === "react") bump(e.slug, (s) => (s.reactions[e.reaction as ReactionId] += 1));
  const body = JSON.stringify(e);
  if (beacon && navigator.sendBeacon?.("/api/blog/stats", new Blob([body], { type: "text/plain" }))) return;
  fetch("/api/blog/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
}

// once per tab session (views) / once per day (reads), per article
export function once(key: string, scope: "session" | "day"): boolean {
  try {
    const store = scope === "session" ? sessionStorage : localStorage;
    const today = new Date().toISOString().slice(0, 10);
    const k = `codeshaper:blog:${key}`;
    const v = store.getItem(k);
    if (scope === "session" ? v : v === today) return false;
    store.setItem(k, scope === "session" ? "1" : today);
    return true;
  } catch {
    return true;
  }
}

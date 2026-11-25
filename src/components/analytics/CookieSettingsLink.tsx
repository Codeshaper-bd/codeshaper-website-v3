"use client";

import { COOKIE_SETTINGS_EVENT, HAS_COOKIE_CHOICE } from "./Tracking";

/** "Cookie settings" in the footer: only when a tracking tool is on and visitors are asked first. */
export default function CookieSettingsLink({ className = "" }: { className?: string }) {
  if (!HAS_COOKIE_CHOICE) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))} className={className}>
      Cookie settings
    </button>
  );
}

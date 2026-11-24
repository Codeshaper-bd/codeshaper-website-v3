"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Cal, { getCalApi } from "@calcom/embed-react";
import type Lenis from "lenis";
import { ArrowRight, CalendarClock, Check, Mail, MessageSquareText, Phone, X } from "lucide-react";
import type { Channels } from "./BookingProvider";

const digits = (v: string) => v.replace(/[^+\d]/g, "");

/** WhatsApp's mark (lucide has none). */
function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.42 9.43-9.42 2.52 0 4.88.98 6.66 2.76a9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.23 9.42-9.43 9.42Zm8.02-17.45A11.3 11.3 0 0 0 12.04.75C5.79.75.7 5.83.7 12.08c0 2 .52 3.95 1.52 5.67L.6 23.25l5.63-1.48a11.3 11.3 0 0 0 5.8 1.48h.01c6.25 0 11.34-5.09 11.34-11.34 0-3.03-1.18-5.88-3.32-8.02Z" />
    </svg>
  );
}
import MarkSvg from "@/components/brand/MarkSvg";
// types only: founders.ts reads server-only content, so its values come in as props
import type { Founder } from "@/lib/founders";

/**
 * The booking window (owner, 24 Nov 2026). Left: who you will talk to (the
 * brand, both founders, what the call gives you). Right: the Cal.com calendar,
 * in the site's colours, or the message form ("Prefer to write?"), switched in
 * place. The backdrop is the same light frosted glow as the service windows.
 * Phones: one scrolling sheet, founders first.
 * With no calendar link set in the CMS, the right side says so and offers the
 * message form (nothing pretends to be bookable).
 */
const ContactForm = dynamic(() => import("@/components/sections/ContactForm"), { ssr: false });

const promises = (minutes: number) => [`Free ${minutes}-minute video call`, "One to one with a founder, not a sales team", "Leave with a clear next step"];

/** "https://cal.com/codeshaper/30min" → { origin, path } for the embed */
function parseCal(link?: string) {
  if (!link) return null;
  try {
    const u = new URL(link);
    const path = u.pathname.replace(/^\/|\/$/g, "");
    if (!path) return null;
    // cal.com's own links embed from app.cal.com; a custom Cal domain embeds from itself
    return { origin: u.hostname === "cal.com" ? "https://app.cal.com" : u.origin, path };
  } catch {
    return null;
  }
}

export default function BookingDialog({ calLink, founders, minutes, channels, onClose }: { calLink?: string; founders: Founder[]; minutes: number; channels: Channels; onClose: () => void }) {
  const cal = parseCal(calLink);
  const closeRef = useRef<HTMLButtonElement>(null);
  const rightRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<"calendar" | "message">("calendar");

  // open: lock the page, pause smooth scroll, focus the close button; Esc closes; focus returns on close
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
      lenis?.start();
      before?.focus?.();
    };
  }, [onClose]);

  // the calendar in the site's colours, without its own event-details column (the left side says it)
  useEffect(() => {
    if (!cal) return;
    let live = true;
    getCalApi({ embedJsUrl: `${cal.origin}/embed/embed.js` }).then((api) => {
      if (!live) return;
      // event details stay visible: they carry the time zone picker and the meeting app (Meet / Zoom) choice
      // our colours inside Cal.com: brand indigo, our ink and greys, and no box of its own (the window is the frame)
      const look = {
        "cal-brand": "#4f46e5",
        "cal-brand-emphasis": "#4338ca",
        "cal-text-emphasis": "#0b0f19",
        "cal-text": "#3f3d56",
        "cal-text-subtle": "#6b7183",
        "cal-border-booker": "transparent",
        "cal-border-subtle": "rgba(11,15,25,0.08)",
        "cal-border": "rgba(11,15,25,0.12)",
        "cal-bg-subtle": "#f3f2f7",
        "cal-bg-emphasis": "#ecebf3",
      };
      api("ui", { theme: "light", hideEventTypeDetails: false, layout: "month_view", cssVarsPerTheme: { light: look, dark: look } });
      api("on", { action: "linkReady", callback: () => setReady(true) });
    });
    const fallback = window.setTimeout(() => live && setReady(true), 4000);
    return () => {
      live = false;
      window.clearTimeout(fallback);
    };
  }, [cal?.origin, cal?.path]); // eslint-disable-line react-hooks/exhaustive-deps

  // switching views: bring the right side into view (phones scroll one sheet)
  const show = (v: "calendar" | "message") => {
    setView(v);
    requestAnimationFrame(() => rightRef.current?.scrollIntoView({ block: "start", behavior: "smooth" }));
  };

  const people = ["CEO", "CTO"].map((t) => founders.find((f) => f.title === t)).filter(Boolean) as Founder[];

  return (
    <div
      data-lenis-prevent
      // theme-light: the window sits outside the page wrappers that set the light colour tokens;
      // booking-overlay: the same frosted backdrop with brand glows as the service windows
      className="booking-overlay theme-light fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-5"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        // phones: one scrolling column (founders, then the calendar); from lg: two columns side by side
        className="booking-panel relative flex h-[100svh] w-full flex-col overflow-y-auto overscroll-contain bg-white shadow-[0_50px_120px_-50px_rgba(45,38,120,0.55),0_0_0_1px_rgba(11,15,25,0.05)] sm:h-[min(820px,calc(100svh-2.5rem))] sm:max-w-[1340px] sm:overflow-hidden sm:rounded-[30px] lg:grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-[0_2px_10px_-3px_rgba(11,15,25,0.3)] ring-1 ring-[#0b0f19]/[0.06] transition-colors hover:bg-white sm:right-4 sm:top-4"
        >
          <X size={18} strokeWidth={2} aria-hidden />
        </button>

        {/* left: who you will talk to */}
        <aside className="no-scrollbar relative isolate flex shrink-0 flex-col overflow-hidden bg-[#f6f5fb] px-6 pb-6 pt-6 sm:px-9 sm:pt-9 lg:overflow-y-auto lg:pb-9">
          {/* the soft glows sit in their own clipped layer, so they never make the panel scrollable */}
          <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <span className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,#dcd6ff,transparent)]" />
            <span className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,#ffe1ec,transparent)]" />
          </span>

          <span className="flex items-center gap-2">
            <span className="relative block h-8 w-8">
              <MarkSvg premium pearls className="h-full w-full drop-shadow-[0_4px_10px_rgba(97,95,255,0.35)]" id="booking-mark" />
            </span>
            <span className="font-display text-[20px] font-extrabold leading-none tracking-[-0.02em] text-ink">CodeShaper</span>
          </span>

          <p className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 font-urbanist text-[12px] font-semibold text-ink ring-1 ring-white">
            <span aria-hidden className="h-2 w-2 rounded-full bg-emerald-500" />
            Free {minutes}-minute call
          </p>
          <h2 id="booking-title" className="mt-4 text-balance font-urbanist text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[34px]">
            Talk it through with our founders.
          </h2>
          <p className="mt-3 font-urbanist text-[15px] leading-relaxed text-ink-mid">
            Bring your idea, your deadline or the system that keeps you up at night. Pick a time that suits you.
          </p>

          {/* the founders: real photos, names and titles (compact: a face and a name is enough here) */}
          <figure className="mt-6 flex items-center gap-3 rounded-[18px] bg-white p-3 pr-3 shadow-[0_14px_30px_-22px_rgba(79,70,229,0.55)] ring-1 ring-[#0b0f19]/[0.05]">
            <div className="flex shrink-0 -space-x-2.5">
              {people.map((p) => (
                <span key={p.photo} className="relative block h-10 w-10 overflow-hidden rounded-full bg-[#e6e5ea] ring-[3px] ring-white">
                  <Image src={p.photo} alt={p.name} fill sizes="96px" quality={85} className="origin-[50%_30%] scale-[1.45] object-cover object-[52%_25%]" />
                </span>
              ))}
            </div>
            {/* one founder per line: fits the narrower panel without wrapping */}
            <figcaption className="min-w-0 space-y-0.5">
              {people.map((p) => (
                <p key={p.name} className="whitespace-nowrap font-urbanist text-[13px] leading-snug">
                  <span className="font-bold text-ink">{p.name}</span>
                  <span className="text-ink-dim"> · {p.title}</span>
                </p>
              ))}
            </figcaption>
          </figure>

          <ul className="mt-6 space-y-2.5">
            {promises(minutes).map((t) => (
              <li key={t} className="flex items-start gap-2.5 font-urbanist text-[14px] text-ink-mid">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#4f46e5]/10 text-[#4f46e5]">
                  <Check size={12} strokeWidth={2.6} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>

          {/* other direct ways to reach us (the company's published details) */}
          {/* simple icons in a row (owner, 24 Nov 2026: "not boxes"); the detail shows in a tooltip */}
          <div className="mt-auto flex items-center gap-3 pt-7">
            <p className="font-urbanist text-[13px] text-ink-dim">Or reach us on</p>
            <div className="flex items-center gap-2">
              {[
                { icon: WhatsAppIcon, label: "WhatsApp", value: channels.whatsapp, href: `https://wa.me/${digits(channels.whatsapp).replace("+", "")}`, hover: "hover:text-[#128c4a]" },
                { icon: Mail, label: "Email", value: channels.email, href: `mailto:${channels.email}`, hover: "hover:text-[#4f46e5]" },
                { icon: Phone, label: "Phone", value: channels.phone, href: `tel:${digits(channels.phone)}`, hover: "hover:text-[#0369a1]" },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  aria-label={`${c.label}: ${c.value}`}
                  target={c.label === "WhatsApp" ? "_blank" : undefined}
                  rel={c.label === "WhatsApp" ? "noopener noreferrer" : undefined}
                  className={`group relative grid h-10 w-10 place-items-center rounded-full bg-white text-ink-mid shadow-[0_2px_8px_-3px_rgba(11,15,25,0.2)] ring-1 ring-[#0b0f19]/[0.06] transition-[color,transform] duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 ${c.hover}`}
                >
                  <c.icon size={17} aria-hidden />
                  {/* tooltip: what and where, on hover or keyboard focus */}
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[10px] bg-[#0b0f19] px-3 py-2 text-left font-urbanist opacity-0 shadow-[0_10px_24px_-10px_rgba(11,15,25,0.6)] transition-[opacity,transform] duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                  >
                    <span className="block text-[11px] font-medium text-white/60">{c.label}</span>
                    <span className="block text-[13px] font-semibold text-white">{c.value}</span>
                    <span aria-hidden className="absolute left-1/2 top-full -translate-x-1/2 border-[5px] border-transparent border-t-[#0b0f19]" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* right: the calendar, or the message form */}
        <section ref={rightRef} aria-label={view === "calendar" ? "Choose a time" : "Send us a message"} className="relative flex min-h-[640px] shrink-0 flex-col bg-white lg:min-h-0">
          {/* two ways to reach us, always one click apart (owner, 24 Nov 2026) */}
          <div role="tablist" aria-label="How to reach us" className="flex shrink-0 items-center px-5 pb-1 pt-4 pr-16 sm:px-8 sm:pt-5">
            <div className="inline-flex rounded-full bg-[#f3f2f7] p-1 ring-1 ring-[#0b0f19]/[0.05]">
              {([
                ["calendar", "Book a call", CalendarClock],
                ["message", "Send a message", MessageSquareText],
              ] as const).map(([v, label, Icon]) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => show(v)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-urbanist text-[13.5px] font-semibold transition-[background-color,color,box-shadow] duration-200 ${
                    view === v ? "bg-white text-ink shadow-[0_2px_8px_-3px_rgba(11,15,25,0.25)]" : "text-ink-dim hover:text-ink"
                  }`}
                >
                  <Icon size={15} strokeWidth={2} aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div role="tabpanel" className="relative min-h-0 flex-1">
          {view === "message" ? (
            <div className="no-scrollbar h-full overflow-y-auto px-6 pb-8 pt-5 sm:px-10">
              <h3 className="font-urbanist text-[26px] font-bold leading-tight tracking-[-0.015em] text-ink">Send us a message</h3>
              <p className="mb-7 mt-2 max-w-xl font-urbanist text-[15px] leading-relaxed text-ink-mid">A few lines is enough. We reply within one business day.</p>
              <ContactForm bare formId="booking-contact-form" />
            </div>
          ) : cal ? (
            <>
              {!ready && (
                <div aria-hidden className="absolute inset-0 grid place-items-center">
                  <span className="flex items-center gap-2 font-urbanist text-[14px] text-ink-dim">
                    <CalendarClock size={18} className="animate-pulse" /> Loading available times…
                  </span>
                </div>
              )}
              {/* the calendar sits right under the tabs (owner: "put it at the top"); it takes its own height and the panel scrolls */}
              <div data-lenis-prevent className="no-scrollbar h-full overflow-y-auto overscroll-contain">
                {/* Cal.com's own three columns side by side: details with the time zone picker | month | times.
                    The time zone picker exists only there (Cal.com does not take a time zone from outside). */}
                <Cal
                  calLink={cal.path}
                  calOrigin={cal.origin}
                  config={{ layout: "month_view", theme: "light" }}
                  style={{ width: "100%" }}
                  // narrow enough that Cal.com stacks itself: event details and time zone on top, then the month, then the times (owner)
                  className="w-full px-3 pb-4 pt-0 sm:px-5"
                />
              </div>
            </>
          ) : (
            // no calendar link yet (CMS › Settings › Contact › Booking calendar): say so, offer the form here
            <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-[18px] bg-[#4f46e5]/10 text-[#4f46e5]">
                <CalendarClock size={26} strokeWidth={1.8} aria-hidden />
              </span>
              <h3 className="mt-5 font-urbanist text-[22px] font-bold text-ink">Online booking is coming soon</h3>
              <p className="mt-2 max-w-sm font-urbanist text-[15px] leading-relaxed text-ink-mid">
                Send us a short message instead and we&apos;ll reply within one business day with times that suit you.
              </p>
              <button
                type="button"
                onClick={() => show("message")}
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#0b0f19] py-3.5 pl-6 pr-5 font-urbanist text-[15px] font-semibold text-white transition-colors hover:bg-[#1f2433]"
              >
                Send a message
                <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
          </div>
        </section>
      </div>
    </div>
  );
}

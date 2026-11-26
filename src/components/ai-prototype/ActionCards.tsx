"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, ChevronDown, Loader2 } from "lucide-react";
import { contactErrors, type Contact, type ContactField } from "@/lib/ai/actions";

/** On submit: show what is wrong and go to it, or move to the review. */
function check(contact: Contact, prefix: string, review: () => void) {
  const wrong = Object.keys(contactErrors(contact))[0];
  if (wrong) document.getElementById(`${prefix}-${wrong}`)?.focus();
  else review();
}
import { briefToText, hasBrief, type BriefFields } from "@/lib/ai/contract";
import type { Proposal } from "@/lib/ai/proposals";
import { AREA, FIELD, FIELD_LABEL, GHOST, LINK, META, PRIMARY, SURFACE, TITLE } from "./ui";
import type { Actions } from "./useActions";
import styles from "./ai.module.css";

/**
 * Completing things inside the conversation: write to the team, or choose a time. Fields appear only
 * where exact input is needed. Every action is reviewed and confirmed by the visitor, every result
 * here is SIMULATED and says so, and none of these details go to the assistant.
 */
const KEPT = "These details stay out of the AI conversation.";
/** The traditional page, in a new tab so this conversation stays. */
const Fallback = () => (
  <a href="/contact" target="_blank" rel="noopener" className={LINK}>
    Open the contact page<span className="sr-only"> (opens in a new tab)</span>
  </a>
);

/** Keeps a card's new step in view and lets keyboard and screen-reader users follow it. */
function useStep(state: string) {
  const heading = useRef<HTMLHeadingElement>(null);
  const seen = useRef(state);
  useEffect(() => {
    // only a real change of step: not the card appearing
    if (seen.current === state) return;
    seen.current = state;
    const el = heading.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.closest("section")?.scrollIntoView({ block: "nearest" });
  }, [state]);
  return heading;
}

function Head({ heading, title, note }: { heading: React.RefObject<HTMLHeadingElement | null>; title: string; note: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
      <h3 ref={heading} tabIndex={-1} className={`!outline-none ${TITLE}`}>
        {title}
      </h3>
      <span className={META}>{note}</span>
    </div>
  );
}

function Input({ id, label, optional, value, error, onChange, type = "text", autoComplete, area }: { id: string; label: string; optional?: boolean; value: string; error?: string; onChange: (v: string) => void; type?: string; autoComplete?: string; area?: boolean }) {
  const props = { id, value, "aria-invalid": !!error, "aria-describedby": error ? `${id}-error` : undefined, autoComplete, onChange: (e: { target: { value: string } }) => onChange(e.target.value) };
  return (
    <div className={area ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
        {optional && <span className="font-normal text-content-muted"> (optional)</span>}
      </label>
      {area ? <textarea rows={2} maxLength={2000} className={AREA} {...props} /> : <input type={type} className={FIELD} {...props} />}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[12.5px] text-[#b91c1c]">
          {error}
        </p>
      )}
    </div>
  );
}

const Rows = ({ rows }: { rows: [string, string][] }) => (
  <dl className="mt-2.5 space-y-1">
    {rows.map(([k, v]) => (
      <div key={k} className="grid gap-x-3 sm:grid-cols-[104px_minmax(0,1fr)]">
        <dt className="pt-px text-[12.5px] text-content-muted">{k}</dt>
        <dd className="whitespace-pre-wrap break-words text-[14px] leading-relaxed text-content">{v}</dd>
      </div>
    ))}
  </dl>
);

/** A finished step is a sentence in the conversation, not the record again. */
function Done({ heading, title, children }: { heading: React.RefObject<HTMLHeadingElement | null>; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-success text-white">
        <Check size={10} strokeWidth={3.5} aria-hidden />
      </span>
      <div className="min-w-0">
        <h3 ref={heading} tabIndex={-1} className={`!outline-none ${TITLE}`}>
          {title}
        </h3>
        <div className="text-[14px] leading-relaxed text-content">{children}</div>
      </div>
    </div>
  );
}

const Sending = ({ text }: { text: string }) => (
  // as tall as the buttons it replaces, so nothing moves under a second tap
  <p role="status" className="mt-3 flex min-h-9 items-center gap-2 text-[13.5px] text-content max-sm:min-h-[5.75rem] max-sm:items-start max-sm:pt-3 pointer-coarse:min-h-11">
    <Loader2 size={15} aria-hidden className={`shrink-0 text-brand ${styles.spin}`} /> {text}
  </p>
);

function Problem({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-2 flex items-start gap-2 text-[13.5px] text-content">
      <AlertCircle size={15} aria-hidden className="mt-0.5 shrink-0 text-warning" />
      <span>{children}</span>
    </p>
  );
}

export function ContactCard({ actions, brief }: { actions: Actions; brief: BriefFields }) {
  const { inquiry, inquire, confirmations } = actions;
  const [tried, setTried] = useState(false);
  const heading = useStep(inquiry.state);
  const c = inquiry.contact;
  const [more, setMore] = useState(false);
  // only what is needed is asked; the rest opens on request, or when something is already in it
  const extras = more || !!c.phone || !!c.message;
  const errors = tried ? contactErrors(c) : {};
  const set = (field: ContactField) => (value: string) => inquire({ type: "CHANGE", field, value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    check(c, "ai-contact", () => inquire({ type: "REVIEW" }));
  };
  const summary = inquiry.includeBrief && hasBrief(brief) ? briefToText(brief) : "";
  const rows = ([["Name", c.name], ["Email", c.email], ["Phone", c.phone], ["Message", c.message], ["Project brief", summary]] as [string, string][]).filter(([, v]) => v);
  const title = { draft: "Write to the team", reviewing: "Check what will be shared", submitting: "Submitting", submitted: "Submitted (simulated)", failed: "It did not go through" }[inquiry.state];
  const note = { draft: "Draft", reviewing: "Waiting for your confirmation", submitting: "Pending", submitted: "Simulated result", failed: "Not sent" }[inquiry.state];

  if (inquiry.state === "submitted" && confirmations.inquiry) {
    return (
      <section aria-label="Contact the team" data-card="contact" data-state={inquiry.state} className="scroll-mt-4">
        <Done heading={heading} title="Inquiry submitted (simulated)">
          <p>
            <strong>Nothing was actually sent.</strong> Live, this appears only after our system confirms receipt.
          </p>
          <p className={META}>
            {c.email} · Reference {confirmations.inquiry.reference}
          </p>
        </Done>
      </section>
    );
  }

  return (
    <section aria-label="Contact the team" data-card="contact" data-state={inquiry.state} className={SURFACE}>
      <Head heading={heading} title={title} note={note} />
      {inquiry.state === "draft" && (
        <form
          action="/contact/continue"
          method="post"
          noValidate
          onSubmit={submit}
        >
          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
            <Input id="ai-contact-name" label="Name" autoComplete="name" value={c.name} error={errors.name} onChange={set("name")} />
            <Input id="ai-contact-email" label="Email" type="email" autoComplete="email" value={c.email} error={errors.email} onChange={set("email")} />
            {extras && (
              <>
                <Input id="ai-contact-phone" label="Phone" optional type="tel" autoComplete="tel" value={c.phone} error={errors.phone} onChange={set("phone")} />
                <Input id="ai-contact-message" label="Message" optional area value={c.message} error={errors.message} onChange={set("message")} />
              </>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4">
            {!extras && (
              <button type="button" className={`${LINK} -ml-1.5`} onClick={() => setMore(true)}>
                Add phone or message
              </button>
            )}
            {hasBrief(brief) && (
              <label className="flex min-h-9 items-center gap-2 text-[13.5px] text-content max-sm:min-h-11 pointer-coarse:min-h-11">
                <input type="checkbox" className="h-4 w-4 accent-[#0b0f19]" checked={inquiry.includeBrief} onChange={(e) => inquire({ type: "INCLUDE_BRIEF", value: e.target.checked })} />
                Include the project brief
              </label>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <button type="submit" className={PRIMARY}>
              Review
            </button>
            <p className={META}>{KEPT}</p>
          </div>
        </form>
      )}
      {(inquiry.state === "reviewing" || inquiry.state === "failed" || inquiry.state === "submitting") && (
        <>
          {inquiry.state === "failed" && <Problem>Nothing was sent (simulated failure). Your details are kept.</Problem>}
          <Rows rows={rows} />
          {inquiry.state === "submitting" ? (
            <Sending text="Submitting (simulated). Please wait for the result." />
          ) : (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button type="button" className={PRIMARY} onClick={() => inquire({ type: "CONFIRM" })}>
                {inquiry.state === "failed" ? "Try again (simulated)" : "Confirm and send (simulated)"}
              </button>
              <button type="button" className={GHOST} onClick={() => inquire({ type: "EDIT" })}>
                Edit
              </button>
              {inquiry.state === "failed" && <Fallback />}
            </div>
          )}
        </>
      )}
    </section>
  );
}

const ZONES = ["UTC", "Asia/Dhaka", "Pacific/Auckland", "Europe/London", "America/New_York"];
const show = (iso: string, timeZone: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone, ...options }).format(new Date(iso));
const when = (iso: string, zone: string) => show(iso, zone, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

type Calendar = Extract<Proposal, { type: "booking_calendar" }>;

export function BookingCard({ actions, calendar }: { actions: Actions; calendar: Calendar }) {
  const { booking, book, confirmations, timeZone, setTimeZone } = actions;
  const [day, setDay] = useState(0);
  const [tried, setTried] = useState(false);
  const heading = useStep(booking.state);
  const c = booking.contact;
  const errors = tried ? contactErrors(c) : {};
  const set = (field: ContactField) => (value: string) => book({ type: "CHANGE", field, value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    check(c, "ai-booking", () => book({ type: "REVIEW" }));
  };
  const zones = [...new Set([timeZone, ...ZONES])];
  const slots = calendar.days[day]?.slots ?? [];
  const title = { picking: "Choose a time", details: "Your details", reviewing: "Check the meeting", submitting: "Booking", confirmed: "Booked (simulated)", failed: "The booking did not go through" }[booking.state];
  const meeting: [string, string][] = booking.slot
    ? [["When", `${when(booking.slot, timeZone)} (${timeZone.replace(/_/g, " ")})`], ["Meeting", `${calendar.duration_minutes} minutes · video call (demonstration)`], ["With your details", `${c.name} · ${c.email}`]]
    : [];

  if (booking.state === "confirmed" && confirmations.booking && booking.slot) {
    return (
      <section aria-label="Book a call" data-card="booking" data-state={booking.state} className="scroll-mt-4">
        <Done heading={heading} title="Meeting booked (simulated)">
          <p>
            {when(booking.slot, timeZone)} ({timeZone.replace(/_/g, " ")}) · {calendar.duration_minutes} minutes · video call
          </p>
          <p className={META}>
            <strong>No real booking was made.</strong> Reference {confirmations.booking.reference}
          </p>
        </Done>
      </section>
    );
  }

  return (
    <section aria-label="Book a call" data-card="booking" data-state={booking.state} className={SURFACE}>
      <Head heading={heading} title={title} note="Demonstration availability" />
      {booking.state === "picking" && (
        <>
          <p className={META}>{calendar.duration_minutes} minutes · video call · made-up times</p>
          {booking.taken.length > 0 && <Problem>That time was just taken (simulated). Choose another.</Problem>}
          <div role="group" aria-label="Date" className="mt-2.5 flex flex-wrap gap-1">
            {calendar.days.slice(0, 4).map((d, i) => (
              <button key={d.date} type="button" aria-pressed={day === i} onClick={() => setDay(i)} className={`h-9 rounded-[9px] px-3 text-[13.5px] transition-colors max-sm:h-11 max-sm:flex-1 max-sm:px-1 pointer-coarse:h-11 ${day === i ? "bg-brand-soft font-semibold text-content" : "text-content-muted hover:bg-content/[0.05] hover:text-content"}`}>
                {show(d.slots[0], timeZone, { weekday: "short", day: "numeric" })}
                <span className="sr-only"> {show(d.slots[0], timeZone, { month: "long" })}</span>
              </button>
            ))}
          </div>
          <ul aria-label="Times" className="mt-2 flex flex-wrap gap-1.5">
            {slots.map((s) => {
              const gone = booking.taken.includes(s);
              return (
                <li key={s} className="max-sm:flex-1">
                  <button type="button" disabled={gone} onClick={() => book({ type: "PICK", slot: s })} className="h-9 w-full min-w-[76px] rounded-[9px] border border-border-strong bg-surface px-3 text-[13.5px] font-medium tabular-nums text-content transition-colors hover:border-brand/60 disabled:cursor-not-allowed disabled:border-transparent disabled:text-content-muted disabled:line-through max-sm:h-11 pointer-coarse:h-11">
                    {show(s, timeZone, { hour: "2-digit", minute: "2-digit" })}
                    {gone && <span className="sr-only"> (taken)</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          <label className={`mt-1.5 flex items-center gap-1 ${META}`}>
            Times shown in
            <span className="relative">
              <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)} className="h-9 cursor-pointer appearance-none rounded-[9px] bg-transparent pl-1.5 pr-6 text-[13px] font-medium text-content hover:bg-content/[0.05] max-sm:h-11 max-sm:text-[16px] pointer-coarse:h-11">
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} aria-hidden className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2" />
            </span>
          </label>
        </>
      )}
      {booking.state === "details" && (
        <form
          action="/contact/continue"
          method="post"
          noValidate
          onSubmit={submit}
        >
          <p className="mt-1 text-[14px] text-content">
            {booking.slot && when(booking.slot, timeZone)}
            <button type="button" className={`${LINK} ml-1.5`} onClick={() => book({ type: "CHANGE_TIME" })}>
              Change time
            </button>
          </p>
          <div className="mt-1.5 grid gap-2.5 sm:grid-cols-2">
            <Input id="ai-booking-name" label="Name" autoComplete="name" value={c.name} error={errors.name} onChange={set("name")} />
            <Input id="ai-booking-email" label="Email" type="email" autoComplete="email" value={c.email} error={errors.email} onChange={set("email")} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <button type="submit" className={PRIMARY}>
              Review booking
            </button>
            <p className={META}>{KEPT}</p>
          </div>
        </form>
      )}
      {(booking.state === "reviewing" || booking.state === "failed" || booking.state === "submitting") && (
        <>
          {booking.state === "failed" && <Problem>No booking was made (simulated failure). Your choice is kept.</Problem>}
          <Rows rows={meeting} />
          {booking.state === "submitting" ? (
            <Sending text="Booking (simulated). Please wait for the result." />
          ) : (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button type="button" className={PRIMARY} onClick={() => book({ type: "CONFIRM" })}>
                {booking.state === "failed" ? "Try again (simulated)" : "Confirm booking (simulated)"}
              </button>
              <button type="button" className={GHOST} onClick={() => book({ type: "CHANGE_TIME" })}>
                Change time
              </button>
              <button type="button" className={GHOST} onClick={() => book({ type: "EDIT" })}>
                Edit details
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

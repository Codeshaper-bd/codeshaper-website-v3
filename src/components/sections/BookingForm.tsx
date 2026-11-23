"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import { ArrowUpRight, Check, ChevronDown, Code2, Globe, HelpCircle, Network, Package, PenTool, Sparkles, type LucideIcon } from "lucide-react";
import { SERVICE_GROUPS } from "@/data/services";

/**
 * The short booking form in "Let's talk" (homepage): four fields instead of
 * the contact page's six, so asking for a call takes under a minute. Posts to
 * the same /api/contact as the contact page, so every request lands in CMS ›
 * Leads with the same checks (honeypot, one id per enquiry: sending twice
 * never saves it twice).
 */
/** Soft field: off-white at rest, darker edge on hover; on focus it turns white with an indigo edge and halo (no browser outline). */
const field =
  "w-full rounded-[14px] border border-[#0b0f19]/[0.09] bg-[#fafaf9] px-4 py-3.5 font-urbanist text-[14.5px] text-ink shadow-[inset_0_1px_2px_rgba(11,15,25,0.03)] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#6b7183] hover:border-[#0b0f19]/[0.16] focus:border-[#615fff] focus:bg-white focus:shadow-[0_0_0_4px_rgba(97,95,255,0.12)] focus-visible:outline-none!";
const label = "mb-1.5 block font-urbanist text-[12.5px] font-semibold text-ink";

/**
 * "What do you need?": a custom listbox in place of the native select, so the
 * open list matches the form (icons, check, soft hover). Keyboard: Enter,
 * Space or arrows open it; arrows move, Enter picks, Esc or Tab closes.
 * The choice is sent in a hidden input named "service".
 */
/** Only the icons this list uses (the full icon map would add ~26 KB to the page load). Unknown keys get a neutral box. */
const GLYPH: Record<string, LucideIcon> = { sparkles: Sparkles, "code-2": Code2, network: Network, "pen-tool": PenTool, globe: Globe, "help-circle": HelpCircle };
function Icon({ name, size }: { name: string; size: number }) {
  const G = GLYPH[name] ?? Package;
  return <G size={size} aria-hidden />;
}

const OPTIONS = [
  ...SERVICE_GROUPS.map((g) => ({ value: g.slug, name: g.name, icon: g.icon })),
  { value: "Other", name: "Other", icon: "help-circle" },
];

function ServiceSelect({ invalid, onPick }: { invalid: boolean; onPick: () => void }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();
  const chosen = OPTIONS.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const off = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", off);
    return () => document.removeEventListener("pointerdown", off);
  }, [open]);

  const pick = (i: number) => {
    setValue(OPTIONS[i].value);
    setOpen(false);
    onPick();
    button.current?.focus();
  };
  const show = () => {
    setActive(Math.max(0, OPTIONS.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const onKey = (e: KeyboardEvent) => {
    const n = OPTIONS.length;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    if (e.key === "Tab") return setOpen(false);
    const moves: Record<string, () => void> = {
      ArrowDown: () => setActive((a) => (a + 1) % n),
      ArrowUp: () => setActive((a) => (a - 1 + n) % n),
      Home: () => setActive(0),
      End: () => setActive(n - 1),
      Enter: () => pick(active),
      " ": () => pick(active),
      Escape: () => setOpen(false),
    };
    if (moves[e.key]) {
      e.preventDefault();
      moves[e.key]();
    }
  };

  return (
    <div ref={box} className="relative">
      <input type="hidden" name="service" value={value} />
      <button
        ref={button}
        type="button"
        id={id + "-button"}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id + "-list"}
        aria-labelledby={id + "-label " + id + "-button"}
        aria-invalid={invalid || undefined}
        aria-activedescendant={open ? id + "-opt-" + active : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKey}
        className={[
          field,
          "flex items-center gap-3 text-left",
          open ? "border-[#615fff] bg-white shadow-[0_0_0_4px_rgba(97,95,255,0.12)]" : "",
          invalid ? "border-red-400 bg-red-50/40" : "",
        ].join(" ")}
      >
        {chosen ? (
          <>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] bg-[#615fff]/10 text-[#4f46e5]">
              <Icon name={chosen.icon} size={15} />
            </span>
            <span className="flex-1 truncate text-ink">{chosen.name}</span>
          </>
        ) : (
          <span className="flex-1 text-[#6b7183]">Choose a service</span>
        )}
        <ChevronDown
          size={16}
          strokeWidth={2}
          aria-hidden
          className={"shrink-0 transition-transform duration-200 " + (open ? "rotate-180 text-[#4f46e5]" : "text-ink-faint")}
        />
      </button>

      <ul
        id={id + "-list"}
        role="listbox"
        aria-labelledby={id + "-label"}
        className={[
          "absolute inset-x-0 top-[calc(100%+8px)] z-30 origin-top rounded-[18px] border border-[#0b0f19]/[0.08] bg-white p-1.5 shadow-[0_24px_50px_-20px_rgba(11,15,25,0.35),0_2px_6px_-2px_rgba(11,15,25,0.08)] transition-[opacity,transform] duration-200",
          open ? "visible scale-100 opacity-100" : "pointer-events-none invisible scale-[0.98] opacity-0",
        ].join(" ")}
      >
        {OPTIONS.map((g, i) => {
          const selected = g.value === value;
          const lit = i === active || selected;
          return (
            <li
              key={g.value}
              id={id + "-opt-" + i}
              role="option"
              aria-selected={selected}
              onPointerMove={() => i !== active && setActive(i)}
              onClick={() => pick(i)}
              className={
                "flex cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2.5 font-urbanist text-[14px] text-ink transition-colors " +
                (g.value === "Other" ? "mt-1.5 relative before:absolute before:inset-x-3 before:-top-1 before:h-px before:bg-[#0b0f19]/[0.07] " : "") +
                (i === active ? "bg-[#f4f3ff] " : "") +
                (selected ? "font-semibold" : "")
              }
            >
              <span
                className={
                  "grid h-8 w-8 shrink-0 place-items-center rounded-[10px] transition-colors " +
                  (lit ? "bg-[#615fff]/[0.12] text-[#4f46e5]" : "bg-[#0b0f19]/[0.04] text-ink-dim")
                }
              >
                <Icon name={g.icon} size={15} />
              </span>
              <span className="flex-1">{g.name}</span>
              {selected && <Check size={15} strokeWidth={2.4} className="shrink-0 text-[#4f46e5]" aria-hidden />}
            </li>
          );
        })}
      </ul>
      <span id={id + "-label"} className="sr-only">
        What do you need?
      </span>
    </div>
  );
}

/** The real person the visitor will speak to (CMS › Home › Let's talk). Shown above the form. */
export type Person = { name?: string; role?: string; note?: string; photo?: string };

function PersonStrip({ p }: { p: Person }) {
  if (!p.name) return null;
  return (
    <div className="mb-6 flex items-center gap-4 border-b border-[#0b0f19]/[0.07] pb-6">
      {p.photo && (
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#f1f0ee] ring-2 ring-white shadow-[0_0_0_1px_rgba(11,15,25,0.08),0_8px_18px_-10px_rgba(11,15,25,0.45)]">
          <Image src={p.photo} alt={p.name} fill sizes="56px" className="object-cover object-[50%_22%] scale-[1.35]" />
        </span>
      )}
      <div className="min-w-0">
        <p className="font-urbanist text-[16px] font-bold leading-tight tracking-[-0.01em] text-ink">{p.name}</p>
        {p.role && <p className="mt-0.5 font-urbanist text-[13px] text-ink-dim">{p.role}</p>}
        {p.note && <p className="mt-1.5 font-urbanist text-[13.5px] font-medium text-ink">&ldquo;{p.note}&rdquo;</p>}
      </div>
    </div>
  );
}

export default function BookingForm({ title, text, button, person }: { title: string; text: string; button: string; person?: Person }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const id = useRef("");
  const [noService, setNoService] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (!data.service) return setNoService(true);
    id.current ||= crypto.randomUUID?.() ?? "";
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, timeline: "Asked for a call (homepage)", submission_id: id.current }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(typeof body?.error === "string" ? body.error : "Something went wrong. Please try again.");
        return setStatus("error");
      }
      setStatus("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="rounded-[28px] border border-[#0b0f19]/[0.07] bg-white p-6 shadow-[0_1px_2px_rgba(11,15,25,0.04),0_30px_60px_-40px_rgba(11,15,25,0.35)] sm:p-8">
      {status === "done" ? (
        <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ecfdf5] text-[#16a34a]">
            <Check size={22} strokeWidth={2.4} aria-hidden />
          </span>
          <p className="mt-5 font-urbanist text-[22px] font-bold tracking-tight text-ink">Thanks, we have it.</p>
          <p className="mt-2 max-w-xs font-urbanist text-[14px] leading-relaxed text-ink-dim">We&apos;ll come back within one business day to set up the call.</p>
        </div>
      ) : (
        <>
          {person && <PersonStrip p={person} />}
          <h3 className="font-urbanist text-[22px] font-bold tracking-tight text-ink">{title}</h3>
          <p className="mt-1.5 font-urbanist text-[14px] leading-relaxed text-ink-dim">{text}</p>
          <form onSubmit={submit} className="mt-6 space-y-4" aria-label={title}>
            <input name="company_website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Name</span>
                <input required name="name" type="text" autoComplete="name" placeholder="Your name" className={field} />
              </label>
              <label className="block">
                <span className={label}>Work email</span>
                <input required name="email" type="email" autoComplete="email" placeholder="you@company.com" className={field} />
              </label>
            </div>
            <div>
              <span className={label} aria-hidden>
                What do you need?
              </span>
              <ServiceSelect invalid={noService} onPick={() => setNoService(false)} />
              {noService && <p className="mt-1.5 font-urbanist text-[12.5px] text-red-600">Choose the service closest to what you need.</p>}
            </div>
            <label className="block">
              <span className={label}>
                About the project <span className="font-normal text-ink-faint">(optional)</span>
              </span>
              <textarea name="brief" rows={4} placeholder="A few lines on what you want to build or improve" className={`${field} resize-none`} />
            </label>
            {status === "error" && <p className="font-urbanist text-[13px] text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={status === "sending"}
              className="group/cta mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0b0f19] py-2.5 pl-6 pr-2.5 font-urbanist text-[14px] font-semibold text-white transition-colors hover:bg-[#1f2433] disabled:opacity-60"
            >
              <span className="flex-1 text-center">{status === "sending" ? "Sending…" : button}</span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover/cta:rotate-45">
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
              </span>
            </button>
            <p className="text-center font-urbanist text-[12px] text-ink-faint">We only use your details to reply to you.</p>
          </form>
        </>
      )}
    </div>
  );
}

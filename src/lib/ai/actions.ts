/**
 * The two things a visitor can complete inside the conversation: an inquiry to the team and a booking.
 * Pure state machines, so no screen can skip the review, send twice or claim success early. In the
 * prototype the results are simulated; later they come from the existing Leads and booking services.
 * Contact details live only here and in these cards: never in a message to the assistant. No imports.
 */
export type Contact = { name: string; email: string; phone: string; message: string };
const noContact = (): Contact => ({ name: "", email: "", phone: "", message: "" });
export type ContactField = keyof Contact;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function contactErrors(c: Contact): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  if (!c.name.trim() || c.name.length > 120) out.name = "Enter your name.";
  if (!EMAIL.test(c.email.trim()) || c.email.length > 255) out.email = "Enter an email address such as name@company.com.";
  if (c.phone.trim() && !/^\+?[\d ()-]{6,40}$/.test(c.phone.trim())) out.phone = "Use digits, spaces and + only, or leave it empty.";
  if (c.message.length > 2000) out.message = "Keep it under 2,000 characters.";
  return out;
}

// ── inquiry ────────────────────────────────────────────────────────────────
export type Inquiry = { state: "draft" | "reviewing" | "submitting" | "submitted" | "failed"; id: string; contact: Contact; includeBrief: boolean };
export type InquiryEvent =
  | { type: "CHANGE"; field: ContactField; value: string }
  | { type: "INCLUDE_BRIEF"; value: boolean }
  | { type: "REVIEW" | "EDIT" | "CONFIRM" }
  | { type: "RESULT"; ok: boolean }
  | { type: "RESET"; id: string };

/** `id` stays the same for every try at one submission, so a repeat can never make a second lead. */
export const newInquiry = (id = "inquiry"): Inquiry => ({ state: "draft", id, contact: noContact(), includeBrief: true });

export function inquiryReducer(m: Inquiry, e: InquiryEvent): Inquiry {
  if (m.state === "submitting") return e.type === "RESULT" ? { ...m, state: e.ok ? "submitted" : "failed" } : m;
  if (e.type === "RESET") return newInquiry(e.id);
  if (m.state === "submitted") return m;
  switch (e.type) {
    case "CHANGE":
      return { ...m, state: "draft", contact: { ...m.contact, [e.field]: e.value } };
    case "INCLUDE_BRIEF":
      return { ...m, state: "draft", includeBrief: e.value };
    case "REVIEW":
      return m.state === "draft" && !Object.keys(contactErrors(m.contact)).length ? { ...m, state: "reviewing" } : m;
    case "EDIT":
      return { ...m, state: "draft" };
    case "CONFIRM":
      // after a failure the same, already reviewed, content may be tried again
      return m.state === "reviewing" || m.state === "failed" ? { ...m, state: "submitting" } : m;
    default:
      return m;
  }
}

// ── booking ────────────────────────────────────────────────────────────────
export type Booking = { state: "picking" | "details" | "reviewing" | "submitting" | "confirmed" | "failed"; id: string; slot: string | null; taken: string[]; contact: Contact };
export type BookingEvent =
  | { type: "PICK"; slot: string }
  | { type: "CHANGE"; field: ContactField; value: string }
  | { type: "REVIEW" | "EDIT" | "CHANGE_TIME" | "CONFIRM" }
  | { type: "RESULT"; outcome: "ok" | "slot_taken" | "failed" }
  | { type: "RESET"; id: string };

export const newBooking = (id = "booking"): Booking => ({ state: "picking", id, slot: null, taken: [], contact: noContact() });

export function bookingReducer(m: Booking, e: BookingEvent): Booking {
  if (e.type === "RESET" && m.state !== "submitting") return newBooking(e.id);
  if (m.state === "confirmed") return m;
  if (m.state === "submitting") {
    if (e.type !== "RESULT") return m;
    if (e.outcome === "ok") return { ...m, state: "confirmed" };
    if (e.outcome === "failed") return { ...m, state: "failed" };
    return { ...m, state: "picking", taken: m.slot ? [...m.taken, m.slot] : m.taken, slot: null };
  }
  switch (e.type) {
    case "PICK":
      return (m.state === "picking" || m.state === "details") && !m.taken.includes(e.slot) ? { ...m, state: "details", slot: e.slot } : m;
    case "CHANGE":
      return { ...m, state: m.slot ? "details" : "picking", contact: { ...m.contact, [e.field]: e.value } };
    case "REVIEW":
      return m.state === "details" && m.slot && !Object.keys(contactErrors(m.contact)).length ? { ...m, state: "reviewing" } : m;
    case "EDIT":
      return m.slot ? { ...m, state: "details" } : m;
    case "CHANGE_TIME":
      return { ...m, state: "picking", slot: null };
    case "CONFIRM":
      return m.state === "reviewing" || m.state === "failed" ? { ...m, state: "submitting" } : m;
    default:
      return m;
  }
}

/** FICTIONAL availability for the prototype: three times on each of the next four weekdays. */
export function demoDays(now: number): { date: string; slots: string[] }[] {
  const days: { date: string; slots: string[] }[] = [];
  for (let d = 1; days.length < 4; d++) {
    const day = new Date(now + d * 86_400_000);
    if ([0, 6].includes(day.getUTCDay())) continue;
    const date = day.toISOString().slice(0, 10);
    days.push({ date, slots: ["04:00", "05:30", "09:00"].map((t) => `${date}T${t}:00Z`) });
  }
  return days;
}

// ── keeping contact details away from the assistant ────────────────────────
const FIND_EMAIL = /[^\s@<>(),;:]+@[^\s@<>(),;:]+\.[A-Za-z]{2,}/;
// starts with + or has separators, and eight digits or more: "200 users" and "3 months" are not phones
const FIND_PHONE = /(?<![\w.])(?:\+\d|\(\d{2,4}\)|\d{3,5}(?=[ -]\d))[\d() -]{5,}\d(?!\w)/;
const FIND_NAME = /(?<=\b[Mm]y name is )\p{Lu}[\p{L}'-]*(?: \p{Lu}[\p{L}'-]*){0,3}/u;

/**
 * Takes an email, phone number and stated name out of a message in the browser. `forAssistant` is what
 * may leave; `shown` is what the visitor sees; `contact` fills the contact card for them to check.
 * Like any pattern matching it misses things: it reduces exposure and promises nothing more.
 */
export function separateContact(text: string): { forAssistant: string; shown: string; contact: Partial<Contact> } {
  const contact: Partial<Contact> = {};
  let forAssistant = text;
  let shown = text;
  const name = text.match(FIND_NAME)?.[0];
  if (name) {
    contact.name = name;
    forAssistant = forAssistant.replace(name, "[name]");
  }
  const email = forAssistant.match(FIND_EMAIL)?.[0];
  if (email) {
    contact.email = email;
    forAssistant = forAssistant.replace(email, "[email]");
    shown = shown.replace(email, `${email[0]}•••@${email.split("@")[1]}`);
  }
  const phone = forAssistant.match(FIND_PHONE)?.[0];
  if (phone && phone.replace(/\D/g, "").length >= 8) {
    contact.phone = phone;
    forAssistant = forAssistant.replace(phone, "[phone]");
    shown = shown.replace(phone, `•••• ${phone.slice(-2)}`);
  }
  return { forAssistant, shown, contact };
}

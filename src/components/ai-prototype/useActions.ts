"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { bookingReducer, inquiryReducer, newBooking, newInquiry, type Contact, type ContactField } from "@/lib/ai/actions";
import { parseConfirmation, type Confirmation } from "@/lib/ai/proposals";

/**
 * The inquiry and the booking of this conversation, shared by text and voice. Results are SIMULATED
 * on a timer: nothing is sent, stored or booked. The one identifier per submission is what will make
 * a repeated send harmless once a real service is behind this.
 */
export type InquiryResult = "ok" | "failed";
export type BookingResult = "ok" | "slot_taken" | "failed";
const SEND_MS = 1400;

export function useActions(announce: (text: string) => void) {
  const [inquiry, inquire] = useReducer(inquiryReducer, "SIM-INQ-1", newInquiry);
  const [booking, book] = useReducer(bookingReducer, "SIM-CALL-1", newBooking);
  const [inquiryResult, setInquiryResult] = useState<InquiryResult>("ok");
  const [bookingResult, setBookingResult] = useState<BookingResult>("ok");
  const [confirmations, setConfirmations] = useState<{ inquiry?: Confirmation; booking?: Confirmation }>({});
  const [timeZone, setTimeZone] = useState("UTC");
  const timers = useRef<number[]>([]);
  /** counts conversations: also remounts the cards, so nothing of theirs carries over */
  const [round, setRound] = useState(0);
  const restart = useCallback(() => {
    const next = round + 2;
    inquire({ type: "RESET", id: `SIM-INQ-${next}` });
    book({ type: "RESET", id: `SIM-CALL-${next}` });
    setConfirmations({});
    setRound(round + 1);
  }, [round]);

  useEffect(() => setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"), []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // the one place a result is produced: only for something the visitor confirmed
  useEffect(() => {
    if (inquiry.state !== "submitting") return;
    const t = window.setTimeout(() => {
      const ok = inquiryResult === "ok";
      if (ok) setConfirmations((c) => ({ ...c, inquiry: parseConfirmation({ action: "inquiry", status: "submitted", reference: inquiry.id, simulated: true }) ?? undefined }));
      inquire({ type: "RESULT", ok });
      announce(ok ? "Simulated: inquiry submitted. Nothing was sent." : "The inquiry did not go through. Your details are kept.");
    }, SEND_MS);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [inquiry.state, inquiry.id, inquiryResult, announce]);

  useEffect(() => {
    if (booking.state !== "submitting") return;
    const t = window.setTimeout(() => {
      if (bookingResult === "ok") setConfirmations((c) => ({ ...c, booking: parseConfirmation({ action: "booking", status: "confirmed", reference: booking.id, simulated: true }) ?? undefined }));
      book({ type: "RESULT", outcome: bookingResult });
      announce(bookingResult === "ok" ? "Simulated: meeting booked. No real booking was made." : bookingResult === "slot_taken" ? "That time was just taken. Choose another." : "The booking did not go through.");
    }, SEND_MS);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [booking.state, booking.id, bookingResult, announce]);

  /** Details the visitor typed in a message go into the cards, for them to check. */
  const prefill = useCallback(
    (contact: Partial<Contact>) => {
      for (const [field, value] of Object.entries(contact) as [ContactField, string][]) {
        inquire({ type: "CHANGE", field, value });
        book({ type: "CHANGE", field, value });
      }
    },
    [],
  );

  return { inquiry, inquire, booking, book, confirmations, timeZone, setTimeZone, prefill, inquiryResult, setInquiryResult, bookingResult, setBookingResult, round, restart };
}
export type Actions = ReturnType<typeof useActions>;

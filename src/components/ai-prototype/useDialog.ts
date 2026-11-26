"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Open dialogs, newest last: only the top one answers Escape and keeps Tab inside itself. */
const stack: symbol[] = [];
const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useDialog(ref: RefObject<HTMLElement | null>, active: boolean, onClose: () => void) {
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    if (!active) return;
    const id = Symbol("dialog");
    stack.push(id);
    const before = document.activeElement as HTMLElement | null;
    const box = ref.current;
    if (box && !box.contains(document.activeElement)) (box.querySelector<HTMLElement>("[data-autofocus]") ?? box).focus();

    const onKey = (e: KeyboardEvent) => {
      // the site's booking window opens above this one and handles its own keys
      if (stack.at(-1) !== id || document.querySelector(".booking-overlay") || !ref.current) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [...ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null && !el.closest("[inert]"));
      if (!items.length) return;
      // every step is taken here: left to itself, Safari skips buttons and can walk out of the dialog
      e.preventDefault();
      const at = items.indexOf(document.activeElement as HTMLElement);
      const next = at === -1 ? (e.shiftKey ? items.length - 1 : 0) : (at + (e.shiftKey ? -1 : 1) + items.length) % items.length;
      items[next].focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      stack.splice(stack.indexOf(id), 1);
      // back to where the visitor was, if that is still on the page
      if (before?.isConnected) before.focus({ preventScroll: true });
    };
  }, [active, ref]);
}

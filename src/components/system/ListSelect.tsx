"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, type LucideIcon } from "lucide-react";

/**
 * A custom dropdown in place of the native select (owner, 24 Nov 2026: the
 * browser's own list looked out of place). Same look as the homepage
 * booking form's service picker: the field, then a soft white list with
 * icons, a light hover and a check on the chosen one.
 *
 * Keyboard: Enter, Space or arrows open it; arrows, Home and End move; Enter
 * picks; Esc or Tab closes. The value is posted in a hidden input named
 * `name`; `required` is checked by the form like any field.
 */
export type ListOption = { value: string; label: string; icon?: LucideIcon; hint?: string };

const field =
  "w-full rounded-control border border-[#0b0f19]/[0.12] bg-white px-3.5 py-2.5 font-urbanist text-[14.5px] text-ink shadow-[0_1px_1px_rgba(11,15,25,0.04),0_2px_5px_-2px_rgba(11,15,25,0.06)] outline-none transition-[border-color,box-shadow] duration-150 hover:border-[#0b0f19]/[0.2] focus:border-[#615fff] focus:shadow-[0_0_0_3px_rgba(97,95,255,0.2),0_1px_1px_rgba(11,15,25,0.04)] focus-visible:outline-none!";

export default function ListSelect({
  name,
  label,
  options,
  placeholder = "Select…",
  required = false,
  value: controlled,
  onChange,
}: {
  name: string;
  label: string;
  options: ListOption[];
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const [own, setOwn] = useState("");
  const value = controlled ?? own;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  const chosen = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const off = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", off);
    return () => document.removeEventListener("pointerdown", off);
  }, [open]);

  // keep the highlighted option in view in a long list
  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const pick = (i: number) => {
    const v = options[i].value;
    if (controlled === undefined) setOwn(v);
    onChange?.(v);
    setOpen(false);
    button.current?.focus();
  };
  const show = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const onKey = (e: KeyboardEvent) => {
    const n = options.length;
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
      <span id={id + "-label"} className="mb-1.5 block font-urbanist text-[13px] font-medium text-ink-mid">
        {label}
      </span>
      {/* the posted value; a required one stops the form like any empty field */}
      <input
        name={name}
        value={value}
        required={required}
        onChange={() => {}}
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-4 h-px w-px opacity-0"
        onInvalid={() => button.current?.focus()}
      />
      <button
        ref={button}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id + "-list"}
        aria-labelledby={id + "-label " + id + "-value"}
        aria-activedescendant={open ? id + "-opt-" + active : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKey}
        className={`${field} flex items-center gap-2.5 text-left ${open ? "border-[#615fff] shadow-[0_0_0_3px_rgba(97,95,255,0.2)]" : ""}`}
      >
        {chosen?.icon && <chosen.icon size={16} aria-hidden className="shrink-0 text-[#4f46e5]" />}
        <span id={id + "-value"} className={`flex-1 truncate ${chosen ? "text-ink" : "text-[#8a8fa0]"}`}>
          {chosen ? chosen.label : placeholder}
        </span>
        <ChevronDown size={16} strokeWidth={2} aria-hidden className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-[#4f46e5]" : "text-ink-faint"}`} />
      </button>

      <ul
        ref={list}
        id={id + "-list"}
        role="listbox"
        aria-labelledby={id + "-label"}
        className={`no-scrollbar absolute left-0 top-[calc(100%+6px)] w-max min-w-full max-w-[min(360px,calc(100vw-2rem))] z-30 max-h-72 origin-top overflow-y-auto overscroll-contain rounded-[16px] border border-[#0b0f19]/[0.08] bg-white p-1.5 shadow-[0_24px_50px_-20px_rgba(11,15,25,0.35),0_2px_6px_-2px_rgba(11,15,25,0.08)] transition-[opacity,transform] duration-150 ${
          open ? "visible scale-100 opacity-100" : "pointer-events-none invisible scale-[0.98] opacity-0"
        }`}
      >
        {options.map((o, i) => {
          const selected = o.value === value;
          const lit = i === active || selected;
          return (
            <li
              key={o.value}
              id={id + "-opt-" + i}
              data-i={i}
              role="option"
              aria-selected={selected}
              onPointerMove={() => i !== active && setActive(i)}
              onClick={() => pick(i)}
              className={`flex cursor-pointer items-center gap-3 rounded-[11px] px-2.5 py-2 font-urbanist text-[14px] text-ink transition-colors ${i === active ? "bg-[#f4f3ff]" : ""} ${selected ? "font-semibold" : ""}`}
            >
              {o.icon && (
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-[9px] transition-colors ${lit ? "bg-[#615fff]/[0.12] text-[#4f46e5]" : "bg-[#0b0f19]/[0.04] text-ink-dim"}`}>
                  <o.icon size={15} aria-hidden />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block whitespace-nowrap">{o.label}</span>
                {o.hint && <span className="block truncate text-[12px] font-normal text-ink-dim">{o.hint}</span>}
              </span>
              {selected && <Check size={15} strokeWidth={2.4} aria-hidden className="shrink-0 text-[#4f46e5]" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

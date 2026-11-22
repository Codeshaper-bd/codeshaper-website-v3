"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ArrowRight, ChevronRight, Plus, X } from "lucide-react";
import { HEADER_BUTTON, HEADER_ITEMS, INDUSTRIES } from "@/lib/navigation";
import {
  SERVICE_GROUPS,
  ENGAGEMENT_MODELS,
  SERVICES_QUICK_ACCESS,
  SERVICES_FEATURED,
  groupSections,
  servicePath,
} from "@/data/services";
import { Icon } from "@/lib/icons";

/**
 * Mobile navigation (<1024px) as an iOS-style bottom sheet, opened from the
 * tab bar (MobileTabBar): "Services" opens it with Services expanded,
 * "Menu" with everything collapsed.
 *
 *  · slides up over a dimmed backdrop with the iOS sheet curve
 *  · grab handle: drag down to dismiss (distance or flick), tap backdrop,
 *    close button or Escape also close it
 *  · inset-grouped rows with 48px+ tap targets; the content mirrors the
 *    desktop mega menus (How We Engage / Core Services / Featured / Quick
 *    Access, Industries, Case Studies, Blog, Company)
 *  · focus moves into the sheet on open and back to the opener on close;
 *    `inert` while closed keeps hidden links out of the tab order
 *
 * Mounted as a sibling of <header>, never inside anything with a transform
 * (that would become the containing block for this fixed sheet).
 */
const DISMISS_DISTANCE = 110;
const DISMISS_VELOCITY = 0.6; // px/ms

export default function MobileMenu({
  open,
  section,
  onClose,
}: {
  open: boolean;
  section: "services" | null;
  onClose: () => void;
}) {
  const [item, setItem] = useState("");
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const start = useRef({ y: 0, t: 0 });

  const [title, setTitle] = useState("Menu");
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const wasOpen = useRef(false);

  // each opening starts fresh: Services expanded or all collapsed, scrolled to top
  useEffect(() => {
    if (!open) return;
    setItem(section ?? "");
    setTitle(section === "services" ? "Services" : "Menu"); // kept through the close animation
    setDrag(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [open, section]);

  // scroll lock, Escape, and focus in/out — only on real open/close transitions
  useEffect(() => {
    if (open && !wasOpen.current) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      // focus the sheet itself: screen readers land on it, and no focus ring
      // flashes on the close button for touch users
      requestAnimationFrame(() => dialogRef.current?.focus({ preventScroll: true }));
    } else if (!open && wasOpen.current) {
      returnFocus.current?.focus?.({ preventScroll: true });
    }
    wasOpen.current = open;
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    start.current = { y: e.clientY, t: performance.now() };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dy = e.clientY - start.current.y;
    // resist upward pulls, follow downward ones
    setDrag(dy > 0 ? dy : dy / 6);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    const dy = e.clientY - start.current.y;
    const v = dy / Math.max(1, performance.now() - start.current.t);
    if (dy > DISMISS_DISTANCE || v > DISMISS_VELOCITY) onClose();
    else setDrag(0);
  };

  const close = () => onClose();

  return (
    <div
      className={`theme-light fixed inset-0 z-[60] font-urbanist lg:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-[rgba(10,12,18,0.32)] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[90dvh] max-w-[640px] flex-col rounded-t-[28px] bg-[#f6f7f9] shadow-[0_-16px_48px_rgba(10,12,18,0.18)] outline-none"
        // inline: the global unlayered :focus-visible rule would otherwise
        // outline the sheet itself when it receives focus on open
        style={{
          transform: open ? `translateY(${Math.round(drag)}px)` : "translateY(105%)",
          outline: "none",
          transition: dragging ? "none" : "transform 460ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* grab handle + title: the drag area */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="shrink-0 cursor-grab touch-none select-none px-5 pb-3 pt-2.5 active:cursor-grabbing"
        >
          <span aria-hidden className="mx-auto block h-[5px] w-10 rounded-full bg-black/15" />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[22px] font-bold tracking-[-0.01em] text-ink">{title}</p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="grid h-9 w-9 place-items-center rounded-full bg-black/[0.06] text-ink-dim transition-transform active:scale-90"
            >
              <X size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <nav
          ref={scrollRef}
          aria-label="Mobile"
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4"
        >
          {/* inset grouped list */}
          <Accordion.Root
            type="single"
            collapsible
            value={item}
            onValueChange={setItem}
            className="divide-y divide-black/[0.06] overflow-hidden rounded-2xl bg-white"
          >
            {HEADER_ITEMS.map((it, i) => {
              if (it.type === "services")
                return (
                <Accordion.Item key={i} value="services">
                  {/* opened from the Services tab, the sheet title already says
                      "Services": show its content directly, without the row */}
                  <Accordion.Header className={title === "Services" ? "hidden" : undefined}>
                    <Accordion.Trigger className={rowTrigger}>
                      {it.label}
                      <Plus size={18} strokeWidth={1.8} aria-hidden className={rowIcon} />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden px-4 pb-5">
                    <p className="menu-section-label mb-1 mt-1">How We Engage</p>
                    <ul className="mb-4">
                      {ENGAGEMENT_MODELS.map((m) => (
                        <li key={m.href}>
                          <Link href={m.href} onClick={close} className="flex min-h-[44px] items-center text-[15px] text-ink-dim">
                            {m.label}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <p className="menu-section-label mb-1">Core Services</p>
                    <Accordion.Root type="single" collapsible className="mb-4">
                      {SERVICE_GROUPS.map((group) => (
                        <Accordion.Item key={group.slug} value={group.slug}>
                          <Accordion.Header>
                            <Accordion.Trigger className="group flex min-h-[48px] w-full items-center gap-3 text-left text-[15px] text-ink">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#f1f2f5] text-aurora-indigo">
                                <Icon name={group.icon} size={15} />
                              </span>
                              <span className="flex-1">
                                {group.name}
                                {group.flagship && (
                                  <span className="ml-2 rounded-full border border-hairline px-1.5 py-px text-[10px] text-aurora-amber-dark">
                                    New
                                  </span>
                                )}
                              </span>
                              <Plus
                                size={15}
                                strokeWidth={1.8}
                                className="shrink-0 text-ink-faint transition-transform duration-300 group-data-[state=open]:rotate-45"
                                aria-hidden
                              />
                            </Accordion.Trigger>
                          </Accordion.Header>
                          <Accordion.Content className="overflow-hidden pb-2 pl-11">
                            <Link
                              href={servicePath(group.slug)}
                              onClick={close}
                              className="inline-flex min-h-[40px] items-center gap-1.5 text-[14px] font-semibold text-aurora-violet"
                            >
                              {group.name} overview
                              <ArrowRight size={13} strokeWidth={1.9} />
                            </Link>
                            {groupSections(group).map((s) => (
                              <div key={s.name ?? group.slug}>
                                {s.name && (
                                  <p className="mb-0.5 mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-faint">{s.name}</p>
                                )}
                                <ul>
                                  {s.services.map((svc) => (
                                    <li key={svc.slug}>
                                      <Link href={servicePath(svc.slug)} onClick={close} className="flex min-h-[40px] items-center text-[14px] text-ink-dim">
                                        {svc.menuLabel}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </Accordion.Content>
                        </Accordion.Item>
                      ))}
                    </Accordion.Root>

                    <p className="menu-section-label mb-2">Featured</p>
                    <Link href={SERVICES_FEATURED.href} onClick={close} className="mb-4 block rounded-xl bg-[#f4f5f8] p-4">
                      <p className="text-[15px] font-semibold text-ink">{SERVICES_FEATURED.title}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-dim">{SERVICES_FEATURED.desc}</p>
                    </Link>

                    <p className="menu-section-label mb-2">Quick Access</p>
                    <div className="flex flex-wrap gap-2">
                      {SERVICES_QUICK_ACCESS.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={close}
                          className="mega-chip inline-flex min-h-[36px] items-center rounded-full px-3.5 text-[13px] font-semibold"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
                );
              if (title === "Services" || it.type === "group") return null;
              if (it.type === "link")
                return (
                  <RowLink key={i} href={it.href} onClick={close}>
                    {it.label}
                  </RowLink>
                );
              return (
                <Accordion.Item key={i} value="industries">
                  <Accordion.Header>
                    <Accordion.Trigger className={rowTrigger}>
                      {it.label}
                      <Plus size={18} strokeWidth={1.8} aria-hidden className={rowIcon} />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden px-4 pb-4">
                    <ul>
                      {INDUSTRIES.map((ind) => (
                        <li key={ind.href}>
                          <Link href={ind.href} onClick={close} className="flex min-h-[44px] items-center text-[15px] text-ink-dim">
                            {ind.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/industries"
                      onClick={close}
                      className="mt-1 inline-flex min-h-[40px] items-center gap-1.5 text-[14px] font-semibold text-aurora-violet"
                    >
                      Explore All Industries
                      <ArrowRight size={13} strokeWidth={1.9} />
                    </Link>
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>

          {title !== "Services" &&
            HEADER_ITEMS.map((m, i) => m.type === "group" && (
            <div key={i} className="mt-6">
              <p className="menu-section-label mb-2 px-4">{m.label}</p>
              <ul className="divide-y divide-black/[0.06] overflow-hidden rounded-2xl bg-white">
                {m.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={close} className="flex min-h-[52px] items-center gap-3 px-4 text-[16px] font-medium text-ink">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#f1f2f5] text-aurora-indigo">
                        <Icon name={l.icon} size={15} />
                      </span>
                      <span className="flex-1">{l.label}</span>
                      <ChevronRight size={18} strokeWidth={1.8} className="text-ink-faint" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-black/[0.06] bg-[#f6f7f9] px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3">
          <Link
            href={HEADER_BUTTON.href}
            onClick={close}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-aurora-violet text-[16px] font-semibold text-white transition-transform active:scale-[0.98]"
          >
            {HEADER_BUTTON.label}
            <ArrowRight size={17} strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

const rowTrigger =
  "group flex min-h-[56px] w-full items-center justify-between gap-3 px-4 text-left text-[17px] font-semibold text-ink";
const rowIcon = "shrink-0 text-ink-faint transition-transform duration-300 group-data-[state=open]:rotate-45";

function RowLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="flex min-h-[56px] items-center justify-between px-4 text-[17px] font-semibold text-ink">
      {children}
      <ChevronRight size={18} strokeWidth={1.8} className="text-ink-faint" aria-hidden />
    </Link>
  );
}

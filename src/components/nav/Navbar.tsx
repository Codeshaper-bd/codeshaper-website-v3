"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import { SIMPLE_MENUS } from "@/lib/navigation";
import { Icon } from "@/lib/icons";
import MegaPanel from "./MegaPanel";
import IndustriesMegaPanel from "./IndustriesMegaPanel";
import MobileMenu from "./MobileMenu";
import Magnetic from "@/components/system/Magnetic";

/**
 * Header.
 *
 * Menu shapes (deliberately different):
 *  · Services  → full-width MEGA panel rendered in the shared Radix viewport
 *  · Everything else → compact dropdown anchored under its own trigger
 *    (rendered inside the Item, so it positions itself and stays small)
 *
 * Bar: light from first paint (white/95 + blur), gains a hairline shadow after
 * 80px (250ms). Links get a 2px underline scaling in from the left; the open
 * item stays highlighted. "Book a Call" is a solid flat pill, darkens on
 * hover, magnetic on desktop. Scrim only appears for the mega panel.
 */
const triggerCls =
  "nav-underline group flex select-none items-center gap-1 rounded px-3 py-2 font-body text-sm font-medium text-ink-dim outline-none transition-colors hover:text-ink focus-visible:text-ink data-[state=open]:text-ink";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openValue, setOpenValue] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const megaOpen = openValue === "services" || openValue === "industries";

  return (
    <>
      {/* Scrim — mega panel only; compact dropdowns don't dim the page */}
      <div
        aria-hidden
        className={`nav-scrim fixed inset-0 z-30 ${megaOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <header className="theme-light fixed inset-x-0 top-0 z-50 font-satoshi">
        <div
          className={`border-b border-hairline bg-canvas/95 backdrop-blur-xl transition-shadow duration-[250ms] ${
            scrolled || openValue || mobileOpen ? "shadow-[0_1px_0_rgba(11,15,25,0.04)]" : ""
          }`}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
            <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Codeshaper home">
              <svg width="26" height="28" viewBox="0 0 26 28" aria-hidden>
                <path
                  d="M13 1 L24.3 7.5 L24.3 20.5 L13 27 L1.7 20.5 L1.7 7.5 Z"
                  fill="none"
                  stroke="url(#logoGrad)"
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#667EEA" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-display text-lg font-bold tracking-tight text-ink">codeshaper</span>
            </Link>

            <div ref={rootRef} className="ml-auto mr-6 hidden lg:block">
              <Nav.Root value={openValue} onValueChange={setOpenValue} className="relative">
                <Nav.List className="flex items-center gap-1">
                  <Nav.Item>
                    <Nav.Link asChild>
                      <Link href="/" className={triggerCls}>
                        Home
                      </Link>
                    </Nav.Link>
                  </Nav.Item>

                  {/* Services + Industries — MEGA (share the floating viewport) */}
                  <Nav.Item value="services">
                    <Nav.Trigger className={triggerCls}>
                      Services
                      <ChevronDown
                        size={13}
                        strokeWidth={1.75}
                        className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                      />
                    </Nav.Trigger>
                    <Nav.Content>
                      <MegaPanel />
                    </Nav.Content>
                  </Nav.Item>

                  <Nav.Item value="industries">
                    <Nav.Trigger className={triggerCls}>
                      Industries
                      <ChevronDown
                        size={13}
                        strokeWidth={1.75}
                        className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                      />
                    </Nav.Trigger>
                    <Nav.Content>
                      <IndustriesMegaPanel />
                    </Nav.Content>
                  </Nav.Item>

                  <Nav.Item>
                    <Nav.Link asChild>
                      <Link href="/work" className={triggerCls}>
                        Success Stories
                      </Link>
                    </Nav.Link>
                  </Nav.Item>

                  {SIMPLE_MENUS.map((m) => (
                    <DropdownItem key={m.id} menu={m} />
                  ))}
                </Nav.List>

                {/* Shared floating viewport = the mega panel surface (Services +
                    Industries). Compact dropdowns render inside their own Item. */}
                <div
                  className="fixed left-1/2 top-[74px] z-40 w-[min(calc(100vw-48px),1180px)] -translate-x-1/2"
                  style={{ pointerEvents: megaOpen ? "auto" : "none" }}
                >
                  <Nav.Viewport className="mega-panel data-[state=closed]:hidden" />
                </div>
              </Nav.Root>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/work"
                className="hidden rounded-full border border-aurora-indigo/25 px-5 py-2 font-display text-sm font-medium text-ink-dim transition-colors duration-300 hover:border-aurora-indigo/45 hover:text-ink sm:inline-block"
              >
                View Work
              </Link>
              <Magnetic>
                <Link
                  href="/contact"
                  className="hidden rounded-full bg-aurora-violet px-5 py-2 font-display text-sm font-medium text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark sm:inline-block"
                >
                  Book a Call
                </Link>
              </Magnetic>
              <button
                className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
              >
                <span
                  className={`h-0.5 w-5 bg-ink transition-transform duration-300 ${mobileOpen ? "translate-y-1 rotate-45" : ""}`}
                />
                <span
                  className={`h-0.5 w-5 bg-ink transition-transform duration-300 ${mobileOpen ? "-translate-y-1 -rotate-45" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </header>
    </>
  );
}

/**
 * Compact dropdown: a small panel anchored under its trigger — one column of
 * icon + label rows. Deliberately not the mega treatment.
 */
function DropdownItem({
  menu,
}: {
  menu: {
    id: string;
    label: string;
    dividerAfterIndex?: number;
    links: { label: string; href: string; icon: string }[];
  };
}) {
  return (
    <Nav.Item value={menu.id} className="relative">
      <Nav.Trigger className={triggerCls}>
        {menu.label}
        <ChevronDown
          size={13}
          strokeWidth={1.75}
          className="transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </Nav.Trigger>
      <Nav.Content className="dropdown-panel mx-auto my-5 w-[300px] rounded-xl border border-hairline bg-white p-2 shadow-[0_20px_48px_rgba(11,15,25,0.14)]">
        <ul>
          {menu.links.map((l, i) => (
            <li key={l.href}>
              <Nav.Link asChild>
                <Link
                  href={l.href}
                  className="menu-row group flex items-center gap-3 rounded-lg px-2.5 py-2.5 font-body text-[13.5px] text-ink-dim transition-colors hover:text-ink"
                >
                  <span className="icon-tile flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-hairline bg-canvas-raised text-aurora-indigo group-hover:border-aurora-indigo/45">
                    <Icon name={l.icon} size={14} />
                  </span>
                  {l.label}
                </Link>
              </Nav.Link>
              {menu.dividerAfterIndex === i && <div className="my-1.5 h-px bg-hairline" aria-hidden />}
            </li>
          ))}
        </ul>
      </Nav.Content>
    </Nav.Item>
  );
}

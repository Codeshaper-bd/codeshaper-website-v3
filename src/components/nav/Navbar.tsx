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

const HIDE_THRESHOLD = 96; // px scrolled before the bar is allowed to hide
const DIRECTION_SLOP = 6; // px of scroll delta before a direction registers

/**
 * Header.
 *
 * Menu shapes (deliberately different):
 *  · Services, Industries → full-width MEGA panel. Each Nav.Content
 *    self-positions as a fixed floating card — deliberately NOT using a
 *    shared Radix Viewport, since NavigationMenu.Viewport is a Root-wide
 *    singleton that portals ALL Content through one surface once present,
 *    which would also swallow the compact dropdowns below and break their
 *    own trigger-anchored positioning.
 *  · Everything else → compact dropdown anchored under its own trigger
 *    (rendered inside the Item, so it positions itself and stays small)
 *
 * Bar: light from first paint (white/95 + blur), gains a hairline shadow after
 * 80px (250ms). Links get a 2px underline scaling in from the left; the open
 * item stays highlighted. "Book a Call" is a solid flat pill, darkens on
 * hover, magnetic on desktop. Scrim only appears for the mega panel.
 */
const triggerCls =
  "nav-underline group flex select-none items-center gap-1 rounded px-3 py-2 font-urbanist text-base font-semibold text-ink-dim outline-none transition-colors hover:text-ink focus-visible:text-ink data-[state=open]:text-ink";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [openValue, setOpenValue] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);

  // Floating bar: always visible near the top; once scrolled past the
  // threshold it hides while scrolling down (more room to read) and
  // reappears the moment the user scrolls back up.
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      if (y < HIDE_THRESHOLD) {
        setHidden(false);
      } else if (y > lastY.current + DIRECTION_SLOP) {
        setHidden(true);
      } else if (y < lastY.current - DIRECTION_SLOP) {
        setHidden(false);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const megaOpen = openValue === "services" || openValue === "industries";
  const forceVisible = Boolean(openValue) || mobileOpen;

  return (
    <>
      {/* Scrim — mega panel only; compact dropdowns don't dim the page */}
      <div
        aria-hidden
        className={`nav-scrim fixed inset-0 z-30 ${megaOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <header
        className={`theme-light fixed inset-x-0 top-0 z-50 p-5 font-urbanist transition-transform duration-300 ease-out sm:p-7 ${
          hidden && !forceVisible ? "-translate-y-[calc(100%+16px)]" : "translate-y-0"
        }`}
      >
        <div
          className={`mx-auto max-w-[1180px] rounded-full border border-hairline bg-white/95 backdrop-blur-xl transition-shadow duration-[250ms] ${
            scrolled || openValue || mobileOpen ? "shadow-[0_8px_30px_rgba(11,15,25,0.10)]" : "shadow-none"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-6 lg:px-10">
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
              <span className="font-urbanist text-lg font-bold tracking-tight text-ink">codeshaper</span>
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

                  {/* Services + Industries — MEGA, each a self-positioned floating card */}
                  <Nav.Item value="services">
                    <Nav.Trigger className={triggerCls}>
                      Services
                      <ChevronDown
                        size={13}
                        strokeWidth={1.75}
                        className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                      />
                    </Nav.Trigger>
                    <Nav.Content
                      className="mega-panel fixed left-1/2 top-[102px] z-40 w-[min(calc(100vw-48px),1180px)] -translate-x-1/2 data-[state=closed]:hidden"
                      style={{ position: "fixed" }}
                    >
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
                    <Nav.Content
                      className="mega-panel fixed left-1/2 top-[102px] z-40 w-[min(calc(100vw-48px),1180px)] -translate-x-1/2 data-[state=closed]:hidden"
                      style={{ position: "fixed" }}
                    >
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

              </Nav.Root>
            </div>

            <div className="flex items-center gap-3">
              <Magnetic>
                <Link
                  href="/contact"
                  className="hidden rounded-full bg-aurora-violet px-5 py-2 font-urbanist text-base font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark sm:inline-block"
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
      </header>

      {/* Sibling of <header>, not a child — see MobileMenu.tsx's own header
          comment for why (header's always-on transform was making it the
          containing block for this panel's fixed positioning). */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
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
      <Nav.Content className="dropdown-panel absolute left-1/2 top-full z-40 mt-3 w-[300px] -translate-x-1/2 rounded-xl border border-hairline bg-white p-2 shadow-[0_20px_48px_rgba(11,15,25,0.14)]">
        <ul>
          {menu.links.map((l, i) => (
            <li key={l.href}>
              <Nav.Link asChild>
                <Link
                  href={l.href}
                  className="menu-row group flex items-center gap-3 rounded-lg px-2.5 py-2.5 font-urbanist text-base font-semibold text-ink-dim transition-colors hover:text-ink"
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

"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Nav from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import { SIMPLE_MENUS } from "@/lib/navigation";
import { Icon } from "@/lib/icons";
import MegaPanel from "./MegaPanel";
import IndustriesMegaPanel from "./IndustriesMegaPanel";
import MobileMenu from "./MobileMenu";
import MobileTabBar from "./MobileTabBar";
import Magnetic from "@/components/system/Magnetic";

/**
 * Header.
 *
 * Desktop (≥1024px) has two states of ONE navigation (one Radix root, so
 * menus, ids and focus behave identically in both):
 *
 *  · top  — full-width (container-fluid) bar at the top of the document.
 *           No background, border, shadow or blur; it sits on the hero and
 *           scrolls away with it (absolute, not fixed), so it never floats
 *           over content.
 *  · dock — once the page's first section (the hero) has scrolled past,
 *           the navigation rises from the bottom of the viewport as a
 *           compact floating dock. Scrolling back up sinks the dock and the
 *           full bar is waiting at the top again.
 *
 * The switch is a short choreography, not a jump: the outgoing dock sinks
 * (nav-dock-out), the mode flips, the incoming state animates in
 * (nav-dock-in with staggered items, or nav-top-in). Because the top bar
 * is already off-screen when docking happens, it reads as the nav leaving
 * the top and arriving at the bottom.
 *
 * Mega panels (Services, Industries) are `position: fixed` and placed from
 * the live bar position: below the bar at the top, above the dock when
 * docked. Nothing between them and the viewport carries a transform or
 * filter once animations finish, so they always resolve against the
 * viewport. Compact dropdowns open downward at the top, upward in the dock.
 *
 * Mobile (<1024px): a minimal transparent top bar (logo + Book a Call)
 * that scrolls away, plus an iOS-style bottom tab bar and bottom sheet
 * (MobileTabBar, MobileMenu).
 */
const DESKTOP = "(min-width: 1024px)";
const DOCK_MIN_SCROLL = 160; // never dock while the top bar could still be on screen
const DOCK_AT = 0.35; // dock once the hero's bottom passes 35% of the viewport

const triggerCls =
  "nav-underline group flex select-none items-center gap-1 rounded px-3 py-2 font-urbanist text-base font-semibold text-ink-dim outline-none transition-colors hover:text-ink focus-visible:text-ink data-[state=open]:text-ink";
const dockTriggerCls =
  "group flex select-none items-center gap-1 rounded-xl px-3 py-2 font-urbanist text-[15px] font-semibold text-ink-dim outline-none transition-colors hover:bg-[#f2f3f6] hover:text-ink focus-visible:bg-[#f2f3f6] focus-visible:text-ink data-[state=open]:bg-[#f2f3f6] data-[state=open]:text-ink";

type Mode = "top" | "dock";
type Phase = "idle" | "entering" | "leaving";

export default function Navbar() {
  const [mode, setMode] = useState<Mode>("top");
  const [phase, setPhase] = useState<Phase>("idle");
  const [openValue, setOpenValue] = useState("");
  const [sheet, setSheet] = useState<null | "menu" | "services">(null);
  const barRef = useRef<HTMLDivElement>(null);
  const wantDock = useRef(false);
  const modeRef = useRef<Mode>("top");
  modeRef.current = mode;

  // ── dock decision ────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    let raf = 0;
    let heroBottom = 0;

    const measure = () => {
      const hero = document.querySelector("main")?.firstElementChild as HTMLElement | null;
      heroBottom = hero ? hero.getBoundingClientRect().bottom + window.scrollY : 0;
    };

    const evaluate = () => {
      raf = 0;
      const y = window.scrollY;
      const dock =
        mq.matches && y > DOCK_MIN_SCROLL && y > heroBottom - window.innerHeight * DOCK_AT;
      if (dock === wantDock.current) return;
      wantDock.current = dock;
      setOpenValue(""); // never carry an open menu across a mode change
      if (!mq.matches) {
        // below desktop the dock is display:none, so its exit animation
        // would never end: reset straight to the top bar
        setMode("top");
        setPhase("idle");
      } else if (dock) {
        setMode("dock");
        setPhase("entering");
      } else if (modeRef.current === "dock") {
        setPhase("leaving"); // the dock sinks first; onAnimationEnd flips the mode
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(evaluate);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    mq.addEventListener("change", onResize);
    // page content (images, fonts) can change the hero's height after load
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onResize);
      ro.disconnect();
    };
  }, []);

  const onBarAnimationEnd = (e: React.AnimationEvent) => {
    if (e.target !== e.currentTarget) return; // ignore the staggered items
    if (phase === "leaving") {
      setMode("top");
      // the bar is only worth animating in if it's actually on screen
      setPhase(window.scrollY < 140 ? "entering" : "idle");
    } else if (phase === "entering") {
      setPhase("idle");
    }
  };

  // ── mega panel placement (fixed, from the live bar position) ──
  const placePanels = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;
    const r = bar.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--nav-panel-top", `${Math.round(r.bottom + 12)}px`);
    root.style.setProperty("--nav-panel-bottom", `${Math.round(window.innerHeight - r.top + 12)}px`);
  }, []);
  useLayoutEffect(() => {
    if (openValue) placePanels();
  }, [openValue, mode, placePanels]);

  // At the top the bar scrolls with the page while the panel is fixed, so
  // close an open menu once the page moves away from it.
  useEffect(() => {
    if (!openValue || mode !== "top") return;
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 48) setOpenValue("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [openValue, mode]);

  const megaOpen = openValue === "services" || openValue === "industries";
  const docked = mode === "dock";
  const megaPos = docked
    ? "bottom-[var(--nav-panel-bottom,96px)] max-h-[calc(100vh-var(--nav-panel-bottom,96px)-24px)] overflow-y-auto"
    : "top-[var(--nav-panel-top,100px)]";
  const tc = docked ? dockTriggerCls : triggerCls;

  const animCls =
    phase === "leaving" ? "nav-dock-out" : phase === "entering" ? (docked ? "nav-dock-in" : "nav-top-in") : "";

  // Staggered dock items get --i; the top bar ignores it.
  const item = (i: number) => (docked ? { className: "dock-item", style: { "--i": i } as CSSProperties } : {});

  return (
    <>
      {/* Scrim — mega panel only; compact dropdowns don't dim the page */}
      <div
        aria-hidden
        className={`nav-scrim fixed inset-0 z-30 ${megaOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <header
        className={`theme-light z-50 font-urbanist ${
          docked
            ? "pointer-events-none fixed inset-x-0 bottom-5 hidden justify-center px-4 lg:flex"
            : "absolute inset-x-0 top-[10px] px-3 sm:px-4"
        }`}
      >
        <div
          ref={barRef}
          onAnimationEnd={onBarAnimationEnd}
          className={
            docked
              ? `pointer-events-auto rounded-[20px] border border-[#e3e5eb] bg-white shadow-[0_1px_2px_rgba(11,15,25,0.05),0_16px_48px_-8px_rgba(11,15,25,0.22)] ${animCls}`
              : `mx-auto w-full ${animCls}`
          }
        >
          <div
            className={
              docked
                ? "flex h-[60px] items-center gap-1 pl-2.5 pr-2"
                : "flex h-16 items-center justify-between px-3 sm:px-5 lg:px-8 xl:px-12"
            }
          >
            <Link
              href="/"
              aria-label="CodeShaper home"
              {...item(0)}
              className={`flex shrink-0 items-center ${docked ? "dock-item mr-1 rounded-xl p-1.5 transition-colors hover:bg-[#f2f3f6]" : ""}`}
            >
              {docked ? (
                <Image src="/brand/favicon.png" alt="" width={32} height={32} className="h-8 w-8 rounded-[9px]" />
              ) : (
                // alt intentionally lowercase-c "codeShaper": it describes the
                // wordmark as rendered; the Link's aria-label is what screen
                // readers announce (see Footer.tsx for the same reasoning).
                <Image src="/brand/logo.png" alt="codeShaper" width={169} height={60} priority className="h-10 w-auto" />
              )}
            </Link>

            {docked && <span aria-hidden className="dock-item mx-1 h-6 w-px bg-[#e6e8ee]" style={{ "--i": 1 } as CSSProperties} />}

            <div className={docked ? "block" : "ml-auto mr-8 hidden lg:block"}>
              <Nav.Root value={openValue} onValueChange={setOpenValue}>
                <Nav.List className={`flex items-center ${docked ? "gap-0.5" : "gap-1"}`}>
                  <Nav.Item value="services" {...item(2)}>
                    <Nav.Trigger className={tc}>
                      Services
                      <ChevronDown
                        size={13}
                        strokeWidth={1.75}
                        className={`transition-transform duration-200 ${docked ? "rotate-180 group-data-[state=open]:rotate-0" : "group-data-[state=open]:rotate-180"}`}
                      />
                    </Nav.Trigger>
                    <Nav.Content
                      className={`mega-panel fixed left-1/2 z-40 w-[min(calc(100vw-32px),1200px)] -translate-x-1/2 data-[state=closed]:hidden ${megaPos}`}
                      style={{ position: "fixed" }}
                    >
                      <MegaPanel />
                    </Nav.Content>
                  </Nav.Item>

                  <Nav.Item value="industries" {...item(3)}>
                    <Nav.Trigger className={tc}>
                      Industries
                      <ChevronDown
                        size={13}
                        strokeWidth={1.75}
                        className={`transition-transform duration-200 ${docked ? "rotate-180 group-data-[state=open]:rotate-0" : "group-data-[state=open]:rotate-180"}`}
                      />
                    </Nav.Trigger>
                    <Nav.Content
                      className={`mega-panel fixed left-1/2 z-40 w-[min(calc(100vw-32px),1200px)] -translate-x-1/2 data-[state=closed]:hidden ${megaPos}`}
                      style={{ position: "fixed" }}
                    >
                      <IndustriesMegaPanel />
                    </Nav.Content>
                  </Nav.Item>

                  <Nav.Item {...item(4)}>
                    <Nav.Link asChild>
                      <Link href="/case-studies" className={tc}>
                        Case Studies
                      </Link>
                    </Nav.Link>
                  </Nav.Item>

                  {/* Standing in for the Insights dropdown (disabled — see its
                      `enabled: false` in navigation.ts) until it has more than
                      Blog behind it. */}
                  <Nav.Item {...item(5)}>
                    <Nav.Link asChild>
                      <Link href="/blog" className={tc}>
                        Blog
                      </Link>
                    </Nav.Link>
                  </Nav.Item>

                  {SIMPLE_MENUS.filter((m) => m.enabled !== false).map((m, i) => (
                    <DropdownItem key={m.id} menu={m} docked={docked} triggerClassName={tc} order={6 + i} />
                  ))}
                </Nav.List>
              </Nav.Root>
            </div>

            {docked && <span aria-hidden className="dock-item mx-1.5 h-6 w-px bg-[#e6e8ee]" style={{ "--i": 7 } as CSSProperties} />}

            <div {...item(8)} className={`flex items-center gap-3 ${docked ? "dock-item" : ""}`}>
              {docked ? (
                <Link
                  href="/contact"
                  className="inline-flex h-10 items-center rounded-[12px] bg-aurora-violet px-4 font-urbanist text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-aurora-violet-dark"
                >
                  Book a Call
                </Link>
              ) : (
                <Magnetic>
                  <Link
                    href="/contact"
                    className="inline-block rounded-full bg-aurora-violet px-4 py-2 font-urbanist text-[15px] font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark sm:px-5 sm:text-base"
                  >
                    Book a Call
                  </Link>
                </Magnetic>
              )}
            </div>
          </div>
        </div>
      </header>

      <MobileTabBar active={sheet} onOpen={setSheet} />
      <MobileMenu open={sheet !== null} section={sheet === "services" ? "services" : null} onClose={() => setSheet(null)} />
    </>
  );
}

/**
 * Compact dropdown: a small panel anchored to its trigger — one column of
 * icon + label rows. Opens downward from the top bar, upward from the dock.
 */
function DropdownItem({
  menu,
  docked,
  triggerClassName,
  order,
}: {
  menu: {
    id: string;
    label: string;
    dividerAfterIndex?: number;
    links: { label: string; href: string; icon: string }[];
  };
  docked: boolean;
  triggerClassName: string;
  order: number;
}) {
  return (
    <Nav.Item
      value={menu.id}
      className={`relative ${docked ? "dock-item" : ""}`}
      style={docked ? ({ "--i": order } as CSSProperties) : undefined}
    >
      <Nav.Trigger className={triggerClassName}>
        {menu.label}
        <ChevronDown
          size={13}
          strokeWidth={1.75}
          className={`transition-transform duration-200 ${docked ? "rotate-180 group-data-[state=open]:rotate-0" : "group-data-[state=open]:rotate-180"}`}
        />
      </Nav.Trigger>
      <Nav.Content
        className={`dropdown-panel absolute left-1/2 z-40 w-[300px] -translate-x-1/2 rounded-xl border border-hairline bg-white p-2 shadow-[0_20px_48px_rgba(11,15,25,0.14)] ${
          docked ? "bottom-full mb-6" : "top-full mt-3"
        }`}
      >
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

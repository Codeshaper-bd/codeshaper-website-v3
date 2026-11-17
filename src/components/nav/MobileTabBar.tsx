"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Layers, BriefcaseBusiness, Newspaper, LayoutGrid, type LucideIcon } from "lucide-react";

/**
 * Mobile/tablet (<1024px) bottom tab bar, iOS style: five equal tabs with
 * icon + label, fixed to the bottom edge, clear of the home indicator via
 * env(safe-area-inset-bottom) (needs viewport-fit=cover, set in layout).
 *
 * Home, Work and Blog are routes; Services and Menu open the bottom sheet
 * (MobileMenu). The active tab is the open sheet if any, otherwise the
 * current route. Presses scale down slightly, like a native tab bar.
 */
type Sheet = null | "menu" | "services";

type Tab =
  | { id: string; label: string; icon: LucideIcon; href: string; match: (p: string) => boolean }
  | { id: string; label: string; icon: LucideIcon; sheet: "menu" | "services" };

const TABS: Tab[] = [
  { id: "home", label: "Home", icon: House, href: "/", match: (p) => p === "/" },
  { id: "services", label: "Services", icon: Layers, sheet: "services" },
  { id: "work", label: "Work", icon: BriefcaseBusiness, href: "/case-studies", match: (p) => p.startsWith("/case-studies") },
  { id: "blog", label: "Blog", icon: Newspaper, href: "/blog", match: (p) => p.startsWith("/blog") },
  { id: "menu", label: "Menu", icon: LayoutGrid, sheet: "menu" },
];

export default function MobileTabBar({ active, onOpen }: { active: Sheet; onOpen: (s: Sheet) => void }) {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label="Primary"
      className="theme-light fixed inset-x-0 bottom-0 z-50 border-t border-black/[0.06] bg-white/90 pb-[env(safe-area-inset-bottom)] font-urbanist backdrop-blur-xl backdrop-saturate-150 lg:hidden"
    >
      <ul className="mx-auto grid h-[60px] max-w-[560px] grid-cols-5">
        {TABS.map((t) => {
          const on = "sheet" in t ? active === t.sheet : active === null && t.match(pathname);
          const cls = `flex h-full w-full flex-col items-center justify-center gap-[3px] text-[10.5px] font-semibold tracking-[0.01em] transition-[color,transform] duration-150 active:scale-[0.92] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ink ${
            on ? "text-ink" : "text-[#6b7080]"
          }`;
          const icon = <t.icon size={22} strokeWidth={on ? 2.2 : 1.8} aria-hidden />;
          return (
            <li key={t.id}>
              {"sheet" in t ? (
                <button
                  type="button"
                  className={cls}
                  aria-expanded={on}
                  aria-haspopup="dialog"
                  onClick={() => onOpen(on ? null : t.sheet)}
                >
                  {icon}
                  {t.label}
                </button>
              ) : (
                <Link href={t.href} className={cls} aria-current={on ? "page" : undefined} onClick={() => onOpen(null)}>
                  {icon}
                  {t.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

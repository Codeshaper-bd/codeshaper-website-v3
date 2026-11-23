import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumbs: one frosted pill at the top of every page hero (the same
 * shape as the homepage hero's chip), home as an icon, the current page in
 * ink. Sits wherever its parent puts it (centred heroes wrap it in
 * `flex justify-center`).
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-7 inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-full border border-white/80 bg-white/70 py-1.5 pl-2 pr-3.5 font-urbanist text-[12.5px] text-ink-dim shadow-[inset_0_1px_0_#fff,0_1px_2px_rgba(11,15,25,0.05),0_8px_20px_-12px_rgba(59,47,122,0.25)] backdrop-blur-md"
    >
      {items.map((item, i) => {
        const home = i === 0 && item.href === "/";
        const last = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} strokeWidth={2} aria-hidden className="text-ink-faint" />}
            {item.href && !last ? (
              <Link
                href={item.href}
                aria-label={home ? "Home" : undefined}
                className={home ? "grid h-6 w-6 place-items-center rounded-full text-ink-dim transition-colors hover:bg-[#0b0f19]/[0.05] hover:text-ink" : "transition-colors hover:text-ink"}
              >
                {home ? <Home size={13} strokeWidth={2} aria-hidden /> : item.label}
              </Link>
            ) : (
              <span aria-current={last ? "page" : undefined} className={last ? "font-semibold text-ink" : undefined}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

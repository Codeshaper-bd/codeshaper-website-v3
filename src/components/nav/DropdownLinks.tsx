"use client";

import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import type { MenuLink } from "@/lib/navigation";
import { Icon } from "@/lib/icons";

/**
 * The rows of a simple header dropdown (Company…). Its own file so the icon
 * map (lib/icons) is loaded only when a dropdown first opens, not with the page.
 */
export default function DropdownLinks({ links }: { links: MenuLink[] }) {
  return (
    <ul>
      {links.map((l, i) => (
        <li key={l.href}>
          <Nav.Link asChild>
            <Link
              href={l.href}
              className="menu-row group flex items-center gap-3 rounded-[12px] px-2.5 py-2 font-urbanist text-[15px] font-semibold text-ink-dim transition-colors hover:text-ink"
            >
              <span className="mega-icon-tile flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]">
                <Icon name={l.icon} size={14} />
              </span>
              {l.label}
            </Link>
          </Nav.Link>
          {i === 0 && links.length > 1 && <div className="mx-2 my-1 h-px bg-[#0b0f19]/[0.07] shadow-[0_1px_0_rgba(255,255,255,0.8)]" aria-hidden />}
        </li>
      ))}
    </ul>
  );
}

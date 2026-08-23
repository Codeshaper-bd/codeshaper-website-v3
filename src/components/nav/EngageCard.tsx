import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { ArrowRight } from "lucide-react";
import { ENGAGEMENT_MODELS } from "@/lib/navigation";
import { Icon } from "@/lib/icons";

/**
 * "How We Engage" — the left column shared, identically, by the Services
 * and Industries mega menus.
 */
export default function EngageCard() {
  return (
    <div className="menu-col rounded-2xl border border-hairline bg-gradient-to-b from-white to-canvas-raised p-4">
      <p className="mega-col-label mb-3 px-1">How We Engage</p>
      <ul className="space-y-0.5">
        {ENGAGEMENT_MODELS.map((m) => (
          <li key={m.href}>
            <Nav.Link asChild>
              <Link href={m.href} className="mega-row group flex items-start gap-3 rounded-xl p-2.5">
                <span className="mega-icon-tile flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-aurora-indigo">
                  <Icon name={m.icon} size={16} />
                </span>
                <span className="min-w-0 flex-1 pt-0.5">
                  <span className="mega-row-name block font-urbanist text-base font-semibold leading-snug text-ink transition-colors duration-150">
                    {m.label}
                  </span>
                  <span className="mt-0.5 block font-urbanist text-[12.5px] leading-snug text-ink-dim">
                    {m.desc}
                  </span>
                </span>
              </Link>
            </Nav.Link>
          </li>
        ))}
      </ul>
      <Nav.Link asChild>
        <Link
          href="/engagement"
          className="mt-3 inline-flex items-center gap-1.5 px-2.5 font-urbanist text-[13px] font-semibold text-aurora-violet transition-colors hover:text-ink"
        >
          Compare all models
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </Nav.Link>
    </div>
  );
}

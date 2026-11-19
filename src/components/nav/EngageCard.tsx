import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { ArrowRight } from "lucide-react";
import { ENGAGEMENT_MODELS } from "@/data/services";
import { Icon } from "@/lib/icons";

/**
 * "How We Engage": the boxed left column shared, identically, by the
 * Services and Industries mega menus (the original structure, in glass).
 */
export default function EngageCard() {
  return (
    <div className="menu-col engage-box rounded-[20px] p-4">
      <p className="mega-col-label mb-3 px-1">How We Engage</p>
      <ul className="space-y-0.5">
        {ENGAGEMENT_MODELS.map((m) => (
          <li key={m.href}>
            <Nav.Link asChild>
              <Link href={m.href} className="mega-row group flex items-start gap-3 rounded-xl p-2.5">
                <span className="mega-icon-tile flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px]">
                  <Icon name={m.icon} size={16} />
                </span>
                <span className="min-w-0 flex-1 pt-0.5">
                  <span className="mega-row-name block font-urbanist text-[15.5px] font-semibold leading-snug text-ink">{m.label}</span>
                  <span className="mt-0.5 block font-urbanist text-[13px] leading-snug text-ink-dim">{m.desc}</span>
                </span>
              </Link>
            </Nav.Link>
          </li>
        ))}
      </ul>
      <Nav.Link asChild>
        <Link
          href="/engagement"
          className="mt-3 inline-flex items-center gap-1.5 px-2.5 font-urbanist text-[13px] font-semibold text-[#4f46e5] transition-colors hover:text-[#272b3d]"
        >
          Compare all models
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </Nav.Link>
    </div>
  );
}

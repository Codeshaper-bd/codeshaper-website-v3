import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { ArrowRight } from "lucide-react";
import { ENGAGEMENT_MODELS } from "@/data/services";
import { Icon } from "@/lib/icons";
import { tone } from "./tones";

/**
 * "How we engage": a glass box on the left of both mega menus (owner
 * preference: the boxed column), compact rows with tinted icons, plus a quiet
 * "Compare" link.
 */
export default function EngageCard() {
  return (
    <div className="menu-col engage-box min-w-0 rounded-[18px] p-1.5">
      <p className="mega-col-label mb-2 px-2">How we engage</p>
      <ul>
        {ENGAGEMENT_MODELS.map((m, i) => (
          <li key={m.href}>
            <Nav.Link asChild>
              <Link href={m.href} className="mega-row group flex items-center gap-2.5 px-2 py-[7px]">
                <span className="mega-icon-tile flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px]" style={tone(i + 5)}>
                  <Icon name={m.icon} size={14} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mega-row-name block truncate font-urbanist text-[14px] font-semibold leading-tight text-ink">
                    {m.label}
                  </span>
                  <span className="block truncate font-urbanist text-[12px] leading-snug text-ink-dim">{m.desc}</span>
                </span>
              </Link>
            </Nav.Link>
          </li>
        ))}
      </ul>
      <Nav.Link asChild>
        <Link
          href="/engagement"
          className="mt-1.5 inline-flex items-center gap-1 px-2 font-urbanist text-[12.5px] font-semibold text-[#4f46e5] transition-colors hover:text-ink"
        >
          Compare all models
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </Nav.Link>
    </div>
  );
}

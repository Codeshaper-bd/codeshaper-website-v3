"use client";

import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { ArrowRight } from "lucide-react";
import {
  SERVICE_GROUPS,
  SERVICES_QUICK_ACCESS,
  SERVICES_FEATURED,
  groupDescriptor,
  servicePath,
} from "@/data/services";
import { Icon } from "@/lib/icons";
import EngageCard from "./EngageCard";
import { RiClaudeFill, RiGeminiFill, RiOpenaiFill } from "react-icons/ri";
import {
  SiDocker,
  SiFlutter,
  SiGooglecloud,
  SiHuggingface,
  SiKubernetes,
  SiLangchain,
  SiLaravel,
  SiMeta,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiShopify,
  SiSupabase,
  SiVercel,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";
import type { IconType } from "react-icons";
import header from "@/content/header.json";

/** the owner's list first, then tools the site's own content already names (services, case studies) */
const ALL_PLATFORMS: { key: string; name: string; icon: IconType; color: string }[] = [
  { key: "chatgpt", name: "ChatGPT", icon: RiOpenaiFill, color: "#0b0f19" },
  { key: "claude", name: "Claude", icon: RiClaudeFill, color: "#d97757" },
  { key: "gemini", name: "Gemini", icon: RiGeminiFill, color: "#4f7cf7" },
  { key: "langchain", name: "LangChain", icon: SiLangchain, color: "#1c3c3c" },
  { key: "aws", name: "AWS", icon: FaAws, color: "#ff9900" },
  { key: "azure", name: "Azure", icon: VscAzure, color: "#0078d4" },
  { key: "google-cloud", name: "Google Cloud", icon: SiGooglecloud, color: "#4285f4" },
  { key: "hugging-face", name: "Hugging Face", icon: SiHuggingface, color: "#ffb000" },
  { key: "llama", name: "Llama", icon: SiMeta, color: "#0467df" },
  { key: "python", name: "Python", icon: SiPython, color: "#3776ab" },
  { key: "nextjs", name: "Next.js", icon: SiNextdotjs, color: "#0b0f19" },
  { key: "react", name: "React", icon: SiReact, color: "#149eca" },
  { key: "nodejs", name: "Node.js", icon: SiNodedotjs, color: "#5fa04e" },
  { key: "laravel", name: "Laravel", icon: SiLaravel, color: "#ff2d20" },
  { key: "flutter", name: "Flutter", icon: SiFlutter, color: "#02569b" },
  { key: "postgresql", name: "PostgreSQL", icon: SiPostgresql, color: "#4169e1" },
  { key: "supabase", name: "Supabase", icon: SiSupabase, color: "#3ecf8e" },
  { key: "docker", name: "Docker", icon: SiDocker, color: "#2496ed" },
  { key: "kubernetes", name: "Kubernetes", icon: SiKubernetes, color: "#326ce5" },
  { key: "vercel", name: "Vercel", icon: SiVercel, color: "#0b0f19" },
  { key: "shopify", name: "Shopify", icon: SiShopify, color: "#5e8e3e" },
];

/** What the strip shows, in order: CMS › Settings › Header menu › Platforms strip; all of the above when it is not set. */
const CHOSEN = (header as { platforms?: string[] }).platforms;
const STACK = CHOSEN?.length ? CHOSEN.flatMap((k) => ALL_PLATFORMS.filter((p) => p.key === k)) : ALL_PLATFORMS;

/**
 * Services mega panel, the original 3-column structure in glass: How We
 * Engage (boxed, left), the 5 service groups (center), a featured AI card in
 * dark glass + quick-access chips (right); the two links sit under the services, and the footer strip shows the platforms we build with.
 * Icons sit in neutral glass tiles and turn brand violet on hover
 * (globals.css "Mega menu").
 */
export default function MegaPanel() {
  return (
    <div className="mx-auto max-w-7xl p-5">
      <div className="grid grid-cols-[0.95fr_1.08fr_270px] gap-4">
        <EngageCard />

        {/* Center — Core Services */}
        <div className="menu-col min-w-0">
          <p className="mega-col-label mb-3 px-1">Core Services</p>
          <ul>
            {SERVICE_GROUPS.map((group) => (
              <li key={group.slug}>
                <Nav.Link asChild>
                  <Link href={servicePath(group.slug)} className="mega-row group flex items-center gap-3.5 rounded-xl p-2.5">
                    <span className="mega-icon-tile flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px]">
                      <Icon name={group.icon} size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="mega-row-name font-urbanist text-base font-semibold leading-snug text-ink">{group.name}</span>
                        {group.flagship && (
                          <span className="shrink-0 rounded-full bg-[#615fff]/10 px-1.5 py-px font-urbanist text-[10px] font-semibold leading-tight text-[#4f46e5]">
                            New
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate font-urbanist text-[13px] leading-snug text-ink-dim">
                        {groupDescriptor(group)}
                      </span>
                    </span>
                    <ArrowRight size={15} strokeWidth={1.75} className="mega-svc-arrow shrink-0 text-ink-faint" />
                  </Link>
                </Nav.Link>
              </li>
            ))}
          </ul>
          {/* owner, 25 Nov 2026: the two links live under the list, where there was empty space */}
          <div className="mt-3 flex items-center gap-4 px-1">
            <Nav.Link asChild>
              <Link href="/services" className="mega-foot-btn rounded-full px-4 py-2 font-urbanist text-[13px] font-semibold text-ink">
                Explore All Services →
              </Link>
            </Nav.Link>
            <Nav.Link asChild>
              <Link href="/case-studies" className="font-urbanist text-[13px] text-ink-dim transition-colors hover:text-ink">
                View Case Studies →
              </Link>
            </Nav.Link>
          </div>
        </div>

        {/* Right — Featured + Quick access */}
        <div className="menu-col">
          <p className="mega-col-label mb-3 px-1">Featured</p>
          <Nav.Link asChild>
            <Link href={SERVICES_FEATURED.href} className="mega-feature-card group mb-5 block rounded-[20px] p-4">
              <span className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-[11px] bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                <Icon name={SERVICES_FEATURED.icon} size={17} />
              </span>
              <span className="mb-1.5 block font-urbanist text-[10.5px] font-bold uppercase tracking-[0.1em] text-white/50">
                {SERVICES_FEATURED.eyebrow}
              </span>
              <span className="block font-urbanist text-[17px] font-bold leading-tight tracking-tight text-white">
                {SERVICES_FEATURED.title}
              </span>
              <span className="mt-1.5 block font-urbanist text-[13.5px] leading-relaxed text-white/80">{SERVICES_FEATURED.desc}</span>
            </Link>
          </Nav.Link>
          <p className="mega-col-label mb-2.5 px-1">Quick access</p>
          <div className="flex flex-wrap gap-1.5">
            {SERVICES_QUICK_ACCESS.map((c) => (
              <Nav.Link asChild key={c.href}>
                <Link href={c.href} className="mega-chip inline-flex items-center rounded-full px-3 py-1.5 font-urbanist text-[12.5px] font-semibold">
                  {c.label}
                </Link>
              </Nav.Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer bar: the platforms we build with (owner, 25 Nov 2026, the names are the owner's list) */}
      {/* owner, 25 Nov 2026: the logos move like a carousel and fade out at both sides; hover pauses it */}
      <div className="mega-foot mt-5 flex items-center gap-6 rounded-2xl px-5 py-3.5">
        <p className="shrink-0 font-urbanist text-[12.5px] text-ink-dim">
          <span className="font-semibold text-ink">Built with</span> the platforms behind modern AI
        </p>
        <div className="stack-marquee-mask min-w-0 flex-1 overflow-hidden">
          <div className="stack-marquee flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 || undefined} aria-label={copy === 0 ? "Platforms we build with" : undefined} className="flex shrink-0 items-center gap-x-7 pr-7">
                {STACK.map(({ name, icon: Glyph, color }) => (
                  <li key={name} className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-urbanist text-[13px] font-semibold text-ink-mid">
                    <Glyph size={16} aria-hidden style={{ color }} />
                    {name}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

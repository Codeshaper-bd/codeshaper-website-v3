"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import {
  SiFigma,
  SiFramer,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiTypescript,
  SiWordpress,
  SiWebflow,
  SiShopify,
  SiDocker,
  SiKubernetes,
  SiPostgresql,
  SiPython,
  SiLangchain,
  SiHuggingface,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { SERVICE_GROUPS, servicePath, servicesInGroup, type ServiceGroupSlug } from "@/data/services";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { AgentsVisual, SoftwareVisual, IntegrationVisual, DesignVisual, WebVisual } from "./visuals";

/**
 * Services as a bento of product cards (Stripe "Payments" pattern).
 *
 *  · Each of the five service groups is a card: one outcome headline and a
 *    small, realistic mockup of what we ship in that group, on a soft
 *    corner wash taken from the hero palettes.
 *  · Clicking a card (or its + button) opens a detail dialog: headline,
 *    focus line, every service in the group as a link, the tools we use,
 *    and the same mockup at full size. Native <dialog> + showModal, so Esc,
 *    focus trapping and focus return are the browser's.
 *  · Layout: lg 3 columns (agents spans 2 → 2 + 1, then 1 + 1 + 1);
 *    md 2 columns (agents full width, then pairs); mobile one column.
 *
 * Names, routes and service lists come from data/services.ts; only the
 * headline and the visual live here.
 */

type Palette = { wash: string; dot: string };

const CARDS: Record<
  ServiceGroupSlug,
  { headline: string; palette: Palette; visual: ComponentType; span?: string; tools: IconType[] }
> = {
  "ai-agents-automation": {
    headline: "AI agents that finish real work inside the tools you already use",
    palette: {
      wash: "radial-gradient(90% 110% at 100% 100%, #8676ff 0%, #c08aff 22%, #dcc6ff 42%, rgba(238,230,255,0.6) 60%, rgba(255,255,255,0) 78%), radial-gradient(60% 70% at 0% 100%, rgba(255,143,191,0.55) 0%, rgba(255,255,255,0) 70%)",
      dot: "#7c6cff",
    },
    visual: AgentsVisual,
    span: "md:col-span-2",
    tools: [SiPython, SiLangchain, SiHuggingface],
  },
  "ai-software-development": {
    headline: "SaaS products and MVPs, built to scale",
    palette: {
      wash: "radial-gradient(110% 80% at 50% 105%, #4f6bff 0%, #8676ff 18%, #c08aff 36%, #eee6ff 58%, rgba(255,255,255,0) 80%)",
      dot: "#4f6bff",
    },
    visual: SoftwareVisual,
    tools: [SiReact, SiNextdotjs, SiNodedotjs, SiTypescript],
  },
  "ai-integration-infrastructure": {
    headline: "Connect AI to your systems and data, securely",
    palette: {
      wash: "radial-gradient(100% 80% at 100% 100%, #4f9be0 0%, #8cc1f2 26%, #bfddfb 46%, rgba(227,239,253,0.6) 64%, rgba(255,255,255,0) 82%)",
      dot: "#1b78cc",
    },
    visual: IntegrationVisual,
    tools: [SiDocker, SiKubernetes, SiPostgresql],
  },
  "ui-ux-product-design": {
    headline: "Product design people understand at first use",
    palette: {
      wash: "radial-gradient(90% 90% at 30% 100%, #ff8fbf 0%, #f09cc6 20%, #d6a9ff 40%, #e9d5ff 58%, rgba(246,238,253,0.6) 72%, rgba(255,255,255,0) 86%)",
      dot: "#e96aa8",
    },
    visual: DesignVisual,
    tools: [SiFigma, SiFramer],
  },
  "websites-commerce": {
    headline: "Websites and stores that rank, get cited and convert",
    palette: {
      wash: "radial-gradient(100% 85% at 0% 100%, #ffa26c 0%, #ffa98a 18%, #ffc970 34%, #ffe3ba 52%, rgba(255,244,232,0.6) 68%, rgba(255,255,255,0) 84%)",
      dot: "#f08a3e",
    },
    visual: WebVisual,
    tools: [SiWordpress, SiWebflow, SiShopify],
  },
};

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const ITEMS = SERVICE_GROUPS.map((g) => ({
  group: g,
  ...CARDS[g.slug],
  services: servicesInGroup(g.slug),
}));

/** Stripe-style "expand" mark: two corner brackets that spread apart on card hover. */
function ExpandIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9.5 3.5h3v3" className="transition-transform duration-300 ease-out group-hover/card:translate-x-[1.5px] group-hover/card:-translate-y-[1.5px]" />
      <path d="M6.5 12.5h-3v-3" className="transition-transform duration-300 ease-out group-hover/card:-translate-x-[1.5px] group-hover/card:translate-y-[1.5px]" />
    </svg>
  );
}

function Wash({ palette }: { palette: Palette }) {
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: palette.wash }} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "160px 160px" }}
      />
    </>
  );
}

export default function ServicesBento() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (openIdx !== null) {
      if (!d.open) d.showModal();
      // the scroll container is focusable too; start on Close, like a native sheet
      d.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      document.body.style.overflow = "hidden";
    } else if (d.open) {
      d.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openIdx]);

  const close = useCallback(() => setOpenIdx(null), []);
  // the dialog fills the viewport; a click on its empty area (not the panel) closes it
  const onBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close();
  };

  const active = openIdx !== null ? ITEMS[openIdx] : null;

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section
        className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-16 lg:py-24"
        aria-labelledby="services-heading"
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <SectionEyebrow>Our Services</SectionEyebrow>
                <SectionTitle id="services-heading" className="max-w-xl">
                  One team to design, build, and automate your product.
                </SectionTitle>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <SectionDescription className="max-w-xs">
                  Five service groups, one team. Production-ready AI and software that works with the tools you already use.
                </SectionDescription>
                <Link
                  href="/services"
                  className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-aurora-violet px-5 py-2.5 font-urbanist text-[13px] font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
                >
                  Explore all
                  <ArrowRight size={14} strokeWidth={1.75} />
                </Link>
              </div>
            </div>
          </Reveal>

          <ul className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {ITEMS.map((item, i) => {
              const Visual = item.visual;
              return (
                <li key={item.group.slug} className={item.span ?? ""}>
                  <Reveal delay={i * 70} className="h-full">
                    <article className="group/card relative flex h-[440px] flex-col overflow-hidden rounded-[24px] border border-[#0b0f19]/[0.07] bg-white transition-shadow duration-300 hover:shadow-[0_24px_60px_-28px_rgba(11,15,25,0.35)] sm:h-[460px]">
                      <Wash palette={item.palette} />

                      <div className="relative z-10 flex items-start gap-4 p-6 sm:p-7">
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-2 font-urbanist text-[12.5px] font-semibold text-ink-dim">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: item.palette.dot }} />
                            {item.group.name}
                            {item.group.flagship && (
                              <span className="rounded-full bg-[#0b0f19] px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-white">
                                New
                              </span>
                            )}
                          </p>
                          <h3 className="mt-2 max-w-[26ch] font-urbanist text-[21px] font-semibold leading-[1.2] tracking-[-0.01em] text-ink sm:text-[23px]">
                            {item.headline}
                          </h3>
                        </div>
                        {/* the whole card is this button's hit area (after:inset-0) */}
                        <button
                          type="button"
                          onClick={() => setOpenIdx(i)}
                          aria-haspopup="dialog"
                          aria-label={`${item.group.name}: see details`}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-[#f0eeff] text-[#5b4fd6] transition-colors duration-200 after:absolute after:inset-0 after:content-[''] group-hover/card:bg-[#5b4fd6] group-hover/card:text-white"
                        >
                          <ExpandIcon />
                        </button>
                      </div>

                      <div
                        aria-hidden
                        className="pointer-events-none relative min-h-0 flex-1 select-none transition-transform duration-500 ease-out group-hover/card:-translate-y-1.5"
                      >
                        <Visual />
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        onClose={close}
        aria-labelledby={active ? "svc-dialog-title" : undefined}
        className="svc-dialog fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none bg-transparent p-0"
      >
        {active && (
          <div
            data-lenis-prevent
            onClick={onBackdrop}
            className="theme-light h-full overflow-y-auto overscroll-contain px-3 py-3 sm:px-6 sm:py-10 lg:py-14"
          >
            <div className="svc-dialog-panel relative mx-auto max-w-[1120px] rounded-[28px] border border-[#0b0f19]/[0.06] bg-white shadow-[0_40px_100px_-40px_rgba(40,30,110,0.35)] p-6 pt-16 font-urbanist sm:p-10 sm:pt-12 lg:p-14">
              <button
                type="button"
                onClick={close}
                data-autofocus
                aria-label="Close"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-[#f0eeff] text-[#4b3fd1] transition-colors hover:bg-[#e4e0ff] sm:right-6 sm:top-6"
              >
                <X size={18} strokeWidth={2} aria-hidden />
              </button>

              <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
                <div>
                  <p className="flex items-center gap-2 text-[13px] font-semibold text-ink-dim">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: active.palette.dot }} />
                    {active.group.name}
                  </p>
                  <h2
                    id="svc-dialog-title"
                    className="mt-3 text-[28px] font-semibold leading-[1.12] tracking-[-0.015em] text-ink sm:text-[36px]"
                  >
                    {active.headline}
                  </h2>
                  <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-ink-dim sm:text-[17px]">{active.group.focus}</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href={servicePath(active.group.slug)}
                      onClick={close}
                      className="inline-flex h-11 items-center gap-1.5 rounded-full bg-[#0b0f19] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#262b3a]"
                    >
                      Explore {active.group.name}
                      <ArrowRight size={15} strokeWidth={2} aria-hidden />
                    </Link>
                    <Link
                      href={`/contact?brief=${encodeURIComponent(`I'm interested in ${active.group.name}: `)}`}
                      onClick={close}
                      className="inline-flex h-11 items-center rounded-full border border-[#0b0f19]/15 px-5 text-[14px] font-semibold text-ink transition-colors hover:bg-[#f4f5f8]"
                    >
                      Start a project
                    </Link>
                  </div>
                  <div className="mt-8 flex items-center gap-3">
                    <span className="text-[12px] font-medium text-ink-faint">Built with</span>
                    <span className="flex gap-1.5">
                      {active.tools.map((T, i) => (
                        <span key={i} className="grid h-8 w-8 place-items-center rounded-full border border-hairline text-ink-dim">
                          <T size={14} aria-hidden />
                        </span>
                      ))}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                    {active.services.length} services
                  </p>
                  <ul className={`mt-3 grid gap-x-6 ${active.services.length > 6 ? "sm:grid-cols-2" : ""}`}>
                    {active.services.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={servicePath(s.slug)}
                          onClick={close}
                          className="group/svc flex items-start gap-2.5 rounded-lg py-1.5 text-[15px] leading-snug text-ink-mid transition-colors hover:text-ink"
                        >
                          <span
                            className="mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded-full"
                            style={{ background: `${active.palette.dot}1f`, color: active.palette.dot }}
                          >
                            <Check size={10} strokeWidth={3} aria-hidden />
                          </span>
                          <span className="underline-offset-4 group-hover/svc:underline">{s.menuLabel}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                aria-hidden
                className="pointer-events-none relative mt-10 h-[340px] select-none overflow-hidden rounded-[22px] border border-[#0b0f19]/[0.06] sm:h-[360px] lg:mt-12"
              >
                <Wash palette={active.palette} />
                <div className="relative h-full pt-8">
                  <active.visual />
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}

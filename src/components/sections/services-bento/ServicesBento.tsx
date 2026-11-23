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
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import ExpandIcon from "@/components/system/ExpandIcon";
import ServiceDialogBody, { type Tool } from "./ServiceDialogBody";
import { AgentsVisual, SoftwareVisual, IntegrationVisual, DesignVisual, WebVisual } from "./visuals";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";

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
  { headline: string; palette: Palette; visual: ComponentType; span?: string; tools: Tool[] }
> = {
  "ai-agents-automation": {
    headline: "AI agents that finish real work inside the tools you already use",
    palette: {
      wash: "radial-gradient(90% 110% at 100% 100%, #8676ff 0%, #c08aff 22%, #dcc6ff 42%, rgba(238,230,255,0.6) 60%, rgba(255,255,255,0) 78%), radial-gradient(60% 70% at 0% 100%, rgba(255,143,191,0.55) 0%, rgba(255,255,255,0) 70%)",
      dot: "#7c6cff",
    },
    visual: AgentsVisual,
    span: "md:col-span-2",
    tools: [{ icon: SiPython, name: "Python", bg: "#3776AB" }, { icon: SiLangchain, name: "LangChain", bg: "#1C3C3C" }, { icon: SiHuggingface, name: "Hugging Face", bg: "#FFD21E", fg: "#1d2130" }],
  },
  "ai-software-development": {
    headline: "SaaS products and MVPs, built to scale",
    palette: {
      wash: "radial-gradient(110% 80% at 50% 105%, #4f6bff 0%, #8676ff 18%, #c08aff 36%, #eee6ff 58%, rgba(255,255,255,0) 80%)",
      dot: "#4f6bff",
    },
    visual: SoftwareVisual,
    tools: [{ icon: SiReact, name: "React", bg: "#61DAFB", fg: "#1d2130" }, { icon: SiNextdotjs, name: "Next.js", bg: "#000000" }, { icon: SiNodedotjs, name: "Node.js", bg: "#5FA04E" }, { icon: SiTypescript, name: "TypeScript", bg: "#3178C6" }],
  },
  "ai-integration-infrastructure": {
    headline: "Connect AI to your systems and data, securely",
    palette: {
      wash: "radial-gradient(100% 80% at 100% 100%, #4f9be0 0%, #8cc1f2 26%, #bfddfb 46%, rgba(227,239,253,0.6) 64%, rgba(255,255,255,0) 82%)",
      dot: "#1b78cc",
    },
    visual: IntegrationVisual,
    tools: [{ icon: SiDocker, name: "Docker", bg: "#2496ED" }, { icon: SiKubernetes, name: "Kubernetes", bg: "#326CE5" }, { icon: SiPostgresql, name: "PostgreSQL", bg: "#4169E1" }],
  },
  "ui-ux-product-design": {
    headline: "Product design people understand at first use",
    palette: {
      wash: "radial-gradient(90% 90% at 30% 100%, #ff8fbf 0%, #f09cc6 20%, #d6a9ff 40%, #e9d5ff 58%, rgba(246,238,253,0.6) 72%, rgba(255,255,255,0) 86%)",
      dot: "#e96aa8",
    },
    visual: DesignVisual,
    tools: [{ icon: SiFigma, name: "Figma", bg: "#F24E1E" }, { icon: SiFramer, name: "Framer", bg: "#0055FF" }],
  },
  "websites-commerce": {
    headline: "Websites and stores that rank, get cited and convert",
    palette: {
      wash: "radial-gradient(100% 85% at 0% 100%, #ffa26c 0%, #ffa98a 18%, #ffc970 34%, #ffe3ba 52%, rgba(255,244,232,0.6) 68%, rgba(255,255,255,0) 84%)",
      dot: "#f08a3e",
    },
    visual: WebVisual,
    tools: [{ icon: SiWordpress, name: "WordPress", bg: "#21759B" }, { icon: SiWebflow, name: "Webflow", bg: "#146EF5" }, { icon: SiShopify, name: "Shopify", bg: "#7AB55C" }],
  },
};

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// a group without its own artwork is on the services page, not here
const ITEMS = SERVICE_GROUPS.filter((g) => CARDS[g.slug]).map((g) => ({
  group: g,
  ...CARDS[g.slug],
  services: servicesInGroup(g.slug),
}));

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

export default function ServicesBento({ copy }: { copy?: CopyOf<"servicesBento"> }) {
  const c = homeCopy("servicesBento", copy);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  // the card visuals are decorative (aria-hidden) and heavy (hundreds of SVG nodes):
  // drawn in the browser only, never in the server HTML, so the page ships lighter.
  // This section wakes ~800px before it is seen, so they are there before anyone looks.
  const [drawn, setDrawn] = useState(false);
  useEffect(() => setDrawn(true), []);
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
                <SectionEyebrow>{c.eyebrow}</SectionEyebrow>
                <SectionTitle id="services-heading" className="max-w-xl">
                  {c.title}
                </SectionTitle>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/services"
                  className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-aurora-violet px-5 py-2.5 font-urbanist text-[13px] font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
                >
                  {c.button}
                  <ArrowRight size={14} strokeWidth={1.75} />
                </Link>
              </div>
            </div>
          </Reveal>

          <ul className="mt-10 lg:mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {ITEMS.map((item, i) => {
              const Visual = item.visual;
              return (
                <li key={item.group.slug} className={item.span ?? ""}>
                  <Reveal delay={i * 70} className="h-full">
                    <article className="group/card relative flex h-[440px] flex-col overflow-hidden rounded-[18px] border border-[#0b0f19]/[0.07] bg-white transition-shadow duration-300 hover:shadow-[0_24px_60px_-28px_rgba(11,15,25,0.35)] sm:h-[460px]">
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
                        {drawn && <Visual />}
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
            <div className="svc-dialog-panel">
              <ServiceDialogBody
                group={active.group}
                headline={active.headline}
                services={active.services}
                tools={active.tools}
                dot={active.palette.dot}
                Visual={active.visual}
                wash={<Wash palette={active.palette} />}
                onClose={close}
              />
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}

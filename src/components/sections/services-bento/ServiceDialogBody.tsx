"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { saveBrief } from "@/lib/briefHandoff";
import { ArrowRight, X } from "lucide-react";
import type { IconType } from "react-icons";
import { servicePath, type Service, type ServiceGroup } from "@/data/services";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { REAL_REVIEWS } from "@/data/reviews";
import { Icon } from "@/lib/icons";

/**
 * The service pop-up (Services section), top to bottom:
 *  1. header: group, headline, focus line, actions, tools; the visual beside
 *  2. the services in the group, as glass cards (icon, name, one line)
 *  3. related projects: case studies that used any of these services
 *  4. a client review: only REAL reviews linked to those projects
 *  5. a closing "Get started" band
 * Sections 3 and 4 hide themselves when there is nothing real to show.
 * Glass styling: globals.css "Service dialog".
 */
/** A tool in the "Built with" row: its icon on its own brand colour (fg: icon colour on light brands). */
export type Tool = { icon: IconType; name: string; bg: string; fg?: string };

type Props = {
  group: ServiceGroup;
  headline: string;
  services: Service[];
  tools: Tool[];
  dot: string;
  Visual: ComponentType;
  wash: React.ReactNode;
  onClose: () => void;
};

export default function ServiceDialogBody({ group, headline, services, tools, dot, Visual, wash, onClose }: Props) {
  const names = new Set(services.flatMap((s) => [s.title, s.menuLabel]));
  const projects = CASE_STUDIES.filter((c) => c.services.some((s) => names.has(s)));
  const review = REAL_REVIEWS.find((r) => r.caseSlug && projects.some((p) => p.slug === r.caseSlug));
  // the words wait in this tab (lib/briefHandoff), never in the address
  const startProject = () => {
    saveBrief(`I'm interested in ${group.name}: `);
    onClose();
  };

  return (
    <div className="svc-glass relative mx-auto max-w-[1120px] rounded-[24px] p-5 pt-16 font-urbanist sm:p-9 sm:pt-10 lg:p-12">
      <button
        type="button"
        onClick={onClose}
        data-autofocus
        aria-label="Close"
        className="svc-glass-btn absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full text-[#272b3d] sm:right-6 sm:top-6"
      >
        <X size={17} strokeWidth={2} aria-hidden />
      </button>

      {/* 1 · header */}
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <div>
          <p className="flex items-center gap-2 text-[13px] font-semibold text-ink-dim">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
            {group.name}
          </p>
          <h2 id="svc-dialog-title" className="mt-3 text-[28px] font-semibold leading-[1.12] tracking-[-0.015em] text-[#272b3d] sm:text-[36px]">
            {headline}
          </h2>
          <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-ink-dim">{group.focus}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/contact" onClick={startProject} className="cta-glossy inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-[14px] font-semibold text-white">
              Start a project
              <ArrowRight size={15} strokeWidth={2} aria-hidden />
            </Link>
            <Link
              href={servicePath(group.slug)}
              onClick={onClose}
              className="svc-glass-btn inline-flex h-11 items-center rounded-full px-5 text-[14px] font-semibold text-[#272b3d]"
            >
              Explore {group.name}
            </Link>
          </div>
          {tools.length > 0 && (
            <div className="mt-7 flex items-center gap-3">
              <span className="text-[12px] font-medium text-ink-dim">Built with</span>
              <span className="flex gap-1.5">
                {tools.map((t) => (
                  <span
                    key={t.name}
                    title={t.name}
                    aria-label={t.name}
                    role="img"
                    className="grid h-8 w-8 place-items-center rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_4px_10px_-4px_rgba(11,15,25,0.35)] ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5"
                    style={{ background: t.bg, color: t.fg ?? "#fff" }}
                  >
                    <t.icon size={15} aria-hidden />
                  </span>
                ))}
              </span>
            </div>
          )}
        </div>
        <div aria-hidden className="pointer-events-none relative h-[300px] select-none overflow-hidden rounded-[18px] border border-white/80 sm:h-[330px]">
          {wash}
          <div className="relative h-full pt-8">
            <Visual />
          </div>
        </div>
      </div>

      {/* 2 · services */}
      <section className="mt-12" aria-labelledby="svc-dialog-services">
        <h3 id="svc-dialog-services" className="svc-label">
          {services.length} services
        </h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={servicePath(s.slug)} onClick={onClose} className="svc-card group/svc flex h-full flex-col rounded-[16px] p-5">
                <span className="mega-icon-tile grid h-10 w-10 place-items-center rounded-[12px]">
                  <Icon name={s.icon} size={18} />
                </span>
                <span className="mt-4 flex items-start justify-between gap-2 text-[16px] font-semibold leading-snug text-[#272b3d]">
                  {s.menuLabel}
                  <ArrowRight size={15} strokeWidth={2} aria-hidden className="mt-1 shrink-0 text-[#615fff] opacity-0 transition-[opacity,transform] duration-200 group-hover/svc:translate-x-0.5 group-hover/svc:opacity-100" />
                </span>
                <span className="mt-1.5 text-[14px] leading-relaxed text-ink-dim">{s.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 3 · related projects */}
      {projects.length > 0 && (
        <section className="mt-12" aria-labelledby="svc-dialog-projects">
          <h3 id="svc-dialog-projects" className="svc-label">
            Related projects
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((c) => (
              <li key={c.slug}>
                <Link href={`/case-studies/${c.slug}`} onClick={onClose} className="svc-card group/proj flex h-full flex-col overflow-hidden rounded-[16px]">
                  <span className="relative block aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element -- decorative cover, loaded with the dialog */}
                    <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/proj:scale-[1.03]" />
                  </span>
                  <span className="flex flex-1 flex-col p-5">
                    <span className="text-[16px] font-semibold text-[#272b3d]">{c.project}</span>
                    <span className="mt-0.5 text-[12.5px] font-medium text-ink-dim">
                      {c.industry}
                      {c.market ? ` · ${c.market}` : ""}
                    </span>
                    <span className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-ink-dim">{c.summary}</span>
                    <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[13px] font-semibold text-[#4f46e5]">
                      Read the case study
                      <ArrowRight size={13} strokeWidth={2} aria-hidden className="transition-transform duration-200 group-hover/proj:translate-x-0.5" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 4 · client review (real only) */}
      {review && (
        <figure className="svc-card mt-12 rounded-[20px] px-6 py-9 text-center sm:px-12">
          <blockquote className="mx-auto max-w-[44ch] text-[20px] font-medium leading-snug tracking-[-0.01em] text-[#272b3d] sm:text-[24px]">
            “{review.quote}”
          </blockquote>
          <figcaption className="mt-5 text-[14px] text-ink-dim">
            <span className="font-semibold text-[#272b3d]">{review.name}</span>, {review.role}, {review.company}
            {review.market ? ` · ${review.market}` : ""}
          </figcaption>
        </figure>
      )}

      {/* 5 · get started */}
      <div className="svc-cta mt-12 flex flex-col items-center gap-5 rounded-[20px] px-6 py-10 text-center">
        <h3 className="text-[24px] font-semibold tracking-[-0.015em] text-[#272b3d] sm:text-[28px]">Get started with {group.name}</h3>
        <p className="-mt-2 max-w-[46ch] text-[15px] text-ink-dim">Tell us what you want to build, and we will plan the first steps with you.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/contact" onClick={startProject} className="cta-glossy inline-flex h-11 items-center gap-1.5 rounded-full px-6 text-[14px] font-semibold text-white">
            Start a project
            <ArrowRight size={15} strokeWidth={2} aria-hidden />
          </Link>
          <Link href="/contact" onClick={onClose} className="svc-glass-btn inline-flex h-11 items-center rounded-full px-6 text-[14px] font-semibold text-[#272b3d]">
            Book a Call
          </Link>
        </div>
      </div>
    </div>
  );
}

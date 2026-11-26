"use client";

import Image from "next/image";
import Link from "next/link";
import { saveBrief } from "@/lib/briefHandoff";
import { ArrowRight, ArrowUpRight, Check, Code2, ExternalLink, Target, Users, X } from "lucide-react";
import Flag from "@/components/system/Flag";
import CaseStudyVideo from "@/components/case-studies/CaseStudyVideo";
import type { CaseStudy } from "@/lib/caseStudies";

/**
 * The case-study pop-up (homepage Case studies), the whole story without
 * leaving the page. Same glass shell as the service pop-up (globals.css
 * "Service dialog"). Top to bottom: header + actions, the film or screen,
 * stats, snapshot, challenge, goals, approach, key decisions, what we built,
 * results, gallery, client quote, what's next, closing band. Every block
 * renders only when the case study has that data: nothing is filled in.
 */
type Props = { cs: CaseStudy; accent: string; onClose: () => void };

const GOALS = [
  { key: "business", title: "Business goals", Icon: Target },
  { key: "user", title: "User goals", Icon: Users },
  { key: "engineering", title: "Engineering goals", Icon: Code2 },
] as const;

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12" aria-labelledby={id}>
      <h3 id={id} className="svc-label">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Ticks({ items, accent, cols }: { items: string[]; accent: string; cols?: boolean }) {
  return (
    <ul className={cols ? "grid gap-x-8 gap-y-3 sm:grid-cols-2" : "space-y-3"}>
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[#272b3d]">
          <Check size={16} strokeWidth={2.4} className="mt-[4px] shrink-0" style={{ color: accent }} aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function CaseStudyDialogBody({ cs, accent, onClose }: Props) {
  const host = cs.liveUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const snapshot = [
    { label: "Timeline", value: cs.timeline },
    { label: "Team", value: cs.team },
    { label: "Engagement", value: cs.engagementModel },
    { label: "Platforms", value: cs.platforms },
    { label: "Services", value: cs.services.join(", ") },
    { label: "Tech stack", value: cs.tech.join(", ") },
  ].filter((s) => s.value);
  // only screens we host: stock placeholders (picsum etc.) never pass as the client's product
  const gallery = (cs.gallery ?? []).filter((g) => g.src.startsWith("/"));
  // the words wait in this tab (lib/briefHandoff), never in the address
  const startProject = () => {
    saveBrief(`I'd like something like ${cs.project}: `);
    onClose();
  };

  return (
    <div className="svc-glass relative mx-auto min-h-full w-full max-w-[1760px] rounded-[24px] p-5 pt-16 font-urbanist sm:p-8 sm:pt-10 lg:p-10 xl:p-12">
      {/* the close button stays in the top corner while the story scrolls */}
      <div className="pointer-events-none sticky top-3 z-20 h-0 sm:top-5">
      <button
        type="button"
        onClick={onClose}
        data-autofocus
        aria-label="Close"
        className="svc-glass-btn pointer-events-auto absolute -top-1 right-0 z-10 grid h-10 w-10 place-items-center rounded-full text-[#272b3d]"
      >
        <X size={17} strokeWidth={2} aria-hidden />
      </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 xl:gap-16">
      {/* left: who, what, the film; pinned while the right side scrolls */}
      <aside className="self-start lg:sticky lg:top-10">
      <div>
        <p className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-ink-dim">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          {cs.project}
          <span className="rounded-full bg-white px-2.5 py-0.5 text-[12px] font-medium text-[#272b3d] ring-1 ring-[#1e1950]/[0.08]">{cs.industry}</span>
          {cs.market && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white py-0.5 pl-2 pr-2.5 text-[12px] font-medium text-[#272b3d] ring-1 ring-[#1e1950]/[0.08]">
              <Flag market={cs.market} />
              {cs.market}
            </span>
          )}
        </p>
        <h2 id="case-dialog-title" className="mt-3 text-[28px] font-semibold leading-[1.12] tracking-[-0.015em] text-[#272b3d] sm:text-[34px] lg:text-[28px] xl:text-[34px]">
          {cs.headline}
        </h2>
        <p className="mt-4 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-dim">{cs.summary}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/contact" onClick={startProject} className="cta-glossy inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-[14px] font-semibold text-white">
            Start a similar project
            <ArrowRight size={15} strokeWidth={2} aria-hidden />
          </Link>
          {cs.liveUrl && (
            <a
              href={cs.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="svc-glass-btn inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-[14px] font-semibold text-[#272b3d]"
            >
              Visit {host}
              <ExternalLink size={14} strokeWidth={2} aria-hidden />
            </a>
          )}
        </div>
      </div>

      {/* film or screen */}
      <div className="mt-8 overflow-hidden rounded-[18px] lg:max-w-[min(100%,calc((100dvh-520px)*1.78))] border border-white/80 bg-white shadow-[0_30px_70px_-40px_rgba(40,30,110,0.45)]">
        <div className="relative aspect-video">
          {cs.video ? (
            <CaseStudyVideo src={cs.video} poster={cs.poster ?? cs.image} project={cs.project} />
          ) : (
            <Image src={cs.image} alt={cs.imageAlt ?? `${cs.project} screen`} fill sizes="(min-width: 1024px) 42vw, 94vw" className="object-cover object-top" />
          )}
        </div>
      </div>
      </aside>

      {/* right: the full story */}
      <div className="min-w-0 lg:pr-14 lg:pt-16 [&>*:first-child]:mt-0">
      {/* stats */}
      {cs.stats.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {cs.stats.map((s) => (
            <div key={s.label} className="svc-card rounded-[16px] p-4">
              <dd className="text-[20px] font-bold leading-tight tracking-[-0.02em] text-[#272b3d]">{s.value}</dd>
              <dt className="mt-1 text-[12.5px] leading-snug text-ink-dim">{s.label}</dt>
            </div>
          ))}
        </dl>
      )}

      {snapshot.length > 0 && (
        <Block id="case-dialog-snapshot" title="Project snapshot">
          <dl className="svc-card grid rounded-[18px] sm:grid-cols-2 2xl:grid-cols-3">
            {snapshot.map((s) => (
              <div key={s.label} className="border-b border-[#1e1950]/[0.06] p-5 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 2xl:[&:nth-last-child(-n+3)]:border-b-0">
                <dt className="text-[12.5px] font-medium text-ink-dim">{s.label}</dt>
                <dd className="mt-1 text-[15px] font-semibold leading-snug text-[#272b3d]">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Block>
      )}

      {cs.challenge && cs.challenge.length > 0 && (
        <Block id="case-dialog-challenge" title="The challenge">
          <Ticks items={cs.challenge} accent={accent} cols />
          {cs.risk && (
            <p className="mt-5 rounded-[14px] bg-[#fff6ef] px-5 py-4 text-[14.5px] leading-relaxed text-[#5a3a22] ring-1 ring-[#f08a3e]/20">
              <span className="font-semibold">What was at risk: </span>
              {cs.risk}
            </p>
          )}
        </Block>
      )}

      {cs.goals && (
        <Block id="case-dialog-goals" title="Goals">
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {GOALS.filter((g) => cs.goals![g.key]?.length).map(({ key, title, Icon }) => (
              <div key={key} className="svc-card rounded-[18px] p-5">
                <p className="flex items-center gap-2 text-[15px] font-semibold text-[#272b3d]">
                  <span className="mega-icon-tile grid h-8 w-8 place-items-center rounded-[10px]">
                    <Icon size={15} aria-hidden />
                  </span>
                  {title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {cs.goals![key].map((t) => (
                    <li key={t} className="text-[14px] leading-relaxed text-ink-dim">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>
      )}

      {cs.approach && cs.approach.length > 0 && (
        <Block id="case-dialog-approach" title="How we approached it">
          <ol className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {cs.approach.map((step, i) => (
              <li key={step} className="svc-card flex gap-3 rounded-[16px] p-5">
                <span className="text-[13px] font-bold tabular-nums" style={{ color: accent }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14.5px] leading-relaxed text-[#272b3d]">{step}</span>
              </li>
            ))}
          </ol>
          {cs.cadence && <p className="mt-4 text-[14px] text-ink-dim">{cs.cadence}</p>}
        </Block>
      )}

      {cs.solutions && cs.solutions.length > 0 && (
        <Block id="case-dialog-solutions" title="Key decisions">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {cs.solutions.map((s) => (
              <div key={s.problem} className="svc-card rounded-[18px] p-5 sm:p-6">
                <p className="text-[15px] font-semibold leading-snug text-[#272b3d]">{s.problem}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-dim">
                  <span className="font-semibold text-[#272b3d]">What we did: </span>
                  {s.decision}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">
                  <span className="font-semibold text-[#272b3d]">Why it worked: </span>
                  {s.whyItWorked}
                </p>
              </div>
            ))}
          </div>
        </Block>
      )}

      {cs.deliverables && cs.deliverables.length > 0 && (
        <Block id="case-dialog-built" title="What we built">
          <Ticks items={cs.deliverables} accent={accent} cols />
        </Block>
      )}

      {Boolean(cs.results?.operational?.length || cs.results?.qualitative?.length) && (
        <Block id="case-dialog-results" title="Results">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[cs.results?.operational, cs.results?.qualitative].filter((r): r is string[] => Boolean(r?.length)).map((r, i) => (
              <div key={i} className="svc-card rounded-[18px] p-5 sm:p-6">
                <Ticks items={r} accent={accent} />
              </div>
            ))}
          </div>
        </Block>
      )}

      {gallery.length > 0 && (
        <Block id="case-dialog-gallery" title="Screens">
          <ul className="grid gap-3 sm:grid-cols-2">
            {gallery.map((g) => (
              <li key={g.src} className="svc-card overflow-hidden rounded-[18px]">
                <div className="relative aspect-[16/10] bg-[#f6f4f1]">
                  <Image src={g.src} alt={g.caption} fill sizes="(min-width: 1120px) 520px, 94vw" className="object-cover object-top" />
                </div>
                <p className="px-5 py-4 text-[13.5px] leading-snug text-ink-dim">{g.caption}</p>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {cs.testimonial && (
        <figure className="svc-card mt-12 rounded-[20px] px-6 py-9 text-center sm:px-12">
          <blockquote className="mx-auto max-w-[52ch] text-[19px] font-medium leading-snug tracking-[-0.01em] text-[#272b3d] sm:text-[22px]">
            “{cs.testimonial.quote}”
          </blockquote>
          <figcaption className="mt-5 text-[14px] text-ink-dim">
            <span className="font-semibold text-[#272b3d]">{cs.testimonial.name}</span>, {cs.testimonial.role}
          </figcaption>
        </figure>
      )}

      {cs.whatsNext && cs.whatsNext.length > 0 && (
        <Block id="case-dialog-next" title="What's next">
          <Ticks items={cs.whatsNext} accent={accent} cols />
        </Block>
      )}

      {/* closing band */}
      <div className="svc-cta mt-12 flex flex-col items-center gap-5 rounded-[20px] px-6 py-10 text-center">
        <h3 className="text-[24px] font-semibold tracking-[-0.015em] text-[#272b3d] sm:text-[28px]">Have a project like {cs.project}?</h3>
        <p className="-mt-2 max-w-[46ch] text-[15px] text-ink-dim">Tell us what you want to build, and we will plan the first steps with you.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/contact" onClick={startProject} className="cta-glossy inline-flex h-11 items-center gap-1.5 rounded-full px-6 text-[14px] font-semibold text-white">
            Start a project
            <ArrowRight size={15} strokeWidth={2} aria-hidden />
          </Link>
          <Link
            href={`/case-studies/${cs.slug}`}
            onClick={onClose}
            className="svc-glass-btn inline-flex h-11 items-center gap-1.5 rounded-full px-6 text-[14px] font-semibold text-[#272b3d]"
          >
            Open as a page
            <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}

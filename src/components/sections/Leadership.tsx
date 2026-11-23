"use client";

import Image from "next/image";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";

/**
 * Homepage › leadership. Buyers hire people: before a call, an overseas
 * client wants to see who runs the company. A note from the founder (when
 * written) and the leadership team as portrait cards. Everything comes from
 * the CMS (Pages › Home › Leadership). A person without a name is drawn as a
 * clearly marked placeholder, so nothing invented ever reads as real.
 * A white card on the floating frame.
 */
type Person = { name?: string; role?: string; bio?: string; linkedin?: string; photo?: { url: string; alt?: string } };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

function LinkedIn() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function Card({ p }: { p: Person }) {
  const name = p.name?.trim();
  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] border border-[#0b0f19]/[0.06] bg-[#f6f4f1]">
        {p.photo?.url ? (
          <Image
            src={p.photo.url}
            alt={p.photo.alt ?? name ?? ""}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
            className="object-cover grayscale transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(80%_70%_at_50%_100%,rgba(97,95,255,0.10),transparent_70%)]">
            <span className="grid h-20 w-20 place-items-center rounded-full border border-[#0b0f19]/[0.08] bg-white font-urbanist text-[22px] font-semibold text-ink-faint">
              {name ? initials(name) : <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>}
            </span>
          </div>
        )}
        {!name && (
          <span className="absolute left-3 top-3 rounded-full bg-[#fef3c7] px-2.5 py-1 font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#92400e]">
            Placeholder
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-urbanist text-[17px] font-bold leading-tight tracking-tight text-ink">{name || "Name to add"}</h3>
          {p.role && <p className="mt-1 font-urbanist text-[13px] text-ink-dim">{p.role}</p>}
        </div>
        {p.linkedin?.startsWith("https://") && (
          <a
            href={p.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name ?? "This person"} on LinkedIn`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#0b0f19]/10 text-ink-dim transition-colors hover:border-[#0a66c2]/40 hover:text-[#0a66c2]"
          >
            <LinkedIn />
          </a>
        )}
      </div>
      {p.bio && <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{p.bio}</p>}
    </article>
  );
}

export default function Leadership({ copy }: { copy?: CopyOf<"leadership"> }) {
  const c = homeCopy("leadership", copy) as ReturnType<typeof homeCopy<"leadership">> & { people: Person[] };
  const people = (c.people ?? []).filter((p) => p.name || p.role);
  if (!people.length) return <></>;

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section aria-labelledby="leadership-heading" className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
              <div>
                <SectionEyebrow>{c.eyebrow}</SectionEyebrow>
                <SectionTitle id="leadership-heading" className="max-w-[16ch] text-balance">
                  {c.title}
                </SectionTitle>
              </div>
              {c.message && (
                <figure className="border-l-2 border-[#615fff]/40 pl-6">
                  <blockquote className="font-urbanist text-[16px] leading-relaxed text-ink sm:text-[17px]">&ldquo;{c.message}&rdquo;</blockquote>
                  {c.signature && <figcaption className="mt-3 font-urbanist text-[13px] font-semibold text-ink-dim">{c.signature}</figcaption>}
                </figure>
              )}
            </div>
          </Reveal>

          <div className={`mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:mt-14 ${people.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {people.map((p, i) => (
              <Reveal key={`${p.name}-${p.role}-${i}`} delay={60 + i * 70}>
                <Card p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import Reveal from "@/components/system/Reveal";

/**
 * 4.5 Delivery system + standards — PASS 2: cards reveal left-to-right
 * (90ms stagger) with the connector line drawing in (scaleX, CSS
 * `.connector-line` keyed off Reveal's data-shown); standards checklist
 * items stagger per column; subtle card lift on hover. No pinning.
 */
const STEPS = [
  { n: "01", title: "Kickoff", body: "Scope, success metrics, and access sorted in the first session. You meet the whole team." },
  { n: "02", title: "Plan", body: "A weekly increment plan you can read in five minutes. Every week has a demo target." },
  { n: "03", title: "Build", body: "Short cycles, visible progress — a staging link, not a status report." },
  { n: "04", title: "Demo", body: "Every Friday: working software, honest notes, and the plan adjusted in the open." },
  { n: "05", title: "Release", body: "Clean handover is the deliverable: documented code, your infra, your accounts." },
];

const PROOF_ROW = [
  "Weekly demos",
  "Shared tracking (Jira/Linear/Notion)",
  "QA + release checks",
  "Documentation + handover",
];

const STANDARDS: { title: string; items: string[] }[] = [
  {
    title: "Engineering standards",
    items: ["Code reviews", "QA gates", "Release checks", "Security basics", "Performance basics"],
  },
  {
    title: "Design standards",
    items: [
      "Consistency",
      "Reusable components",
      "Accessibility basics",
      "Dev-ready specs",
      "Design-system discipline",
    ],
  },
];

export default function DeliverySystem() {
  return (
    <section className="bg-light-surface py-16 lg:py-32" aria-labelledby="delivery-heading">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.25em] text-light-dim">
            How we deliver
          </p>
          <h2
            id="delivery-heading"
            className="max-w-2xl font-display text-3xl font-bold tracking-tight text-light-ink sm:text-4xl"
          >
            Predictable delivery. No chaos.
          </h2>
          <p className="mt-4 max-w-xl font-body text-lg leading-relaxed text-light-dim">
            A simple operating system that keeps scope, quality, and speed aligned.
          </p>
        </Reveal>

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {STEPS.map((s, i) => (
            <li key={s.n} className={i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <Reveal delay={i * 90} className="h-full">
                <article className="card-light lift-sm flex h-full flex-col rounded-xl p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="font-display text-sm font-medium text-light-dim">{s.n}</span>
                    <span className="connector-line h-px flex-1 bg-black/10" aria-hidden />
                    {i < STEPS.length - 1 && (
                      <span className="font-display text-sm text-light-dim" aria-hidden>
                        →
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-light-ink">
                    {s.title}
                  </h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-light-dim">{s.body}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Mini proof row */}
        <ul className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-hairline-light py-6">
          {PROOF_ROW.map((p, i) => (
            <li key={p}>
              <Reveal delay={i * 70}>
                <span className="flex items-center gap-2 font-body text-sm text-light-dim">
                  <span className="h-1.5 w-1.5 rounded-full bg-aurora-violet" aria-hidden />
                  {p}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Standards block */}
        <Reveal>
          <h3 className="mt-14 font-display text-2xl font-bold tracking-tight text-light-ink">
            Standards that reduce rework
          </h3>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {STANDARDS.map((s, ci) => (
            <Reveal key={s.title} delay={ci * 100} className="h-full">
              <div className="card-light lift-sm h-full rounded-xl p-8">
                <p className="font-display text-lg font-bold text-light-ink">{s.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {s.items.map((it, ii) => (
                    <li key={it}>
                      <Reveal delay={150 + ii * 60}>
                        <span className="flex gap-3 font-body text-sm text-light-dim">
                          <span className="text-aurora-violet" aria-hidden>
                            ✓
                          </span>
                          {it}
                        </span>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <div className="mt-12">
            <Link
              href="/how-we-work/process"
              className="inline-block rounded-full border border-black/15 px-7 py-3.5 font-display text-sm font-medium text-light-ink transition-colors hover:border-black/40"
            >
              How We Work →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { DECISION_QUIZ, MODEL_OVERVIEWS } from "@/lib/engagementContent";

/**
 * "Help me choose" mini decision tool. Each answer contributes weighted
 * points to 1–2 candidate models (2 for its primary pick, 1 for a
 * secondary); once all 3 questions are answered, the two highest-scoring
 * models become "Recommended" / "Also fits", and the "why" line is built
 * from the reasons attached to whichever answers actually pointed at the
 * winning model — so the explanation always traces back to a real
 * answer, not a canned response unrelated to what was picked.
 */
export default function EngagementQuiz({ id }: { id: string }) {
  const [answers, setAnswers] = useState<(number | null)[]>(DECISION_QUIZ.map(() => null));

  const setAnswer = (qIndex: number, choiceIndex: number) => {
    setAnswers((prev) => prev.map((v, i) => (i === qIndex ? choiceIndex : v)));
  };

  const result = useMemo(() => {
    const answered = answers.every((a) => a !== null);
    if (!answered) return null;

    const scores = new Map<string, number>();
    const reasonsByModel = new Map<string, string[]>();

    DECISION_QUIZ.forEach((q, i) => {
      const choice = q.choices[answers[i] as number];
      scores.set(choice.primary, (scores.get(choice.primary) ?? 0) + 2);
      reasonsByModel.set(choice.primary, [...(reasonsByModel.get(choice.primary) ?? []), choice.reason]);
      if (choice.secondary) {
        scores.set(choice.secondary, (scores.get(choice.secondary) ?? 0) + 1);
      }
    });

    const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
    const topSlug = ranked[0][0];
    const secondSlug = ranked.find(([slug]) => slug !== topSlug)?.[0];

    const top = MODEL_OVERVIEWS.find((m) => m.href.endsWith(`/${topSlug}`));
    const second = secondSlug ? MODEL_OVERVIEWS.find((m) => m.href.endsWith(`/${secondSlug}`)) : undefined;
    const why = reasonsByModel.get(topSlug)?.[0] ?? "";

    return { top, second, why };
  }, [answers]);

  return (
    <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby={id} id="help-me-choose">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <Reveal>
          <SectionEyebrow className="mx-auto w-fit">Help Me Choose</SectionEyebrow>
          <SectionTitle as="h2" id={id} className="mx-auto max-w-xl text-center">
            Answer 3 quick questions.
          </SectionTitle>
          <SectionDescription className="mx-auto mt-3 max-w-lg text-center">
            We'll point you toward the model that fits your timeline, scope, and team today.
          </SectionDescription>
        </Reveal>

        <div className="mt-10 space-y-6">
          {DECISION_QUIZ.map((q, qi) => (
            <Reveal key={q.question} delay={qi * 70}>
              <div className="rounded-2xl border border-hairline-light bg-light-raised p-5 sm:p-6">
                <p className="font-urbanist text-[14px] font-bold text-ink">{q.question}</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {q.choices.map((choice, ci) => {
                    const selected = answers[qi] === ci;
                    return (
                      <button
                        key={choice.label}
                        type="button"
                        onClick={() => setAnswer(qi, ci)}
                        aria-pressed={selected}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-urbanist text-[13px] font-medium transition-colors duration-200 ${
                          selected
                            ? "border-aurora-violet bg-aurora-violet text-white"
                            : "border-hairline-light text-ink-dim hover:border-aurora-violet/50 hover:text-ink"
                        }`}
                      >
                        {selected && <Check size={13} strokeWidth={2.25} />}
                        {choice.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div
          className="mt-6 overflow-hidden transition-[grid-template-rows] duration-500"
          style={{ display: "grid", gridTemplateRows: result ? "1fr" : "0fr" }}
        >
          <div className="min-h-0">
            {result?.top && (
              <div className="rounded-2xl border border-aurora-violet/30 bg-canvas p-6 sm:p-8">
                <p className="font-urbanist text-[11px] font-semibold uppercase tracking-[0.2em] text-aurora-violet">Recommended</p>
                <h3 className="mt-2 font-urbanist text-xl font-bold text-ink">{result.top.label}</h3>
                <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{result.why}</p>
                {result.second && (
                  <p className="mt-3 font-urbanist text-[12.5px] text-ink-faint">
                    Also fits: <span className="font-semibold text-ink-dim">{result.second.label}</span>
                  </p>
                )}
                <Link
                  href={result.top.href}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 font-urbanist text-[13px] font-semibold text-canvas transition-transform duration-300 hover:scale-[1.02]"
                >
                  {result.top.ctaLabel}
                  <ArrowRight size={13} strokeWidth={1.75} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

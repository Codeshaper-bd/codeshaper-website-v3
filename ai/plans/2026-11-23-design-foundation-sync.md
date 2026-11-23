# Design foundation synchronization — 23 November 2026

## Owner-approved approach

Foundation First: synchronize the Design Handbook, CSS tokens and AI instructions before making homepage visual changes. Do not mass-refactor existing components during this pass.

## Scope completed in this pass

- Expanded the handbook with chapter 11, the implementation contract for semantic tokens, spacing/radius utilities, typography roles, compatibility and migration policy.
- Reconciled chapters 02–06 and 09 with the current Next.js 15 / Tailwind CSS v4 project and the owner's approved direction.
- Added semantic color, spacing and radius tokens in `src/app/globals.css`, including `.theme-light` values.
- Preserved legacy `canvas`, `light-surface`, `ink`, `hairline-*` and `aurora-*` utilities; no component-wide migration was attempted.
- Synchronized the shared design rules, UI Designer and Design Reviewer briefs, section/review workflows, Claude wrappers, Cursor rules, Copilot instructions, Gemini instructions and the chat design-coach prompt.
- Recorded the Foundation First owner decision in `ai/context/decisions.md`.

## Case Studies (corrected)

An earlier note here reported a Case Studies background mismatch in `src/components/sections/CaseStudies.tsx`. That was incorrect: the file was not used by any page and has been deleted (owner decision C4). The homepage renders `CaseStudiesFeatured.tsx`, which uses the default page background as approved. The verified section → component → background map is in `ai/knowledge/design/05-layout.md`.

## Corrections applied after the validation report (owner-approved C1–C4)

- C1: `surface-soft` in `.theme-light` is warm `#f6f4f1` (was `#f7f8fb`); unused by any component, so no visual change.
- C2: `theme-light` stays per section; a theme-scope rule was added to `ai/rules/design.md` and chapter 11.
- C3: `font-hero` references removed from chapters 03 and 11 (Inter is the default body font; no such utility exists).
- C4: unused `src/components/sections/CaseStudies.tsx` deleted after dependency verification.
- Chapter 05 white-card recipe corrected (`theme-light` on the outer frame); README chapter count corrected; archive note added.

## Explicit non-goals

- No homepage component redesign or section background change.
- No global class-name migration or removal of legacy tokens.
- No CMS ordering/content changes.
- No commit, push, deployment or changes to the owner's running localhost environment.

## Verification

- CSS brace-balance check passed.
- 14 semantic color tokens were found in `@theme` and mapped in `.theme-light`.
- 8 spacing/radius tokens were found.
- Local Markdown links in the Design Handbook resolved.
- Re-verified in the owner's project (2026-11-23), with dependencies installed:
  - `npx tsc --noEmit -p .` passes.
  - The `@theme` block compiled with the project's Tailwind v4 generates every documented token utility (`bg-page`, `bg-surface`, `bg-surface-soft`, `text-content*`, `border-border*`, `text-brand`, `bg-brand*`, `py-section`, `lg:py-section-lg`, `p-frame`, `sm:p-frame-lg`, `rounded-section|card|panel|control`, status colours). `font-hero` is not a utility (see C3).
  - The homepage and `/products` return 200 on the owner's dev server.
  - No existing component uses the new token names, so the pass introduced no visual change.
- A full production build was not run (the owner's dev server stays up on port 3000).

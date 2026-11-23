# 05 · Layout & section rhythm

## Container and grid

- **Container:** `mx-auto max-w-7xl` (80rem / 1280px) with `px-4 sm:px-6 lg:px-10` gutters.
- **Breakpoints:** Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. Inspect at **1440, 768 and 390px**.
- **Grid:** Think in 12 columns at `lg+`, 2 columns at `md`, 1 column on phones. Card grids commonly use `md:grid-cols-2 lg:grid-cols-3`.

## Homepage section rhythm

The homepage has exactly two approved section treatments, alternating in the owner-approved order. There are no dark homepage sections.

| Type | Markup pattern | Visual role |
|---|---|---|
| **Default** | `section.theme-light.bg-page` full bleed | The page itself; warm off-white |
| **White card** | `div.theme-light.bg-page.p-frame.sm:p-frame-lg > section.rounded-section.bg-surface` | White sheet framed by the page background |

`theme-light` goes on the **outermost** element of the section (the `section` for a default section, the outer frame `div` for a white card), exactly as in [02 · Spacing](02-spacing.md). The semantic tokens are dark outside `.theme-light`, and no ancestor (`html`, `body`, `SiteShell`) provides it, so a frame without it renders dark.

The canonical order and each section's assigned type live in [`ai/context/decisions.md`](../../context/decisions.md). That file wins over a component's current appearance. CMS may supply section order, so inspect both CMS data and the fallback order. Never infer that the current rendering is approved merely because it exists.

## Section anatomy

```text
[eyebrow]
[Title, normally no more than two lines]        [optional outline action]
                         ↓ mt-10 / lg:mt-14
[one clear content pattern: grid, list, split or stage]
                         ↓
[one primary action, only if the section needs it]
```

Homepage section headers use eyebrow + title, with optional right-side action. No descriptive sub-heading line under the title, per owner decision.

## Radius family

| Token / value | Use |
|---|---|
| `rounded-section` / 32px | White floating sections and large feature cards |
| `rounded-card` / 28px | Standard content/catalogue cards |
| `rounded-panel` / 24px | Inner media panels and secondary cards |
| `rounded-control` / 12px | Inputs, browser frames and compact controls |
| `rounded-full` | Buttons, chips, tags and avatars |

Nested radii step down with the inner element's padding.

## Responsive rules

- Split layouts stack on phones. Put the visual first only when it explains the content (e.g. a case-study screen); otherwise keep text first.
- Horizontal scrollers may bleed to the viewport edge on phones, with clear affordance and no hidden essential content.
- Never remove important information on phones; simplify or resize it instead.
- Touch targets should be at least 40px high; use larger targets where practical.

## Current implementation map (verified 2026-11-23)

Each homepage section, the component that renders it, and its background. All match the owner-approved order in `ai/context/decisions.md`; there is no known discrepancy. Existing sections still use the legacy utilities (`bg-light-surface`, `bg-canvas`, `rounded-[32px]`); that is expected until a migration is scoped.

| # | Section | Component (`src/components/…`) | Background |
|---|---|---|---|
| 1 | Hero | `hero/Hero.tsx` | its own white hero card |
| 2 | Brands | `sections/TrustStrip.tsx` | default (white → page gradient) |
| 3 | At a glance | `sections/AtAGlance.tsx` (+ `WorldMap.tsx`) | white card |
| 4 | Case studies | `sections/CaseStudiesFeatured.tsx` | default |
| 5 | Services | `sections/services-bento/ServicesBento.tsx` | white card |
| 6 | Products | `sections/ProductsShowcase.tsx` | default |
| 7 | Client reviews | `sections/Testimonials.tsx` | white card |
| 8 | Human + AI | `sections/human-ai-flow/HumanAiFlow.tsx` | default |
| 9 | Industries | `sections/Industries.tsx` | white card |
| 10 | Tools & technology | `sections/TechStack.tsx` | default |
| 11 | Team photos | `sections/ImpactWorkflow.tsx` (+ `PhotoCloud.tsx`) | white card (photo-wall stage) |
| 12 | Engagement models | `sections/EngagementModels.tsx` | default |
| 13 | Leadership | `sections/Leadership.tsx` | white card |
| 14 | FAQ | `sections/FAQ.tsx` | default |
| 15 | Blog | `sections/BlogLatest.tsx` | white card |
| 16 | Let's talk + booking | `sections/LetsTalk.tsx` (+ `BookingForm.tsx`) | default |
| 17 | Footer | `sections/Footer.tsx` | white card |

Order source: the CMS (`src/content/mainPages.json` → `home.sections`), with the same fallback order in `src/components/home/HomeView.tsx`. Re-verify this table whenever a section is added, moved or restyled.

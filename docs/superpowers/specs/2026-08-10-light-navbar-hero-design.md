# Light theme pass 1: Navbar, mega menu, mobile menu, hero

## Context

The v3 homepage currently uses a dark "aurora" theme (indigo/violet/amber on
near-black). The mega menu and dropdowns are hard to read (dark-on-dark), and
the hero leans into an "AI-first product studio" identity that doesn't match
the broader plan (five equal practices, "predictable delivery" as the
differentiator). A previously-built static mockup
(`~/Downloads/codeshaper-website-v2-main`) demonstrates a light, indigo-on-white
direction that matches the original Brand Guidelines PDF, plus a teal
secondary accent not in the original guidelines.

Decision: full pivot to the light direction, rolled out section by section.
**This spec covers round 1 only: Navbar (incl. mega menu, compact dropdowns,
mobile menu) + Hero.** Every other homepage section (Trust Strip, Service
Pillars index, AI Spotlight, Delivery System, Case Studies, Industries,
Engagement Models, Locations, Final CTA, Footer) stays dark aurora until a
later round targets it explicitly.

## Foundations

New tokens, values taken from the v2 reference (`css/custom.css`):

| Token | Value | Use |
|---|---|---|
| `--color-canvas` | `#FFFFFF` | page background |
| `--color-surface` | `#F7F8FB` | section/card backgrounds |
| `--color-surface-2` | `#F1F3F8` | secondary surface (e.g. dropdown hover) |
| `--color-ink` | `#0B0F19` | primary text/headings |
| `--color-body` | `#111827` | body copy |
| `--color-ink-dim` | `#6B7280` | secondary/muted text |
| `--color-hairline` | `#E5E7EB` | borders |
| `--color-hairline-strong` | `#D1D5DB` | stronger borders |
| `--color-indigo` | `#667EEA` | primary brand / CTA |
| `--color-indigo-dark` | `#44549B` | hover / deep accent |
| `--color-teal` | `#14B8A6` | secondary accent |
| `--color-teal-dark` | `#0D9488` | teal hover |

Type: `Satoshi` (body — self-host `.woff2` files sourced from Fontshare,
weights 400/500/600/700, same `next/font/local` pattern as the existing Geom
setup) + `Geom` (display/headings — already self-hosted, unchanged).

## Scoping mechanism

A `.theme-light` class wraps the `<Navbar>` root and the `<Hero>` `<section>`.
It redefines the *same* CSS custom property names the dark theme uses
(`--color-canvas`, `--color-ink`, `--color-ink-dim`, `--color-hairline`,
`--color-canvas-raised`, etc.) with the light values above, scoped under that
class. Because existing components consume colors through Tailwind utilities
that resolve to `var(--color-*)` (`bg-canvas`, `text-ink`, `border-hairline`,
...), most surfaces/text re-theme automatically through CSS inheritance —
no per-component className rewrites needed for those.

**Global dark tokens in `:root` are not changed.** Sections below the hero
stay dark aurora until their own round.

What does NOT auto-resolve (hardcoded `rgb()`/`rgba()` literals, not tokens)
and needs direct edits:
- `.mega-panel`, `.dropdown-panel` backgrounds (currently hardcoded
  `rgb(11, 11, 16)`)
- `.ai-col-wash` / active-pillar radial gradient (hardcoded indigo/violet/amber
  stops)
- `.glass` (used by the promo card and the prompt-pipeline panel)
- Everything in `HeroVideo.tsx`, `WordMorph.tsx`, `VideoType.tsx` (vignettes,
  particle colors, video source)
- Logo gradient stroke (`Navbar.tsx` inline SVG gradient stops)

## Navbar (`Navbar.tsx`)

- Bar is light (`--color-canvas` / `--color-surface`) from first paint —
  no more "transparent over hero, blurred dark after scroll" logic, since
  the hero underneath is light too. Bottom hairline instead of a shadow.
- Logo mark gradient: indigo → teal (was indigo → violet → amber).
- Nav link underline / active state: indigo instead of the current
  ink-on-dark treatment.
- "Book a Call" CTA: solid indigo background, white text, no glow-shadow
  (glow reads as a dark-theme device; brand guide spec is a flat filled
  pill — radius 12–16px, height 44–48px).
- Scrim behind the open mega panel: light-to-transparent instead of
  `rgba(0,0,0,0.55)` (a black scrim over a white page reads muddy — use a
  soft light-gray wash instead, still enough to separate the panel from the
  page).

## Mega menu (`MegaPanel.tsx`) + compact dropdowns (`Navbar.tsx`'s `DropdownItem`)

Structure is unchanged — this is a palette/contrast fix, not an IA rebuild:

- Left rail stays the numbered 01–05 click-through list; right side stays the
  detail pane (sub-service cards) + promo/case-study card.
- Panel backgrounds: white, with a very soft indigo-tinted radial wash
  (mirrors the current dark treatment's wash, just light) instead of solid
  near-black.
- Icon tiles, active-row accent bar, hover washes: indigo (teal reserved for
  secondary/decorative accents, e.g. the "New" badge on AI & Automation, so
  the two-accent system reads as intentional rather than random).
- Text: `--color-ink` / `--color-ink-dim` / `--color-body` per the new light
  tokens — this is the actual bug fix (current dark-on-dark-with-low-opacity
  labels are the readability complaint).
- Promo card: keep the `.glass` treatment but as a light frosted card
  (white translucent + blur) rather than the current dark frosted glass.

## Mobile menu (`MobileMenu.tsx`)

Same token-driven reskin as the desktop mega menu — full-screen takeover
background goes light, service list + Radix Accordion get the same
indigo/teal accent treatment. No structural change.

## Hero (`Hero.tsx` + children)

**Layout**: unchanged — centered composition, copy stacked above the
proof-stat bar, no photo montage (avoids depending on real Codeshaper photos
that don't exist yet; a photo montage was explicitly flagged against in the
Brand Guidelines: "avoid generic stock... team photos: candid, not stocky").

**Background** (`HeroVideo.tsx` → replaced): the aurora smoke video plus
stacked `rgba(10,10,15,*)` vignettes are a dark-theme-only technique — there's
no light equivalent of "a moody video darkened at the edges." Replace with a
new canvas-drawn animated gradient mesh: 2–3 soft indigo/teal blob gradients
drifting slowly (GSAP or rAF-driven position/scale), rendered at low
saturation/opacity directly on white — genuinely animated, not a static
image, but restrained per the brand guide ("minimal gradients, low
saturation"). Removes the external Higgsfield/Seedance CDN dependency
entirely.

**Particle word (`WordMorph.tsx`)**: same 11k-particle DESIGN→BUILD→
AUTOMATE→SHIP shader; particle color changes from light-on-dark to
indigo/ink-on-white. No structural change to the shader logic.

**Video-masked type (`VideoType.tsx`)**: currently paints the aurora video
inside the letterforms via canvas `destination-in` compositing. Re-point it
at the new gradient-mesh canvas asset from the background (same source used
in two places) instead of the aurora video — keeps the whole hero visually
coherent as one palette and drops the second CDN dependency.

**Copy**: drop "AI-first product studio" framing.
- Badge: reframe around the five practices (e.g. "Product design ·
  Engineering · AI automation"), not an AI-first identity claim.
- H1: in the spirit of "Build & scale digital products — predictably."
  (final wording TBD with 2–3 options presented during implementation).
- Subhead: reframe around weekly delivery/handover rather than "AI agents in
  the workflow."
- Prompt→pipeline demo (`PromptPipeline.tsx`) stays, recolored (light
  `.glass` panel, indigo/teal stage indicators) and re-captioned as one
  example of delivery, not the hero's whole identity.

**Everything else unchanged mechanically**: GSAP scroll-scrub camera
pull-back, word-mask headline line-reveal, one-word scramble effect,
magnetic CTAs, proof-stat bar, scroll cue. `prefers-reduced-motion` handling
carries over as-is (static poster/no-canvas fallback pattern already proven
in v3 applies the same way to the new mesh asset).

## Explicitly out of scope for this round

- Trust Strip, Service Pillars index, AI Spotlight, Delivery System, Case
  Studies, Industries, Engagement Models, Locations, Final CTA form, Footer —
  stay dark aurora. The page will have a light nav+hero followed by dark
  sections until their own rounds land.
- Placeholder content (stats, logos, case-study numbers, office cities, form
  endpoint) — unchanged, still flagged TODO from the earlier review.
- Satoshi font file sourcing is a real open item: needs manual download from
  Fontshare (no `@fontsource` package), to be resolved during implementation.

## Files touched

`src/app/globals.css` (new `.theme-light` scope + mesh/vignette rules),
`src/components/nav/Navbar.tsx`, `src/components/nav/MegaPanel.tsx`,
`src/components/nav/MobileMenu.tsx`, `src/components/hero/Hero.tsx`,
`src/components/hero/HeroVideo.tsx` (replaced by a new mesh component),
`src/components/hero/WordMorph.tsx`, `src/components/hero/VideoType.tsx`,
`src/components/hero/PromptPipeline.tsx`, `src/lib/navigation.ts` (icon/label
tweaks only if copy changes require it), new self-hosted Satoshi font files
under `src/fonts/`.

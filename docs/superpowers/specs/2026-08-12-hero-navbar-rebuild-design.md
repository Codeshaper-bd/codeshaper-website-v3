# Hero product-card scene + transparent navbar

## Context

The current hero (`src/components/hero/Hero.tsx`, wired in the mega-menu-rebuild
round before this one) is a centered headline + subhead + live prompt-pipeline
strip, with an ambient canvas-drawn gradient mesh (`HeroMesh.tsx`) and a
particle word-morph typography layer (`WordMorph.tsx` + `MeshType.tsx`) behind
it. It reads as premium and abstractly "AI/tech," but nothing in it is a
literal software artifact — no code, no product UI, no visible proof this is
a software studio.

`src/components/hero/` also carries five files from earlier hero iterations
that predate the current light theme and were never fully retired:
`HeroCanvas.tsx` (WebGL 26k-point particle hex mark), `HexAurora.tsx` (WebGL
aurora shader), `NeuralCanvas.tsx` (WebGL neural-network mesh),
`ScrambleHeadline.tsx` (a kinetic scramble-text component whose mechanic is
already duplicated inline in `Hero.tsx`'s `ScrambleWord`), and
`WorkspaceScene.tsx` — a complete, unused "three product surfaces float and
animate themselves" component (self-typing code editor, growing-bars metrics
card, AI-agent chat exchange) built for exactly the "reads unmistakably as a
software studio" goal this round is after, but never wired into `Hero.tsx`.

This round (1) revives and recolors `WorkspaceScene.tsx` into the hero as a
new floating layer around the existing centered copy, (2) makes the navbar
transparent over the hero's top and solid once scrolled, and (3) deletes the
four files that have no path back into the current design. Everything else
in the hero (headline choreography, gradient mesh, word-morph, prompt
pipeline, proof bar, scroll pull-back) is untouched.

## Navbar: transparent → sticky solid

`src/components/nav/Navbar.tsx`. The bar is already `position: fixed`
(effectively "sticky" already) and already tracks a `scrolled` boolean
(`scrollY > 80`) that currently only toggles a shadow. This round makes that
same boolean also toggle the background/blur/border, instead of them being
unconditional:

- **`scrolled === false`** (top of page): no `bg-canvas/95`, no
  `backdrop-blur-xl`, no `border-b border-hairline` — the bar is fully
  transparent, logo/links/buttons floating directly over the hero.
- **`scrolled === true`**: the exact current treatment (`bg-canvas/95
  backdrop-blur-xl border-b border-hairline` + the existing shadow), same
  80px threshold, transitioned rather than a hard cut (the shadow already
  transitions over 250ms — extend that transition to cover
  background-color/backdrop-filter/border-color too).
- Text/logo stay `text-ink` / `text-ink-dim` throughout — no color-flip
  logic, since the hero underneath is light end-to-end (white canvas +
  light gradient mesh), so dark ink text stays legible in the transparent
  state without a separate "light hero vs dark hero" branch.
- Mega panels, dropdowns, and `MobileMenu` are unaffected — they already
  render their own opaque surfaces independent of the bar's background.
- One thing to verify explicitly during implementation: at `scrolled ===
  false` the transparent bar sits directly over the hero's top ~80px, which
  is the gradient mesh + (once this round ships) the top edge of the code
  card if it's positioned high enough to reach there. Confirm the mesh/card
  edge doesn't reduce logo/link contrast at that exact strip — if it does,
  nudge the code card's top offset down rather than adding navbar-side
  contrast logic.

## Hero: the product-card scene

### What ships essentially as-is

`WorkspaceScene.tsx`'s `MetricCard` and `AgentCard` already use the current
`aurora-*` design tokens correctly (`bg-aurora-violet/22`, `text-aurora-amber`
on an icon glyph, `border-hairline`, `text-ink` / `text-ink-dim`) — these need
only a design pass (exact positions, sizes, rotation — see Placement below),
not a recolor.

The `.glass` surface these cards sit on is already theme-aware: `Hero.tsx`'s
`<section>` carries `.theme-light`, and `.theme-light .glass` in
`globals.css:85-91` already resolves to a white/85 translucent card — so
these components render as light glass automatically, with zero CSS changes
needed to the shared class.

### What needs recoloring

`CodeCard`'s syntax-highlight `TOKEN_COLOR` map and the traffic-light dots at
its header are hardcoded hex values tuned for a dark glass background that no
longer applies here:

| Token kind | Old (dark-glass) | New | Rationale |
|---|---|---|---|
| `kw` (keyword) | `#8B5FE0` | `text-aurora-violet` (`#44549B`, 7.03:1) | text-safe per this codebase's binding contrast rule |
| `fn` (function/identifier) | `#F5F4F2` (near-white — invisible on light glass) | `text-ink` | primary text color on the light surface |
| `op` (punctuation) | `#5B5B66` | `text-ink-faint` | matches how punctuation/secondary marks are toned elsewhere |
| `prop` (property name) | `#5B5FEF` | `text-aurora-violet` | code text renders at 12.5px, well under the large-text threshold, so the base `aurora-indigo` token (3:1-class only) isn't eligible here — text-safe rule |
| `str` (string literal) | `#F2A65A` | `text-aurora-amber-dark` (`#0F766E`, 5.47:1) | text-safe rule — same substitution already used for every other teal/amber text usage on this site |
| header traffic-light dots (decorative, not text) | `#F2A65A`/`#5B5FEF`/`white/15` | keep as decorative fills but add a `border border-hairline` (they're inert dots on a now-light card, not exempt from *needing to be visible*, just exempt from the text contrast ratio itself) | dots need to read against white/85 glass, not just be technically "decorative" |

`MetricCard`'s bar-gradient inline styles (`linear-gradient(180deg,#F2A65A,
#8B5FE0)` / `linear-gradient(180deg,#5B5FEF,#3a3a72)`) get the same
treatment: remapped to `aurora-amber-dark`/`aurora-violet` and
`aurora-indigo`/`aurora-violet-dark` gradient stops. These are decorative
fills (bar chart, not text), so the base 3:1-class tokens are fine to use
directly for the non-highlighted bars; only the copy `Activation` label and
`+18%` figure need to stay on `text-ink-faint` / `text-ink` as they already
are.

### Placement — floating around the periphery, desktop only

The three cards float around the centered copy column (`max-w-4xl`, 896px),
not behind or on top of it:

- **Code card** (`agent.ts`, 380px wide) — upper-left.
- **Metrics card** (`Activation`, 232px wide) — upper-right.
- **Agent card** (chat exchange, 300px wide) — lower-right.
- The two satellite chips (`CI passing`, `release/2.4`) stay as originally
  designed — small pills filling remaining negative space.

Positioned absolutely within the `<section>` (not a boxed sub-container like
the original 720×460 `WorkspaceScene` host — this hero has no such box), each
with a slight rotation (`-2deg` to `+3deg`, as in the original) so they read
as loosely scattered rather than grid-aligned. Given card widths (up to
380px) versus available margin outside the 896px copy column, cards are
allowed to tuck slightly under the copy block's outer padding at common
laptop widths (1280–1440px) — the copy column's own background is
transparent outside the actual text/button shapes, so this only becomes a
legibility problem if a card's edge lands directly behind the headline text,
badge pill, or CTA buttons themselves, which the exact offsets must avoid.
Z-index: cards render above the ambient mesh/scrim layer but below the copy
(`z-10`), so nothing floats over the headline.

**Desktop-only.** All three cards (plus the two chips) are `hidden
lg:block`, matching this codebase's existing convention for the same
tradeoff (nav mega menus and quick-access chips are already fully
`lg`-gated). At sub-1024px widths the hero's centered content stack (badge,
word-morph strip, headline, subhead, prompt pipeline, CTAs, proof bar) 
already fills the viewport; three more 232–380px cards would collide with
it rather than float in open space. This is a deliberate deviation from
the original `WorkspaceScene.tsx`, which showed the code and agent cards
un-gated — those two are now gated as well.

Because the last round's final review specifically caught a breakpoint band
(1024–1280px) that individual-task verification skipped, implementation must
explicitly screenshot-verify at 1024, 1280, 1440, and 1920px — not just the
two ends — confirming no card clips the viewport edge, overlaps the CTA
buttons/headline, or gets so cramped between 1024–1280 that it looks broken
rather than intentionally tight.

### Parallax

The original file tagged each layer with a `data-depth` attribute (`0.2` to
`1`) for per-layer mouse parallax, but the code that read those attributes
lived in `HeroCanvas.tsx` (dead, being deleted). `Hero.tsx` already has an
equivalent mechanism for its single abstract mark (`markRef`): a
`requestAnimationFrame` loop that eases toward the pointer position and
writes `--tx`/`--ty` CSS custom properties, gated by `useMotionAllowed()`
(desktop/fine-pointer only, already respects reduced motion).

Generalize that one mechanism to loop over every `.scene-layer` element
under the hero and scale its displacement by its own `data-depth` (already
present in the source), instead of writing one new bespoke parallax system.
`.scene-layer`'s existing `will-change: transform, opacity` and its
`prefers-reduced-motion` override (`globals.css:524-534`, forces `transform:
none !important`) already cover the new layers with no CSS changes.

### Entrance choreography

Cards fade + rise in staggered, joining the existing `restIn` sequence
(`Hero.tsx`'s `seq()` helper) rather than popping in — after the prompt
pipeline settles, each card animates in ~100ms apart (code card first, since
it's the most literal "software" signal, then metrics, then agent). Uses the
same `seq()` opacity+translateY+blur-free pattern already used for every
other hero element, for visual consistency, not a new animation primitive.

### Reduced motion

Already handled at the source level: `WorkspaceScene.tsx`'s internal
`usePrefersReducedMotion()` check renders every card in its final,
fully-typed/fully-grown/fully-answered state with no loops when reduced
motion is on. Combined with `.scene-layer`'s existing reduced-motion CSS
override (transform locked to `none`) and gating the new parallax loop
through the same `useMotionAllowed()` hook the existing mark parallax uses,
no new reduced-motion code paths are needed — only verification that they
compose correctly once wired together.

## Cleanup

Delete four unused files, none imported anywhere in `src/`:
`src/components/hero/HeroCanvas.tsx`, `HexAurora.tsx`, `NeuralCanvas.tsx`,
`ScrambleHeadline.tsx`. `WorkspaceScene.tsx` is no longer dead code after
this round (moves from "unused" to "imported by `Hero.tsx`").

## Out of scope

- The headline copy, subhead copy, prompt-pipeline prompts/stages, proof-bar
  numbers, and CTA links are all unchanged.
- No new dependencies — everything here uses the stack already in
  `package.json` (React, GSAP for existing scroll-trigger work, plain
  CSS/Tailwind, `requestAnimationFrame`).
- Mobile hero layout is otherwise unchanged (product cards are the only
  new/removed thing at that breakpoint, and they were never there before).
- `MobileMenu.tsx` and every non-hero, non-navbar section are untouched.

## Verification approach

This codebase has no automated test suite for UI components (confirmed
during the mega-menu round); verification is build (`npm run build`, type
+ compile check) plus manual Playwright walkthroughs, consistent with how
every prior round of this work has been verified:

- Desktop (1024, 1280, 1440, 1920px): all three cards + two chips visible,
  correctly positioned, no overlap with headline/CTAs, parallax responds to
  pointer movement, entrance stagger plays once on load.
- Mobile (390, 768px): no product cards rendered; hero layout matches
  today's shipped mobile hero exactly (regression check).
- Reduced-motion emulation: cards render in final state, no parallax, no
  entrance animation, navbar transparency/solid transition still works
  (that's a state change, not motion, so it's unaffected either way).
- Navbar: scroll from 0 confirms transparent → solid transition at the 80px
  threshold, at both a hero-card breakpoint (≥1024) and a no-cards
  breakpoint (<1024).
- Console errors: 0, checked per-step (non-cumulative), matching the
  established convention from the last round's final review.

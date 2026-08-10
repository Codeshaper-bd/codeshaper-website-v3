# Light Navbar + Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Relight the navbar (mega menu, compact dropdowns, mobile menu) and hero section from the current dark "aurora" theme to a light indigo/teal theme, without affecting any other homepage section.

**Architecture:** A `.theme-light` CSS class, applied to the `<header>` root in `Navbar.tsx` and the `<section>` root in `Hero.tsx`, locally overrides the same custom-property names the dark theme already defines (`--color-canvas`, `--color-ink`, `--color-aurora-indigo`, etc.). Because nearly every component already consumes colors through Tailwind utilities that resolve to `var(--color-*)`, this re-themes most surfaces for free via CSS inheritance. Classes/rules confirmed (by grep) to be exclusive to the nav/hero components (`.mega-panel`, `.dropdown-panel`, `.icon-tile`, `.menu-row`, `.ai-col-wash`, `.nav-scrim`) are edited in place with no scoping needed. The hero's dark aurora video background is replaced by a new shared canvas-drawn gradient-mesh module, used both for the full-bleed background and for the video-masked type effect, dropping the external CDN dependency.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind v4 (`@theme` custom properties), Radix UI `NavigationMenu`/`Accordion`, GSAP, WebGL (raw, no library) for the particle word.

## Global Constraints

- Do not change any `:root`-level token value — those are shared with sections outside this round's scope (Trust Strip, Service Pillars index, AI Spotlight, Delivery System, Case Studies, Industries, Engagement Models, Locations, Final CTA, Footer all stay dark aurora).
- Every animated component must keep working `prefers-reduced-motion` handling (static/no-loop fallback) — this is an existing site-wide invariant, not new work, but new code (the mesh canvas) must follow the same pattern as the code it replaces.
- No new npm dependencies — the mesh is a plain Canvas 2D module using existing patterns (`usePrefersReducedMotion` from `@/lib/motion`).
- Self-host Satoshi the same way Geom is currently self-hosted (`next/font/local`, `.woff2` files under `src/fonts/`, a `variable` CSS custom property wired into `layout.tsx`) — no font CDN links.
- This plan has no unit/integration test suite to run (none exists in this repo — confirmed via `package.json`, no test runner installed). "Verify" steps mean: run `npm run dev`, drive the page with the Playwright MCP browser tools (`browser_navigate`, `browser_take_screenshot`, `browser_console_messages`, `browser_evaluate` for scroll/resize/reduced-motion emulation), and visually confirm the described state. Screenshot files go in the project root and must be deleted after each check (do not commit them).

---

## Task 1: Light theme tokens, Satoshi font, shared-class overrides

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/fonts/satoshi-latin-400-normal.woff2`, `src/fonts/satoshi-latin-500-normal.woff2`, `src/fonts/satoshi-latin-700-normal.woff2` (downloaded, not generated — see Step 1)

**Interfaces:**
- Produces: a `.theme-light` class usable on any element, which locally redefines `--color-canvas`, `--color-canvas-raised`, `--color-panel`, `--color-ink`, `--color-ink-dim`, `--color-ink-faint`, `--color-hairline`, `--color-hairline-strong`, `--color-menu-label`, `--color-aurora-indigo`, `--color-aurora-violet`, `--color-aurora-amber` for its entire subtree. Produces a `.theme-light .glass` override (the one shared, non-nav-exclusive class this round touches). Produces a `--font-satoshi` CSS variable and Tailwind `font-satoshi` utility, alongside the existing `--font-display`/`font-display` (Geom, unchanged).

- [ ] **Step 1: Download Satoshi font files**

Fontshare doesn't ship an `@fontsource` npm package (confirmed: only Geom/Manrope/Space-Grotesk-Variable are installed as `@fontsource*` packages in `package.json`). Download the static `.woff2` files directly:

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
curl -sL "https://api.fontshare.com/v2/fonts/download/satoshi" -o /tmp/satoshi.zip
unzip -o /tmp/satoshi.zip -d /tmp/satoshi
find /tmp/satoshi -iname "*.woff2" | grep -iE "Regular|Medium|Bold" | grep -v Italic
```

Copy the three matched files (Regular=400, Medium=500, Bold=700) into `src/fonts/`, renamed:

```bash
cp "$(find /tmp/satoshi -iname '*Regular.woff2' | grep -v Italic | head -1)" src/fonts/satoshi-latin-400-normal.woff2
cp "$(find /tmp/satoshi -iname '*Medium.woff2' | grep -v Italic | head -1)" src/fonts/satoshi-latin-500-normal.woff2
cp "$(find /tmp/satoshi -iname '*Bold.woff2' | grep -v Italic | head -1)" src/fonts/satoshi-latin-700-normal.woff2
ls -la src/fonts/satoshi-latin-*.woff2
```

If the Fontshare API endpoint is unreachable from this environment (no network access), stop and tell the user: they need to manually download from `https://www.fontshare.com/fonts/satoshi` (Regular/Medium/Bold, WOFF2) and place the three files at the paths above before continuing.

- [ ] **Step 2: Wire Satoshi into `layout.tsx`**

In `src/app/layout.tsx`, add a third `localFont` call alongside the existing `geom`/`manrope` ones:

```tsx
const satoshi = localFont({
  src: [
    { path: "../fonts/satoshi-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/satoshi-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/satoshi-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-satoshi",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});
```

Add `satoshi.variable` to the `className` on `<html>`:

```tsx
<html lang="en" className={`${geom.variable} ${manrope.variable} ${satoshi.variable}`}>
```

- [ ] **Step 3: Add the `--font-satoshi` Tailwind token**

In `src/app/globals.css`, inside the existing `@theme { ... }` block, add next to `--font-body`:

```css
--font-satoshi: var(--font-satoshi), ui-sans-serif, system-ui, sans-serif;
```

(This generates a `font-satoshi` utility class alongside the existing `font-display`/`font-body`.)

- [ ] **Step 4: Add the `.theme-light` token scope**

In `src/app/globals.css`, add this block after the `@theme { ... }` block closes (i.e. as a normal CSS rule, not inside `@theme`):

```css
/* ── Light theme scope (Navbar + Hero, pass 1) ──────────────
   Redefines the SAME custom-property names the dark theme uses, so every
   existing `bg-canvas` / `text-ink` / `text-aurora-indigo` utility already
   in Navbar/MegaPanel/MobileMenu/Hero resolves to light values here without
   per-component className changes. Do NOT move these values to :root — they
   are only correct for this subtree; every other section still needs the
   dark originals.

   Within this scope, --color-aurora-violet is repurposed to hold the "deep
   indigo" hover/secondary shade and --color-aurora-amber is repurposed to
   hold the teal secondary accent (both from the v2 brand reference) rather
   than their dark-theme meanings. The class names stay "aurora-*" to avoid
   a site-wide token rename in this pass; a later cleanup could rename them
   to brand-neutral names once every section has migrated. */
.theme-light {
  --color-canvas: #ffffff;
  --color-canvas-raised: #f7f8fb;
  --color-panel: #ffffff;
  --color-ink: #0b0f19;
  --color-ink-dim: #6b7280;
  --color-ink-faint: #9ca3af;
  --color-hairline: #e5e7eb;
  --color-hairline-strong: #d1d5db;
  --color-menu-label: #6b7280;

  --color-aurora-indigo: #667eea; /* primary brand */
  --color-aurora-violet: #44549b; /* repurposed: deep indigo (hover/secondary) */
  --color-aurora-amber: #14b8a6;  /* repurposed: teal (secondary accent) */
}

/* .glass is shared with Locations.tsx / AiSpotlight.tsx / WorkspaceScene.tsx,
   which stay dark this round — override rather than edit the base rule. */
.theme-light .glass {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(11, 15, 25, 0.08);
  box-shadow:
    0 0 0 1px rgba(102, 126, 234, 0.08),
    0 8px 32px rgba(11, 15, 25, 0.1);
}
```

- [ ] **Step 5: Verify — build succeeds, fonts load, no visual regression yet**

Nothing consumes `.theme-light` yet, so no page output changes. Verify the build itself is clean:

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
npm run build 2>&1 | tail -40
```

Expected: build succeeds (Next.js font loader resolves the three new `.woff2` files with no missing-file error). If it fails on a font path, re-check Step 1's file names match Step 2's `src` paths exactly.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/fonts/satoshi-latin-*.woff2
git commit -m "Add light theme token scope + self-hosted Satoshi font

Introduces .theme-light, a locally-scoped override of the existing
dark-theme custom properties (canvas/ink/hairline/aurora-*), plus a
self-hosted Satoshi font for body text. Nothing consumes .theme-light
yet — this is pure infrastructure for the navbar/hero relight."
```

---

## Task 2: Navbar shell + compact dropdowns relight

**Files:**
- Modify: `src/components/nav/Navbar.tsx`

**Interfaces:**
- Consumes: `.theme-light` scope from Task 1 (Step 4).
- Produces: no new exports — `Navbar.tsx`'s public shape (`export default function Navbar()`) is unchanged.

- [ ] **Step 1: Apply `.theme-light` to the header root and switch body font**

In `src/components/nav/Navbar.tsx`, find:

```tsx
<header className="fixed inset-x-0 top-0 z-50">
```

Replace with:

```tsx
<header className="theme-light fixed inset-x-0 top-0 z-50 font-satoshi">
```

- [ ] **Step 2: Relight the bar background/border (replace the scroll-triggered dark-blur logic)**

Find:

```tsx
<div
  className={`transition-[background-color,border-color,backdrop-filter] duration-[250ms] ${
    scrolled || openValue || mobileOpen
      ? "border-b border-hairline bg-[rgba(10,10,15,0.85)] backdrop-blur-xl"
      : "border-b border-transparent bg-transparent"
  }`}
>
```

Replace with (light bar is legible over the light hero from first paint, so we don't need the "transparent until scrolled" trick — just add blur once something's open so the mega/mobile panel has separation, and keep a subtle border always):

```tsx
<div
  className={`border-b border-hairline bg-canvas/95 backdrop-blur-xl transition-shadow duration-[250ms] ${
    scrolled || openValue || mobileOpen ? "shadow-[0_1px_0_rgba(11,15,25,0.04)]" : ""
  }`}
>
```

- [ ] **Step 3: Recolor the logo gradient**

Find the inline SVG `linearGradient`:

```tsx
<linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stopColor="#5B5FEF" />
  <stop offset="60%" stopColor="#8B5FE0" />
  <stop offset="100%" stopColor="#F2A65A" />
</linearGradient>
```

Replace with:

```tsx
<linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stopColor="#667EEA" />
  <stop offset="100%" stopColor="#14B8A6" />
</linearGradient>
```

- [ ] **Step 4: Recolor the "Book a Call" CTA (drop the glow-shadow treatment)**

Find:

```tsx
<Link
  href="/contact"
  className="hidden rounded-full border border-aurora-indigo/70 bg-aurora-indigo/5 px-5 py-2 font-display text-sm font-medium text-ink shadow-[0_0_18px_rgba(91,95,239,0.32)] transition-[background-color,box-shadow,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-indigo hover:shadow-[0_0_34px_rgba(91,95,239,0.6)] sm:inline-block"
>
  Book a Call
</Link>
```

Replace with (solid fill per brand guide's actual button spec — no glow, that's a dark-theme device):

```tsx
<Link
  href="/contact"
  className="hidden rounded-full bg-aurora-indigo px-5 py-2 font-display text-sm font-medium text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet sm:inline-block"
>
  Book a Call
</Link>
```

- [ ] **Step 5: Recolor the scrim (mega panel backdrop)**

In `src/app/globals.css`, find:

```css
.nav-scrim {
  background: rgba(0, 0, 0, 0.55);
  will-change: opacity;
  transition: opacity 150ms ease;
}
```

This class is exclusive to `Navbar.tsx` (confirmed by grep) — edit in place, no scoping needed:

```css
.nav-scrim {
  background: rgba(11, 15, 25, 0.12);
  will-change: opacity;
  transition: opacity 150ms ease;
}
```

- [ ] **Step 6: Recolor the mobile hamburger icon bars**

Find:

```tsx
<span
  className={`h-0.5 w-5 bg-ink transition-transform duration-300 ${mobileOpen ? "translate-y-1 rotate-45" : ""}`}
/>
<span
  className={`h-0.5 w-5 bg-ink transition-transform duration-300 ${mobileOpen ? "-translate-y-1 -rotate-45" : ""}`}
/>
```

No change needed — `bg-ink` already resolves through the `.theme-light` scope from Task 1. Confirm this visually in Step 8.

- [ ] **Step 7: Recolor the compact dropdown panels (`DropdownItem`)**

Find:

```tsx
<Nav.Content className="dropdown-panel absolute left-1/2 top-full z-40 mt-3 w-[300px] -translate-x-1/2 rounded-xl border border-hairline bg-[rgb(11,11,16)] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
```

Replace with:

```tsx
<Nav.Content className="dropdown-panel absolute left-1/2 top-full z-40 mt-3 w-[300px] -translate-x-1/2 rounded-xl border border-hairline bg-white p-2 shadow-[0_20px_48px_rgba(11,15,25,0.14)]">
```

In `src/app/globals.css`, find (this rule and the two below it are `.dropdown-panel`-exclusive to Navbar, confirmed by grep — edit in place):

```css
.dropdown-panel {
  background:
    radial-gradient(120% 140% at 20% 0%, rgba(91, 95, 239, 0.12), transparent 60%),
    rgb(11, 11, 16) !important;
}
.dropdown-panel::before {
  content: "";
  position: absolute;
  inset-inline: 12px;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(91, 95, 239, 0.6), transparent);
}
```

Replace with:

```css
.dropdown-panel {
  background:
    radial-gradient(120% 140% at 20% 0%, rgba(102, 126, 234, 0.06), transparent 60%),
    #ffffff !important;
}
.dropdown-panel::before {
  content: "";
  position: absolute;
  inset-inline: 12px;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.4), transparent);
}
```

- [ ] **Step 8: Verify — navbar and dropdowns are light and readable**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
(npm run dev > /tmp/codeshaper-dev.log 2>&1 &)
sleep 2 && grep -m1 "Local:" /tmp/codeshaper-dev.log
```

Using the Playwright MCP tools (`browser_navigate` to the printed local URL, `browser_resize` to 1440x900, `browser_take_screenshot`):
1. Screenshot the top of the page — confirm the bar is white/light with a visible hairline, logo gradient reads indigo→teal, "Book a Call" is a solid indigo pill with white text.
2. Click the "Industries" trigger (`browser_click`), screenshot — confirm the compact dropdown panel is white with readable dark text and indigo icon tiles (icon tiles read through `.icon-tile` + `bg-canvas-raised`/`text-aurora-indigo`, unedited but now resolving light via Task 1's scope — if they still render dark, the `.theme-light` class isn't cascading to the dropdown, which likely means Radix is portaling `Nav.Content` outside the `<header>` DOM subtree; if so, stop and report this — it changes Task 1's approach and needs a decision, don't silently work around it).
3. Check console: `browser_console_messages` with `level: "error"` — expect 0 errors.
4. Delete any screenshot files created (`rm -f *.png` in the project root) and stop the dev server: `lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill`.

- [ ] **Step 9: Commit**

```bash
git add src/components/nav/Navbar.tsx src/app/globals.css
git commit -m "Relight navbar shell and compact dropdowns

Bar, logo, CTA, scrim, and the Industries/How We Work/Insights/Company
dropdown panels move from dark aurora to the light indigo/teal theme.
Mega menu (Services) and mobile menu are handled in the next commits."
```

---

## Task 3: Mega menu (`MegaPanel.tsx`) relight

**Files:**
- Modify: `src/components/nav/MegaPanel.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `.theme-light` scope (cascades from `<header>` in Navbar.tsx, confirmed working in Task 2 Step 8).
- Produces: no export shape change.

- [ ] **Step 1: Relight the mega panel background + top hairline**

In `src/app/globals.css`, find (`.mega-panel` and its `::before` are exclusive to Navbar.tsx, confirmed by grep — edit in place):

```css
.mega-panel {
  background:
    radial-gradient(120% 140% at 12% 0%, rgba(91, 95, 239, 0.10), transparent 55%),
    radial-gradient(90% 120% at 88% 10%, rgba(242, 166, 90, 0.06), transparent 60%),
    rgb(11, 11, 16);
  border-bottom: 1px solid var(--color-hairline);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.55);
  will-change: transform, opacity;
}
```

Replace with:

```css
.mega-panel {
  background:
    radial-gradient(120% 140% at 12% 0%, rgba(102, 126, 234, 0.05), transparent 55%),
    radial-gradient(90% 120% at 88% 10%, rgba(20, 184, 166, 0.04), transparent 60%),
    #ffffff;
  border-bottom: 1px solid var(--color-hairline);
  box-shadow: 0 24px 64px rgba(11, 15, 25, 0.1);
  will-change: transform, opacity;
}
```

Find:

```css
.mega-panel::before {
  content: "";
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(91, 95, 239, 0.5) 25%,
    rgba(139, 95, 224, 0.5) 55%,
    rgba(242, 166, 90, 0.35) 80%,
    transparent
  );
}
```

Replace with:

```css
.mega-panel::before {
  content: "";
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(102, 126, 234, 0.55) 35%,
    rgba(20, 184, 166, 0.45) 70%,
    transparent
  );
}
```

- [ ] **Step 2: Relight the active-pillar accent wash**

Find (`.ai-col-wash` is exclusive to `MegaPanel.tsx`, confirmed by grep — edit in place):

```css
.ai-col-wash {
  transition: opacity 300ms ease;
}
.menu-col:hover .ai-col-wash {
  opacity: 0.12 !important;
}
```

No color to change here — the color comes from the inline `style` in `MegaPanel.tsx`. Find, in `src/components/nav/MegaPanel.tsx`:

```tsx
{col.flagship && (
  <span
    aria-hidden
    className="ai-col-wash pointer-events-none absolute inset-0 rounded-lg opacity-[0.10]"
    style={{
      background:
        "radial-gradient(120% 100% at 0% 50%, #5B5FEF 0%, #8B5FE0 55%, #F2A65A 100%)",
    }}
  />
)}
```

Replace the `style` value with:

```tsx
    style={{
      background:
        "radial-gradient(120% 100% at 0% 50%, #667EEA 0%, #44549B 60%, #14B8A6 100%)",
    }}
```

- [ ] **Step 3: Verify the promo card, icon tiles, and text contrast need no further edits**

`MegaPanel.tsx`'s icon tiles (`icon-tile` + `bg-canvas-raised text-aurora-indigo`), row text (`text-ink`, `text-ink-dim`, `text-ink-faint`), the "New" badge (`text-aurora-amber` → now teal via Task 1's repurposed token), and the promo card (`.glass` → now light via Task 1 Step 4's override) all resolve through tokens already fixed in Task 1 — no direct edits needed. Do not add any; if something still looks wrong here, the bug is in the token scope from Task 1, not in this file.

- [ ] **Step 4: Verify — mega menu is light and readable, click-through still works**

Dev server up (same commands as Task 2 Step 8). Using Playwright MCP tools:
1. Click "Services" trigger, screenshot. Confirm: white panel, readable dark practice titles, indigo icon tiles, a visible teal "New" badge on "05 AI & Automation," the active-row accent bar is indigo.
2. Click "02 Product Engineering" in the left rail (or use its `ref` from a `browser_snapshot`), screenshot — confirm the detail pane swaps to Product Engineering's sub-services and the layout doesn't jump.
3. `browser_console_messages` level `error` — expect 0.
4. Clean up screenshots, stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/nav/MegaPanel.tsx src/app/globals.css
git commit -m "Relight Services mega menu

Panel background, top hairline, and the AI & Automation active-pillar
wash move to indigo/teal. Icon tiles, text, badge, and promo card
inherit their light colors from the theme-light token scope."
```

---

## Task 4: Mobile menu (`MobileMenu.tsx`) relight

**Files:**
- Modify: `src/components/nav/MobileMenu.tsx`

**Interfaces:**
- Consumes: `.theme-light` scope (inherited — `<MobileMenu>` renders as a child of `<header className="theme-light ...">` in Navbar.tsx).

- [ ] **Step 1: Fix the one hardcoded-dark spot — the promo card cover gradient**

Find:

```tsx
<div
  className="aspect-[16/9] w-full"
  aria-hidden
  style={{ background: "linear-gradient(135deg, #232350 0%, #4a3a8e 45%, #96604a 100%)" }}
/>
```

Replace with:

```tsx
<div
  className="aspect-[16/9] w-full"
  aria-hidden
  style={{ background: "linear-gradient(135deg, #667EEA 0%, #44549B 55%, #14B8A6 100%)" }}
/>
```

- [ ] **Step 2: Fix the "Book a Call" CTA (same glow-removal as Task 2 Step 4)**

Find:

```tsx
<Link
  href="/contact"
  onClick={onClose}
  className="inline-block rounded-full border border-aurora-indigo/70 bg-aurora-indigo/5 px-6 py-3 font-display text-sm font-medium text-ink shadow-[0_0_18px_rgba(91,95,239,0.32)]"
>
  Book a Call
</Link>
```

Replace with:

```tsx
<Link
  href="/contact"
  onClick={onClose}
  className="inline-block rounded-full bg-aurora-indigo px-6 py-3 font-display text-sm font-medium text-white"
>
  Book a Call
</Link>
```

- [ ] **Step 3: Confirm everything else is token-driven**

`bg-canvas` (full-screen backdrop), `border-hairline`, `text-ink`/`text-ink-dim`, `text-light-dim` (line 44 — this is a *different*, pre-existing light token unrelated to this pass; leave it, it already reads as a muted gray and isn't broken), `bg-canvas-raised text-aurora-indigo` (icon chips), `.glass` (promo card, now light via Task 1), `text-aurora-amber` (now teal) — all resolve automatically. No further edits.

- [ ] **Step 4: Verify — mobile menu is light and readable**

Dev server up. Using Playwright MCP tools: `browser_resize` to 390x844, open the hamburger menu (`browser_click` on the menu button), screenshot. Confirm: white full-screen background, readable service list with indigo icon chips, teal "New" badge, indigo promo-card gradient, solid indigo "Book a Call" pill. Expand one accordion item (click a service row), screenshot, confirm sub-links are readable. `browser_console_messages` level `error` — expect 0. Clean up, stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/nav/MobileMenu.tsx
git commit -m "Relight mobile menu

Promo card gradient and Book a Call CTA move to the light theme; every
other surface already inherited light colors from the theme-light scope
applied to the shared <header> root in Task 2."
```

---

## Task 5: Shared gradient-mesh module + `HeroMesh.tsx` + `MeshType.tsx`

**Files:**
- Create: `src/components/hero/gradientMesh.ts`
- Create: `src/components/hero/HeroMesh.tsx` (replaces `HeroVideo.tsx`)
- Create: `src/components/hero/MeshType.tsx` (replaces `VideoType.tsx`)
- Delete: `src/components/hero/HeroVideo.tsx`, `src/components/hero/VideoType.tsx`

**Interfaces:**
- Produces: `drawGradientMesh(ctx: CanvasRenderingContext2D, width: number, height: number, elapsedMs: number): void` — pure function, paints a white base + 3 drifting soft radial-gradient blobs (indigo/teal/deep-indigo) onto the given 2D context. Both new components call this identically so the background and the type-fill stay one visual system.
- Produces: `export default function HeroMesh(): JSX.Element` — a `<canvas>` absolutely positioned to fill its parent, no props.
- Produces: `export default function MeshType({ className }: { className?: string }): JSX.Element` — a `<canvas>`, same prop shape as the `VideoType` it replaces.
- Note: `Hero.tsx` still imports `HeroVideo` and `VideoType` at this point — **do not edit `Hero.tsx` in this task**, that's Task 7. This task is verified standalone (Step 5) via a temporary throwaway usage, not through `Hero.tsx`.

- [ ] **Step 1: Write the shared mesh-drawing module**

Create `src/components/hero/gradientMesh.ts`:

```ts
export type MeshBlob = {
  /** base position as a fraction of width/height, 0–1 */
  x: number;
  y: number;
  /** radius as a fraction of max(width, height) */
  r: number;
  color: string;
  /** drift speed, radians per ms */
  speed: number;
  /** phase offset, radians */
  phase: number;
  /** drift amplitude as a fraction of width/height */
  amp: number;
};

export const MESH_BLOBS: MeshBlob[] = [
  { x: 0.26, y: 0.3, r: 0.58, color: "rgba(102,126,234,0.55)", speed: 0.00009, phase: 0, amp: 0.09 },
  { x: 0.74, y: 0.42, r: 0.5, color: "rgba(20,184,166,0.4)", speed: 0.00007, phase: 2.1, amp: 0.11 },
  { x: 0.48, y: 0.7, r: 0.64, color: "rgba(68,84,155,0.32)", speed: 0.00006, phase: 4.4, amp: 0.08 },
];

/**
 * Paints a soft, slowly-drifting multi-blob radial-gradient mesh onto `ctx`
 * — a white base with indigo/teal/deep-indigo blobs. Pure function: same
 * (width, height, elapsedMs) always produces the same frame. Used
 * identically by the full-bleed hero background (HeroMesh) and the
 * video-masked type (MeshType) so both read as one visual system.
 */
export function drawGradientMesh(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  elapsedMs: number
): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const size = Math.max(width, height);
  for (const b of MESH_BLOBS) {
    const dx = Math.sin(elapsedMs * b.speed + b.phase) * b.amp * width;
    const dy = Math.cos(elapsedMs * b.speed * 0.8 + b.phase) * b.amp * height;
    const cx = b.x * width + dx;
    const cy = b.y * height + dy;
    const r = b.r * size;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, b.color);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }
}
```

- [ ] **Step 2: Write `HeroMesh.tsx`**

Create `src/components/hero/HeroMesh.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { drawGradientMesh } from "./gradientMesh";

/**
 * Full-bleed animated gradient-mesh background for the light hero.
 *
 * Replaces the dark aurora video (HeroVideo): same "always-on ambient
 * motion" role, but a canvas-drawn indigo/teal mesh instead of a video
 * loop — reads correctly on a white background and drops the external
 * CDN dependency entirely.
 *
 * Reduced motion: a single static frame is drawn once, no rAF loop.
 */
export default function HeroMesh() {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const t0 = performance.now();
    const draw = () => {
      resize();
      drawGradientMesh(ctx, canvas.width, canvas.height, performance.now() - t0);
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    if (reduced) {
      drawGradientMesh(ctx, canvas.width, canvas.height, 0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}
```

- [ ] **Step 3: Write `MeshType.tsx`**

Create `src/components/hero/MeshType.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { drawGradientMesh } from "./gradientMesh";

/**
 * Mesh-masked kinetic type — the light hero's signature.
 *
 * The gradient mesh plays *inside* the letterforms via canvas
 * `destination-in` compositing (glyphs become windows onto the drifting
 * mesh), while the word cycles through what the studio does. Replaces
 * VideoType, which did the same trick with the dark aurora video — same
 * mask mechanics, mesh instead of video, so no external asset is needed.
 *
 * Interaction: the pointer parallaxes the mesh within the type; scrolling
 * scales the word up so you fall through it into the page.
 */
const WORDS = ["DESIGN", "BUILD", "AUTOMATE", "SHIP", "CODESHAPER"];
const HOLD = 2100;
const FADE = 900;

export default function MeshType({ className = "" }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let mx = 0, my = 0, cmx = 0, cmy = 0;
    let sc = 0, csc = 0;

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    };
    const onScroll = () => {
      sc = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    /** Fit `text` to the canvas width and stamp it as the mask. */
    const stampText = (text: string, alpha: number, scale: number) => {
      const W = canvas.width;
      const H = canvas.height;
      let size = H * 0.72;
      const set = (s: number) => {
        const family = getComputedStyle(document.body).getPropertyValue("--font-geom") || "sans-serif";
        ctx.font = `700 ${s}px ${family}`;
      };
      set(size);
      const maxW = W * 0.92;
      while (ctx.measureText(text).width > maxW && size > 10) {
        size *= 0.94;
        set(size);
      }
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.translate(W / 2, H / 2);
      ctx.scale(scale, scale);
      ctx.fillStyle = "#000";
      ctx.fillText(text, 0, 0);
      ctx.restore();
    };

    const t0 = performance.now();
    const draw = () => {
      resize();
      const W = canvas.width;
      const H = canvas.height;
      const elapsed = performance.now() - t0;

      cmx += (mx - cmx) * 0.06;
      cmy += (my - cmy) * 0.06;
      csc += (sc - csc) * 0.1;

      // 1. paint the drifting mesh, offset by pointer for parallax
      drawGradientMesh(ctx, W, H, elapsed + cmx * 4000 + cmy * 3000);

      // 2. cut it to the shape of the word
      ctx.globalCompositeOperation = "destination-in";
      const cycle = HOLD + FADE;
      const idx = reduced ? WORDS.length - 1 : Math.floor(elapsed / cycle) % WORDS.length;
      const next = (idx + 1) % WORDS.length;
      const phase = (elapsed % cycle) / cycle;
      const fading = phase > HOLD / cycle;
      const t = fading ? (phase - HOLD / cycle) / (FADE / cycle) : 0;
      const ease = t * t * (3 - 2 * t);
      const scale = 1 + csc * 0.55;

      if (reduced) {
        stampText(WORDS[WORDS.length - 1], 1, 1);
      } else {
        stampText(WORDS[idx], 1 - ease, scale * (1 + ease * 0.06));
        if (fading) stampText(WORDS[next], ease, scale * (0.94 + ease * 0.06));
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 });
    io.observe(canvas);
    setTick((t) => t + 1); // silence unused-setter lint; no re-render needed

    return () => {
      io.disconnect();
      stop();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ filter: "drop-shadow(0 0 32px rgba(102,126,234,0.25))" }}
      aria-hidden
    />
  );
}
```

- [ ] **Step 4: Delete the replaced files**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
git rm src/components/hero/HeroVideo.tsx src/components/hero/VideoType.tsx
```

(`git rm` rather than plain `rm` — this leaves the deletion staged, matching the other staged changes in this task.)

- [ ] **Step 5: Verify standalone — temporarily mount both in Hero.tsx, check, then leave Hero.tsx untouched for Task 7**

This task must produce a visually-verifiable deliverable without permanently editing `Hero.tsx` (that's Task 7's job — editing it here would collide). Do a throwaway verification instead:

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
cp src/components/hero/Hero.tsx /tmp/Hero.tsx.bak
```

Temporarily edit `src/components/hero/Hero.tsx`: replace `import HeroVideo from "./HeroVideo";` with `import HeroMesh from "./HeroMesh";`, replace `import VideoType from "./VideoType";` with `import MeshType from "./MeshType";`, replace the two JSX usages (`<HeroVideo />` → `<HeroMesh />`, `<VideoType ... />` → `<MeshType ... />`), and add `theme-light` to the `<section>` `className` so the mesh's white fill isn't fighting the still-dark `bg-canvas` (e.g. `className="theme-light relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-canvas"`).

```bash
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
(npm run dev > /tmp/codeshaper-dev.log 2>&1 &)
sleep 2 && grep -m1 "Local:" /tmp/codeshaper-dev.log
```

Using Playwright MCP tools, navigate to the hero, screenshot. Confirm: white/light drifting gradient mesh fills the background (no video, no CDN network request in `browser_network_requests` if available), and the "BUILD"-style masked word shows the same mesh playing inside the letterforms (it will look odd colored against the still-dark copy text/CTAs — that's expected and fine, this is a throwaway check, not the final state). Check `browser_console_messages` level `error` — expect 0 (specifically confirm no WebGL/canvas errors from the new files). Emulate reduced motion (`browser_evaluate` setting `window.matchMedia` mock, or Chrome DevTools protocol emulation if exposed by the MCP tools) and confirm the mesh renders one static frame with no console errors.

Then **revert the throwaway edit** — this task does not keep `Hero.tsx` changed:

```bash
cp /tmp/Hero.tsx.bak src/components/hero/Hero.tsx
rm /tmp/Hero.tsx.bak
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
rm -f *.png
git status --short  # confirm Hero.tsx shows no diff; only the new/deleted hero files remain staged/untracked
```

- [ ] **Step 6: Commit**

```bash
git add src/components/hero/gradientMesh.ts src/components/hero/HeroMesh.tsx src/components/hero/MeshType.tsx
git commit -m "Add gradient-mesh module, HeroMesh, MeshType (replace video hero assets)

New canvas-drawn indigo/teal gradient mesh replaces the dark aurora
video for the light hero. HeroMesh (full-bleed background) and MeshType
(video-masked type effect) both call the same drawGradientMesh function
so the whole hero stays one visual system, and the external
Higgsfield/Seedance CDN dependency is dropped.

Hero.tsx is NOT wired to these yet — that's the next commit. Verified
standalone via a temporary throwaway edit (reverted before this commit)."
```

---

## Task 6: `WordMorph.tsx` particle recolor

**Files:**
- Modify: `src/components/hero/WordMorph.tsx`

**Interfaces:**
- No export shape change — `export default function WordMorph({ className }: { className?: string })` unchanged.

- [ ] **Step 1: Fix the blend mode (critical — additive blending is invisible on white)**

Find:

```ts
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
```

Replace with standard alpha ("over") compositing — additive blending assumes a dark backdrop it's adding light to; on white it just pushes further toward white and the particles disappear:

```ts
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
```

- [ ] **Step 2: Recolor the fragment shader**

Find:

```glsl
vec3 indigo = vec3(0.357, 0.373, 0.937);
vec3 violet = vec3(0.545, 0.373, 0.878);
vec3 amber  = vec3(0.949, 0.651, 0.353);

vec3 col = mix(indigo, violet, fract(v_seed * 2.7));
// particles glow amber while they're in flight — the "shaping" moment,
// and wheel energy pushes the whole field warmer
col = mix(col, amber, min(1.0, v_transit * 0.75 + u_energy * 0.35));
col = mix(col, vec3(1.0), v_transit * 0.25);
// depth cue: far slices cool toward indigo
col = mix(col * 0.72, col, v_depth + 0.5);
```

Replace with (indigo/teal base per particle, deep-indigo tint while in flight instead of amber-hot/white-hot — mixing toward white would fade particles toward invisible on a light background, so that step is dropped rather than adapted):

```glsl
vec3 indigo = vec3(0.400, 0.494, 0.918);     // #667EEA
vec3 teal   = vec3(0.078, 0.722, 0.651);     // #14B8A6
vec3 deep   = vec3(0.267, 0.329, 0.608);     // #44549B

vec3 col = mix(indigo, teal, fract(v_seed * 2.7));
// particles shift toward deep indigo while in flight — the "shaping" moment,
// and wheel energy pushes the whole field toward that denser tone
col = mix(col, deep, min(1.0, v_transit * 0.75 + u_energy * 0.35));
// depth cue: far slices cool toward indigo
col = mix(col * 0.72, col, v_depth + 0.5);
```

- [ ] **Step 3: Verify — particles render as visible indigo/teal dots on white**

This component only renders when `!reduced` (it early-returns on `prefers-reduced-motion`), so verify with motion enabled. Use the same throwaway-mount technique as Task 5 Step 5 (copy `Hero.tsx`, swap `WordMorph`'s usage stays as-is since `Hero.tsx` already imports it unconditionally — no import swap needed here, just also apply the Task 5 throwaway `HeroMesh`/`MeshType` swap so the background isn't fighting the particles for legibility):

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
cp src/components/hero/Hero.tsx /tmp/Hero.tsx.bak
```

Apply the same temporary edit as Task 5 Step 5 (swap `HeroVideo`→`HeroMesh`, `VideoType`→`MeshType`, add `theme-light` to the section). Start the dev server, screenshot the hero. Confirm the "BUILD"/word-morph particle field is visibly indigo/teal dots against the light background (not invisible, not still amber/white). Check `browser_console_messages` for WebGL errors. Revert:

```bash
cp /tmp/Hero.tsx.bak src/components/hero/Hero.tsx
rm /tmp/Hero.tsx.bak
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
rm -f *.png
```

- [ ] **Step 4: Commit**

```bash
git add src/components/hero/WordMorph.tsx
git commit -m "Recolor particle word-morph for the light hero

Fragment shader moves from indigo/violet/amber to indigo/teal/deep-indigo,
and blend mode changes from additive (SRC_ALPHA, ONE) to standard alpha
compositing (SRC_ALPHA, ONE_MINUS_SRC_ALPHA) — additive blending assumes
a dark backdrop to add light to and is invisible against white."
```

---

## Task 7: `Hero.tsx` integration — wire new components, apply theme, new copy

**Files:**
- Modify: `src/components/hero/Hero.tsx`
- Modify: `src/components/hero/PromptPipeline.tsx`

**Interfaces:**
- Consumes: `HeroMesh` (Task 5), `MeshType` (Task 5), `.theme-light` scope (Task 1), recolored `WordMorph` (Task 6).

- [ ] **Step 1: Swap imports**

Find:

```tsx
import HeroVideo from "./HeroVideo";
import WordMorph from "./WordMorph";
import VideoType from "./VideoType";
import PromptPipeline from "./PromptPipeline";
```

Replace with:

```tsx
import HeroMesh from "./HeroMesh";
import WordMorph from "./WordMorph";
import MeshType from "./MeshType";
import PromptPipeline from "./PromptPipeline";
```

- [ ] **Step 2: Apply `.theme-light` and update the copy scrim to `<HeroMesh />`**

Find:

```tsx
<section
  ref={sectionRef}
  className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-canvas"
>
  {/* 2 — aurora video, pushed right back: ambient depth only, so the mesh
         is unmistakably the subject */}
  <div ref={videoRef} className="absolute inset-[-4%] mix-blend-screen opacity-40">
    <HeroVideo />
  </div>
```

Replace with:

```tsx
<section
  ref={sectionRef}
  className="theme-light relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-canvas"
>
  {/* 2 — animated gradient mesh: ambient depth only, full opacity (no
         screen-blend trick — that only makes sense lightening a dark base) */}
  <div ref={videoRef} className="absolute inset-[-4%]">
    <HeroMesh />
  </div>
```

- [ ] **Step 3: Replace the hero-mark radial gradient (was tuned for a dark backdrop)**

Find:

```tsx
<div
  ref={markRef}
  aria-hidden
  className="hero-mark pointer-events-none absolute left-1/2 top-1/2 h-[min(72vh,640px)] w-[min(72vh,640px)]"
  style={{
    background:
      "radial-gradient(closest-side, rgba(91,95,239,0.16), rgba(139,95,224,0.06) 55%, transparent 72%)",
  }}
/>
```

Replace with:

```tsx
<div
  ref={markRef}
  aria-hidden
  className="hero-mark pointer-events-none absolute left-1/2 top-1/2 h-[min(72vh,640px)] w-[min(72vh,640px)]"
  style={{
    background:
      "radial-gradient(closest-side, rgba(102,126,234,0.14), rgba(20,184,166,0.05) 55%, transparent 72%)",
  }}
/>
```

- [ ] **Step 4: Replace the copy scrim (was a dark radial gradient to darken the bright particle core for legibility — on light bg we need the opposite: a light scrim so mesh color doesn't fight the copy)**

Find:

```tsx
<div
  aria-hidden
  className="absolute left-1/2 top-1/2 h-[62vh] w-[min(96vw,1040px)] -translate-x-1/2 -translate-y-1/2"
  style={{
    background:
      "radial-gradient(52% 46% at 50% 48%, rgba(10,10,15,0.72) 0%, rgba(10,10,15,0.38) 60%, transparent 100%)",
  }}
/>
```

Replace with:

```tsx
<div
  aria-hidden
  className="absolute left-1/2 top-1/2 h-[62vh] w-[min(96vw,1040px)] -translate-x-1/2 -translate-y-1/2"
  style={{
    background:
      "radial-gradient(52% 46% at 50% 48%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.4) 60%, transparent 100%)",
  }}
/>
```

- [ ] **Step 5: Recolor the hex texture overlay (was tuned for `text-white` on dark)**

Find:

```tsx
<div
  aria-hidden
  className="absolute inset-0 text-white opacity-[0.025]"
  style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
/>
```

Replace with:

```tsx
<div
  aria-hidden
  className="absolute inset-0 text-ink opacity-[0.03]"
  style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
/>
```

(`text-white` was used because the SVG likely uses `currentColor` — check `public/media/hex-pattern-tile.svg`; if it uses a literal fill color instead of `currentColor`, this `text-ink` change is a no-op and that's fine, leave it for consistency with the rest of the light pass.)

- [ ] **Step 6: Update the badge, H1, and subhead copy — drop "AI-first" framing**

Find:

```tsx
const HEADLINE_WORDS = ["We", "build", "AI-first", "software."];
const SCRAMBLE_WORD_INDEX = 2;
```

Replace with:

```tsx
const HEADLINE_WORDS = ["Build", "&", "scale", "digital", "products", "—", "predictably."];
const SCRAMBLE_WORD_INDEX = 2;
```

Find:

```tsx
<span className="h-1.5 w-1.5 rounded-full bg-aurora-amber dot-pulse" />
AI-first product studio
```

Replace with:

```tsx
<span className="h-1.5 w-1.5 rounded-full bg-aurora-amber dot-pulse" />
Product design · Engineering · AI automation
```

Find:

```tsx
<p
  className="mx-auto mt-7 max-w-2xl font-body text-base leading-relaxed text-ink-dim sm:text-lg"
  style={seq(restIn)}
>
  Product design, engineering, and commerce — built with AI agents and
  automation in the workflow, shipped in weekly increments you can watch
  happen.
</p>
```

Replace with:

```tsx
<p
  className="mx-auto mt-7 max-w-2xl font-body text-base leading-relaxed text-ink-dim sm:text-lg"
  style={seq(restIn)}
>
  We design, build, and automate digital products for teams across the
  USA, Canada, and Europe — with weekly visibility and a clean handover
  every time.
</p>
```

Find the `aria-label` on the `<h1>` (must match the new headline for accessibility — screen readers read the `aria-label`, not the animated per-word spans):

```tsx
<h1
  className="font-display text-[26px] font-bold leading-[1.1] tracking-tight text-ink sm:text-[32px] lg:text-[38px]"
  aria-label="We build AI-first software."
>
```

Replace with:

```tsx
<h1
  className="font-display text-[26px] font-bold leading-[1.1] tracking-tight text-ink sm:text-[32px] lg:text-[38px]"
  aria-label="Build & scale digital products — predictably."
>
```

- [ ] **Step 7: Update `VideoType` usage to `MeshType`**

Find:

```tsx
<WordMorph className="absolute inset-0 h-full w-full opacity-30" />
{/* the aurora film, playing inside the letterforms */}
<VideoType className="absolute inset-0 h-full w-full" />
```

Replace with:

```tsx
<WordMorph className="absolute inset-0 h-full w-full opacity-30" />
{/* the gradient mesh, playing inside the letterforms */}
<MeshType className="absolute inset-0 h-full w-full" />
```

- [ ] **Step 8: Recolor the primary CTA (drop glow-shadow, same rationale as Navbar Task 2 Step 4)**

Find:

```tsx
<Link
  href="/contact"
  className="inline-flex items-center gap-2 rounded-full border border-aurora-indigo/70 bg-aurora-indigo/10 px-8 py-4 font-display text-sm font-medium text-ink shadow-[0_0_30px_rgba(91,95,239,0.45)] backdrop-blur-sm transition-[background-color,box-shadow,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-indigo hover:shadow-[0_0_60px_rgba(91,95,239,0.7)]"
>
  Book a Call
  <ArrowRight size={15} strokeWidth={1.75} />
</Link>
```

Replace with:

```tsx
<Link
  href="/contact"
  className="inline-flex items-center gap-2 rounded-full bg-aurora-indigo px-8 py-4 font-display text-sm font-medium text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet"
>
  Book a Call
  <ArrowRight size={15} strokeWidth={1.75} />
</Link>
```

- [ ] **Step 9: Recolor the proof bar**

Find:

```tsx
<div
  className="absolute inset-x-0 bottom-0 z-10 border-t border-hairline bg-[rgba(10,10,15,0.6)] backdrop-blur-md"
  style={seq(restIn, 240)}
>
```

Replace with:

```tsx
<div
  className="absolute inset-x-0 bottom-0 z-10 border-t border-hairline bg-white/70 backdrop-blur-md"
  style={seq(restIn, 240)}
>
```

- [ ] **Step 10: Fix `PromptPipeline.tsx`'s one hardcoded-dark spot**

In `src/components/hero/PromptPipeline.tsx`, find:

```tsx
<span className="relative block h-px w-4 bg-white/12 sm:w-7" aria-hidden>
```

This is the connecting line between pipeline stages — `bg-white/12` (12% white) is invisible on a light background. Replace with:

```tsx
<span className="relative block h-px w-4 bg-hairline sm:w-7" aria-hidden>
```

- [ ] **Step 11: Verify — full hero renders correctly, reduced motion works, no console errors**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
(npm run dev > /tmp/codeshaper-dev.log 2>&1 &)
sleep 2 && grep -m1 "Local:" /tmp/codeshaper-dev.log
```

Using Playwright MCP tools:
1. Navigate, `browser_resize` 1440x900, screenshot immediately (catch the entrance animation state) and again after a short wait (settled state). Confirm: light drifting mesh background, readable dark headline "Build & scale digital products — predictably." with the word-morph particle field and mesh-masked type visible and legible, new badge text, new subhead, solid indigo CTA with white text + no glow, light proof bar at the bottom with readable stats.
2. Scroll down ~300px (`browser_evaluate` `window.scrollTo`), screenshot — confirm the GSAP scroll-scrub (copy lift+fade, mesh layer scale/opacity, mark rotate/scale/opacity) still animates smoothly with the new elements (it references the same `videoRef`/`markRef`/`copyRef` — nothing in this task changed the GSAP wiring, only what's inside those refs, so this should already work; verify it does).
3. `browser_console_messages` level `error` — expect 0 (specifically watch for WebGL context errors from `WordMorph` and canvas errors from `HeroMesh`/`MeshType`).
4. Emulate `prefers-reduced-motion: reduce` and reload — confirm the hero still renders (static mesh frame, no particle canvas per `WordMorph`'s existing early-return, static full-word `MeshType` frame, no scroll-scrub) and no console errors.
5. `browser_resize` to 390x844 (mobile), screenshot — confirm the hero doesn't overflow horizontally and text stays legible.
6. Delete screenshots, stop the dev server.

- [ ] **Step 12: Commit**

```bash
git add src/components/hero/Hero.tsx src/components/hero/PromptPipeline.tsx
git commit -m "Wire the light hero: HeroMesh/MeshType, new copy, recolored chrome

Hero.tsx now uses HeroMesh/MeshType instead of the video-based
HeroVideo/VideoType, applies .theme-light, and drops the AI-first
framing per the plan (badge, H1, subhead rewritten; prompt-pipeline
demo kept but recaptioned implicitly by the new subhead). CTA, proof
bar, hex texture, hero-mark glow, and copy scrim all recolored for a
light background. PromptPipeline's stage-connector line fixed (was
invisible white-on-white)."
```

---

## Task 8: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Fresh build + dev server**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
npm run build 2>&1 | tail -60
```

Expected: clean build, no type errors, no missing-import errors (this catches any leftover reference to the deleted `HeroVideo`/`VideoType` files).

```bash
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
(npm run dev > /tmp/codeshaper-dev.log 2>&1 &)
sleep 2 && grep -m1 "Local:" /tmp/codeshaper-dev.log
```

- [ ] **Step 2: Full-page walkthrough at desktop width**

Using Playwright MCP tools, navigate, `browser_resize` 1440x900:
1. Screenshot the hero (top of page).
2. Click "Services", screenshot the open mega menu; click through 2–3 of the 01–05 rows, confirm each swaps the detail pane correctly.
3. Click "Industries", screenshot the open compact dropdown.
4. Click "Company", screenshot the open compact dropdown.
5. Scroll to where the dark aurora sections begin (Trust Strip / Service Pillars index — `browser_evaluate` `window.scrollTo(0, 1600)` roughly), screenshot — confirm the transition from light nav+hero to dark sections is a clean boundary, not a color leak (e.g. no dark-theme text rendering unreadable on a light strip, or vice versa — this would indicate `.theme-light` leaked past the hero `<section>` boundary).
6. `browser_console_messages` level `error`, all messages so far — expect 0.

- [ ] **Step 3: Mobile walkthrough**

`browser_resize` 390x844: screenshot hero, open hamburger menu and screenshot, expand one accordion item and screenshot, close menu.

- [ ] **Step 4: Reduced-motion walkthrough**

Emulate `prefers-reduced-motion: reduce`, reload, screenshot hero and open mega menu. Confirm both render fully (no stuck-invisible content per `Reveal.tsx`'s existing failsafe) with no animation and no console errors.

- [ ] **Step 5: Clean up**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
rm -f *.png
rm -rf .playwright-mcp
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
git status --short
```

Confirm `git status` is clean (no untracked screenshot files, nothing unexpectedly modified).

- [ ] **Step 6: Final commit (only if Step 2–4 caught anything requiring a fix)**

If every check in Steps 2–4 passed with no fixes needed, there's nothing to commit here — Task 7's commit is the last one. If a fix was needed, commit it with a message describing what the full walkthrough caught that individual task verification missed.

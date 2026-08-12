# Hero Product-Card Scene + Transparent Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the navbar transparent over the hero (solid once scrolled), and add a floating "product-card scene" (self-typing code editor, growing-bars metrics card, AI-agent chat exchange) to the hero so it reads unmistakably as a software company — reviving and recoloring the existing unused `WorkspaceScene.tsx`, wiring it into `Hero.tsx` with parallax and staggered entrance, and retiring four other dead hero files.

**Architecture:** No new components beyond what already exists as unused code. `WorkspaceScene.tsx`'s three sub-components (`CodeCard`, `MetricCard`, `AgentCard`) get recolored from a hardcoded dark-glass hex palette to the `aurora-*`/`ink-*` design tokens (light glass, since `Hero.tsx`'s `.theme-light` scope already makes `.glass` resolve light). The component's own layout is rewritten from a bounded 720×460 host box to five independently-positioned `.scene-layer` elements (3 cards + 2 chips) floating directly within the hero `<section>`, `hidden lg:block`. Entrance uses the same `seqStyle()` fade/rise helper `Hero.tsx` already uses for every other hero element (extracted to `src/lib/motion.ts` so both files share it). Parallax reuses `Hero.tsx`'s existing pointer-tilt `requestAnimationFrame` loop (currently driving only the abstract radial mark), generalized to also drive every `.scene-layer` element scaled by its own `data-depth`.

**Tech Stack:** Next.js 15 (App Router) + TypeScript + Tailwind v4, React 19, no new dependencies — plain CSS custom properties + `requestAnimationFrame` for parallax, matching the existing pattern.

## Global Constraints

- **Text-safe color rule (binding on every new/changed usage):** the base `--color-aurora-indigo` (`#667EEA`) and `--color-aurora-amber` (`#14B8A6`, teal) tokens are 3:1-class only — correct for icons, borders, decorative fills, and large text (≥24px, or ≥18.66px bold), but fail 4.5:1 for normal text on white. Any text (not icon glyphs, not borders/backgrounds/decorative dots) rendered in an indigo tone must use `--color-aurora-violet` (`#44549B`, 7.03:1); any text in a teal/amber tone must use `--color-aurora-amber-dark` (`#0F766E`, 5.47:1). Applies to default and hover states alike.
- **No new dependencies.** Everything ships with what's already in `package.json`.
- **Desktop-only for the product-card scene.** All 3 cards and 2 chips render `hidden lg:block` (1024px) — mobile hero layout is otherwise byte-for-byte unchanged from what's live today.
- **`prefers-reduced-motion` handling carries over.** New animation (entrance stagger, parallax, card-internal typing/bar-growth/chat-reveal) must be inert under `prefers-reduced-motion: reduce`, matching the pattern already used everywhere else in this codebase.
- **Navbar text stays `text-ink`/`text-ink-dim` throughout** — no color-flip logic between the transparent and solid states, since the hero underneath is light end-to-end.
- **`.theme-light` scoping.** All edits stay inside `Hero.tsx`'s `<section className="theme-light ...">` and `Navbar.tsx`'s `<header className="theme-light ...">`, both already scoped — don't touch `:root`'s dark-theme tokens or any section below the hero.
- **No automated test suite exists in this codebase.** Verification is `npm run build` (type + compile check) plus manual Playwright MCP walkthroughs, consistent with every prior round of work here.

---

### Task 1: Delete dead hero files

**Files:**
- Delete: `src/components/hero/HeroCanvas.tsx`
- Delete: `src/components/hero/HexAurora.tsx`
- Delete: `src/components/hero/NeuralCanvas.tsx`
- Delete: `src/components/hero/ScrambleHeadline.tsx`

**Interfaces:** None — these files are confirmed unimported anywhere in `src/`. Nothing downstream depends on them.

- [ ] **Step 1: Confirm no references**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
grep -rl "HeroCanvas\|HexAurora\|NeuralCanvas\|ScrambleHeadline" src/ --include="*.tsx" --include="*.ts" | grep -v "hero/HeroCanvas.tsx\|hero/HexAurora.tsx\|hero/NeuralCanvas.tsx\|hero/ScrambleHeadline.tsx"
```

Expected: no output (nothing outside the files themselves references them).

- [ ] **Step 2: Delete the files**

```bash
git rm src/components/hero/HeroCanvas.tsx src/components/hero/HexAurora.tsx src/components/hero/NeuralCanvas.tsx src/components/hero/ScrambleHeadline.tsx
```

- [ ] **Step 3: Verify the build still passes**

```bash
npm run build 2>&1 | tail -30
```

Expected: clean build, no missing-import errors.

- [ ] **Step 4: Commit**

```bash
git commit -m "Delete unused pre-light-hero WebGL/scramble components

HeroCanvas.tsx, HexAurora.tsx, NeuralCanvas.tsx, and ScrambleHeadline.tsx
are all leftover from hero iterations before the light-theme rewrite;
none are imported anywhere."
```

---

### Task 2: `Navbar.tsx` — transparent over the hero, solid on scroll

**Files:**
- Modify: `src/components/nav/Navbar.tsx`

**Interfaces:**
- Consumes: existing `scrolled`, `openValue`, `mobileOpen` state (all already defined in this file, unchanged).
- Produces: no new exports — this is a self-contained className change.

- [ ] **Step 1: Make the bar's background/border/blur conditional on the existing scroll/menu state**

Find:

```tsx
      <header className="theme-light fixed inset-x-0 top-0 z-50 font-satoshi">
        <div
          className={`border-b border-hairline bg-canvas/95 backdrop-blur-xl transition-shadow duration-[250ms] ${
            scrolled || openValue || mobileOpen ? "shadow-[0_1px_0_rgba(11,15,25,0.04)]" : ""
          }`}
        >
```

Replace with:

```tsx
      <header className="theme-light fixed inset-x-0 top-0 z-50 font-satoshi">
        <div
          className={`border-b transition-[background-color,border-color,box-shadow] duration-[250ms] ${
            scrolled || openValue || mobileOpen
              ? "border-hairline bg-canvas/95 shadow-[0_1px_0_rgba(11,15,25,0.04)] backdrop-blur-xl"
              : "border-transparent bg-transparent shadow-none backdrop-blur-none"
          }`}
        >
```

This keeps the exact existing threshold (`scrolled` flips at `scrollY > 80`, already wired) and the exact existing solid treatment — it now also applies when a menu is open even at the top of the page (so a transparent bar never sits above an opaque dropdown/mega panel), matching the file's own existing precedent of grouping `scrolled || openValue || mobileOpen` together for the shadow.

- [ ] **Step 2: Verify**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
(npm run dev > /tmp/codeshaper-dev.log 2>&1 &)
sleep 2 && grep -m1 "Local:" /tmp/codeshaper-dev.log
```

Using Playwright MCP tools at 1440×900: navigate to `/`, screenshot the top of the page — confirm the bar has no visible background/border/shadow and the hero shows through behind the logo/links. `browser_evaluate` `window.scrollTo(0, 200)`, wait ~300ms, screenshot again — confirm the bar now shows the solid white/95 + blur + hairline border + shadow treatment. Scroll back to `window.scrollTo(0, 0)`, open the Services mega menu — confirm the bar goes solid immediately even though scroll is 0. Close the menu, confirm the bar returns to transparent. `browser_console_messages` level `error` — expect 0. Stop the dev server when done.

- [ ] **Step 3: Commit**

```bash
git add src/components/nav/Navbar.tsx
git commit -m "Make navbar transparent over the hero, solid once scrolled or a menu opens"
```

---

### Task 3: Recolor `WorkspaceScene.tsx`'s card content for the light theme

**Files:**
- Modify: `src/components/hero/WorkspaceScene.tsx`

**Interfaces:**
- Consumes: `--color-aurora-violet`, `--color-aurora-amber-dark`, `--color-aurora-indigo`, `--color-aurora-amber`, `--color-aurora-violet-dark` (all already defined in `.theme-light` in `globals.css`), `text-ink`/`text-ink-faint` (already defined).
- Produces: `CodeCard`, `MetricCard`, `AgentCard` with light-glass-safe colors — consumed by Task 4's rewritten `WorkspaceScene` export.

This task touches only the three sub-components' color values — not layout, not the exported `WorkspaceScene` function itself (that's Task 4).

- [ ] **Step 1: Recolor `CodeCard`'s syntax-highlight token map**

Find:

```tsx
const TOKEN_COLOR: Record<string, string> = {
  kw: "text-[#8B5FE0]",
  fn: "text-[#F5F4F2]",
  op: "text-[#5B5B66]",
  prop: "text-[#5B5FEF]",
  str: "text-[#F2A65A]",
};
```

Replace with:

```tsx
const TOKEN_COLOR: Record<string, string> = {
  kw: "text-aurora-violet",
  fn: "text-ink",
  op: "text-ink-faint",
  prop: "text-aurora-violet",
  str: "text-aurora-amber-dark",
};
```

- [ ] **Step 2: Recolor `CodeCard`'s header dots so they read against the light glass surface**

Find:

```tsx
        <span className="h-2.5 w-2.5 rounded-full bg-[#F2A65A]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#5B5FEF]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
```

Replace with:

```tsx
        <span className="h-2.5 w-2.5 rounded-full border border-hairline bg-aurora-amber/70" />
        <span className="h-2.5 w-2.5 rounded-full border border-hairline bg-aurora-violet/70" />
        <span className="h-2.5 w-2.5 rounded-full border border-hairline bg-ink-faint/20" />
```

- [ ] **Step 3: Recolor `MetricCard`'s bar-chart gradients**

Find:

```tsx
              background:
                i === bars.length - 1
                  ? "linear-gradient(180deg,#F2A65A,#8B5FE0)"
                  : "linear-gradient(180deg,#5B5FEF,#3a3a72)",
```

Replace with:

```tsx
              background:
                i === bars.length - 1
                  ? "linear-gradient(180deg, var(--color-aurora-amber), var(--color-aurora-violet))"
                  : "linear-gradient(180deg, var(--color-aurora-indigo), var(--color-aurora-violet-dark))",
```

- [ ] **Step 4: Verify no hardcoded dark-glass hex colors remain, and the build still passes**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
grep -n "#8B5FE0\|#F5F4F2\|#5B5B66\|#5B5FEF\|#F2A65A\|#3a3a72" src/components/hero/WorkspaceScene.tsx
```

Expected: no output. (`AgentCard` was already token-based and is untouched by this task.)

```bash
npm run build 2>&1 | tail -30
```

Expected: clean build.

- [ ] **Step 5: Commit**

```bash
git add src/components/hero/WorkspaceScene.tsx
git commit -m "Recolor WorkspaceScene's card content for the light-theme glass surface

CodeCard's syntax highlighting and MetricCard's bar gradients were
hardcoded hex values tuned for a dark glass background from before the
light-hero rewrite; remapped to the aurora-* design tokens, respecting
the text-safe contrast rule for actual text (kw/fn/op/prop/str), while
decorative fills (header dots, bar gradients) keep the base tokens."
```

---

### Task 4: Wire `WorkspaceScene` into `Hero.tsx` — layout, entrance stagger

**Files:**
- Modify: `src/lib/motion.ts`
- Modify: `src/components/hero/Hero.tsx`
- Modify: `src/components/hero/WorkspaceScene.tsx`

**Interfaces:**
- Consumes: `CodeCard`, `MetricCard`, `AgentCard` (Task 3, recolored, unchanged in this task), `usePrefersReducedMotion` (existing, from `@/lib/motion`).
- Produces: `seqStyle(on: boolean, delay?: number): React.CSSProperties` exported from `@/lib/motion` (consumed by both `Hero.tsx` and `WorkspaceScene.tsx`); `WorkspaceScene({ restIn: boolean })` as the new prop signature (consumed by Task 5, which only touches parallax and doesn't change this signature).

- [ ] **Step 1: Extract the fade/rise entrance helper into `src/lib/motion.ts`**

`Hero.tsx`'s original local `seq()` (being removed in Step 2) already types its return as `React.CSSProperties` with no explicit `React` import — `@types/react` declares it as an ambient global namespace, so that resolves today without an import. The extracted version uses the same bare `React.CSSProperties` reference, matching that existing working pattern exactly rather than introducing a different import style.

Find (end of file):

```ts
/** Combined guard: cursor-follow / parallax layers should run only when this is true. */
export function useMotionAllowed(): boolean {
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  return fine && !reduced;
}
```

Replace with:

```ts
/** Combined guard: cursor-follow / parallax layers should run only when this is true. */
export function useMotionAllowed(): boolean {
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  return fine && !reduced;
}

/**
 * Shared fade + rise entrance style: opacity 0→1, translateY 18px→0.
 * Used by every staggered hero element (headline sub-parts, CTAs, proof
 * bar, product-card scene) so entrance timing stays visually consistent
 * across files without duplicating the transition string.
 */
export function seqStyle(on: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 600ms ease ${delay}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  };
}
```

- [ ] **Step 2: `Hero.tsx` — use the shared helper instead of its local copy**

Find:

```tsx
import { usePrefersReducedMotion, useMotionAllowed } from "@/lib/motion";
```

Replace with:

```tsx
import { usePrefersReducedMotion, useMotionAllowed, seqStyle as seq } from "@/lib/motion";
import WorkspaceScene from "./WorkspaceScene";
```

Find:

```tsx
  const seq = (on: boolean, delay = 0): React.CSSProperties => ({
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 600ms ease ${delay}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  return (
```

Replace with:

```tsx
  return (
```

(This removes the local `seq` function entirely — the import above aliases the shared `seqStyle` to the same local name `seq`, so every existing `style={seq(...)}` call site in this file needs no other change.)

- [ ] **Step 3: `Hero.tsx` — render `WorkspaceScene` between the hex texture and the copy**

Find:

```tsx
      {/* hex texture */}
      <div
        aria-hidden
        className="absolute inset-0 text-ink opacity-[0.03]"
        style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
      />

      {/* 5 — copy */}
```

Replace with:

```tsx
      {/* hex texture */}
      <div
        aria-hidden
        className="absolute inset-0 text-ink opacity-[0.03]"
        style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
      />

      {/* product-card scene: floats around the copy, desktop only */}
      <WorkspaceScene restIn={restIn} />

      {/* 5 — copy */}
```

- [ ] **Step 4: Rewrite `WorkspaceScene.tsx`'s layout — five independently-positioned scene layers instead of a bounded host box**

Find:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, TrendingUp, Check, GitBranch } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Hero workspace scene — drawn entirely in code (no image/video dependency).
 *
 * Three product surfaces float at different depths and animate themselves, so
 * the hero reads unmistakably as a software studio: a code editor that types
 * itself, an analytics card whose bars grow, and an AI agent card where a
 * human question is answered by an agent. Small satellite chips (CI passing,
 * branch) fill the negative space.
 *
 * Each layer carries a `data-depth` used by the parent for mouse parallax and
 * scroll separation. Reduced motion: everything renders in its final state,
 * nothing loops.
 */
```

Replace with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Check, GitBranch } from "lucide-react";
import { usePrefersReducedMotion, seqStyle } from "@/lib/motion";

/**
 * Hero product-card scene — drawn entirely in code (no image/video dependency).
 *
 * Three product surfaces float around the hero's centered copy and animate
 * themselves, so the hero reads unmistakably as a software studio: a code
 * editor that types itself, an analytics card whose bars grow, and an AI
 * agent card where a human question is answered by an agent. Small satellite
 * chips (CI passing, branch) fill the negative space.
 *
 * Positioned directly within Hero.tsx's <section> (no bounded host box) —
 * each layer is `hidden lg:block` and carries a `data-depth` that Hero.tsx's
 * pointer-tilt effect reads to drive per-layer parallax. Entrance uses the
 * same seqStyle() fade/rise every other hero element uses, staggered per
 * card. Reduced motion: everything renders in its final state, no loops, no
 * parallax (Hero.tsx's parallax effect is itself gated off by
 * useMotionAllowed()).
 */
```

Find:

```tsx
export default function WorkspaceScene() {
  const reduced = usePrefersReducedMotion();
  const totalChars = CODE_LINES.reduce((n, l) => n + l.tokens.map((t) => t[0]).join("").length, 0);
  const [typed, setTyped] = useState(reduced ? totalChars : 0);
  const [progress, setProgress] = useState(reduced ? 1 : 0);
  const [step, setStep] = useState(reduced ? 3 : 0);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const timers: ReturnType<typeof setTimeout>[] = [];

    // typing loop (restarts so the scene always feels live)
    const tick = (now: number) => {
      const elapsed = (now - t0) / 1000;
      const cycle = elapsed % 9;
      setTyped(cycle < 6 ? Math.floor((cycle / 6) * totalChars) : totalChars);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    timers.push(setTimeout(() => setProgress(1), 900));
    timers.push(setTimeout(() => setStep(1), 1300));
    timers.push(setTimeout(() => setStep(2), 2100));
    timers.push(setTimeout(() => setStep(3), 3400));

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [reduced, totalChars]);

  return (
    <div ref={hostRef} className="relative mx-auto h-[420px] w-full max-w-[720px] lg:h-[460px]">
      {/* back: metric card */}
      <div
        data-depth="0.35"
        className="scene-layer absolute right-0 top-2 hidden lg:block"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="rotate-[3deg]">
          <MetricCard progress={progress} />
        </div>
      </div>

      {/* satellite chips */}
      <div data-depth="0.2" className="scene-layer absolute left-2 top-0 hidden lg:block">
        <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 font-body text-[11.5px] text-ink-dim">
          <Check size={12} strokeWidth={2} className="text-aurora-violet" />
          CI passing
        </span>
      </div>
      <div data-depth="0.28" className="scene-layer absolute bottom-6 right-10 hidden lg:block">
        <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 font-body text-[11.5px] text-ink-dim">
          <GitBranch size={12} strokeWidth={2} className="text-aurora-amber" />
          release/2.4
        </span>
      </div>

      {/* mid: code editor */}
      <div
        data-depth="0.6"
        className="scene-layer absolute left-0 top-16 lg:top-14"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="-rotate-[2deg]">
          <CodeCard typed={typed} />
        </div>
      </div>

      {/* front: agent card */}
      <div data-depth="1" className="scene-layer absolute bottom-0 right-0 lg:bottom-4 lg:right-6">
        <div className="rotate-[1.5deg]">
          <AgentCard step={step} />
        </div>
      </div>
    </div>
  );
}
```

Replace with:

```tsx
export default function WorkspaceScene({ restIn }: { restIn: boolean }) {
  const reduced = usePrefersReducedMotion();
  const totalChars = CODE_LINES.reduce((n, l) => n + l.tokens.map((t) => t[0]).join("").length, 0);
  const [typed, setTyped] = useState(reduced ? totalChars : 0);
  const [progress, setProgress] = useState(reduced ? 1 : 0);
  const [step, setStep] = useState(reduced ? 3 : 0);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const timers: ReturnType<typeof setTimeout>[] = [];

    // typing loop (restarts so the scene always feels live)
    const tick = (now: number) => {
      const elapsed = (now - t0) / 1000;
      const cycle = elapsed % 9;
      setTyped(cycle < 6 ? Math.floor((cycle / 6) * totalChars) : totalChars);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    timers.push(setTimeout(() => setProgress(1), 900));
    timers.push(setTimeout(() => setStep(1), 1300));
    timers.push(setTimeout(() => setStep(2), 2100));
    timers.push(setTimeout(() => setStep(3), 3400));

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [reduced, totalChars]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] hidden lg:block">
      {/* satellite chip: CI passing */}
      <div
        data-depth="0.2"
        className="scene-layer absolute left-[3%] top-[10%] xl:left-[6%] xl:top-[8%]"
        style={seqStyle(restIn, 200)}
      >
        <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 font-body text-[11.5px] text-ink-dim">
          <Check size={12} strokeWidth={2} className="text-aurora-indigo" />
          CI passing
        </span>
      </div>

      {/* satellite chip: release branch */}
      <div
        data-depth="0.28"
        className="scene-layer absolute bottom-[25%] right-[3%] xl:bottom-[23%] xl:right-[6%]"
        style={seqStyle(restIn, 360)}
      >
        <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 font-body text-[11.5px] text-ink-dim">
          <GitBranch size={12} strokeWidth={2} className="text-aurora-amber" />
          release/2.4
        </span>
      </div>

      {/* back: metric card */}
      <div
        data-depth="0.35"
        className="scene-layer absolute right-[1%] top-[11%] xl:right-[5%] xl:top-[9%]"
        style={seqStyle(restIn, 240)}
      >
        <div className="rotate-[3deg]">
          <MetricCard progress={progress} />
        </div>
      </div>

      {/* mid: code editor */}
      <div
        data-depth="0.6"
        className="scene-layer absolute left-[1%] top-[15%] xl:left-[4%] xl:top-[12%]"
        style={seqStyle(restIn, 160)}
      >
        <div className="-rotate-[2deg]">
          <CodeCard typed={typed} />
        </div>
      </div>

      {/* front: agent card */}
      <div
        data-depth="1"
        className="scene-layer absolute bottom-[13%] right-[1%] xl:bottom-[11%] xl:right-[4%]"
        style={seqStyle(restIn, 320)}
      >
        <div className="rotate-[1.5deg]">
          <AgentCard step={step} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
npm run build 2>&1 | tail -30
```

Expected: clean build, no type errors (in particular, confirm `seqStyle`'s `CSSProperties` return type satisfies every `style={seq(...)}` call site in `Hero.tsx` unchanged).

```bash
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
(npm run dev > /tmp/codeshaper-dev.log 2>&1 &)
sleep 2 && grep -m1 "Local:" /tmp/codeshaper-dev.log
```

Using Playwright MCP tools:
1. At 1440×900: navigate to `/`, wait for the entrance sequence to finish (~2s), screenshot. Confirm all 3 cards (code editor upper-left, metrics upper-right, agent chat lower-right) and 2 chips are visible, do not overlap the headline text, badge pill, subhead, or CTA buttons, and each card's colors are legible (no near-invisible text) against its light glass background. Also confirm the "CI passing" chip and the metrics card sit clear of the fixed 64px-tall navbar header band (the header is `z-50`, above the scene's `z-[5]`, so any overlap would show the chip/card visually clipped behind the logo or nav links) — if either is tucked under the header, push its `top-[...]` offset down further.
2. At 1024×900 and 1280×900: screenshot. Confirm no card clips the viewport edge and no card visually collides with the headline/CTAs at these narrower widths — this is exactly the breakpoint band the previous round's final review caught a gap in. If any collision is visible, adjust the `left-[...]`/`right-[...]`/`top-[...]`/`bottom-[...]` percentage values in Step 4 above (structure unchanged) and re-screenshot before proceeding.
3. At 1920×1080: screenshot. Confirm cards don't look stranded far from the copy (the `xl:` offsets should keep them reasonably close in).
4. At 390×844 (mobile) and 768×1024 (tablet, still below `lg`): screenshot. Confirm zero product cards/chips render and the hero looks identical to how it did before this task (regression check).
5. Emulate `prefers-reduced-motion: reduce`, reload at 1440×900: confirm all 3 cards render in their final state (code fully typed, bars at full height, agent's final response line showing) with no visible animation.
6. `browser_console_messages` level `error` at each step above — expect 0 throughout.

Stop the dev server when done.

- [ ] **Step 6: Commit**

```bash
git add src/lib/motion.ts src/components/hero/Hero.tsx src/components/hero/WorkspaceScene.tsx
git commit -m "Wire WorkspaceScene into the hero: floating layout, staggered entrance

Extracts Hero.tsx's local fade/rise helper into a shared seqStyle()
export so both files use it. WorkspaceScene's layout moves from a
bounded host box to five independently-positioned scene layers
(hidden lg:block) floating around the centered copy, each with a
staggered entrance joining the hero's existing restIn sequence."
```

---

### Task 5: Pointer parallax for the product-card scene

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/hero/Hero.tsx`

**Interfaces:**
- Consumes: `.scene-layer` elements and their `data-depth` attributes (Task 4, unchanged), `sectionRef`/`markRef`/`interactive` (all pre-existing in `Hero.tsx`).
- Produces: nothing new downstream — this is the final piece of the hero's own behavior.

- [ ] **Step 1: `.scene-layer` consumes the same `--tx`/`--ty` custom-property pattern `.hero-mark` already uses**

Find:

```css
/* Hero workspace scene layers: promoted for smooth per-layer parallax */
.scene-layer {
  will-change: transform, opacity;
  transform-style: preserve-3d;
}
```

Replace with:

```css
/* Hero workspace scene layers: promoted for smooth per-layer parallax.
   translate (not transform) so it composes independently of the rotate
   applied by each card's own inner wrapper div. Defaults to 0px 0px when
   unset — Hero.tsx's pointer-tilt effect only ever sets these custom
   properties when useMotionAllowed() is true, so reduced-motion and
   coarse-pointer users never receive a non-zero value in the first
   place; no separate reduced-motion override is needed here. */
.scene-layer {
  will-change: transform, opacity;
  transform-style: preserve-3d;
  translate: var(--tx, 0px) var(--ty, 0px);
}
```

- [ ] **Step 2: Generalize `Hero.tsx`'s pointer-tilt effect to also drive every `.scene-layer` element**

Find:

```tsx
  // pointer tilt on the mark (desktop only)
  useEffect(() => {
    if (!interactive || !sectionRef.current) return;
    const section = sectionRef.current;
    let raf = 0, mx = 0, my = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    };
    const tick = () => {
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;
      if (markRef.current) {
        markRef.current.style.setProperty("--tx", `${cx * 26}px`);
        markRef.current.style.setProperty("--ty", `${cy * 18}px`);
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [interactive]);
```

Replace with:

```tsx
  // pointer tilt on the mark + product-card scene layers (desktop only)
  useEffect(() => {
    if (!interactive || !sectionRef.current) return;
    const section = sectionRef.current;
    const layers = Array.from(section.querySelectorAll<HTMLElement>(".scene-layer"));
    let raf = 0, mx = 0, my = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    };
    const tick = () => {
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;
      if (markRef.current) {
        markRef.current.style.setProperty("--tx", `${cx * 26}px`);
        markRef.current.style.setProperty("--ty", `${cy * 18}px`);
      }
      for (const layer of layers) {
        const depth = parseFloat(layer.dataset.depth ?? "1");
        layer.style.setProperty("--tx", `${cx * 26 * depth}px`);
        layer.style.setProperty("--ty", `${cy * 18 * depth}px`);
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [interactive]);
```

- [ ] **Step 3: Verify**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
npm run build 2>&1 | tail -30
```

Expected: clean build.

```bash
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
(npm run dev > /tmp/codeshaper-dev.log 2>&1 &)
sleep 2 && grep -m1 "Local:" /tmp/codeshaper-dev.log
```

Using Playwright MCP tools at 1440×900: navigate to `/`, wait for entrance to finish. Use `browser_evaluate` to read the code-editor card's `getBoundingClientRect()` at rest, then simulate/move the mouse to one corner of the hero and read the same card's `getBoundingClientRect()` again — confirm its position shifted by a small amount (a few pixels, scaled by its `data-depth="0.6"`) in the direction of the mouse move, and that the agent card (`data-depth="1"`) shifted by a visibly larger amount than the code card for the same mouse movement (higher depth = more movement). Confirm the abstract radial mark still parallaxes too (no regression to the pre-existing behavior). Emulate `prefers-reduced-motion: reduce`, reload, repeat the mouse-move check — confirm no `.scene-layer` element moves at all. `browser_console_messages` level `error` — expect 0. Stop the dev server when done.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/components/hero/Hero.tsx
git commit -m "Add per-layer pointer parallax to the product-card scene

Generalizes the existing pointer-tilt effect (previously driving only
the abstract radial mark) to also drive every .scene-layer element,
scaled by each element's own data-depth, so the cards separate
slightly from each other as the cursor moves rather than moving as
one flat plane."
```

---

### Task 6: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Fresh build**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
npm run build 2>&1 | tail -60
```

Expected: clean build, no type errors, no missing-import errors.

- [ ] **Step 2: Full desktop walkthrough across the breakpoint band that matters most (1024–1280px)**

```bash
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
(npm run dev > /tmp/codeshaper-dev.log 2>&1 &)
sleep 2 && grep -m1 "Local:" /tmp/codeshaper-dev.log
```

Using Playwright MCP tools, at each of 1024×900, 1152×900, 1280×900, 1440×900, 1920×1080:
1. Navigate fresh to `/`, wait for entrance (~2s), screenshot.
2. Confirm: navbar transparent at scroll 0, all 3 product cards + 2 chips visible and correctly colored (no invisible/near-white text on the light glass), no overlap with headline/badge/subhead/CTA buttons, hex texture and gradient mesh still visible underneath.
3. `window.scrollTo(0, 200)`, screenshot — confirm navbar transitions to solid, product-card scene has scrolled normally with the rest of the hero (no stray fixed-position artifact left behind).
4. `browser_console_messages` level `error` — expect 0.

- [ ] **Step 3: Mobile/tablet regression check**

At 390×844 and 768×1024: screenshot the hero. Confirm it's pixel-for-pixel the same as before this plan (no product cards, navbar still transparent-then-solid on scroll — that behavior isn't `lg`-gated). 0 console errors.

- [ ] **Step 4: Reduced-motion walkthrough**

Emulate `prefers-reduced-motion: reduce` at 1440×900, reload. Confirm: headline appears in its static final state (already the case pre-plan), all 3 product cards render fully typed/grown/answered with no animation and no parallax on mouse move, navbar transparent→solid transition still works (that's a state/property change, not motion, so it's unaffected by this media query either way). 0 console errors.

- [ ] **Step 5: Clean up**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
rm -f *.png
rm -rf .playwright-mcp
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
git status --short
```

Confirm `git status` is clean.

- [ ] **Step 6: Final commit (only if Step 2's breakpoint check caught a real collision requiring an offset nudge)**

If everything passed with no fixes needed, there's nothing to commit here — Task 5's commit is the last one. If a card's position needed adjusting to clear a collision found during Step 2, commit it with a message describing what the full walkthrough caught that individual task verification missed.

# Codeshaper Website v3.0 — Pass 2: Motion & Interaction ✅

11-section homepage with the full motion layer. Next.js (App Router) +
TypeScript + Tailwind v4 · Radix UI menus · Lenis smooth scroll · self-hosted
Space Grotesk + Geist.

**Pass 2 verified:** word-mask hero headline + one-word scramble, sequenced
subline/CTAs, proof-strip count-ups, gradient drift + damped cursor-parallax
(hero + AI spotlight only), magnetic CTAs (hero + form only), logo marquee
(pause on hover), services-row spotlights, interactive scripted chat with
typing indicator + ~20ms/char streaming, delivery connector draw-ins,
industries cascade + chip pops, engagement spotlights, Locations horizon
pulse + staggered dot pulses + amber hover, form invalid-shake + stub submit,
Radix menu entrance animation with column stagger (keyboard/Escape intact),
custom cursor (desktop ≥1024px, hides over text fields, drag pill over
marquee). All reveals are IntersectionObserver enter-only — **no pinning
anywhere**. `prefers-reduced-motion` disables cursor/parallax/magnetic/
marquee/pulses/streaming (verified via emulation). Pass 3 (video media) still
pending — static gradient stand-ins remain by design.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

## Verified (screenshots in chat)

- Mega menu on **Radix NavigationMenu** (zero hand-rolled open/close/focus
  logic): solid `#0B0B10` full-width panel, viewport scrim, no bleed-through,
  Escape/outside-click close confirmed, caret state indicators; mobile
  (<1024px) full-screen takeover with **Radix Accordion** 01–05 services
- All 11 sections present: Hero · Trust · Services index · AI spotlight ·
  Delivery + standards · Success stories · Industries · Engagement models ·
  Locations (CSS/SVG earth-horizon treatment, 5 glass cards) · Final CTA +
  form (stub submit) · Footer (5 columns + cities row + legal)
- Rhythm §5: dark 1–2 → light 3 → dark 4 → light 5–7 → dark 8–11 descent
- No horizontal scroll at 375 / 768 / 1440 (checked programmatically)
- Form usable at 375px, native validation styling, submit → stub confirmation
- SEO: keyword `<title>` + meta description per §2; visible H1 stays human
- Fonts render as Space Grotesk / Geist (self-hosted, no fallback)

## Structure

| Path | What |
|---|---|
| `src/app/page.tsx` | The 11 sections in §4 order |
| `src/components/nav/` | Radix navbar + mega menu, Radix Accordion mobile |
| `src/components/hero/Hero.tsx` | Static hex aurora + H1 + proof strip |
| `src/components/sections/` | Sections 4.2–4.11 |
| `src/lib/navigation.ts` | Menu/service data + blurbs (single source) |
| `src/components/system/` | Motion components from earlier passes — **unused in Pass 1**, ready for Pass 2 |
| `public/media/` | Aurora/particle loops + stills from earlier passes — **unused in Pass 1**, ready for Pass 3 |

## ⚠️ TODO — user input needed before launch (§7)

- [ ] Hero H1 approval: "We build digital products — with weekly visibility and clean handover."
- [ ] Real proof-strip numbers (Founded 2021 · 20+ specialists · 300+ projects · ~1 wk kickoff)
- [ ] Real client logos + usage permission (trust strip currently fictional wordmarks)
- [ ] Real success-story data + client permission (3 cards are invented)
- [ ] The 5 real office cities + addresses (Locations + footer cities row are `[City N] / TBD`)
- [ ] Form submission endpoint (currently a stub handler, no data sent)
- [ ] Chat panel wording incl. "70–80%" claim (scripted preview)
- [ ] Mega menu promo stat "+38%"

**Pass 1 complete — stopped as instructed. Pass 2 (motion) is a separate prompt.**

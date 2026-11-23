# Owner's decisions log

Standing decisions from the owner. They override general best practice. Add new ones at the top with a date; never delete. Mark replaced ones as superseded.

## Design

| Date | Decision |
|---|---|
| 2026-11-23 | **Products redesign (current):** launch-style product cards: app icon (real logo, else a squircle in the product colour with a glyph; no letter tiles), name + category + status, promise, a large zoomed browser screen bleeding off the card (pans on hover), then up to 2 real facts (track record, numeric price; never "On request") + one action. Replaces the spec-sheet catalogue cards. |
| 2026-11-23 | **Our journey, round 4 (current):** calm two columns: story + compact badge pills left; the 3D glass "10" alone on an empty stage right (nothing overlapping it), lit by a pastel studio with dark panels for edge contrast and a soft colour pool behind it; figures in ONE frosted strip with hairline dividers below. Rejected: glass behind cards, glass behind text, boxed numeral, five separate cards. |
| 2026-11-23 | **Our journey, round 3 (superseded):** story + badges left; figures right as a frosted bento (lead figure full width); title figure "10+" in the indigo→violet gradient; the glass "10" is now a real-time three.js glass render (transmission + dispersion, `src/components/sections/glass/`), large behind the frosted figures and running off the right edge (behind the cards on phones). Supersedes the SVG glass numeral. |
| 2026-11-23 | **Recognition badges (owner-supplied, real):** Clutch Top Software Developers Auckland 2026 (official artwork, `public/media/badges/`), OpenAI Select Partner, Reviewed on Google (5 stars), 157+ five-star Envato reviews. Supersedes the first-draft badges and the "no OpenAI badge" note below. Each badge should link to its source once the owner supplies the URLs. |
| 2026-11-23 | **Our journey, round 2:** no box around the glass "10" (it floats freely); section background is a very soft lavender/sky/peach wash on white (owner request); trust badges under the story, real ones only (default Envato Author, Clutch); "ChatGPT partner" not shown (no such public OpenAI badge). |
| 2026-11-23 | **"At a glance" became "Our journey"** (same position, white card): glass "10" + short story + figure cards (6M+ users, 500+ projects, 60+ countries, 6 locations, 8+ products); the world map was removed (the hero globe covers geography). **Approved glass exception:** one purposeful glass numeral in this section only; the "no decorative glass" rule still applies everywhere else. |
| 2026-11-23 | **Hero type sizes:** announcement chip 12px; heading max 48px (desktop); line under the heading 18px (16px on phones); chat input 14px (16px on phones, so iOS Safari doesn't zoom on tap). |
| 2026-11-23 | **Foundation corrections (C1–C4):** `surface-soft` is warm `#f6f4f1`; `theme-light` stays per section (never global on `html`/`body`/`SiteShell`); Inter is the default body font, no `font-hero` class; the unused `CaseStudies.tsx` is deleted. |
| 2026-11-23 | **Foundation first:** synchronize the Design Handbook, semantic CSS tokens and AI design instructions before making homepage visual changes. Preserve existing legacy token utilities during this pass; do not mass-refactor components. |
| 2026-11-23 | **Homepage order, backgrounds alternate:** Hero → Brands *(default)* → Our journey *(white)* → Case studies *(default)* → Services *(white)* → Products *(default)* → Client reviews *(white)* → Human + AI *(default)* → Industries *(white)* → Tools & technology *(default)* → Team photos *(white)* → Engagement models *(default)* → Leadership *(white)* → FAQ *(default)* → Blog *(white)* → Let's talk + booking *(default)* → Footer. |
| 2026-11-23 | **No dark sections** on the homepage (dark Products and dark Let's talk were rejected). |
| 2026-11-23 | **No sub-heading line under section titles** (eyebrow + title only). |
| 2026-11-23 | **Products must not look like Services.** Rejected: dark showcase, tab switcher, bento-style suite. Accepted: catalogue cards with screen, app icon, status, one-line promise and spec sheet. |
| 2026-11-23 | **Nothing that "feels AI-made":** no glow blobs, gradient letter tiles, decorative glass. |
| 2026-11-23 | Hero: heading "Tell us what you want to build.", the chat box is the one main action, proof line + "Rather talk? Book a call" link under it, brand-coloured client logo stack. Rating shows only when real figures are entered. |
| 2026-11-23 | The FAQ uses the default background (white was tried first, then changed with the new order). |
| 2026-11-22 | FAQ and Blog sections under Engagement models; "Let's talk" closes the page. |
| 2026-11-23 | Homepage case-study cards get an expand button (top right of the media) that opens the full case study in a full-screen pop-up, same shell as the service pop-up. "Read the case study" still links to the page. |

## Content and honesty

| Date | Decision |
|---|---|
| 2026-11-22 | **Real data only.** No invented reviews, clients, people or numbers. Unconfirmed items are labelled placeholders or hidden. |
| 2026-11-22 | Leads are private; never sent to public datasets or third parties. |

## Working style

| Date | Decision |
|---|---|
| 2026-11-22 | The owner wants the AI to decide as "the most senior engineer, designer and business owner", explain plainly, and ask a few questions at the end. Big visual changes: show options first. |
| 2026-11-22 | Never commit or push unless asked. Never kill the owner's dev server on port 3000. Confirm before anything goes live (VPS, deploys, emails). |

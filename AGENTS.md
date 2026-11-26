# AGENTS.md: start here

Shared brief for every AI assistant (Claude Code, Codex, Cursor, Gemini, Copilot…) and new contributors working on the **Codeshaper website**.

## The project

Codeshaper is an AI-native software engineering agency (delivery hub in Dhaka, clients in 33 countries). This repo is its marketing website: **Next.js 15 (App Router), React 19, Tailwind CSS v4, TypeScript**. Content comes from a separate Laravel/Filament CMS (`../codeshaper-cms`) and is synced into `src/content/*.json`. The site exists to **win high-quality software projects**: build trust fast, show real proof, make booking a call easy.

## The AI workspace: `ai/`

Everything is written once in `ai/` (map and how to extend: [`ai/README.md`](ai/README.md)).

| Need | Read |
|---|---|
| Facts about the business, buyers, gaps | `ai/context/project.md` |
| Repos, content flow, folder map | `ai/context/architecture.md` |
| The owner's standing decisions (they win) | `ai/context/decisions.md` |
| Rules for every task | `ai/rules/global.md` |
| Rules per domain | `ai/rules/design.md` · `ai/rules/development.md` · `ai/rules/devops.md` |
| How to do it well | `ai/knowledge/<domain>/` (design handbook: `ai/knowledge/design/README.md`) |
| Roles | `ai/agents/` (`ui-designer`, `design-reviewer`) |
| Step-by-step workflows | `ai/skills/` (`design-section`, `design-review`) |

**Loading order:** this file → `ai/rules/global.md` → relevant `ai/context/*` (owner decisions are authoritative) → `ai/rules/<domain>.md` → the skill you follow → the knowledge it names. For design work, read `ai/context/decisions.md` before proposing or changing a visual direction; always read Design Handbook chapter 11 for token/global CSS work.

## Commands

| Task | Command |
|---|---|
| Dev server | `pnpm dev` (port 3000 is the owner's: never kill it; use 3100+ for your own) |
| Type check | `npx tsc --noEmit -p .` |
| All website checks | `pnpm check` (types, lint, tests, an isolated production build that leaves `.next` and `src/content` alone) |
| Pull CMS content | `pnpm content:sync` |
| Screenshots (design checks) | `node scripts/ai/screenshot.mjs --url "/?intro=off" --selector "#products-heading"` |
| CMS (in `../codeshaper-cms`) | `./dc php artisan test` · `./dc vendor/bin/pint -q` · back up before migrations: `./dc php artisan backup:run --only-db` |

## Five rules that never bend

1. **Real data only.** Never invent numbers, reviews, clients, people. Unknown → labelled placeholder or hidden.
2. **Follow the design system** in `ai/knowledge/design/`: no new colours, sizes or patterns without a reason; no dark homepage sections; no AI-looking decoration.
3. **Look before you claim:** screenshots for visual work, type check for code, tests for the CMS.
4. **Never commit, push, deploy or email** unless asked in this task. Never expose secrets or leads.
5. **Record new owner decisions** in `ai/context/decisions.md`.

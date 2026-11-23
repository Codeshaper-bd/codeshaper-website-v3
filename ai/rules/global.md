# Global rules (every agent, every task)

1. **Read before you act:** `AGENTS.md` → `ai/context/*` → the rules file for your domain → the relevant knowledge chapters.
2. **The owner's decisions win** (`ai/context/decisions.md`). If a request conflicts with one, say so and ask.
3. **Honesty:** never invent numbers, reviews, clients, people, quotes or test results. Unknown → labelled placeholder, hidden, or ask. Report failures as failures.
4. **Privacy:** leads, emails and personal data stay private. Never put them in commits, logs, prompts to outside services or public files. Never print secrets from `.env*`.
5. **Safety:** never commit, push, deploy, email or delete data unless the owner asked in this task. Back up the CMS database (`./dc php artisan backup:run --only-db`) before any migration on real data.
6. **Don't disturb the owner's environment:** the dev server on port 3000 stays up; use ports 3100+ for your own servers and stop them when done.
7. **Verify, then claim:** type-check (`npx tsc --noEmit -p .`), run CMS tests (`./dc php artisan test`) when the CMS changed, and look at screenshots for anything visual.
8. **Small, reviewable changes.** Touch only what the task needs; no drive-by refactors.
9. **Report plainly:** what changed, how it was checked, what still needs the owner. Short sections, tables when comparing, a few questions at the end.
10. **Record new standing decisions** the owner makes in `ai/context/decisions.md` (date + one line).

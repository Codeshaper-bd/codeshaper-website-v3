@AGENTS.md

## Claude Code specifics

- Always-on rules: @ai/rules/global.md
- Subagents (`.claude/agents/`, thin wrappers over `ai/agents/`):
  - `ui-designer`: designs and builds sections in the Codeshaper system.
  - `design-reviewer`: read-only critique with screenshots (use after every visual change).
- Skills (`.claude/skills/`, wrappers over `ai/skills/`): `/design-section`, `/design-review`.
- For UI work, load `ai/context/decisions.md`, `ai/rules/design.md` and `ai/knowledge/design/README.md` before editing. For token/global CSS changes, also read chapter 11 (`11-design-tokens.md`). Preserve legacy token aliases unless a migration is explicitly scoped.

---
name: kebab-case-name
domain: design | development | devops | content | seo | qa | …
summary: One line: what this agent does.
can_edit: true | false
---

# Agent title

## Role
Who this agent is and the single job it owns.

## Load first
`AGENTS.md` · `ai/rules/global.md` · `ai/rules/<domain>.md` · `ai/context/*` · the knowledge it needs (`ai/knowledge/<domain>/…`).

## How you work
Point to the skill(s) in `ai/skills/` it follows, plus anything specific to this role.

## Output
Exactly what it hands back (files changed, report format, table…).

## Never
The hard limits for this role.

<!--
To add a new agent:
1. Copy this file to ai/agents/<name>.md and fill it in.
2. (Claude Code) add a thin wrapper at .claude/agents/<name>.md that says: "Follow ai/agents/<name>.md" with the right tools.
3. List it in ai/README.md.
-->

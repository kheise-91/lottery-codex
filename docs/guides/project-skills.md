---
name: project-skills
title: Project Skills Guide
description: A comprehensive list of the skills (playbooks) used in this project, and which agent each one belongs to.
---

# Project Skills Guide

Skills are the playbooks that tell each agent exactly how to do its job. An agent loads its matching skill before starting work — the skill carries the method, the format, and the hard rules for that job. All skill files live in `.opencode/skills/`; clicking a skill name takes you to its file.

A skill is not a slash command: it is loaded by an agent (via the `skill` tool) while carrying out a command's work. Several skills ship a `templates/` directory holding the exact output formats to use (issue bodies, review reports, explorer reports, and more).

---

## Prerequisites

- Skill files live in `.opencode/skills/<name>/SKILL.md`.
- Each skill belongs to one agent (or one of an agent's jobs); the agent loads it before starting.
- Several skills reference a `templates/` directory inside the skill folder for exact output formats.
- Every skill reads the relevant `AGENTS.md` section (stack, architecture, conventions) first — the code always wins over the docs.

---

## Planning — `software-architect`

### [`decompose-sub-phase`](/.opencode/skills/decompose-sub-phase/SKILL.md)

How to break one roadmap sub-phase into 2–5 independently deliverable Gitea issues, each with a complete plan body (the issue body is the plan). Reads the sub-phase entry and any matching mockup, uses the `project-explorer` report the orchestrator provides as its codebase facts, and returns the milestone spec plus each issue in execution order — it never creates Gitea objects itself.

**Use when:** Invoked by `/create-sub-phase`.

---

## Exploration — `project-explorer`

### [`explore-codebase`](/.opencode/skills/explore-codebase/SKILL.md)

How to read a codebase area and return a structured report a writer can act on without re-reading the code. Strictly read-only: read `AGENTS.md` first, start wide then narrow, let the code win on any discrepancy, and stay inside the named area. Returns the report from the `explorer-report` template with real paths, names, and shapes.

**Use when:** Spawned by the orchestrator (or directly) to understand an area before planning or implementing — e.g. before `/create-sub-phase` decomposition.

---

## Implementation — `software-engineer`

### [`execute-issue-plan`](/.opencode/skills/execute-issue-plan/SKILL.md)

How to take an issue plan and a scope boundary and implement it correctly. Read the plan fully and re-read the Acceptance Criteria as the definition of done; confirm the scope boundary; read before editing and match the local style; stay surgical (no refactors, no "while I'm here" improvements); mockups are reference-only; then verify what can be verified and walk every acceptance criterion.

**Use when:** Invoked by `/complete-issue` to implement one issue.

---

## Review — `code-reviewer`

### [`code-review`](/.opencode/skills/code-review/SKILL.md)

How to review a diff (scoped mode) or an area (standalone mode) against the plan and `AGENTS.md`. Walks the acceptance criteria, conventions, correctness, security, and performance; tags every finding Critical / Warning / Suggestion; validates UI changes against the dev server via the Playwright MCP Server when it is available (optional); and ends with a single PASS/FAIL verdict (FAIL only on ≥1 Critical).

**Use when:** Invoked by `/complete-issue` (scoped) and by `/qa-review` (scoped, full diff).

---

## Design — `ui-designer`

The designer has no skill of its own — the full mockup spec (requirements gathering, HTML file format, reference bar, naming, variant rules) is inlined in the [`/generate-mockups`](/.opencode/commands/generate-mockups.md) command.

**Use when:** Invoked by `/generate-mockups`.

---

## Documentation — `docs-manager`

### [`docs-update`](/.opencode/skills/docs-update/SKILL.md)

How to keep `ROADMAP.md` status fields (checkboxes + milestone links: `[ ]` → `[-]` in progress → `[x]` complete), `README.md`, and `AGENTS.md` in sync after work lands, with writes limited to status fields and necessary corrections. Never writes the `ROADMAP.md` spec text, anything in `docs/`, or any source code. Two modes: command mode (limited, via `/create-sub-phase` and `/complete-sub-phase`) and ad-hoc mode (detailed updates).

**Use when:** Invoked by `/create-sub-phase` or `/complete-sub-phase` (command mode), or ad-hoc for detailed doc updates.

---

## Version Control — `git-manager`

### [`git-ops`](/.opencode/skills/git-ops/SKILL.md)

The exact branch, commit, milestone, issue, and PR formats for this repository, plus the sub-phase milestone gate (issues closed + no open PRs). All Gitea operations (PRs, issues, milestones, labels, comments) go through the Gitea MCP Server — never assume any other API/CLI exists. Merges are merge commits; never force-push, rebase, or squash.

**Use when:** Any version-control or Gitea work — branches, commits, pushes, issues, milestones, and PRs.

---

## Reference

### Available Skills

| Skill | Agent | Description |
|-------|-------|-------------|
| [`decompose-sub-phase`](/.opencode/skills/decompose-sub-phase/SKILL.md) | `software-architect` | Break a sub-phase into 2–5 issues with complete plan bodies |
| [`explore-codebase`](/.opencode/skills/explore-codebase/SKILL.md) | `project-explorer` | Read a codebase area; return a structured report |
| [`execute-issue-plan`](/.opencode/skills/execute-issue-plan/SKILL.md) | `software-engineer` | Implement one issue's plan within its scope boundary |
| [`code-review`](/.opencode/skills/code-review/SKILL.md) | `code-reviewer` | Review a diff/area; tag findings; PASS/FAIL verdict |
| [`docs-update`](/.opencode/skills/docs-update/SKILL.md) | `docs-manager` | Keep `ROADMAP.md` status, `README.md`, and `AGENTS.md` in sync |
| [`git-ops`](/.opencode/skills/git-ops/SKILL.md) | `git-manager` | Exact branch/commit/milestone/issue/PR formats; Gitea via MCP |
| [`command-summary`](/.opencode/skills/command-summary/SKILL.md) | (orchestrator) | The final summary table every command ends with |

### How Skills Map to the Workflow

1. **Scope** — `/generate-roadmap` and `/update-roadmap` carry the roadmap spec inline (no skill); `/review-roadmap` carries its critique checklist inline.
2. **Prepare** — the orchestrator spawns `project-explorer` (`explore-codebase`) for codebase facts; `software-architect` loads `decompose-sub-phase` and decomposes using that report; `docs-manager` (`docs-update`) marks the sub-phase in progress.
3. **Design** — `ui-designer` follows the mockup spec inlined in `/generate-mockups` (when a sub-phase has frontend work).
4. **Develop** — `software-engineer` loads `execute-issue-plan`; `code-reviewer` loads `code-review` for the scoped review and fix loop.
5. **Complete** — `docs-manager` loads `docs-update` to tick the checkbox and `git-manager` loads `git-ops` to gate the milestone and open the merge PR.
6. **QA** — `code-reviewer` loads `code-review` (full diff) for `/qa-review` at the end of a phase.
7. **Report** — every command ends by loading `command-summary`.

---

## Resources

- [Project Agents Guide](/docs/guides/project-agents.md)
- [Project Commands Guide](/docs/guides/project-commands.md)
- [Project Development Workflow Guide](/docs/guides/development-workflow.md)

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

### [`brainstorm-roadmap`](/.opencode/skills/brainstorm-roadmap/SKILL.md)

How to create or update `ROADMAP.md` from project goals. Structures the file as Project Goal, Current State vs Target, Conventions, and Phases; each sub-phase is a checkbox line with implementation-note bullets and a concrete, testable "Done when." Preserves completed (`[x]`) entries verbatim.

**Use when:** Invoked by `/brainstorm`.

---

### [`review-roadmap`](/.opencode/skills/review-roadmap/SKILL.md)

How to critique `ROADMAP.md` read-only. Returns a critique organized as Gaps, Ordering, Over-scoping, Tasks disguised as sub-phases, and Weak "Done when" lines, ending with a verdict on whether the roadmap is ready to decompose.

**Use when:** Invoked by `/review-roadmap`.

---

### [`decompose-sub-phase`](/.opencode/skills/decompose-sub-phase/SKILL.md)

How to break one roadmap sub-phase into 2–5 independently deliverable Gitea issues, each with a complete plan body (the issue body is the plan). Reads the sub-phase entry and any matching mockup, spawns `project-explorer` for codebase facts if needed, and returns the milestone spec plus each issue in execution order — it never creates Gitea objects itself.

**Use when:** Invoked by `/create-sub-phase`.

---

## Exploration — `project-explorer`

### [`explore-codebase`](/.opencode/skills/explore-codebase/SKILL.md)

How to read a codebase area and return a structured report a writer can act on without re-reading the code. Strictly read-only: read `AGENTS.md` first, start wide then narrow, let the code win on any discrepancy, and stay inside the named area. Returns the report from the `explorer-report` template with real paths, names, and shapes.

**Use when:** Spawned by `software-architect` (or directly) to understand an area before planning or implementing.

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

### [`mockups`](/.opencode/skills/mockups/SKILL.md)

How to turn a sub-phase's frontend requirements into `n` distinct, self-contained HTML mockups. Grounds each design in the project's existing design tokens and components, plans `n` variants that differ in structure or interaction philosophy (not cosmetics), and writes each as a complete standalone HTML file with the "VISUAL REFERENCE ONLY" warning and a reference bar, in the project's mockup directory.

**Use when:** Invoked by `/generate-mockups`.

---

## Documentation — `docs-manager`

### [`docs-update`](/.opencode/skills/docs-update/SKILL.md)

How to keep `ROADMAP.md` status fields (checkboxes + milestone links), `README.md`, and `AGENTS.md` in sync after work lands, with writes limited to status fields and necessary corrections. Never writes the `ROADMAP.md` spec text, anything in `docs/`, or any source code. Two modes: command mode (limited, via `/complete-sub-phase`) and ad-hoc mode (detailed updates).

**Use when:** Invoked by `/complete-sub-phase` (command mode) or ad-hoc for detailed doc updates.

---

## Version Control — `git-manager`

### [`git-ops`](/.opencode/skills/git-ops/SKILL.md)

The exact branch, commit, milestone, issue, and PR formats for this repository, plus the sub-phase milestone gate. All Gitea operations (PRs, issues, milestones, labels, comments) go through the Gitea MCP Server — never assume any other API/CLI exists. Merges are merge commits; never force-push, rebase, or squash.

**Use when:** Any version-control or Gitea work — branches, commits, pushes, issues, milestones, and PRs.

---

## Reference

### Available Skills

| Skill | Agent | Description |
|-------|-------|-------------|
| [`brainstorm-roadmap`](/.opencode/skills/brainstorm-roadmap/SKILL.md) | `software-architect` | Create/update `ROADMAP.md` from project goals |
| [`review-roadmap`](/.opencode/skills/review-roadmap/SKILL.md) | `software-architect` | Read-only critique of `ROADMAP.md` (gaps, ordering, over-scoping) |
| [`decompose-sub-phase`](/.opencode/skills/decompose-sub-phase/SKILL.md) | `software-architect` | Break a sub-phase into 2–5 issues with complete plan bodies |
| [`explore-codebase`](/.opencode/skills/explore-codebase/SKILL.md) | `project-explorer` | Read a codebase area; return a structured report |
| [`execute-issue-plan`](/.opencode/skills/execute-issue-plan/SKILL.md) | `software-engineer` | Implement one issue's plan within its scope boundary |
| [`code-review`](/.opencode/skills/code-review/SKILL.md) | `code-reviewer` | Review a diff/area; tag findings; PASS/FAIL verdict |
| [`mockups`](/.opencode/skills/mockups/SKILL.md) | `ui-designer` | Self-contained HTML mockups for a sub-phase |
| [`docs-update`](/.opencode/skills/docs-update/SKILL.md) | `docs-manager` | Keep `ROADMAP.md` status, `README.md`, and `AGENTS.md` in sync |
| [`git-ops`](/.opencode/skills/git-ops/SKILL.md) | `git-manager` | Exact branch/commit/milestone/issue/PR formats; Gitea via MCP |

### How Skills Map to the Workflow

1. **Scope** — `software-architect` loads `brainstorm-roadmap` then `review-roadmap`.
2. **Prepare** — `software-architect` loads `decompose-sub-phase` (spawning `project-explorer` / `explore-codebase` for facts as needed).
3. **Design** — `ui-designer` loads `mockups` (when a sub-phase has frontend work).
4. **Develop** — `software-engineer` loads `execute-issue-plan`; `code-reviewer` loads `code-review` for the scoped review and fix loop.
5. **QA** — `code-reviewer` loads `code-review` (full diff) for `/qa-review`.
6. **Complete** — `docs-manager` loads `docs-update` and `git-manager` loads `git-ops` to gate the milestone and open the merge PR.

---

## Resources

- [Project Agents Guide](/docs/guides/project-agents.md)
- [Project Commands Guide](/docs/guides/project-commands.md)
- [Project Development Workflow Guide](/docs/guides/development-workflow.md)

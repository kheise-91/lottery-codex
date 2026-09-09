---
name: project-commands
title: Project Commands Guide
description: A comprehensive list of the slash commands used in this project, and how to use each command.
---

# Project Commands Guide

Slash commands for the Gitea-integrated development workflow. Each command orchestrates the project's agents (and their skills) to carry out one stage of the workflow, running them sequentially. All command files live in `.opencode/commands/`; clicking a command name takes you to its file.

---

## Prerequisites

- Command files live in `.opencode/commands/`.
- A Gitea MCP server is configured (`GITEA_HOST` / `GITEA_ACCESS_TOKEN`) — required by every command that touches Gitea.
- `ROADMAP.md` in the project root (required by `/create-sub-phase`).
- `master` as the base branch for all phase branches.

---

## Scoping

### [`/brainstorm <goals>`](/.opencode/commands/brainstorm.md)

Creates or updates `ROADMAP.md` from the project's goals. The roadmap is the single source of truth for the rest of the project — phases → sub-phases, each sub-phase a checkbox line with implementation notes and a "Done when" definition. If the goals are ambiguous in a way that changes the phase structure, it returns questions rather than guessing.

**Use when:** Starting a new project, or regenerating/updating `ROADMAP.md` to reflect current goals.

---

### [`/review-roadmap`](/.opencode/commands/review-roadmap.md)

Read-only critique of `ROADMAP.md` — gaps, ordering, over-scoping, tasks disguised as sub-phases, and weak "Done when" lines. Ends with a verdict: is the roadmap ready to decompose?

**Use when:** Before decomposing, to confirm the roadmap is complete and correctly ordered.

---

## Task Preparation

### [`/generate-mockups [X.Y] [n]`](/.opencode/commands/generate-mockups.md)

Produces `n` (default 3) self-contained, fully-styled HTML mockup variants for a sub-phase's frontend. Each variant expresses a different structure or interaction philosophy rather than a cosmetic tweak. Written to the project's mockup directory; nothing else is modified.

**Use when:** Before implementing a sub-phase's frontend, to explore layout/structure/interaction options.

---

### [`/create-sub-phase [X.Y]`](/.opencode/commands/create-sub-phase.md)

Sets up a sub-phase: spawns `project-explorer` to report the codebase area, decomposes it into 2–5 Gitea issues (each with a complete plan body), creates the sub-phase branch `phase-X.Y` (off `phase-X` — creating and pushing `phase-X` from `master` if it does not exist yet, first sub-phase only), the `Phase X.Y` milestone, and each issue (label `Task`), then marks the sub-phase in progress in `ROADMAP.md` (`[-]` + the milestone link) and commits the change. The issue body is the plan — there are no local plan files.

**Use when:** Starting a sub-phase's work, after the roadmap is scoped.

---

## Development

### [`/complete-issue [N]`](/.opencode/commands/complete-issue.md)

Implements a single Gitea issue end to end: fetches the issue and creates its branch from the issue's label (`Task` → `task-N` off the sub-phase branch; `Bug` → `bug-N` off the phase branch), linking the issue to the branch via `ref`; implements the plan; runs a scoped review with a fix loop (max 3 rounds); commits; and opens a PR — to the sub-phase branch for `Task` or to the phase branch for `Bug`. Warnings/Suggestions are carried into the PR body; Critical findings block the PR.

**Use when:** Working a single issue from the sub-phase's task list.

---

## Quality & Completion

### [`/qa-review [X]`](/.opencode/commands/qa-review.md)

Full quality review of a finished phase (`X`, parent `master`). Captures the full diff, reviews it, and files each Critical finding as a Gitea `Bug` issue (no milestone — phases are tracked on kanban boards). Does not open PRs or merge — Criticals are fixed via `/complete-issue`, then re-run `/qa-review`.

**Use when:** All sub-phases of a phase are merged, before the manual phase → `master` PR.

---

### [`/complete-sub-phase [X.Y]`](/.opencode/commands/complete-sub-phase.md)

Closes out a finished sub-phase: runs the milestone gate (every issue on `Phase X.Y` closed and no open PR targeting the sub-phase branch), performs the limited docs update (tick the checkbox in `ROADMAP.md` — the milestone link was already set by `/create-sub-phase`), commits, sets the `Phase X.Y` milestone to closed, and opens the merge PR to `phase-X` (no milestone). Sub-phase only — completing a phase (`phase-X` → `master`) is done manually.

**Use when:** All of the sub-phase's issues are completed and their PRs approved, and the sub-phase is ready to merge into its phase branch.

---

## Reference

### Available Commands

| Command | Description |
|---------|-------------|
| [`/brainstorm <goals>`](/.opencode/commands/brainstorm.md) | Create or update `ROADMAP.md` from project goals |
| [`/review-roadmap`](/.opencode/commands/review-roadmap.md) | Read-only critique of `ROADMAP.md` (gaps, ordering, over-scoping) |
| [`/generate-mockups [X.Y] [n]`](/.opencode/commands/generate-mockups.md) | `n` self-contained HTML mockup variants for a sub-phase (default 3) |
| [`/create-sub-phase [X.Y]`](/.opencode/commands/create-sub-phase.md) | Decompose a sub-phase into Gitea issues; create branch, milestone, issues; mark it in progress in `ROADMAP.md` |
| [`/complete-issue [N]`](/.opencode/commands/complete-issue.md) | Implement, review (fix loop), commit, and PR one issue (label-driven branch/PR target) |
| [`/qa-review [X]`](/.opencode/commands/qa-review.md) | Full QA review of a finished phase; each Critical finding becomes a Gitea `Bug` issue |
| [`/complete-sub-phase [X.Y]`](/.opencode/commands/complete-sub-phase.md) | Milestone gate, limited docs update, the merge PR to the phase branch, and the `Phase X.Y` milestone set to closed |

### Naming Conventions

| Element | Format |
|---------|--------|
| Task-issue branch | `task-NNN` (NNN = the Gitea issue number) |
| Bug-issue branch | `bug-NNN` (NNN = the Gitea issue number) |
| Sub-phase branch | `phase-X.Y` |
| Phase branch | `phase-X` (created from `master` by `/create-sub-phase` if missing — first sub-phase only) |
| Milestone | `Phase X.Y` (one per sub-phase; no phase-level milestones) |
| Commit | `[Type-IssueNumber] Issue title` (Type = the issue label, e.g. `[Task-171]`, `[Bug-18]`); sub-phase work `[Phase-X.Y]`; `[DOCS]`/`[TOOLS]` are human-only |

### Workflow

1. **Scope** — `/brainstorm` then `/review-roadmap` to produce a decomposition-ready `ROADMAP.md`.
2. **Prepare** — `/generate-mockups` (optional) then `/create-sub-phase` to create the branch, milestone, and issues, and mark the sub-phase in progress in the roadmap.
3. **Develop** — `/complete-issue` for each issue (implement → review → fix → commit → PR).
4. **Complete** — when a sub-phase's issues are all merged, `/complete-sub-phase` to gate the milestone, update docs, set the milestone to closed, and open the merge PR to the phase branch.
5. **QA** — when all sub-phases of a phase are merged, `/qa-review`; file Criticals as `Bug` issues, fix them via `/complete-issue`, re-run until clean. (Phase → `master` is done manually.)

---

## Resources

- [Project Agents Guide](/docs/guides/project-agents.md)
- [Project Skills Guide](/docs/guides/project-skills.md)
- [Project Development Workflow Guide](/docs/guides/development-workflow.md)

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

Sets up a sub-phase: spawns `project-explorer` to report the codebase area, decomposes it into 2–5 Gitea issues (each with a complete plan body), and creates the sub-phase branch `phase-X-Y`, the `Phase X.Y` milestone, and each issue (label `Task`). The issue body is the plan — there are no local plan files.

**Use when:** Starting a sub-phase's work, after the roadmap is scoped.

---

## Development

### [`/complete-issue [N]`](/.opencode/commands/complete-issue.md)

Implements a single Gitea issue end to end: fetches the issue and creates its branch (linking the issue to the branch via `ref`), implements the plan, runs a scoped review with a fix loop (max 3 rounds), commits, and opens a PR to the sub-phase branch. Warnings/Suggestions are carried into the PR body; Critical findings block the PR.

**Use when:** Working a single issue from the sub-phase's task list.

---

## Quality & Completion

### [`/qa-review [X.Y | X]`](/.opencode/commands/qa-review.md)

Full quality review of a finished sub-phase (`X.Y`, parent `phase-X`) or phase (`X`, parent `master`). Captures the full diff, reviews it, and files each Critical finding as a Gitea `Bug` issue. Does not open PRs or merge — Criticals are fixed via `/complete-issue`, then re-run `/qa-review`.

**Use when:** All issues in a sub-phase (or a phase) are merged, before completing it.

---

### [`/complete-sub-phase [X.Y]`](/.opencode/commands/complete-sub-phase.md)

Closes out a finished sub-phase: runs the milestone gate (every issue on `Phase X.Y` closed), performs the limited docs update (tick the checkbox, add the milestone link in `ROADMAP.md`), commits, and opens the merge PR to `phase-X`. Sub-phase only — completing a phase (`phase-X` → `master`) is done manually.

**Use when:** `/qa-review` is clean and the sub-phase is ready to merge into its phase branch.

---

## Reference

### Available Commands

| Command | Description |
|---------|-------------|
| [`/brainstorm <goals>`](/.opencode/commands/brainstorm.md) | Create or update `ROADMAP.md` from project goals |
| [`/review-roadmap`](/.opencode/commands/review-roadmap.md) | Read-only critique of `ROADMAP.md` (gaps, ordering, over-scoping) |
| [`/generate-mockups [X.Y] [n]`](/.opencode/commands/generate-mockups.md) | `n` self-contained HTML mockup variants for a sub-phase (default 3) |
| [`/create-sub-phase [X.Y]`](/.opencode/commands/create-sub-phase.md) | Decompose a sub-phase into Gitea issues; create branch, milestone, issues |
| [`/complete-issue [N]`](/.opencode/commands/complete-issue.md) | Implement, review (fix loop), commit, and PR one issue |
| [`/qa-review [X.Y \| X]`](/.opencode/commands/qa-review.md) | Full QA review; each Critical finding becomes a Gitea `Bug` issue |
| [`/complete-sub-phase [X.Y]`](/.opencode/commands/complete-sub-phase.md) | Milestone gate, limited docs update, and the merge PR to the phase branch |

### Naming Conventions

| Element | Format |
|---------|--------|
| Issue branch | `YYYY-MM-DD-short-task-summary` (lowercase, hyphen-separated, max 5 words, no articles) |
| Sub-phase branch | `phase-X-Y` |
| Phase branch | `phase-X` |
| Milestone | `Phase X.Y` |
| Commit | `[Type-IssueNumber] Issue title` (Type = the issue label, e.g. `Task`, `Bug`) |

### Workflow

1. **Scope** — `/brainstorm` then `/review-roadmap` to produce a decomposition-ready `ROADMAP.md`.
2. **Prepare** — `/generate-mockups` (optional) then `/create-sub-phase` to create the branch, milestone, and issues.
3. **Develop** — `/complete-issue` for each issue (implement → review → fix → commit → PR).
4. **QA** — `/qa-review` when all issues are merged; file Criticals as `Bug` issues and fix them via `/complete-issue`, re-run until clean.
5. **Complete** — `/complete-sub-phase` to gate the milestone, update docs, and open the merge PR to the phase branch. (Phase → `master` is done manually.)

---

## Resources

- [Project Agents Guide](/docs/guides/project-agents.md)
- [Project Skills Guide](/docs/guides/project-skills.md)
- [Project Development Workflow Guide](/docs/guides/development-workflow.md)

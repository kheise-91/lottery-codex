---
name: claude-skills
title: Claude Skills Guide
description: A comprehensive list of custom skills used with Claude Code in this project, and how to use each skill.
---

# Claude Skills Guide

Custom Claude Code slash commands for Gitea-integrated development workflows.

All skill files live in `/.claude/skills/`. Clicking the skill name will take you to that skill file.

---

## Prerequisites

- Gitea MCP v1.3.0+ configured in Claude Code (`GITEA_ACCESS_TOKEN` and `GITEA_HOST` set as MCP env vars)
- `ROADMAP.md` in the project root (required by `/create-sub-phase`)
- `master` branch as the base for all sub-phase branches

---

## Scoping Skills

### [`/create-project-roadmap [projectDetails]`](/.claude/skills/create-project-roadmap/SKILL.md)

Analyzes the existing project and generates a complete `ROADMAP.md` that reflects both the current implementation and the requested application goals. The roadmap is the single source of truth for the remainder of the project. A list of required and optional inputs is shown below.

| Field | Required | Notes |
| ----- | -------- | ----- |
| `Description` | Yes | 2–4 sentences: what the app does, who uses it, what problem it solves |
| `Frontend` | No | e.g. React + Tailwind, Vue, plain HTML |
| `Backend` | No | e.g. PHP, Node, Python/FastAPI, none |
| `Database` | No | e.g. SQLite, PostgreSQL, none |
| `Other` | No | Auth providers, external APIs, third-party services |
| `Features` | Yes | List of MVP features |

If any optional fields are missing, the skill will suggest options and ask for your preference.

**Use when:** Starting a new project or regenerating `ROADMAP.md` to reflect current state.

---

### [`/review-project-roadmap`](/.claude/skills/review-project-roadmap/SKILL.md)

Critically reviews `ROADMAP.md` as an independent pass, flagging gaps, sequencing problems, and anything misscoped. Does not modify any files. This review includes:
- Missing or underestimated work
- Sequencing problems
- Phases or sub-phases doing too much
- Decisions deferred too late
- Tasks masquerading as sub-phases
- Scope and naming accuracy

**Use when:** After creating a project roadmap.

---

### [`/generate-mockups [subPhase] [numberOfMockups]`](/.claude/skills/generate-mockups/SKILL.md)

Reads the description from a sub-phase in the roadmap, spawns the `frontend-explorer` agent
to analyze existing frontend visual design conventions, then generates the specified number of
distinct mockup variants (defaults to 3) as HTML files. Each variant differs in structure or interaction pattern — not just colors or sizes.

Returns a summary table of all mockup HTML files created, with a description of each variation.

**Use when:** You need ideas of how to implement new, complex UI/UX changes (must run before creating Gitea issues)

---

### [`/create-sub-phase [subPhase]`](/.claude/skills/create-sub-phase/SKILL.md)

Sets up a sub-phase from `ROADMAP.md`: creates the sub-phase branch, Gitea milestone, Gitea issues, and individual issue branches based on the provided sub-phase number. No application files are edited — this skill only sets up work in Gitea.

Returns a summary table of all issues and their branches when done.

**Use when:** Starting a new sub-phase. Run once before any development begins.

---

## Development Skills

### [`/complete-issue [issue]`](/.claude/skills/complete-issue/SKILL.md)

Fully autonomous mode for implementation, review, and documentation. Works on a Gitea issue from start to finish without pausing for user confirmation (except the final commit/push/PR step which always requires explicit go-ahead). All work is isolated to a pre-created branch so it is safe to proceed without verification.

Stops with an error if no pre-created branch comment is found on the issue.

**Use when:** The issue is straightforward and you want zero interruptions.

---

### [`/qa-review`](/.claude/skills/qa-review/SKILL.md)

Runs a comprehensive read-only QA review of all changes in the current sub-phase branch
compared to master. Detects which parts of the codebase changed, spawns only the relevant reviewer agents (backend-reviewer, frontend-reviewer, devops-reviewer), then synthesizes their reports into one summary.

Returns a summary report of the review.

**Use when:** Completing a sub-phase implementation before opening a pull request.

---

## Documentation Skills

### [`/update-documentation`](/.claude/skills/update-documentation/SKILL.md)

Spawns three explorer agents sequentially (`devops-explorer`, `backend-explorer`, `frontend-explorer`) to summarize each area of the codebase, then spawns the `documenter` agent to update all project documentation based on their summaries. Updates `README.md` and relevant documentation found in `docs/api/`, `docs/components/`, `docs/hooks/`, `docs/services/`, and `docs/infrastructure/`.

**Use when:** After all sub-phases are merged into `master` and the project is feature-complete.
Can also be run after any major phase to keep documentation up-to-date.

---

## Reference

### Available Skills

| Skill Name | Description | Recommended Models |
| ---------- | ----------- | ------------------ |
| `/create-project-roadmap` | Analyzes the existing project and generates a complete `ROADMAP.md` reflecting current implementation and requested goals | **Deep-Reasoner** / Swift-Reasoner |
| `/review-project-roadmap` | Critically reviews `ROADMAP.md` as an independent pass, flagging gaps, sequencing problems, and anything misscoped. Does not modify any files | **Swift-Reasoner** / Precise-Coder |
| `/generate-mockups` | Reads a sub-phase from ROADMAP.md, extracts frontend design requirements using the `frontend-explorer` subagent, and generates HTML mockup variants for comparison before implementation | **Precise-Coder** / Swift-Reasoner |
| `/create-sub-phase` | Sets up sub-phase - creates Gitea issues and branches based on sub-phase in project roadmap | **Precise-Coder** / Deep-Reasoner |
| `/complete-issue` | Fully autonomous mode - works on a Gitea issue from start to finish without pausing for user confirmation | **Quick-Coder** / Precise-Coder |
| `/qa-review` | Runs a comprehensive read-only QA review of all changes in the current sub-phase branch compared to master | **Precise-Coder** / Deep-Reasoner |
| `/update-documentation` | Updates project `README.md` and documentation based on current code base | **Quick-Coder** / Coder-Agent | 

### Naming Conventions

| Name | Format | Example |
| ---- | ------ | ------- |
| Sub-phase branch | `phase-X-Y` | `phase-3-9` |
| Issue branch | `YYYY-MM-DD-short-summary` | `2026-05-25-add-notes-tooltip` |
| Milestone | `Phase X.Y` | `Phase 3.9` |
| Issue → PR target | Sub-phase branch | `phase-3-9` |
| Sub-phase → final merge | `phase-X-Y` → `master` | Done manually |

### Workflow

1. **Scoping:** start with `/create-project-roadmap` and `/review-project-roadmap` to build `ROADMAP.md`. All development work will come from this file.
2. **UI/UX Mockup (optional):** use `/generate-mockups` to create one or more HTML mockups for ideas on implementing more complex UI features.
3. **Task Creation:** Use `/create-sub-phase` to create Gitea issues, branches, and milestones.
4. **Development:** Use `/complete-issue` to have Claude work an issue from start to finish and open a PR. Use `/qa-review` in the sub-phase branch when all issues have been completed.
5. **Document Changes:** use `/update-documentation` after each phase or sub-phase to keep documentation files up-to-date.

---

## Resources

- [AI Models Guide](/docs/guides/ai-models.md)
- [Claude Agents Guide](/docs/guides/claude-agents.md)
- [Project Development Workflow Guide](/docs/guides/development-workflow.md)
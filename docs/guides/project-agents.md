---
name: project-agents
title: Project Agents Guide
description: A comprehensive list of the agents used in this project, and the role each agent plays.
---

# Project Agents Guide

Agents are specialized subagents configured via `.opencode/agents/*.md`. Each is tailored for a specific role in the workflow — planning, implementation, exploration, review, design, documentation, or version control. Each agent loads its matching skill (playbook) before starting. Clicking an agent name takes you to its file.

---

## Prerequisites

- Agent files live in `.opencode/agents/`
- Every agent is `mode: subagent`, spawned via the `task` tool with the matching `subagent_type`
- All agents run sequentially (never in parallel) — local resource constraints
- Each agent loads its matching skill (playbook) in `.opencode/skills/` before starting

---

## Available Agents

### Planning

#### [`software-architect`](/.opencode/agents/software-architect.md)

The planning agent, where decomposition quality matters more than speed. Drafts and updates `ROADMAP.md`, critiques it, and breaks sub-phases into Gitea issues with complete plan bodies. Never implements code.

**Key Responsibilities:**
- **Brainstorm** — draft/update `ROADMAP.md` from project goals (phases → sub-phases, each with a "Done when" definition).
- **Review** — read-only critique of `ROADMAP.md` (gaps, ordering, over-scoping).
- **Decompose** — break one sub-phase into 2–5 independently deliverable Gitea issues, each with a complete plan body.
- Does not spawn subagents; the orchestrator provides a `project-explorer` report as its codebase facts.
- The only agent that may write `ROADMAP.md`; returns the Gitea specs (milestone + issues) to the orchestrator rather than creating them.

**Use when:** `/brainstorm`, `/review-roadmap`, and `/create-sub-phase` work.

---

### Implementation

#### [`software-engineer`](/.opencode/agents/software-engineer.md)

The implementation agent. Takes a complete issue plan and a scope boundary (directory + stack) and makes the code match the plan — nothing more, nothing less.

**Key Responsibilities:**
- Treats the issue body's Acceptance Criteria as the definition of done.
- Writes only inside the scope boundary passed at spawn time; stops and reports if a change is needed outside it.
- Reads before editing; matches the local style of sibling files.
- Follows the relevant `AGENTS.md` conventions section exactly (Backend / Frontend / DevOps).
- Surgical: no refactors, reformatting, or "while I'm here" improvements.
- Verifies what it can (lint/build per stack) and reports how each acceptance criterion is met.

**Use when:** Any code implementation work — backend, frontend, or infrastructure.

---

### Exploration

#### [`project-explorer`](/.opencode/agents/project-explorer.md)

Read-only structured codebase analysis. Answers "what does the codebase look like in this area, and what must new work match?" — it reads code, never changes it.

**Key Responsibilities:**
- Starts from the `AGENTS.md` conventions, then verifies against the actual code (the code wins on any conflict).
- Maps the directory structure and traces how pieces connect (imports, routing, service calls).
- Stays inside the area the orchestrator named.
- Returns a structured report from its template so a writer can match existing patterns without re-reading the code.
- Strictly read-only: no writes, no shell commands.

**Use when:** Onboarding, or to understand structure, conventions, or a specific area before planning or implementing.

---

### Review

#### [`code-reviewer`](/.opencode/agents/code-reviewer.md)

Read-only code review of a diff (scoped mode) or an area of the codebase (standalone mode). Verifies a change against its plan and the conventions in `AGENTS.md`.

**Key Responsibilities:**
- **Scoped mode** — reviews only the given diff/file list; **standalone mode** — reviews the named area in its current state.
- Walks every acceptance criterion (unmet = Critical), then checks conventions, correctness, security, and performance.
- Tags every finding Critical / Warning / Suggestion; ends with a single PASS/FAIL verdict (FAIL only on ≥1 Critical).
- Uses the Playwright MCP Server to validate UI changes against the dev server when it is available (optional).
- Never edits code — read-only.

**Use when:** After implementation, to verify a change against its plan.

---

### Design

#### [`ui-designer`](/.opencode/agents/ui-designer.md)

The design agent. Turns a roadmap sub-phase's frontend requirements into n distinct, self-contained HTML mockup files that open and work in a browser.

**Key Responsibilities:**
- Grounds each design in the project's existing design tokens and components (matches the app's visual language; does not invent a new look).
- Plans n variants that differ in structure or interaction philosophy, not cosmetics.
- Produces complete standalone HTML (Tailwind via CDN, inline vanilla JS, no build step).
- Every file carries the "VISUAL REFERENCE ONLY" warning header and a reference bar.
- Writes exclusively to the project's mockup directory; never touches source files.

**Use when:** `/generate-mockups` work only.

---

### Coordination

#### [`docs-manager`](/.opencode/agents/docs-manager.md)

The documentation agent. Keeps the `ROADMAP.md` status fields, `README.md`, and `AGENTS.md` in sync with the code after work lands.

**Key Responsibilities:**
- Ticks completed sub-phase checkboxes and adds the Gitea milestone link in `ROADMAP.md` (status fields only).
- Updates `AGENTS.md` Key Context / Decisions Log when stale; `README.md` only when a statement is factually wrong.
- Never writes the `ROADMAP.md` spec text, anything in `docs/`, or any source code.
- Two modes: command mode (limited, via `/complete-sub-phase`) and ad-hoc mode (detailed updates).
- No execution: no builds, tests, or code.

**Use when:** After a sub-phase (or phase) is completed, or ad-hoc when a doc needs a detailed update.

#### [`git-manager`](/.opencode/agents/git-manager.md)

The version-control agent. Performs all git and Gitea operations — branches, commits, pushes, issues, milestones, labels, and pull requests.

**Key Responsibilities:**
- Creates/checks out branches (four tiers), commits, and pushes.
- Creates Gitea objects (milestones, issues, labels) and opens PRs.
- ALL Gitea operations go through the Gitea MCP Server — never assume any other API/CLI exists.
- Follows the exact branch/commit/milestone/issue/PR formats in its skill and in `AGENTS.md`.
- Merges are merge commits; never force-push, rebase, or squash.

**Use when:** Any version-control or Gitea work.

---

## Reference

### Available Agents

| Agent | Role | Description |
|-------|------|-------------|
| [`software-architect`](/.opencode/agents/software-architect.md) | Planning | Drafts/updates/critiques `ROADMAP.md` and decomposes sub-phases into Gitea issues |
| [`project-explorer`](/.opencode/agents/project-explorer.md) | Exploration | Read-only structured codebase analysis; returns a templated report |
| [`software-engineer`](/.opencode/agents/software-engineer.md) | Implementation | Implements a single issue's plan within its scope boundary |
| [`code-reviewer`](/.opencode/agents/code-reviewer.md) | Review | Read-only review of a diff or area; PASS/FAIL verdict |
| [`ui-designer`](/.opencode/agents/ui-designer.md) | Design | Self-contained HTML mockups for a sub-phase |
| [`docs-manager`](/.opencode/agents/docs-manager.md) | Documentation | Keeps `ROADMAP.md` status, `README.md`, and `AGENTS.md` in sync |
| [`git-manager`](/.opencode/agents/git-manager.md) | Version Control | All git and Gitea operations via the Gitea MCP Server |

### Shared conventions

- Every agent follows `AGENTS.md` (stack, architecture, conventions); the code wins over docs on any conflict.
- `docs/` is 100% human-maintained — no agent writes it.
- Plans live in Gitea issue bodies (the issue body is the plan).
- All agents run sequentially (never in parallel).

### Workflow

1. **Plan** — `software-architect` drafts/reviews `ROADMAP.md` and decomposes a sub-phase into issues.
2. **Explore** — the orchestrator spawns `project-explorer` to report the relevant codebase area.
3. **Implement** — `software-engineer` implements one issue's plan within its scope boundary.
4. **Review** — `code-reviewer` verifies the change against the plan (Critical findings go back to the engineer).
5. **Design** — `ui-designer` produces mockups for a sub-phase's frontend (when needed).
6. **Coordinate** — `git-manager` handles branches/commits/issues/PRs; `docs-manager` keeps the living docs in sync.

---

## Resources

- [Project Commands Guide](/docs/guides/project-commands.md)
- [Project Skills Guide](/docs/guides/project-skills.md)
- [Project Development Workflow Guide](/docs/guides/development-workflow.md)

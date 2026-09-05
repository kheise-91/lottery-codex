---
name: qa-review
description: Full quality review of a finished sub-phase or phase; Critical findings become Gitea Bug issues
model: llama.cpp/Enoch-II
---

QA review of $1. If no sub-phase or phase was given, ask the user what to review and stop.
- If $1 is `X.Y`, this is a **sub-phase** review; the parent is `phase-X`.
- If $1 is `X`, this is a **phase** review; the parent is `master`.

Refer to @AGENTS.md for the workflow formats. Spawn agents sequentially, one at a time. Do not edit any files yourself.

Current branch: !`git branch --show-current`

**Step 1 — Branch gate.**
Confirm the current branch is `phase-X-Y` (sub-phase review) or `phase-X` (phase review). If not, STOP and tell the user which branch is checked out and which is required.

**Step 2 — Capture the diff.**
Run `git diff <parent>...HEAD` via bash (parent per above); keep the output — it is the review scope.

**Step 3 — Review.**
Spawn the @code-reviewer subagent in **scoped mode** with the full diff, the sub-phase/phase context from ROADMAP.md, and "Use your `code-review` skill." If the change touches the UI, tell it to check whether the Playwright MCP server is available and, if so, validate against the dev server (URL per @AGENTS.md).

**Step 4 — File issues for Critical findings.**
For each **Critical** finding, spawn the @git-manager subagent to create a Gitea issue: label `Bug`, the milestone of the sub-phase the finding belongs to, body = the finding (file/line, what is broken, how to verify the fix). Do not create issues for Warnings or Suggestions.

**Step 5 — Report.**
Return a summary per @.opencode/templates/command-summary.md: the verdict, the Critical issues created (numbers), and the Warnings/Suggestions carried forward. Do not open PRs or merge anything — Critical issues are fixed via `/complete-issue`, then re-run `/qa-review`.

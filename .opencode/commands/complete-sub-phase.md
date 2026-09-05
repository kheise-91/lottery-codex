---
name: complete-sub-phase
description: Close out a finished sub-phase — milestone gate, limited docs update, and the merge PR to the phase branch
model: llama.cpp/Enoch
---

Complete $1. If no sub-phase was given, ask the user what to complete and stop. This command completes a **sub-phase** (`X.Y`) only — completing a phase (`phase-X` → `master`) is done manually.
- The branch is `phase-X-Y` and the PR goes to `phase-X`.

Refer to @AGENTS.md for the workflow formats. Spawn agents sequentially, one at a time. Do not edit any files yourself.

Current branch: !`git branch --show-current`

**Step 1 — Branch + milestone gate.**
Confirm the current branch is `phase-X-Y`. Then spawn the @git-manager subagent: verify via the Gitea MCP Server that **every issue on the milestone** (`Phase X.Y`) is **closed**. It returns the gate result plus the milestone number/URL. If any issue is open, STOP and report the open issue numbers — do not update docs or open a PR.

**Step 2 — Docs update (limited).**
Spawn the @docs-manager subagent in **command mode** with:
- The completed sub-phase number and title.
- The milestone number/URL for the ROADMAP link (from the gate report).
It ticks the checkbox and adds the milestone link in ROADMAP.md; it touches README.md/AGENTS.md only if the completed work makes a statement in them factually wrong (small, targeted edits). It never writes docs/ or source code.

**Step 3 — Commit docs and open the PR.**
Spawn the @git-manager subagent to:
- Commit the doc changes with message `[DOCS] Complete $1`.
- Push the branch.
- Open a pull request to `phase-X`, body per the git-ops skill's `pr-body` template summarizing the completion (issues closed, doc changes).
- Return the PR URL.

**Step 4 — Report.**
Return a summary per @.opencode/templates/command-summary.md: the gate result, the doc files updated, and the PR URL. The sub-phase is now complete — review and merge the PR to land it.

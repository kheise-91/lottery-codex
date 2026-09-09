---
name: complete-sub-phase
description: Close out a finished sub-phase — milestone gate, limited docs update, and the merge PR to the phase branch
model: llama.cpp/Enoch
---

Complete $1. This command completes a **sub-phase** (`$1`) only — completing a phase (`phase-X` → `master`) is done manually.
- The branch is `phase-$1` and the PR goes to `phase-X`.

Refer to @AGENTS.md for the workflow formats. Spawn agents sequentially, one at a time. Do not edit any files yourself.

**Step 1 — Branch + milestone gate.**
Spawn the @git-manager subagent: if `phase-$1` is not checked out, it checks it out, fetches from origin, and pulls. It then verifies via the Gitea MCP Server that **every issue on the milestone** (`Phase $1`) is **closed** and **no pull request targeting the sub-phase branch is open**. It returns the gate result plus the milestone number/URL. If any issue is open or any PR is open, STOP and report the open numbers — do not update docs or open a PR.

**Step 2 — Docs update (limited).**
Spawn the @docs-manager subagent in **command mode** with:
- The completed sub-phase number and title.
- The milestone number/URL from the gate report (for reference — the ROADMAP link was already set by `/create-sub-phase`).
It ticks the checkbox in ROADMAP.md (`[-]` → `[x]`) and adds the milestone link if it doesn't exist yet; it touches README.md/AGENTS.md only if the completed work makes a statement in them factually wrong (small, targeted edits). It never writes docs/ or source code.

**Step 3 — Commit docs and open the PR.**
Spawn the @git-manager subagent to:
- Commit the doc changes with message `[Phase-$1] Complete $1`.
- Push the branch.
- Set the `Phase $1` milestone state to "closed".
- Open a pull request to `phase-X` (no milestone), body per the git-ops skill's `pr-body` template summarizing the completion (issues closed, doc changes).
- Return the PR URL.

**Step 4 — Report.**
Return a summary per @.opencode/templates/command-summary.md: the gate result, the doc files updated, and the PR URL. The sub-phase is now complete — review and merge the PR to land it.

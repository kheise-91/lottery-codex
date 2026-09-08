---
name: create-sub-phase
description: Decompose a roadmap sub-phase into Gitea issues, set up its branch and milestone, and mark it in progress in ROADMAP.md
model: llama.cpp/Enoch-II
---

Set up sub-phase $1 of @ROADMAP.md. If no sub-phase number was given, ask the user which sub-phase to set up and stop.

Refer to @AGENTS.md for the workflow formats (branch tiers, milestone/issue conventions). Spawn agents sequentially, one at a time. Do not edit any files yourself.

**Step 1 — Explore.**
Read the sub-phase $1 entry from @ROADMAP.md (title, implementation-note bullets, "Done when"). Spawn the @project-explorer subagent to report on the codebase area this sub-phase touches: pass it the sub-phase title and implementation notes, and name the files/layers to examine. It returns a structured report on the current state (real file paths, names, shapes).

**Step 2 — Decompose.**
Spawn @software-architect with its decompose job (the `decompose-sub-phase` skill): the sub-phase number $1 and the explorer report from Step 1. It reads the ROADMAP entry (and any matching mockup) and uses the explorer report as its codebase facts. It returns the milestone spec plus 2–5 ordered issue specs with complete plan bodies.
- If it reports a mockup/spec conflict, or says the sub-phase is not decomposable as written, STOP and present the issue to the user. Do not proceed.

**Step 3 — Create Gitea objects.**
Spawn the @git-manager subagent and hand it the milestone spec and the ordered issue specs verbatim. It creates the sub-phase branch `phase-X.Y` off `phase-X` (if `phase-X` does not exist, STOP and report it — phase branches are created manually), the milestone `Phase X.Y` (reusing it if it exists), and each issue (label `Task`, plan body, milestone attached). It returns the branch name, the milestone number/URL, and every issue number.

**Step 4 — Docs update (in progress).**
Spawn the @docs-manager subagent in **command mode** with the sub-phase number, title, and the milestone URL from Step 3. It marks the sub-phase in progress in ROADMAP.md: checkbox `[-]` and the title linked to the milestone URL (format per its `roadmap-entry` template). Then commit and push the change yourself with the message `[Phase-$1] Starting $1` — no Gitea work is involved, so do not spawn git-manager.

**Step 5 — Report.**
Return a summary per @.opencode/templates/command-summary.md: the branch, the milestone, and the issue list (number + title) in execution order, ready for `/complete-issue`.

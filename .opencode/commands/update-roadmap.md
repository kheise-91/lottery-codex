---
name: update-roadmap
description: Update an existing ROADMAP.md — interview the user first, then apply the changes
model: llama.cpp/Enoch-III
agent: software-architect
---

You are invoked for the **update** job: modify the existing `ROADMAP.md`. You may write to `ROADMAP.md` for this job only. Refer to @AGENTS.md for the project's goal, stack, and conventions.

Change requests: $ARGUMENTS

## Stage 1 — Interview

Read the current `ROADMAP.md` first. Then interview the user with the `question` tool using the fixed checklist below. Skip any question that the change requests above or the existing roadmap already answers.

1. **What changed** — new goals, dropped scope, or a completed milestone to reflect?
2. **Where** — which phases/sub-phases are added, removed, or reworded?
3. **Status changes** — any sub-phase whose checkbox should move (`[ ]` → `[-]` / `[x]`) and why?
4. **What stays untouched** — confirm the completed (`[x]`) entries that must be preserved verbatim.

End the interview by rendering a requirements summary — each change as a concrete edit (which entry, what becomes of it). Ask the user to confirm it before you proceed; wait for explicit confirmation.

## Stage 2 — Apply the changes

Edit `ROADMAP.md` per the confirmed summary:

- Preserve any existing completed (`[x]`) entries verbatim. Do not renumber or reword them.
- Keep "Done when" lines concrete and verifiable — never "works" or "is complete".
- Sub-phases carry at least 2 tasks (one Gitea issue each) and ~5 as a soft upper limit; each entry is a checkbox line with implementation-note bullets and a `**Done when:**` definition.

## Stage 3 — Report

Load and use the `command-summary` skill to return a summary of the phases and sub-phases you added, changed, or closed.

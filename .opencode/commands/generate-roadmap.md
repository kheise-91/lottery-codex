---
name: generate-roadmap
description: Create ROADMAP.md from scratch — interview the user first, then write the full roadmap
model: llama.cpp/Enoch-III
agent: software-architect
---

You are invoked for the **generate** job: create `ROADMAP.md` from scratch. You may write to `ROADMAP.md` for this job only. Refer to @AGENTS.md for the project's goal, stack, and conventions.

Project goals: $ARGUMENTS

## Stage 1 — Interview

Before writing anything, interview the user with the `question` tool using the fixed checklist below. Skip any question that the goals above or @AGENTS.md already answers.

1. **Outcome** — what does a finished project look like? Who uses it and how?
2. **Scope boundaries** — what is explicitly out of scope?
3. **Constraints** — stack, deployment, performance, or compatibility limits beyond what AGENTS.md states.
4. **Current state** — what already exists that the roadmap must account for (working features, known gaps)?
5. **Phasing expectations** — how big should phases be? Any ordering requirements (e.g. backend before frontend)?

End the interview by rendering a requirements summary — every answer mapped to the phase structure you intend to write. Ask the user to confirm it before you proceed; wait for explicit confirmation.

## Stage 2 — Write ROADMAP.md

Structure the roadmap as:

- **Project Goal** — one paragraph on the outcome.
- **Current State vs Target** — what exists now vs what the goal requires.
- **Conventions** — the phase / sub-phase / task definitions (copy the existing block if present; do not reword it).
- **Phases** — top-level workstreams, each a `phase-X` branch.
- Under each phase, **sub-phases** — user stories, each with at least 2 tasks (one Gitea issue each) and ~5 as a soft upper limit.

Each sub-phase entry is a checkbox line with an indented body and a "Done when" definition:

```md
- [ ] **X.Y — Short sub-phase title**
   - Implementation note bullet (specific files, components, endpoints)
   - Another note bullet

   **Done when:** [a testable, observable condition]
```

Keep "Done when" lines concrete and verifiable — never "works" or "is complete".

## Stage 3 — Report

Load and use the `command-summary` skill to return a summary of all the work completed.

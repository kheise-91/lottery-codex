---
name: brainstorm-roadmap
description: Playbook for the software-architect agent's brainstorm job. How to create or update ROADMAP.md from project goals.
---

# Brainstorm Roadmap

You may write to `ROADMAP.md` for this job only.

1. Read the project goals the orchestrator passed, plus the current `ROADMAP.md` (if it exists) and `AGENTS.md` (stack, architecture, conventions).
2. Structure the roadmap as:
   - **Project Goal** — one paragraph on the outcome.
   - **Current State vs Target** — what exists now vs what the goal requires.
   - **Conventions** — the phase / sub-phase / task definitions (copy the existing block if present; do not reword it).
   - **Phases** — top-level workstreams, each a `phase-X` branch.
   - Under each phase, **sub-phases** — user stories, each with at least 2 tasks (one Gitea issue each) and ~5 as a soft upper limit.
3. Each sub-phase entry is a checkbox line with an indented body and a "Done when" definition:

   ```md
   - [ ] **X.Y — Short sub-phase title**
      - Implementation note bullet (specific files, components, endpoints)
      - Another note bullet

      **Done when:** [a testable, observable condition]
   ```
4. Keep "Done when" lines concrete and verifiable — never "works" or "is complete".
5. Preserve any existing completed (`[x]`) entries verbatim. Do not renumber or reword them.
6. Write the file, then return a summary of the phases and sub-phases you added or changed.

---
name: decompose-sub-phase
description: Playbook for the software-architect agent's decompose job. How to break one roadmap sub-phase into 2-5 Gitea issues with complete plan bodies.
---

# Decompose Sub-Phase

You break one roadmap sub-phase into 2–5 independently deliverable Gitea issues. Do not create any Gitea objects yourself — return the specs; the orchestrator hands them to `git-manager`.

1. Read the target sub-phase entry in `ROADMAP.md`: title, every implementation-note bullet, and the "Done when" line.
2. Check the project's mockup directory (per `AGENTS.md`) for a mockup matching this sub-phase (`phase-X-Y-*.html`). If one exists, read it for layout/structure/interaction intent. **If the mockup conflicts with the spec, flag the conflict explicitly** — do not silently resolve it. For structure, the ROADMAP description wins over the mockup.
3. If you need codebase facts (what exists, what a file currently contains), spawn `project-explorer` and wait for its report before decomposing.
4. Break the sub-phase into **at least 2 and at most ~5** independently deliverable tasks. Rules:
   - Each task is one focused session — roughly half a day to two days of work.
   - Sequence tasks so earlier ones do not depend on later ones. If a hard dependency exists, note it in the task's Notes.
   - If the description names specific files or layers, give each distinct file/layer its own task.
   - Acceptance criteria must be concrete and testable — never vague.
   - Do not invent scope beyond what the sub-phase description states.
5. For each task, write a complete issue body using the `templates/issue-body.md` format. The body **is** the plan — the engineer will implement from it without any other planning artifact.
6. Return to the orchestrator, in execution order:
   - The milestone spec (title `Phase X.Y` and its description block — see the format in the `git-ops` skill).
   - Each issue: a short imperative **title** plus the **full body**.

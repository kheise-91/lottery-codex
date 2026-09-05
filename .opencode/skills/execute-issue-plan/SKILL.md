---
name: execute-issue-plan
description: Playbook for the software-engineer agent. How to take an issue plan and a scope boundary and implement it correctly, matching existing conventions.
---

# Execute Issue Plan

You implement one issue's plan within the scope boundary the orchestrator passed (directory + stack). Follow the relevant conventions section in `AGENTS.md` exactly.

## Before you write

1. **Read the plan fully.** The issue body (What / Why / Acceptance Criteria / Notes) is your complete spec. Re-read the Acceptance Criteria — they are your definition of done.
2. **Confirm your scope boundary.** The orchestrator told you which directory/stack this task covers. If the plan requires a change outside it, stop and report exactly what is needed — do not make the out-of-scope change yourself.
3. **Read before editing.** Open every file you will touch, plus at least one sibling file in the same directory to learn the local style (naming, docblocks, import order, spacing). Match it.
4. **Ground yourself in the real code.** If the plan references files, classes, or endpoints, confirm they exist and behave as the plan assumes. If the plan's assumptions are wrong, surface the discrepancy — do not silently work around it.

## While you write

- **Surgical.** Change only what the plan requires. No refactors, no reformatting, no "while I'm here" improvements, no new abstractions for single-use code.
- **Conventions first.** Follow the relevant conventions section of @AGENTS.md for your stack exactly — read it before you write.
- **Mockups are reference-only.** If the plan points at a mockup (in the project's mockup directory, per @AGENTS.md), use it for layout/hierarchy/interaction intent. Do not copy its classes, colors, or styles — the app's own design tokens and components win.
- **No secrets.** Never hardcode keys, tokens, or credentials.

## Before you finish

1. **Verify what you can.** Run the checks that exist for your stack (per @AGENTS.md — e.g. lint, build, or a config check). If a check is unavailable, say so.
2. **Walk every Acceptance Criterion.** For each one, state how it is met and how you verified it.
3. **Report.** Return: the files changed (with a one-line reason each), how each Acceptance Criterion is satisfied, any checks you ran and their result, and anything you could not complete with the reason.

Signal completion only when every Acceptance Criterion is genuinely met.

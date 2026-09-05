---
name: code-review
description: Playbook for the code-reviewer agent. How to review a diff (scoped) or an area (standalone) against the plan and AGENTS.md, tag findings, and issue a PASS/FAIL verdict.
---

# Code Review

You are read-only. You review; you never edit. The orchestrator decides what to do with your findings.

## Determine your mode

- **Scoped mode** — you were given a specific diff and/or file list. Review ONLY those changes.
  - If you were given the diff content, review exactly those lines.
  - If you were given filenames only, run `git diff` scoped to those files first, then review only the diffed lines.
  - Do not comment on pre-existing code outside the changed lines — unless the new change directly interacts with a pre-existing bug, in which case flag it as a Warning, not a Critical.
- **Standalone mode** — no diff was passed. Review the named area in its current state.

## What to check

1. **Acceptance criteria.** Walk each criterion in the plan. Any that is not met is a **Critical** finding.
2. **Conventions.** Check the relevant `AGENTS.md` section (Backend / Frontend / DevOps). Style or convention violations are **Suggestion** or **Warning**, not Critical.
3. **Correctness.** Logic errors, unhandled edge cases, broken functionality. Real bugs are **Critical**.
4. **Security.** Injection, exposed secrets, unsafe input handling. **Critical** when exploitable.
5. **Performance / maintainability.** Reasonable concerns are **Warning** or **Suggestion**.

## Severity tags

- **[CRITICAL]** — bug, security issue, broken functionality, or an unmet acceptance criterion. Blocks.
- **[WARNING]** — should be fixed; degrades quality or safety but does not break the feature.
- **[SUGGESTION]** — optional improvement or style note.

Never mark something Critical to be safe. If it is not a real bug or an unmet criterion, it is not Critical.

## UI changes

If the change touches the frontend UI, first check whether the Playwright MCP Server is available — it is optional, and its tools may not be configured for this project.
- **If available:** validate against the dev server (URL per @AGENTS.md — Development URLs):
  - Confirm the affected view renders without errors.
  - Exercise the interactive elements the change introduces or modifies.
  - Check the browser console for runtime errors.
- **If unavailable:** state that explicitly in the report and note which UI checks could not be run.

## Output

Use the matching template from `templates/`:
- Scoped mode → `templates/review-scoped.md`
- Standalone mode → `templates/review-standalone.md`

Tag every finding and end with a single verdict:
- **FAIL** if there is one or more **Critical** finding.
- **PASS** otherwise (Warnings and Suggestions do not block).

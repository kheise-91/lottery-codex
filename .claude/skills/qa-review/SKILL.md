---
name: qa-review
description: Runs a read-only QA review comparing the current branch to master. Detects which parts of the codebase changed and spawns only the relevant reviewer agents (backend-reviewer, frontend-reviewer, devops-reviewer), then synthesizes their reports into one summary. Works on any branch.
disable-model-invocation: true
effort: max
---

## Step 1 - Confirm branch

```bash
git branch --show-current
```

If on `master`, stop and report: "Checkout a feature branch before running /qa-review."

---

## Step 2 - Get changed files and route to reviewer agents

```bash
git diff master...HEAD --stat
```

Parse the output into a flat list of changed file paths, then split that list by top-level path:
- **`devops-reviewer`**: reviews code changes to `docker-compose.yml` and `docker/`
- **`backend-reviewer`**: reviews code changes to `backend/`
- **`frontend-reviewer`**: reviews code changes to `frontend/`

Only spawn agents for sections with actual changed files. If a section's list is empty, skip that agent entirely - do not spawn it.

Do NOT review those files yourself. All code reviews should be handled by the specified reviewer agents.

---

## Step 3 - Spawn the applicable reviewer agents sequentially

Each reviewer agent checks for a list of changed filenames from the orchestrator first, falling back to `git diff` only if none was passed. ALWAYS pass the list explicitly so their own fallback never has to trigger.

Spawn each reviewer agent required based on the list of changed files, passsing the list of files for their section and the following instructions:

**Instructions:**
Review the following changed files on branch `[current-branch]` compared to `master`:
[newline-separated list of file paths scoped to this agent's section]

Follow your standard review process and output format.

---

## Step 4 - Synthesize the final report

Do not re-review any files yourself. Read the reports returned by each spawned agent and produce one consolidated summary:
```md
# QA Summary - [branch name]

## Sections reviewed
[backend / frontend / devops - only those actually spawned]

## Backend
[backend-reviewer's full report - omit if not applicable]

## Frontend
[frontend-reviewer's full report - omit if not applicable]

## DevOps
[devops-reviewer's full report - omit if not applicable]

## Consolidated blocking issues
[Pull every Critical/High-severity finding (backend, devops) and every Fail/Needs-Revision item (frontend) into one flat list, tagged by section. If none, say so.]

## Overall verdict
PASS/FAIL - [one sentence]. Mark FAIL if any section reported a Critical/high-severity issue or a Fail/Needs Revision assessment.
```

If FAIL, list every blocking issue grouped by section so it's clear what needs fixing before merge.
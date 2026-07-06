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

For each section that will be reviewed, pull the actual diff content scoped to that section (not just the stat summary):
```bash
git diff master...HEAD -- 
```

Keep the file list and diff content together per section - both get passed to the corresponding reviewer in Step 3.

Do NOT review those files yourself. All code reviews should be handled by the specified reviewer agents.

---

## Step 3 - Spawn the applicable reviewer agents in parallel

Each reviewer has a scoped-mode switch: when given diff content, it reviews ONLY those changes - not the full file, and not pre-existing code outside the diff (except where a pre-existing issue is directly broken by this change).

Spawn each reviewer agent required (sequentially - NOT in parallel), passsing the file list and diff content for their section, along with the following instructions:

**Instructions (send to each spawned reviewer):**
Review the following changes on branch `[current-branch]` compared to `master`. You are in **scoped mode** - review ONLY the diff content below, not the full file.

Changed files:
`[file list scoped to this agent's section]`

Diff:
`[diff content scoped to this agent's section]`

Follow your standard review process and output format, tagging findings as Critical / Warning / Suggestion.

---

## Step 4 - Synthesize the final report

Do not re-review any files yourself. Read the reports returned by each spawned agent and produce one consolidated summary:

```md
## QA Summary - [branch-name]

### Sections reviewed
[backend / frontend / devops - only those actually spawned]

### Backend
[backend-reviewer's full report - omit if not applicable]

### Frontend
[frontend-reviewer's full report - omit if not applicable]

### DevOps
[devops-reviewer's full report - omit if not applicable]

### Consolidated blocking issues
[Every Critical finding across all sections, tagged by section. If none, say so.]

### Non-blocking notes
[Every Warning/Suggestion finding across all sections, tagged by section - for awareness, doesn't affect the verdict.]

### Overall verdict
READY TO MERGE / FAIL - [one sentence]. FAIL if any section reported a Critical finding.
```

If FAIL, list every blocking issue grouped by section so it's clear what needs fixing before merge.
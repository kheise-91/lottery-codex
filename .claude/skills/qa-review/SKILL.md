---
name: qa-review
description: Runs a read-only QA review comparing the current branch to master. Detects which parts of the codebase changed and spawns only the relevant reviewer agents (backend-reviewer, frontend-reviewer, devops-reviewer), then synthesizes their reports into one summary. Works on any branch. This is meant to be run at the end of a phase and/or sub-phase from the project roadmap.
disable-model-invocation: true
effort: max
---

You are the orchestrator for a QA Review of the current branch. Your job is to get the complete list of files changed and the code changed in each file, group the changes based on which section of the codebase they belong to, and pass the changes to the specified reviewer agents. When all reviewer agents have finished their reviews, generate a final report for the user to review.

---

# Step 1 - Confirm branch

```bash
git branch --show-current
```

If on `master`, stop and report: "Checkout a feature branch before running /qa-review."

---

# Step 2 - Get changed files

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

# Step 3 - Spawn the applicable reviewer agents

Each reviewer has a scoped-mode switch: when given diff content, it reviews ONLY those changes - not the full file, and not pre-existing code outside the diff (except where a pre-existing issue is directly broken by this change).

Spawn each reviewer agent required (sequentially - NOT in parallel), passsing the file list and diff content for their section, along with the following instructions:

**Instructions (send to each spawned reviewer):**
Review the following changes on branch `[current-branch]` compared to `master`. You are in **scoped mode** - review ONLY the diff content below, not the full file.

Changed files:
`[file list scoped to this agent's section]`

Diff:
`[diff content scoped to this agent's section]`

Follow your standard review process and output format, tagging findings as Critical / Warning / Suggestion.

Wait for all reviewer agents to complete before proceeding.

---

# Step 4 - Synthesize the final report

Do not re-review any files yourself. Read the reports returned by each spawned agent and print a markdown summary, starting with two tables: one summarizing all the work done and one for the final code review findings. Each file reviewed should be in a new row for the second table. Example:
```md
# QA Review - [branch-name]

---

## Work Summary

| STEP # | AGENT NAME        | TASK SUMMARY                        |
|--------|-------------------|-------------------------------------|
| 1      | `agent-name`/none | Confirmed branch was not `master`   |
| 3      | `agent-name`/none | Reviewed [codebase section] changes |

---

## Code Review Summary

| SECTION                   | FILE NAME           | REVIEW SUMMARY              |
|---------------------------|---------------------|-----------------------------|
| [devops/backend/frontend] | `filepath/filename` | 🔴 **Critical:** findings   |
| [devops/backend/frontend] | `filepath/filename` | 🟠 **Warning:** findings    |
| [devops/backend/frontend] | `filepath/filename` | 🟡 **Suggestion:** findings |

---

## Overall Verdict

READY TO MERGE / FAIL - [one sentence]. FAIL if any section reported a Critical finding.
```
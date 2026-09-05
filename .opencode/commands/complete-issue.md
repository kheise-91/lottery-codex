---
name: complete-issue
description: Implement a single Gitea issue end to end — branch, engineer, scoped review with fix loop, commit, and PR
model: llama.cpp/Enoch
---

Complete issue #$1. If no issue number was given, ask the user which issue to complete and stop.

Refer to @AGENTS.md for the workflow formats. Spawn agents sequentially, one at a time. Do not edit code files yourself.

**Step 1 — Fetch the issue and create its branch.**
Spawn the @git-manager subagent to fetch issue #$1 (title, body, labels, milestone) and create its issue branch off the sub-phase branch. It checks out the branch, updates issue #$1 to set `ref` to the new branch name, and returns the full issue spec plus the branch name.

**Step 2 — Implement.**
Read the issue body. Determine the scope boundary (directory + stack) from the files and stack it names. Spawn the @software-engineer subagent with:
- The full issue body verbatim (this is the plan).
- The scope boundary.
- "Use your `execute-issue-plan` skill."
If the plan spans more than one scope, spawn one engineer per scope, sequentially, each with the full plan and its own boundary. Collect each completion report.

**Step 3 — Review.**
Stage and capture the diff: run `git add -A && git diff --cached` via bash. Spawn the @code-reviewer subagent in **scoped mode** with:
- The full issue body verbatim (the acceptance criteria to verify against).
- The captured diff.
- "Use your `code-review` skill." If the change touches the UI, tell it to check whether the Playwright MCP server is available and, if so, validate against the dev server (URL per @AGENTS.md).

**Step 4 — Fix loop (if the verdict is FAIL).**
- Re-spawn the @software-engineer subagent for the specific Critical findings only, with the reviewer's report attached. Keep the scope boundary.
- Re-capture the diff and re-spawn the @code-reviewer subagent.
- Repeat up to **3 rounds**. After 3 rounds, if the verdict is still FAIL, STOP and present the remaining Criticals to the user. Do not open a PR.
- Collect all Warning and Suggestion findings as you go — they are carried into the PR body, not fixed.

**Step 5 — Commit and open the PR.**
When the verdict is PASS, spawn the @git-manager subagent to:
- Commit the change with message `[<Label>-$1] <issue title>` (Label = the issue's label capitalized, e.g. `Task` or `Bug`; stage only this issue's changes).
- Push the branch.
- Open a pull request to the sub-phase branch, body per the git-ops skill's `pr-body` template (task summary, files changed, code-review summary including all Warning/Suggestion findings, `Closes #$1`).
- Return the PR URL.

**Step 6 — Report.**
Return a summary per @.opencode/templates/command-summary.md: the branch, the commit, the review verdict, the PR URL, and the Warning/Suggestion findings carried forward.

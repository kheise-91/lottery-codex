---
name: complete-issue
description: Fully autonomous mode. Works on a Gitea issue from start to finish without pausing for user confirmation. All work is isolated to a pre-created branch so it is safe to proceed without verification since nothing merges to master automatically.
---

You are in `YOLO` mode. All work is isolated to a pre-created branch so it is safe to proceed without verification since nothing merges to master automatically.

You will receive a string of arguments in {{args}}. Before doing anything else, parse this string to find specific flags and their values.

Once extracted, you can proceed to the steps below.

Look for these exact flags:
- `--issue-number [value]` (The Gitea issue number to work on)

If no `issue-number` is specified, stop and ask the user to provide one.

---

## Step 1 - Fetch the Gitea Issue

Invoke the `git-manager` subagent with the sub-phase number and instructions to follow the steps below.

### Step 1.1
Using the Gitea MCP, detect the repo from the current git remote.

Retrieve issue #[issue-number] and return its full content: title, body, acceptance criteria, notes, labels, and milestone.

### Step 1.2 - Determine the sub-phase branch
Derive the sub-phase branch from the issue's milestone:
- Milestone `Phase 3.9` → sub-phase branch `phase-3-9`
- Replace `.` with `-`, prepend `phase-`

### Step 1.3 - Find the branch name
Read the branch name from the issue. If none was found, read the issue's comments and find the branch comment in the format:
```
Branch: `branch-name`
```

This is the pre-created issue branch for this issue. If no branch comment exists, stop and report the problem. Do not create a new branch.

Checkout the pre-created issue branch AND rebase on the sub-phase branch. When finished, return the issue's full contents, the sub-phase branch name and the issue branch name.

---

## Step 2 - Invoke Engineer Subagents

Before invoking any subagents:
- Check for a saved issue plan in @.qwen/plans/ based on the issue number from Gitea. The file name will be `issue-[issue-number].md` (examples: `.qwen/plans/issue-12.md` or `.qwen/plans/issue-23.md`). Side note: issue plans are not tracked in Git.
- Derive the mockup pattern from the issue milestone: replace `.` with `-`, prepend `phase-`, append `-*.html`. Check `frontend/mockups/` for a matching file.

**Scope Boundary**
The implementation scope is defined entirely by this issue's title, body, and acceptance criteria - nothing else. The milestone description, any other issues in this milestone, and ROADMAP.md are organisational context only. Do not read ROADMAP.md. Do not implement work described in the milestone description or in any other issue. If the acceptance criteria in this issue are satisfied, the work is done.

Pass this same scope boundary to every subagent you invoke.

Based on what the issue/plan requires, invoke the appropriate subagents listed below sequentially:
- `devops-engineer`: Handles all work for the `docker-compose.yml` file and files inside the `docker/` directory.
- `backend-engineer`: Handles all work inside the `backend/` directory.
- `frontend-engineer`: Handles all work inside the `frontend/` directory.

Context/instructions to pass to the engineer subagents:
- The full issue body
- The specific devops/backend/frontend acceptance criteria
- The files expected to change (if list exists)
- The issue plan if one exists
- The mockup file if one exists (`frontend-engineer` only) 
- The requirement to signal completion only when all backend acceptance criteria pass and documentation has been updated

Invoke only the subagents the issue actually requires. A frontend-only issue skips the backend-engineer. A backend-only issue skips frontend-engineer.

---

## Step 3 - Invoke Reviewer Subagents

For each engineer subagent that worked on implementing the issue, spawn the corresponding reviewer agent. For example: the `frontend-reviewer` will review the work done by the `frontend-engineer` subagent.

Context/instructions to pass to the reviewer subagents:
 
**Context:**
- The list of all files changed during implementation
- The issue title and acceptance criteria
- App URL: https://dev-server.heise.home (`frontend-reviewer` only)

**Instructions:** 
You are doing a code review on the changed files.
- Read only the changed files
- Perform code checks
- Perform visual and interaction review (`frontend-reviewer` only)
- Return a short report, maximum 8 bullet points.
- Be direct and specific

**Report format:**
```markdown
## Code review
 
### Code issues
- [ISSUE] filename - specific problem
- [PASS] filename - no code issues found

### Verdict
PASS / NEEDS FIXES
``` 

If verdict is **NEEDS FIXES** and/or one of the code-reviewers flags blocking issues, address them before proceeding to the next step. 

Specify which upstream subagent is responsible for each blocking issue and invoke that subagent to make the necessary corrections. Once corrections have been made, invoke the corresponding reviewer subagent again. Follow this pattern until the verdict is **PASS**.

Non-blocking observations can be noted in the PR body.

---

## Step 4 - Invoke Documenter Subagent

Invoke the `documenter` subagent. Instruct the subagent to update all necessary documentation from the changes implemented above.

Make sure the subagent does not touch documentation for sections that were not affected in this issue.

---

## Step 5 - Commit, push, and open PR

Wait for user to confirm implementation is correct and documentation has been updated.

Once the user confirms, invoke the `git-manager` subagent, passing the code review summaries and instructions to follow the steps below.

### Step 5.1 - Commit and push
Stage ONLY the changes made for this issue and commit:
```
Feature: [short description matching issue title]

Closes #[issue-number]

- [File or change, one line each]
```

Push the branch.

### Step 5.2 - Open pull request
Open a pull request via the Gitea MCP:
- **From:** issue branch (`YYYY-MM-DD-task-summary`)
- **Into:** sub-phase branch (`phase-X-Y`)
- **Title:** the issue title
- **Milestone:** Phase X.Y
- **Body:**
  ```
  Closes #[issue-number]

  ## Code review summary
  [combined reports generated from code reviewer subagents]

  ## Files changed
  - [list]
  ```

Report the PR URL when done.
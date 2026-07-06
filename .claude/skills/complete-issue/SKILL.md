---
name: complete-issue
description: Fully autonomous mode. Works on a Gitea issue from start to finish without pausing for user confirmation. All work is isolated to a pre-created branch so it is safe to proceed without verification since nothing merges to master automatically.
disable-model-invocation: true
effort: xhigh
arguments: [issueNumber]
---

You are in `accept edits` mode. Do not request permission for any of the steps below. All work is isolated to a pre-created branch so it is safe to proceed without verification since nothing merges to master automatically.

The issue number is: $issueNumber.

---

## Step 1 - Fetch the Gitea Issue

Spawn the `git-manager` agent, passing the the issue number ($issueNumber) and instructions to follow the steps below:
1. Using the Gitea MCP, detect the repo from the current git remote. Retrieve issue #$issueNumber it's full content: title, body, acceptance criteria, notes, labels, branch and milestone
2. Determine the sub-phase branch
    - Derive the sub-phase branch from the issue's milestone:
    - Milestone `Phase 3.9` → sub-phase branch `phase-3-9`
    - Replace `.` with `-`, prepend `phase-`
3. Find the branch name
    - Read the branch name from the issue. If none was found, read the issue's comments and find the branch comment in the format:
      ```
      Branch: `branch-name`
      ```
    - This is the pre-created issue branch for this issue 
    - If no branch name is found for this issue, stop and report the problem - do not create a new branch
4. Checkout the pre-created issue branch AND rebase on the sub-phase branch
5. Return the issue's full contents, the sub-phase branch name and the issue branch name

---

## Step 2 - Spawn Engineer agents

Before invoking any agents:
- Check for a saved issue plan in @.claude/plans/ based on the issue number from Gitea. The file name will be `issue-$issueNumber.md` (examples: `.claude/plans/issue-12.md` or `.claude/plans/issue-23.md`). Side note: issue plans are not tracked in Git.
- Derive the mockup pattern from the issue milestone: replace `.` with `-`, prepend `phase-`, append `-*.html`. Check `frontend/mockups/` for a matching file.

**Scope Boundary**
The implementation scope is defined entirely by this issue's title, body, acceptance criteria, and issue plan if one exists - nothing else. The milestone description, any other issues in this milestone, and ROADMAP.md are organisational context only. Do not read ROADMAP.md. Do not implement work described in the milestone description or in any other issue. If the acceptance criteria in this issue are satisfied, the work is done.

Pass this same scope boundary to every agent you spawn.

Based on what the issue/plan requires, spawn the appropriate agents listed below sequentially:
- `devops-engineer`: Handles all work for the `docker-compose.yml` file and files inside the `docker/` directory.
- `backend-engineer`: Handles all work inside the `backend/` directory.
- `frontend-engineer`: Handles all work inside the `frontend/` directory.

Context/instructions to pass to the engineer agents:
- The full issue body
- The specific devops/backend/frontend acceptance criteria
- The files expected to change (if list exists)
- The issue plan if one exists
- The mockup file if one exists (`frontend-engineer` only) 
- The scope boundary
- The requirement to signal completion only when all backend acceptance criteria pass and documentation has been updated

Spawn only the agents the issue actually requires. A frontend-only issue skips the backend-engineer. A backend-only issue skips frontend-engineer.

---

## Step 3 - Spawn Reviewer agents

For each engineer agent that worked on implementing the issue, spawn the corresponding reviewer agent. For example: the `frontend-reviewer` will review the work done by the `frontend-engineer` agent.

Context/instructions to pass to the reviewer agents:
 
**Context:**
- The list of all files changed during implementation
- The issue title and acceptance criteria
- App URL: https://dev-server.heise.home (`frontend-reviewer` only)

**Instructions:** 
You are doing a code review on the changed files.
- Read only the changed files
- Perform code checks
- Perform visual and interaction review using the Playwright MCP (`frontend-reviewer` only)
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

Follow the steps below for each blocking issue until the final verdict is **PASS**:
1. Identify which upstream agent is responsible for the blocking issue
2. Re-spawn that upstream agent to fix the issue
3. Once this fix is done, re-spawn the corresponding reviewer agent again
4. Repeat this loop for each engineer and reviewer pair until all blocking issues have been fixed

Non-blocking observations can be noted in the PR body.

---

## Step 4 - Spawn Documenter agent

Spawn the `documenter` agent. Instruct the agent to update all necessary documentation from the changes implemented above.

Make sure the agent does not touch documentation for sections that were not affected in this issue.

---

## Step 5 - Commit, push, and open PR

Wait for user to confirm implementation is correct and documentation has been updated.

Once the user confirms, spawn the `git-manager` agent, passing the code review summaries and instructions to follow the steps below:
1. Commit and push the changes - stage ONLY the changes made for this issue and commit:
    ```
    Feature: [short description matching issue title]

    Closes #[issue-number]

    - [File or change, one line each]
    ```
2. Open a pull request via the Gitea MCP:
    - **From:** issue branch (`YYYY-MM-DD-task-summary`)
    - **Into:** sub-phase branch (`phase-X-Y`)
    - **Title:** the issue title
    - **Milestone:** Phase X.Y
    - **Body:**
      ```
      Closes #[issue-number]

      ## Code review summary
      [combined reports generated from code reviewer agents]

      ## Files changed
      - [list]
      ```
3. Report the PR URL when done.
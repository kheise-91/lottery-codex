---
name: execute-issue-plan
description: Orchestrates the implementation of a Gitea issue following a saved plan and opens a PR when the work has been completed and reviewed.
disable-model-invocation: true
effort: xhigh
arguments: [issueNumber]
---

You are in `accept edits` mode.

Your job is to orchestrate the implementation and review of the work required from a Gitea issue.

The issue number is: $issueNumber. If no issue number was provided by the user, stop and ask the user to provide one.

Check for a saved issue plan in @.claude/plans/ using $issueNumber. The file name will be `issue-$issueNumber.md` (examples: `.claude/plans/issue-12.md` or `.claude/plans/issue-23.md`). Issue plans are not tracked in Git. If no issue plan was found, stop and alert the user.

Read the saved issue plan. The issue details provided in the saved issue plan will be used in the steps below.

Before proceeding, confirm that the issue branch listed in the issue plan is checked out. If the issue branch listed in the plan is not checked out, stop and alert the user - do NOT proceed until the user confirms the branch is checked out.

**Scope Boundary**
Each sub-phase is broken down into multiple tasks, with an issue created for each task. The implementation scope for this task is defined entirely by the contents of the saved issue plan - nothing else. Do not implement any work that falls outside the scope of the issue plan. When the verification steps and acceptance criteria from the issue plan are satisfied, the work is done.

---

# Step 1 - Spawn the engineer agents

Before spawning any agents:
- Derive the mockup pattern from the issue milestone: replace `.` with `-`, prepend `phase-`, append `-*.html`. Check @frontend/mockups/ for a matching file.

Based on what the issue plan requires, spawn the appropriate agents listed below sequentially:
- `devops-engineer` agent: Handles all work for the `docker-compose.yml` file and files inside the `docker/` directory.
- `backend-engineer` agent: Handles all work inside the `backend/` directory.
- `frontend-engineer` agent: Handles all work inside the `frontend/` directory.

Context/instructions to pass to the engineer agents:
- The full issue plan text - read `.claude/plans/issue-$issueNumber.md` and include its entire contents verbatim in the agent prompt (do NOT summarize or truncate)
- The Scope Boundary (verbatim)
- The mockup file if one exists (`frontend-engineer` only)
- The requirement to signal completion only when all the work relevant to the agent's section has been completed and the acceptance criteria has been met

Agents MUST be spawned sequentially - NEVER in parallel. Spawn only the agents the issue actually requires. A frontend-only issue skips the backend-engineer, backend-only issue skips frontend-engineer, etc.

Wait for all agents to complete before proceeding.

---

# Step 2 - Spawn the reviewer agents

Before spawning reviewers, capture the actual changes made by the engineer agents (work is uncommitted at this point):

```bash
git add -A
git diff --cached
```

Split the diff output by top-level path (`frontend/`, `backend/`, `docker-compose.yml`/`docker/`) and match it to the section(s) that had an engineer spawned in Step 1.

For each engineer agent that worked on implementing the issue, spawn the corresponding reviewer agent:
- The `devops-reviewer` agent will review the work done by the `devops-engineer` agent
- The `backend-reviewer` agent will review the work done by the `backend-engineer` agent
- The `frontend-reviewer` agent will review the work done by the `frontend-engineer` agent

Context/instructions to pass to the reviewer agents:

**Context:**
- The full issue plan text - include its entire contents verbatim in the agent prompt (do NOT summarize or truncate)
- The Scope Boundary (verbatim)
- The diff content scoped to this agent's section only (not just filenames)
- App URL: https://dev-server.heise.home (`frontend-reviewer` only)

**Instructions:**
You are reviewing the code changes made for this issue. You are in **scoped mode** - review ONLY the diff content provided - do not review the full file or flag pre-existing issues outside these changes, unless a pre-existing issue is directly broken by this change.
- Read the entire issue plan provided by the orchestrator (`.claude/plans/issue-$issueNumber.md`)
- Perform code checks on the diff
- Perform all verification checks found in the issue plan and validate all acceptance criteria
- Perform visual and interaction review using the Playwright MCP (`frontend-reviewer` only)
- Return a short report - be direct and specific
- Tag each finding as Critical / Warning / Suggestion

**Report format:**
```md
## Code review

### Findings
[filename]
- [CRITICAL:] [specific problem]
- [WARNING:] [specific problem]
- [SUGGESTION:] [specific problem]

### Final Verdict
PASS / FAIL
```
Verdict is FAIL only if one or more Critical findings exist. Warnings and suggestions never block - collect them for the PR body instead.

If verdict is **FAIL**, address the Critical issues before proceeding to the next step.

Follow the steps below for each Critical issue until the final verdict is **PASS**:
1. The orchestrator NEVER edits code files directly, under any circumstances. If a Critical finding needs fixing, re-spawn the upstream engineer agent to fix it - do not use an edit tool yourself, even for a "quick" or "obvious" fix.
2. Identify which upstream agent is responsible for the critical issue.
3. Re-spawn that upstream agent to fix ONLY the Critical issue(s) - do not ask it to act on Warnings/Suggestions.
4. Once the fix is done, re-spawn the corresponding reviewer agent again, scoped to the new diff only (repeat the `git add -A && git diff --cached` capture).
5. Repeat this loop for each engineer/reviewer pair until all Critical issues are resolved.
6. Cap the fix loop (previous step) at **3 rounds per section**. If Critical issues remain after 3 rounds, stop - do not keep looping. Proceed to Step 3 with documentation only for what's confirmed correct, and surface the unresolved Critical issue(s) prominently in Step 4 for the user to decide on manually.

Non-Critical observations (Warnings, Suggestions) are carried into the PR body in Step 4, not acted on here.

Wait for all agents to complete before proceeding.

---

# Step 3 - Spawn the `documenter` agent

Spawn the `documenter` agent, passing the following context and instructions:

**Context:**
- The full issue plan text - include its entire contents verbatim in the agent prompt (do NOT summarize or truncate)
- The final diff content from Step 2 (all sections combined)

**Instructions:**
You are reviewing the code changes made for this issue and updating the relevant documentation. You are in **scoped mode** - review ONLY the diff content provided - do not review the full file.

Remember to stick to your scope limitation and update only documentation relevant to the code changes provided.

Wait for the `documenter` agent to complete before proceeding.

---

# Step 4 - Spawn the `git-manager` agent

Spawn the `git-manager` agent, passing the code review summaries, the issue details found at the top of the plan, and instructions to follow the steps below.

## Step 4.1 - Commit and push 
Commit and push the changes. Stage ONLY the changes made for this issue and commit using this format: `[Type-IssueNumber] Issue title`.
- Type: the issue's label, capitalized (e.g. `Task`, `Bug`, `Feature`)
- IssueNumber: $issueNumber

Examples: 
- `[Bug-47] Fix 500 errors from /api/games/ endpoint`
- `[Task-58] Implement GET /api/games/{gameId} endpoint`

## Step 4.2. Open pull request 
Open a pull request via the Gitea MCP:
- **From:** issue branch (`YYYY-MM-DD-task-summary`)
- **Into:** sub-phase branch (`phase-X-Y`)
- **Title:** the issue title
- **Milestone:** Phase X.Y
- **Body:**
    ```md
    ## Task Summary
    [summary of work completed and purpose for implementation]

    ## Files changed
    - [list]

    ## Code review summary
    [combined reports generated from code reviewer agents]

    ---

    Closes #$issueNumber
    ```

## Step 4.3 - Return PR URL
Return the PR URL when done.
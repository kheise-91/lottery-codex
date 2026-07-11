---
name: create-issue-plan
description: Fetches an issue from Gitea using the `git-manager` agent, creates a plan for implementing the required work, and saves the plan in markdown format for later use.
disable-model-invocation: true
effort: xhigh
arguments: [issueNumber]
---

You are in plan mode. Do not write, modify, or delete any files unless required by these instructions or explicitly requested by the user.

Your job is to spawn the `git-manager` agent to fetch a Gitea issue, create a plan for implementing the required work and save the plan as a markdown file for another agent to implement.

The issue number is: $issueNumber. If no issue number was provided, stop and ask the user to provide one.

---

# Step 1 - Spawn the `git-manager` agent

Spawn the `git-manager` agent, passing the issue number ($issueNumber) and instructions to follow the steps below.

## Step 1.1 - Fetch the Gitea issue 
Using the Gitea MCP, detect the repo from the current git remote. Retrieve issue #$issueNumber and its full content: title, label, body, acceptance criteria, branch and milestone.

## Step 1.2 - Determine the sub-phase branch name
Derive the sub-phase branch from the issue's milestone:
- Milestone `Phase 3.9` → sub-phase branch `phase-3-9`
- Replace `.` with `-`, prepend `phase-`

## Step 1.3 - Determine the issue branch name
Use the branch field retrieved in step 1.1. 

If none was found, read the issue's comments and find the branch comment in the format:
```
Branch: `branch-name`
```

This is the pre-created issue branch for this issue. If no branch name is found for this issue, stop and report the problem - do not create a new branch.

## Step 1.4 - Checkout and rebase
Checkout the pre-created issue branch AND rebase on the sub-phase branch.

## Step 1.5 - Return details
Return the issue's full contents, the issue branch name, and the sub-phase branch name.

---

# Step 2 - Create the implementation plan

Review @ROADMAP.md and @.claude/plans/migration-to-react-and-modern-php.md - these are the two planning documents for the entire project. The migration plan has implementation guidelines/instructions/examples. The roadmap is the source of truth and used for tracking progress.

If there's any conflicting information between the two, please stop and ask the user for clarifications. Do not make assumptions about what is true.

Create a detailed plan for implementing the task found in the specified Gitea issue, using the two planning documents for reference. If more project details are required for planning the work, start by looking in the `docs/` folder for project documentation. If more information is required even after reviewing the project documentation, you may read the pertinent project files to assist in creating the plan.

The issue should have a list of acceptance criteria. You may add verification steps to this if you feel the list is incomplete.

The plan MUST include the issue content provided by the `git-manager` agent in step 1. Follow the format below EXACTLY when creating the plan:
```md
## Issue Details
**Title:** [full issue title]
**Type:** [issue label]
**Milestone:** [issue milestone]
**Issue Branch:** [issue branch name]
**Sub-phase Branch:** [sub-phase branch name]

---

## Task Summary
[summary of work required and purpose for implementation]

## Instructions
[list of files to be added/modified/removed along with detailed instructions for each file]

## Verification
[acceptance criteria from the issue and any other verification tasks that should take place]
```

---

# Step 3 - Save the plan

Save the plan in the @.claude/plans/ directory as `issue-$issueNumber.md`. 

Do NOT work on implementing the plan. 

Return the full file name (including path) to confirm to the user that the plan has been saved.
---
name: command-summary
description: Summarize all of the work completed by the orchestrator and agents in a user-invoked command. Use this at the end of every command to print a markdown summary.
---

# Command Summary

Every command ends by rendering this table so the user can verify the work. One row per agent invocation or orchestrator action, in execution order - including review rounds. 

Render the command summarization markdown following the requirements below and using the EXACT structure shown below; do NOT improvise headers, sections, table columns or content.

## Rules

**Requirements for creating the markdown command summary:**
- `STEP #` is the step number from the command (1, 2, 3, …) - never text. If one step invokes an agent more than once (e.g. a fix-loop round), repeat the step number on each of its rows.
- Exactly three columns - `STEP #`, `AGENT NAME`, `TASK SUMMARY` - in that order. No extra, renamed, or reordered columns; fill every cell.
- Include every agent invocation - fix-loop rounds are separate rows.
- Artifacts lists only what this command actually produced.
- If a step failed, keep its row and mark the summary `FAILED: [reason]` instead of hiding it.

## Template

```md
# [Command Name (Title Case)] - [subject: issue #N / sub-phase X.Y / phase X]

## Verification
- [Review verdict(s) and which files/sections they covered]
- [Checks run and their result, e.g. build, php -l, Playwright UI validation]
- [Anything the user should verify by hand]

## Artifacts
- Branch: `[branch name]`
- Milestone: [Phase X.Y]
- Issues: [#N - title, #N+1 - title, ...]
- Pull request: [URL]
- Commits: [hash - message, ...]

## Command Summary
| STEP # | AGENT NAME           | TASK SUMMARY                                                                                 |
|--------|----------------------|----------------------------------------------------------------------------------------------|
| Step 1 | [orchestrator/agent] | [What it was asked to do, what actions it took, and what it returned (1-2 sentence summary)] |
| Step 2 | [orchestrator/agent] | [What it was asked to do, what actions it took, and what it returned (1-2 sentence summary)] |
| Step 3 | [orchestrator/agent] | [What it was asked to do, what actions it took, and what it returned (1-2 sentence summary)] |
```

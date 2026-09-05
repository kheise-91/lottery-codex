# Command summary template (orchestrator)

Every command ends by rendering this table so the user can verify the work. One row per agent invocation, in execution order — including review rounds.

```md
# [Command] — [subject: issue #N / sub-phase X.Y / phase X]

| STEP # | AGENT NAME | TASK SUMMARY |
|--------|------------|--------------|
| 1 | [agent] | [what it was asked to do and what it returned, one line] |
| 2 | [agent] | [one line] |
| 3 | [agent] | [one line — e.g. "Scoped review of 4 files: PASS, 2 Suggestions"] |

## Artifacts
- Branch: `[branch name]`
- Milestone: [Phase X.Y]
- Issues: [#N — title, #N+1 — title, ...]
- Pull request: [URL]
- Commits: [hash — message, ...]

## Verification
- [Review verdict(s) and which files/sections they covered]
- [Checks run and their result, e.g. build, php -l, Playwright UI validation]
- [Anything the user should verify by hand]
```

Rules:
- Include every agent invocation — fix-loop rounds are separate rows.
- Artifacts lists only what this command actually produced.
- If a step failed, keep its row and mark the summary `FAILED: [reason]` instead of hiding it.

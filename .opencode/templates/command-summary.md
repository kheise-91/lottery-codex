# Command summary template (orchestrator)

Every command ends by rendering this table so the user can verify the work. One row per agent invocation, in execution order — including review rounds. The table structure is a hard template — render it exactly as shown, do not improvise columns or content.

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
- `STEP #` is the step number from the command (1, 2, 3, …) — never text. If one step invokes an agent more than once (e.g. a fix-loop round), repeat the step number on each of its rows.
- Exactly three columns — `STEP #`, `AGENT NAME`, `TASK SUMMARY` — in that order. No extra, renamed, or reordered columns; fill every cell.
- Include every agent invocation — fix-loop rounds are separate rows.
- Artifacts lists only what this command actually produced.
- If a step failed, keep its row and mark the summary `FAILED: [reason]` instead of hiding it.

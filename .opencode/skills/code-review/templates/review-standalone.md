# Standalone review report template

Use this when reviewing a named area of the codebase in its current state (no specific diff was passed).

```md
## Code Review — [Area]

**Scope:** [area or files reviewed]
**Focus:** [what you were asked to look for, if given]

### Overview
[2-4 sentences: what this area does, its overall health, and the most important thing a reader should know.]

### Findings

[Group by severity. One bullet per finding, with file:line and a concrete description.]

**Critical**
- [CRITICAL] `file:line` — [issue]
(or "None.")

**Warnings**
- [WARNING] `file:line` — [issue]
(or "None.")

**Suggestions**
- [SUGGESTION] `file:line` — [issue]
(or "None.")

### Strengths
[1-3 bullets on what is done well here, if any. Optional but useful.]

### Final Verdict
[PASS | FAIL]
```

Rules:
- Every finding must cite `file:line`.
- Verdict is a single word: PASS or FAIL. FAIL only if at least one finding is Critical.

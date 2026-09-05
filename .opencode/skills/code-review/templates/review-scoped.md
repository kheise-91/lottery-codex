# Scoped review report template

Use this when reviewing a specific diff or file list. One block per reviewed file. List every file you reviewed, even if it has no findings.

```md
## Code Review — [branch / issue #N]

### Files reviewed
- `path/to/file.ext`
- `path/to/other.ext`

### Findings

`path/to/file.ext`
- [CRITICAL:] [specific issue, with the line or snippet]
- [WARNING:] [specific issue]
- [SUGGESTION:] [specific issue]
(or "No findings.")

`path/to/other.ext`
- [WARNING:] [specific issue]
(or "No findings.")

### Acceptance criteria
- [x] [criterion] — met (how verified)
- [ ] [criterion] — NOT met → see Critical finding

### UI validation
[If UI changed: what you checked via Playwright and the result. If Playwright was unavailable, say so. If no UI changed, write "Not applicable."]

### Final Verdict
[PASS | FAIL]
```

Rules:
- Quote the offending line or snippet in each finding so it can be located without re-reading the file.
- The Acceptance criteria section is mandatory in scoped mode — walk every criterion from the plan.
- Verdict is a single word: PASS or FAIL.

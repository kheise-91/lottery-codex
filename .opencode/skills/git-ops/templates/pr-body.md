# Pull request body template

Use this exact structure for every PR.

```md
## Task Summary
[What the PR does and why — 1-3 sentences, tied to the issue]

## Files changed
- `path/to/file.ext` — [one-line reason]
- `path/to/other.ext` — [one-line reason]

## Code review summary
[Paste the reviewer's report: findings by severity and the final verdict. If there were fix rounds, note the final verdict after fixes. Carry any non-blocking Warnings/Suggestions here verbatim so they are not lost.]

---

Closes #N
```

Rules:
- `Closes #N` uses the issue number the PR resolves.
- The Code review summary section is mandatory — the user verifies review work from it.
- Keep the Files changed list complete but concise.

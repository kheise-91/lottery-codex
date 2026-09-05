# Issue body template (plan = issue body)

Every decomposed task becomes a Gitea issue whose body follows this exact structure. The body is the complete plan — the engineer implements from it with no other planning artifact.

```md
## What
[What this task builds or decides — concrete, 1-3 sentences]

## Why
[Why it is needed and how it fits the sub-phase goal]

## Implementation
[Files to create/modify (real paths) and the ordered steps to take. Key decisions or constraints the engineer must respect. Concrete enough to implement without re-planning.]

## Acceptance Criteria
- [ ] [Concrete, testable condition]
- [ ] [Another condition]
- [ ] [Another condition]

## Notes
[Dependencies on other tasks in this set (`depends on task 1`), gotchas, reference to a mockup file if relevant]
```

Rules:
- Keep "What" scoped to a single session's work.
- Implementation is the plan — ordered, concrete steps with real file paths. No vague "refactor the backend" entries.
- Every Acceptance Criterion must be checkable without ambiguity (observable output, file existence, endpoint response, UI behavior).
- Notes may reference other task numbers in the set (`depends on task 1`), but tasks must still be deliverable in order without forward dependencies.

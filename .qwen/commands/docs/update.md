---
name: update-documentation
description: Creates/updates project documentation from the current codebase using the implementation agents.
---

All development work is complete.

Your task is to regenerate the project's documentation so it accurately reflects the current implementation.

Do not invent behavior that does not exist in the code.

---

## Step 1 - Review Codebase

Delegate documentation extraction sequentially.

Run:

1. backend-engineer
2. frontend-engineer
3. devops-engineer

Each agent is responsible for generating documentation for its own area.

The agents should return structured markdown summaries.

Do not proceed until all three have completed.

---

## Step 2 - Invoke Documenter

Invoke the documenter subagent, passing all 3 summaries generated from step 1 and instructions to update all project documentation.

---

## Step 3 - Verify Consistency

Check that:

- Every documented API exists
- Every documented database table exists
- Every documented component exists
- Deleted components are no longer documented

If inconsistencies remain, report them instead of guessing.

---

## Step 4 - Summarize

Return a summary:

```text
Updated

✓ README.md

✓ docs/api/README.md

✓ docs/database/README.md

✓ docs/components/README.md

✓ docs/components/App.md

✓ docs/components/...

Documentation regenerated successfully.
```
---
description: Analyze the existing project and generate a complete ROADMAP.md that reflects both the current implementation and the requested application goals.
---

# Generate Project Roadmap

You are a senior software architect responsible for creating the project's master development roadmap.

The roadmap is the single source of truth for the remainder of the project. Future commands will use this roadmap to generate milestones, issues, mockups, implementation plans, QA reviews, and documentation.

---

## Step 1 - Parse the input

Extract the following labeled fields from {{args}}. Fields follow the format `Label: value` and run until the next label. Field names are case-insensitive.

| Field | Required | Notes |
|---|---|---|
| `Description` | Yes | 2–4 sentences: what the app does, who uses it, what problem it solves |
| `Frontend` | No | e.g. React + Tailwind, Vue, plain HTML |
| `Backend` | No | e.g. PHP, Node, Python/FastAPI, none |
| `Database` | No | e.g. SQLite, PostgreSQL, none |
| `Other` | No | Auth providers, external APIs, third-party services |
| `Features` | Yes | List of MVP features |

If `Description` or `Features` are missing, ask for them before proceeding. For any missing fields, provide suggestions to the user and ask the user what they want to use (e.g. if `Frontend` is empty, suggest a frontend framework based on the description and ask the user what they want). If the field is not required, allow the user to skip making a selection for the field.

---

## Step 2 - Analyze the existing project

Read the following files if present:
- @README.md
- @QWEN.md

Inspect the repository to understand the current state of the application. Do not assume the project is empty.

Invoke explorer subagents (sequentially, NOT in parallel) to review and summarize the codebase.

---

## Step 3 - Analyze the requested application

Analyze the user's description.

Extract:

- Application goals
- Intended users
- Major features
- Implied features
- Workflows
- External integrations
- Deployment expectations
- Non-functional requirements
- Architectural requirements

Infer reasonable requirements that are strongly implied by the description.

Do not invent unrelated functionality. Ask the user any questiosn if clarification is needed.

---

## Step 4 - Compare desired state with current implementation

Determine:

- Work already completed
- Work currently in progress
- Work still missing
- Technical debt worth scheduling
- Architectural inconsistencies
- Missing infrastructure

Completed work should be marked completed.

Partially completed work should be marked in progress.

Remaining work should be marked not started.

Use:
```md
[x] Complete

[-] In Progress

[ ] Not Started
```

---

## Step 5 - Design the roadmap

Create a complete roadmap.

There is NO fixed number of phases.

Create as many phases as necessary.

Each phase should represent a meaningful milestone that leaves the application in a usable state.

Sequence phases so every phase builds upon previous work.

Avoid large "miscellaneous" phases.

Avoid phases organized purely by technology (Frontend, Backend, Database) unless that genuinely represents the work.

Prefer feature-oriented phases whenever practical.

---

## Step 6 - Create sub-phases

Each phase should contain as many sub-phases as necessary.

Sub-phases should be independently completable pieces of work.

Each sub-phase should represent work that could later become one milestone and be broken into multiple implementation tasks.

Do not artificially limit the number of sub-phases.

Keep granularity consistent.

---

## Step 7 - Write descriptions

Every phase must contain:

- Title
- Description
- Done when definition

Every sub-phase must contain:

- Title
- 2-5 sentence minimum description
- Expected files, components, APIs, database tables, services, or infrastructure affected (when reasonably predictable)
- Done when definition

Descriptions should explain:

- What is being built
- Why it exists
- How it fits into the project

Do not write implementation tasks.

Do not create issue-sized work.

Stay at roadmap level.

---

## Step 8 - Review before writing

Critically review the roadmap.

Look for:

- Missing phases
- Missing features
- Poor sequencing
- Architectural drift
- Phases doing too much
- Sub-phases doing too much
- Infrastructure planned too late
- Database work after API work
- API work after frontend work
- Authentication after authorization
- Deployment after production features

Automatically fix minor issues.

If significant problems remain, report them and ask before continuing.

---

## Step 9 - Write ROADMAP.md

If @ROADMAP.md already exists, ask before overwriting.

Write the roadmap using exactly this format:

```md
# Project Name - Roadmap

## Key

`[ ]` Not Started · `[-]` In Progress · `[x]` Complete

---

## Phase X - Phase Name

[Phase description]

[Done when]

- [ ] **X.1 - Sub-phase title**

  [Sub-phase Description]

  [Expected files]

  [Done when]

- [ ] **X.2 - Another sub-phase**

  [Sub-phase Description]

  [Expected files]

  [Done when]

---

## Phase X - Phase Name

```

Repeat until the roadmap is complete.

---

## Step 10 - Final validation

Before finishing, verify:

- Every requested feature exists somewhere in the roadmap
- Every completed feature found in the repository is represented
- Every phase has a Done when definition
- Every sub-phase has a Done when definition
- Roadmap order is logical
- No duplicated work exists

Report:

- Number of phases
- Number of sub-phases
- Completed
- In progress
- Remaining

Confirm ROADMAP.md was written successfully to the project-root directory.
---
name: create-sub-phase
description: Sets up sub-phase - create Gitea milestone, issues and branches based on sub-phase in project roadmap.
---

You will receive a string of arguments in {{args}}. Before doing anything else, parse this string to find specific flags and their values.

Once extracted, you can proceed to the steps below.

Look for these exact flags:
- `--sub-phase [value]` (The specific project sub-phase from the roadmap, e.g., 3.2)

If no sub-phase is specified, stop and ask the user to provide one.

---

## Step 1 - Read the roadmap

A sub-phase number is required.

Read @ROADMAP.md. Find the sub-phase matching the specified sub-phase (e.g. "3.2" matches `- [ ] **3.2...**`). 

Extract:
- The parent phase and title
- The sub-phase title
- The full description
- The "Done when" definition
- Any implementation notes (especially specific file names and components mentioned)

If the sub-phase cannot be found, stop.

---

## Step 2 - Plan the tasks

Break the sub-phase into independently deliverable implementation tasks. Each task must be completable in a single focused session - roughly half a day to two days of work. 

Derive the mockup pattern from the $subPhase number: replace `.` with `-`, prepend `phase-`, append `-*.html`. Check `frontend/mockups/` for a matching file. 

If a mockup file is found, treat it as the visual reference for frontend work. Find which parts of the mockup file are related to the sub-phase, and use them for visual and structural reference only - do not blindly copy its class names, inline styles, or CSS from the mockup into the tasks created. For styling: the project's existing stylesheets and components take precedence, followed by Tailwind CSS, and finally the mockup file. For structure: the sub-phase description in the project roadmap takes precedence over the mockup if they conflict.

For each task, determine:
- **title:** Short imperative phrase
- **project:** `Phase X - Parent Phase Title`
- **milestone:** `Phase X.Y`
- **labels:** `Task`
- **body:** Markdown with these sections:
  ```
  ## What
  [What this task builds or decides]

  ## Why
  [Why it's needed and how it fits the sub-phase goal]

  ## Acceptance Criteria
  - [ ] [Concrete, testable condition]
  - [ ] [Another condition]

  ## Notes
  [Implementation hints, dependencies on other tasks in this set, files to touch]
  ```

**Rules:**
- Sequence tasks so earlier ones don't depend on later ones
- If a task has a hard dependency on another in this list, note it in the Notes section
- Acceptance criteria must be concrete and testable - never vague
- Do not invent scope beyond what the sub-phase description states
- If the description mentions specific files (`db.php`, `api.php`, `Component.jsx`, etc.), generate a separate task for each distinct file or layer touched

---

## Step 3 - Create branches, milestone, and issues

Invoke the **gitea-git-ops** agent with instructions to follow the steps below.

### Step 3.1 - Create sub-phase branch
Derive the branch name from the argument: replace the `.` with `-` and prepend `phase-`. Example: `3.9` → `phase-3-9`

Create the branch off of `master` and push it.

### Step 3.2 - Create milestone
Using the Gitea MCP, detect the repo from the current git remote. Create a milestone with:
- **Title:** `Phase X.Y` (e.g. "Phase 3.9")
- **Description:** The full sub-phase description from the roadmap, including the done definition and any implementation notes, formatted as markdown

If the milestone already exists, skip creation and use the existing one.

### Step 3.3 - Create issues
For each task in sequence, perform these steps **one task at a time** - complete all steps for one task before moving to the next:

#### 3.3.1 - Generate the issue branch name
Format: `YYYY-MM-DD-short-task-summary`
- Use today's date
- Derive the summary from the task title: lowercase, hyphens, max 5 words, no special characters, no articles (a/an/the)
- Example: `2026-05-25-add-followed-up-column`

#### 3.3.2 - Create the issue branch
Using the generated issue branch name, create a new branch off of the sub-phase branch (not master) and push it.

#### 3.3.3 - Create labels 
Create any missing labels via the Gitea MCP if the label doesn't already exist.

#### 3.3.4 - Create the issue
Create the issues via the Gitea MCP with: title, project board name, milestone, branch, label(s), and body as planned in Step 2.

#### 3.3.5 - Add a comment to the issue
Add a comment to the issue immediately after creation:
```
Branch: `YYYY-MM-DD-short-task-summary`
```
This is how `/gitea:complete-issue` will find the branch later.

#### 3.3.6 - Confirm
Confirm the issue number, title, and branch name before proceeding to the next task.

### Step 3.4 - Return created issues
When all tasks have been converted into Gitea issues, return to the orchestrator the list of issues created, including their titles and branch names.

---

## Step 4 - Return and summarize

After all tasks are created, check out the sub-phase branch:
```bash
git checkout phase-[X-Y]
```

Print a summary table:

| # | Issue | Branch |
|---|-------|--------|
| 1 | #N - Issue title | `branch-name` |
| 2 | #N - Issue title | `branch-name` |
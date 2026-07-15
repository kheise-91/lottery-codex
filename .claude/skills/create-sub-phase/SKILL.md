---
name: create-sub-phase
description: Sets up sub-phase - creates the sub-phase branch, Gitea milestone, Gitea issues and individual issue branches based on the user provided sub-phase in the project roadmap. The steps laid out below are for setting up work in Gitea. No application files should be edited. No tasks should be implemented.
disable-model-invocation: true
effort: xhigh
arguments: [subPhase]
---

You are orchestrating the preparation and planning of a sub-phase from the project roadmap. The steps below are for preparation and planning only and ensure the sub-phase is properly scoped and set up in Gitea for development work. Make sure no application files are edited and no tasks get implemented.

The subPhase number is: $subPhase. If no $subPhase number is passed, stop and ask the user for a sub-phase number before proceeding.

---

# Step 1 - Read the roadmap

A sub-phase number is required.

Read @ROADMAP.md. Find the sub-phase matching "$subPhase" (e.g. "3.2" matches `- [ ] **3.2...**`). 

Extract:
- The parent phase and title
- The sub-phase title
- The full description
- The "Done when" definition
- Any implementation notes (especially specific file names and components mentioned)

If the sub-phase cannot be found, stop.

---

# Step 2 - Plan the tasks

Break the sub-phase into independently deliverable implementation tasks. Each task must be completable in a single focused session - roughly half a day to two days of work. 

Derive the mockup pattern from the $subPhase number: replace `.` with `-`, prepend `phase-`, append `-*.html`. Check `frontend/mockups/` for a matching file. If a mockup file is found:
- Treat it as the visual reference for frontend work 
- Find which parts of the mockup file are related to the sub-phase, and use them for visual and structural reference only - do not blindly copy its class names, inline styles, or CSS from the mockup into the tasks created
- For styling: the project's existing stylesheets and components take precedence, followed by Tailwind CSS, and finally the mockup file
- For structure: the sub-phase description in the project roadmap takes precedence over the mockup if they conflict

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

# Step 3 - Create branches, milestone, and issues

Spawn the `git-manager` agent with instructions to follow the steps below.

## Step 3.1 - Create sub-phase branch
- Derive the phase branch name from the parent phase number: Example: `Phase 3` → `phase-3`
- Derive the new sub-phase branch name from the user provided sub-phase number: replace the `.` with `-` and prepend `phase-`. Example: `3.9` → `phase-3-9`
- Create the new sub-phase branch off of the parent phase branch
- Push the new sub-phase branch to origin

## Step 3.2 - Create milestone
Using the Gitea MCP, detect the repo from the current git remote. Create a milestone with the information below, following the formatting exactly as shown:
- **Title:** `Phase X.Y` (e.g. "Phase 3.9")
- **Description:**
  ```md
  **Title** 
  [sub-phase title from roadmap]

  **Parent Phase** 
  [Phase X - phase title from roadmap]

  **Description**
  - [list of what this sub-phase will implement]

  **Done When**
  [done when definition for sub-phase from roadmap]
  ```

If the milestone already exists, skip creation and use the existing one.

## Step 3.3 - Create issues
For each task in sequence, perform the steps below **one task at a time** - complete all steps for one task before moving to the next:

### Step 3.3.1 - Generate the issue branch name
Format: `YYYY-MM-DD-short-task-summary`
- Use today's date
- Derive the summary from the task title: lowercase, hyphens, max 5 words, no special characters, no articles (a/an/the)
- Example: `2026-05-25-add-followed-up-column`

### Step 3.3.2 - Create the issue branch
Using the generated issue branch name, create a new branch off of the sub-phase branch (not master) and push it.

### Step 3.3.3 - Create labels 
Create any missing labels via the Gitea MCP if the label doesn't already exist.

### Step 3.3.4 - Create the issue
Create the issues via the Gitea MCP as planned in Step 2. Ensure that ALL of the fields named below are set when the issue gets created: 
- Title
- Branch
- Label(s)
- Milestone
- Body

### Step 3.3.5 - Add branch name comment to the issue
Add a comment to the issue immediately after creation:
```
Branch: `YYYY-MM-DD-short-task-summary`
```

### Step 3.3.6 - Add mockup file comment to the issue (if one exists)
If a mockup file was found in step 2, add a second comment to the issue:
```
Mockup: `[mockup-file-path/mockup-file-name.html]`
```

### Step 3.3.7 - Confirm
Confirm the issue number, title, and branch name before proceeding to the next task.

## Step 3.4 - Return created issues
When all tasks have been converted into Gitea issues, return to the orchestrator the list of issues created, including their titles and branch names.

Wait for the `git-manager` agent to complete before proceeding.

---

# Step 4 - Return and summarize

After all tasks are created, check out the sub-phase branch:
```bash
git checkout phase-[X-Y]
```

Print a markdown summary table of all the work done, including one row for each issue created. Example:
```md
# Sub-Phase Creation

---

## Work Summary

| STEP # | AGENT NAME        | TASK SUMMARY                        |
|--------|-------------------|-------------------------------------|
| 1      | `agent-name`/none | Reviewed project roadmap            |
| 3      | `git-manager`     | Created milestone [Milestone Title] |
| 3      | `git-manager`     | Created issue #N - [Issue Title]    |
| 3      | `git-manager`     | Created issue #N - [Issue Title]    |
```
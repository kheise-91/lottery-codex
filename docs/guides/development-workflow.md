---
name: development-workflow
title: Project Development Workflow
description: The workflow followed while working on this project.
---

# Project Development Workflow

## Step-By-Step Guide

### Step 1 - Create Project
Initialize project (README.md, .gitignore etc)

### Step 2 - Scope Project
*Custom Claude Code commands available: `/create-roadmap`, `/review-roadmap`*

### Step 3 - Create Gitea Project Boards
Create project boards for each Phase in the Gitea repository.

### Step 4 - Scope Tasks
*Custom Claude Code commands available: `/generate-mockups`, `/create-sub-phase`*

For each project sub-phase:
- Create mockups of UI/UX changes (optional - update sub-phase description in roadmap if needed to summarize chosen mockup)
- Create `phase-X-Y` branch 
- Create `phase-X-Y` milestone
- Create issues and branches for required work
- For each issue: link to new branch, link to project board, move to "To Do" list (only one sub-phase/milestone in "To Do" at a time)
- Update project roadmap: mark sub-phase as "In progress" and link title to Gitea milestone

### Step 5 - Complete Tasks
*Custom Claude Code command available: `/complete-issue`*

For each issue:
- Checkout pre-made branch (`Y-m-d-short-task-summary`) and rebase on `phase-X-Y` branch
- Complete task
- Open pull request for `Y-m-d-short-task-summary` branch into `phase-X-Y` branch

### Step 6 - Assemble Project
*Custom Claude Code command available: `/qa-review`, `/update-documentation`*

When all issues for sub-phase/milestone have been completed and merged:
- Perform a QA review of sub-phase branch (inside sub-phase branch)
- Update documentation with changes implemented in this sub-phase (inside sub-phase branch)
- Mark sub-phase as "Complete" in project roadmap (inside sub-phase branch)
- Open pull request for `phase-X-Y` branch into `master` branch
- Repeat steps 4, 5 and 6 until project is completed, utilizing project Kanban board on Gitea

### Step 7 - Complete Project
When all sub-phases have been completed and merged:
- Update all documentation
- Package app for production environment and deploy(ment)

---

## Flowchart

*Example flowchart diagram utilizing Claude Code skills*

```mermaid
flowchart TD
    Start([1 - Create Project])
    End([7 - Deploy Project])

    subgraph SCOPE_PROJECT["2 - Scope Project"]
        S1["/create-project-roadmap"]
        S2@{ shape: subproc, label: "/expand-project-roadmap" }
        S3@{ shape: subproc, label: "/review-project-roadmap" }
    end

    G1@{ shape: trap-t, label: "3 - Create Project Boards <br> (Gitea)"}

    subgraph SCOPE_TASKS["4-  Scope Tasks"]
        C1{"/create-mockup"}
        TC1@{ shape: proc, label: "/create-sub-phase" }
    end

    subgraph DEVELOPMENT["5 - Complete Tasks"]
        D1@{ shape: proc, label: " &emsp; /complete-issue &emsp; " }
    end

    subgraph ASSEMBLE["6 - Assemble Project"]
        QA["/qa-review"]
        DOC["/update-documentation"]
    end

    Start --> SCOPE_PROJECT
    S1 --> S2
    S2 --> S3
    S3 --> G1
    G1 -.-> SCOPE_TASKS
    C1 --> TC1
    TC1 --> DEVELOPMENT
    D1 --> ASSEMBLE
    QA --> DOC
    DOC --> End

    classDef sequential fill:#E1F5EE,stroke:#1D9E75,color:#085041
    classDef choice fill:#EEEDFE,stroke:#7F77DD,color:#26215C
    classDef decision fill:#FAEEDA,stroke:#EF9F27,color:#412402
    classDef terminal fill:#F1EFE8,stroke:#888780,color:#2C2C2A

    class S1,S2,S3,G1,QA,DOC sequential
    class TC1,TC2,D1,D2,D3 choice
    class C1,C2,C3 decision
    class Start,End terminal
```

---

## Resources

- [AI Models Guide](/docs/guides/ai-models.md)
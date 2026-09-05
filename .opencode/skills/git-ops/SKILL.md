---
name: git-ops
description: Playbook for the git-manager agent. Exact branch, commit, milestone, issue, and PR formats for this repository, all Gitea operations via the Gitea MCP Server.
---

# Git Ops

You are the only agent that runs git commands or touches Gitea. Follow the formats below exactly — do not improvise.

## Repository

- Self-hosted Gitea. All Gitea objects (PRs, issues, milestones, labels, comments) go through the **Gitea MCP Server**.
- If the Gitea MCP Server is unavailable, **stop and report it**. Never fall back to GitHub tooling or assume any other API/CLI exists.

## Branches

Four tiers, each cut from the one above it:

```
master
└── phase-X            (one per phase)
    └── phase-X-Y      (one per sub-phase, cut from phase-X)
        └── YYYY-MM-DD-short-task-summary   (one per issue, cut from phase-X-Y)
```

- Issue branch name: lowercase, hyphen-separated, date-prefixed, max 5 words, no articles (e.g. `2026-09-02-shared-history-scraper`).
- Merges are **merge commits** — never squash, never rebase, never force-push.
- PRs go: issue branch → sub-phase branch. Sub-phase → phase happens at `/complete-sub-phase`; phase → master is done manually.

## Commits

- Format: `[Type-IssueNumber] Issue title` where Type is the issue label capitalized (e.g. `[Task-171] Add shared history scraper`).
- Docs-only work: `[DOCS] ...`. Tooling-only work: `[TOOLS] ...`.
- Stage only the changes belonging to the current issue. Never commit unrelated work, and never commit secrets.

## Gitea objects

- **Label:** sub-phase issues carry the label `Task`; QA findings from `/qa-review` carry the label `Bug`. Create each label if it does not exist.
- **Milestone:** one per sub-phase, titled `Phase X.Y`, body per `templates/milestone.md`.
- **Issue body:** the issue body **is the plan** — it follows the `What / Why / Implementation / Acceptance Criteria / Notes` structure (see the `decompose-sub-phase` skill's issue-body template).
- **Creating an issue:** `gitea-mcp_issue_write` requires ALL of `title`, `body`, `milestone`, `labels`, and `ref` (if a branch name is referenced). Pass every parameter on every call, even if the tool schema marks some optional.

## Pull requests

- Body per `templates/pr-body.md`.
- Always return the PR URL in your report.

## Milestone gate

When asked to verify that a sub-phase is complete:

- Via the Gitea MCP Server, list the issues on the milestone (titled `Phase X.Y`) and check that **every one is closed**. (Issues close when their PR merges via `Closes #N`.)
- Return the result: all closed, or the list of still-open issue numbers. If any are open, the gate fails — report it and do not proceed past it.

## Output

Report every operation performed: branches created (names), commit hash(es) + message(s), Gitea objects created (milestone, issue numbers, label), and the PR URL. If a step fails, report exactly where it stopped.

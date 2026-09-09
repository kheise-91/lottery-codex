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
└── phase-X              (one per phase — created from master by /create-sub-phase if missing)
    ├── bug-NNN          (one per Bug issue, cut from phase-X)
    └── phase-X.Y        (one per sub-phase, cut from phase-X)
        └── task-NNN     (one per Task issue, cut from phase-X.Y)
```

- Issue branch name: `task-NNN` or `bug-NNN` where `NNN` is the Gitea issue number (e.g. `task-171`, `bug-18`). No dated branches.
- `phase-X` is created from `master` and pushed to origin when `/create-sub-phase` finds it missing — in practice this only happens for the first sub-phase of a phase (for later sub-phases it should already exist).
- Every branch an agent creates is pushed with upstream set the moment it is created: `git push -u origin <branch>` (phase-X.Y, task, and bug branches alike). The branch then exists on Gitea and the local branch tracks origin — no manual `--set-upstream` later.
- Merges are **merge commits** — never squash, never rebase, never force-push.
- PRs go: task branch → sub-phase branch, bug branch → phase branch, sub-phase → phase at `/complete-sub-phase`, phase → master manually. **No PR carries a milestone** — the `Phase X.Y` milestone is attached to the issues only.

## Commits

- Format: `[Type-IssueNumber] Issue title` where Type is the issue label capitalized (e.g. `[Task-171] Add shared history scraper`).
- The prefix is always drawn from the branch and/or issue being worked on. Agents work only on phase/sub-phase/task/bug branches and only use the prefixes those imply (e.g. `[Task-171]`, `[Bug-18]`).
- `[DOCS]` and `[TOOLS]` are **human-only** prefixes for manual commits on tool/doc branches — agents never use them.
- Stage only the changes belonging to the current issue. Never commit unrelated work, and never commit secrets.

## Gitea objects

- **Label:** sub-phase issues carry the label `Task`; QA findings from `/qa-review` carry the label `Bug`. Create each label if it does not exist.
- **Milestone:** one per sub-phase, titled `Phase X.Y`, body per `templates/milestone.md`. There are **no phase-level milestones** — phases are tracked on kanban boards — and `Bug` issues carry no milestone. Set its state to `closed` at `/complete-sub-phase`.
- **Issue body:** the issue body **is the plan** — it follows the `What / Why / Implementation / Acceptance Criteria / Notes` structure (see the `decompose-sub-phase` skill's issue-body template).
- **Creating an issue:** `gitea-mcp_issue_write` requires ALL of `title`, `body`, `milestone`, and `labels`. Do NOT set `ref` at creation — the issue's branch does not exist yet. Pass every parameter on every call, even if the tool schema marks some optional. Task issues get the sub-phase milestone (`Phase X.Y`); `Bug` issues get **no** milestone — pass a null/empty value for `milestone`.
- **Linking an issue to its branch:** when an issue is picked up for work (in `/complete-issue`), after creating the issue branch, update the issue to set `ref` = the issue branch name (so Gitea links the issue to its branch).

## Pull requests

- Body per `templates/pr-body.md`.
- **No PR carries a milestone** — do not pass a `milestone` parameter when creating a pull request; the `Phase X.Y` milestone is attached to the issues only.
- Always return the PR URL in your report.

## Milestone gate

When asked to verify that a sub-phase is complete:

- Via the Gitea MCP Server, list the issues on the milestone (titled `Phase X.Y`) and check that **every one is closed**. (Issues close when their PR merges via `Closes #N`.)
- Also list the pull requests targeting the sub-phase branch and check that **none are open** (every task PR merged).
- Return the result: all issues closed and no open PRs, or the list of still-open issue numbers / open PR numbers. If anything is open, the gate fails — report it and do not proceed past it.

## Output

Report every operation performed: branches created (names), commit hash(es) + message(s), Gitea objects created (milestone, issue numbers, label), and the PR URL. If a step fails, report exactly where it stopped.

---
name: docs-update
description: Playbook for the docs-manager agent. How to keep ROADMAP.md, README.md, and AGENTS.md in sync after work lands, with writes limited to status fields and necessary corrections.
---

# Docs Update

You keep the project's living documents accurate. The documents you may write: `ROADMAP.md` (status fields only), `README.md`, and `AGENTS.md`.

## Hard scope

- **Write:** `ROADMAP.md` status fields (checkboxes, milestone links), `README.md`, and `AGENTS.md` — the latter two only when necessary, in small targeted edits.
- **Never write:** the spec text of `ROADMAP.md` (phase/sub-phase descriptions, implementation-note bullets, "Done when" definitions), **any file in `docs/`** (100% human-maintained — no agent ever modifies it), or any source code file.
- **No execution.** No builds, tests, or code.
- If you believe the spec text is wrong, do **not** change it — flag it in your output so the orchestrator can raise it with the user.
- Match existing formatting exactly. Do not restructure, reword, or rewrite sections that are still accurate.

## Two invocation modes

- **Command mode** (invoked by `/complete-sub-phase`): writes are strictly limited — tick the checkbox and add the milestone link in `ROADMAP.md`; touch `README.md`/`AGENTS.md` only if the completed work makes a statement in them factually wrong.
- **Ad-hoc mode** (invoked directly by the orchestrator or user): more detailed updates allowed — `AGENTS.md` Key Context / Decisions Log / Conventions, `README.md` sections — still surgical, never a rewrite.

## ROADMAP.md status updates

When a sub-phase is completed, update its entry:

1. Tick the checkbox: `- [ ] **X.Y — Title**` → `- [x] **X.Y — Title**`
2. Add the Gitea milestone link to the title, using the exact format in `templates/roadmap-entry.md`. The milestone number comes from the orchestrator (it fetches it via `git-manager`) — never guess or invent a milestone ID.
3. Preserve all other entries verbatim. Do not renumber, reword, or reformat anything that is not the status of the completed work.

## AGENTS.md updates

- **Key Context** — update only items that are now stale (e.g. a "no tests yet" note once tests exist). Keep the same bullet style.
- **Decisions Log** — append one date-stamped entry for any notable decision the completed work established. Format: `- **YYYY-MM-DD** — [decision and its effect]`. Never rewrite or remove existing entries.
- **Conventions** — update only if the completed work introduced a genuinely new convention.

## Output

Return: the files changed with a one-line summary each, and anything you flagged but deliberately left alone.

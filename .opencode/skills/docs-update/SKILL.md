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

- **Command mode** (invoked by `/create-sub-phase` or `/complete-sub-phase`): writes are strictly limited — mark the sub-phase in progress (`[-]` + milestone link) or tick its checkbox in `ROADMAP.md`; touch `README.md`/`AGENTS.md` only if the completed work makes a statement in them factually wrong.
- **Ad-hoc mode** (invoked directly by the orchestrator or user): more detailed updates allowed — `AGENTS.md` Key Context / Decisions Log / Conventions, `README.md` sections — still surgical, never a rewrite.

## ROADMAP.md status updates

Status markers: `[ ]` not started, `[-]` in progress, `[x]` complete. In-progress and complete entries carry the title as a link to the Gitea milestone URL (format in `templates/roadmap-entry.md`).

- **In progress** (invoked by `/create-sub-phase`): set the checkbox to `[-]` and add the milestone link to the title. The milestone number comes from the orchestrator (it fetches it via `git-manager`) — never guess or invent a milestone ID.
- **Complete** (invoked by `/complete-sub-phase`): tick the checkbox (`[-]` → `[x]`); the milestone link is already in place from setup.
- Preserve all other entries verbatim. Do not renumber, reword, or reformat anything that is not the status of the sub-phase in question.

## AGENTS.md updates

- **Key Context** — update only items that are now stale (e.g. a "no tests yet" note once tests exist). Keep the same bullet style.
- **Decisions Log** — append one date-stamped entry for any notable decision the completed work established. Format: `- **YYYY-MM-DD** — [decision and its effect]`. Never rewrite or remove existing entries.
- **Conventions** — update only if the completed work introduced a genuinely new convention.

## Output

Return: the files changed with a one-line summary each, and anything you flagged but deliberately left alone.

---
name: review-roadmap
description: Playbook for the software-architect agent's review job. How to critique ROADMAP.md read-only (gaps, ordering, over-scoping).
---

# Review Roadmap

You critique `ROADMAP.md` read-only. Do not modify the file. Read it fully and return a critique organized as:

- **Gaps** — goals stated in `AGENTS.md` or the project goal that no phase/sub-phase covers.
- **Ordering** — sub-phases that depend on a later sub-phase; missing `phase-X` branch boundaries.
- **Over-scoping** — sub-phases that are really whole phases, or single-task sub-phases (must be ≥2 tasks).
- **Tasks disguised as sub-phases** — entries that are one implementation step rather than a user story.
- **Weak "Done when"** — any "Done when" line that is not testable.
- **Recommendations** — concrete edits, each tied to a specific line.

End with a short verdict: is the roadmap ready to decompose, and which sub-phase should go first.

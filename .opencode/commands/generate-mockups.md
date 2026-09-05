---
name: generate-mockups
description: Generate n self-contained HTML mockup variants for a roadmap sub-phase (default 3)
model: llama.cpp/Muse
agent: ui-designer
---

Produce $2 mockup variants for sub-phase $1 of ROADMAP.md. If $2 is empty, produce 3.

Use your `mockups` skill. Refer to @AGENTS.md for the project's design tokens and the mockup directory.

Do not modify anything outside the mockup directory.

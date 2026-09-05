---
name: brainstorm
description: Create or update ROADMAP.md from project goals
model: llama.cpp/Enoch-III
agent: software-architect
---

You are invoked for the **brainstorm** job. Use your `brainstorm-roadmap` skill.

Project goals: $ARGUMENTS

Refer to @AGENTS.md for the project's goal, stack, and conventions.

If the goals are ambiguous in a way that changes phase structure, do not guess — return the ambiguity as a list of questions for the user and do not write the file.

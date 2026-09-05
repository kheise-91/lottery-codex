---
name: explore-codebase
description: Playbook for the project-explorer agent. How to read a codebase area and return a structured report a writer can act on without re-reading the code.
---

# Explore Codebase

You are strictly read-only — no writes, no shell commands. Use whatever read/search tools are available to you (built-in or MCP).

## Method

1. Read the relevant section of `AGENTS.md` first (stack, architecture, conventions). It tells you what the project intends; your job is to verify what actually exists.
2. Start wide, then narrow:
   - Identify the entry points of the named area (e.g. `backend/api.php`, `frontend/src/App.jsx`, `docker-compose.yml`).
   - Map the directory structure with `glob`.
   - Read the files that matter; use `grep` to trace how pieces connect (imports, routing, service calls).
3. **The code wins.** Where the code contradicts `AGENTS.md`, report what the code actually does and note the discrepancy.

## Scope discipline

Stay inside the area the orchestrator named. If a question requires stepping outside it, note the dependency instead of wandering in.

## Output

Return the report using the `templates/explorer-report.md` structure. Be concrete: real file paths, real names, real shapes. A writer should be able to match existing patterns from your report alone.

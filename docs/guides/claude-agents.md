---
name: claude-agents
title: Claude Agents Guide
description: A comprehensive list of agents used with Claude Code in this project, and the roles each agent plays.
---

# Claude Agents Guide

Agents are specialized instances of Claude Code configured with custom system prompts via `.claude/agents/*.md`. Each agent is tailored for a specific domain of work — backend development, frontend UX, QA review, or infrastructure.

---

## Prerequisites

- Agent files live in `.claude/agents/`
- All agents run sequentially (never in parallel) due to local GPU memory constraints
- All agents inherit the parent model by default (`model: inherit`)
- Each agent has a color tag in its frontmatter for visual identification in Claude Code's agent picker

---

## Available Agents

### Engineering Agents

#### [`backend-engineer`](/.claude/agents/backend-engineer.md) <span style="color:purple">● purple</span>

Develops and modifies all server-side functionality including API endpoints, business logic, and data integrity. Built for modern PHP 8.2+ with Slim Framework 4. Restricted to the `backend/` directory.

**Key Responsibilities:**
- RESTful API development in `backend/api.php`
- Game logic classes (pattern analysis, panel generation) via `GameInterface.php` contract
- Input validation, sanitization, and error handling
- Web scraping integration via `simplehtmldom`
- Updates `docs/api/README.md` after relevant changes

**Use when:** Adding or changing API endpoints, modifying game logic, implementing business rules, optimizing scraping patterns, or any PHP/backend task.

---

#### [`frontend-engineer`](/.claude/agents/frontend-engineer.md) <span style="color:purple">● purple</span>

Implements, modifies, and debugs all frontend UI components, styling, state management, and client-side logic. Built for React 18 with Vite, Tailwind CSS v4, and Context API + `useReducer` state management. Restricted to the `frontend/` directory.

**Key Responsibilities:**
- React component development with hooks and modern patterns
- Tailwind CSS v4 styling and responsive design
- WCAG 2.1 AA accessibility compliance
- API integration against `/api/` endpoints via fetch-based service layer
- State management via Context API + `useReducer`
- Updates `docs/components/` after relevant changes

**Use when:** Creating or modifying React components, updating Tailwind styles, fixing accessibility issues, integrating frontend with backend APIs, or implementing client-side routing.

---

#### [`devops-engineer`](/.claude/agents/devops-engineer.md) <span style="color:purple">● purple</span>

Works on infrastructure, deployment, and DevOps-related tasks including Docker, NGINX, and container management. Manages the single-container PHP 8.2-FPM + Nginx stack. Restricted to `docker-compose.yml` and `docker/` directory only.

**Key Responsibilities:**
- Docker image and container management (`docker/Dockerfile`, `docker-compose.yml`)
- NGINX reverse proxy and SPA routing (`docker/nginx.conf`)
- `/start.sh` startup script maintenance
- Volume mount configuration for live backend development
- Updates `docs/infrastructure/` after relevant changes

**Use when:** Modifying Dockerfiles, docker-compose configs, NGINX configs, managing container volumes, or configuring the single-container stack.

---

### Reviewer Agents

#### [`backend-reviewer`](/.claude/agents/backend-reviewer.md) <span style="color:orange">● orange</span>

Performs comprehensive code reviews of PHP backend changes in the `backend/` directory. Identifies bugs, security vulnerabilities, performance concerns, and provides detailed change summaries. Read-only — never modifies files.

**Key Responsibilities:**
- Code quality, PSR-12 compliance, and PHP 8.2 feature usage review
- Security audit (input validation, XSS vectors, CORS configuration)
- Performance analysis (scraping patterns, HTTP call efficiency)
- RESTful API design consistency
- Change summarization with impact assessment

**Use when:** Reviewing backend code changes before merging, checking for security vulnerabilities, or validating API contract consistency.

---

#### [`frontend-reviewer`](/.claude/agents/frontend-reviewer.md) <span style="color:orange">● orange</span>

Performs code reviews of frontend changes in the `frontend/` directory and validates them using Playwright MCP browser testing. Read-only — never modifies files.

**Key Responsibilities:**
- Code quality, convention compliance, and React 18 patterns review
- Tailwind CSS v4 styling validation
- Accessibility (WCAG) and responsive design checks
- Playwright MCP browser testing against dev server
- Change summarization with QA test results

**Use when:** Reviewing frontend code changes before merging, validating UI/UX changes in the browser, or performing comprehensive frontend QA.

---

#### [`devops-reviewer`](/.claude/agents/devops-reviewer.md) <span style="color:orange">● orange</span>

Performs read-only reviews of Docker and Nginx configuration changes. Identifies security issues, best practice violations, and potential runtime problems for the single-container PHP-FPM + Nginx stack.

**Key Responsibilities:**
- Security analysis (hardcoded secrets, volume mount safety, port exposure)
- Best practice compliance (Dockerfile layer optimization, image versions)
- Operational readiness (startup ordering, restart policies, health checks)
- Change summarization with impact assessment

**Use when:** Reviewing Docker/Nginx configuration changes produced by `devops-engineer`, checking for security issues, or validating infrastructure changes.

---

### Explorer Agents

#### [`backend-explorer`](/.claude/agents/backend-explorer.md) <span style="color:cyan">● cyan</span>

Analyzes and summarizes the backend codebase structure, key components, architecture patterns, and important implementation details within the `backend/` directory. Read-only — ideal for onboarding and understanding existing code before making changes.

**Key Responsibilities:**
- Structural analysis of `backend/` directory layout
- Component identification (routes, game classes, middleware)
- Architecture assessment (Slim pipeline, dependency injection)
- Technology stack documentation
- Notable patterns and conventions identification

**Use when:** Onboarding to the project, understanding backend architecture before modifications, or getting a high-level overview of backend systems.

---

#### [`frontend-explorer`](/.claude/agents/frontend-explorer.md) <span style="color:cyan">● cyan</span>

Analyzes and summarizes the frontend codebase structure, key components, patterns, and architecture within the `frontend/` directory. Read-only — ideal for onboarding and understanding React app organization before making changes.

**Key Responsibilities:**
- Structural analysis of `frontend/src/` directory layout
- Component identification (pages, contexts, hooks, services)
- Architecture assessment (routing, state management, data flow)
- Technology stack documentation (React 18, Vite, Tailwind CSS v4)
- Notable patterns and conventions identification

**Use when:** Onboarding to the project, understanding frontend architecture before modifications, or getting a high-level overview of React components.

---

#### [`devops-explorer`](/.claude/agents/devops-explorer.md) <span style="color:cyan">● cyan</span>

Analyzes and summarizes Docker-related infrastructure configuration files. Examines `docker-compose.yml`, Dockerfiles, NGINX config, and startup scripts to understand the single-container deployment stack. Read-only.

**Key Responsibilities:**
- `docker-compose.yml` analysis (ports, volumes, environment variables)
- `Dockerfile` assessment (base image, build steps, PHP-FPM config)
- `nginx.conf` review (SPA routing, FastCGI proxy, caching)
- Synthesized infrastructure summary with recommendations

**Use when:** Understanding the deployment stack, auditing infrastructure configuration, or getting an overview of how the container serves both frontend and backend.

---

### Coordination Agents

#### [`git-manager`](/.claude/agents/git-manager.md) <span style="color:green">● green</span>

Handles all Git-related operations including branching, committing, merge conflict resolution, push/pull workflows, pull request management (create/review/close), and issue management via Gitea MCP server integration.

**Key Responsibilities:**
- Branch creation, cleanup, and conflict resolution
- Conventional commit enforcement and atomic commit grouping
- Pull request lifecycle management (creation, review, merge, close)
- Issue creation, labeling, and status tracking
- Merge conflict resolution with context-aware strategies

**Use when:** Creating or managing branches, committing changes, opening/closing PRs, resolving merge conflicts, or managing issues.

---

#### [`documenter`](/.claude/agents/documenter.md) <span style="color:yellow">● yellow</span>

Creates, updates, and synchronizes markdown documentation with the codebase. Maintains `README.md` at the project root and all documentation within the `docs/` directory only.

**Key Responsibilities:**
- API documentation in `docs/api/README.md` (endpoints, request/response formats, status codes)
- Component documentation in `docs/components/` (component index with links)
- Infrastructure documentation in `docs/infrastructure/` (Docker, NGINX)
- Root-level `README.md` maintenance (project description, quick-start commands)

**Use when:** Creating new documentation, updating docs after code changes, synchronizing documentation with the current codebase state, or maintaining API/component/infrastructure docs.

---

## Reference

### Available Agents

| Agent Name | Color | Description |
| ---------- | ----- | ----------- |
| `backend-engineer` | <span style="color:purple">●</span> purple | Develops and modifies all server-side functionality including API endpoints, business logic, and data integrity. Restricted to `backend/`. |
| `frontend-engineer` | <span style="color:purple">●</span> purple | Implements and debugs all frontend UI components, styling, state management, and client-side logic. Restricted to `frontend/`. |
| `devops-engineer` | <span style="color:purple">●</span> purple | Manages Docker, NGINX, and container infrastructure. Restricted to `docker-compose.yml` and `docker/`. |
| `backend-reviewer` | <span style="color:orange">●</span> orange | Reviews PHP backend code changes for bugs, security vulnerabilities, and performance issues. Read-only. |
| `frontend-reviewer` | <span style="color:orange">●</span> orange | Reviews frontend code changes and validates with Playwright MCP browser testing. Read-only. |
| `devops-reviewer` | <span style="color:orange">●</span> orange | Reviews Docker/Nginx config changes for security issues, best practices, and runtime problems. Read-only. |
| `backend-explorer` | <span style="color:cyan">●</span> cyan | Analyzes backend structure, architecture patterns, and codebase overview. Read-only. |
| `frontend-explorer` | <span style="color:cyan">●</span> cyan | Analyzes frontend structure, component hierarchy, and tech stack. Read-only. |
| `devops-explorer` | <span style="color:cyan">●</span> cyan | Analyzes Docker/Nginx configuration files and infrastructure setup. Read-only. |
| `git-manager` | <span style="color:green">●</span> green | All Git operations, branching, commits, PRs, issues, and merge conflict resolution. |
| `documenter` | <span style="color:yellow">●</span> yellow | Creates and updates markdown docs in `docs/` and root `README.md` only. |

### Key Context Shared By All Agents

- `docs/api/` — API endpoint documentation
- `docs/components/` — Frontend component documentation
- `docs/infrastructure/` — Docker and NGINX infrastructure documentation

### Workflow

When working on a feature that touches multiple areas:

1. **Implementation** — `backend-engineer` and/or `frontend-engineer` implement code changes
2. **Review** — Corresponding reviewer (`backend-reviewer` / `frontend-reviewer`) reviews changes
3. **Merge** — `git-manager` handles PR creation, merging, and branch management
4. **Documentation** — `documenter` updates documentation if needed

Agents must always run **sequentially** — never in parallel — due to local GPU memory constraints.

---

## Resources

- [AI Models Guide](/docs/guides/ai-models.md)
- [Claude Skills Guide](/docs/guides/claude-skills.md)
- [Project Development Workflow Guide](/docs/guides/development-workflow.md)
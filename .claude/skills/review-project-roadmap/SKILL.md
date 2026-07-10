---
name: review-project-roadmap
description: Perform a comprehensive architectural review of ROADMAP.md without modifying any files.
disable-model-invocation: true
effort: xhigh
---

You are acting as a principal software architect performing an independent review of the project's roadmap. Assume you did not write the roadmap. Your goal is to find problems.

Do not rewrite the roadmap.

Do not modify any files.

---

# Step 1 - Read the roadmap

Read @ROADMAP.md in the current directory. If it does not exist, stop and report:
> "No ROADMAP.md found - run `/roadmap:generate` first."

---

# Step 2 - Analyze the repository

Read the following files if present:
- @README.md
- @CLAUDE.md

Inspect the repository to understand the current state of the application. Do not assume the project is empty.

Spawn explorer subagents (sequentially, NOT in parallel) to review and summarize the codebase.

Determine:
- Implemented features
- Architecture
- Deployment
- Technologies

---

# Step 3 - Review the roadmap

Critically review the roadmap. Treat every omission as a possible problem.

Review the following areas very closely:

**Missing work**
- Missing features
- Missing infrastructure
- Missing documentation
- Missing deployment work
- Missing testing
- Missing migrations
- Missing security work

**Sequencing**
- Dependencies backwards
- Frontend before API
- API before schema
- Deployment too early
- Testing too late

**Scope**
- Identify phases or sub-phases that attempt to accomplish too much and recommend where they should split.

**Architecture**
- Architectural inconsistencies
- Duplicated work
- Conflicting approaches
- Unnecessary complexity
- Missing cross-cutting concerns

**Naming**
- Ensure every phase and sub-phase title accurately reflects its contents.

**Current implementation**
Compare the roadmap with the existing repository. 
Identify:
- Work marked incomplete that already exists
- Work marked complete that is missing
- Completed work omitted entirely

**Future scalability**
Determine whether the roadmap supports future expansion.
Flag:
- Monolithic phases
- Oversized sub-phases
- Hidden technical debt
- Risky assumptions

---

# Step 4 - Produce the report

Do not modify ROADMAP.md. Your review is advisory only. Structure the report exactly as follows.

```md
# Roadmap Review - Overview

## Critical Issues
[Problems that would likely cause project failure, major rework, or missing functionality.]

## Suggestions
[Optional improvements that would strengthen the roadmap.]

## Strengths
[List portions of the roadmap that appear well structured and require no changes.]

---

# Roadmap Review - Details

## Missing Work
[Features or infrastructure absent from the roadmap.]

## Sequencing Problems
[Incorrect ordering.]

[Explain the dependency and recommend the proper sequence.]

## Scope Problems
[Phases or sub-phases that should be split.]

## Architectural Concerns
[Design decisions that should be reconsidered.]

## Scalability
[How well the ROADMAP and future project will support expansion.]

## Repository Mismatches
[Differences between the roadmap and the current codebase.]

## Completed Work
[Work from the ROADMAP that has been completed already.]

---

# Roadmap Review - Final Assessment

Provide one overall assessment.

Choose exactly one:

PASS

PASS WITH RECOMMENDATIONS

NEEDS REVISION

MAJOR REWORK REQUIRED
```
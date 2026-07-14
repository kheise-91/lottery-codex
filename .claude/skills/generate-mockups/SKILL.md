---
name: generate-mockups
description: Generate multiple UI mockup variants for a roadmap sub-phase using the frontend UX agent.
disable-model-invocation: true
effort: xhigh
arguments: [subPhase, numberOfMockups]
---

The subPhase number is: $subPhase. If no $subPhase number is passed, stop and ask the user for a sub-phase number before proceeding.

The number of mockups to create is: $numberOfMockups. If no $numberOfMockups is passed, default to creating 3 mockups.

---

# Step 1 - Read the sub-phase

Read @ROADMAP.md and find the sub-phase matching "$subPhase" (e.g. "3.2" matches `- [ ] **3.2...**`)

Extract the sub-phase title and the full sub-phase description including any implementation notes and "done when" definition.

If no matching sub-phase is found, stop and alert the user.

---

# Step 2 - Extract frontend design requirements

From the sub-phase description, extract only the information relevant to UI and frontend design:

**Include:**
- Component names and structure (examples: `DrawingCard.jsx`, `PanelDisplay.jsx`, etc.)
- Layout and positioning descriptions (sub-header, left/right alignment, widths)
- Visual elements (buttons, badges, icons, text content)
- Interaction and behavior (hover, click, toggle, slide-down, overlay)
- Display logic (what shows when, conditional rendering)
- Text content and labeling
- Styling details (color references, spacing, scroll behavior)

**Ignore:**
- Database schema changes
- API endpoint details and HTTP methods
- Query logic and SQL conditions
- Server-side implementation notes
- Anything inside an "Implementation note" callout that describes backend behavior

Summarize the extracted frontend requirements in plain language before proceeding. If the sub-phase contains no meaningful frontend work, report that and stop.

---

# Step 3 - Delegate project style extraction to `frontend-explorer` agent

Spawn the `frontend-explorer` agent to analyze the existing frontend architecture. Do not use local file tools for this step; you MUST spawn the specified explorer agent.. 

Provide the agent with this exact prompt:
```text
Analyze the existing codebase inside `frontend/src/` to extract visual design conventions for a new mockup. 
1. Inspect the global stylesheet (e.g., `frontend/src/index.css`) for Tailwind patterns, CSS variables, and core theme colors.
2. Inspect the core components in `frontend/src/components/` to identify common spacing patterns, border radiuses, and layout structures.

Return a markdown summary of these visual styles to the orchestrator. Do not attempt to read files outside your permitted directories or write any mockup files.
```

Await the agent's markdown response before moving on to Step 4. Use the agent's summary to assist with planning and generating the mockups.

---

# Step 4 - Plan distinct mockup variants

Before writing any HTML, think through $numberOfMockups meaningfully different approaches to the frontend design extracted in Step 2. 

Variants must differ in **structure or interaction pattern** - not just color or size.

Each mockup variant should:
- Represent a distinct UX philosophy rather than cosmetic changes
- Match the application's existing visual language
- Be fully interactive where appropriate
- Include realistic placeholder content
- Include a reference footer describing the sub-phase and design approach

For each mockup variant, decide:
- A short kebab-case name capturing what makes it distinct (e.g. `slide-panel`, `inline-list`, `modal-drawer`)
- One sentence describing its approach and tradeoff

---

# Step 5 - Spawn `frontend-engineer` agents to generate mockup variants

For each planned mockup variant: spawn a `frontend-engineer` agent to produce a complete, self-contained HTML file for each variant following the expected requirements found in the agent's definition.

Pass the agent the sub-phase number and variant info, extracted design requirements and project styles from steps 2 and 3, and any other information needed to create the specified variant.

Wait for all engineer agents to complete before proceeding.

---

# Step 6 - Report

Print a summary table with all the files created from the agents:

| File | Approach | Best suited for |
|---|---|---|
| `frontend/mockups/phase-3-2-slide-panel.html` | [description] | [when this wins] |
| `frontend/mockups/phase-3-2-inline-list.html` | [description] | [when this wins] |
---
name: generate-mockup
description: Generate multiple UI mockup variants for a roadmap sub-phase using the frontend UX agent.
---

You will receive a string of arguments in {{args}}. Before doing anything else, parse this string to find specific flags and their values.

Once extracted, you can proceed to the steps below.

Look for these exact flags:
- `--sub-phase [value]` (The specific project sub-phase from the roadmap, e.g., 3.2)
- `--number-of-mockups [value]` (The total number of designs to make, e.g., 3)

If no sub-phase is specified, stop and ask the user to provide one.

If no number-of-mockups is specified, default to 3.

---

## Step 1 - Read the sub-phase

Read @ROADMAP.md and find the sub-phase specified by the user (e.g. "3.2" matches `- [ ] **3.2...**`)

Extract the sub-phase title and the full sub-phase description including any implementation notes and "done when" definition.

If no matching sub-phase is found, stop and alert the user.

---

## Step 2 - Extract frontend design requirements

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

## Step 3 - Delegate project style extraction to `frontend-explorer` subagent

Spawn the `frontend-explorer` subagent to analyze the existing frontend architecture. Do not use local file tools for this step; you MUST invoke the specified explorer subagent.. 

Provide the subagent with this exact prompt:
```text
Analyze the existing codebase inside `frontend/src/` to extract visual design conventions for a new mockup. 
1. Inspect the global stylesheet (e.g., `frontend/src/index.css`) for Tailwind patterns, CSS variables, and core theme colors.
2. Inspect the core components in `frontend/src/components/` to identify common spacing patterns, border radiuses, and layout structures.

Return a markdown summary of these visual styles to the orchestrator. Do not attempt to read files outside your permitted directories or write any mockup files.
```

Await the subagent's markdown response before moving on to Step 4. Use the subagent's summary to assist with planning and generating the mockups.

---

## Step 4 - Plan distinct mockup variants

Before writing any HTML, think through [number-of-mockups] meaningfully different approaches to the frontend design extracted in Step 2. 

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

Do not start writing HTML until all variants are planned.

---

## Step 5 - Invoke `frontend-engineer` subagents to generate mockup variants

For each planned mockup variant: invoke a `frontend-engineer` subagent to produce a complete, self-contained HTML file for each variant following the requirements below.

**Reference Warning**
- The first two lines of the HTML file should contain a warning to any model reading the mockup that let's it know not to just blindly copy the classes or inline styles:
  ```HTML
  <!-- VISUAL REFERENCE ONLY -->
  <!-- Do NOT blindly copy class names or styles from this file. Use this mockup for layout, structure, and interaction intent only. -->
  ```

**Structure Requirements:**
- Use Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Include a reference bar at the bottom showing:
  - Sub-phase: $subPhase - [sub-phase title]
  - Variant: [variant name] - [one-sentence description]
- Show the component in enough surrounding context to be meaningful - a realistic section of the app UI, not the component in isolation
- Use realistic placeholder data

**Quality Requirements:**
- Fully styled - no unstyled placeholders or TODO comments
- Match the color palette and Tailwind conventions from the existing codebase
- If the design involves interaction (hover, click, toggle, slide), implement it with vanilla JS so the mockup is interactive in the browser
- All frontend requirements extracted in Step 2 should be visibly addressed

---

## Step 6 - Save and report

Create the `frontend/mockups/` directory if it does not exist. 

For the filename, replace the '.' character in the sub-phase number with '-'. Save each variant as:
```
frontend/mockups/phase-[sub-phase]-[variant-name].html
```

Example for sub-phase 3.2 with 3 variants:
```
frontend/mockups/phase-3-2-slide-panel.html
frontend/mockups/phase-3-2-inline-list.html
frontend/mockups/phase-3-2-modal-drawer.html
```

Print a summary table:

| File | Approach | Best suited for |
|---|---|---|
| `frontend/mockups/phase-3-2-slide-panel.html` | [description] | [when this wins] |
| `frontend/mockups/phase-3-2-inline-list.html` | [description] | [when this wins] |
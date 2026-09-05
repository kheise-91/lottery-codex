---
name: mockups
description: Playbook for the ui-designer agent. How to turn a sub-phase's frontend requirements into distinct, self-contained HTML mockups in the project's mockup directory.
---

# Mockups

You produce n distinct, self-contained HTML mockup files for one sub-phase. Each file opens and works in a browser with no build step.

## Before you design

1. **Get the requirements.** The orchestrator passes the sub-phase's frontend requirements (what views, components, data, and interactions the sub-phase introduces). If they were not passed, read the sub-phase entry in `ROADMAP.md` and extract them yourself: the views it adds or changes, the data shown, and the user actions supported.
2. **Ground yourself in the existing design.** Read the project's design-token file (CSS custom properties / component patterns — per @AGENTS.md or the orchestrator's instructions) and skim the relevant existing components. Match the app's existing visual language — palette, spacing, typography, component shapes. Do not invent a new look.
3. **Plan n distinct variants.** Variants must differ in **structure or interaction philosophy** (e.g. tabbed vs. scrollable, card grid vs. table, inline vs. modal) — not in cosmetics. Give each a short kebab-case name and a one-sentence tradeoff before writing.

## File format (every file, no exceptions)

- A complete standalone HTML document.
- **Lines 1-2 are always the reference warning:**
  ```html
  <!-- VISUAL REFERENCE ONLY -->
  <!-- Do NOT blindly copy class names or styles from this file. Use this mockup for layout, structure, and interaction intent only. -->
  ```
- Tailwind via CDN (`<script src="https://cdn.tailwindcss.com"></script>`).
- Inline vanilla `<script>` for any interaction (tabs, toggles, mock fetches). No frameworks, no build step.
- Realistic placeholder data shaped like the real API responses (use the actual response shapes from `AGENTS.md` / the services layer where known).
- Every state the sub-phase implies is represented (empty, loading, error, populated) where practical.

## Reference bar

Every mockup ends with a fixed reference bar identifying it:
```html
<div class="...">
  Sub-phase X.Y — [sub-phase title]
  <span>Variant: [name] — [one-sentence approach/tradeoff]</span>
</div>
```

## Naming and location

- Directory: the project's mockup directory (per @AGENTS.md).
- Filename: `phase-X-Y-[variant-name].html` (e.g. `phase-3-4-drawings-panel-tabs.html`)
- Commit them — they are part of the repo, never gitignored.

## Output

For each variant return: the file path, the variant name, and the one-sentence tradeoff. List any requirements you could not represent in a static mockup.

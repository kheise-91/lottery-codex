# Explorer report template

Return your findings in exactly this structure. Replace the bracketed placeholders.

```md
# Explorer Report: [Area]

## Overview
[1-2 paragraphs: what this area is, its role in the app, and how it connects to the rest of the system]

## Structure
[The directory layout of the area, with a one-line purpose for each file/directory that matters. Use a tree or a list.]

## Key Patterns
[The recurring patterns a writer must match — naming, file shapes, how components/classes are organized, how data flows between them. Reference specific files as examples.]

## Conventions Observed
[Style specifics seen in the code: docblock style, state management, error handling, import style, CSS approach, etc. Note anything that contradicts AGENTS.md.]

## Notes for [Planning/Implementation]
[Anything the caller must know before acting on this report — gotchas, dependencies, dead code, places where the code and AGENTS.md disagree, and the safest entry point for a change.]
```

Keep it dense and factual. No filler. If a section has nothing to report, write "None" rather than omitting the heading.

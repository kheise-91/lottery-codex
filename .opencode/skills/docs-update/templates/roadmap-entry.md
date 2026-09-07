# ROADMAP.md status-entry format

When a sub-phase is set up, its checkbox line becomes a linked, in-progress entry; when it completes, the same entry is ticked. Use this exact shape:

```md
- [-] **[X.Y — Sub-phase title](https://gitea.heise.home/kheise/lottery-codex/milestone/N)**   (in progress)
- [x] **[X.Y — Sub-phase title](https://gitea.heise.home/kheise/lottery-codex/milestone/N)**   (complete)
```

Rules:
- The link target is the **milestone** URL. The milestone number `N` is supplied by the orchestrator (fetched via `git-manager`). Never guess or invent it.
- The title text inside the bold markers is unchanged from the spec — only the checkbox and the link wrapper change.
- The indented implementation-note bullets and the `**Done when:**` line beneath the checkbox line are left exactly as-is.

Example (real, from Phase 0.1):
```md
- [x] **[0.1 — Fix SuperCash fatal error](https://gitea.heise.home/kheise/lottery-codex/milestone/12)**
   - [implementation note bullet, unchanged]
   - [another note bullet, unchanged]

   **Done when:** [unchanged]
```

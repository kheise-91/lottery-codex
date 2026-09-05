## Tool Review Part 3
Make sure any !-commands dont read like this: `!` git diff. The "`" character was only for me to point it out. If used anywhere, as with @, it should read like "!git diff", or "@project-explorer".

1. (and 2.) Let's do the model name specification in the command as you suggested, with the exact suggestions you laid out (/brainstorm -> Enoch-III etc). Please also update any references to the agent names as I changed them. There were places you found that I forgot to update. Please do that for me.

3. I like how you split the `plan-issue` skill into three. That's perfect and exactly what I wanted.

4. Please do the suggested explorer agent fix: reword. So the explorer agent isn't restricted from using the filesystem MCP tools.

5. Issue body plan suggestion looks good. Let's do that.

6. Conventional commits - I will keep my current format. Let's disregard this for now.

7. Go ahead with all those changes, except the git-ops manager. I will either add a disclaimer like we discussed that Gitea and the Gitea MCP server is required, or it can be used as a tmeplate for working with other git managing MCP servers. For now, let's not worry about that though. That will come later when we make the plugin. I want the git-ops agent to keep Gitea specifics as my whole workflow is pretty reliant on Gitea.

8. Playwright MCP you got what I wanted perfectly. This will allow the plugin to be used by others who do not have that installed. For the Muse model, I did rename it in my llama.cpp config, I haven't updated it everywhere yet, but I will from here on out be calling it just "Muse".

9. Let's do everything as your laying out here, the command templates etc - that all makes sense. I was confused about how the "!" and "@" stuff worked.

10. I like the qa command, let's call the command "qa-review" though. Let's NOT spawn the docs-manager in the `complete-issue` command, and only inside the `complete-sub-phase` command. We don't need both. We'll just do a quick docs check and update when a sub-phase is complete. Also, in the `complete-sub-phase`, we can have the agent open a PR into the phase branch. I'm okay with the agent doing this work also, it should be cut down how much manual work I'm doing myself. When I approval PRs for all the issues made for a sub-phase into the sub-phase branch, I'll run the new `complete-sub-phase` to update all documentation and open the PR into the phase branch. Please make sure this is gated by a milestone issue check to make sure the issues are all closed, if that's possible to do. Only then will the roadmap be updated and the sub-phase marked as complete.

---

## Other notes
I will keep the `project-explorer` name, I like that one. Everything else looks good for this.

Let's make sure the that model name (Enoch - Enoch-III) are ONLY specified in the commmands, nowhere else.

---

## Decisions you needed from me

1. The existing "Muse" is what we'll use. We'll just refer to it as Muse now
2. Bump to Enoch-II - I will do this myself.
3. Keep the same commit format - NO changes with this
4. qa-review
5. Keep as project-explorer
6. No docs-check in the `complete-issue` skill anymore. Docs check and update will only be in `complete-sub-phase`. The three files it's responsible for: ROADMAP.md, README.md, AGENTS.md - with README.md and AGENTS.md being very rarely updated - only when necessary. I've had a lot of issues with agents re-writing parts of these documents when they should not have. ROADMAP.md is only updated to keep the progress (checking boxes and milestone links) up-to-date. The docs-manager can perform more detailed updates on these files when needed ad-hoc, but NOT as part of the `complete-sub-phase` command. When invoked in that command, the writes to those files should be very limited in size and scope. With our re-factoring of the wholes docs system, NO agent under ANY circumstance should modify files in the `docs/` folder moving foward. That fold is now 100% human maintained.
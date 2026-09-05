# Summary

I feel like a lot in my current workflow may actually be hindering what my local models and agents are capable of. The whole process of creating small tasks with Gitea issues followed by plans for the issues followed by excuting the plans along with the Gitea project kanban boards and milestones - this makes sense for a physical developer like myself. But I feel like I could create a more efficient system for my AI models and agents to work better and faster while still tracking work in Gitea. I'm hoping to either be more hands-off OR do the same amount of work, but have the agents work more efficiently.

If possibe, I would like to keep most, if not all, of the agents I created. I would like to just update them to fit whatever new workflow we decide on. The commands obviously are directly tied to the workflow.

Please review my current agents, commands, and documentation for my workflow and processes. Do NOT read anything in the `.claude/` direrctory as its not being used and outdated.
Help me analyze and refine my workflow and processes involved. I'm very open to suggestions, even if they require substantial changes. Remember that I want my solution to be capable of being applied to ANY project, not just this one. I have some notes below also, with things that I was considering changing.

Part of the reason for this current workflow was so I could using a model with thinking mode to plan all the tasks and then switch to a model with no thinking enabled to quickly execute the plans. I'm not sure how else I can accomplish this while also increasing the speed and efficiency I want to achieve.

Main purpose of reviewing and possibly re-writing the commands/agents/skills:
- Streamline entire workflow
- Trying to remove any extra "busy" work that's not needed
- Looking for ways to improve efficiency while working with AI tools
- Want to understand other approaches aside from my own
- Manage session context and agents' project memory across sessions and throughout the entire project lifecycle
- Curious about industry standard and/or professional methodologies that accomplish what I have listed here and what I'm trying to accomplish with my custom agents, commands, and skills.

---

# Notes / Possible Ideas For Improvements

One idea I had, that I think would be useful no matter HOW we change this stuff, would be to separate out some of work in the `commands/` and put them in new Skill files. 

The idea behind this change: run a command that spawns subagents who use skills.

Keep in mind as you review the list below, these are all just ideas I had. There are a few things in the list that I'm leaning towards having as requirements for our updates, but right now, I want to just discuss and plan with you.

List of ideas/thoughts for improvements:
* CREATE / REVIEW ROADMAP
    - I want to make sub-phases larger.
    - Right now I'm creating a sub-phase branch and then a branch for the Gitea issue, and each sub-phase ends up having only 1 issue.
    - A sub-phase should be more than just a single issue. One issue per sub-phase makes creating branches for both tedious. Each sub-phase should be AT least 2 issues worth of work, with 5 as a soft upper limit to how many issues are created per sub-phase.
    - Keep in mind this has already been corrected for this project's roadmap. It was just refactored to contain more than 1 issue's worth of work

* CREATE NEW COMMAND: `update-roadmap`
    - Reviewes mockup and updates the sub-phase description (assumes mockup has been edited and/or represents the next sub-phase PERFECTLY)
    - OR: Should roadmap be updated? Or should the mockup review and detailed description be a part of the sub-phase creation, like it is with the create/execute issue plans? Problem with this: roadmap always overrules the mockup when creating a sub-phase
    - Is there a better, more efficient solution then generating the mockup from the roadmap, then updating the roadmap based on that mockup? If that is the best way, I don't mind doing it. I'm just wondering if maybe there's a path that I haven't considered.

* ADD TO COMMANDS `create-sub-phase` AND `create-issue-plan`
    - Instruct agent to read all `docs/` READMEs, and then specific docs files as needed
        - If more information is needed, spawn explorer subagent for all information gathering tasks
    - OR: COMBINE `create-sub-phase` AND `create-issue-plan`
        - No point in creating a plan file - the Gitea issue should contain complete plan for implementation and all details required.
    - MAYBE: have `create-sub-phase` lay out a plan for the entire sub-phase (saved as a file) - then each `implement-task` (new command) refers to it.
    - Some tasks are so small that they don't really require a plan, but my execute command requires a plan file
* OPTMIZE AGENTS, COMMANDS, AND SKILLS:
    - Make sure every agent has 2 modes: generic and specific (for use with commands/skills... engineer has 2 workflow modes)
        - I want each type (engineer, explorer etc) to be able to follow the orchestrator's commands most importantly, as the orchestartor will be using them and not myself. So maybe the "2 modes" might not be a good idea, as I will rarely, if ever, directly interact with a subagent myself. They will almost exclusively be used by the orchestrator.
        - I'm wondering if it would be better to have a generic explorer, generic reviewer, etc? I would like to have all Agents, Commands, Skills etc available to use with other projects, and these are all kind of "specialized". I was considering try to write my own "brainstorm -> plan -> execute -> review" type plugin for others to use or for myself to use in other projects.
* CREATE AGENT SKILLS
    - Move specific instructions out of commands into skills geared towards agents.
    - Commands should be very clean and clear: spawn agent and instruct to use it's skill
    - Move any templates (report format, PR format, issue plan) into template files to be used as references
    - Have subagents read the template files to use the formats found (NOT the orchestrator)
    - Use the '!' syntax for all bash related operations (and confine to skills, not the commands)
* PROJECT CONTEXT / MEMORY
    - Is the current `docs/` with the `docs-manager` a good solution? The purpose was to load the documentation (such as context, hooks, components etc) as context so the planning/building agents don't need to read actual code.
        - It seems that any agent reading the docs ends up reading the actual proejct code anyway, which seems to defeat the purpose of the `docs/` folder.
        - For each new actual file of code added, it seems like theres 2+ doc files getting added, which I'm worried ADDING to the context instead of helping me REDUCE context overload.
        - I just set up Opencode-DCP, auto-compaction, and a Filesystem MCP server to help agents find and work with files, and manage context. So I'm not sure having this whole `docs/` setup for the project is even necessary anymore.

**MOST IMPORTANT**
One thing I'd really like to to consider doing is using some of the ideas and and workflows I've been using to build a plugin. That way I can drop something into my future planned projects and get up and running with agents/commands/skills very easily. Unfortunately, some of the stuff right now (especially the agents) are geared for THIS project. I would rather have more generic agents/commands/skills so I can do this.

The workflow for a possible plugin would look something like this: "brainstorm project -> plan tasks -> execute tasks -> review work -> merge work -> rinse and repeat". I would definitely want the following MCP Servers to be used with the plugin, to have a complete Web Software Development workflow available for anyone who uses the plugin:
- Gitea MCP or GitHub MCP (I use Gitea)
- Playwright MCP (for agents to review and/or debug front-end results)
- Filesystem MCP (to help agents find/review/edit files and to reduce tokens and context usage)

---

# Required Context
Agents - @.opencode/agents/
Commands - @.opencode/commands/
Docs - @docs/guides/ - keep in mind these docs are outdated. I changed the file names and some information since migrating from Claude Code. These docs should be used for reference as to what I'm trying to accomplish - do NOT accepct anything in here as the source of truth. The current state of the the @.opencode/ directory and sub-directories is what I've been using.
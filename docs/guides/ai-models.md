---
name: ai-models-guide
title: AI Models Guide
description: A comprehensive list of local models used during the development of this project, and how each model was used.
---

# Local AI models — usage guide

Six models are available via llama-swap. All share the same 256K-class context window and run locally with no API costs. Parameters and commands live in `config.yaml`; this document covers when and why to use each one.

---

## Model Roster

| Name | Claude Code Alias | Base Model | Quant | Architecture | MTP | Thinking |
| ---- | ----------------- | ---------- | ----- | ------------ | --- | -------- |
|`Qwen-Agent`|none (default)|Qwen3-Coder-Next|UD-Q4_K_XL|80B MoE · 3B active|No|None|
|`Quick-Coder`|`cc-quick-coder`|Qwen3.6-35B-A3B|UD-Q8_K_XL|35B MoE · 3B active|Yes|Off|
|`Swift-Reasoner`|`cc-swift-reasoner`|Qwen3.6-35B-A3B|UD-Q8_K_XL|35B MoE · 3B active|Yes|On|
|`Precise-Coder`|`cc-precise-coder`|Qwen3.6-27B|UD-Q4_K_XL|27B dense|Yes|Off|
|`Deep-Reasoner`|`cc-deep-reasoner`|Qwen3.6-27B|UD-Q4_K_XL|27B dense|Yes|On|
|`Titan-Coder`|`cc-titan-coder`|Qwen3.5-122B-A10B|UD-Q3_K_XL|122B MoE · 10B active|Yes|Off|
|`Titan-Reasoner`|`cc-titan-reasoner`|Qwen3.5-122B-A10B|UD-Q3_K_XL|122B MoE · 10B active|Yes|On|

---

## Model Information
 
### `Qwen-Agent`
 
**Qwen3-Coder-Next · UD-Q4_K_XL · no thinking**
 
Purpose-built for agentic workflows. Unlike the general 3.6 models, Coder-Next was trained specifically on 800K executable coding tasks with real environment feedback — tool calls, bash loops, file edits, and failure recovery. Nothing else in this lineup was trained the same way.
 
It has no thinking mode by design; it's optimized for decisive, low-latency tool actions rather than extended internal reasoning. In a Claude Code session you're waiting on tool execution more than token generation anyway, so the slower raw speed matters less.
 
**Use with:** Claude Code (`claude` command).
 
**Reach for it when:**
 
* Starting any `claude` session
* Running multi-step agentic tasks (edit → test → fix loops)
* Working across multiple files or an entire repo
* Any workflow that relies on tool use and execution feedback

---
 
### `Quick-Coder`
 
**Qwen3.6-35B-A3B · UD-Q8_K_XL · thinking off**
 
Your fastest model for everyday coding tasks. MoE architecture activates only ~3B parameters per token (~9 of 256 experts), which makes it 2–3x faster than the 27B dense models despite being a larger file. Quality is slightly below `Precise-Coder` on hard benchmarks (73.4% vs 77.2% SWE-bench Verified), but on everyday tasks the gap is small and the speed difference is noticeable. Also vision-capable — paste a screenshot or diagram and it can reason about it.
 
Good default for Continue.dev chat. Switch to `Precise-Coder` when quality starts to matter.
 
**Use with:** Claude Code / Continue.dev
 
**Reach for it when:**
 
* Explaining what a function or block of code does
* Writing boilerplate, stubs, or repetitive patterns
* Quick one-shot fixes where the problem is obvious
* Code review and light feedback
* You want a near-instant answer and aren't at the difficulty ceiling

---
 
### `Swift-Reasoner`
 
**Qwen3.6-35B-A3B · UD-Q8_K_XL · thinking on**
 
Same weights as `Quick-Coder` with thinking enabled. MoE efficiency still applies to the non-reasoning parts, so thinking tokens are produced faster here than in `Deep-Reasoner`. The trade-off is shallower reasoning than the 27B dense model — the 27B leads by ~8 points on Terminal-Bench 2.0. Still a meaningful upgrade over `Quick-Coder` for anything that benefits from a deliberation pass.
 
Think of it as the middle option: more than `Quick-Coder`, less wait than `Deep-Reasoner`.
 
**Use with:** Claude Code / Continue.dev
 
**Reach for it when:**
 
* Moderate debugging — not trivial, but not a head-scratcher either
* Logic-heavy code generation where the structure needs thought
* `Quick-Coder` gave a wrong or shallow answer and you want a retry with reasoning
* You want some deliberation but `Deep-Reasoner` feels like overkill

---
 
### `Precise-Coder`
 
**Qwen3.6-27B · UD-Q4_K_XL · thinking off**
 
The highest-quality coding model in the lineup. Dense architecture means every one of its 27B parameters fires on every token — no routing, no sparsity, just full model capacity.
 
Benchmarks back this up: 77.2% on SWE-bench Verified (within 3.7 points of Claude Opus 4.6), 59.3% on Terminal-Bench 2.0. Thinking is off, so responses are direct and fast relative to `Deep-Reasoner` — use this when you already know what you want and just need it done right.
 
**Use with:** Claude Code / Continue.dev
 
**Reach for it when:**
 
* Writing new features or functions from scratch
* Fixing a specific known bug
* Generating tests for existing code
* You want the best output quality and `Quick-Coder` isn't cutting it
* You want one tier above `Quick-Coder` but don't yet need the largest model in the roster — `Titan-Coder` is the next step up when this isn't enough

---
 
### `Deep-Reasoner`
 
**Qwen3.6-27B · UD-Q4_K_XL · thinking on**
 
Same weights as `Precise-Coder`, different mode. Thinking enabled means the model works through the problem step-by-step inside `<think>` blocks before committing to a response. The 27B dense architecture gives it the most reasoning depth in the lineup — it will out-think both MoE models on hard problems. Worth the extra wait on genuinely difficult tasks.
 
**Use with:** Claude Code / Continue.dev
 
**Reach for it when:**
 
* Debugging something subtle — race conditions, off-by-one errors, async timing issues
* Designing system architecture or weighing technical tradeoffs
* Tracing through unfamiliar or complex code to understand what it actually does
* Any task where `Precise-Coder` or `Quick-Coder` gave you a shallow or wrong answer
* You want the deepest reasoning available short of `Titan-Reasoner` — reach for `Titan-Reasoner` when even this isn't enough on the hardest problems

---

### `Titan-Coder`
 
**Qwen3.5-122B-A10B · UD-Q3_K_XL · thinking off**
 
The largest and most capable model in the roster. 122B total parameters routed through a hybrid Gated DeltaNet + sparse MoE architecture (256 experts, 10B active per token) — more than 3x the active parameter count of the other MoE models here, giving it noticeably more headroom on complex, multi-step problems even with thinking disabled.
 
Benchmarks: 72.4% on SWE-bench Verified and 49.4% on Terminal-Bench 2.0 — putting it slightly ahead of `Qwen-Agent` on agentic coding tasks despite carrying no agentic-specific training. Vision-capable, with a native 262K context window extensible to 1M. MTP draft decoding matters a lot here — without it, the 10B active parameter count would make this noticeably slower than everything else in the lineup; with MTP, the gap narrows substantially.
 
**Use with:** Claude Code / Continue.dev
 
**Reach for it when:**
 
* You need the single highest-quality output in the roster and are willing to trade some speed for it
* Working through a genuinely hard, multi-faceted coding problem that benefits from a larger active parameter budget
* `Precise-Coder` produced a subtly wrong or incomplete answer on a complex task
* Tasks that benefit from a very large context window (extensible to 1M) — large-scale refactors or reasoning across a sprawling codebase

---
 
### `Titan-Reasoner`
 
**Qwen3.5-122B-A10B · UD-Q3_K_XL · thinking on**
 
Same weights as `Titan-Coder`, with thinking enabled. This is the deepest reasoning available in the roster — the combination of the largest active parameter count (10B) and full chain-of-thought reasoning gives it the highest ceiling for genuinely hard problems, at the cost of being the slowest model to respond.
 
Best reserved for the rare case where `Deep-Reasoner` isn't quite enough — gnarly architecture decisions, debugging issues that span multiple subsystems, or problems where getting the answer right the first time matters more than getting it fast.
 
**Use with:** Claude Code / Continue.dev
 
**Reach for it when:**
 
* The hardest problems in the project — ones where `Deep-Reasoner` has already come up short
* Architecture decisions with significant downstream consequences
* You can afford to wait for the best possible answer rather than a fast one
* Complex debugging that spans multiple files, layers, or subsystems at once

---

## Benchmark Reference

|Benchmark|`Qwen-Agent`|`Quick-Coder` / `Swift-Reasoner`|`Precise-Coder` / `Deep-Reasoner`|`Titan-Coder` / `Titan-Reasoner`|
|-|-|-|-|-|
|SWE-bench Verified|~74%|73.4%|**77.2%**|72.4%|
|SWE-bench Pro|~44%|~48%|**53.5%**|N/A|
|Terminal-Bench 2.0|~65%|51.5%|**59.3%**|49.4%|
|Vision input|No|Yes|Yes|Yes|
 
Coder-Next leads on Terminal-Bench due to its agentic training focus. The 27B dense leads on SWE-bench. All figures are at full/high precision — Q4 quants see a small reduction.

---

## Model Comparison

After an initial "Hello" prompt to load the model into memory, the following prompt was used to measure and compare model speeds:
> Generate a Laravel migration. This migration should include both the `up()` and `down()` functions for rolling back if needed. This migration will create a new table called `users` in a database called `app`. The table will have the following columns:
> - id (primary key, auto generated)
> - first_name
> - last_name
> - email_address
> - phone_number

### Results From `llama-swap`
| Model          | Base Model        | Quant      | MTP | Prompt (new prompt tokens processed) | Generated | Prompt Speed | Gen Speed | Duration |
| -------------- | ----------------- | ---------- | --- | ------------------------------------ | --------- | ------------ | --------- | -------- |
| Qwen-Agent     | Qwen3-Coder-Next  | UD-Q4_K_XL | No  | 113                                  |   483     | 57.16 t/s    | 44.44 t/s |  12.88s  | 
| Quick-Coder    | Qwen3.6-35B-A3B   | UD-Q8_K_XL | Yes |  99                                  |   487     | 69.46 t/s    | 51.92 t/s |  10.87s  |
| Swift-Reasoner | Qwen3.6-35B-A3B   | UD-Q8_K_XL | Yes | 116                                  | 1,427     | 49.31 t/s    | 54.45 t/s |  28.62s  | 
| Precise-Coder  | Qwen3.6-27B       | UD-Q4_K_XL | Yes | 125                                  |   424     | 77.93 t/s    | 10.94 t/s |  40.48s  | 
| Deep-Reasoner  | Qwen3.6-27B       | UD-Q4_K_XL | Yes |  92                                  | 2,388     | 60.41 t/s    | 10.12 t/s | 237.58s  |
| Titan-Coder    | Qwen3.5-122B-A10B | UD-Q3_K_XL | Yes |  99                                  |   488     | 37.41 t/s    | 25.35 t/s |  22.09s  |
| Titan-Reasoner | Qwen3.5-122B-A10B | UD-Q3_K_XL | Yes |  90                                  | 1,446     | 34.91 t/s    | 24.53 t/s |  61.71s  |
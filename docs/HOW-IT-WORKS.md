# SHINE — How It Works

A narrative walkthrough of what happens from `claude` → response, so you can debug and extend with intent. For the static layout, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 1. Session start

When you run `claude` in a project directory:

1. **Claude Code reads `~/.claude/settings.json`** — picks up the model, env vars, hooks, enabled plugins, MCP servers, and statusline command.
2. **SessionStart hooks fire in order** (5–15s timeouts each, all non-blocking on failure):
   - `global-memory-symlink.sh` — if `./memory` doesn't exist or is already a matching symlink, links it to `~/.claude/memory/`. Opt-out: `touch ~/.claude/.no-memory-symlink`.
   - `shine-check-update.js` — fetches the latest GitHub release tag (cached 24h) and prints a stderr notice if you're behind.
   - `integration-sync.js` — rewrites the `<!-- shine:plugins:begin -->` block inside `~/.claude/CLAUDE.md` so the routing rules always know what's connected.
3. **CLAUDE.md is loaded into the system prompt**, along with any `memory/preference-*.md` files (always-on) and the auto-synced plugins/MCP block.
4. **Statusline renders** — `statusline.js` prints `✨ SHINE · <model> · <cwd> · ⎇ <branch> · ◆ <client> · <ctx>KB`.

You now see the prompt. The model has the 20 decision rules, your preferences, and the list of available plugins/MCP in context — but not client memory or project memory yet. Those load lazily on demand.

---

## 2. The 20 decision rules

Every prompt is pattern-matched against the rules in `CLAUDE.md §Decision rules`. The rules are literal — you can read them. A few illustrative examples:

| # | Trigger | Action |
|---|---|---|
| 1 | "plan / strategy / roadmap" + technical scope | Delegate to `shine-planner` agent |
| 2 | "implement / build / code" + known files | Delegate to `shine-executor` agent |
| 3 | "why doesn't … / error / broken" | Delegate to `shine-debugger` agent |
| 4 | Any write + risky path (secrets, prod config) | Stop, ask for confirmation |
| 7 | "review PR / code review" | Run `shine-review` skill |
| 11 | Library / framework question | Route to `context7` plugin for live docs |
| 15 | Long-running sub-investigation | Spawn sub-agent via Task tool, don't inline |
| 16 | Any factual claim (company, person, number, URL) | Ground in a live retrieval, never fabricate |
| 17 | Client name + communication verb | Load `client-<slug>.md` + `style-email-*.md`, run `draft-email` skill |
| 18 | PII / personal data mentioned | Run `gdpr-analyst` check before storing |
| 19 | "proposal / preventivo" | Load client memory, run `proposal` skill (MoSCoW, MD, 15% discount) |
| 20 | Lead list mentioned | Run `lead-enrich` skill, Apollo/Hunter MCP |

When a rule fires, Claude does **exactly** what the rule says. If multiple rules match, the more specific one wins.

---

## 3. Skills vs agents — when each fires

- **Skills** = slash commands. You type `/proposal CONTOSO tech-SEO`; Claude reads `skills/proposal/SKILL.md` as a system instruction and runs it. Skills are explicit, single-shot, user-triggered.
- **Agents** = sub-agents spawned via the Task tool. Claude decides to delegate (per the decision rules) when a task needs fresh context or a different tool budget. Each agent runs in its own context window and returns a 5-section report.

Rule of thumb:

> **If the user asks for it by name → skill. If the main thread needs help staying focused → agent.**

---

## 4. Memory lifecycle

### Typed index

`memory/MEMORY.md` is the human-readable index. Each entry points to a file with frontmatter:

```yaml
---
type: client              # preference | client | project | style | external
name: CONTOSO Italia
last_updated: 2026-04-14
tags: [tech-seo, salesforce, flat-budget]
---
```

### Load strategy

- `type: preference` — injected on every SessionStart, always available.
- `type: client` — loaded when the client slug appears in the prompt (rule #17, #19, #20).
- `type: project` — loaded when a project slug is mentioned.
- `type: style` — loaded alongside the matching client/project.
- `type: external` — lazy; only fetched when a skill explicitly requests it.

### Volatility

- `memory/` is **stable** — update rarely, after a pattern is validated.
- `sessions/` is **volatile** — precompact snapshots, active-client marker, ephemeral scratch.
- Never store secrets in either. Credentials belong in macOS Keychain or `~/.config/<tool>/` files referenced by your shell env.

---

## 5. Tool-use lifecycle (PreToolUse → PostToolUse)

When Claude invokes a tool (Bash, Edit, Write, Agent, Task, …):

1. **PreToolUse hooks fire** (if the matcher matches the tool name):
   - `shine-prompt-guard.js` on `Write|Edit` — inspects `file_path` and `content` for secret-shaped patterns (sk-…, ghp_…, AKIA…, AIza…, Stripe live, Slack xox, PEM). On hit, **exits 2 — aborts the tool call** and tells the model why. Opt-out: `SHINE_DISABLE_PROMPT_GUARD=1`.
   - `shine-read-guard.js` on `Write|Edit` — warns (stderr, exit 0) when the path is `node_modules/`, `dist/`, a lockfile, etc.
2. **Tool runs** (unless aborted).
3. **PostToolUse hooks fire**:
   - `shine-context-monitor.js` on `Bash|Edit|Write|MultiEdit|Agent|Task` — checks transcript size; at 800 KB prints a "soft limit" notice, at 1.6 MB a "hard limit" notice. Thresholds tunable via `SHINE_CONTEXT_SOFT_KB` / `SHINE_CONTEXT_HARD_KB`.

No hook can rewrite tool input. They can **block** (exit 2) or **warn** (stderr + exit 0). This is deliberate — we want hooks to be easy to reason about.

---

## 6. PreCompact — the snapshot you'll thank yourself for

When Claude Code triggers a compact (auto or manual), `shine-precompact.js` writes a small Markdown file to `~/.claude/sessions/precompact-<timestamp>.md`:

```markdown
# SHINE pre-compact snapshot
- **When:** 2026-04-15T09:41:23.000Z
- **Trigger:** auto
- **Last tool:** Edit
- **CWD:** /Users/you/work/contoso-tech-seo
```

Retention is 20 by default (`SHINE_PRECOMPACT_KEEP`). After a compact you lose a lot of context; this file is how you quickly orient yourself — "I was in the CONTOSO project, last edited a file, compact was automatic."

---

## 7. Two canonical flows

### 7.1 "Draft a reply to Jamie about ACME link building"

1. Prompt matches **rule #17** (client `ACME` in memory + "draft / reply").
2. Claude loads `memory/client-acme.md` + `memory/style-email-it.md`.
3. Reads the last thread via Gmail MCP (you@youragency.com).
4. Spawns the `draft-email` skill → produces subject `ACME | <topic>`, warm IT opening, bullet body, short sign-off, correct CC list (Alex + Morgan).
5. Output is a **draft**, never auto-sent — CLAUDE.md §16 + skill `<guardrails>`.

### 7.2 "Proposta per CONTOSO SEO Q2 2026"

1. Prompt matches **rule #19** (keyword `proposta / proposal`).
2. Claude loads `memory/client-contoso.md` (flat budget, tech-SEO focus, Salesforce CRM, Sam Taylor).
3. Runs the `proposal` skill:
   - MoSCoW structure
   - MDs at 8h each
   - ~15% discount option flagged
   - Italian language, Kevin's proposal style
   - Proposes a discussion call **before** sending the PDF.
4. Returns a draft `.md` file for Kevin to review, not a sent document.

---

## 8. Failure modes & debugging

| Symptom | Likely cause | Fix |
|---|---|---|
| SessionStart feels slow | A hook is hitting a network timeout | `SHINE_DISABLE_UPDATE_CHECK=1`, or check `~/.claude/cache/shine-update.json` |
| `/integration-sync` block not updating | `integration-sync.js` can't write CLAUDE.md | Check permissions; run `node ~/.claude/hooks/integration-sync.js` manually |
| Writes blocked with "prompt-guard" | Real secret detected | Move the secret to env / keychain; if false positive, `SHINE_DISABLE_PROMPT_GUARD=1` for the session |
| Hallucinated company facts | Rule #16 not firing | Add the specific fact pattern to CLAUDE.md or to the skill's `<guardrails>` |
| Update notice keeps appearing after updating | Cache stale | `rm ~/.claude/cache/shine-update.json` |

For deeper customization — adding your own agents, skills, hooks, or rewriting decision rules — see [CUSTOMIZATION.md](./CUSTOMIZATION.md).

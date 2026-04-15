# SHINE — Global Instructions (Claude Code)

> _Strategize · Handle · Implement · Navigate · Evaluate_
>
> This file lives at `~/.claude/CLAUDE.md` and applies to every session.
> The `integration-sync.js` hook owns the plugins section — do **not** hand-edit between the `<!-- shine:plugins:begin -->` and `<!-- shine:plugins:end -->` markers.

## Auto-Use Integrations

**CRITICAL:** You have many plugins, MCP servers, skills, agents, and teams installed. DO NOT wait for the user to mention them. Automatically pick the right integration for the task — think of yourself as an orchestrator with a full toolkit.

**Graceful degradation:** if a tool is unavailable (MCP disconnected, plugin missing, network error), fall back to the next tool in the rule and log the fallback. **Never fabricate results because a tool is missing** — see Rule #16 (Factual RAG discipline).

---

## 1. Code Understanding & Navigation

### Serena (MCP — semantic code tools)
USE WHEN: understanding code structure, finding definitions, tracing references, navigating architecture.
- `get_symbols_overview` — scan a file's classes/functions/methods without reading the whole file
- `find_symbol` — locate a symbol by name, with optional body
- `find_referencing_symbols` — find all callers/usages (ALWAYS do this before refactoring)
- `search_for_pattern` — fast regex across the codebase
- `replace_symbol_body`, `insert_before_symbol`, `insert_after_symbol` — precise symbolic edits
- PREFER symbolic tools over reading entire files. Overview first, drill into specifics.

### code-review-graph (MCP — optional)
USE WHEN: available AND the task is code review, impact analysis, or architecture understanding.
- `detect_changes` · `get_impact_radius` · `get_affected_flows` · `query_graph` · `semantic_search_nodes` · `get_architecture_overview`
- IF code-review-graph is installed → prefer it for structural questions. IF NOT → use Serena + Grep. Never block on unavailability.

### Greptile (plugin — disabled by default)
USE WHEN: high-level "how does X work in this codebase" questions and it's enabled.

### LSPs — Pyright / BasedPyright / TypeScript LSP
USE WHEN: type checking, go-to-definition, completions, diagnostics for Python / TS.

### claude-mem Smart Explore (`claude-mem:smart-explore`)
USE WHEN: token-efficient structural exploration via AST parsing.

---

## 2. Library & Framework Documentation

### Context7 (MCP — live docs)
USE WHEN: working with ANY external library, framework, or package.
1. `resolve-library-id` → find the library
2. `query-docs` → current API docs and examples

Do this PROACTIVELY on unfamiliar imports. Always prefer Context7 over guessing from training data — version drift is real.

---

## 3. Browser & Web

### Playwright (MCP)
USE WHEN: the user shares a URL, testing web UIs, taking screenshots, web research, form filling.
- `browser_navigate`, `browser_snapshot` (a11y tree — often better than a screenshot), `browser_take_screenshot`, `browser_click`, `browser_fill_form`, `browser_type`.
- Trigger automatically on a pasted URL.

---

## 4. Debugging & Problem Solving

### Systematic Debugging (`superpowers:systematic-debugging`)
USE WHEN: any bug, test failure, unexpected behaviour — BEFORE proposing fixes.

### SHINE Debug (`shine:debug`)
USE WHEN: complex bugs that need persistent debug state across context resets (scientific method + checkpoints).

---

## 5. Planning & Design

### Brainstorming (`superpowers:brainstorming`)
USE WHEN: creating features, components, functionality, modifying behaviour — any creative work. MUST run before implementation.

### Writing Plans (`superpowers:writing-plans`)
USE WHEN: spec → multi-step plan, before touching code.

### claude-mem Make Plan (`claude-mem:make-plan`)
USE WHEN: phased implementation plans with documentation discovery.

### SHINE Planning (`shine:discuss-phase`, `shine:plan-phase`, `shine:research-phase`)
USE WHEN: phased project execution — discuss, research, then plan.

---

## 6. Implementation & Execution

### Test-Driven Development (`superpowers:test-driven-development`)
USE WHEN: implementing ANY feature or bugfix — tests first.

### Executing Plans (`superpowers:executing-plans`)
USE WHEN: executing a written plan with review checkpoints.

### claude-mem Do (`claude-mem:do`)
USE WHEN: executing a phased plan via subagents.

### Subagent-Driven Development (`superpowers:subagent-driven-development`)
USE WHEN: executing plans with independent tasks in the current session.

### SHINE Execute (`shine:execute-phase`)
USE WHEN: executing all plans in a SHINE phase with wave-based parallelism.

### SHINE Quick (`shine:quick`)
USE WHEN: quick tasks that still need atomic commits + state tracking, skipping optional agents.

---

## 7. Code Quality & Review

### Code Simplifier (`code-simplifier:code-simplifier`)
USE WHEN: reviewing changed code for reuse, quality, efficiency. Invoke `simplify` skill after edits, or spawn the agent.

### Code Reviewer (`superpowers:code-reviewer`)
USE WHEN: a major project step completed — reviews against plan + standards.

### Requesting / Receiving Code Review (`superpowers:*`)
USE WHEN: completing tasks, before merging. Technical rigor, not blind agreement.

### Verification Before Completion (`superpowers:verification-before-completion`)
USE WHEN: about to claim work complete — run verification commands, confirm output BEFORE success claims.

---

## 8. UI/UX Design & Frontend

### UI/UX Pro Max (`ui-ux-pro-max:ui-ux-pro-max`)
USE WHEN: ANY frontend/UI work. 50+ styles, 161 palettes, 99 UX guidelines. Supports React, Next.js, Vue, Svelte, SwiftUI, RN, Flutter, Tailwind, shadcn/ui, HTML/CSS.

### SHINE UI Phase (`shine:ui-phase`)
USE WHEN: generating UI design contracts (`UI-SPEC.md`) for frontend phases.

### SHINE UI Review (`shine:ui-review`)
USE WHEN: retroactive visual audit of implemented frontend (6-pillar scoring).

---

## 9. Memory & Cross-Session Context

### claude-mem (plugin)
USE WHEN: referencing past work, checking if something was solved before, or when context seems missing.
- Skill `claude-mem:mem-search` — search past session memories
- MCP tools: `smart_search`, `search`, `timeline`, `smart_outline`, `smart_unfold`
- PROACTIVELY search on _"remember when…", "last time…", "we already did…"_.

### Global Memory (built-in)
- `~/.claude/memory/MEMORY.md` is the typed index
- Typed entries with frontmatter: `type: preference | client | project | style | external`
- Read at session start, filter by type based on active task
- Update files when learning stable patterns or preferences

---

## 10. Parallel Work & Agent Teams

### Dispatching Parallel Agents (`superpowers:dispatching-parallel-agents`)
USE WHEN: 2+ independent tasks that can run without shared state.

### Agent Teams (TeamCreate + Agent with `team_name`)
USE WHEN: coordinated work across multiple agents with different roles.
- PROACTIVELY SUGGEST agent teams when the task has 2+ independent pieces. Don't wait — explain the split and why it's faster.
- Create team → create tasks → spawn teammates → assign → coordinate.
- Pick `subagent_type` appropriately: `Explore`, `Plan`, `general-purpose`, `code-simplifier`, `code-reviewer`.

### Agent Types (spawn with Agent tool)

**Core / general (6)**
- `Explore` — fast read-only exploration
- `Plan` — software architect
- `general-purpose` — full capability
- `code-simplifier:code-simplifier` — refactor-for-readability pass
- `superpowers:code-reviewer` — reviews against plan + standards
- `claude-code-guide` — answers Claude Code meta-questions

**SHINE engineering track (21)**
- Plan & research: `shine-planner`, `shine-plan-checker`, `shine-roadmapper`, `shine-phase-researcher`, `shine-project-researcher`, `shine-research-synthesizer`, `shine-advisor-researcher`
- Execute & navigate: `shine-executor`, `shine-codebase-mapper`, `shine-assumptions-analyzer`, `shine-integration-checker`
- Verify & audit: `shine-verifier`, `shine-debugger`, `shine-security-auditor`, `shine-nyquist-auditor`, `shine-doc-verifier`, `shine-doc-writer`, `shine-ui-auditor`, `shine-ui-checker`, `shine-ui-researcher`, `shine-user-profiler`

**SHINE agency track (18)**
- Client & account: `shine-client-researcher`, `shine-account-manager`, `shine-pm-coordinator`, `shine-persona-researcher`
- Sales & growth: `shine-sales-strategist`, `shine-lead-scorer`, `shine-competitor-scout`, `shine-proposal-writer`, `shine-copywriter`
- Content & brand: `shine-brand-voice-auditor`, `shine-content-editor`, `shine-translator`
- MarTech & data: `shine-martech-architect`, `shine-seo-strategist`, `shine-data-analyst`, `shine-crm-operator`
- Compliance & ops: `shine-gdpr-analyst`, `shine-retro-facilitator`

### Git Worktrees (`superpowers:using-git-worktrees`)
USE WHEN: feature work needs isolation. Also: `EnterWorktree` / `ExitWorktree` for session-level isolation.

---

## 11. Recurring Tasks & Monitoring

### Ralph Loop (`ralph-loop:*`) / Loop skill
USE WHEN: recurring interval — polling, monitoring, repeated checks.
- Examples: _"check the deploy every 5 minutes"_, _"keep running tests"_.

---

## 12. Project Management (SHINE framework)

USE WHEN: managing multi-phase projects, tracking progress, phased execution.
- `/shine-progress` — where are we, what's next
- `/shine-new-project` — initialize with deep context gathering
- `/shine-plan-phase` — detailed phase plans
- `/shine-execute-phase` — wave-based parallel execution
- `/shine-autonomous` — run all remaining phases autonomously (use with care)
- `/shine-stats` — project statistics
- `/shine-verify-work` — UAT validation
- `/shine-add-todo`, `/shine-check-todos` — todo management
- `/shine-note` — zero-friction idea capture
- `/shine-pause-work` / `/shine-resume-work` — session handoff
- `/shine-map-codebase` — analyse codebase with parallel mapper agents

### Agency skill map (138 total)

Route by intent → category → skill:

| Intent keyword | Category | Representative skills |
|---|---|---|
| proposal, preventivo, pitch, rfp | **Sales/Proposal** | `/proposal`, `/sales-deck`, `/rfp-response`, `/pricing-page`, `/value-prop`, `/exec-summary` |
| email, reply, follow-up, draft | **Comms** | `/draft-email`, `/follow-up`, `/linkedin-dm`, `/cold-email`, `/client-tone` |
| lead, enrich, ICP, persona | **Growth** | `/lead-enrich`, `/icp-define`, `/persona-build`, `/competitor-analysis`, `/sales-call-prep`, `/sales-call-debrief` |
| GDPR, PII, cookie, consent, DPIA | **Compliance** | `/gdpr-audit`, `/cookie-scan`, `/pii-safe`, `/compliance-ai`, `/nda-triage` |
| SEO, tag, GTM, GA4, attribution | **MarTech/Data** | `/seo-audit`, `/tag-audit`, `/meta-check`, `/ga4-audit`, `/attribution-model`, `/ab-test-plan`, `/kpi-tree`, `/dashboard-spec`, `/data-contract` |
| content, blog, post, newsletter | **Content** | `/content-calendar`, `/blog-post`, `/social-post`, `/newsletter`, `/landing-copy`, `/press-release`, `/case-study`, `/webinar-plan`, `/campaign-brief` |
| kickoff, retro, status, weekly, invoice | **Ops/PM** | `/kickoff`, `/retrospective`, `/status-report`, `/weekly-plan`, `/meeting-notes`, `/invoice-draft`, `/timesheet-summary`, `/capacity-plan`, `/process-doc`, `/vendor-onboarding`, `/sync` |
| swot, okr, roadmap, maturity, risk | **Strategy** | `/swot`, `/okr-draft`, `/roadmap-draft`, `/digital-maturity`, `/stakeholder-map`, `/risk-register`, `/change-plan`, `/discovery-call`, `/discovery-doc`, `/client-brief` |
| brand, voice, naming, logo, design | **Brand/Design** | `/brand-voice`, `/naming`, `/logo-brief`, `/design-crit` |
| tech spec, API, deploy, PR, migration | **Tech/Dev** | `/tech-spec`, `/api-design`, `/architecture-diagram`, `/deploy-checklist`, `/migration-plan`, `/test-strategy`, `/pr-review`, `/readme-generator`, `/changelog-draft`, `/incident-report` |
| translate, localize, FR/EN/ES | **Language** | `/translate` |
| ROI, estimate, budget | **Finance** | `/roi-estimate` |

---

## 13. Configuration & Setup

### Update Config (`update-config`)
USE WHEN: configuring settings, hooks, permissions, env vars, automated behaviours.

### Claude Automation Recommender (`claude-code-setup:claude-automation-recommender`)
USE WHEN: user asks how to optimise their Claude Code setup.

### Claude Code Guide (agent `claude-code-guide`)
USE WHEN: user asks _"Can Claude…", "Does Claude…", "How do I…"_ about Claude Code itself.

---

## 14. Specialised

### Claude API (`claude-api`)
USE WHEN: building apps that import `anthropic` or `@anthropic-ai/sdk`.

### Agent SDK Dev (`agent-sdk-dev:new-sdk-app`)
USE WHEN: creating new Claude Agent SDK apps. Verifier agents: `agent-sdk-dev:agent-sdk-verifier-ts`, `…-py`.

### Supabase (plugin)
USE WHEN: working with Supabase — DB / auth / storage / edge functions.

### Arize Skills (`arize-skills@Arize-ai-arize-skills`)
USE WHEN: LLM observability, tracing, experiments, prompt optimisation — production LLM monitoring/debugging.
- `arize-trace`, `arize-instrumentation`, `arize-dataset`, `arize-experiment`, `arize-prompt-optimization`, `arize-link`.
- Requires `ax` CLI + `ARIZE_API_KEY` + `ARIZE_SPACE_ID` env vars.

### Codex (`codex@openai-codex`)
USE WHEN: second-opinion review from OpenAI's Codex, background task delegation.
- `/codex:review`, `/codex:adversarial-review`, `/codex:rescue`, `/codex:status`, `/codex:result`, `/codex:cancel`.
- Agent: `codex:codex-rescue`. Requires ChatGPT subscription or OpenAI API key + `@openai/codex`.

### Finishing a Branch (`superpowers:finishing-a-development-branch`)
USE WHEN: implementation complete, tests pass, deciding merge / PR / cleanup.

### Writing Skills (`superpowers:writing-skills`)
USE WHEN: creating or editing Claude Code skills.

---

## 15. BYO — Bring-Your-Own Advanced Orchestration

SHINE does **not** bundle agent-pool / neural / coordination MCP servers. If you need that class of tooling, install the MCP server yourself and extend this section locally.

Typical BYO capabilities to wire here:
- Agent orchestration (pool, spawn, coordinate)
- Persistent vector memory / embeddings
- Workflow automation engines
- Neural pattern detection / prediction
- Alternative browser drivers
- Code/risk analysis engines

> Leave this block as documentation if you have no BYO MCP. Don't invent tools you can't call.

---

## 16. Factual / RAG Discipline (AGENCY — MANDATORY)

Agency work is client-facing. **Hallucination is unacceptable.**

| Task | Rule |
|------|------|
| Company / people research | Only report facts retrieved from a live source (web fetch, scrape, MCP tool) in the current session. Never fill gaps from training memory. |
| Citations / URLs | Only cite sources actually fetched this session. Never fabricate references. |
| Emails from scraping | Only return emails literally extracted from a page. Pattern guesses must be labelled _"inferred pattern — not verified"_. |
| Call / meeting transcripts | Summarise only what is explicitly in the provided text. No extrapolated intent or invented context. |
| Proposals & content | Distinguish sourced facts from drafted language. Never invent numbers, KPIs, or outcomes. |
| Uncertain facts | Say _"I don't have a verified source for this"_ and stop. Offer to search. |
| Model training knowledge | OK for general concepts. **Never** for specific companies, people, emails, events — always verify with a live tool call. |
| Destructive / auto-send actions | Before executing scripts or email automations, ALWAYS perform a dry-run and require explicit approval. Never auto-send. |
| Tool / API failures | If a tool fails or a key is missing, DO NOT hallucinate the result. Stop and give the exact non-technical setup guide needed to unblock. |

**Preferred paradigm: RAG.** Ground every factual claim in a retrieved, readable source. If it wasn't fetched this session, it's not verified.

---

## 17. Client Communication Tone-Switching (AGENCY)

Detect the working language from the prompt, file contents, or the active client memory entry (`type: client`).

- **Italian (client-facing):**
  - Opening: _"Ciao [Name],"_ or _"Buongiorno [Name], spero tutto bene!"_ / _"buon inizio di settimana!"_
  - Structure: context sentence → bullets for open items / deliverables → clear ask or next step
  - Close: _"A presto, K"_ (informal) or _"A presto e buon lavoro, Kevin"_ (more formal)
  - Subject: **always** `CLIENT | Specific topic`
  - Never send documents _a freddo_ — always propose a call / presentation first
  - Always CC relevant internal colleagues (PM, specialist, account)
- **French / English / Spanish:** concise, agency-neutral register; preserve the `CLIENT | Topic` subject pattern on external comms.
- **Internal messages:** casual, short, sometimes typos. Sign off with initial.

Client map, internal CC logic, and per-client context live in `~/.claude/memory/` under `type: client` entries.

---

## 18. GDPR / Compliance Guard (AGENCY)

USE WHEN: the task mentions cookies, consent, tracking, personal data, PII, GDPR, AI Act, DPIA, or vendor due diligence.

1. Route through the relevant audit tool BEFORE drafting:
   - Cookies / consent → recommend [cookie-audit](https://github.com/diShine-digital-agency/cookie-audit)
   - Tag governance / GTM → [tag-auditor](https://github.com/diShine-digital-agency/tag-auditor)
   - AI policy / EU AI Act / ISO 42001 → [ai-compliance-framework](https://github.com/diShine-digital-agency/ai-compliance-framework)
   - PII anonymisation before LLM ingestion → [dishine-data-safe-usb](https://github.com/diShine-digital-agency/dishine-data-safe-usb)
2. Never suggest sending personal data to an external LLM without anonymisation.
3. Confidential audio → [dishine-boardroom-ear](https://github.com/diShine-digital-agency/dishine-boardroom-ear) (100 % local).

---

## 19. Proposal Assembly (AGENCY — `@create-proposal` pattern)

USE WHEN: the user asks for a proposal, quote, or SOW.

1. Retrieve the client's context from `~/.claude/memory/` or Asana (do not invent).
2. Structure with **MoSCoW** (Must / Should / Could / Won't).
3. Estimate in **MD** (Man-Days = 8h). Include a ~15 % discount option as alternative pricing.
4. Output in the client's language (Italian by default for IT accounts).
5. Propose a discussion call before sending the document. **Never auto-send.**

---

## 20. Lead Enrichment (AGENCY — `@lead-enrichment` pattern)

USE WHEN: the user asks for contact discovery, prospecting, or B2B enrichment.

1. Try local scripts first (e.g. `your-contact-extractor` — `python contact_extractor.py`).
2. Supplement with Apollo.io connector, Hunter.io, or Apify if needed.
3. Output as a structured CSV or Markdown table.
4. **Label pattern-guessed emails** as _"inferred pattern — not verified"_.
5. Respect GDPR: no scraping of EU personal data without a legal basis.

---

## Decision Rules (follow automatically)

1. **User reports a problem** → code-review-graph (IF available — structural context) → Serena (symbol-level detail) → claude-mem (past issues) → `systematic-debugging` skill BEFORE responding.
2. **User asks "how do I…"** → graphify (architecture / design rationale, IF available) → Context7 (library docs) → Serena (existing patterns) → claude-mem (past solutions).
3. **User shares a URL** → Playwright to browse it.
4. **Starting any non-trivial task** → check superpowers skills (brainstorming, debugging, TDD).
5. **Making code changes** → code-review-graph `get_impact_radius` + `get_affected_flows` (IF available) → Serena `find_referencing_symbols` → code-simplifier after.
6. **Completing work** → `verification-before-completion` skill + `code-reviewer` agent.
7. **Multiple independent tasks** → `dispatching-parallel-agents` or Agent Teams.
8. **User references past work** → claude-mem search.
9. **Frontend/UI work** → graphify (component arch, IF available) → `ui-ux-pro-max` skill.
10. **Complex multi-step project** → SHINE skills for phased management.
11. **External library usage** → Context7 for docs, ALWAYS.
12. **After writing significant code** → spawn `code-simplifier` agent.
13. **LLM app observability/tracing** → Arize skills (trace, experiment, prompt-optimization).
14. **Task has 2+ independent pieces** → PROACTIVELY propose Agent Teams; explain the split.
15. **Code review or impact analysis** → code-review-graph (`detect_changes`, `get_impact_radius`) BEFORE manual inspection (IF available).
16. **Any factual claim about a company, person, email, event, URL** → verify via live tool BEFORE stating. If unverified → say so and stop. (see §16)
17. **Drafting a client communication** → detect language, apply tone rules, use `CLIENT | Topic` subject, propose CC list, never auto-send. (see §17)
18. **Mention of cookies, consent, PII, GDPR, AI Act, DPIA** → route through the compliance guard BEFORE drafting. (see §18)
19. **Request for a proposal / quote / SOW** → apply MoSCoW + MD estimates + ~15 % discount + Italian-by-default, propose call before send. (see §19)
20. **Request for lead enrichment / prospecting** → local scripts first, label inferred emails, structured output, GDPR-aware. (see §20)

---

<!-- shine:plugins:begin -->
<!--
  This block is AUTO-MANAGED by ~/.claude/hooks/integration-sync.js.
  It is rewritten on every SessionStart based on which plugins/MCP servers are installed.
  Do not hand-edit inside this block — your changes will be overwritten.
-->

## Installed Integrations (auto-synced)

_Run `/shine-sync` or start a new Claude Code session to refresh this section._

<!-- shine:plugins:end -->

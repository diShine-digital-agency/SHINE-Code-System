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

## 15. BYO — Extended Capability Map (MCP Servers)

SHINE ships with plugins but does **not** bundle MCP servers — those are user-configured. Below is the full map of capabilities you can add. See [`docs/ADDING-INTEGRATIONS.md`](docs/ADDING-INTEGRATIONS.md) for install commands.

**All tools follow Rule #21 (Tiered Fallback): free/local first, freemium second (ask before using credits), paid third (explicit approval).**

### 🔍 Search & Web Scraping
| MCP | Tier | Purpose |
|---|---|---|
| `searxng` | 1 (free) | Self-hosted meta-search (Google, Bing, DDG aggregated) |
| `fetch` | 1 (free) | HTTP URL → clean markdown |
| `puppeteer` | 1 (free) | Headless Chrome for JS-heavy sites |
| `rag-web-browser` | 1 (free) | Search + scrape + markdown pipeline |
| `brave-search` | 2 (freemium) | Brave Search API |
| `tavily` | 2 (freemium) | AI semantic search |

### 🗄️ Databases & Analytics
| MCP | Tier | Purpose |
|---|---|---|
| `duckdb` | 1 (free) | Analytical SQL on local CSV/Parquet/JSON |
| `sqlite` | 1 (free) | Embedded local database |
| `postgres` | 1 (free) | PostgreSQL schema + query |
| `mysql` | 1 (free) | MySQL with configurable access |
| `mongodb` | 1 (free) | MongoDB collections |
| `redis` | 1 (free) | Key-value store + search |
| `excel` | 1 (free) | Read/write .xlsx workbooks |

### 🧠 Vector Memory & Semantic Search
| MCP | Tier | Purpose |
|---|---|---|
| `qdrant` | 1 (free) | Production vector search engine |

### 📦 Sandbox & Code Execution
| MCP | Tier | Purpose |
|---|---|---|
| `docker` | 1 (free) | Container lifecycle, isolated execution |
| `microsandbox` | 1 (free) | Self-hosted code sandbox |
| `e2b` | 2 (freemium) | Cloud sandbox |

### 📊 Data Visualization
| MCP | Tier | Purpose |
|---|---|---|
| `echarts` | 1 (free) | Interactive Apache ECharts generation |
| `mermaid` | 1 (free) | Flowcharts, sequence, Gantt diagrams |
| `vegalite` | 1 (free) | Statistical visualizations |

### 🔒 Security & Vulnerability Scanning
| MCP | Tier | Purpose |
|---|---|---|
| `semgrep` | 1 (free) | SAST code security scanning |
| `osv` | 1 (free) | Open Source Vulnerability database |
| `sslmon` | 1 (free) | SSL cert and domain monitoring |

### 📈 Monitoring & Observability
| MCP | Tier | Purpose |
|---|---|---|
| `signoz` | 1 (free) | Open-source APM (Datadog alternative) |
| `victoriametrics` | 1 (free) | Prometheus-compatible metrics |
| `kubernetes` | 1 (free) | Multi-cluster K8s management |

### 🔄 Version Control (extended)
| MCP | Tier | Purpose |
|---|---|---|
| `github` | 1 (free) | GitHub PRs, issues, code search |
| `gitlab` | 1 (free) | GitLab project management |
| `git` | 1 (free) | Local Git repository ops |

### 📂 File Systems & Documents
| MCP | Tier | Purpose |
|---|---|---|
| `filesystem` | 1 (free) | Local FS with configurable paths |
| `filestash` | 1 (free) | SFTP, S3, FTP, WebDAV, SMB |
| `ebook` | 1 (free) | Read PDF + EPUB locally |

### 🧬 Research & Academic
| MCP | Tier | Purpose |
|---|---|---|
| `arxiv` | 1 (free) | ArXiv paper search |
| `paperswithcode` | 1 (free) | Papers + matching codebases |

### 📝 Knowledge Management
| MCP | Tier | Purpose |
|---|---|---|
| `obsidian` | 1 (free) | Obsidian vault integration |
| `apple-notes` | 1 (free) | macOS Apple Notes |

### 💬 Communication
| MCP | Tier | Purpose |
|---|---|---|
| `slack` | 1 (free) | Slack channels read/write |
| `ntfy` | 1 (free) | Push notifications |

### 📱 Social Media
| MCP | Tier | Purpose |
|---|---|---|
| `youtube` | 1 (free) | Video transcripts/subtitles |
| `bluesky` | 1 (free) | BlueSky feed search |

### ⚡ Cloud & Infrastructure
| MCP | Tier | Purpose |
|---|---|---|
| `cloudflare` | 2 (freemium) | Workers, KV, R2, D1 |
| `globalping` | 1 (free) | Network probes worldwide |
| `kubernetes` | 1 (free) | Multi-cluster management |

### 🤖 AI Services
| MCP | Tier | Purpose |
|---|---|---|
| `openai-chat` | 2 (freemium) | Multi-model chat (Groq, Perplexity, xAI) |
| `hfspace` | 1 (free) | HuggingFace Spaces |

### ⚙️ System Automation
| MCP | Tier | Purpose |
|---|---|---|
| `apple-shortcuts` | 1 (free) | Trigger macOS Shortcuts |

### 🔗 Aggregators & MCP Management
| MCP | Tier | Purpose |
|---|---|---|
| `toolhive` | 1 (free) | Containerized MCP deployment |
| `mcp-get` | 1 (free) | CLI for MCP server management |

### 🗺️ Location & Geo
| MCP | Tier | Purpose |
|---|---|---|
| `google-maps` | 2 (freemium) | Routing, places, geocoding |
| `iplocate` | 1 (free) | IP geolocation |

### 💹 Finance
| MCP | Tier | Purpose |
|---|---|---|
| `dexpaprika` | 1 (free) | Crypto DEX data |
| `coinmarket` | 2 (freemium) | CoinMarketCap API |

### 💻 Dev Tools (extended)
| MCP | Tier | Purpose |
|---|---|---|
| `figma` | 1 (free) | Design → code-ready data |
| `openapi-explorer` | 1 (free) | OpenAPI/Swagger spec browser |

> Missing MCP → SHINE states the gap and offers a degraded path. Never fabricates.

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

**Verified-source watermark (client-facing deliverables).** When a deliverable mixes sourced facts with drafted language, append a short _Sources_ footer listing each verified source with its fetch date. For unverified passages, inline-label them `_[unverified — pattern inferred]_` or `_[drafted — no source]_`. Template: `shine/templates/watermark.md`.

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

## 21. Tool Tier Resolution — Free-First Fallback (MANDATORY)

USE WHEN: **every tool call** — this rule governs how Claude selects between competing tools.

When multiple tools can serve the same function, follow this strict order:

| Tier | Definition | Behaviour |
|---|---|---|
| **Tier 1 — Free / Local / OS** | No API key, runs on user's machine or is fully open-source | **Always try first.** Use without asking. |
| **Tier 2 — Freemium** | Has a free tier but may consume credits | **Ask before using.** State: _"I can use [tool] (free tier). It may consume credits. Proceed?"_ |
| **Tier 3 — Paid / Premium** | Requires a paid subscription or per-call billing | **Explicit approval required.** State cost implications. Never call silently. |

**Resolution flow:**
1. Check if a Tier 1 tool is available for the task (e.g., `searxng` for web search, `duckdb` for data analysis).
2. If Tier 1 is unavailable → inform the user, propose Tier 2 with the caveat.
3. If Tier 2 is also unavailable → propose Tier 3 with cost warning, OR offer a degraded manual path.
4. If all tiers are unavailable → state the gap, give the install command, and offer the manual fallback (paste content, upload file, etc.).

**Tier map per capability (see §15 for full details):**

| Capability | Tier 1 (free) | Tier 2 (freemium) | Tier 3 (paid) |
|---|---|---|---|
| Web search | `searxng`, `fetch` | `brave-search`, `tavily` | Perplexity, Exa |
| Web scraping | `puppeteer`, `rag-web-browser` | — | Firecrawl (paid plan) |
| Data analysis | `duckdb`, `sqlite` | — | BigQuery, Snowflake |
| Vector memory | `qdrant` | — | Pinecone, Weaviate |
| Code sandbox | `docker`, `microsandbox` | `e2b` | — |
| Charts | `echarts`, `mermaid`, `vegalite` | — | — |
| Security scanning | `semgrep`, `osv` | — | Snyk, SonarCloud |
| Monitoring | `signoz`, `victoriametrics` | — | Datadog, New Relic |
| Version control | `github`, `gitlab`, `git` | — | — |
| Knowledge mgmt | `obsidian`, `apple-notes` | Notion | — |

Full map: [`docs/ADDING-INTEGRATIONS.md`](docs/ADDING-INTEGRATIONS.md)

---

## Decision Rules (follow automatically)

1. **User reports a problem** → code-review-graph (IF available — structural context) → Serena (symbol-level detail) → claude-mem (past issues) → `systematic-debugging` skill BEFORE responding.
2. **User asks "how do I…"** → graphify (architecture / design rationale, IF available) → Context7 (library docs) → Serena (existing patterns) → claude-mem (past solutions).
3. **User shares a URL** → Playwright to browse it. If URL is a research target → also delegate to `shine-web-researcher` agent for deep retrieval.
4. **Starting any non-trivial task** → check superpowers skills (brainstorming, debugging, TDD).
5. **Making code changes** → code-review-graph `get_impact_radius` + `get_affected_flows` (IF available) → Serena `find_referencing_symbols` → code-simplifier after.
6. **Completing work** → `verification-before-completion` skill + `code-reviewer` agent.
7. **Multiple independent tasks** → `dispatching-parallel-agents` or Agent Teams.
8. **User references past work** → claude-mem search → `qdrant` MCP vector search (IF connected) for semantic recall.
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
21. **Any tool selection with free and paid alternatives** → always try Tier 1 (free/local) first. ASK before Tier 2 (freemium). REQUIRE explicit approval for Tier 3 (paid). Never silently consume credits. (see §21)
22. **User asks for web research / competitive intel / "search for" / "find out about"** → delegate to `shine-web-researcher` agent OR run `/shine-web-research` skill. Tool order: `searxng` (Tier 1) → `fetch` (Tier 1) → `brave-search` (Tier 2, ASK) → `tavily` (Tier 2, ASK) → Perplexity (Tier 3, REQUIRE approval) → manual fallback (ask user to paste). Every claim cited with [Source: URL, date]. Never fabricate sources.
23. **User provides a data file (CSV, Parquet, JSON, Excel) OR asks for data analysis / SQL / "analyze this"** → delegate to `shine-data-engineer` agent OR run `/shine-data-query` skill. Tool order: `duckdb` MCP (Tier 1) → `sqlite` MCP (Tier 1) → `excel` MCP for .xlsx (Tier 1) → Python pandas via Bash (fallback). Profile schema first, then execute. Never upload data externally.
24. **User asks for a chart / visualization / graph / diagram** → delegate to `shine-chart-builder` agent OR run `/shine-chart` skill. Tool map: quantitative → `echarts` MCP; structural → `mermaid` MCP; statistical → `vegalite` MCP; fallback → standalone HTML with CDN libraries. Always label axes with units, cite data source.
25. **User asks for security scan / vulnerability check / "is this code secure?"** → delegate to `shine-vulnerability-scanner` agent OR run `/shine-security-scan` skill. Tool chain: `semgrep` MCP (Tier 1) → Semgrep CLI via Bash (fallback). For dependencies: `osv` MCP (Tier 1) → `npm audit`/`pip audit` (fallback). For SSL/domains: `sslmon` MCP (Tier 1) → `openssl s_client` (fallback). Read-only — never auto-fix.
26. **User asks to run untrusted code / "try this script" / "execute in sandbox"** → delegate to `shine-sandbox-runner` agent OR run `/shine-sandbox` skill. Risk-assess first: 🔴 untrusted = MUST sandbox. Tool chain: `docker` MCP (Tier 1) → `microsandbox` (Tier 1) → Docker CLI via Bash → `e2b` (Tier 2, ASK). Never run 🔴-risk code directly on host.
27. **User asks for dependency audit / "any CVEs?" / "check for vulnerabilities in packages"** → run `/shine-dep-audit` skill. Tool: `osv` MCP (Tier 1) → `npm audit`/`pip audit`/`govulncheck` (fallback). Report CVE + CVSS + fix version for each. Never auto-upgrade without approval.
28. **User asks for network diagnostics / "check DNS" / "why is the site slow?" / "SSL status"** → run `/shine-network-check` skill. Tools: `globalping` MCP (Tier 1) → `sslmon` MCP (Tier 1) → `ping`/`dig`/`traceroute`/`openssl` via Bash (fallback). Read-only diagnostics only — never run port scans without approval.
29. **User asks to remember / store knowledge / "save this for later" OR recall / "what did we do about X"** → run `/shine-vector-search` skill. Tool: `qdrant` MCP (Tier 1) → `claude-mem` plugin (fallback) → grep `~/.claude/memory/` (last resort). Never store PII or secrets in vector DB.

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

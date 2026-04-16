# Changelog

All notable changes to the SHINE Claude Code Framework are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project follows semantic versioning for the framework package (not for Claude Code itself).

---

## [1.0.1] — 2026-04-16

Release focused on discoverability, cross-session learning, skill composition, factual-discipline tooling, and an onboarding path for first-time users.

### Added

- **`shine-tools.cjs index-skills`** — scans `~/.claude/skills/`, parses every `SKILL.md` frontmatter, groups by inferred category (core / agency / marketing / sales / consulting / tech / ops / data / brand / misc) and writes `skills/INDEX.md` (140 entries across 10 categories).
- **`shine-tools.cjs onboard`** — non-destructive first-run wizard. Creates 4 starter memory files (`preference-communication.md`, `preference-stack.md`, `preference-factual-rag.md`, `style-email-it.md`) plus `MEMORY.md` index. Skips any file that already exists.
- **`shine-tools.cjs doctor`** — prints a JSON health report: `~/.claude/` presence, critical file checks, counts of agents / skills / hooks / memories. Useful for CI and support triage.
- **`SHINE_HOOK_FORMAT=json`** — when set, every SHINE hook emits a single JSONL line per notification instead of plain stderr text. Enables ingestion into log pipelines without breaking the default human-readable mode. Applies to `shine-context-monitor`, `shine-prompt-guard`, `shine-read-guard`, `shine-check-update`, `shine-learning-log`.
- **`hooks/_shine-hook-output.js`** — shared emitter used by all stderr-emitting hooks. Single source of truth for text / JSON formatting, fail-open semantics, and level tagging (`info` / `warn` / `block`).
- **`hooks/shine-learning-log.js`** — new Stop-event hook. Appends one JSONL line per Claude turn to `~/.claude/memory/learning-log.jsonl` with `ts`, `cwd`, `last_tool`, `transcript_bytes`, `event`. No conversation content is ever captured — log is PII-free by design. LRU-trims to `SHINE_LEARNING_LOG_MAX` (default 10000 lines). Controls: `SHINE_DISABLE_LEARNING_LOG=1`.
- **`skills/shine-retro/SKILL.md`** — reads the learning log, aggregates tool usage / cwd coverage / long-session counts, and proposes concrete memory updates. Write-safe: only creates `external-retro-<date>.md`, never edits existing memory files.
- **`skills/shine-pipeline/SKILL.md`** — compose skills into an ad-hoc sequential workflow with a shared markdown scratchpad. Hard 8-step cap, destructive-step confirmation, context-budget awareness.
- **`skills/shine-tour/SKILL.md`** — interactive 6-minute guided tour for first-time users. Runs 14 install-health checks with copy-paste fixes, teaches the 5 SHINE pillars (rules / memory / skills / agents / hooks), demos a real read-only workflow, writes an audit trail to `~/.claude/sessions/tour-<ts>.md`. Flags: `--section <name>`, `--check-only`, `--fix`. Includes a 20-row troubleshooting matrix covering every known failure mode (missing `claude` CLI, bad `settings.json`, hook path drift, MCP auth, false-positive prompt-guard, log bloat, Windows/WSL, perms, backup cleanup).
- **`shine/templates/watermark.md`** — verified-source watermark template. Inline labels (`_[verified — …]_`, `_[unverified — pattern inferred]_`, `_[drafted — no source]_`) + mandatory Sources footer for every client-facing deliverable with factual claims.

### Changed

- **`CLAUDE.md §16`** (Factual / RAG Discipline) — adds the watermark convention as the enforceable output format for mixed deliverables.
- **`shine/references/ui-brand.md`** — new §10b "Verified-source watermark" pointing to the template.
- **`settings.template.json`** — registers `shine-learning-log.js` on the `Stop` event.
- **`install.sh`** — log message bumped to reflect 141 skills, 8 lifecycle hooks (adds Stop), 6 templates (adds watermark).

### Verified

- `node shine/bin/shine-tools.cjs index-skills` → writes `skills/INDEX.md` with 140 entries.
- `node shine/bin/shine-tools.cjs onboard` → creates 5 files on first run, skips on second run.
- `node shine/bin/shine-tools.cjs doctor` → returns a valid JSON health report.
- `SHINE_HOOK_FORMAT=json` regression: text mode unchanged, JSON mode emits parseable JSONL, exit codes preserved (prompt-guard still exits 2 on block).
- `.github/scripts/check_agent_quality.py` → all agents still pass (no regressions).

---

## [0.2.0] — 2026-04-15

Second audit remediation release: closes every P1 item from the v2 audit.

### Added

- **Tier-1 workflows fleshed out** — `do`, `fast`, `ship`, `next`, `resume-project`, `map-codebase`, `review`, `complete-milestone`, `new-milestone`, `manager`, `stats`, `session-report` now contain real step-by-step logic, decision gates, error handling, and output formats.
- **Tier-2 workflows fleshed out** — `add-phase`, `insert-phase`, `remove-phase`, `add-tests`, `check-todos`, `cleanup`, `audit-milestone`, `audit-uat`, `analyze-dependencies`, `forensics`, `docs-update`, `secure-phase`, `validate-phase`, `ui-phase`, `ui-review` now have concrete protocols.
- **`shine/bin/shine-tools.test.cjs`** — zero-dep test suite with 16 tests covering version, help, slug (ASCII + Unicode), frontmatter (inline, block scalars, missing), state (--set with/without value, values containing `=`), commit (no-message error), roadmap (parse + empty), workstream list, unknown command.
- **`.github/scripts/check_references.py`** — validates every `@~/.claude/...` reference resolves to a real file; now gated in CI.
- **`QUICKSTART.md`** — 1-page onboarding (vs 30KB README).
- **`shine-tools` edge-case hardening**:
  - `--version` / `-v` flag prints JSON from `shine/VERSION`.
  - `state --set` without value errors clearly instead of silently no-op'ing.
  - `parseFrontmatter` now handles YAML block scalars (`|` literal, `>` folded).
- **Token-aware context monitoring** — `hooks/shine-context-monitor.js` estimates tokens (~bytes/3.5) and warns on soft 120k / hard 180k token thresholds in addition to byte thresholds.
- **Output templates** added to 8 previously thin agency agents: `shine-pm-coordinator` (Asana/Linear queries + digest template), `shine-crm-operator` (CRM query patterns + dedup confidence scoring), `shine-lead-scorer` (4-axis scoring model), `shine-martech-architect` (4-layer stack design + mermaid), `shine-content-editor` (FK readability + inline-edit template), `shine-translator` (glossary format + back-translation drift check), `shine-brand-voice-auditor` (4-axis tone rubric + consistency formula), `shine-sales-strategist` (pipeline + forecast template).

### Changed

- **`install.sh`** — now also copies `shine-tools.test.cjs` and runs it post-install (non-blocking).
- **`.github/workflows/validate.yml`** — adds `check_references.py` + `shine-tools.test.cjs` as CI gates.

### Verified

- `node shine/bin/shine-tools.test.cjs` → 16 passed, 0 failed.
- `python3 .github/scripts/check_references.py` → 116 references, all resolve.
- `node shine/bin/shine-tools.cjs --version` → `{"version":"1.0.2","name":"shine-tools"}`.

---

## [0.1.1] — 2026-04-15

Audit remediation release: closes every ship-blocking gap identified in the external audit.

### Added

- **`shine/bin/shine-tools.cjs`** — 18-subcommand Node.js runtime engine (no external deps, safe `spawnSync` only). Subcommands: `init`, `state`, `commit`, `commit-to-subrepo`, `roadmap`, `verify`, `frontmatter`, `resolve-model`, `generate-slug`, `websearch`, `config-get`, `config-set-model-profile`, `phase`, `requirements`, `summary-extract`, `history-digest`, `in`, `workstream`, `help`. Unblocks all 21 engineering agents and 18+ skills that depended on it.
- **`shine/workflows/*.md`** — 53 workflow files. 10 fully-fleshed (Tier 1: `execute-phase`, `plan-phase`, `discuss-phase`, `verify-work`, `new-project`, `quick`, `autonomous`, `help`, `health`, `progress`); 43 structured stubs for the rest following the same pattern.
- **`shine/templates/*.md`** — 5 scaffold templates (`project.md`, `requirements.md`, `context.md`, `milestone-archive.md`, `UAT.md`).
- **`shine/references/*.md`** — 2 reference files (`ui-brand.md` covering voice, formatting, MoSCoW, commit messages; `questioning.md` covering 5-Why, MoSCoW prompts, discovery-call template, red flags).
- **`install.sh`** — now copies `shine/bin/`, `shine/workflows/`, `shine/templates/`, `shine/references/`, validates 9 critical files post-install, and smoke-tests the runtime.

### Fixed

- **Duplicate skill removed**: `skills/sync/` (kept `skills/shine-sync/`).
- All 61 missing files identified in the audit now exist, tracked, and validated by CI.

### Verified

- `python3 .github/scripts/check_frontmatter.py agents` → 39 agents OK.
- `python3 .github/scripts/check_frontmatter.py skills` → 138 skills OK.
- `python3 .github/scripts/check_hook_refs.py` → 7 hooks, all resolve.
- `python3 .github/scripts/check_secrets.py` → no secret-shaped strings.
- `node shine/bin/shine-tools.cjs help` → runtime responds.

---

## [0.1.0] — 2026-04-15

First public release of the SHINE framework under the diShine digital agency.

### Added

- **39 agents** under `agents/` — 21 core engineering (`shine-planner`, `shine-executor`, `shine-verifier`, `shine-debugger`, `shine-security-auditor`, `shine-codebase-mapper`, `shine-roadmapper`, `shine-ui-auditor`, `shine-ui-checker`, `shine-ui-researcher`, `shine-integration-checker`, `shine-nyquist-auditor`, `shine-plan-checker`, `shine-phase-researcher`, `shine-project-researcher`, `shine-research-synthesizer`, `shine-advisor-researcher`, `shine-assumptions-analyzer`, `shine-user-profiler`, `shine-doc-verifier`, `shine-doc-writer`) + 18 agency (`shine-client-researcher`, `shine-brand-voice-auditor`, `shine-competitor-scout`, `shine-proposal-writer`, `shine-sales-strategist`, `shine-content-editor`, `shine-seo-strategist`, `shine-martech-architect`, `shine-data-analyst`, `shine-copywriter`, `shine-gdpr-analyst`, `shine-translator`, `shine-pm-coordinator`, `shine-account-manager`, `shine-crm-operator`, `shine-retro-facilitator`, `shine-lead-scorer`, `shine-persona-researcher`).
- **138 skills** under `skills/` across 8 categories:
  - 61 core SHINE skills (renamed & scrubbed from the upstream upstream framework)
  - 17 early agency skills (`proposal`, `draft-email`, `gdpr-audit`, `lead-enrich`, `client-brief`, `kickoff`, `retrospective`, `roi-estimate`, `seo-audit`, `tag-audit`, `cookie-scan`, `pii-safe`, `compliance-ai`, `meta-check`, `status-report`, `sync`, `client-tone`)
  - 10 marketing/content (`content-calendar`, `blog-post`, `social-post`, `newsletter`, `landing-copy`, `value-prop`, `press-release`, `case-study`, `webinar-plan`, `campaign-brief`)
  - 10 sales/outreach (`cold-email`, `linkedin-dm`, `follow-up`, `sales-deck`, `icp-define`, `persona-build`, `competitor-analysis`, `pricing-page`, `sales-call-prep`, `sales-call-debrief`)
  - 10 consulting/strategy (`discovery-call`, `swot`, `okr-draft`, `roadmap-draft`, `stakeholder-map`, `risk-register`, `change-plan`, `digital-maturity`, `discovery-doc`, `exec-summary`)
  - 10 tech/dev (`tech-spec`, `api-design`, `deploy-checklist`, `incident-report`, `pr-review`, `readme-generator`, `changelog-draft`, `architecture-diagram`, `migration-plan`, `test-strategy`)
  - 8 ops/PM (`meeting-notes`, `weekly-plan`, `vendor-onboarding`, `nda-triage`, `invoice-draft`, `timesheet-summary`, `capacity-plan`, `process-doc`)
  - 6 data/analytics (`ga4-audit`, `attribution-model`, `dashboard-spec`, `kpi-tree`, `ab-test-plan`, `data-contract`)
  - 4 brand/design (`brand-voice`, `naming`, `logo-brief`, `design-crit`)
  - 3 misc (`rfp-response`, `translate`, `learning-loop`)
- **7 hooks**:
  - `global-memory-symlink.sh` — SessionStart, links `./memory/` to `~/.claude/memory/`
  - `shine-check-update.js` — SessionStart, non-blocking GitHub release check
  - `integration-sync.js` — SessionStart, refreshes plugins/MCP block inside CLAUDE.md
  - `shine-context-monitor.js` — PostToolUse, warns at transcript thresholds
  - `shine-prompt-guard.js` — PreToolUse, blocks secret-shaped writes (exit 2)
  - `shine-read-guard.js` — PreToolUse, warns on generated-file edits
  - `shine-precompact.js` — PreCompact, snapshots CWD + last-tool before compact
- **CLAUDE.md** with 20 decision rules including RAG discipline (§16), client tone-switching (§17), GDPR guard (§18), proposal assembly (§19), lead enrichment (§20).
- **Typed memory system** (`memory/MEMORY.md`) with `preference | client | project | style | external` types.
- **Install/uninstall** — `install.sh` with atomic backup + `--dry-run --no-plugins --no-backup --no-symlink --non-interactive` flags; `uninstall.sh` with default-restore and `--purge`.
- **Statusline** — Node (`statusline.js`) and pure-bash (`statusline.sh`) variants with model · cwd · branch · active-client · context-size indicator.
- **Docs** — `ARCHITECTURE.md`, `HOW-IT-WORKS.md`, `CUSTOMIZATION.md`, `PLUGINS.md`, `AGENCY-WORKFLOWS.md`.
- **Governance** — LICENSE (CC0 1.0), CONTRIBUTING, CODE_OF_CONDUCT, SECURITY.
- **CI validator** — `.github/workflows/validate.yml` checks Bash syntax, Node syntax, JSON validity, agent/skill frontmatter, and dead hook references.

### Security

- `shine-prompt-guard.js` refuses writes matching `.env`, `*.pem`, `id_rsa`, `credentials.json`, or content matching OpenAI / Anthropic / GitHub / AWS / Google / Stripe / Slack key patterns.
- Telemetry is off by default. OTEL endpoints are blank.
- Every hook fails open (exit 0) except `shine-prompt-guard.js` which fails closed.
- Atomic backup on install — no destructive operation without a recoverable snapshot.

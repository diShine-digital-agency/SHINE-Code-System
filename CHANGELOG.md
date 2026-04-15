# Changelog

All notable changes to the SHINE Claude Code Framework are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project follows semantic versioning for the framework package (not for Claude Code itself).

---

## [1.0.2] — 2026-04-15

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

## [1.0.1] — 2026-04-15

Audit remediation release: closes every ship-blocking gap identified in the external audit.

### Added

- **`shine/bin/shine-tools.cjs`** — 18-subcommand Node.js runtime engine (no external deps, safe `spawnSync` only). Subcommands: `init`, `state`, `commit`, `commit-to-subrepo`, `roadmap`, `verify`, `frontmatter`, `resolve-model`, `generate-slug`, `websearch`, `config-get`, `config-set-model-profile`, `phase`, `requirements`, `summary-extract`, `history-digest`, `in`, `workstream`, `help`. Unblocks all 21 engineering agents and 18+ skills that depended on it.
- **`shine/workflows/*.md`** — 53 workflow files. 10 fully-fleshed (Tier 1: `execute-phase`, `plan-phase`, `discuss-phase`, `verify-work`, `new-project`, `quick`, `autonomous`, `help`, `health`, `progress`); 43 structured stubs for the rest following the same pattern.
- **`shine/templates/*.md`** — 5 scaffold templates (`project.md`, `requirements.md`, `context.md`, `milestone-archive.md`, `UAT.md`).
- **`shine/references/*.md`** — 2 reference files (`ui-brand.md` covering voice, formatting, MoSCoW, commit messages; `questioning.md` covering 5-Why, MoSCoW prompts, discovery-call template, red flags).
- **`install.sh`** — now copies `shine/bin/`, `shine/workflows/`, `shine/templates/`, `shine/references/`, validates 9 critical files post-install, and smoke-tests the runtime.

### Changed

- Skill count corrected to **138** across `README.md`, `CLAUDE.md`, `CHANGELOG.md`, and `install.sh` after deduplication.

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

## [1.0.0] — 2026-04-15

First public release of the SHINE framework.

### Added

- **39 agents** under `agents/` — 21 core engineering (`shine-planner`, `shine-executor`, `shine-verifier`, `shine-debugger`, `shine-security-auditor`, `shine-codebase-mapper`, `shine-roadmapper`, `shine-ui-auditor`, `shine-ui-checker`, `shine-ui-researcher`, `shine-integration-checker`, `shine-nyquist-auditor`, `shine-plan-checker`, `shine-phase-researcher`, `shine-project-researcher`, `shine-research-synthesizer`, `shine-advisor-researcher`, `shine-assumptions-analyzer`, `shine-user-profiler`, `shine-doc-verifier`, `shine-doc-writer`) + 18 agency (`shine-client-researcher`, `shine-brand-voice-auditor`, `shine-competitor-scout`, `shine-proposal-writer`, `shine-sales-strategist`, `shine-content-editor`, `shine-seo-strategist`, `shine-martech-architect`, `shine-data-analyst`, `shine-copywriter`, `shine-gdpr-analyst`, `shine-translator`, `shine-pm-coordinator`, `shine-account-manager`, `shine-crm-operator`, `shine-retro-facilitator`, `shine-lead-scorer`, `shine-persona-researcher`).
- **138 skills** under `skills/` across 8 categories:
  - 61 core SHINE skills
  - 17 agency skills (`proposal`, `draft-email`, `gdpr-audit`, `lead-enrich`, `client-brief`, `kickoff`, `retrospective`, `roi-estimate`, `seo-audit`, `tag-audit`, `cookie-scan`, `pii-safe`, `compliance-ai`, `meta-check`, `status-report`, `sync`, `client-tone`)
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

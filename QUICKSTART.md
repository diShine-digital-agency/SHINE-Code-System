# QUICKSTART — SHINE in 5 minutes

This is the 1-page guide. For the full picture, see [README.md](./README.md).

---

## 1. Install (2 min)

```bash
git clone https://github.com/diShine-digital-agency/SHINE-Code-System.git
cd shine-claude-code-framework
./install.sh
```

The installer backs up any existing `~/.claude/` to `~/.claude-backup-<timestamp>/` before copying anything.

**Flags worth knowing:**

- `--dry-run` — show every action, change nothing
- `--no-plugins` — skip plugin install (offline)
- `--non-interactive` — no prompts, fail if a decision is needed

---

## 2. Verify (30 sec)

```bash
node ~/.claude/shine/bin/shine-tools.cjs --version
# → {"version":"1.0.1","name":"shine-tools"}

node ~/.claude/shine/bin/shine-tools.cjs help
```

If both respond, you're installed.

---

## 3. First session (2 min)

Start Claude Code from any directory:

```bash
claude
```

Then inside the session:

```
/shine-help            ← orient yourself
/shine-new-project     ← scaffold a project with discovery
/shine-next            ← ask "what should I do now?"
```

**Three slash commands you'll use every day:**

| Command | Use when |
|---|---|
| `/shine-plan-phase <N>` | Starting a non-trivial chunk of work |
| `/shine-execute-phase <N>` | Plan is ready, ship the code |
| `/shine-verify-work <N>` | Done executing, before marking the phase done |

---

## 4. Your first project in 60 seconds

```
/shine-new-project
→ Answers the 4 discovery questions (goal, audience, metric, timeline)
→ ROADMAP.md + phase 1 CONTEXT.md scaffolded

/shine-plan-phase 1
→ shine-planner subagent drafts the plan
→ shine-plan-checker audits it

/shine-execute-phase 1
→ Executor spawns per-wave subagents in parallel
→ Atomic commit after each wave

/shine-verify-work 1
→ 5-section report: Summary · Details · Sources · Open questions · Next step
```

---

## 5. Memory (know this)

Your memory is typed. Files must start with one of these prefixes:

- `preference-<topic>.md` — your working style
- `client-<slug>.md` — a specific client
- `project-<slug>.md` — a specific project
- `style-<topic>.md` — formatting / tone rules
- `external-<topic>.md` — third-party reference (GDPR guide, a vendor API)

Location: `~/.claude/memory/` (or symlinked from `./memory/` in a project).

---

## 6. When things go wrong

| Symptom | Try |
|---|---|
| A skill does nothing | `node ~/.claude/shine/bin/shine-tools.cjs help` — is the runtime installed? |
| Hook errors on every Write | `cat ~/.claude/hooks/shine-prompt-guard.js` — it probably blocked a secret-shaped string |
| `~/.claude/` looks wrong | `./uninstall.sh` then re-run `./install.sh` — the backup is safe |

---

## 7. Where to go next

- **Full architecture**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **All 149 skills**: [skills/INDEX.md](./skills/INDEX.md) (regenerate via `node shine/bin/shine-tools.cjs index-skills`)
- **Customization**: [docs/CUSTOMIZATION.md](./docs/CUSTOMIZATION.md)
- **Agency workflows**: [docs/AGENCY-WORKFLOWS.md](./docs/AGENCY-WORKFLOWS.md)

---

_SHINE = Strategize · Handle · Implement · Navigate · Evaluate_

# Multi-Agent Architecture — Dotflow

**Version:** 1.0
**Status:** Ready for implementation
**Author:** Quamca
**Last Updated:** 2026-04-09

---

## Overview

8 specialized Claude Code agents for the Dotflow project.
All operate as Skills (`.claude/skills/`) except /dev which uses `CLAUDE.md`.
All follow autonomy rules: autonomous within task scope, git always requires user approval.

---

## Principles

| Principle | Decision |
|---|---|
| Autonomy | Autonomous in code, git requires explicit user approval |
| Language — `/pm`, `/discover`, `/planning`, `/debug`, `/retro` | Polish |
| Language — `/dev`, `/qa`, `/docs` | English |
| Git commands in agent output | Never use `&&`. All commands one per line in a single powershell block. |

---

## Two Operating Modes

### Strategic Mode (occasional)
Used when exploring new ideas, new Epics, or direction changes.
Does NOT chain into daily agents after completion (except optionally `/retro`).

```
/discover → discussion → BACKLOG.md + architecture.md updated → commit
```

### Daily Mode (every US)
Used for implementing specific User Stories from backlog.

```
/pm → /planning → /dev → manual verify → /qa → /docs → [/retro]
                              ↓
                           /debug (on demand)
```

---

## System Map

```
┌─────────────────────────────────────────────────────────┐
│  STRATEGIC MODE                                         │
│  /discover  — New Epics, features, architectural ideas  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  DAILY MODE                                             │
│  /pm        — Session router, context explainer        │
│  /planning  — US verification + Task instruction       │
│  /dev       — Implementation (CLAUDE.md)               │
│  /qa        — Tests                                    │
│  /debug     — Problem solving (on demand)              │
│  /docs      — Documentation update                     │
│  /retro     — Retrospective (optional)                 │
└─────────────────────────────────────────────────────────┘
```

**Total: 8 core agents**

---

## When to Use Each Mode

**Start with `/discover` when:**
- You have a new idea not yet in the backlog
- You want to add a new Epic or Feature
- You want to discuss architectural direction
- You're unsure whether something should be one US or several

**Start with `/pm` when:**
- You have a specific US from the backlog ready to implement
- You're continuing work on an existing US
- You want to know what to do next

---

## Workflow Reference

### Strategic session
```
/discover
→ Discussion in Polish
→ Consensus reached — you say "gotowe"
→ BACKLOG.md + docs/architecture.md updated
→ Proposed commit: docs: add [Epic/Feature/US name]
→ Optional: /retro
```

### Daily US session
```
/pm "starting US-XXX, branch: feature/xxx"
→ Checks git status → alerts if uncommitted changes exist
→ Routes to /planning

/planning
→ Verifies US readiness
→ User Acceptance Scenario
→ Generates Task instruction → .claude/current_task.md

/dev [reads .claude/current_task.md]
→ Implements
→ Linter + tests
→ Manual Verification steps (in Polish)
→ Proposes commit

[You test manually]
→ Problem? → /debug
→ OK? → /dev proposes commit → you commit → /dev says "Run /qa"

/qa
→ Generates/optimizes tests
→ Updates docs/test_cases.md
→ Proposes commit

/docs
→ Updates all project documentation
→ Proposes commit
→ Full closing sequence (push, PR description, cleanup reminder)

/retro  ← optional
→ Session analysis
→ Agent improvement proposals
```

---

## Agent Directory

| Agent | File | Language | Purpose |
|---|---|---|---|
| /pm | .claude/skills/pm/SKILL.md | Polish | Session router, git status check |
| /discover | .claude/skills/discover/SKILL.md | Polish | Strategic sessions, new Epics |
| /planning | .claude/skills/planning/SKILL.md | Polish | US verification + Task instruction |
| /dev | CLAUDE.md | English | Implementation |
| /qa | .claude/skills/qa/SKILL.md | English | Tests |
| /debug | .claude/skills/debug/SKILL.md | Polish | Problem solving |
| /docs | .claude/skills/docs/SKILL.md | English | Documentation update |
| /retro | .claude/skills/retro/SKILL.md | Polish | Retrospective |

---

## Directory Structure

```
dotflow/
├── .claude/
│   └── skills/
│       ├── pm/
│       │   └── SKILL.md
│       ├── discover/
│       │   └── SKILL.md
│       ├── planning/
│       │   └── SKILL.md
│       ├── qa/
│       │   └── SKILL.md
│       ├── debug/
│       │   └── SKILL.md
│       ├── docs/
│       │   └── SKILL.md
│       └── retro/
│           └── SKILL.md
├── CLAUDE.md              ← /dev instructions
├── BACKLOG.md
├── docs/architecture.md
├── docs/requirements.md
├── docs/wireframes.md
├── docs/design_brief.md
├── docs/setup.md
├── docs/test_cases.md
├── docs/code_snippets.md
└── README.md
```

---

## Configuration

### .claude/settings.json (optional)

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "Bash(git status)",
      "Bash(git log*)",
      "Bash(git diff*)",
      "Bash(git branch*)",
      "Bash(npm run lint)",
      "Bash(npm test)",
      "Bash(npm run build)"
    ]
  }
}
```

---

*This document is updated during /retro sessions when agent responsibilities change.*

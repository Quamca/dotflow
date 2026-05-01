# Dotflow — Claude Code Instructions

## Project Identity (Invariants)
- **App name:** Dotflow
- **Package name:** dotflow
- **Main entry file:** src/main.tsx
- **Repository:** https://github.com/Quamca/dotflow
- **GitHub Username:** Quamca

## Tech Stack
- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4o-mini via REST API
- **Hosting:** Vercel
- **Auth:** None in MVP — OpenAI API key stored in localStorage via Settings screen

## Architecture
Single-page React application. No backend server — all logic runs in the browser.
Supabase is used as the database (direct client from browser with RLS disabled for single-user MVP).
OpenAI API is called directly from the browser using the user's own API key.

Reference: See `docs/architecture.md` for full diagrams and data model.

---

## Clean Code Standards

### SOLID Principles
- **S**ingle Responsibility: One component/function = one job
- **O**pen/Closed: Extend via props/composition, don't modify existing components
- **L**iskov Substitution: Components should be replaceable with their subtypes
- **I**nterface Segregation: Small, focused TypeScript interfaces
- **D**ependency Inversion: Depend on abstractions (hooks, services), not implementations

### Code Quality Rules
- **DRY:** Extract repeated code into utils/hooks after 2nd occurrence
- **KISS:** Prefer simple solutions; complexity must be justified
- **Maximum file length:** 300 lines (split if larger)
- **Maximum function length:** 50 lines (extract helper functions)
- **Maximum component props:** 7 (consider composition if more)
- **Cyclomatic complexity:** Max 10 per function

### Naming Conventions
- Files: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- Components: `PascalCase` — noun describing what it renders
- Functions: `camelCase` — verb describing what it does
- Hooks: `use` prefix — `useEntries`, `useAI`, `useSettings`
- Types/Interfaces: `PascalCase` — noun, no `I` prefix
- Constants: `SCREAMING_SNAKE_CASE`
- Booleans: `is`, `has`, `should` prefix — `isLoading`, `hasError`, `isConnected`
- Event handlers: `handle` prefix — `handleSubmit`, `handleEntryClick`

### Code Comments
- Language: English only
- Explain WHAT and WHY, not HOW (code shows how)
- No redundant comments
- Use JSDoc for public functions and complex types
- TODO format: `// TODO(Quamca): description`

---

## Testing Standards

### Focus on User-Facing Functionality

**DO test:**
- User interactions (form submission, button clicks)
- Visible output and UI state changes
- User-facing error messages (e.g., "API key missing")
- Business logic outcomes (e.g., entry saved, question generated)

**DO NOT test:**
- Internal implementation details
- Private functions
- React or Supabase internals
- OpenAI API internals

### QA Best Practices
- **F.I.R.S.T.** — Fast, Independent, Repeatable, Self-validating, Timely
- **AAA Pattern** — Arrange, Act, Assert
- Test cleanup/teardown after every test
- Test isolation — no shared state between tests

### Coverage Requirements
- **Service functions (AI, Supabase):** 80%+ coverage
- **Utility functions:** 90%+ coverage
- **Components:** 70%+ coverage
- **Hooks:** 80%+ coverage

### Test Naming Convention
```typescript
it('should [expected behavior] when [condition]')
```

---

## SDLC Standards

### Definition of Done (DoD)

A User Story is DONE when:
- [ ] All Acceptance Criteria are met
- [ ] Code passes linting (`npm run lint`)
- [ ] All tests pass (`npm test`)
- [ ] Test coverage meets standards
- [ ] Manual verification completed
- [ ] Code reviewed (self-review for solo dev)
- [ ] Documentation updated
- [ ] PR merged to main
- [ ] Branch cleaned up

### Code Review Checklist (Self-Review)

Before proposing commit:
- [ ] No commented-out code
- [ ] No console.log statements (use proper error handling)
- [ ] No hardcoded values that should be constants
- [ ] Error handling in place
- [ ] Types are explicit (no `any`)
- [ ] Functions have single responsibility

### PR Requirements
- Title: `feat: US-XXX short description` or `fix: US-XXX short description`
- Description includes: what changed, why, how to test
- All CI checks pass

---

## Git Workflow

### Branch Naming
```
{issue-number}-{short-description}
Examples:
1-project-setup
5-entry-form
12-ai-followup-questions
```

### Commit Convention (Conventional Commits)
```
type(scope): short description

Types: feat, fix, test, refactor, docs, chore, ci, style, perf
Scopes: entry, ai, settings, ui, db, infra
```

**Note:** Never use `&&` in PowerShell — run each command separately.

---

## Files to NEVER Commit

Before `git add`, verify you're not adding:
- `node_modules/`
- `.env`, `.env.local`, `.env.*.local`
- `dist/`, `build/`, `out/`
- `.idea/`, `.vscode/` (except shared settings)
- `.DS_Store`, `Thumbs.db`
- `*.log`
- `coverage/`
- `.cache/`

If `git status` shows any of these, check `.gitignore` first.

---

## Workflow Enforcement

**Before starting any implementation:**
1. Check if `.claude/current_task.md` exists
2. If NOT exists → STOP and say: "No task instruction found. Run /planning first."
3. If exists → read it and follow the tasks listed

**After completing implementation:**
1. Run linter: `npm run lint`
2. Run tests: `npm test`
3. Propose commit for changes
4. Present manual verification steps and say: "Przeprowadź weryfikację manualną i wpisz 1 gdy gotowe."
5. When user types "1" confirming manual verification → automatically invoke `/qa` skill. Do NOT ask — just do it.

**After every `git push` to a non-main branch:**
Immediately provide the PR title and description template:
```
Title: feat: US-XXX [short description]

## Summary
[What changed and why]

## Changes
- [Change 1]
- [Change 2]

## Testing
- [x] npm run lint passes
- [x] npm test passes
- [x] Manual verification completed

## Documentation
- [ ] STATUS.md updated
- [ ] BACKLOG.md updated
- [ ] README.md updated

Closes #[issue_number]
```
Say: "Skopiuj powyższy opis i wklej na GitHub przy tworzeniu PR."

---

## Backlog Structure

The backlog is split into three files — always read the right one:

| File | Contents | When to read |
|------|----------|--------------|
| `STATUS.md` | Current sprint, next US, M3 gate blockers, active bugs | **All agents — read first on startup** |
| `BACKLOG.md` | Active US details (📋 Planned only) — M2.5 | /planning (to find next US), /docs (to mark done) |
| `BACKLOG_DONE.md` | Completed ✅ US archive — read-only | /discover (for context), /docs (for reference) |
| `BACKLOG_FUTURE.md` | M3 and beyond — not current work | /discover only |

**Rule:** When an agent says "read BACKLOG.md", it means: read `STATUS.md` first for orientation, then `BACKLOG.md` for active US details.

---

## Documentation Sync Rule

If during implementation a discrepancy is found between user expectations and documentation:
1. **Stop and discuss** the discrepancy with user
2. **Resolve** what the correct behavior/requirement should be
3. **Immediately update** affected documentation:
   - `STATUS.md` — update progress, next US, bugs
   - `BACKLOG.md` — update active US, AC, tasks
   - `docs/requirements.md` — update requirements
   - `docs/architecture.md` — if architecture affected
4. **Do NOT wait for /docs agent** — fix documentation NOW
5. Include doc updates in the commit or a separate docs commit

---

## Agent Autonomy

**Execute without asking:**
- git status, git log, git diff, git branch
- Running linter and tests
- Reading project files

**Always ask before:**
- git add, git commit, git push
- Creating or modifying files

---

## Scope Boundaries

| Agent | Creates | Does NOT Create |
|-------|---------|-----------------|
| /dev | Implementation code | Tests |
| /qa | Tests, test_cases.md updates | Production code |
| /docs | Documentation updates | Code or tests |

---

## Never Do
- Never push directly to main — always PR
- Never commit secrets, API keys, or credentials
- Never push with failing tests or linting errors
- Never use `any` type
- Never skip the workflow (/pm → /planning → /dev → manual verify → /qa → /docs)

---

## Multi-Agent System

### Workflow Order
`/pm → /planning → /dev → manual verify → /qa → /docs`

### Agent Directory

| Agent | Purpose | Language |
|---|---|---|
| /pm | Session router, git status check | Polish |
| /discover | Strategic sessions, new Epics | Polish |
| /planning | US verification + Task instruction | Polish |
| /dev | Implementation (this file) | English |
| /qa | Tests | English |
| /debug | Problem solving | Polish |
| /docs | Documentation update | English |

---

## Project-Specific Patterns

### AI Service Pattern
All OpenAI calls go through `src/services/aiService.ts`. Never call OpenAI API directly from components.

### Supabase Service Pattern
All database operations go through `src/services/entryService.ts`. Never call Supabase directly from components.

### Settings Pattern
User settings (OpenAI API key) are stored in localStorage via `src/hooks/useSettings.ts`. Components read settings only through this hook.

---

*This document is the primary instruction file for /dev agent.*

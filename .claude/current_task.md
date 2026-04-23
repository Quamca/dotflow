# Current Task — US-003: Set up GitHub Actions CI pipeline

**Branch:** 3-github-actions-ci
**Created:** 2026-04-23
**Status:** 🔄 In Progress

## Context
Project infrastructure and database layer are done (US-001, US-002 complete). This US adds automated quality gates: a GitHub Actions workflow that runs lint + test + build on every PR to main. After this US no broken code can be merged to main without the developer noticing — CI will block the PR.

## Files to Read First
- docs/architecture.md (section 9 — Deployment Architecture diagram)
- package.json (to know the exact npm scripts: lint, test, build)

## Tasks
1. [ ] **TASK-003.1:** Create `.github/workflows/ci.yml` — Node 20, `npm ci`, then `npm run lint`, `npm test`, `npm run build` in sequence
2. [ ] **TASK-003.2:** Push branch, open PR to main, verify workflow triggers and passes
3. [ ] **TASK-003.3:** Enable required status check in GitHub → Settings → Branches → main protection rule (add `ci` check as required)
4. [ ] **TASK-003.4:** Manual verification — intentionally break lint locally, push, confirm PR is blocked

## Constraints
- Use `npm ci` (not `npm install`) for reproducible installs in CI
- Node version: 20 (matches local dev setup from docs/setup.md)
- Workflow must trigger on: `pull_request` targeting `main`
- No secrets needed — no Supabase/OpenAI keys required for lint + test + build
- Tests use Vitest with jsdom — no browser or network needed

## Acceptance Criteria (from BACKLOG.md)
- [ ] `.github/workflows/ci.yml` exists and runs on PR to main
- [ ] Workflow runs: `npm run lint`, `npm test`, `npm run build`
- [ ] Failing any step fails the workflow
- [ ] Branch protection on main requires this check to pass
- [ ] Workflow completes in under 3 minutes

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps:
  1. Otwórz PR na GitHubie — sprawdź że pojawia się check "CI" z żółtą kółką
  2. Poczekaj na zakończenie — sprawdź że wszystkie 3 kroki (lint, test, build) są zielone
  3. Wejdź w GitHub → Settings → Branches → main — sprawdź że "ci" jest jako required status check
  4. (Opcjonalne) Wprowadź błąd lintingu, push, sprawdź że PR jest zablokowany
- [ ] Potwierdź weryfikację wpisując "weryfikacja OK" lub "1"

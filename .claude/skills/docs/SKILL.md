---
name: docs
description: Update project documentation after US completion. Final agent in the workflow. Use after /qa (and optional /retro).
---

# Docs Agent — Dotflow

Documentation specialist for Dotflow.

## On activation

1. **Execute without asking:**
```powershell
git status
git diff main..HEAD --stat
git log main..HEAD --oneline
git branch --show-current
```

2. Ask: "Which US was completed? Provide US number."

3. Read:
- @BACKLOG.md
- @README.md
- @docs/architecture.md
- @docs/requirements.md
- @docs/wireframes.md
- @docs/code_snippets.md
- @docs/design_brief.md
- @docs/setup.md
- @CLAUDE.md

## Always update

- `BACKLOG.md` — mark all tasks complete ✅, US status → ✅ COMPLETED
- `README.md` — update "Latest" section with new version info

## Update if affected

- `docs/architecture.md` — new components, services, data flows
- `docs/requirements.md` — new requirements discovered
- `docs/code_snippets.md` — new reusable patterns
- `docs/wireframes.md` — UI changed from wireframe
- `docs/setup.md` — new setup steps, new dependencies, new env vars
- `docs/design_brief.md` — visual/UX decisions

## Do NOT modify

- `docs/test_cases.md` — owned by /qa
- `CLAUDE.md` — updated via /retro only

## Architectural impact check

For every US:
- New npm packages? → document in `docs/setup.md` and `docs/architecture.md`
- New files/folders? → update architecture folder structure
- New environment variables? → update `docs/setup.md` and `.env.example`
- Technical debt? → flag in BACKLOG.md
- Project Invariant changed? → alert user immediately

## CRITICAL: Branch workflow

**NEVER push directly to main.**

Before starting docs work, check current branch:
```powershell
git branch --show-current
```

If on `main` → STOP and say:
"Jesteś na main. Wszystkie zmiany powinny być na branchu US.
Czy chcesz utworzyć branch teraz?
1. Tak — utwórz branch [issue-number]-[us-name]
2. Nie — kontynuuj na main (nie zalecane)"

All commits must go to the US branch. Push to branch, not main.

## Commit message format

`docs: update documentation for US-XXX (FileA, FileB, FileC)`

List only files actually modified.

## After Completion — Full Closing Sequence

### Step 1 — Commit docs (on US branch)
```powershell
git add BACKLOG.md
git add README.md
git add docs/[changed files]
git commit -m "docs: update documentation for US-XXX (BACKLOG, README, [others])"
```

### Step 2 — Push to branch
```powershell
git push -u origin [branch-name]
```

### Step 3 — Pull Request

**After push, automatically create the PR using GitHub CLI:**

```bash
gh pr create --title "feat: US-XXX [short description]" --body "$(cat <<'EOF'
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
- [x] BACKLOG.md updated
- [x] README.md updated

Closes #[issue_number]
EOF
)"
```

After running, print the PR URL returned by `gh pr create`. Then say: "PR utworzony. Gdy zostanie zmergowany, wpisz 1."

### Step 4 — Cleanup (automatyczny po potwierdzeniu merge)

Zapytaj:
"Czy PR został już zmergowany?
1. Tak — wykonaj cleanup
2. Nie — poczekam"

Gdy użytkownik wybierze `1`, **automatycznie wykonaj bez pytania**:
```powershell
git checkout main
git pull
git branch -d [branch-name]
```

Potwierdź: "✅ Cleanup zakończony. Jesteś na main."

### Step 5 — Sugestia następnego US

Po cleanup automatycznie zasugeruj:
"✅ US-XXX zamknięty. Następny wg backlogu: **US-YYY — [tytuł]** (P0).
1. Tak — uruchom /planning"

(Tylko opcja 1 — jeśli użytkownik nie chce kontynuować, po prostu zamknie terminal.)

## UX — format pytań

Zawsze używaj formatu numerowanego:
```
1. Tak
2. Nie
```
Nigdy nie dodawaj opcji "Wyjaśnij" ani "Nie — zakończ sesję".

## Agent Autonomy

**Execute without asking:**
- git status, git log, git diff
- Reading project files
- git add, git commit, git push (inform what is being committed/pushed, but do not ask for confirmation)

**Execute automatically after user confirms (cyfra 1):**
- git checkout main
- git pull
- git branch -d [branch]

## Constraints
- NEVER push directly to main — always use US branch + PR
- Always show what files are being committed before committing
- Never modify CLAUDE.md
- Never delete content — only update or append
- PR description comes BEFORE the instruction to create PR
- Always suggest next US after cleanup (only "1. Tak" option)

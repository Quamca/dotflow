# Dotflow - Development Setup Guide

**Version:** 1.1
**Date:** 2026-04-23
**Platform:** Windows (PowerShell), macOS, Linux

---

## 1. Prerequisites

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| Node.js | 20 LTS+ | https://nodejs.org |
| npm | 10+ | Included with Node.js |
| Git | 2.0+ | https://git-scm.com |
| VS Code | Latest | https://code.visualstudio.com |

### Verify Installation

```powershell
node --version
npm --version
git --version
```

---

## 2. Project Setup

### 2.1 Clone Repository

```powershell
git clone https://github.com/Quamca/dotflow.git
cd dotflow
```

### 2.2 Install Dependencies

```powershell
npm install
```

### 2.3 Environment Configuration

1. Copy the environment template:
```powershell
copy .env.example .env
```

2. Fill in required values in `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Note: The OpenAI API key is NOT stored in `.env` — it is entered by the user in the app's Settings screen and stored in localStorage.

---

## 3. Supabase Setup

### 3.1 Create Supabase Project

1. Create account at https://supabase.com
2. Click "New project"
3. Name: `dotflow`
4. Choose a region close to you
5. Set a database password (save it somewhere safe)
6. Wait for project to initialize (~2 minutes)

### 3.2 Get Credentials

1. Go to: Project → Settings → API
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL` in `.env`
   - **anon / public key** → `VITE_SUPABASE_ANON_KEY` in `.env`

### 3.3 Create Database Tables

Go to: Supabase Dashboard → SQL Editor → New Query

Run this SQL:

```sql
-- Entries table
CREATE TABLE entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  emotions TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follow-up questions and answers
CREATE TABLE followups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id UUID REFERENCES entries(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connections between entries
CREATE TABLE connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_entry_id UUID REFERENCES entries(id) ON DELETE CASCADE,
  target_entry_id UUID REFERENCES entries(id) ON DELETE CASCADE,
  similarity_score FLOAT NOT NULL,
  connection_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.4 Disable Row Level Security (MVP — single user)

```sql
ALTER TABLE entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE followups DISABLE ROW LEVEL SECURITY;
ALTER TABLE connections DISABLE ROW LEVEL SECURITY;
```

**Important:** Re-enable RLS with proper policies when adding multi-user support.

---

## 4. OpenAI Setup

### 4.1 Get API Key

1. Create account at https://platform.openai.com
2. Go to: API Keys → Create new secret key
3. Copy the key (you'll only see it once)

### 4.2 Add to App

1. Start the app (`npm run dev`)
2. Go to Settings (⚙ icon)
3. Paste your API key
4. Click Save

The key is stored in localStorage on your device only.

**Costs:** GPT-4o-mini is very cheap. A typical follow-up question call costs ~$0.001. 100 entries ≈ $0.10.

---

## 5. Branch Protection Setup

After creating the repository, configure branch protection for `main`:

1. Go to: GitHub → Quamca/dotflow → Settings → Branches
2. Click "Add branch protection rule"
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging (add after CI setup)
   - ✅ Require branches to be up to date before merging
5. Save changes

**Why:** Prevents accidental direct pushes to main. All changes go through PR for traceability.

---

## 6. VS Code Configuration

### 6.1 Recommended Extensions

| Extension | ID | Purpose |
|-----------|-----|---------|
| ESLint | dbaeumer.vscode-eslint | Linting |
| Prettier | esbenp.prettier-vscode | Formatting |
| Tailwind CSS IntelliSense | bradlc.vscode-tailwindcss | Tailwind autocomplete |
| TypeScript | ms-vscode.vscode-typescript-next | Better TS support |

---

## 7. Running the Project

### Development Mode

```powershell
npm run dev
```

Opens at http://localhost:5173

### Build for Production

```powershell
npm run build
```

### Preview Production Build

```powershell
npm run preview
```

### Run Tests

```powershell
npm test
```

### Run Linter

```powershell
npm run lint
```

---

## 8. Deployment to Vercel

### First Deploy

1. Push code to GitHub
2. Go to https://vercel.com
3. Import project from GitHub: `Quamca/dotflow`
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

### Subsequent Deploys

Automatic on every merge to `main`.

---

## 9. Project Structure

```
dotflow/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route-level components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # External integrations (OpenAI, Supabase)
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Pure utility functions, AI prompts
│   ├── App.tsx
│   └── main.tsx
├── src/__tests__/       # Tests mirror source structure
├── public/
├── .claude/
│   └── skills/          # Claude Code agent definitions
├── docs/                # Project documentation
├── .env.example
├── CLAUDE.md            # /dev agent instructions
├── BACKLOG.md
└── README.md
```

---

## 10. Git Workflow

### Branch Naming

```
{issue-number}-{short-description}

Examples:
1-project-setup
5-entry-form
12-ai-followup-questions
```

### Commit Convention

```
type(scope): short description

Types: feat, fix, docs, test, refactor, chore, ci
Scopes: entry, ai, settings, ui, db, infra
```

### Standard Workflow

```powershell
git checkout -b 1-setup-project
# make changes
git add [files]
git commit -m "feat(infra): initialize Vite + React + TypeScript project"
git push -u origin 1-setup-project
# create PR on GitHub
# merge PR
git checkout main
git pull
git branch -d 1-setup-project
```

**Never use `&&` in PowerShell — run each command separately.**

---

## 11. Key Dependency Versions

| Package | Version | Added in |
|---------|---------|----------|
| react | ^18.3.1 | US-001 |
| vite | ^5.4.10 | US-001 |
| typescript | ~5.6.2 | US-001 |
| tailwindcss | ^3.4.14 | US-001 |
| vitest | ^2.1.3 | US-001 |
| @testing-library/react | ^16.0.0 | US-001 |
| @testing-library/jest-dom | ^6.6.0 | US-001 |
| eslint | ^9.13.0 | US-001 |
| prettier | ^3.3.3 | US-001 |
| @supabase/supabase-js | ^2.104.0 | US-002 |
| react-router-dom | ^7.14.2 | US-004 |
| @react-three/fiber | ^8.18.0 | US-201 |
| @react-three/drei | ^9.122.0 | US-201 |
| three | ^0.184.0 | US-201 |
| @types/three | ^0.170.0 | US-201 |

---

## 12. Troubleshooting

### Issue: Supabase connection fails

**Symptoms:** Network errors, data not loading

**Solution:** Check `.env` values. Make sure `VITE_` prefix is present on all variables.

---

### Issue: OpenAI API errors

**Symptoms:** Follow-up questions not generating

**Solution:** Check API key in Settings. Check OpenAI account has credits. Check browser console for specific error.

---

### Issue: `npm install` fails

**Solution:**
```powershell
node --version
npm cache clean --force
npm install
```

---

### Issue: RTL DOM not cleaned up between tests in Vitest

**Symptoms:** Component tests fail when run together — DOM from previous test bleeds into the next

**Cause:** RTL's auto-cleanup relies on `afterEach` in a global scope. Vitest does not enable globals by default, so the auto-cleanup hook never registers.

**Solution:** Explicitly call `cleanup` in `src/__tests__/setup.ts`:

```typescript
import { expect, afterEach } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
expect.extend(matchers)
afterEach(cleanup)
```

---

### Issue: `ReferenceError: expect is not defined` in Vitest

**Symptoms:** Tests fail immediately with `expect is not defined` when importing `@testing-library/jest-dom`

**Cause:** `@testing-library/jest-dom` v6 calls `expect.extend()` at module level, but Vitest does not put `expect` in global scope without `globals: true`.

**Solution:** In `src/__tests__/setup.ts`, use explicit imports instead of `import '@testing-library/jest-dom'`:

```typescript
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)
```

---

## 13. Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run build` | Production build |
| `git log --oneline -10` | Last 10 commits |
| `git diff main..HEAD` | Changes since main |

---

*This guide is updated when setup requirements change.*

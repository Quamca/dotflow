# Dotflow - Code Snippets & Patterns

**Version:** 1.3
**Date:** 2026-04-23
**Purpose:** Reusable code patterns discovered during development

---

## How to Use This Document

This document collects proven patterns and snippets discovered during development.
When implementing similar functionality, check here first to maintain consistency.

**Adding new snippets:**
- Add during /docs phase when a reusable pattern emerges
- Include: context, code, and when to use it
- Reference the US where it was first implemented

---

## 1. AI Service Patterns

### 1.1 OpenAI REST API via Native Fetch (US-006)

Call OpenAI directly without the `openai` npm package — native `fetch` keeps the bundle lean and avoids SDK version drift. Parse the JSON response defensively (returns `[]` on malformed JSON), cap at 3 questions, throw on non-ok HTTP status.

```typescript
// src/services/aiService.ts
import { FOLLOW_UP_SYSTEM_PROMPT } from '../utils/prompts'

export async function generateFollowUpQuestions(
  content: string,
  apiKey: string
): Promise<string[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: FOLLOW_UP_SYSTEM_PROMPT },
        { role: 'user', content },
      ],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  const raw = data.choices[0].message.content

  try {
    const questions = JSON.parse(raw) as string[]
    return questions.filter((q) => q.trim() !== '').slice(0, 3)
  } catch {
    return []
  }
}
```

**Key decisions:**
- Throw on non-ok HTTP so callers can display the right error (entry already saved, AI unavailable)
- Return `[]` on malformed JSON instead of throwing — allows graceful degradation
- Cap at 3 regardless of what the model returns

**Note:** On localhost, some ad blockers intercept OpenAI API calls (shows "Failed to fetch"). Test in incognito if AI features don't trigger.

**When to use:** Any new OpenAI API call in this project — follow this pattern for consistency.

---

## 2. Supabase Patterns

*To be populated during development.*

---

## 3. Error Handling Patterns

*To be populated during development.*

---

## 6. Page Patterns

### 6.1 Async Form Submit with Navigate (US-005)

Pattern for route-level form pages: async submit handler with loading state, error handling that preserves form content, and `useNavigate` redirect on success.

```typescript
// src/pages/NewEntryPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEntry } from '../services/entryService'

export default function NewEntryPage() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!content.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      await createEntry(content.trim())
      navigate('/')
    } catch {
      setError('Failed to save entry. Please try again.')
      setIsLoading(false)  // only reset on error — success navigates away
    }
  }

  return (
    // ...
    <button
      onClick={handleSubmit}
      disabled={!content.trim() || isLoading}
    >
      {isLoading ? 'Saving...' : 'Save →'}
    </button>
  )
}
```

**Key decisions:**
- `setIsLoading(false)` is called only in the `catch` block — on success the component unmounts via `navigate('/')` so resetting state is unnecessary
- Content is NOT cleared on error — preserves user's text
- Button disabled on both empty content and during loading

**Testing this pattern:**
```typescript
// Mock useNavigate to assert redirect
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

// Verify navigate called after success
await waitFor(() => {
  expect(mockNavigate).toHaveBeenCalledWith('/')
})
```

**When to use:** Any route page that submits data to a service and redirects on success.

---

## 4. Testing Patterns

### 4.1 Vitest + jest-dom Setup (US-001)

`@testing-library/jest-dom` v6 does not auto-extend Vitest's `expect`. Use the explicit pattern:

```typescript
// src/__tests__/setup.ts
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)
```

Register in `vite.config.ts` using `vitest/config` import (required for test type support):

```typescript
// vite.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
  },
})
```

**Why `vitest/config` not `vite`:** The `vitest/config` export includes the `test` field in the TypeScript types. Using `vite`'s `defineConfig` causes TS errors on the `test` property.

### 4.3 Mocking Global fetch in Vitest (US-006)

Use `vi.stubGlobal` to replace the native `fetch` for aiService tests. Always unstub in `afterEach` to prevent leaking into other test files:

```typescript
// src/__tests__/services/aiService.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
})

it('should return questions when OpenAI responds successfully', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(['Q1?', 'Q2?']) } }],
      }),
    })
  )

  const result = await generateFollowUpQuestions('content', 'sk-test')
  expect(result).toEqual(['Q1?', 'Q2?'])
})

it('should throw on non-ok response', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }))

  await expect(generateFollowUpQuestions('content', 'sk-bad')).rejects.toThrow(
    'OpenAI API error: 401'
  )
})
```

**Why `vi.stubGlobal` not `vi.mock('fetch')`:** `fetch` is a global, not a module — `vi.mock` only works for module imports. `vi.unstubAllGlobals()` in `afterEach` is the clean counterpart.

**When to use:** Any service test that calls native `fetch` directly.

### 4.2 RTL Cleanup in Vitest (US-004)

Vitest does not enable globals by default, so RTL's auto-cleanup `afterEach` never registers. Without this, component tests bleed DOM state into each other. Always add explicit cleanup to the setup file:

```typescript
// src/__tests__/setup.ts
import { expect, afterEach } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'

expect.extend(matchers)
afterEach(cleanup)
```

---

## 5. React Hook Patterns

### 5.1 localStorage Hook with Lazy Initializer (US-004)

Pattern for hooks that read from localStorage on mount without triggering unnecessary re-renders. Pass a function to `useState` (lazy initializer) — it runs once on mount, not on every render:

```typescript
// src/hooks/useSettings.ts
import { useState } from 'react'

const API_KEY_STORAGE_KEY = 'dotflow_openai_api_key'

export function useSettings() {
  const [apiKey, setApiKey] = useState<string | null>(
    () => localStorage.getItem(API_KEY_STORAGE_KEY)
  )

  function saveApiKey(key: string) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key)
    setApiKey(key)
  }

  function clearApiKey() {
    localStorage.removeItem(API_KEY_STORAGE_KEY)
    setApiKey(null)
  }

  return { apiKey, saveApiKey, clearApiKey }
}
```

**When to use:** Any hook that needs to sync state with localStorage on mount.

---

## 2. Supabase Patterns

### 2.1 Supabase Client Initialization (US-002)

Initialize once in `src/lib/supabase.ts`, import only in service files — never in components:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 2.2 Mocking Supabase Chained Calls in Tests (US-002)

Supabase uses deeply chained calls (`.from().select().order()`). Mock `src/lib/supabase` directly — not `@supabase/supabase-js` — to avoid mock complexity. Cast through `unknown` to satisfy TypeScript without `any`:

```typescript
vi.mock('../../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

// In each test — match the chain your function uses:
vi.mocked(supabase.from).mockReturnValue({
  select: vi.fn().mockReturnValue({
    order: vi.fn().mockResolvedValue({ data: [mockEntry], error: null }),
  }),
} as unknown as ReturnType<typeof supabase.from>)
```

---

## Snippet Index

| Category | Pattern | Section |
|----------|---------|---------|
| AI Service | OpenAI REST API via native fetch | 1.1 |
| Testing | Vitest + jest-dom setup (explicit extend) | 4.1 |
| Testing | RTL cleanup in Vitest (explicit afterEach) | 4.2 |
| Testing | Mocking global fetch with vi.stubGlobal | 4.3 |
| Supabase | Client initialization pattern | 2.1 |
| Supabase | Mocking chained calls in tests | 2.2 |
| React Hooks | localStorage hook with lazy initializer | 5.1 |
| Page Patterns | Async form submit with navigate | 6.1 |

---

*This document grows during development. Add patterns during /docs sessions.*

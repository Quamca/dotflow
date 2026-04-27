# Dotflow - Code Snippets & Patterns

**Version:** 1.7
**Date:** 2026-04-26
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

### 1.2 Fire-and-Forget Background AI Call (US-101)

Pattern for triggering a background AI task after an async action (e.g., entry save) without blocking the UI. The function never throws — errors are swallowed silently. Caller uses `void` to explicitly discard the promise.

```typescript
// src/pages/NewEntryPage.tsx

async function detectAndSaveConnection(newEntry: Entry, apiKey: string): Promise<void> {
  try {
    const allEntries = await getEntries()
    const pastEntries = allEntries.filter((e) => e.id !== newEntry.id).slice(0, 10)
    if (pastEntries.length === 0) return
    const result = await findConnection(newEntry, pastEntries, apiKey)
    if (result.connected && result.entry_id && result.score >= 0.7) {
      await saveConnection(newEntry.id, result.entry_id, result.score, result.note)
    }
  } catch {
    // silently ignore — connection detection is best-effort
  }
}

// In handleSubmit, after saving the entry:
if (apiKey) { void detectAndSaveConnection(entry, apiKey) }
```

**Key decisions:**
- `void` prefix makes the fire-and-forget intent explicit — the promise is not awaited
- Outer try/catch ensures no uncaught rejection reaches the browser console
- `findConnection()` also never throws (its own internal fallback) — double safety
- Score threshold `>= 0.7` is enforced here (not inside findConnection) to keep the service pure

**Companion: resilient background loading in HomePage**

When loading connections in the entry list, use `Promise.allSettled` so individual failures don't break the entire list. Wrap each call in `Promise.resolve().then(() => fn())` to safely convert synchronous throws into rejected promises:

```typescript
// src/pages/HomePage.tsx (inside useEffect load())
void Promise.allSettled(
  loadedEntries.map((e) => Promise.resolve().then(() => getConnectionsForEntry(e.id)))
).then((results) => {
  const connectionMap: Record<string, Connection> = {}
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      connectionMap[loadedEntries[index].id] = result.value[0]
    }
  })
  setConnections(connectionMap)
})
```

**Why `Promise.resolve().then(() => fn())`:** If `fn()` throws synchronously (e.g., mock not set up in tests), `Promise.allSettled` cannot catch it — only rejected promises are handled. Wrapping in `.then()` converts any synchronous throw into a rejected promise that `allSettled` can safely handle.

**When to use:** Any background task that should not block the UI, should not show errors to the user, and may fail without consequence.

### 1.3 User-Triggered AI Call with Loading/Error/Result State (US-102)

Pattern for an explicit button action that calls AI, shows loading, handles error, and displays results inline. Unlike fire-and-forget (1.2), the user waits for the result and sees it on screen.

```typescript
// src/pages/HomePage.tsx (simplified)
const [observations, setObservations] = useState<string[]>([])
const [isInsightsLoading, setIsInsightsLoading] = useState(false)
const [insightsError, setInsightsError] = useState<string | null>(null)

async function handleGenerateInsights() {
  if (!apiKey) {
    setInsightsError('Set your API key in Settings to use this feature.')
    return
  }
  setIsInsightsLoading(true)
  setInsightsError(null)
  try {
    const result = await generatePatternSummary(entries, apiKey)
    setObservations(result)
  } catch {
    setInsightsError('Failed to generate insights. Please try again.')
  } finally {
    setIsInsightsLoading(false)
  }
}
```

**Key decisions:**
- No API key → set info message immediately, do not call AI
- `generatePatternSummary` throws on non-ok HTTP → caught here, shown as error message
- `finally` always clears loading state
- Result (`observations`) is stored in component state and passed directly to `PatternSummary`

**When to use:** Any explicit user action that calls an AI service and shows the result inline (not background, not navigating away).

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

### 6.2 useEffect Data Loading with Loading/Error State (US-007)

Pattern for pages that fetch data on mount: `useEffect` drives a three-state (`loading` / `error` / `data`) render. Uses a local `isMounted` flag to avoid state updates on unmounted components when navigating away during fetch.

```typescript
// src/pages/HomePage.tsx (simplified)
import { useEffect, useState } from 'react'
import { getEntries } from '../services/entryService'
import type { Entry } from '../types'

export default function HomePage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadEntries() {
      try {
        const data = await getEntries()
        if (isMounted) setEntries(data)
      } catch {
        if (isMounted) setError('Failed to load entries. Please refresh.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadEntries()
    return () => { isMounted = false }
  }, [])

  if (isLoading) return <LoadingSkeleton />
  if (error) return <p>{error}</p>
  if (entries.length === 0) return <EmptyState />
  return <>{entries.map((e) => <EntryCard key={e.id} entry={e} onClick={...} />)}</>
}
```

**Key decisions:**
- `isMounted` flag prevents `setState` on unmounted component (React warning avoided)
- Three render branches are clearly ordered: loading → error → empty → data
- `finally` always clears `isLoading` so skeleton never gets stuck
- Loading skeleton uses `animate-pulse` (Tailwind built-in) — no extra library needed

**Testing this pattern:**
```typescript
// Mock the service before each test
vi.mock('../../services/entryService', () => ({
  getEntries: vi.fn(),
}))

beforeEach(() => {
  vi.mocked(getEntries).mockResolvedValue([])
})

// Use findBy* (async) to wait for state to settle after fetch
it('should show empty state when no entries exist', async () => {
  renderHomePage()
  expect(await screen.findByText(/your story starts here/i)).toBeInTheDocument()
})

it('should show error when fetch fails', async () => {
  vi.mocked(getEntries).mockRejectedValue(new Error('Fetch failed'))
  renderHomePage()
  expect(await screen.findByText(/failed to load entries/i)).toBeInTheDocument()
})
```

**When to use:** Any page that loads a list of items from a service on mount.

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

### 4.4 Mocking Three.js / react-three-fiber in jsdom Tests (US-201)

`@react-three/fiber` uses `ResizeObserver` and WebGL Canvas APIs that jsdom does not implement. Two mocks are required — one global polyfill in setup, one component-level null mock wherever StarField is rendered:

```typescript
// src/__tests__/setup.ts — ResizeObserver polyfill
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
```

```typescript
// At the top of any test file that renders HomePage or any page importing StarField
vi.mock('../components/StarField/StarField', () => ({
  default: () => null,
}))
```

**Why component mock:** Even with ResizeObserver polyfilled, jsdom has no WebGL context — `@react-three/fiber` Canvas will throw. Returning `null` from the mock completely bypasses the Three.js render tree while still testing all surrounding page logic.

**Why NOT mock react-three-fiber itself:** Mocking the entire renderer would break type checking and leak into unrelated tests. A targeted `vi.mock` for the single StarField component is more surgical.

**When to use:** Any test file whose render tree includes a component that creates a Three.js Canvas.

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
| AI Service | Fire-and-forget background AI call | 1.2 |
| AI Service | User-triggered AI call with loading/error/result state | 1.3 |
| Testing | Vitest + jest-dom setup (explicit extend) | 4.1 |
| Testing | RTL cleanup in Vitest (explicit afterEach) | 4.2 |
| Testing | Mocking global fetch with vi.stubGlobal | 4.3 |
| Testing | Mocking Three.js / StarField in jsdom tests | 4.4 |
| Supabase | Client initialization pattern | 2.1 |
| Supabase | Mocking chained calls in tests | 2.2 |
| React Hooks | localStorage hook with lazy initializer | 5.1 |
| React Hooks | Multi-key localStorage hook with JSON serialization | 5.2 |
| Page Patterns | Async form submit with navigate | 6.1 |
| Page Patterns | useEffect data loading with loading/error state | 6.2 |
| UI Patterns | Strikethrough-restore editable list | 7.1 |

---

## 7. UI Patterns

### 7.1 Strikethrough-Restore Editable List (US-202)

Pattern for a list where items are "soft-removed" (strikethrough + Restore link) instead of hard-deleted. Avoids accidental deletion and allows the user to change their mind without re-typing.

```typescript
// src/components/ValuesModal/ValuesModal.tsx (simplified)
interface ThemeItem {
  text: string
  removed: boolean
}

const [items, setItems] = useState<ThemeItem[]>(
  () => proposedThemes.map((text) => ({ text, removed: false }))
)

function handleToggleRemove(index: number) {
  setItems(items.map((item, i) =>
    i === index ? { ...item, removed: !item.removed } : item
  ))
}

// Render:
{items.map((item, i) => (
  <div key={i} style={{ textDecoration: item.removed ? 'line-through' : 'none' }}>
    <span>{item.text}</span>
    <button onClick={() => handleToggleRemove(i)}>
      {item.removed ? 'Restore' : 'Remove'}
    </button>
  </div>
))}

// On confirm — collect only active items:
const activeValues = items.filter((item) => !item.removed).map((item) => item.text)
```

**Key decisions:**
- `removed` flag on each item — never splice, never lose data
- Toggle function: one handler for both remove and restore — same index, flip `removed`
- Confirm filters out removed items — caller never sees them

**When to use:** Any editable list where accidental deletion would be costly or frustrating (tag editing, value lists, configuration items).

---

## 5. React Hook Patterns (continued)

### 5.2 Multi-Key localStorage Hook with JSON Serialization (US-202)

Pattern for a hook that manages multiple related localStorage keys — one storing a JSON array, one storing a boolean flag. Both are initialized lazily on mount.

```typescript
// src/hooks/useUserValues.ts
const CONFIRMED_VALUES_KEY = 'dotflow_user_values'
const PENDING_PROPOSAL_KEY = 'dotflow_values_proposal_dismissed'

export function useUserValues() {
  const [confirmedValues, setConfirmedValues] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(CONFIRMED_VALUES_KEY)
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []  // guard against malformed JSON in storage
    }
  })

  const [proposalDismissed, setProposalDismissed] = useState<boolean>(
    () => localStorage.getItem(PENDING_PROPOSAL_KEY) === 'true'
  )

  function confirmValues(values: string[]) {
    localStorage.setItem(CONFIRMED_VALUES_KEY, JSON.stringify(values))
    setConfirmedValues(values)
  }

  function dismissProposal() {
    localStorage.setItem(PENDING_PROPOSAL_KEY, 'true')
    setProposalDismissed(true)
  }

  function clearValues() {
    localStorage.removeItem(CONFIRMED_VALUES_KEY)
    localStorage.removeItem(PENDING_PROPOSAL_KEY)
    setConfirmedValues([])
    setProposalDismissed(false)
  }

  return { confirmedValues, hasConfirmed: confirmedValues.length > 0, proposalDismissed, confirmValues, dismissProposal, clearValues }
}
```

**Key decisions:**
- `try/catch` around `JSON.parse` — defensive against manually corrupted localStorage
- `hasConfirmed` is derived (not stored) — single source of truth is `confirmedValues.length`
- `clearValues` removes both keys atomically — no partial state left in storage
- Follows the same lazy initializer pattern as `useSettings` (5.1)

**When to use:** Any hook that manages related localStorage state where one key stores JSON and another stores a simple flag.

---

*This document grows during development. Add patterns during /docs sessions.*

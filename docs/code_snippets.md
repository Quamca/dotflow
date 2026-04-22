# Dotflow - Code Snippets & Patterns

**Version:** 1.1
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

*To be populated during development.*

---

## 2. Supabase Patterns

*To be populated during development.*

---

## 3. Error Handling Patterns

*To be populated during development.*

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

---

## 5. React Hook Patterns

*To be populated during development.*

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
| Testing | Vitest + jest-dom setup (explicit extend) | 4.1 |
| Supabase | Client initialization pattern | 2.1 |
| Supabase | Mocking chained calls in tests | 2.2 |

---

*This document grows during development. Add patterns during /docs sessions.*

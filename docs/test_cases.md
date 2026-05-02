# Dotflow - Test Cases Documentation

**Version:** 2.0
**Date:** 2026-04-26
**Author:** QA Agent
**Test Framework:** Vitest + React Testing Library

---

## 1. Test Strategy Overview

### 1.1 Test Levels

| Level | Scope | Responsibility |
|-------|-------|----------------|
| Unit Tests | Service functions, utilities, hooks | /qa agent |
| Component Tests | UI components in isolation | /qa agent |
| Integration Tests | Multi-component flows | /qa agent |
| E2E Tests | Full user flows | Manual (future) |

### 1.2 Coverage Goals

| Category | Target Coverage |
|----------|-----------------|
| AI service functions | 80%+ |
| Entry service functions | 80%+ |
| Utility functions | 90%+ |
| UI components | 70%+ |
| Custom hooks | 80%+ |

### 1.3 Test Naming Convention

```typescript
it('should [expected behavior] when [condition]')

Examples:
- it('should save entry when form is submitted with content')
- it('should show error when API key is missing')
- it('should display follow-up questions after entry submission')
```

---

## 2. Test Environment Setup

### 2.1 Required Mocks

| Dependency | Mock Strategy |
|------------|---------------|
| Supabase client | Mock via `vi.mock('@supabase/supabase-js')` |
| OpenAI API | Mock fetch calls via `vi.stubGlobal('fetch', ...)` |
| localStorage | Use `vi.stubGlobal('localStorage', ...)` |
| react-router-dom | Mock with MemoryRouter in component tests |

### 2.2 Test Utilities

```typescript
// src/__tests__/utils/testHelpers.ts
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

export function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    ),
  })
}

export const mockEntry = {
  id: 'test-uuid-1',
  content: 'Had a tough day at work today.',
  emotions: ['frustrated'],
  tags: ['work'],
  created_at: '2026-04-09T20:00:00Z',
  updated_at: '2026-04-09T20:00:00Z',
}
```

---

## 3. Test Cases by Feature

## 3.0 FEATURE: Project Setup & Infrastructure

### TC-000: Vitest framework initializes and runs

**Related US:** US-001
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- Vitest configured in vite.config.ts
- `@testing-library/jest-dom` matchers extended in setup.ts

**Test Steps:**
1. Run `npm test`

**Expected Result:**
- Test suite runs without errors
- `expect` extended with jest-dom matchers
- All tests pass

**File:** `src/__tests__/setup.test.ts`
**Status:** ✅ Done

---

### TC-012: createEntry returns new entry when save succeeds

**Related US:** US-002
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- Supabase client mocked via `vi.mock('../../lib/supabase')`

**Test Steps:**
1. Mock Supabase chain to return `mockEntry`
2. Call `createEntry('Had a tough day at work.')`

**Expected Result:**
- Returns entry object matching `mockEntry`

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

### TC-013: createEntry throws when Supabase returns an error

**Related US:** US-002
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- Supabase mock returns `{ data: null, error: { message: 'Insert failed' } }`

**Test Steps:**
1. Call `createEntry('some content')`

**Expected Result:**
- Promise rejects with `'Insert failed'`

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

### TC-014: getEntries returns list of entries when fetch succeeds

**Related US:** US-002
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- Supabase mock returns `[mockEntry]`

**Test Steps:**
1. Call `getEntries()`

**Expected Result:**
- Returns array containing `mockEntry`

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

### TC-015: getEntries returns empty array when no entries exist

**Related US:** US-002
**Type:** Unit
**Priority:** High

**Preconditions:**
- Supabase mock returns `{ data: null, error: null }`

**Test Steps:**
1. Call `getEntries()`

**Expected Result:**
- Returns `[]`

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

### TC-016: getEntries throws when Supabase returns an error

**Related US:** US-002
**Type:** Unit
**Priority:** High

**Preconditions:**
- Supabase mock returns `{ data: null, error: { message: 'Fetch failed' } }`

**Test Steps:**
1. Call `getEntries()`

**Expected Result:**
- Promise rejects with `'Fetch failed'`

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

### TC-017: getEntryById returns entry with follow-ups when found

**Related US:** US-002
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- Supabase mock returns `mockEntryWithFollowUps`

**Test Steps:**
1. Call `getEntryById('uuid-1')`

**Expected Result:**
- Returns entry with `followups` array of length 1

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

### TC-018: getEntryById throws when entry is not found

**Related US:** US-002
**Type:** Unit
**Priority:** High

**Preconditions:**
- Supabase mock returns `{ data: null, error: { message: 'Entry not found' } }`

**Test Steps:**
1. Call `getEntryById('non-existent-id')`

**Expected Result:**
- Promise rejects with `'Entry not found'`

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

## 3.1 FEATURE: Settings — API Key Management

### TC-001: User can save API key

**Related US:** US-004
**Type:** Component
**Priority:** Critical

**Preconditions:**
- Settings page rendered
- No existing API key in localStorage

**Test Steps:**
1. Render SettingsPage
2. Find API key input
3. Type a mock API key
4. Click Save

**Expected Result:**
- Key stored in localStorage
- Input shows masked key (`sk-...xxxx`)

**File:** `src/__tests__/pages/SettingsPage.test.tsx`
**Status:** ✅ Done

---

### TC-002: App shows warning when API key missing

**Related US:** US-004
**Type:** Component
**Priority:** Critical

**Preconditions:**
- localStorage has no API key

**Test Steps:**
1. Render HomePage with no API key set
2. Observe banner area

**Expected Result:**
- Warning banner visible: "Add your API key in Settings"

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-019: useSettings returns null when no key stored

**Related US:** US-004
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- localStorage is empty

**Test Steps:**
1. Render `useSettings` hook via `renderHook`

**Expected Result:**
- `apiKey` is `null`

**File:** `src/__tests__/hooks/useSettings.test.ts`
**Status:** ✅ Done

---

### TC-020: useSettings initializes with existing key from localStorage

**Related US:** US-004
**Type:** Unit
**Priority:** High

**Preconditions:**
- `dotflow_openai_api_key` set in localStorage before render

**Test Steps:**
1. Set localStorage key
2. Render `useSettings` hook

**Expected Result:**
- `apiKey` equals the stored key

**File:** `src/__tests__/hooks/useSettings.test.ts`
**Status:** ✅ Done

---

### TC-021: useSettings saves key to localStorage when saveApiKey called

**Related US:** US-004
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- localStorage is empty

**Test Steps:**
1. Render `useSettings` hook
2. Call `saveApiKey('sk-testkey1234')`

**Expected Result:**
- `apiKey` state updated
- localStorage contains the key

**File:** `src/__tests__/hooks/useSettings.test.ts`
**Status:** ✅ Done

---

### TC-022: useSettings clears key from localStorage when clearApiKey called

**Related US:** US-004
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- localStorage contains API key

**Test Steps:**
1. Render `useSettings` hook
2. Call `clearApiKey()`

**Expected Result:**
- `apiKey` is `null`
- localStorage key removed

**File:** `src/__tests__/hooks/useSettings.test.ts`
**Status:** ✅ Done

---

### TC-023: Settings page shows input field after clearing key

**Related US:** US-004
**Type:** Component
**Priority:** High

**Preconditions:**
- localStorage contains API key

**Test Steps:**
1. Render SettingsPage (shows masked key + Clear button)
2. Click Clear

**Expected Result:**
- Input field reappears
- localStorage key removed

**File:** `src/__tests__/pages/SettingsPage.test.tsx`
**Status:** ✅ Done

---

### TC-024: App does not show warning banner when API key is set

**Related US:** US-004
**Type:** Component
**Priority:** High

**Preconditions:**
- localStorage contains API key

**Test Steps:**
1. Set localStorage key
2. Render HomePage

**Expected Result:**
- Warning banner NOT present in DOM

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

## 3.2 FEATURE: Entry Creation

### TC-003: User can submit a new entry

**Related US:** US-005
**Type:** Component
**Priority:** Critical

**Preconditions:**
- New Entry page rendered
- `createEntry` mocked to return success

**Test Steps:**
1. Render NewEntryPage
2. Type content into textarea
3. Click Save

**Expected Result:**
- `createEntry` called with typed content

**File:** `src/__tests__/pages/NewEntryPage.test.tsx`
**Status:** ✅ Done

---

### TC-004: Save button disabled when textarea is empty

**Related US:** US-005
**Type:** Component
**Priority:** High

**Preconditions:**
- New Entry page rendered
- Textarea is empty

**Test Steps:**
1. Render NewEntryPage
2. Do not type anything
3. Check Save button state

**Expected Result:**
- Save button is disabled

**File:** `src/__tests__/pages/NewEntryPage.test.tsx`
**Status:** ✅ Done

---

### TC-025: NewEntryPage navigates to Home after successful save

**Related US:** US-005
**Type:** Component
**Priority:** Critical

**Preconditions:**
- `createEntry` mocked to resolve successfully

**Test Steps:**
1. Render NewEntryPage
2. Type content
3. Click Save

**Expected Result:**
- `navigate('/')` called after save completes

**File:** `src/__tests__/pages/NewEntryPage.test.tsx`
**Status:** ✅ Done

---

### TC-026: NewEntryPage shows error message and preserves content when save fails

**Related US:** US-005
**Type:** Component
**Priority:** High

**Preconditions:**
- `createEntry` mocked to reject with an error

**Test Steps:**
1. Render NewEntryPage
2. Type content
3. Click Save

**Expected Result:**
- Error message "Failed to save entry..." visible
- Textarea content unchanged

**File:** `src/__tests__/pages/NewEntryPage.test.tsx`
**Status:** ✅ Done

---

### TC-028: HomePage shows Write button

**Related US:** US-005
**Type:** Component
**Priority:** High

**Preconditions:**
- HomePage rendered

**Test Steps:**
1. Render HomePage

**Expected Result:**
- Link with text "+ Write" is present in the DOM

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-005: Entry appears in list after saving

**Related US:** US-007
**Type:** Integration
**Priority:** Critical

**Preconditions:**
- `getEntries` mocked to return one entry

**Test Steps:**
1. Render HomePage
2. Wait for entries to load

**Expected Result:**
- Entry card visible with correct content

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

## 3.3 FEATURE: AI Follow-Up Questions

### TC-006: Follow-up dialog appears after entry submission

**Related US:** US-006
**Type:** Integration
**Priority:** Critical

**Preconditions:**
- API key set (useSettings mocked to return `sk-testkey`)
- `createEntry` mocked to resolve
- `generateFollowUpQuestions` mocked to return 2 questions

**Test Steps:**
1. Render NewEntryPage
2. Type content
3. Click Save

**Expected Result:**
- FollowUpDialog visible
- First question displayed

**File:** `src/__tests__/pages/NewEntryPage.test.tsx`
**Status:** ✅ Done

---

### TC-007: User can skip a follow-up question

**Related US:** US-006
**Type:** Component
**Priority:** High

**Preconditions:**
- FollowUpDialog rendered with 2 questions

**Test Steps:**
1. Click "Skip"

**Expected Result:**
- Next question shown

**File:** `src/__tests__/components/FollowUpDialog/FollowUpDialog.test.tsx`
**Status:** ✅ Done

---

### TC-008: Entry saves without AI when API key is missing

**Related US:** US-006
**Type:** Component
**Priority:** High

**Preconditions:**
- `useSettings` mocked to return `apiKey: null`
- `createEntry` mocked to resolve

**Test Steps:**
1. Render NewEntryPage, type content, click Save

**Expected Result:**
- `navigate('/')` called
- No follow-up dialog in DOM

**File:** `src/__tests__/pages/NewEntryPage.test.tsx`
**Status:** ✅ Done

---

### TC-009: AI service generates questions from entry content

**Related US:** US-006
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return valid OpenAI response with JSON array

**Test Steps:**
1. Call `generateFollowUpQuestions('Had a tough meeting today', 'sk-test')`

**Expected Result:**
- Returns array of non-empty question strings

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-029: AI service throws when OpenAI returns non-ok response

**Related US:** US-006
**Type:** Unit
**Priority:** High

**Preconditions:**
- `fetch` stubbed to return `{ ok: false, status: 401 }`

**Test Steps:**
1. Call `generateFollowUpQuestions('content', 'sk-invalid')`

**Expected Result:**
- Promise rejects with `'OpenAI API error: 401'`

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-030: AI service returns empty array when response JSON is malformed

**Related US:** US-006
**Type:** Unit
**Priority:** Medium

**Preconditions:**
- `fetch` stubbed to return non-JSON content string

**Test Steps:**
1. Call `generateFollowUpQuestions('content', 'sk-test')`

**Expected Result:**
- Returns `[]`

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-031: FollowUpDialog shows Save Entry after all questions answered

**Related US:** US-006
**Type:** Component
**Priority:** Critical

**Preconditions:**
- FollowUpDialog rendered with 2 questions

**Test Steps:**
1. Click Skip (Q1)
2. Click Next (Q2)

**Expected Result:**
- "Save Entry ✓" button visible

**File:** `src/__tests__/components/FollowUpDialog/FollowUpDialog.test.tsx`
**Status:** ✅ Done

---

### TC-032: FollowUpDialog calls onSave with answered followups only

**Related US:** US-006
**Type:** Component
**Priority:** Critical

**Preconditions:**
- FollowUpDialog rendered with 2 questions

**Test Steps:**
1. Answer Q1, click Next
2. Skip Q2
3. Click Save Entry

**Expected Result:**
- `onSave` called with array containing only Q1 answer (Q2 filtered out)

**File:** `src/__tests__/components/FollowUpDialog/FollowUpDialog.test.tsx`
**Status:** ✅ Done

---

### TC-033: saveFollowUps inserts data into Supabase

**Related US:** US-006
**Type:** Unit
**Priority:** High

**Preconditions:**
- Supabase mock returns `{ error: null }`

**Test Steps:**
1. Call `saveFollowUps('uuid-1', [{ question, answer, order_index }])`

**Expected Result:**
- Resolves without error

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

### TC-034: NewEntryPage shows AI error when OpenAI fails

**Related US:** US-006
**Type:** Component
**Priority:** High

**Preconditions:**
- `createEntry` resolves, `generateFollowUpQuestions` rejects with Error

**Test Steps:**
1. Render NewEntryPage with API key set
2. Type content, click Save

**Expected Result:**
- Error message containing "AI questions unavailable" visible

**File:** `src/__tests__/pages/NewEntryPage.test.tsx`
**Status:** ✅ Done

---

## 3.4 FEATURE: Entry List View — and Connection Detection (US-101)

### TC-040: findConnection returns connection result when AI detects similarity

**Related US:** US-101
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return valid connection result JSON (`connected: true, score: 0.85`)

**Test Steps:**
1. Call `findConnection(newEntry, [pastEntry], 'sk-test')`

**Expected Result:**
- Returns object with `connected: true`, `entry_id` set, `score: 0.85`

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-041: findConnection returns fallback without throwing when API is not ok

**Related US:** US-101
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return `{ ok: false, status: 401 }`

**Test Steps:**
1. Call `findConnection(newEntry, [pastEntry], 'sk-invalid')`

**Expected Result:**
- Returns `{ connected: false, entry_id: null }` — does NOT throw

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-042: findConnection returns fallback when response JSON is malformed

**Related US:** US-101
**Type:** Unit
**Priority:** High

**Preconditions:**
- `fetch` stubbed to return non-JSON content string

**Test Steps:**
1. Call `findConnection(newEntry, [pastEntry], 'sk-test')`

**Expected Result:**
- Returns `{ connected: false }` — does NOT throw

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-043: findConnection returns fallback and skips API call when pastEntries is empty

**Related US:** US-101
**Type:** Unit
**Priority:** High

**Preconditions:**
- `fetch` spy set up

**Test Steps:**
1. Call `findConnection(newEntry, [], 'sk-test')`

**Expected Result:**
- Returns `{ connected: false }`
- `fetch` not called

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-044: saveConnection resolves when Supabase insert succeeds

**Related US:** US-101
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- Supabase mock returns `{ error: null }`

**Test Steps:**
1. Call `saveConnection('uuid-1', 'uuid-2', 0.85, 'note')`

**Expected Result:**
- Resolves without error

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

### TC-045: saveConnection throws when Supabase returns error

**Related US:** US-101
**Type:** Unit
**Priority:** High

**Preconditions:**
- Supabase mock returns `{ error: { message: 'Insert failed' } }`

**Test Steps:**
1. Call `saveConnection('uuid-1', 'uuid-2', 0.85, 'note')`

**Expected Result:**
- Promise rejects with `'Insert failed'`

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

### TC-046: getConnectionsForEntry returns connections array when found

**Related US:** US-101
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- Supabase mock returns `[mockConnection]`

**Test Steps:**
1. Call `getConnectionsForEntry('uuid-1')`

**Expected Result:**
- Returns array containing `mockConnection`

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

### TC-047: getConnectionsForEntry returns empty array when no connections found

**Related US:** US-101
**Type:** Unit
**Priority:** High

**Preconditions:**
- Supabase mock returns `{ data: null, error: null }`

**Test Steps:**
1. Call `getConnectionsForEntry('uuid-1')`

**Expected Result:**
- Returns `[]`

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

### TC-048: ConnectionBadge displays formatted connected date

**Related US:** US-101
**Type:** Component
**Priority:** Critical

**Preconditions:**
- ConnectionBadge rendered with `targetDate: '2026-04-09T20:00:00Z'`

**Test Steps:**
1. Render ConnectionBadge

**Expected Result:**
- Text "Connected to April 9, 2026" visible

**File:** `src/__tests__/components/ConnectionBadge/ConnectionBadge.test.tsx`
**Status:** ✅ Done

---

### TC-049: ConnectionBadge navigates to connected entry when clicked

**Related US:** US-101
**Type:** Component
**Priority:** Critical

**Preconditions:**
- ConnectionBadge rendered with `targetId: 'uuid-2'`
- `useNavigate` mocked

**Test Steps:**
1. Click the ConnectionBadge button

**Expected Result:**
- `navigate('/entry/uuid-2')` called

**File:** `src/__tests__/components/ConnectionBadge/ConnectionBadge.test.tsx`
**Status:** ✅ Done

---

### TC-050: HomePage shows connection badge when entry has a connection

**Related US:** US-101
**Type:** Integration
**Priority:** Critical

**Preconditions:**
- `getEntries` returns two entries
- `getConnectionsForEntry` returns connection for first entry pointing to second

**Test Steps:**
1. Render HomePage
2. Wait for entries and connections to load

**Expected Result:**
- "Connected to" badge visible in the DOM

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

## 3.5 FEATURE: Pattern Summary (US-102)

### TC-051: generatePatternSummary returns observations when API succeeds

**Related US:** US-102
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return valid OpenAI response with JSON array of observations

**Test Steps:**
1. Call `generatePatternSummary([entry], 'sk-test')`

**Expected Result:**
- Returns array of observation strings

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-052: generatePatternSummary throws when OpenAI returns non-ok response

**Related US:** US-102
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return `{ ok: false, status: 401 }`

**Test Steps:**
1. Call `generatePatternSummary([entry], 'sk-invalid')`

**Expected Result:**
- Promise rejects with `'OpenAI API error: 401'`

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-053: generatePatternSummary returns empty array when JSON is malformed

**Related US:** US-102
**Type:** Unit
**Priority:** High

**Preconditions:**
- `fetch` stubbed to return non-JSON content string

**Test Steps:**
1. Call `generatePatternSummary([entry], 'sk-test')`

**Expected Result:**
- Returns `[]`

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-054: generatePatternSummary caps observations at 5

**Related US:** US-102
**Type:** Unit
**Priority:** High

**Preconditions:**
- `fetch` stubbed to return 7 observations

**Test Steps:**
1. Call `generatePatternSummary([entry], 'sk-test')`

**Expected Result:**
- Returns array of length 5

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-055: PatternSummary renders observations as bullet list

**Related US:** US-102
**Type:** Component
**Priority:** Critical

**Preconditions:**
- `observations` prop contains 2 strings

**Test Steps:**
1. Render `PatternSummary` with 2 observations

**Expected Result:**
- "Your patterns" heading visible
- Both observation strings visible in DOM

**File:** `src/__tests__/components/PatternSummary/PatternSummary.test.tsx`
**Status:** ✅ Done

---

### TC-056: PatternSummary renders nothing when observations array is empty

**Related US:** US-102
**Type:** Component
**Priority:** High

**Preconditions:**
- `observations` prop is `[]`

**Test Steps:**
1. Render `PatternSummary` with empty array

**Expected Result:**
- Component renders null (no DOM output)

**File:** `src/__tests__/components/PatternSummary/PatternSummary.test.tsx`
**Status:** ✅ Done

---

### TC-057: HomePage shows Generate insights button when 10 or more entries exist

**Related US:** US-102
**Type:** Component
**Priority:** Critical

**Preconditions:**
- `getEntries` returns 10 entries

**Test Steps:**
1. Render HomePage

**Expected Result:**
- "Generate insights" button visible in DOM

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-058: HomePage does not show Generate insights button when fewer than 10 entries

**Related US:** US-102
**Type:** Component
**Priority:** Critical

**Preconditions:**
- `getEntries` returns 9 entries

**Test Steps:**
1. Render HomePage
2. Wait for entries to load

**Expected Result:**
- "Generate insights" button NOT in DOM

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-059: HomePage shows loading state when generating insights

**Related US:** US-102
**Type:** Component
**Priority:** High

**Preconditions:**
- 10 entries loaded, API key set, `generatePatternSummary` never resolves

**Test Steps:**
1. Render HomePage, wait for button
2. Click "Generate insights"

**Expected Result:**
- Button text changes to "Generating insights…"

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-060: HomePage shows error message when generatePatternSummary fails

**Related US:** US-102
**Type:** Component
**Priority:** High

**Preconditions:**
- 10 entries loaded, API key set, `generatePatternSummary` rejects

**Test Steps:**
1. Render HomePage, click button

**Expected Result:**
- "Failed to generate insights. Please try again." visible

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-061: HomePage shows observations when generatePatternSummary succeeds

**Related US:** US-102
**Type:** Integration
**Priority:** Critical

**Preconditions:**
- 10 entries loaded, API key set, `generatePatternSummary` resolves with 1 observation

**Test Steps:**
1. Render HomePage, click "Generate insights"

**Expected Result:**
- Observation text visible in DOM

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-062: HomePage shows info message when Generate insights clicked without API key

**Related US:** US-102
**Type:** Component
**Priority:** High

**Preconditions:**
- 10 entries loaded, no API key in localStorage

**Test Steps:**
1. Render HomePage, click "Generate insights"

**Expected Result:**
- "Set your API key in Settings to use this feature." visible

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

## 3.6 FEATURE: Pattern Summary — Language Fix (US-103)

### TC-063: PATTERN_SUMMARY_SYSTEM_PROMPT includes language instruction

**Related US:** US-103
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `src/utils/prompts.ts` imported

**Test Steps:**
1. Import `PATTERN_SUMMARY_SYSTEM_PROMPT`
2. Check for language instruction string

**Expected Result:**
- Prompt contains `"Respond in the same language as the journal entries"`

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-064: All prompts instruct AI to return structured JSON

**Related US:** US-103
**Type:** Unit
**Priority:** High

**Preconditions:**
- All three prompts imported from `src/utils/prompts.ts`

**Test Steps:**
1. Check each prompt for JSON format instruction

**Expected Result:**
- `FOLLOW_UP_SYSTEM_PROMPT` contains `"JSON array"`
- `PATTERN_SUMMARY_SYSTEM_PROMPT` contains `"JSON array"`
- `CONNECTION_DETECTION_SYSTEM_PROMPT` contains `"JSON object"`

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

## 3.7 FEATURE: 3D Star Field (US-201)

### TC-065: getStarPosition returns tuple of 3 numbers for a given entry id

**Related US:** US-201
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `src/utils/starPositions.ts` imported

**Test Steps:**
1. Call `getStarPosition('uuid-1')`

**Expected Result:**
- Returns array of length 3
- All elements are numbers

**File:** `src/__tests__/utils/starPositions.test.ts`
**Status:** ✅ Done

---

### TC-066: getStarPosition returns same position for same entry id

**Related US:** US-201
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `getStarPosition` imported

**Test Steps:**
1. Call `getStarPosition('uuid-abc-123')` twice

**Expected Result:**
- Both calls return identical `[x, y, z]` tuples

**File:** `src/__tests__/utils/starPositions.test.ts`
**Status:** ✅ Done

---

### TC-067: getStarPosition returns different positions for different entry ids

**Related US:** US-201
**Type:** Unit
**Priority:** High

**Preconditions:**
- `getStarPosition` imported

**Test Steps:**
1. Call `getStarPosition('uuid-1')` and `getStarPosition('uuid-2')`

**Expected Result:**
- Positions are not equal

**File:** `src/__tests__/utils/starPositions.test.ts`
**Status:** ✅ Done

---

### TC-068: getStarPosition returns position within expected radius range

**Related US:** US-201
**Type:** Unit
**Priority:** High

**Preconditions:**
- `getStarPosition` imported

**Test Steps:**
1. Call `getStarPosition('uuid-range-test')`
2. Compute `radius = sqrt(x² + y² + z²)`

**Expected Result:**
- `radius >= 3` and `radius <= 8`

**File:** `src/__tests__/utils/starPositions.test.ts`
**Status:** ✅ Done

---

### TC-069: HomePage shows Dotflow logo as Explore in 3D when entries are loaded

**Related US:** US-201
**Type:** Component
**Priority:** Critical

**Preconditions:**
- `getEntries` returns one entry

**Test Steps:**
1. Render HomePage
2. Wait for entries to load

**Expected Result:**
- Button with `aria-label="Explore in 3D"` present in DOM

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-070: Clicking Dotflow logo switches to 3D mode and hides entry list

**Related US:** US-201
**Type:** Component
**Priority:** Critical

**Preconditions:**
- `getEntries` returns one entry

**Test Steps:**
1. Render HomePage, wait for entries
2. Click "Explore in 3D" logo button

**Expected Result:**
- `+ Write` link not in DOM
- Button with `aria-label="Exit 3D view"` present

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-071: Clicking exit button in 3D mode returns to list view

**Related US:** US-201
**Type:** Component
**Priority:** Critical

**Preconditions:**
- `getEntries` returns one entry
- App in 3D mode (logo was clicked)

**Test Steps:**
1. Click "Explore in 3D" to enter 3D mode
2. Click "Exit 3D view" button

**Expected Result:**
- `+ Write` link visible again in DOM

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-010: Empty state shown when no entries

**Related US:** US-007
**Type:** Component
**Priority:** High

**Preconditions:**
- `getEntries` mocked to return empty array

**Test Steps:**
1. Render HomePage

**Expected Result:**
- Empty state text visible: "Your story starts here"

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-011: Error message shown when loading entries fails

**Related US:** US-007
**Type:** Component
**Priority:** High

**Preconditions:**
- `getEntries` mocked to reject with an error

**Test Steps:**
1. Render HomePage

**Expected Result:**
- Error message "Failed to load entries..." visible

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-035: EntryCard displays content, date, and emotion tags

**Related US:** US-007
**Type:** Component
**Priority:** Critical

**Preconditions:**
- Entry with content, emotions, and created_at date provided as props

**Test Steps:**
1. Render EntryCard with mockEntry

**Expected Result:**
- Content text visible
- Formatted date visible (e.g. "April 15, 2026")
- Emotion tag badges visible

**File:** `src/__tests__/components/EntryCard/EntryCard.test.tsx`
**Status:** ✅ Done

---

### TC-036: EntryCard calls onClick when clicked

**Related US:** US-007
**Type:** Component
**Priority:** Critical

**Preconditions:**
- `onClick` mock function provided

**Test Steps:**
1. Click the EntryCard button

**Expected Result:**
- `onClick` called once

**File:** `src/__tests__/components/EntryCard/EntryCard.test.tsx`
**Status:** ✅ Done

---

### TC-037: EntryDetailPage shows entry content and answered follow-ups

**Related US:** US-007
**Type:** Component
**Priority:** Critical

**Preconditions:**
- `getEntryById` mocked to return entry with 1 answered and 1 skipped follow-up

**Test Steps:**
1. Render EntryDetailPage at `/entry/uuid-1`
2. Wait for content to load

**Expected Result:**
- Entry content visible
- Answered follow-up question and answer visible
- Skipped follow-up (null answer) NOT visible

**File:** `src/__tests__/pages/EntryDetailPage.test.tsx`
**Status:** ✅ Done

---

### TC-038: EntryDetailPage shows error when entry not found

**Related US:** US-007
**Type:** Component
**Priority:** High

**Preconditions:**
- `getEntryById` mocked to reject

**Test Steps:**
1. Render EntryDetailPage with non-existent id

**Expected Result:**
- Error message "Entry not found" visible

**File:** `src/__tests__/pages/EntryDetailPage.test.tsx`
**Status:** ✅ Done

---

### TC-039: EntryDetailPage navigates to Home when Back is clicked

**Related US:** US-007
**Type:** Component
**Priority:** High

**Preconditions:**
- `getEntryById` mocked to return entry
- `useNavigate` mocked

**Test Steps:**
1. Wait for entry to load
2. Click "← Back" button

**Expected Result:**
- `navigate('/')` called

**File:** `src/__tests__/pages/EntryDetailPage.test.tsx`
**Status:** ✅ Done

---

## 3.8 FEATURE: Black Hole & Psychological Profile (US-202)

### TC-072: getAlignedStarPosition returns tuple of 3 numbers

**Related US:** US-202
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `getAlignedStarPosition` imported

**Test Steps:**
1. Call `getAlignedStarPosition('uuid-1', 'autonomy is important', ['autonomy'])`

**Expected Result:**
- Returns array of length 3, all elements are numbers

**File:** `src/__tests__/utils/starPositions.test.ts`
**Status:** ✅ Done

---

### TC-073: getAlignedStarPosition returns same position for same inputs

**Related US:** US-202
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/utils/starPositions.test.ts`
**Status:** ✅ Done

---

### TC-074: getAlignedStarPosition positions aligned entry within inner radius (1.5–3)

**Related US:** US-202
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- Entry content contains the matched value

**Test Steps:**
1. Call with content `'autonomy is important'` and values `['autonomy']`
2. Compute radius

**Expected Result:**
- `radius >= 1.5` and `radius <= 3`

**File:** `src/__tests__/utils/starPositions.test.ts`
**Status:** ✅ Done

---

### TC-075: getAlignedStarPosition positions non-aligned entry within outer radius (3–8)

**Related US:** US-202
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- Entry content does not contain any matched value

**Test Steps:**
1. Call with content `'went to the park today'` and values `['autonomy']`
2. Compute radius

**Expected Result:**
- `radius >= 3` and `radius <= 8`

**File:** `src/__tests__/utils/starPositions.test.ts`
**Status:** ✅ Done

---

### TC-076: getAlignedStarPosition falls back to default position when no values

**Related US:** US-202
**Type:** Unit
**Priority:** High

**Test Steps:**
1. Call `getAlignedStarPosition('uuid-fallback', 'any content', [])`
2. Call `getStarPosition('uuid-fallback')`

**Expected Result:**
- Both calls return identical `[x, y, z]`

**File:** `src/__tests__/utils/starPositions.test.ts`
**Status:** ✅ Done

---

### TC-077: extractUserValues returns array of theme strings when API succeeds

**Related US:** US-202
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return valid OpenAI response with JSON array of 5 themes

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-078: extractUserValues throws when OpenAI returns non-ok response

**Related US:** US-202
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-079: extractUserValues returns empty array when response JSON is malformed

**Related US:** US-202
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-080: extractUserValues caps themes at 5

**Related US:** US-202
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-081: USER_VALUES_SYSTEM_PROMPT uses observational-data language

**Related US:** US-202
**Type:** Unit
**Priority:** Critical

**Test Steps:**
1. Check prompt contains `'observed patterns'`

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-082: USER_VALUES_SYSTEM_PROMPT includes language instruction

**Related US:** US-202
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-083: USER_VALUES_SYSTEM_PROMPT instructs AI to return JSON array

**Related US:** US-202
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-084: useUserValues returns empty array when localStorage has no values

**Related US:** US-202
**Type:** Unit (hook)
**Priority:** Critical

**File:** `src/__tests__/hooks/useUserValues.test.ts`
**Status:** ✅ Done

---

### TC-085: useUserValues initializes with existing values from localStorage

**Related US:** US-202
**Type:** Unit (hook)
**Priority:** Critical

**File:** `src/__tests__/hooks/useUserValues.test.ts`
**Status:** ✅ Done

---

### TC-086: useUserValues saves values to localStorage when confirmValues is called

**Related US:** US-202
**Type:** Unit (hook)
**Priority:** Critical

**File:** `src/__tests__/hooks/useUserValues.test.ts`
**Status:** ✅ Done

---

### TC-087: useUserValues sets proposalDismissed when dismissProposal is called

**Related US:** US-202
**Type:** Unit (hook)
**Priority:** Critical

**File:** `src/__tests__/hooks/useUserValues.test.ts`
**Status:** ✅ Done

---

### TC-088: useUserValues clears all values when clearValues is called

**Related US:** US-202
**Type:** Unit (hook)
**Priority:** High

**File:** `src/__tests__/hooks/useUserValues.test.ts`
**Status:** ✅ Done

---

### TC-089: ValuesModal displays proposed themes

**Related US:** US-202
**Type:** Component
**Priority:** Critical

**File:** `src/__tests__/components/ValuesModal/ValuesModal.test.tsx`
**Status:** ✅ Done

---

### TC-090: ValuesModal displays observational framing heading

**Related US:** US-202
**Type:** Component
**Priority:** Critical

**Preconditions:**
- ValuesModal rendered with proposed themes

**Expected Result:**
- Text "W Twoich wpisach te tematy wracają najczęściej" visible

**File:** `src/__tests__/components/ValuesModal/ValuesModal.test.tsx`
**Status:** ✅ Done

---

### TC-091: ValuesModal calls onDismiss when Pomiń is clicked

**Related US:** US-202
**Type:** Component
**Priority:** Critical

**File:** `src/__tests__/components/ValuesModal/ValuesModal.test.tsx`
**Status:** ✅ Done

---

### TC-092: ValuesModal calls onConfirm with original themes when Zatwierdź clicked

**Related US:** US-202
**Type:** Component
**Priority:** Critical

**File:** `src/__tests__/components/ValuesModal/ValuesModal.test.tsx`
**Status:** ✅ Done

---

### TC-093: ValuesModal removes theme from list when × clicked

**Related US:** US-202
**Type:** Component
**Priority:** High

**File:** `src/__tests__/components/ValuesModal/ValuesModal.test.tsx`
**Status:** ✅ Done

---

### TC-094: ValuesModal shows textarea when Żadna z tych checkbox is checked

**Related US:** US-202
**Type:** Component
**Priority:** Critical

**File:** `src/__tests__/components/ValuesModal/ValuesModal.test.tsx`
**Status:** ✅ Done

---

### TC-095: ValuesModal calls onConfirm with custom themes when Żadna z tych selected

**Related US:** US-202
**Type:** Component
**Priority:** Critical

**File:** `src/__tests__/components/ValuesModal/ValuesModal.test.tsx`
**Status:** ✅ Done

---

### TC-096: HomePage shows ValuesModal when 5+ entries exist and API key is set

**Related US:** US-202
**Type:** Integration
**Priority:** Critical

**Preconditions:**
- API key in localStorage
- `getEntries` returns 5 entries
- `extractUserValues` returns 5 theme strings

**Expected Result:**
- ValuesModal visible with observational heading

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-097: HomePage does not show ValuesModal when fewer than 5 entries

**Related US:** US-202
**Type:** Component
**Priority:** Critical

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-098: HomePage does not show ValuesModal when API key is missing

**Related US:** US-202
**Type:** Component
**Priority:** High

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-099: HomePage does not show ValuesModal when values already confirmed

**Related US:** US-202
**Type:** Component
**Priority:** High

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-100: HomePage closes ValuesModal after confirming values

**Related US:** US-202
**Type:** Integration
**Priority:** Critical

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

### TC-101: HomePage closes ValuesModal when Pomiń is clicked

**Related US:** US-202
**Type:** Component
**Priority:** High

**File:** `src/__tests__/pages/HomePage.test.tsx`
**Status:** ✅ Done

---

## 3.9 FEATURE: Dialectical Insight Response (US-203)

### TC-102: respondToInsightFeedback returns string when round 1 and API succeeds

**Related US:** US-203
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return valid OpenAI response with question string

**Test Steps:**
1. Call `respondToInsightFeedback(['insight'], 'feedback', 1, 'sk-test')`

**Expected Result:**
- Returns non-empty string

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-103: respondToInsightFeedback returns string when round 2 and API succeeds

**Related US:** US-203
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return valid OpenAI response with closing phrase string

**Test Steps:**
1. Call `respondToInsightFeedback(['insight'], 'my response', 2, 'sk-test')`

**Expected Result:**
- Returns non-empty string

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-104: respondToInsightFeedback throws when OpenAI returns non-ok response

**Related US:** US-203
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return `{ ok: false, status: 401 }`

**Test Steps:**
1. Call `respondToInsightFeedback(['insight'], 'feedback', 1, 'sk-invalid')`

**Expected Result:**
- Promise rejects with `'OpenAI API error: 401'`

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-105: respondToInsightFeedback uses DEEPENING_QUESTION_SYSTEM_PROMPT for round 1

**Related US:** US-203
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` spy set up

**Test Steps:**
1. Call `respondToInsightFeedback(['insight'], 'feedback', 1, 'sk-test')`
2. Inspect fetch body — `messages[0].content`

**Expected Result:**
- System prompt equals `DEEPENING_QUESTION_SYSTEM_PROMPT`

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-106: respondToInsightFeedback uses CLOSING_PHRASE_SYSTEM_PROMPT for round 2

**Related US:** US-203
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` spy set up

**Test Steps:**
1. Call `respondToInsightFeedback(['insight'], 'my response', 2, 'sk-test')`
2. Inspect fetch body — `messages[0].content`

**Expected Result:**
- System prompt equals `CLOSING_PHRASE_SYSTEM_PROMPT`

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-107: respondToInsightFeedback returns empty string when response content is missing

**Related US:** US-203
**Type:** Unit
**Priority:** High

**Preconditions:**
- `fetch` stubbed to return `content: null`

**Test Steps:**
1. Call `respondToInsightFeedback(['insight'], 'feedback', 1, 'sk-test')`

**Expected Result:**
- Returns `''`

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-108: DEEPENING_QUESTION_SYSTEM_PROMPT forbids "Dlaczego"

**Related US:** US-203
**Type:** Unit
**Priority:** Critical

**Expected Result:**
- Prompt contains `NEVER use "Dlaczego"`

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-109: DEEPENING_QUESTION_SYSTEM_PROMPT forbids "Ale"

**Related US:** US-203
**Type:** Unit
**Priority:** Critical

**Expected Result:**
- Prompt contains `NEVER use "Ale"`

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-110: DEEPENING_QUESTION_SYSTEM_PROMPT limits response to 15 words

**Related US:** US-203
**Type:** Unit
**Priority:** Critical

**Expected Result:**
- Prompt contains `15 words`

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-111: DEEPENING_QUESTION_SYSTEM_PROMPT requires observational language

**Related US:** US-203
**Type:** Unit
**Priority:** Critical

**Expected Result:**
- Prompt contains `observational language`

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-112: DEEPENING_QUESTION_SYSTEM_PROMPT includes language instruction

**Related US:** US-203
**Type:** Unit
**Priority:** High

**Expected Result:**
- Prompt contains `Respond in the same language as the user`

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-113: CLOSING_PHRASE_SYSTEM_PROMPT limits response to 15 words

**Related US:** US-203
**Type:** Unit
**Priority:** Critical

**Expected Result:**
- Prompt contains `15 words`

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-114: CLOSING_PHRASE_SYSTEM_PROMPT instructs AI to incorporate user's words

**Related US:** US-203
**Type:** Unit
**Priority:** Critical

**Expected Result:**
- Prompt contains `user's most recent message`

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-115: CLOSING_PHRASE_SYSTEM_PROMPT includes language instruction

**Related US:** US-203
**Type:** Unit
**Priority:** High

**Expected Result:**
- Prompt contains `Respond in the same language as the user`

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

## 3.10 FEATURE: Story Extraction (US-206)

### TC-116: extractStories returns array of story strings when API succeeds

**Related US:** US-206
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-117: extractStories returns fallback [content] when API returns non-ok response

**Related US:** US-206
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-118: extractStories returns fallback [content] when response JSON is malformed

**Related US:** US-206
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-119: extractStories returns fallback [content] when fetch throws

**Related US:** US-206
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-120: extractStories returns fallback [content] when AI returns empty array

**Related US:** US-206
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-121: extractStories caps stories at 5

**Related US:** US-206
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-122: extractStories filters out stories shorter than 10 characters

**Related US:** US-206
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-123: getStoryPosition returns tuple of 3 numbers

**Related US:** US-206
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/utils/starPositions.test.ts`
**Status:** ✅ Done

---

### TC-124: getStoryPosition returns same position for same story id

**Related US:** US-206
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/utils/starPositions.test.ts`
**Status:** ✅ Done

---

### TC-125: getStoryPosition returns different positions for different story ids

**Related US:** US-206
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/utils/starPositions.test.ts`
**Status:** ✅ Done

---

### TC-126: getStoryPosition returns position within story radius range (3.5 to 9.0)

**Related US:** US-206
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/utils/starPositions.test.ts`
**Status:** ✅ Done

---

### TC-127: getStoryPosition returns different position from entry star with same id string

**Related US:** US-206
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/utils/starPositions.test.ts`
**Status:** ✅ Done

---

### TC-128: saveStories returns empty array when given empty content array

**Related US:** US-206
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-129: saveStories calls Supabase insert with correct entry_id and content

**Related US:** US-206
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-130: saveStories returns saved stories array when Supabase insert succeeds

**Related US:** US-206
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-131: saveStories throws when Supabase returns error

**Related US:** US-206
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-132: getStoriesForEntry returns stories array when query succeeds

**Related US:** US-206
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-133: getStoriesForEntry returns empty array when no stories found

**Related US:** US-206
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-134: getStoriesForEntry throws when Supabase returns error

**Related US:** US-206
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-135: getAllStories returns all stories ordered by created_at

**Related US:** US-206
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-136: addElaboration appends elaboration text to existing story content

**Related US:** US-206
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-137: addElaboration throws when Supabase fetch returns error

**Related US:** US-206
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-138: STORY_EXTRACTION_SYSTEM_PROMPT instructs AI to return JSON array

**Related US:** US-206
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-139: STORY_EXTRACTION_SYSTEM_PROMPT includes language instruction

**Related US:** US-206
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

## 3.11 FEATURE: Emotion Intelligence per Story (US-207)

### TC-140: detectEmotionConfidence returns emotion and confidence when API responds with valid JSON

**Related US:** US-207
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return `{ emotion: 'calm', confidence: 0.92 }`

**Test Steps:**
1. Call `detectEmotionConfidence('story content', 'sk-test')`

**Expected Result:**
- Returns `{ emotion: 'calm', confidence: 0.92 }`

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-141: detectEmotionConfidence returns fallback {emotion:mixed, confidence:0} when API returns non-ok response

**Related US:** US-207
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return `{ ok: false, status: 401 }`

**Test Steps:**
1. Call `detectEmotionConfidence('story content', 'sk-invalid')`

**Expected Result:**
- Returns `{ emotion: 'mixed', confidence: 0 }` — never throws

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-142: detectEmotionConfidence returns fallback when response JSON is malformed

**Related US:** US-207
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return `content: 'not valid json'`

**Test Steps:**
1. Call `detectEmotionConfidence('story content', 'sk-test')`

**Expected Result:**
- Returns `{ emotion: 'mixed', confidence: 0 }`

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-143: detectEmotionConfidence returns fallback when fetch throws a network error

**Related US:** US-207
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to reject with Error('Network error')

**Test Steps:**
1. Call `detectEmotionConfidence('story content', 'sk-test')`

**Expected Result:**
- Returns `{ emotion: 'mixed', confidence: 0 }` — never throws

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-144: getEmotionColor returns amber color for joy

**Related US:** US-207
**Type:** Unit
**Priority:** Critical

**Test Steps:**
1. Call `getEmotionColor('joy')`

**Expected Result:**
- Returns `'#F59E0B'`

**File:** `src/__tests__/utils/emotionColors.test.ts`
**Status:** ✅ Done

---

### TC-145: getEmotionColor returns blue color for sadness

**Related US:** US-207
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/utils/emotionColors.test.ts`
**Status:** ✅ Done

---

### TC-146: getEmotionColor returns red color for anger

**Related US:** US-207
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/utils/emotionColors.test.ts`
**Status:** ✅ Done

---

### TC-147: getEmotionColor returns purple color for fear

**Related US:** US-207
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/utils/emotionColors.test.ts`
**Status:** ✅ Done

---

### TC-148: getEmotionColor returns teal color for calm

**Related US:** US-207
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/utils/emotionColors.test.ts`
**Status:** ✅ Done

---

### TC-149: getEmotionColor returns default stone color when emotion is null

**Related US:** US-207
**Type:** Unit
**Priority:** Critical

**Test Steps:**
1. Call `getEmotionColor(null)`

**Expected Result:**
- Returns `'#78716C'`

**File:** `src/__tests__/utils/emotionColors.test.ts`
**Status:** ✅ Done

---

### TC-150: getEmotionColor returns default stone color when emotion is undefined

**Related US:** US-207
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/utils/emotionColors.test.ts`
**Status:** ✅ Done

---

### TC-151: getEmotionColor returns default stone color for unknown emotion string

**Related US:** US-207
**Type:** Unit
**Priority:** High

**Test Steps:**
1. Call `getEmotionColor('mixed')` (not in map)

**Expected Result:**
- Returns `'#78716C'`

**File:** `src/__tests__/utils/emotionColors.test.ts`
**Status:** ✅ Done

---

### TC-152: updateStoryEmotion calls Supabase update with correct emotion and confidence

**Related US:** US-207
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- Supabase mock returns `{ error: null }`

**Test Steps:**
1. Call `updateStoryEmotion('story-uuid-1', 'joy', 0.88)`

**Expected Result:**
- `supabase.from('stories').update({ emotion: 'joy', emotion_confidence: 0.88 })` called

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-153: updateStoryEmotion throws when Supabase update returns error

**Related US:** US-207
**Type:** Unit
**Priority:** High

**Preconditions:**
- Supabase mock returns `{ error: { message: 'Update failed' } }`

**Test Steps:**
1. Call `updateStoryEmotion('story-uuid-1', 'fear', 0.75)`

**Expected Result:**
- Throws error with message `'Update failed'`

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-154: EMOTION_DETECTION_SYSTEM_PROMPT instructs AI to return JSON object

**Related US:** US-207
**Type:** Unit
**Priority:** Critical

**Test Steps:**
1. Check prompt contains `'JSON object'`

**Expected Result:**
- Prompt contains `JSON object`

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-155: EMOTION_DETECTION_SYSTEM_PROMPT includes all six emotion categories

**Related US:** US-207
**Type:** Unit
**Priority:** Critical

**Test Steps:**
1. Check prompt contains each of: `"joy"`, `"sadness"`, `"anger"`, `"fear"`, `"calm"`, `"mixed"`

**Expected Result:**
- All six emotion labels present in prompt

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-156: EMOTION_DETECTION_SYSTEM_PROMPT includes confidence field in example format

**Related US:** US-207
**Type:** Unit
**Priority:** High

**Test Steps:**
1. Check prompt contains `'"confidence"'`

**Expected Result:**
- Prompt contains `"confidence"` in JSON format example

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

## 3.12 FEATURE: Depth-Driven Adaptive Insights (US-205)

### TC-168: generateHolisticInsight returns insight string when API responds successfully

**Related US:** US-205
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return non-empty content string

**Test Steps:**
1. Call `generateHolisticInsight([entryWithFollowUps], 'sk-test')`

**Expected Result:**
- Returns the insight string

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-169: generateHolisticInsight throws when OpenAI returns non-ok response

**Related US:** US-205
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-170: generateHolisticInsight returns empty string when response content is missing

**Related US:** US-205
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-171: elaborateInsight returns elaboration string when API responds successfully

**Related US:** US-205
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return elaboration text

**Test Steps:**
1. Call `elaborateInsight('some insight', [entry], 'sk-test')`

**Expected Result:**
- Returns non-empty elaboration string

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-172: elaborateInsight throws when OpenAI returns non-ok response

**Related US:** US-205
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-173: elaborateInsight returns empty string when response content is missing

**Related US:** US-205
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-174: getEntriesWithFollowUps returns entries with followups when query succeeds

**Related US:** US-205
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- Supabase mock returns entry with followups array

**Test Steps:**
1. Call `getEntriesWithFollowUps()`

**Expected Result:**
- Returns array with entries containing `followups` field

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

### TC-175: getEntriesWithFollowUps returns empty array when no entries found

**Related US:** US-205
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

### TC-176: getEntriesWithFollowUps throws when Supabase returns error

**Related US:** US-205
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/services/entryService.test.ts`
**Status:** ✅ Done

---

### TC-177: HOLISTIC_INSIGHT_SYSTEM_PROMPT uses observational language

**Related US:** US-205
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-178: HOLISTIC_INSIGHT_SYSTEM_PROMPT forbids identity labels

**Related US:** US-205
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-179: HOLISTIC_INSIGHT_SYSTEM_PROMPT forbids advice and imperatives

**Related US:** US-205
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-180: HOLISTIC_INSIGHT_SYSTEM_PROMPT includes language instruction

**Related US:** US-205
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-181: HOLISTIC_INSIGHT_SYSTEM_PROMPT limits to one or two sentences

**Related US:** US-205
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-182: INSIGHT_ELABORATION_SYSTEM_PROMPT limits response to 2-4 sentences

**Related US:** US-205
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-183: INSIGHT_ELABORATION_SYSTEM_PROMPT requires observational language only

**Related US:** US-205
**Type:** Unit
**Priority:** Critical

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-184: INSIGHT_ELABORATION_SYSTEM_PROMPT includes language instruction

**Related US:** US-205
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-185: INSIGHT_ELABORATION_SYSTEM_PROMPT forbids identity claims and advice

**Related US:** US-205
**Type:** Unit
**Priority:** High

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-186: FollowUpDialog shows Zmień pytanie button when rerolls remain

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Preconditions:**
- FollowUpDialog rendered with initial questions

**Expected Result:**
- "Zmień pytanie" button visible on first render

**File:** `src/__tests__/components/FollowUpDialog/FollowUpDialog.test.tsx`
**Status:** ✅ Done

---

### TC-187: FollowUpDialog replaces current question when Zmień pytanie is clicked

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Preconditions:**
- `onRequestMore` returns a replacement question

**Test Steps:**
1. Click "Zmień pytanie"
2. Wait for request to complete

**Expected Result:**
- New question text replaces the original
- `onRequestMore` was called

**File:** `src/__tests__/components/FollowUpDialog/FollowUpDialog.test.tsx`
**Status:** ✅ Done

---

### TC-188: FollowUpDialog hides Zmień pytanie button after 2 rerolls

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Test Steps:**
1. Click "Zmień pytanie" twice

**Expected Result:**
- "Zmień pytanie" button is no longer in DOM

**File:** `src/__tests__/components/FollowUpDialog/FollowUpDialog.test.tsx`
**Status:** ✅ Done

---

## 3.13 FEATURE: Contextual Follow-Up Questions Between Lines (US-210)

### TC-157: NewEntryPage shows "Pięknie." when entry word count exceeds 300

**Related US:** US-210
**Type:** Component
**Priority:** Critical

**Preconditions:**
- API key set
- `createEntry` mocked to resolve
- Entry content has 301 words

**Test Steps:**
1. Render NewEntryPage
2. Set textarea value to 301-word string via `fireEvent.change`
3. Click Save

**Expected Result:**
- "Pięknie." text visible in DOM
- `generateFollowUpQuestions` not called

**File:** `src/__tests__/pages/NewEntryPage.test.tsx`
**Status:** ✅ Done

---

### TC-158: NewEntryPage navigates home when "Wróć" button clicked on Pięknie screen

**Related US:** US-210
**Type:** Component
**Priority:** Critical

**Preconditions:**
- Entry >300 words saved — "Pięknie." screen shown

**Test Steps:**
1. Trigger "Pięknie." screen
2. Click "Wróć →" button

**Expected Result:**
- `navigate('/')` called

**File:** `src/__tests__/pages/NewEntryPage.test.tsx`
**Status:** ✅ Done

---

### TC-159: NewEntryPage calls generateFollowUpQuestions with story context when recent stories exist

**Related US:** US-210
**Type:** Integration
**Priority:** Critical

**Preconditions:**
- API key set
- `createEntry` resolves
- `getRecentStories` returns one story
- `generateFollowUpQuestions` resolves with questions

**Test Steps:**
1. Render NewEntryPage
2. Type short entry (<300 words)
3. Click Save

**Expected Result:**
- `generateFollowUpQuestions` called with `(content, apiKey, storyContent)`

**File:** `src/__tests__/pages/NewEntryPage.test.tsx`
**Status:** ✅ Done

---

### TC-160: generateFollowUpQuestions includes story context in user message when storyContext provided

**Related US:** US-210
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return valid response

**Test Steps:**
1. Call `generateFollowUpQuestions('My entry today', 'sk-test', 'Past story about work')`
2. Inspect fetch body `messages[1].content`

**Expected Result:**
- User message contains entry content, story context, and `[Context from past entries]` label

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-161: generateFollowUpQuestions sends only entry content when storyContext not provided

**Related US:** US-210
**Type:** Unit
**Priority:** High

**Preconditions:**
- `fetch` stubbed to return valid response

**Test Steps:**
1. Call `generateFollowUpQuestions('My entry today', 'sk-test')` — no storyContext
2. Inspect fetch body `messages[1].content`

**Expected Result:**
- User message equals entry content exactly (no context label appended)

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-162: getRecentStories returns stories from recent entries excluding given entry id

**Related US:** US-210
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- Supabase mock returns one story with different entry_id

**Test Steps:**
1. Call `getRecentStories('entry-uuid-1', 3)`

**Expected Result:**
- Result contains no stories with `entry_id === 'entry-uuid-1'`

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-163: getRecentStories returns empty array when no recent stories exist

**Related US:** US-210
**Type:** Unit
**Priority:** High

**Preconditions:**
- Supabase mock returns `{ data: null, error: null }`

**Test Steps:**
1. Call `getRecentStories('entry-uuid-1', 3)`

**Expected Result:**
- Returns `[]`

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-164: getRecentStories throws when Supabase returns error

**Related US:** US-210
**Type:** Unit
**Priority:** High

**Preconditions:**
- Supabase mock returns `{ error: { message: 'Fetch failed' } }`

**Test Steps:**
1. Call `getRecentStories('entry-uuid-1', 3)`

**Expected Result:**
- Promise rejects with `'Fetch failed'`

**File:** `src/__tests__/services/storyService.test.ts`
**Status:** ✅ Done

---

### TC-165: FOLLOW_UP_SYSTEM_PROMPT instructs AI to focus between the lines

**Related US:** US-210
**Type:** Unit
**Priority:** Critical

**Test Steps:**
1. Check prompt contains `'BETWEEN THE LINES'`

**Expected Result:**
- Prompt contains the between-the-lines instruction

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-166: FOLLOW_UP_SYSTEM_PROMPT forbids AI from restating what is already written

**Related US:** US-210
**Type:** Unit
**Priority:** Critical

**Test Steps:**
1. Check prompt contains `'NEVER restate'`

**Expected Result:**
- Prompt explicitly forbids restating entry content

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

### TC-167: FOLLOW_UP_SYSTEM_PROMPT instructs AI to respond in entry language

**Related US:** US-210
**Type:** Unit
**Priority:** High

**Test Steps:**
1. Check prompt contains `'Respond in the same language as the user'`

**Expected Result:**
- Prompt includes language instruction

**File:** `src/__tests__/utils/prompts.test.ts`
**Status:** ✅ Done

---

## 4. Test Data

### 4.1 Mock Data Sets

```typescript
export const mockEntry = {
  id: 'uuid-1',
  content: 'Had a tough day at work.',
  emotions: ['frustrated'],
  tags: ['work'],
  created_at: '2026-04-09T20:00:00Z',
  updated_at: '2026-04-09T20:00:00Z',
}

export const mockFollowUp = {
  id: 'uuid-fu-1',
  entry_id: 'uuid-1',
  question: 'How did you feel when that happened?',
  answer: 'I felt unheard.',
  order_index: 0,
  created_at: '2026-04-09T20:01:00Z',
}

export const mockAIQuestions = [
  'How did you feel when that happened?',
  'What do you think about this situation?',
]
```

### 4.2 Edge Case Data

| Scenario | Data | Expected Behavior |
|----------|------|-------------------|
| Very long entry | 5000 char string | Saved correctly, truncated in list view |
| Empty content | `""` | Save button disabled |
| API key invalid | `sk-invalid` | Error shown, entry saves without AI |
| Network failure | Supabase timeout | Error message, content preserved |

---

## 5. Test Execution

### 5.1 Running Tests

```powershell
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### 5.2 CI/CD Integration

Tests run automatically on:
- [x] Every push to any branch
- [x] Pull request to main

---

## 6. Manual Test Checklist

For verification after /dev implementation.

> **Test Corpus:** Use predefined entries from `docs/test_corpus.md` for all AI feature verification. Do NOT type random text — AI outputs become unverifiable. Copy entry text exactly as written.

---

### Entry Creation Flow
- [ ] Can type and submit an entry
- [ ] Follow-up dialog appears (with API key set)
- [ ] Can answer questions
- [ ] Can skip questions
- [ ] Entry appears in list after saving
- [ ] Entry detail shows Q&A

### Settings
- [ ] Can enter API key
- [ ] Key shows masked after saving
- [ ] Can clear API key
- [ ] Warning shown when no key

### Edge Cases
- [ ] Submit empty entry — Save disabled
- [ ] Submit with no API key — saves without AI, shows info message
- [ ] Network offline — error shown, content not lost

---

### US-101: Connection Detection — Manual Verification

> Uses Scenario A from `docs/test_corpus.md`

1. Ensure API key is set in Settings
2. Write entry **A1** (copy exact text from corpus) — save it
3. Write entry **A2** (copy exact text from corpus) — save it
4. **Check:** A connection badge appears on A2 pointing to A1 — PASS
5. Write entry **A3** (copy exact text from corpus) — save it
6. **Check:** A connection badge appears on A3 pointing to A1 or A2 — PASS
7. **Pass criteria:** At least 2 of 3 pairs (A1↔A2, A1↔A3, A2↔A3) received a connection badge

> Negative test — uses Scenario B from corpus:
8. Write entry **B1**, save it
9. Write entry **B2**, save it
10. **Check:** No connection badge appears on B2 — PASS if no badge shown

---

### US-102: Pattern Summary — Manual Verification

> Uses Scenario D from `docs/test_corpus.md` (requires 10 entries: C1–C5 + D1–D5)

1. Ensure API key is set in Settings
2. Write and save entries **C1, C2, C3, C4, C5** (copy exact text from corpus)
3. Write and save entries **D1, D2, D3, D4, D5** (copy exact text from corpus)
4. Return to Home — "Generate insights" button should now be visible (10+ entries)
5. Click "Generate insights"
6. **Check:** 3–5 bullet observations appear — PASS
7. **Evaluate semantically:** Observations should cover at least 2 of these themes:
   - Avoidance / procrastination pattern
   - Relationships as energy source
   - Self-discipline struggles
   - Professional growth motivation
8. **Pass criteria:** AI returns 3–5 observations, at least 2 themes recognizably covered

---

### US-202: Values Extraction & Aligned Stars — Manual Verification

> Uses Scenario C from `docs/test_corpus.md`

**Values extraction:**
1. Ensure API key is set in Settings
2. Clear localStorage (or use a fresh browser profile) to start without prior values
3. Write and save entries **C1, C2, C3, C4, C5** (copy exact text from corpus)
4. **Check:** ValuesModal appears after saving the 5th entry — PASS
5. **Evaluate semantically:** Proposed themes should cover at least 3 of:
   - relacje z bliskimi / relationships
   - rozwój osobisty / personal growth
   - pomaganie innym / helping others
   - zdrowie i energia / health and energy
   - rodzina / family
6. Click "Zatwierdź" to confirm values

**Aligned star positioning:**
7. Enter 3D mode (click Dotflow logo)
8. **Check:** Stars for C1–C5 entries appear closer to the black hole center than randomly-written entries — PASS if visible clustering near center
9. Hover over the black hole
10. **Check:** Tooltip shows insight text or fallback "Keep writing — your center is forming." — PASS

---

### US-203: Dialectical Insight Response — Manual Verification

> Requires 10 entries with generated insight (C1–C5 + D1–D5 from corpus, then "Generate insights" clicked)

1. Ensure API key is set in Settings and you have 10+ entries with a generated pattern summary
2. Click Dotflow logo — enter 3D mode
3. Hover over the black hole — tooltip with insight appears
4. **Check:** "To nie brzmi jak ja" button visible below insight — PASS
5. Click the button — **Check:** input field appears with placeholder "Co sprawia, że ten wgląd nie pasuje?" — PASS
6. Type any text and submit (round 1)
7. **Check:** AI responds with one short question (≤15 words, neutral tone) — insight text unchanged — PASS
8. Type another response and submit (round 2)
9. **Check:** AI responds with a closing phrase that echoes your own words — PASS
10. **Check:** Amber "Write Entry" button appears at bottom of screen — PASS
11. **Check:** No message anywhere about hitting a round limit — PASS
12. **Check:** Insight on black hole still shows original text — PASS

**Pass criteria:** All 12 steps pass. Tooltip UX (hover reliability, sizing) tracked separately as open UX issues for /consult.

---

## 3.14 FEATURE: InsightModal — Button Flow & Persistence (US-205 extended)

### TC-189: should show Jest OK and Rozwin buttons in initial state when not acknowledged

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Preconditions:**
- InsightModal rendered with `holisticInsight` set and no localStorage entries

**Expected Result:**
- "Jest OK" and "Rozwiń" buttons visible

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-190: should not show To ma sens button in initial state before elaboration

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Expected Result:**
- "To ma sens" not in DOM on initial render

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-191: should call onAcknowledge and onClose when Jest OK clicked

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Test Steps:**
1. Click "Jest OK"

**Expected Result:**
- `onAcknowledge` and `onClose` each called once

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-192: should show To ma sens and hide Jest OK and Rozwin after elaboration loads

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Preconditions:**
- `elaborateInsight` mocked to resolve with ELAB_TEXT

**Test Steps:**
1. Click "Rozwiń"
2. Wait for ELAB_TEXT to appear

**Expected Result:**
- "To ma sens" visible
- "Jest OK" and "Rozwiń" not in DOM

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-193: should show textarea after Rozwin clicked and elaboration loaded

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Expected Result:**
- Textarea with placeholder "Twoje dopowiedzenie..." visible

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-194: should show only Rozwin when insight is acknowledged — no Jest OK

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Preconditions:**
- `dotflow_acknowledged_insight` set in localStorage to match insight key

**Expected Result:**
- "Rozwiń" visible
- "Jest OK" and "To ma sens" not in DOM

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-195: should show cached elaboration without textarea when acknowledged

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Preconditions:**
- Both `dotflow_acknowledged_insight` and `dotflow_elaborated_insight` set in localStorage

**Expected Result:**
- ELAB_TEXT visible
- Textarea not in DOM
- "Rozwiń" not in DOM

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-196: should restore cached elaboration on mount without requiring Rozwin click

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Preconditions:**
- `dotflow_elaborated_insight` set in localStorage (no acknowledged flag)

**Expected Result:**
- ELAB_TEXT visible on mount
- "Rozwiń" not in DOM

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-197: should have Zapisz button disabled when note textarea is empty

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Test Steps:**
1. Click "Rozwiń", wait for elaboration
2. Check "Zapisz →" button state

**Expected Result:**
- "Zapisz →" is disabled

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-198: should enable Zapisz button when note text is typed

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Test Steps:**
1. Click "Rozwiń", wait for textarea
2. Type text into textarea
3. Check "Zapisz →" state

**Expected Result:**
- "Zapisz →" is enabled

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-199: should save note to dotflow_insight_note in localStorage when Zapisz clicked

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Test Steps:**
1. Elaborate, type note, click "Zapisz →"
2. Read `dotflow_insight_note` from localStorage

**Expected Result:**
- Stored object has `note: 'Moja notatka'` and `key: INSIGHT_TEXT`

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-200: should show confirmation message after note is saved

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Test Steps:**
1. Elaborate, type note, click "Zapisz →"

**Expected Result:**
- "Dobrze. Twoja refleksja zostanie uwzględniona w kolejnym odkryciu." visible

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-201: should call onAcknowledge and onClose after delay when note is saved

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Test Steps:**
1. Elaborate, type note, click "Zapisz →"
2. Advance timers by 1800ms

**Expected Result:**
- `onAcknowledge` and `onClose` each called once

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-202: should call onAcknowledge and onClose when To ma sens clicked after elaboration

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Test Steps:**
1. Click "Rozwiń", wait for "To ma sens"
2. Click "To ma sens"

**Expected Result:**
- `onAcknowledge` and `onClose` each called once

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-203: should show saved note and confirmation on mount when note was previously saved

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Preconditions:**
- `dotflow_acknowledged_insight`, `dotflow_elaborated_insight`, and `dotflow_insight_note` all set in localStorage

**Expected Result:**
- Saved note text visible
- Confirmation message visible
- Textarea not in DOM

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-204: should show holistic insight text in the modal

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Expected Result:**
- `holisticInsight` prop text visible

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-205: should show pattern observations when no holistic insight but insight array provided

**Related US:** US-205
**Type:** Component
**Priority:** High

**Preconditions:**
- `holisticInsight=null`, `insight=['Wzorzec A', 'Wzorzec B']`

**Expected Result:**
- "Wzorzec A" and "Wzorzec B" visible

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-206: should show fallback text when no insight content available

**Related US:** US-205
**Type:** Component
**Priority:** High

**Preconditions:**
- `holisticInsight=null`, `insight=null`, `storyContextMessage=null`

**Expected Result:**
- "Pisz dalej — Twoje centrum się kształtuje." visible

**File:** `src/__tests__/components/StarField/InsightModal.test.tsx`
**Status:** ✅ Done

---

### TC-207: generateHolisticInsight includes previousNote in fetch body when provided

**Related US:** US-205
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- `fetch` stubbed to return valid insight content

**Test Steps:**
1. Call `generateHolisticInsight([entry], 'sk-test', 'User note text')`
2. Inspect fetch body `messages[1].content`

**Expected Result:**
- User message contains `"User's reflection on the previous insight: \"User note text\""`

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

### TC-208: generateHolisticInsight does not include reflection text when previousNote not provided

**Related US:** US-205
**Type:** Unit
**Priority:** High

**Test Steps:**
1. Call `generateHolisticInsight([entry], 'sk-test')` — no previousNote
2. Inspect fetch body `messages[1].content`

**Expected Result:**
- User message does NOT contain `"User's reflection"`

**File:** `src/__tests__/services/aiService.test.ts`
**Status:** ✅ Done

---

## 3.15 FEATURE: SkyModal Component (shared)

### TC-209: should render children inside the modal

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Expected Result:**
- Children content visible in DOM

**File:** `src/__tests__/components/StarField/SkyModal.test.tsx`
**Status:** ✅ Done

---

### TC-210: should call onClose when the X button is clicked

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Test Steps:**
1. Click button with `aria-label="Zamknij"`

**Expected Result:**
- `onClose` called once

**File:** `src/__tests__/components/StarField/SkyModal.test.tsx`
**Status:** ✅ Done

---

### TC-211: should call onClose when the backdrop is clicked

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Test Steps:**
1. Click the backdrop (container's first child)

**Expected Result:**
- `onClose` called once

**File:** `src/__tests__/components/StarField/SkyModal.test.tsx`
**Status:** ✅ Done

---

### TC-212: should not call onClose when clicking inside the modal content

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Test Steps:**
1. Click text inside the modal

**Expected Result:**
- `onClose` NOT called

**File:** `src/__tests__/components/StarField/SkyModal.test.tsx`
**Status:** ✅ Done

---

### TC-213: should call onClose when Escape key is pressed

**Related US:** US-205
**Type:** Component
**Priority:** Critical

**Test Steps:**
1. Fire `keyDown` event with `key: 'Escape'` on document

**Expected Result:**
- `onClose` called once

**File:** `src/__tests__/components/StarField/SkyModal.test.tsx`
**Status:** ✅ Done

---

### TC-214: should render footer when provided

**Related US:** US-205
**Type:** Component
**Priority:** High

**Preconditions:**
- `footer` prop passed as a button element

**Expected Result:**
- Footer button text visible

**File:** `src/__tests__/components/StarField/SkyModal.test.tsx`
**Status:** ✅ Done

---

### TC-215: should not render footer section when footer prop is not provided

**Related US:** US-205
**Type:** Component
**Priority:** High

**Expected Result:**
- No footer content in DOM

**File:** `src/__tests__/components/StarField/SkyModal.test.tsx`
**Status:** ✅ Done

---

*This document is owned by /qa agent and updated after each test session.*

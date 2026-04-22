# Dotflow - Test Cases Documentation

**Version:** 1.1
**Date:** 2026-04-23
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

## 3.1 FEATURE: Settings — API Key Management

### TC-001: User can save API key

**Related US:** US-003
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

**Status:** 📋 Planned

---

### TC-002: App shows warning when API key missing

**Related US:** US-003
**Type:** Component
**Priority:** Critical

**Preconditions:**
- localStorage has no API key

**Test Steps:**
1. Render HomePage with no API key set
2. Observe banner area

**Expected Result:**
- Warning banner visible: "Add your API key in Settings"

**Status:** 📋 Planned

---

## 3.2 FEATURE: Entry Creation

### TC-003: User can submit a new entry

**Related US:** US-005
**Type:** Component
**Priority:** Critical

**Preconditions:**
- New Entry page rendered
- Supabase createEntry mocked to return success

**Test Steps:**
1. Render NewEntryPage
2. Type content into textarea
3. Click Save

**Expected Result:**
- createEntry called with typed content
- Loading state visible during save

**Status:** 📋 Planned

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

**Status:** 📋 Planned

---

### TC-005: Entry appears in list after saving

**Related US:** US-005, US-007
**Type:** Integration
**Priority:** Critical

**Preconditions:**
- Supabase getEntries mocked to return one entry

**Test Steps:**
1. Render HomePage
2. Wait for entries to load

**Expected Result:**
- Entry card visible with correct content
- Date formatted correctly

**Status:** 📋 Planned

---

## 3.3 FEATURE: AI Follow-Up Questions

### TC-006: Follow-up dialog appears after entry submission

**Related US:** US-006
**Type:** Integration
**Priority:** Critical

**Preconditions:**
- API key set in localStorage
- OpenAI API mocked to return 2 questions

**Test Steps:**
1. Render NewEntryPage
2. Type content
3. Click Save

**Expected Result:**
- FollowUpDialog visible
- First question displayed

**Status:** 📋 Planned

---

### TC-007: User can skip a follow-up question

**Related US:** US-006
**Type:** Component
**Priority:** High

**Preconditions:**
- FollowUpDialog rendered with 2 questions

**Test Steps:**
1. Click "Skip this question"

**Expected Result:**
- Next question shown
- No answer recorded for skipped question

**Status:** 📋 Planned

---

### TC-008: Entry saves without AI when API key is missing

**Related US:** US-006
**Type:** Component
**Priority:** High

**Preconditions:**
- No API key in localStorage

**Test Steps:**
1. Submit entry

**Expected Result:**
- Entry saved directly (no follow-up dialog)
- Info message shown: "Add API key in Settings to enable AI questions"

**Status:** 📋 Planned

---

### TC-009: AI service generates questions from entry content

**Related US:** US-006
**Type:** Unit
**Priority:** Critical

**Preconditions:**
- OpenAI API mocked

**Test Steps:**
1. Call `aiService.generateFollowUpQuestions('Had a tough meeting today')`

**Expected Result:**
- Returns array of 2–3 strings
- Each string is a question (non-empty)

**Status:** 📋 Planned

---

## 3.4 FEATURE: Entry List View

### TC-010: Empty state shown when no entries

**Related US:** US-007
**Type:** Component
**Priority:** High

**Preconditions:**
- Supabase getEntries mocked to return empty array

**Test Steps:**
1. Render HomePage

**Expected Result:**
- Empty state visible with CTA to write first entry
- No entry cards visible

**Status:** 📋 Planned

---

### TC-011: Entries sorted newest first

**Related US:** US-007
**Type:** Component
**Priority:** Medium

**Preconditions:**
- Supabase mocked to return 2 entries with different dates

**Test Steps:**
1. Render HomePage
2. Check order of entry cards

**Expected Result:**
- Newest entry appears first

**Status:** 📋 Planned

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

For verification after /dev implementation:

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

*This document is owned by /qa agent and updated after each test session.*

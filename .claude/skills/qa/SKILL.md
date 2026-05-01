---
name: qa
description: Generate and optimize tests following best practices. Use after manual verification is complete. Runs after implementation.
---

# QA Agent — Dotflow

Test specialist for Dotflow. Focus on user-facing functionality.
Tech stack: Vitest + React Testing Library.

## On activation

1. **Execute without asking:**
```powershell
git status
git diff
```

2. Read:
- @src/__tests__/
- @src/
- @package.json
- @docs/test_cases.md
- @.claude/current_task.md

3. Ask:
"Czy manualna weryfikacja została zakończona?
1. Tak
2. Nie — wróć po weryfikacji"

4. If yes — immediately start writing tests. No other questions.

## Testing Best Practices

### F.I.R.S.T. Principles
- **Fast:** Testy działają w milisekundach
- **Independent:** Testy nie zależą od siebie
- **Repeatable:** Ten sam wynik zawsze
- **Self-validating:** Jasny pass/fail
- **Timely:** Pisane zaraz po implementacji

### AAA Pattern
```typescript
it('should [expected behavior] when [condition]', () => {
  // Arrange
  const mockEntry = { ... }
  // Act
  const result = await entryService.createEntry('content')
  // Assert
  expect(result).toEqual(mockEntry)
})
```

### Test Cleanup
```typescript
beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})
afterEach(() => {
  vi.restoreAllMocks()
})
```

## What to Test (User-Facing Only)

**DO test:**
- User interactions (form submission, button clicks)
- Visible UI state changes
- User-facing error messages
- Service function outcomes visible to user

**DO NOT test:**
- Internal state variables
- React internals
- Supabase/OpenAI SDK internals
- CSS class names

## Mock Patterns for Dotflow

### Mocking Supabase
```typescript
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ data: mockEntry, error: null }),
      select: vi.fn().mockResolvedValue({ data: [mockEntry], error: null }),
    })),
  })),
}))
```

### Mocking localStorage
```typescript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)
```

## Workflow

1. Confirm manual verification (1/2)
2. Write tests immediately — no other questions
3. Run lint + tests
4. Update docs/test_cases.md
5. Commit automatically without asking:
```powershell
git add src/__tests__/[test files]
git add docs/test_cases.md
git commit -m "test([scope]): add tests for US-XXX [short description]"
```
6. After commit → automatically invoke `flow` skill. Do NOT ask.

## UX — format pytań

Tylko:
```
1. Tak
2. Nie
```

## Agent Autonomy

**Execute without asking:**
- git status, git diff
- npm run lint, npm test
- Reading project files
- Writing test files
- Committing test files after they pass

**Always ask before:**
- Modifying production code

## Constraints
- Never modify production code
- Test only user-facing behavior
- Follow F.I.R.S.T. and AAA in every test
- Commit automatically after tests pass
- After commit — always invoke `docs` skill automatically, never say "Uruchom /docs"

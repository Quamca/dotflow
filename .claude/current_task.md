# Current Task — US-102: AI pattern summary generation

**Branch:** 102-pattern-summary
**Created:** 2026-04-25
**Status:** 🔄 In Progress

## Context
When the user has 10+ entries, a "Generate insights" button appears on the Home screen. Clicking it sends the 10 most recent entries to OpenAI and returns 3–5 bullet-point observations about recurring patterns. Results are displayed inline on the Home screen, not persisted to Supabase.

## Files to Read First
- `src/services/aiService.ts` — existing OpenAI call pattern (extend with generatePatternSummary)
- `src/utils/prompts.ts` — existing prompts (add PATTERN_SUMMARY_SYSTEM_PROMPT)
- `src/pages/HomePage.tsx` — where button and results will live
- `src/types/index.ts` — check existing types
- `docs/architecture.md` — data model and component structure

## Tasks
1. [ ] TASK-102.1: Add `PATTERN_SUMMARY_SYSTEM_PROMPT` to `src/utils/prompts.ts` — AI responds with JSON array of 3–5 string observations about recurring patterns, emotions, or themes
2. [ ] TASK-102.2: Implement `aiService.generatePatternSummary(entries: Entry[], apiKey: string): Promise<string[]>` in `src/services/aiService.ts` — calls OpenAI, parses JSON array response, throws on non-ok HTTP, returns `[]` on malformed JSON
3. [ ] TASK-102.3: Create `src/components/PatternSummary/PatternSummary.tsx` — renders list of bullet observations; accepts `observations: string[]` prop
4. [ ] TASK-102.4: Update `src/pages/HomePage.tsx` — add "Generate insights" button (visible only when `entries.length >= 10`), loading state, observations state, error state, render PatternSummary when observations present
5. [ ] TASK-102.5: Write tests (/qa — after manual verification)
6. [ ] TASK-102.6: Manual verification

## Constraints
- Button only visible when `entries.length >= 10`
- No API key → show info message "Set your API key in Settings to use this feature." (do not disable button or throw)
- On AI error → show "Failed to generate insights. Please try again."
- Cap response at 5 observations; if AI returns more, slice to 5
- Results NOT persisted to Supabase
- All OpenAI calls go through `src/services/aiService.ts`
- No `any` type
- Keep each file under 300 lines

## Acceptance Criteria
- [ ] "Generate insights" button appears only when user has ≥10 entries
- [ ] Clicking button calls OpenAI with 10 most recent entries
- [ ] Results display as 3–5 bullet-point observations on Home screen
- [ ] Loading state shown while waiting for AI response
- [ ] Error message shown if AI call fails
- [ ] No API key → appropriate info message
- [ ] Results disappear on next page load (not persisted)

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps (po polsku):
  1. Uruchom `npm run dev`, otwórz http://localhost:5173
  2. Upewnij się że masz ustawiony klucz API w Settings
  3. Sprawdź że masz 10+ wpisów — przycisk "Generate insights" powinien być widoczny
  4. Kliknij przycisk — sprawdź czy pojawia się stan ładowania
  5. Poczekaj na odpowiedź AI — sprawdź czy wyświetla się 3–5 punktów z obserwacjami
  6. Odśwież stronę — sprawdź że wyniki znikają (nie są zapisane)
  7. Usuń klucz API w Settings, kliknij przycisk — sprawdź że pojawia się info o braku klucza
  8. Sprawdź z kontem bez 10 wpisów — przycisk nie powinien być widoczny
- [ ] Potwierdź weryfikację wpisując 1

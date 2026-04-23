# Current Task — US-005: New entry form and save to Supabase

**Branch:** 5-new-entry-form
**Created:** 2026-04-23
**Status:** 🔄 In Progress

## Context
Implement the New Entry screen — a clean textarea where the user writes a journal entry and saves it to Supabase. `entryService.createEntry()` is already fully implemented from US-002. This US adds the UI page, routing, loading/error states, and the Write button on HomePage.

## Files to Read First
- `src/pages/HomePage.tsx` — add "+ Write" button here
- `src/App.tsx` — add `/new` route here
- `src/services/entryService.ts` — createEntry() already implemented
- `src/types/index.ts` — Entry type
- `docs/wireframes.md` — S-002 spec (New Entry screen)

## Tasks
1. [ ] TASK-005.2: Create `src/pages/NewEntryPage.tsx` with textarea and Save button
2. [ ] TASK-005.3: Add disabled state logic (Save disabled when textarea is empty)
3. [ ] TASK-005.4: Add loading state (spinner on Save) and error state (error message, content preserved)
4. [ ] TASK-005.5: Add `/new` route to App.tsx + "+ Write" button on HomePage
5. [ ] TASK-005.6: Write tests (/qa — after manual verification)
6. [ ] TASK-005.7: Manual verification

Note: TASK-005.1 (entryService.createEntry) is already complete from US-002 — do not reimplement.

## Constraints
- Never call Supabase directly from components — use `entryService.createEntry()`
- Use `useNavigate()` from react-router-dom for redirect after save (not window.location)
- Preserve textarea content on save failure — do NOT clear on error
- Save button disabled when `content.trim() === ''`
- No character limit on textarea
- Design system: Ink `#1C1917`, Cream `#FAFAF9`, Stone `#E7E5E4`, Warm Stone `#78716C`, Amber `#D97706`

## Acceptance Criteria
- [ ] New Entry screen accessible from Home via "+ Write" button
- [ ] Free-form textarea, no character limit
- [ ] Save button disabled when textarea is empty
- [ ] Loading state shown while saving (spinner on button)
- [ ] Entry saved to Supabase `entries` table
- [ ] After save, user redirected to Home
- [ ] Error state shown if save fails (content preserved)

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps (po polsku):
  1. Uruchom `npm run dev`, otwórz http://localhost:5173
  2. Sprawdź czy na Home widoczny jest przycisk "+ Write"
  3. Kliknij "+ Write" — sprawdź czy przechodzi na /new
  4. Sprawdź czy przycisk Save jest nieaktywny (szary) gdy textarea pusta
  5. Wpisz tekst — sprawdź czy Save staje się aktywny
  6. Kliknij Save — sprawdź spinner podczas zapisu
  7. Sprawdź czy po zapisie wracasz na Home
  8. Wejdź w Supabase Dashboard → Table Editor → entries — sprawdź czy wpis się pojawił
  9. Wróć na /new, wpisz tekst, kliknij "← Back" — sprawdź czy wracasz na Home bez zapisu
- [ ] Potwierdź weryfikację wpisując 1

# Current Task — US-007: Home screen entry list and entry detail view

**Branch:** 7-entry-list-view
**Created:** 2026-04-23
**Status:** 🔄 In Progress

## Context
Implement the Home screen entry list and Entry Detail view — the last missing piece of the M1 MVP core loop. Users can currently write entries but have no way to read them back. After this US, the app shows all past entries on Home (newest first), with a clickable card leading to a full detail view including follow-up Q&A. `getEntries()` and `getEntryById()` are already implemented in entryService.ts — only UI needs to be built.

## Files to Read First
- `src/pages/HomePage.tsx` — existing Home page (has header, banner, Write button — needs entry list added)
- `src/pages/NewEntryPage.tsx` — reference for design patterns and Tailwind color system
- `src/services/entryService.ts` — getEntries() and getEntryById() already implemented
- `src/types/index.ts` — Entry and EntryWithFollowUps types
- `src/App.tsx` — needs new Route for /entry/:id
- `docs/wireframes.md` — S-001 (Home / Entry List) and S-004 (Entry Detail) specs

## Tasks
1. [ ] TASK-007.3: Create `src/components/EntryCard/EntryCard.tsx` — displays date (formatted with Intl.DateTimeFormat, e.g. "April 9, 2026"), content preview (2 lines truncated with line-clamp), emotion tags as badges; clickable card navigates to /entry/:id
2. [ ] TASK-007.4: Update `src/pages/HomePage.tsx` — add useEffect to load entries on mount via getEntries(); show: loading skeleton (3 animate-pulse cards), empty state ("Your story starts here" + Write CTA), or list of EntryCard components; preserve existing header, banner, and Write button
3. [ ] TASK-007.5: Create `src/pages/EntryDetailPage.tsx` — loads entry via getEntryById(id) from URL params; shows: full content, formatted date, emotion tags, follow-up Q&A section (each answered question + answer); Back button returns to Home; add Route `/entry/:id` in App.tsx
4. [ ] TASK-007.6: Write tests (/qa — after manual verification)
5. [ ] TASK-007.7: Manual verification

## Constraints
- Use `Intl.DateTimeFormat` for date formatting — do NOT install date-fns (not needed for this scope)
- Design system: Ink `#1C1917`, Cream `#FAFAF9`, Stone `#E7E5E4`, Warm Stone `#78716C`, Amber `#D97706`
- All Supabase calls go through `src/services/entryService.ts` — never call supabase from components
- Use `useNavigate` / `useParams` from react-router-dom for navigation and URL param reading
- Loading skeleton: use Tailwind `animate-pulse` — no new libraries
- No `any` type — use Entry and EntryWithFollowUps from types/index.ts
- Keep each file under 300 lines
- EntryCard receives `entry: Entry` and `onClick: () => void` as props

## Acceptance Criteria
- [ ] Home screen loads all entries from Supabase on mount
- [ ] Entries displayed newest first
- [ ] Each card shows: date (formatted), content preview (2 lines, truncated), emotion tags
- [ ] Empty state shown when no entries: illustration + "Write your first entry" CTA
- [ ] Loading skeleton shown while fetching
- [ ] Clicking card navigates to Entry Detail view
- [ ] Entry Detail shows: full content, date, all follow-up Q&A (questions + answers)
- [ ] Back button from Detail returns to Home

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps (po polsku):
  1. Uruchom `npm run dev`, otwórz http://localhost:5173
  2. Sprawdź stan pusty: jeśli nie ma wpisów — widać "Your story starts here" z przyciskiem Write
  3. Kliknij "+ Write", napisz wpis, zapisz — wróć na Home
  4. Sprawdź czy nowy wpis pojawia się na liście jako karta z datą i fragmentem tekstu
  5. Napisz drugi wpis i sprawdź czy najnowszy jest na górze
  6. Kliknij kartę wpisu — sprawdź czy otwiera się widok szczegółów z pełną treścią
  7. Jeśli wpis miał odpowiedzi na pytania AI — sprawdź czy są widoczne w sekcji "Follow-up"
  8. Kliknij "← Back" — sprawdź czy wracasz na listę
  9. Odśwież stronę — sprawdź czy skeleton (szare karty) pojawia się przed załadowaniem listy
- [ ] Potwierdź weryfikację wpisując 1

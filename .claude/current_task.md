# Current Task — US-101: AI connection detection on entry save

**Branch:** 101-connection-detection
**Created:** 2026-04-24
**Status:** 🔄 In Progress

## Context
After a new entry is saved, the AI silently compares it to the 10 most recent past entries. If it finds a meaningful emotional or situational similarity (score ≥ 0.7), a connection is stored in the `connections` table and a badge appears on the entry card. This is the core differentiator of Dotflow — showing users patterns they may not notice themselves. The `connections` table already exists in Supabase (created in US-002). The AI call runs fire-and-forget in the background: the UI never waits for it and no spinner is shown.

## Files to Read First
- `src/services/aiService.ts` — existing OpenAI call pattern (extend with findConnection)
- `src/services/entryService.ts` — existing CRUD (extend with saveConnection, getConnectionsForEntry)
- `src/utils/prompts.ts` — existing prompts (add CONNECTION_DETECTION_SYSTEM_PROMPT)
- `src/types/index.ts` — check existing Connection type
- `src/components/EntryCard/EntryCard.tsx` — extend with optional connection prop
- `src/pages/NewEntryPage.tsx` — where background check will be triggered
- `src/pages/HomePage.tsx` — where connections are loaded and passed to EntryCard
- `docs/architecture.md` — Section 8 has the connection detection prompt template

## Tasks
1. [ ] TASK-101.1: Add `CONNECTION_DETECTION_SYSTEM_PROMPT` to `src/utils/prompts.ts` — AI responds with JSON: `{ connected: boolean, entry_id: string | null, score: number, note: string }`; prompt based on Section 8 of architecture.md
2. [ ] TASK-101.2: Implement `aiService.findConnection(newEntry: Entry, pastEntries: Entry[], apiKey: string): Promise<ConnectionResult>` in `src/services/aiService.ts` — calls OpenAI, parses JSON response, returns `{ connected: false }` on any error (never throws)
3. [ ] TASK-101.3: Implement `entryService.saveConnection(sourceEntryId: string, targetEntryId: string, score: number, note: string): Promise<void>` in `src/services/entryService.ts`
4. [ ] TASK-101.4: Implement `entryService.getConnectionsForEntry(entryId: string): Promise<Connection[]>` in `src/services/entryService.ts`
5. [ ] TASK-101.5: Create `src/components/ConnectionBadge/ConnectionBadge.tsx` — displays "Connected to [formatted date]", clickable, navigates to `/entry/[targetId]` via useNavigate
6. [ ] TASK-101.6: Update `src/components/EntryCard/EntryCard.tsx` — add optional `connection?: { targetId: string; targetDate: string }` prop; if present, render ConnectionBadge below emotion tags
7. [ ] TASK-101.7: Update `src/pages/HomePage.tsx` — after loading entries, load connections for all entries (use Promise.all with getConnectionsForEntry per entry); pass connection data to each EntryCard
8. [ ] TASK-101.8: Update `src/pages/NewEntryPage.tsx` — after entry is saved and before/after AI follow-up, fire background connection check: fetch 10 recent entries, call aiService.findConnection, if connected call entryService.saveConnection; entire block is fire-and-forget (no await at top level, errors silently ignored); only trigger if API key is set
9. [ ] TASK-101.9: Write tests (/qa — after manual verification)
10. [ ] TASK-101.10: Manual verification

## Constraints
- Background connection check is fire-and-forget: wrap in async IIFE or `.then().catch()` — NEVER await at component level, NEVER show error to user if it fails
- `aiService.findConnection` must NEVER throw — catch all errors internally and return `{ connected: false, entry_id: null, score: 0, note: '' }`
- Only trigger connection check if API key is set (`apiKey` truthy)
- Fetch at most 10 past entries for comparison (exclude the newly saved entry)
- Connection badge click navigates to `/entry/[targetId]` — reuse existing route
- Design system: badge uses Stone `#E7E5E4` bg, Warm Stone `#78716C` text — consistent with emotion tags
- All Supabase calls go through `src/services/entryService.ts`
- All OpenAI calls go through `src/services/aiService.ts`
- No `any` type — define `ConnectionResult` type in types/index.ts if not present
- Keep each file under 300 lines

## Acceptance Criteria
- [ ] Connection check runs in background after entry save (does not delay UI)
- [ ] AI compares new entry to 10 most recent past entries
- [ ] If similarity score ≥ 0.7, connection stored in `connections` table
- [ ] Connection badge appears on entry card: "Connected to [date]"
- [ ] Clicking badge navigates to connected entry
- [ ] If no connection found: no badge, no error

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps (po polsku):
  1. Uruchom `npm run dev`, otwórz http://localhost:5173
  2. Upewnij się że masz ustawiony klucz API w Settings
  3. Napisz nowy wpis podobny tematycznie do jednego z istniejących (np. oba o pracy lub relacjach)
  4. Zapisz wpis i przejdź przez pytania AI, potwierdź "Save Entry"
  5. Wróć na ekran główny — poczekaj chwilę (kilka sekund na odpowiedź AI w tle)
  6. Odśwież stronę — sprawdź czy na karcie nowego wpisu pojawia się odznaka "Connected to [data]"
  7. Kliknij odznakę — sprawdź czy przenosi do powiązanego wpisu
  8. Napisz wpis o zupełnie innej tematyce — sprawdź że odznaka NIE pojawia się
  9. Sprawdź w Supabase Dashboard (Table Editor → connections) czy rekord połączenia jest zapisany z poprawnym score i note
  10. Sprawdź że brak klucza API nie powoduje błędu — usuń klucz w Settings, zapisz wpis, sprawdź brak errorów w konsoli
- [ ] Potwierdź weryfikację wpisując 1

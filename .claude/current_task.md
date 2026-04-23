# Current Task — US-004: Settings screen with API key management

**Branch:** 4-settings-api-key
**Created:** 2026-04-23
**Status:** 🔄 In Progress

## Context
Infrastructure is complete (US-001–003 done). This is the first user-facing feature. It creates the Settings screen where the user enters their OpenAI API key, stored in localStorage. A warning banner on Home nudges the user to set up the key. Without this, AI features cannot be enabled.

## Files to Read First
- docs/wireframes.md (S-001 Home, S-005 Settings — layout and elements)
- docs/architecture.md (section 1 — Settings Hook in diagram, section 4 — folder structure)
- docs/design_brief.md (color system, button styles, input field styles)
- src/App.tsx (current state — needs routing added)

## Tasks
1. [ ] **TASK-004.1:** Install `react-router-dom` — `npm install react-router-dom` + install types `npm install -D @types/react-router-dom`
2. [ ] **TASK-004.2:** Create `src/hooks/useSettings.ts` — get/set/clear API key in localStorage, return `{ apiKey, saveApiKey, clearApiKey }` — typed, no `any`
3. [ ] **TASK-004.3:** Create `src/pages/SettingsPage.tsx` — API key input form with Save and Clear buttons, masked display (`sk-...xxxx`) after saving, info text "Your key is stored locally on this device only"
4. [ ] **TASK-004.4:** Create `src/pages/HomePage.tsx` — minimal home page with warning banner (when no API key) and ⚙ icon linking to Settings
5. [ ] **TASK-004.5:** Update `src/App.tsx` — add BrowserRouter + routes: `/` → HomePage, `/settings` → SettingsPage
6. [ ] **TASK-004.6 (/qa):** Write tests for `useSettings` hook (save, clear, persist) and warning banner visibility

## Constraints
- API key access ONLY through `useSettings` hook — never read localStorage directly in components
- Masked display formula: `sk-...` + last 4 chars of key (e.g. `sk-...Ab3x`)
- No `any` types — key is `string | null`
- react-router-dom: use `<Link>` and `useNavigate` for navigation
- Max 300 lines per file, max 50 lines per function
- Follow design_brief.md color system (Ink `#1C1917`, Cream `#FAFAF9`, Amber `#D97706`)

## Acceptance Criteria
- [ ] Settings screen accessible via ⚙ icon from Home
- [ ] User can type and save an API key
- [ ] Saved key is displayed masked: `sk-...xxxx` (last 4 chars visible)
- [ ] User can clear the saved key
- [ ] Key persists after page refresh (localStorage)
- [ ] Warning banner on Home screen when no key is set
- [ ] Info text: "Your key is stored locally on this device only"

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps:
  1. Uruchom `npm run dev` — otwórz http://localhost:5173
  2. Sprawdź że widać baner "Add your API key in Settings" na Home
  3. Kliknij ⚙ — sprawdź że przechodzi do /settings
  4. Wpisz dowolny klucz (np. `sk-testkey1234`) i kliknij Save
  5. Sprawdź że klucz jest zamaskowany (`sk-...1234`)
  6. Odśwież stronę — sprawdź że klucz nadal jest widoczny
  7. Wróć na Home — sprawdź że baner NIE jest widoczny
  8. Kliknij Clear — sprawdź że klucz znika i baner wraca na Home
- [ ] Potwierdź weryfikację wpisując "weryfikacja OK" lub "1"

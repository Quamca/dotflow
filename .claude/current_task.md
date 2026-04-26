# Current Task — US-202: Black Hole & Psychological Profile

**Branch:** 202-black-hole-profile
**Created:** 2026-04-27
**Status:** 🔄 In Progress

## Context
Adding a "black hole" mesh at the center of the StarField scene — a visual representation of the user's psychological core. The black hole grows with entry count, shows insight on hover (as an additional channel — the "Generate insights" button stays until US-205), and enables a values workflow where AI proposes recurring themes (observational framing) and the user confirms/edits/rejects them. Confirmed values affect star positioning in 3D space.

## Files to Read First
- `src/components/StarField/StarField.tsx` — extend with BlackHole mesh
- `src/components/StarField/StarNode.tsx` — reference for 3D mesh pattern
- `src/utils/starPositions.ts` — extend with value-alignment positioning
- `src/services/aiService.ts` — add extractUserValues()
- `src/utils/prompts.ts` — add USER_VALUES_SYSTEM_PROMPT
- `src/types/index.ts` — add UserValues type
- `src/hooks/useSettings.ts` — localStorage pattern for values storage

## Tasks
1. [ ] **TASK-202.1:** Create BlackHole mesh component in `src/components/StarField/BlackHole.tsx` — sphere mesh at origin with dark material and subtle glow
2. [ ] **TASK-202.2:** Scale black hole size based on entry count (min 0.3, max 1.2 at ~50 entries) — add to StarField.tsx
3. [ ] **TASK-202.3:** Hover on black hole → show insight tooltip (reuse pattern summary data via prop from HomePage) — hover state in BlackHole component
4. [ ] **TASK-202.4:** Add `USER_VALUES_SYSTEM_PROMPT` to `src/utils/prompts.ts` — observational framing, returns JSON array of 5 theme strings
5. [ ] **TASK-202.5:** Add `extractUserValues(entries, apiKey)` to `src/services/aiService.ts` — calls OpenAI, returns string[]
6. [ ] **TASK-202.6:** Create `ValuesModal` component (`src/components/ValuesModal.tsx`) — observational framing + editable list + "Żadna z tych" escape hatch + free text field
7. [ ] **TASK-202.7:** Add `useUserValues` hook (`src/hooks/useUserValues.ts`) — localStorage read/write for confirmed values + pending proposal state
8. [ ] **TASK-202.8:** Extend `getStarPosition` or add `getAlignedStarPosition(entryId, entry, userValues)` in `starPositions.ts` — values-aligned entries get radius 1.5–3, neutral entries radius 3–8
9. [ ] **TASK-202.9:** Wire values trigger in HomePage — after 5+ entries and no confirmed values, trigger `extractUserValues` and show ValuesModal

## Constraints
- Black hole hover insight: observational-data language (per docs/ai_communication_principles.md) — reuse generatePatternSummary() output
- Values modal framing: "W Twoich wpisach te tematy wracają najczęściej: X, Y..." — NOT "Twoje wartości: X"
- "Generate insights" button stays on Home — black hole is additional channel, not replacement
- Values stored in localStorage only (no Supabase schema change)
- react-three-fiber + @react-three/drei already installed — no new deps needed
- Max file length: 300 lines; max function length: 50 lines

## Acceptance Criteria
- [ ] Black hole visible at center of 3D scene (both blurred background and interactive mode)
- [ ] Size scales with entry count (min at 1 entry, max capped at ~15% of scene)
- [ ] Hover on black hole shows current pattern insight ("Generate insights" button remains)
- [ ] After 5+ entries with no confirmed values, AI proposes themes with observational framing
- [ ] ValuesModal: proposal list + editing + "Żadna z tych" + free text field
- [ ] Confirmed values stored in localStorage
- [ ] Star positions update based on value alignment after confirming values

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps:
  1. Otwórz Dotflow i kliknij logo Dotflow → tryb 3D
  2. Sprawdź czy w centrum sceny widoczna jest ciemna kula (black hole)
  3. Najedź myszą na kulę — powinien pojawić się insight (lub info "Add API key")
  4. Sprawdź że przycisk "Generate insights" nadal jest widoczny na Home (nie usunięty)
  5. (Jeśli masz 5+ wpisów) Sprawdź że pojawia się modal wartości z observational framing
  6. W modalu przetestuj edycję listy, usuwanie pozycji i kliknięcie "Żadna z tych"
  7. Po zatwierdzeniu wartości — wróć do trybu 3D i sprawdź czy gwiazdy się przepozycjonowały
- [ ] Potwierdź weryfikację wpisując 1 → agent automatycznie uruchomi /qa

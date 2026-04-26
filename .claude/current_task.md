# Current Task — US-201: 3D Star Field — Basic Visualization

**Branch:** 201-3d-star-field
**Created:** 2026-04-26
**Status:** 🔄 In Progress

## Context
We are building the first phase of the 3D visualization for Dotflow. Each journal entry becomes a star in a 3D space. Entries with detected connections are linked by constellation lines. The star field lives as a blurred background on the Home screen; the Dotflow logo acts as an easter egg toggle that switches into full interactive 3D exploration mode.

## Files to Read First
- `src/pages/HomePage.tsx` — where StarField will be mounted
- `src/services/entryService.ts` — getEntries(), getConnectionsForEntry()
- `src/types/index.ts` — Entry, Connection types
- `docs/architecture.md` — planned StarField component placement

## Tasks
1. [ ] **TASK-201.1:** Install react-three-fiber, @react-three/drei, three — `npm install @react-three/fiber @react-three/drei three` and types `npm install -D @types/three`
2. [ ] **TASK-201.2:** Create `src/components/StarField/StarField.tsx` — Canvas with basic 3D scene (ambient light, perspective camera)
3. [ ] **TASK-201.3:** Map entries to stable star positions (derive x/y/z from entry id hash so positions don't change on re-render)
4. [ ] **TASK-201.4:** Render constellation lines (Line geometry) between entries that have a saved connection record
5. [ ] **TASK-201.5:** Make Dotflow logo in HomePage header the easter egg toggle — clicking it blurs/unblurs the scene and shows/hides the entry list
6. [ ] **TASK-201.6:** Add hover interaction on stars — show entry preview (date + first 60 chars of content) as a floating label
7. [ ] **TASK-201.7:** Add OrbitControls (from @react-three/drei) — rotate, pan, zoom
8. [ ] **TASK-201.8:** Star size reflects connection count (more connections = slightly larger star, min size enforced)
9. [ ] **TASK-201.9:** Write tests for StarField component (/qa)
10. [ ] **TASK-201.10:** Manual verification

## Constraints
- All Supabase calls via `src/services/entryService.ts` — never directly from components
- No `any` types — use proper Three.js types from `@types/three`
- Maximum file length: 300 lines — split StarField into sub-components if needed
- Star positions must be deterministic (same entry always same position) — use entry id as seed
- Performance: no visible lag on 50+ entries

## Acceptance Criteria
- [ ] Home background shows blurred 3D star field (one star per entry)
- [ ] Constellation lines connect entries that have a saved connection record
- [ ] Dotflow logo (top-left header) is the easter egg toggle — clicking switches between list view and 3D mode
- [ ] Clicking logo: entry list fades out, 3D scene becomes unblurred and interactive
- [ ] Clicking logo again: returns to normal list view
- [ ] Hover on a star shows entry preview (date + content snippet)
- [ ] Orbit controls work: rotate, pan, zoom
- [ ] Star size reflects connection count (larger = more connected)
- [ ] Performance: no visible lag on 50+ entries

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps (po polsku):
  1. Otwórz stronę główną — sprawdź czy za listą wpisów widać zamazane gwiazdki
  2. Kliknij logo "Dotflow" — lista powinna zniknąć, gwiazdy wyostrzyć się i stać interaktywne
  3. Obróć, przybliż i oddal scenę myszą — powinna reagować płynnie
  4. Najedź kursorem na gwiazdę — powinien pojawić się podgląd wpisu (data + fragment treści)
  5. Jeśli masz wpisy z połączeniami — sprawdź czy widać linie między powiązanymi gwiazdami
  6. Kliknij logo ponownie — powinna wrócić lista wpisów
  7. Sprawdź na 50+ wpisach czy brak lagów (jeśli masz tyle wpisów)
- [ ] Potwierdź weryfikację wpisując 1

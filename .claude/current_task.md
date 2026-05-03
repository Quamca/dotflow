# Current Task — US-208: Life Area Zones — Emergent Clusters

**Branch:** 208-life-area-zones
**Created:** 2026-05-03
**Status:** 🔄 In Progress

## Context
Implementing emergent life area zones in the 3D sky. After ~15 stories accumulate, AI clusters them thematically and renders a nebula/cloud overlay per zone. Zone labels appear on hover only. User can rename or clear labels. No preset categories — zones are fully emergent from story content.

## Files to Read First
- `src/services/aiService.ts` — add `classifyLifeArea()`
- `src/utils/prompts.ts` — add `LIFE_AREA_SYSTEM_PROMPT`
- `src/utils/starPositions.ts` — add clustering bias for story positions
- `src/components/StarField/StarField.tsx` — integrate zone overlay + labels
- `src/hooks/useLifeAreaZones.ts` — NEW: zone labels + user renames
- `src/types/index.ts` — Story type already has `life_area: string | null`

## Tasks
1. [ ] TASK-208.1: Add `classifyLifeArea(storyContent, existingAreas, apiKey)` to aiService.ts
2. [ ] TASK-208.2: Add `LIFE_AREA_SYSTEM_PROMPT` to prompts.ts
3. [ ] TASK-208.3: Implement zone cluster detection — group stories by life_area, compute cluster centroid
4. [ ] TASK-208.4: Apply spatial clustering bias — stories in same zone biased toward centroid in starPositions.ts
5. [ ] TASK-208.5: Render nebula/cloud overlay per zone in StarField (very low opacity ~8-12%, soft gradient, ambient motion ±2%)
6. [ ] TASK-208.6: Hover-only zone label rendering
7. [ ] TASK-208.7: Create `useLifeAreaZones.ts` hook — manages custom labels in localStorage
8. [ ] TASK-208.8: Zone fade when cluster < 5 stories

## Constraints
- Story type already has `life_area: string | null` — no migration needed
- No preset categories — AI suggests emergent labels only
- Global Product Principle: observational language, no identity labels
- Zone overlay: no hard edges, no sharp borders, opacity max 8-12%
- Zone lifecycle: appears only when ≥5 stories share same life_area value
- Label: hover-only, DM Sans 11px Warm Stone, user-renameable, clearable
- Forbidden: fixed map layout, legend panel, count/percentage display, preset zones
- StarField.tsx must stay under 300 lines — extract LifeAreaZone as separate component

## Acceptance Criteria
- [ ] `classifyLifeArea()` returns string label or null
- [ ] Life area stored in `stories.life_area` (Supabase)
- [ ] Stories in same area cluster spatially in 3D
- [ ] Nebula overlay visible, ambient motion, no hard edges
- [ ] Label appears on hover only
- [ ] User can rename/clear label via click
- [ ] Zones appear only at ≥5 stories per area
- [ ] No preset categories anywhere in code or prompt

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps:
  1. Otwórz 3D niebo z ≥5 historiami z podobnym tematem — sprawdź czy mgławica jest widoczna
  2. Najedź na mgławicę — czy pojawia się etykieta?
  3. Kliknij etykietę — czy można ją edytować?
  4. Usuń etykietę — czy mgławica zostaje (bez podpisu)?
  5. Sprawdź z < 5 historiami w obszarze — czy mgławica NIE pojawia się?
- [ ] Potwierdź weryfikację wpisując 1 → agent automatycznie uruchomi /qa

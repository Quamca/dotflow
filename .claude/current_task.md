# Current Task — US-214: Volumetric Nebula Rendering

**Branch:** 214-volumetric-nebula
**Created:** 2026-05-03
**Status:** 🔄 In Progress

## Context
Replace the single-sphere `meshBasicMaterial` zone overlay in `LifeAreaZone.tsx` with a layered nebula
system. Each zone renders up to 7 translucent mesh layers (per emotion up to 3 emotions × 2 layers +
1 ambient), each with independent drift animation and axis-scaled geometry. StarField.tsx passes
`emotionWeights` (proportional map) instead of a single dominant `color`. No clustering logic changes.

## Files to Read First
- `src/components/StarField/LifeAreaZone.tsx` — replace visual mesh block
- `src/components/StarField/StarField.tsx` — change ZoneSpec + emotionWeights computation
- `src/utils/emotionColors.ts` — getEmotionColor used inside LifeAreaZone

## Tasks
1. [ ] **TASK-214.1:** Change `ZoneSpec` in StarField.tsx: replace `color: string` with
       `emotionWeights: Record<string, number>` (emotion → proportion 0-1); compute from
       emotionCounts / total instead of dominant color; pass to LifeAreaZone
2. [ ] **TASK-214.2:** In LifeAreaZone.tsx: replace `color` prop with `emotionWeights`;
       build `layers` array in useMemo — up to 3 emotions × 2 sphere layers + 1 ambient layer
       (7 layers max); each layer: { color, radiusScale, opacityFactor, phaseOffset, speed, axisScale }
3. [ ] **TASK-214.3:** Replace single visual mesh with array of mesh layers; use
       `layerRefs = useRef<(Mesh | null)[]>([])` for per-layer animation
4. [ ] **TASK-214.4:** In useFrame: animate each layer with unique sin/cos drift on scale axes
       (speed ~0.15–0.3, amplitude ~0.03–0.05); keep invisible hit mesh at fixed scale
5. [ ] **TASK-214.5:** Tune base opacity: idle layers ~0.04–0.07 × weight, active ~1.6× multiplier;
       inner layers (radiusScale ~0.55) higher base opacity than outer (radiusScale ~1.0)

## Layer Structure (reference)
```
Per emotion (weight > 0.05, max 3 emotions, sorted descending):
  - Outer diffuse:  radiusScale=1.00, opacityFactor=weight*0.065, axisScale=[1.0, 0.92, 1.0]
  - Inner glow:     radiusScale=0.58, opacityFactor=weight*0.090, axisScale=[0.95, 1.00, 0.90]
Plus 1 ambient neutral layer (stone #78716C):
  - Ambient:        radiusScale=0.80, opacityFactor=0.020, axisScale=[1.0, 0.95, 1.0]
```

## Constraints
- Invisible hit mesh: must NOT change (pointer events, fixed scale — LifeAreaZone.tsx lines 97–109)
- Label render: must NOT change (Html, editing flow — LifeAreaZone.tsx lines 122–170)
- Zone clustering + StarField logic: must NOT change
- Max file length: 300 lines (LifeAreaZone.tsx currently 173 lines)
- No `any` type
- Import `getEmotionColor` inside LifeAreaZone — not from StarField
- Fallback when no valid emotions: render single ambient layer only

## Acceptance Criteria
- [ ] Zone visuals use layered rendering — not a single sphere overlay
- [ ] Multiple emotions blend proportionally (no dominant flat tint when >1 emotion present)
- [ ] No hard color separation or gradient bands
- [ ] Ambient movement visible (each layer drifts independently)
- [ ] Zones remain transparent and atmospheric (never solid)
- [ ] Hover-only label behavior preserved
- [ ] Zone clustering logic unchanged
- [ ] `npm run lint` passes
- [ ] `npm test` passes

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps (po polsku):
  1. Otwórz tryb 3D (kliknij logo Dotflow) — miej co najmniej 5 historii w jednej strefie życia
  2. Sprawdź że strefa wygląda jak mgławica, nie sfera — widoczna nierówna gęstość
  3. Poczekaj kilka sekund — sprawdź że chmura powoli "oddycha" (skala pulsuje)
  4. Jeśli w strefie są różne emocje — sprawdź że widać blending kolorów, nie jeden dominujący
  5. Najedź na strefę — sprawdź że etykieta nadal pojawia się tylko na hover
  6. Sprawdź że gwiazdy-historie są nadal dobrze widoczne (mgławica ich nie zasłania)
- [ ] Potwierdź weryfikację wpisując 1 → agent automatycznie uruchomi /qa

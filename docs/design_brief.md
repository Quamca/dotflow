# Dotflow — Design Brief

**Version:** 1.0
**Created:** 2026-04-09
**Purpose:** Foundation for UI/UX work and visual asset generation

---

## 1. Visual Identity

### Personality
Dotflow is a quiet, intelligent companion for self-reflection.
The design should feel like a well-lit room in the evening — calm, focused, slightly warm. Not clinical. Not playful. Thoughtful.

**Three words that describe the visual tone:**
- **Still** — unhurried, no notifications, no noise
- **Warm** — inviting, safe, human
- **Precise** — every element has a reason to be there

**Inspiration:** Notion (clarity), Day One (journaling warmth), Linear (precise, calm UI)

---

## 2. Color System

### Primary Palette

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Primary | Ink | `#1C1917` | Text, primary actions |
| Primary Light | Warm Stone | `#78716C` | Secondary text, placeholders |
| Surface | Cream | `#FAFAF9` | Background |
| Surface Alt | Warm White | `#F5F5F4` | Card backgrounds |
| Accent | Amber | `#D97706` | Active states, highlights, dots |
| Accent Light | Amber Mist | `#FEF3C7` | Accent backgrounds, badges |
| Border | Stone | `#E7E5E4` | Dividers, card borders |
| Error | Terracotta | `#B91C1C` | Error states |
| Success | Sage | `#15803D` | Success states |

### Do Not Use
- Pure white (`#FFFFFF`) backgrounds — use Cream instead for warmth
- Bright blue / purple — too digital, breaks the calm tone
- High-saturation colors — everything should feel slightly muted

---

## 3. Typography

### Font Pairing

| Role | Font | Weight | Size |
|------|------|--------|------|
| App Name / Display | **Playfair Display** | 600 | 28–36px |
| Headings | **Playfair Display** | 500 | 18–24px |
| Body / Entry content | **Lora** | 400 | 16px |
| UI labels / meta | **DM Sans** | 400–500 | 12–14px |
| Questions (AI) | **Lora** | 400 italic | 16px |

**Font source:** Google Fonts
- Playfair Display: https://fonts.google.com/specimen/Playfair+Display
- Lora: https://fonts.google.com/specimen/Lora
- DM Sans: https://fonts.google.com/specimen/DM+Sans

### Typography Rules
- Entry content uses serif (Lora) — reading experience, not UI chrome
- UI chrome uses sans-serif (DM Sans) — labels, dates, buttons
- AI questions use italic Lora — distinguishes AI voice from UI
- Line height: 1.7 for body text, 1.3 for headings
- Letter spacing: -0.01em for headings, normal for body

---

## 4. Iconography

### Style
Line icons, 1.5px stroke, slightly rounded ends. Minimal — only used where text alone is insufficient.

### Recommended Sets
- Lucide Icons — https://lucide.dev (React package: `lucide-react`)

### Icon Sizes
| Context | Size |
|---------|------|
| Navigation / Settings | 20px |
| Inline with text | 16px |
| Large decorative | 32px |

---

## 5. Spacing & Shape

### Border Radius
| Element | Radius |
|---------|--------|
| Cards | 12px |
| Buttons (primary) | 8px |
| Badges / Tags | 9999px (pill) |
| Input fields | 8px |
| Dialog / Modal | 16px |

### Spacing Scale
Base unit: **4px**

| Name | Value | Usage |
|------|-------|-------|
| XS | 4px | Tight gaps within components |
| S | 8px | Within components |
| M | 16px | Standard padding |
| L | 24px | Section spacing |
| XL | 40px | Screen padding, major sections |
| 2XL | 64px | Screen-level breathing room |

---

## 6. Elevation & Shadows

| Level | Usage | Shadow |
|-------|-------|--------|
| 0 | Flat elements, inputs | None |
| 1 | Entry cards | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` |
| 2 | Hover state on cards | `0 4px 12px rgba(0,0,0,0.08)` |
| 3 | Follow-Up Dialog | `0 20px 40px rgba(0,0,0,0.12)` |

---

## 7. Component Guidelines

### Buttons
- **Primary:** Ink background (`#1C1917`), Cream text, 8px radius, 40px height
- **Secondary:** Transparent, Ink border, Ink text
- **Ghost / Text:** No border, Warm Stone text, used for "Skip" / "Back"
- **Disabled state:** 40% opacity, no pointer events

### Cards (Entry Cards)
- Cream White background (`#F5F5F4`)
- 1px Stone border (`#E7E5E4`)
- 12px border radius
- Subtle shadow level 1
- Hover: shadow level 2, slight translateY(-1px)

### Input Fields
- Cream White background
- 1px Stone border, 2px Amber border on focus
- 8px radius, 40px height (single line), auto-height for textarea
- Placeholder in Warm Stone

### Emotion Tags / Badges
- Pill shape (9999px radius)
- Amber Mist background (`#FEF3C7`), Amber text (`#D97706`)
- 12px font, DM Sans

### Follow-Up Dialog
- Appears as bottom sheet on mobile, centered modal on desktop
- Shadow level 3
- AI question text in italic Lora — feels like a gentle voice

---

## 8. Motion Guidelines

### Principles
- Motion should feel like breathing — never rushed
- Entries appear with subtle fade + slide up
- Dialog appears with ease-out from bottom (mobile) or scale from center (desktop)
- Nothing blinks, flashes, or bounces

### Timing
| Type | Duration | Easing |
|------|----------|--------|
| Micro-interactions (hover, focus) | 150ms | ease |
| Entry card appear | 200ms | ease-out |
| Dialog open/close | 250ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Page transition | 200ms | ease |

---

## 9. Visual Language: The Dot

The "dot" is the central metaphor of Dotflow — each entry is a point in a constellation of thought.

**Use dots visually:**
- Empty state illustration: scattered dots forming a pattern
- Connection indicator: a subtle line or dot connecting two entries
- App icon concept: constellation of 3–5 dots

**Amber dot** (`●` in accent color) can be used sparingly as a decorative element in headings or empty states.

---

## 10. Asset Generation Prompts (AI Tools)

### App Icon
```
Minimal app icon for a journaling app called Dotflow. Dark navy background. 
Three small warm amber dots arranged like a constellation, with thin lines 
connecting them. Clean, modern, geometric. Flat design, no gradients, 
no text. Square format with rounded corners.
```

### Empty State Illustration
```
Minimalist line illustration of scattered dots on a warm cream background, 
some connected by thin delicate lines forming a loose constellation pattern. 
Warm amber accent color for the dots. Simple, calm, meditative feeling. 
SVG style, no gradients.
```

---

---

## 11. 3D Visualization Design Decisions (US-201)

### Light Theme for Star Field

**Decision:** Canvas background `#FAFAF9` (Cream), star dots `#78716C` (Warm Stone). Stars visible but subtle — content (entry list) sits in front with `rgba(250,250,249,0.88)` background.

**Why:** Dark canvas (`#0C0A09`) with white stars created a "space simulator" feel that competed with the journaling content. The light theme keeps star nodes as a whispered presence in the background — enough to create atmospheric depth, not enough to distract. Aligns with the Dotflow "warm room in the evening" personality.

**Source:** /consult decision — "subtelne jak oddech, nie jak widowisko."

### Star Field Toggle UX

**Decision:** Dotflow logo (top-right header) is the easter egg toggle between list view and 3D exploration mode. No dedicated toggle button — the logo IS the interactive element.

**Why:** Keeps the Home screen completely uncluttered. Users who discover the 3D mode feel rewarded; casual users are never confused by a button they don't understand.

---

## 12. Black Hole Visual Design Decisions (US-202)

### Black Hole Colors

**Decision:** Two-layer sphere — core `#0a0a0f` (near-black with slight blue tint, metalness 0.8, roughness 0.2) + glow halo `#3b2a4a` (dark purple, 18% opacity).

**Why:** Pure black (`#000000`) on the Cream background reads as a "hole" but loses the sense of mass. The dark purple halo references the scientific visualization of accretion disks without being literal — maintains the journaling metaphor while giving the object visual weight.

### Black Hole Pulse Animation

**Decision:** Glow halo pulses continuously via `useFrame` sin-wave: `scale = 1 + sin(t * 0.8) * 0.04`. Core rotates slowly (0.3 rad/s) only while hovered.

**Why:** The resting pulse (±4% scale) makes the black hole feel alive — breathing, not static. The rotation-on-hover gives tactile feedback without being distracting during passive browsing. Scale kept small (4%) to avoid drawing attention away from entries.

### Black Hole Size Scaling

**Decision:** `clampedSize = max(0.3, entryCount * scaleFactor)`. Capped to ensure it never dominates the scene.

**Why:** Growth must feel proportional but never threatening. At 1 entry it's already visible (0.3 minimum); growth slows logarithmically by virtue of being a sphere — doubling the value yields a visually modest size increase.

### Hover Tooltip

**Decision:** Dark overlay (`rgba(10,10,15,0.94)`) with Cream text, max 3 observations shown. If no insight yet: *"Keep writing — your center is forming."*

**Why:** Dark tooltip on the dark object feels continuous — the insight emerges from the center rather than appearing above it. Limiting to 3 observations avoids overwhelming the hover moment; the full set is available via the "Generate insights" button.

### Value-Aligned Star Positioning

**Decision:** Entries matching user's confirmed values use radius 1.5–3 (close to black hole); neutral entries use radius 3–8 (standard range).

**Why:** The black hole represents the user's psychological core — entries aligned with their values should feel drawn toward it. The dual radius ranges create visible clustering without forcing all stars into the center, preserving the spatial sense of the full universe.

---

*This brief is a living document — update when design decisions evolve.*

# Dotflow — Project Status

**Last updated:** 2026-05-03
**Current milestone:** M2.5 — Experience Depth (pre-M3)
**Version:** 1.7

---

## M2.5 Progress

| # | US | Title | Priority | Status |
|---|-----|-------|----------|--------|
| 1 | US-201 | 3D Star Field | P1 | ✅ Done |
| 2 | US-202 | Black Hole & Psychological Profile | P1 | ✅ Done |
| 3 | US-203 | Dialectical Insight Response | P1 | ✅ Done |
| 4 | US-206 | Story Extraction — One Entry, Many Stars | P0 | ✅ Done |
| 5 | US-207 | Emotion Intelligence per Story | P1 | ✅ Done |
| 6 | US-210 | Contextual Follow-Up Between Lines | P1 | ✅ Done |
| 7 | **US-205** | **Depth-Driven Adaptive Insights** | **P1** | **✅ Done** |
| 8 | US-208 | Life Area Zones — Emergent Clusters | P1 | 📋 Planned |
| 9 | US-204 | Contextual First-Use Hints | P2 | 📋 Planned |
| 10 | US-209 | Typed Connection Visualization | P2 | 📋 Planned |
| 11 | US-211 | Insight History Timeline | P2 | 📋 Planned |
| 12 | US-212 | Interactive Connection Highlighting | P2 | 📋 Planned |
| 13 | US-213 | Story Sequence Navigation | P2 | 📋 Planned |

**7/13 complete (54%)**

---

## M3 Gate — Remaining Blockers

M3 cannot begin until all P0/P1 M2.5 items are complete:

- [x] US-201, US-202 — 3D Visualization
- [x] US-206 — Story Extraction
- [x] US-207 — Emotion Intelligence
- [x] US-210 — Contextual Follow-Up
- [x] AI Communication Principles document
- [x] **US-205** — Depth-Driven Adaptive Insights (P1) ✅
- [ ] **US-208** — Life Area Zones (P1) ← next blocker

US-204, US-209, US-211, US-212, US-213 (all P2) may follow the M3 gate — not blockers.

---

## Next Recommended US

**US-208 — Life Area Zones — Emergent Clusters** (P1, FEATURE-019)

After ~15 stories, AI detects thematic clusters and suggests hover-only zone labels in the 3D sky. Stories in the same area spatially cluster. Zones render as nebula/cloud overlays (very low opacity, ambient motion, no sharp boundaries). No default zones. Labels only on hover. Zones fade and reorganize dynamically. No preset categories.

Run `/planning` → agent will propose US-208.

---

## Active Bugs

| ID | Description | Priority | Reported |
|----|-------------|----------|---------|
| BUG-001 | StarField tooltips too narrow — content gets clipped | Low | US-206 |
| BUG-003 | Follow-up questions using past storyContext feel like hallucinations — user has no transparency into why AI asks about past topics | Medium | US-210 |
| BUG-004 | New entry star not visually distinguished in 3D sky — feature request: most recent star should blink/pulse | Low | US-210 |

---

## Document Map

| Document | Purpose | Read by |
|----------|---------|---------|
| `STATUS.md` | **This file** — current sprint, next US, bugs | All agents on startup |
| `BACKLOG.md` | Active US details (📋 Planned only) | /planning, /docs |
| `BACKLOG_DONE.md` | Completed ✅ US archive — for reference only | /discover, /docs |
| `BACKLOG_FUTURE.md` | M3 and beyond — not current work | /discover |
| `docs/architecture.md` | System design, data model, component docs | /dev, /planning |
| `docs/requirements.md` | Functional requirements | /planning, /discover |
| `docs/test_cases.md` | Test strategy and all test cases | /qa |
| `CLAUDE.md` | Agent instructions, workflow rules, code standards | All agents |

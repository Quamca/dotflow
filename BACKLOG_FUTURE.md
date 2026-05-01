# Dotflow — Future Plans (M3 and Beyond)

> This file contains US that are **not current work** — M3 and deferred features.
> Do not plan or implement from this file until all M2.5 P0/P1 items are complete.
> Active work: [BACKLOG.md](BACKLOG.md) · Status: [STATUS.md](STATUS.md)

---

## 🔧 FEATURE-015: Security & Privacy Messaging

**Description:** Moved to M3. Privacy messaging for end users (registration/login flow, no API key required). Details to be defined in /discover session before M3 planning.
**Status:** ⏸️ Deferred to M3

---

# 📦 EPIC-003: Multi-User + Mobile

**Description:**
Extends Dotflow beyond a single-user personal tool to support multiple accounts and mobile usage. This epic enables Supabase Auth, Row Level Security, a backend proxy for the OpenAI API key (so users don't need their own), and a React Native mobile companion.

This is the productization epic — turning a personal tool into something shareable.

**Business Value:**
Unlocks the ability to share Dotflow with others, gather feedback from real users, and potentially monetize. Also unlocks mobile use case — writing entries on the go.

**Stakeholders:**
- Future early users / beta testers
- Quamca as product owner exploring wider release

**Success Metrics:**
- 3+ real users using the app for 2+ weeks
- Mobile app installs > 10

**Risks & Dependencies:**
- Requires backend server (breaks MVP's no-server architecture)
- Auth adds complexity and potential friction for new users
- React Native is a significant scope increase
- **BLOCKED:** Cannot start until all M2.5 P0/P1 US are complete (US-205, US-208)

**Scope Boundaries:**
- **In scope:** Supabase Auth, RLS, backend proxy for OpenAI, React Native app
- **Out of scope:** Payment/subscription, admin panel, social features

**Status:** 📋 Planned (Blocked)

---

## 🔧 FEATURE-009: Authentication

**Description:** Supabase Auth integration — email/password or magic link. Enables multi-user support.
**Status:** 📋 Planned (Blocked — M2.5 first)

---

## 🔧 FEATURE-010: Mobile Application

**Description:** React Native mobile companion with shared business logic from the web app.
**Status:** 📋 Planned (Blocked — M2.5 first)

---

## Future Research Items

- Add semantic search using pgvector (Supabase supports this)
- Add weekly reflection summary (cron job via Supabase Edge Functions)
- Before M3: lightweight review by a psychologist (recommended per AI communication principles doc)

---

*Future plans only. For active sprint see [BACKLOG.md](BACKLOG.md).*

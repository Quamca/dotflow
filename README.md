# Dotflow

> A journal that listens, asks, and connects the dots.

Dotflow is a personal reflection tool that turns your thoughts, events, and beliefs into connected entries. Write freely — Dotflow asks 2–3 follow-up questions to deepen your thinking, then quietly surfaces patterns and connections you may not have noticed.

---

## What It Does

- **Write** — free-form entry, like a diary
- **Reflect** — AI asks 2–3 targeted follow-up questions (emotions, thoughts, context)
- **Connect** — AI surfaces similar past entries: *"This reminds me of what you wrote 3 weeks ago..."*
- **Discover** — over time, patterns emerge: recurring emotions, beliefs, behavioral triggers

It is not a therapist. It does not give advice. It helps you understand yourself.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| AI | OpenAI GPT-4o-mini |
| Hosting | Vercel |

---

## Getting Started

See [docs/setup.md](docs/setup.md) for full setup instructions.

```powershell
git clone https://github.com/Quamca/dotflow.git
cd dotflow
npm install
cp .env.example .env
# fill in .env values
npm run dev
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/architecture.md](docs/architecture.md) | System architecture and data model |
| [docs/requirements.md](docs/requirements.md) | Functional and non-functional requirements |
| [docs/wireframes.md](docs/wireframes.md) | Screen flows and UI specifications |
| [docs/design_brief.md](docs/design_brief.md) | Visual identity and design system |
| [docs/setup.md](docs/setup.md) | Development environment setup |
| [docs/test_cases.md](docs/test_cases.md) | Test strategy and test cases |
| [docs/code_snippets.md](docs/code_snippets.md) | Reusable patterns discovered during development |
| [BACKLOG.md](BACKLOG.md) | Product backlog with all epics, features, user stories |
| [MULTI_AGENT_ARCHITECTURE.md](MULTI_AGENT_ARCHITECTURE.md) | Claude Code multi-agent workflow |

---

## Multi-Agent Workflow

This project uses Claude Code with specialized agents. See [MULTI_AGENT_ARCHITECTURE.md](MULTI_AGENT_ARCHITECTURE.md).

```
/pm → /planning → /dev → manual verify → /qa → /docs
```

---

## Latest

- v0.1.0 — US-001: React + Vite + TypeScript project initialized (Tailwind CSS, ESLint, Prettier, Vitest + RTL configured)

---

## Repository

https://github.com/Quamca/dotflow

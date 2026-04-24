# Inglés Hotelero

Hotel English training and placement for Latin American hospitality staff — web app + WhatsApp bot + HR dashboard.

**What this repo contains:** Session 1 (foundation) of the build sequence described in `.orcha/phase-1-foundation.md`. Next.js 14 + TypeScript + Tailwind + Supabase. Landing page, hotel-scoped exam entry, design system, full SQL schema.

---

## Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values (see SETUP.md)
cp .env.example .env.local

# 3. Run the dev server
npm run dev
```

Open http://localhost:3000 for the landing page.
Open http://localhost:3000/e/test-hotel for the exam entry preview (works without Supabase — stub mode).

---

## Scripts

| Command             | What it does                                 |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Next.js dev server on :3000                  |
| `npm run build`     | Production build                             |
| `npm start`         | Run the production build                     |
| `npm run typecheck` | Run TypeScript without emitting              |
| `npm run lint`      | Next.js ESLint rules                         |

---

## Project map

```
.
├── .orcha/                           ← project context for future Claude Code sessions
│   ├── vision.md                     ← why this exists
│   ├── architecture.md               ← stack + pipelines
│   ├── design-system.md              ← tokens, type scale, component rules
│   ├── phase-1-foundation.md         ← this session (✅ shipped)
│   ├── phase-2-exam-flow.md          ← next session
│   └── phase-{3..6}-*.md             ← remaining sessions
├── src/
│   ├── app/
│   │   ├── layout.tsx                ← root layout, font wiring
│   │   ├── page.tsx                  ← marketing landing
│   │   ├── not-found.tsx             ← 404
│   │   ├── globals.css               ← design tokens, font-face for New Spirit
│   │   └── e/[slug]/                 ← hotel-scoped exam entry
│   │       ├── page.tsx
│   │       └── entry-form.tsx
│   ├── components/
│   │   ├── brand/                    ← Logo, NumberedPlaceholder
│   │   └── ui/                       ← Button, Card, Input, HairlineRule
│   ├── content/
│   │   └── roles.ts                  ← three role modules + display copy
│   └── lib/
│       ├── cefr.ts                   ← level calculation (bible §4)
│       ├── utils.ts                  ← cn, slugify, formatIndex
│       └── supabase/                 ← browser, server, and service clients + types
├── supabase/
│   └── migrations/
│       └── 0001_initial_schema.sql   ← full DDL + RLS (bible §11)
├── public/
│   └── fonts/                        ← place New Spirit woff2 files here (see SETUP)
├── CLAUDE.md                         ← context for future Claude Code sessions
└── SETUP.md                          ← exact steps to provision services
```

---

## What's next

Phase 2 — the placement exam flow (bible §20, Session 2). Start a fresh Claude Code session and paste:

> Build the complete placement exam flow as a multi-step form with these pages: /e/[hotel-slug] (already scaffolded — extend to create exam_sessions), /exam/[id]/diagnostic (13 questions), /exam/[id]/listening (10 audio items), /exam/[id]/speaking (6 recording prompts), /exam/[id]/results. Save every answer to the database immediately. Support session resume via URL. Play MP3 files from /public/audio/. See .orcha/phase-2-exam-flow.md for the full spec.

See `CLAUDE.md` for additional conventions.

---

## License

All rights reserved — Diego Luján Studio, 2026. Typefaces (New Spirit by Sharp Type) are licensed separately; font files are not redistributed in this repository.

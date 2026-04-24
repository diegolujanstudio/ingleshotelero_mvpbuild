# Phase 2 — Placement Exam Flow

**Status:** 🟡 Not started
**Session prompt (bible §20, Session 2):** Build the complete placement exam flow.

## Scope
Multi-step exam experience tied to a property slug, saving every answer to the database immediately and supporting full session resume.

## Routes to build
- `/e/[slug]` → already stubbed in Phase 1. Extend: create `exam_sessions` row, redirect to `/exam/[id]/diagnostic`.
- `/exam/[id]/diagnostic` — 13 questions one-per-screen (source: `docs/Placement Exam - CUESTIONARIO DIAGNÓSTICO COMPLEMENTARIO.md`).
- `/exam/[id]/listening` — 10 audio items per role module, 2-replay limit.
- `/exam/[id]/speaking` — 6 prompts per role module, MediaRecorder with one re-record.
- `/exam/[id]/results` — immediate listening score + speaking "En evaluación" state.

## API routes
- `POST /api/exams` — create session.
- `POST /api/exams/[id]/answer` — persist diagnostic / listening answer by index (idempotent by `UNIQUE(session_id, question_index)`).
- `POST /api/recordings` — accept audio blob, store to Supabase Storage, create `speaking_recordings` row with `scoring_status='pending'`.
- `GET /api/exams/[id]` — full session state for resume.

## Content ingestion (one-time script)
- Parse the six exam `.md` files in `/sessions/upbeat-brave-ride/mnt/.projects/.../docs/` and seed `content_items` for `exam_type`. Build a `scripts/seed-exam-content.ts` that Diego runs once.
- Generate static TTS audio for all 30 listening items via OpenAI TTS → upload to `public/audio/exam/` once, commit to repo.

## Session resume requirements (bible §4)
- Session id in URL + localStorage.
- On every page load: fetch session, jump to `current_step`.
- On every answer: PATCH `current_step` server-side before returning success.
- Email + property combination resolves to an existing in-progress session if present.

## PWA / offline requirements (new in Phase 2)
Because the exam is where lost connectivity matters most, the service worker lands here, not in Phase 1.

- Service worker registered at `/sw.js` — use `next-pwa` or a hand-written one with Workbox.
- Precache the exam routes (`/exam/*`), the listening audio bundle, and the fonts.
- Runtime cache strategy: Network-first for session state, cache-first for audio.
- Offline answer queue: if a POST to `/api/exams/[id]/answer` or `/api/recordings` fails due to network, stash the payload in IndexedDB and replay on reconnect.
- Per-route viewport override for `/exam/*` layouts: `maximumScale: 1, userScalable: false` to feel native. (Root layout leaves zoom on for accessibility.)
- Install prompt — show after listening section completes, not on first load.

## Acceptance criteria
- [ ] An employee can start the exam, close the browser at any point, reopen the link on a different device, and resume at the exact question.
- [ ] Listening score is computed client-side AND server-side on submit, and matches.
- [ ] Speaking recordings upload with retry (3x, expo backoff), localStorage queue on final failure.
- [ ] Results screen loads in <500ms even before AI scoring completes.

# Inglés Hotelero — Employee PWA

**A Spanish-first Progressive Web App that helps hotel staff build functional English for guest-facing work.** Employees take a diagnostic, receive a CEFR level (A1–B2), and complete 5-minute daily drills (listening + speaking) tailored to their role (Botones, Recepción, Restaurante).

This repository is the **handoff package for Claude Code** to implement. Everything here is source-of-truth: the design system, the data model, the API contracts, and the screen-by-screen behavior.

---

## What exists already

| File | Purpose |
|---|---|
| `../Design System.html` | Full design system: color, type, spacing, components (open in browser). |
| `../Travel Components.html` | Extended visual vocabulary — stamps, boarding passes, keys, postcards. |
| `../Ingles Hotelero.html` | The hi-fi prototype — employee PWA + HR dashboard + WhatsApp thread. |
| `../fonts/` | **New Spirit** (OTF, weights 300/400/500/700) — licensed, must be bundled. |
| `spec/` | All implementation specs (this folder). |

**Read these first, in order:**

1. `spec/overview.md` — product summary, principles, flow map
2. `spec/data-model.md` — full Postgres schema + RLS
3. `spec/screens.md` — every PWA screen, component-by-component
4. `spec/ai-services.md` — how Claude, Whisper, ElevenLabs connect
5. `spec/offline-sync.md` — service worker and local-first strategy
6. `spec/design-tokens.md` — tokens to copy into Tailwind config

---

## Stack (locked)

- **Next.js 15** (App Router, RSC, TypeScript, Turbopack)
- **Tailwind CSS 3.4** + custom token config (see `spec/design-tokens.md`)
- **Supabase** — Postgres, Auth (phone OTP), Storage (audio), Edge Functions
- **Anthropic Claude** — conversational feedback, scenario generation, rubric-based scoring
- **OpenAI Whisper** — speech-to-text for speaking evaluation
- **ElevenLabs** — TTS for listening prompts (pre-generated + cached)
- **next-pwa** + **Workbox** — installability + offline-first service worker
- **Zustand** (client state) + **TanStack Query** (server state, with persistence)
- **Dexie** — IndexedDB wrapper for offline drill cache

---

## Scope of v1 (employee-facing only)

✅ **In scope**
- Phone + OTP onboarding with hotel code
- Role selection (Botones / Recepción / Restaurante)
- Diagnostic exam: 5 listening + 5 speaking prompts, adaptive difficulty
- CEFR level assignment (A1, A2, B1, B2)
- Daily drill home (streak, today's scenario, resume)
- Listening drill (audio + 3-option comprehension)
- Speaking drill (record → Whisper STT → Claude rubric → feedback)
- Progress "pasaporte" view (stamps for milestones)
- Full offline: today's drills + last 7 days of history work without network

❌ **Out of scope for v1** (deferred)
- HR dashboard (separate web app, later sprint)
- WhatsApp bot wiring (later — but DB/schema already accommodates it)
- Push notifications (scaffold only, no content yet)

---

## Getting set up

```bash
pnpm install
cp .env.example .env.local    # fill in keys — see below
supabase db push              # applies migrations from supabase/migrations/
pnpm dev
```

### Required env vars

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # server only

ANTHROPIC_API_KEY=               # server only — Claude Sonnet 4.5
OPENAI_API_KEY=                  # server only — Whisper
ELEVENLABS_API_KEY=              # server only

# optional but recommended
UPSTASH_REDIS_REST_URL=          # rate-limit speaking endpoint
UPSTASH_REDIS_REST_TOKEN=
```

**Never** expose `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, or `ELEVENLABS_API_KEY` to the client. All AI calls go through Next route handlers in `app/api/` or Supabase Edge Functions.

---

## Design principles (non-negotiable)

1. **Respect, not condescension** — the employee is a professional, not a student. No emoji confetti, no caricatures.
2. **Editorial, not app** — generous whitespace, hairline dividers, serif headlines. Avoid dashboard-SaaS tropes.
3. **One note of accent** — ink blue `#2E4761` is the *only* accent color. Use it sparingly — one moment per screen.
4. **Travel as metaphor** — passes, stamps, keys, postcards give the app warmth. See `../Travel Components.html`.

The full design system lives in `../Design System.html`. **Do not deviate.** If a component is missing, compose it from existing tokens — do not introduce new ones.

---

## What "done" looks like

A hotel employee can:
1. Open `ingleshotelero.app` on any phone, install as PWA
2. Enter hotel code + phone → receive OTP → sign in
3. Pick role → complete diagnostic → receive CEFR level
4. Return daily for a 3–5 minute drill, streak tracked
5. See their "pasaporte" fill with stamps over weeks
6. Use the app with zero bars — today's work is already cached

Everything else is polish. Ship this loop first.

---

## Support

- Design decisions: Diego Luján (@diegolujanstudio)
- Technical questions: see inline comments in `spec/` — each doc notes unresolved questions at the bottom

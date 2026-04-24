# CLAUDE.md

Persistent context for Claude Code (and other agentic coding tools) working on Inglés Hotelero. Read this first in every new session.

---

## What Inglés Hotelero is

Hotel English training/placement for Latin American hospitality staff. Three role modules (bellboy, front desk, restaurant/bar). Placement exam ($50/employee) is the wedge; monthly training subscriptions ($150–$500/property) are the expand. Primary channels: web app + WhatsApp.

Full product bible: none in the repo — Diego holds it. Distilled into `.orcha/vision.md` and `.orcha/architecture.md`.

---

## Build sequence

- **Phase 1 — Foundation.** ✅ Shipped 2026-04-17. See `.orcha/phase-1-foundation.md`.
- **Phase 2 — Exam flow.** ✅ Demo-ready. Diagnostic + listening + speaking + results, with session resume and MediaRecorder.
- **Phase 3 — AI scoring.** ✅ Demo-ready. Real Whisper + Claude when keys set; deterministic mock fallback when not.
- **Phase 4 — HR dashboard.** ✅ Demo-ready. Login (real + demo bypass), overview, employees table, detail page, reports with PDF + CSV export.
- **Phase 5 — WhatsApp.** 🟡 Demo simulator at `/demo/conversacion` is done; real Twilio webhook is scaffolded at `/api/whatsapp/incoming` — full conversation state machine is post-MVP.
- **Phase 6 — Multi-property + billing.** 🟡 `/precios` page done with Stripe Payment Link env vars. Webhook + subscription enforcement + org hierarchy are post-MVP.

**Demo-ready posture.** The whole product flows end-to-end for a prospect demo even without Supabase/OpenAI/Anthropic credentials. See `DEMO-RUNBOOK.md` for the click-by-click pitch script.

**Production hardening that remains** (post-pilot):
- Service worker + offline answer queue (`.orcha/phase-2-exam-flow.md`)
- Real WhatsApp conversation state machine + Meta template approvals
- Stripe webhook handling + subscription enforcement via middleware
- Cohort management UI
- Email digests via Resend
- Multi-property org hierarchy + chain admin views

---

## Design system (non-negotiable)

Diego shipped **Design System v0.1** — full reference at `.orcha/design-system.md` (plus visual HTML artifact at `.orcha/design-system-reference.html`). Three principles:

1. **Respeto, no condescendencia.** Professional tone, never infantilizing.
2. **Editorial, no aplicación.** Publication, not SaaS dashboard.
3. **Una sola nota de color.** Ink blue (`#2E4761`) is the ONLY accent. Terracotta/forest/ochre were rejected.

Key tokens:

- **Fonts:** New Spirit (weights 300/400/500/700, no italics, no 600) + Plus Jakarta Sans + JetBrains Mono (10px uppercase 0.2em tracking for `.caps`).
- **Surfaces:** ivory `#F5F0E6` base, ivory-soft `#EFE7D6`, ivory-deep `#EBE4D4`, hair `#D9CEB9`, white for cards/inputs.
- **Text:** espresso `#2B1D14`, espresso-soft `#4A3426`, espresso-muted `#7A6352`.
- **Accent (single):** ink `#2E4761`, ink-deep, ink-soft, ink-tint.
- **Semantic:** success `#3E6D4D`, warn `#B38540`, error `#A84738` — states only, never decoration.
- **Signature:** `em` and `i` are redefined globally as non-italic, medium-weight, ink-colored. Every `<em>` is the accent.
- **Primary button:** espresso bg, ivory text. **Accent button:** ink bg, white text. **Text button:** ink underline on hover.
- **Cards:** white bg, 10px radius, 1px hair border. No drop shadows ever.
- **Never:** emoji in production UI. Terracotta/forest/ochre. Bright gradients. Bounce animations. Drop shadows.

---

## Conventions

### Code
- **Next.js 14 App Router.** Server Components by default; add `"use client"` only when needed.
- **Imports use the `@/` alias** → `src/`. Never use relative deep paths like `../../../lib/...`.
- **Types live next to data.** Database types in `src/lib/supabase/types.ts`. Domain enums (`CEFRLevel`, `RoleModule`, `Shift`) are re-exported from there — do not duplicate.
- **Spanish copy belongs in `src/content/`** (currently `roles.ts`). Do not scatter Spanish strings throughout components.
- **`cn()` and `formatIndex()`** live in `@/lib/utils`. Use them.
- **CEFR math** lives in `@/lib/cefr`. Do not re-implement scoring bucketing anywhere else.

### Supabase
- **Browser Client Components** → `createClient()` from `@/lib/supabase/client`.
- **Server Components / Route Handlers / Server Actions** → `createServerClient()` from `@/lib/supabase/server`.
- **Privileged server-only jobs** (scoring, cron, webhooks) → `createServiceClient()`. Never import into anything reachable from the browser.
- **RLS is the access-control model.** Server routes that bypass RLS must validate ownership explicitly before responding.

### Exam flow (once Phase 2 is built)
- **Every answer persists before navigation.** Session resume is load-bearing — see `.orcha/phase-2-exam-flow.md` for the contract.
- **Idempotency keys** are `(session_id, question_index)` for diagnostic/listening, `(session_id, prompt_index)` for speaking.
- **Voice recordings retry** 3× with exponential backoff → localStorage fallback → resume on reconnect. Never show the user "upload failed."

### Scoring (Phase 3)
- **Use the rubric verbatim** from `.orcha/phase-3-ai-scoring.md`. Do not soften calibration ("for A1-A2 be GENEROUS, never 0 if they attempted English").
- **Return JSON only** — validate strictly, fail closed.
- **Multi-pass for borderline cases** (within 5 points of a level boundary). Take the lower if the two passes disagree.

---

## What's done

**Foundation (Phase 1):**
- Next.js 14 + TS + Tailwind scaffold; full SQL schema + RLS + storage buckets; Supabase browser/server/service clients.
- Editorial design system: Plus Jakarta Sans + JetBrains Mono (`next/font/google`) + New Spirit OTF in `public/fonts/`. Tokens in `tailwind.config.ts`, `em`/`i` globally ink.
- Primitives: `Button` (primary/accent/ghost/text), `Card` + subcomponents, `Input`, `Badge` + `LevelBadge`, `HairlineRule`, `NumberedPlaceholder`, `Logo`.
- PWA baseline: `src/app/manifest.ts` + dynamic `icon.tsx` + `apple-icon.tsx`.
- Landing at `/`, hotel entry at `/e/[slug]`, 404, `/precios`.

**Exam flow (Phase 2):**
- Routes: `/exam/[id]/{diagnostic,listening,speaking,results}` with shared layout + `ProgressHeader`.
- Diagnostic (13 Qs one per screen), listening (10 items with browser SpeechSynthesis audio), speaking (MediaRecorder with 45s cap and one regrab).
- Session state: localStorage + best-effort DB sync via `/api/exams/*`. Resume works across refresh and tab close.
- Content seeded in `src/content/exam.ts` — bellboy, front desk, restaurant each with 10 listening + 6 speaking prompts.

**Scoring (Phase 3):**
- `/api/score-speaking` handles both real path (Whisper + Claude with rubric verbatim from bible §6) and a deterministic mock path when keys aren't configured.
- Results page polls local session + dispatches scoring for any still-pending recordings.

**HR dashboard (Phase 4):**
- `/hr/login` with Supabase Auth OR demo bypass ("Entrar en modo demo").
- `/hr` overview, `/hr/employees` filterable table, `/hr/employees/[id]` full detail with transcripts + recommendations, `/hr/reports` executive summary.
- Live exam sessions merge with 12 seeded demo employees so the dashboard looks populated in pitches.
- PDF export via browser print with a dedicated `@media print` stylesheet; CSV export via client-side blob.

**WhatsApp (Phase 5, demo-only):**
- `/demo/conversacion` — interactive WhatsApp-styled simulator of the full daily drill. Prospect-facing; used in pitches.
- `/api/whatsapp/incoming` — Twilio-compatible webhook scaffold that echoes a TwiML ack. Not wired to a conversation state machine yet.

**Billing (Phase 6, demo-only):**
- `/precios` — three-tier pricing (Inicial $150, Profesional $300, Empresarial from $500) + FAQ + pilot CTA. Stripe Payment Links via env vars with a fallback to the pilot mailto.

## What's NOT production-ready yet (post-MVP hardening)

- Service worker + IndexedDB-backed offline answer queue for the exam flow.
- Real WhatsApp conversation state machine + streak DB writes + Meta template message approvals.
- Stripe webhook (`invoice.paid`, `subscription.updated`) + subscription enforcement via middleware.
- Org-level admin dashboards (for chains) + cohort management UI.
- Weekly Monday-morning digest emails via Resend.
- Pre-generated OpenAI TTS audio files for listening items (currently uses browser SpeechSynthesis — fine for demos, should be real audio for production).
- Real HR auth flow end-to-end (currently demo bypass + scaffolded Supabase auth; needs invite emails, password resets, role provisioning).

If you're asked to do something that belongs to a later phase, confirm with the user before building — the sequencing exists for a reason.

---

## Working rules

1. **Read `.orcha/phase-N-*.md` before starting Phase N.** The acceptance criteria are how we'll know it's done.
2. **Preserve the sessions.** Do not retroactively rewrite Phase 1 files unless fixing a clear bug. Additive changes are fine.
3. **Respect the design system.** If a requirement seems to push against the tokens, ask before introducing new colors or fonts.
4. **Spanish is primary.** UI copy defaults to Spanish (Mexico). English only for source code and comments.
5. **Commit after every task.** Small, atomic commits keep the phase plan's checklist trackable.

# Inglés Hotelero — Build Brief for Claude Code

**Last updated:** 6 May 2026
**Status of this repo:** Phase 1–7 partial. Demo-mode functional. Real auth, real
backend, real PWA, payments, WhatsApp delivery — all pending.

> Read this file first in every new Claude Code session. Don't re-litigate the
> architectural decisions; they're locked. Pick the next unchecked phase, plan
> it, then execute it. Commit after each meaningful chunk.

---

## 0. The mission, in one paragraph

We are building **the** workforce English platform for Latin American
hospitality. The wedge is a $50/employee placement exam scoped to a hotel role
(Recepción / Botones / Restaurante). The expand is a $150–$500/month
per-property training subscription delivered as a PWA + WhatsApp daily drill.
We are NOT a Duolingo competitor, NOT a generic LMS, NOT a translation tool.
We are a measurable, role-specific, hotel-staff training tool with HR-grade
reporting.

The product MUST work on a five-year-old Android phone over hotel wifi while
the employee is on break. The HR dashboard MUST produce a PDF a GM signs off
on. Anything else is YAGNI.

---

## 1. What's already shipped (don't rebuild)

Routes that exist and work in demo mode:

- `/` — product entry (NOT marketing — marketing lives on Astro at
  ingleshotelero.com, separate repo).
- `/aviso-de-privacidad` — LFPDPPP-compliant draft (v1.0). Pending lawyer review.
- `/terminos` — terms draft (v1.0). Pending lawyer review.
- `/pitch` — interactive 20-slide sales deck (`noindex`, share by URL).
- `/e/[slug]` — hotel-scoped exam entry (form: name/email/phone/role/consent).
- `/exam/[id]/{diagnostic,listening,speaking,results}` — full exam flow,
  session resume, MediaRecorder, browser SpeechSynthesis for listening audio.
- `/hr/login` → `/hr` → `/hr/employees` → `/hr/employees/[id]` → `/hr/reports`
  → `/hr/accept-invite` — HR dashboard with demo bypass.
- `/demo/conversacion` — interactive WhatsApp simulator (sales tool).
- `/precios` — three-tier pricing page (Stripe Payment Link env vars).
- `/practice` — V0 daily-drill scaffold (listening + reinforce + vocab,
  localStorage streak). Real loop is Phase D below.
- `/api/exams/*` — exam create / read / answer / finalize (writes to Supabase
  when configured, falls back to localStorage).
- `/api/score-speaking` — Whisper + Claude scoring with deterministic mock.
- `/api/whatsapp/incoming` — Twilio TwiML scaffold.
- `/api/hr/{invite,activate}` — Phase 7 invite/activate scaffolding.

Foundation:

- Next.js 14 App Router + TypeScript + Tailwind, deployed via Netlify.
- Editorial design system v0.1 (`.orcha/design-system.md`): New Spirit serif +
  Plus Jakarta Sans + JetBrains Mono. Ivory/espresso/hair surfaces. Single ink
  accent — `<em>` is globally non-italic, weight 500, ink-blue. NO terracotta,
  forest, or ochre. NO drop shadows.
- Supabase migration 0001 (organizations, properties, hr_users, employees,
  exam_sessions, diagnostic/listening/speaking answers, RLS scaffolds).
- PWA manifest + dynamic icons (NewSpirit "IH" monogram).
- Service role / browser / server Supabase client wrappers.

**This list is the floor, not the ceiling. Don't undo it. Add to it.**

---

## 2. Architectural decisions — LOCKED

Don't ask to revisit. If you think one is wrong, write a one-page memo
arguing why before changing anything.

| Decision | Locked value | Why |
|---|---|---|
| Framework | Next.js 14 App Router | Already built |
| Database | Supabase (Postgres + Storage + Auth) | Single vendor, RLS-native |
| Region | `us-east-1` | Mexico latency |
| AI: STT | OpenAI Whisper | Best accent handling, $0.006/min |
| AI: scoring | Anthropic Claude (sonnet-4-6) | Already integrated, JSON-strict |
| AI: TTS | OpenAI tts-1-hd, voice "nova" | Quality trumps cost at this scale |
| Email | Resend | Sender reputation, simple API |
| Payments | Stripe | Industry default, Mexican CFDI support |
| WhatsApp | Twilio Business API | Approval cycle started? **CHECK** |
| Hosting | Netlify | Already deployed |
| Locale | `es-MX` only at launch | Generalize when Costa Rica asks |
| Currency | USD billing, MXN displayed in marketing | Stripe simplicity |
| Multi-tenancy | RLS on every table, org → property → employee | Brief §10 |
| Auth model | HR users only have auth accounts (Supabase Auth); employees do not | Employees access via hotel-scoped URLs only |
| Tenant resolution | `auth_user_property_ids()` SQL helper | Single source of truth for RLS |
| Privacy law | LFPDPPP (Mexico) | Required before first paid pilot |
| Data retention | Voice = 6 months; transcripts = subscription + 1yr; PII = subscription + 1yr | LFPDPPP minimum |
| Demo mode | Env-gated `NEXT_PUBLIC_DEMO_MODE=true` AND hostname-gated to `demo.ingleshotelero.com` | Belt-and-suspenders so demo data CANNOT leak to production |
| Department-level HR scoping | NO. Property is the minimum unit. | YAGNI; additive `department_scope` column ready for future |
| Employee-exam linking | Auto-upsert by `(property_id, LOWER(TRIM(email)))` where email is non-null; new row when email missing | Reduces onboarding friction |
| Schema additions | `employees.source` enum (`self_registered` / `hr_invited` / `csv_imported`) | Roster ownership without migration churn |

---

## 3. What DIEGO needs to provide before any phase below ships to production

Claude Code can write code without these. But the live product requires them.
Diego does each ONCE. Provide the keys and Claude Code does the rest.

### 3.1 Supabase

1. Create account at https://supabase.com
2. Create project: name `ingleshotelero-prod`, region `us-east-1`,
   strong DB password (save in 1Password/Bitwarden).
3. From the project dashboard, copy these values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ server-only
4. In SQL Editor, run `supabase/migrations/0001_initial_schema.sql` (already
   in repo). Migrations 0002–0005 will be added by Claude Code in Phases A–E.
5. In Storage, create three buckets (private, signed URL access only):
   - `recordings` — exam voice notes (90-day expiry policy)
   - `audio-assets` — pre-generated TTS for listening items + model responses
   - `reports` — generated PDFs (7-day signed URL expiry)
6. In Authentication → Email Templates, customize the "Magic Link" template
   in formal Spanish. Subject: "Acceso a su dashboard de Inglés Hotelero".

**Cost:** Pro plan $25/mo recommended once Phase A ships. Free tier works for
the first 50 employees and 500MB of recordings.

### 3.2 OpenAI

1. Account at https://platform.openai.com
2. Add billing (set a $50/mo cap initially — usage alerts at $25).
3. Create API key → `OPENAI_API_KEY`
4. **Why we need it:** Whisper (transcription, ~$0.006/min) + TTS (audio
   generation for listening items, one-time ~$30 for the full inventory).

### 3.3 Anthropic

1. Account at https://console.anthropic.com
2. Add billing (cap $50/mo initially).
3. Create API key → `ANTHROPIC_API_KEY`
4. **Why we need it:** Claude Sonnet 4-6 for the speaking-rubric scoring and
   weekly content generation. ~$0.02 per scored recording.

### 3.4 Resend

1. Account at https://resend.com
2. Verify a domain (`ingleshotelero.com`). Add the SPF, DKIM, DMARC records
   that Resend gives you to your DNS provider.
3. API key → `RESEND_API_KEY`
4. From email → `RESEND_FROM_EMAIL=hola@ingleshotelero.com`
5. **Why we need it:** HR invite emails, password reset, weekly digest, lead
   notifications.

### 3.5 Twilio (WhatsApp Business API)

⚠️ **Apply IMMEDIATELY** — approval takes 1–3 weeks. Do this even if
Phase E is months away.

1. Account at https://twilio.com
2. Apply for WhatsApp Business API access.
3. Submit Meta Business Manager verification (need legal entity name, tax ID,
   physical address, website — `ingleshotelero.com`).
4. Submit display name "Inglés Hotelero" for approval.
5. Pre-submit these 5 message templates (each takes 24–72h):
   - `daily_drill_invite` — `"Buenos días, {{1}}. Su práctica de hoy está lista."`
   - `weekly_summary` — `"Resumen semanal: {{1}} días de racha, nivel {{2}}, {{3}}% de avance."`
   - `streak_at_risk` — `"Su racha de {{1}} días termina hoy. Solo 5 minutos."`
   - `exam_invite` — `"Hola {{1}}, {{2}} le invita a tomar el examen. Toque: {{3}}"`
   - `results_ready` — `"Sus resultados están listos: nivel {{1}}. Vea su plan en {{2}}"`
6. Once approved, save → `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`,
   `TWILIO_WHATSAPP_NUMBER`.

### 3.6 Stripe

1. Account at https://stripe.com
2. Activate your account (needs Mexican RFC for CFDI invoicing).
3. Create products in Stripe dashboard:
   - "Examen de Colocación" — $50 USD, one-time, quantity-based
   - "Suscripción Inicial" — $150 USD/mo, recurring
   - "Suscripción Profesional" — $300 USD/mo, recurring
   - "Suscripción Empresarial" — $500 USD/mo + custom (manual quote)
4. Save: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
5. Configure webhook endpoint at `https://ingleshotelero.netlify.app/api/billing/webhook`
   listening for: `checkout.session.completed`, `invoice.paid`,
   `invoice.payment_failed`, `customer.subscription.deleted`.

### 3.7 Sentry (observability)

1. Account at https://sentry.io
2. Create Next.js project → `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
3. **Why:** No production app should ship without crash reporting. Filter PII
   in the SDK config — never send transcripts or employee names.

### 3.8 Cloudflare DNS (already done — verify)

`ingleshotelero.com` → Astro marketing site (cheerful-brioche-4dfe7f Netlify
project). MVP product → `ingleshotelero.netlify.app` (this repo).

If/when you want a clean product domain (e.g. `app.ingleshotelero.com`),
add a CNAME from `app` → `ingleshotelero.netlify.app` and configure in
Netlify's domain settings.

### 3.9 Legal review

Before signing first paid hotel contract:

1. Mexican attorney specializing in privacy/commercial law ($500–$1,500 USD).
2. Review `/aviso-de-privacidad` and `/terminos` v1.0 — both are working
   drafts that NEED legal certification.
3. Standard hotel SaaS contract template (one page, in Spanish).

### 3.10 Environment variables — final list

Set ALL of these in Netlify → Site configuration → Environment variables.
Vercel-style naming, three environments: development, preview, production.

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY

# AI
OPENAI_API_KEY
ANTHROPIC_API_KEY

# Email
RESEND_API_KEY
RESEND_FROM_EMAIL=hola@ingleshotelero.com

# WhatsApp (when approved)
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_NUMBER

# Billing
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Observability
SENTRY_DSN
SENTRY_AUTH_TOKEN

# App
NEXT_PUBLIC_APP_URL=https://ingleshotelero.netlify.app
INTERNAL_API_TOKEN=<random 32-byte hex>
NEXT_PUBLIC_DEMO_MODE=false   # production. Only true on demo. subdomain.
```

---

## 4. The build sequence — Phases A through G

Execute in order. Do not start Phase C until B passes its definition of done.
Commit small, push often.

### Phase A — Real Supabase backend + RLS audit (3–4 days)

**Deliverable:** every existing route writes to and reads from Supabase
(when configured). Localstorage fallback only kicks in when the env vars are
unset (true demo mode).

1. Migration `0002_exam.sql`: tables already defined in `.orcha/architecture.md`
   §11. Confirm shape, add missing indexes for the queries you'll actually run.
2. Migration `0003_practice_cohort.sql`: practice_sessions, vocabulary_progress,
   streaks, cohorts, cohort_members.
3. Migration `0004_content_analytics.sql`: content_items, analytics_events.
4. Migration `0005_leads.sql`: lead capture (already referenced in
   `/api/contacto` route — note: this route lives on the Astro marketing site
   in production, but if any contact intake stays here, the table exists).
5. Helper SQL function `auth_user_property_ids()` returns the property_ids the
   current `auth.uid()` can access. Used in every RLS policy.
6. RLS audit script: for each table, run a SELECT as a different org's HR user.
   Any row leak fails the build. Add to CI.
7. Wire `/api/exams/*` and `/api/score-speaking` to use `createServiceClient()`
   for writes; fall through to localStorage only when env vars are missing.
8. Generate `lib/supabase/types.ts` via `supabase gen types typescript`. Commit.

**Definition of done:**
- An employee can complete an exam end-to-end and the data is in Supabase.
- The HR dashboard shows real employees from the DB (not the seeded mock).
- RLS audit passes — no cross-property leaks.

### Phase B — Real HR auth + invite flow (2–3 days)

1. Strip the demo-bypass button from `/hr/login` in production builds (env-gate it).
2. Implement Supabase Auth magic link flow.
3. `/api/hr/invite` — super-admin invites org-admin or property-admin via
   `auth.admin.inviteUserByEmail()` and creates the matching `hr_users` row in
   the same transaction.
4. `/hr/accept-invite/page.tsx` — already exists; wire it to actually consume
   the token.
5. Middleware: protect `/hr/*` and `/api/hr/*` routes; redirect to `/hr/login`
   if no valid session.
6. Forgot-password reset flow.
7. Settings page: HR user can rotate their password, see pending invites.

**Definition of done:**
- A super-admin can invite a property admin and that admin can sign in.
- A different hotel's admin cannot, via any URL manipulation, see another
  hotel's data.
- Demo bypass is unreachable on the production domain.

### Phase C — Production-grade PWA (2 days)

1. Install `@ducanh2912/next-pwa` + Workbox 7.
2. Service worker precaches `/exam/*`, `/practice`, fonts, and listening audio.
3. IndexedDB queue (Dexie) for exam answers and recording uploads — replays on
   reconnect.
4. Per-route viewport tightening on `/exam/*` and `/practice/*` (lock zoom).
5. Install prompt fires after the user finishes the listening section of the
   exam (NOT on landing — it's manipulative there and converts worse).
6. Lighthouse PWA score ≥ 90.
7. iOS Safari MediaRecorder mime-type detection (webm fallback to mp4 for older
   versions).

**Definition of done:**
- Disconnecting wifi mid-exam does not lose answers; they replay on reconnect.
- The site is installable as an app on iOS and Android home screens.
- Lighthouse PWA score ≥ 90 in production build.

### Phase D — Daily practice loop (3–4 days)

V0 lives in `/practice/*` already. Replace it with the real loop.

1. Migration `0006_drill_history.sql`: drill_history (employee, drill_id,
   completed_at, listening_correct boolean, vocab_known integer).
2. Spaced repetition: vocabulary_progress (SM-2 algorithm — see brief §5.2).
3. Daily drill picker: prefer same-level drills, rotate by date, weight by
   weak areas from the most recent assessment.
4. Speaking step (V1 deferred — add MediaRecorder back, score via the same
   `/api/score-speaking` pipeline as the exam, but with `practice` recording
   type).
5. Streak ticks tied to drill COMPLETION, not just visiting `/practice`.
6. Real audio for listening items via pre-generated OpenAI TTS (script:
   `scripts/generate-drill-audio.ts`). Browser SpeechSynthesis stays as a
   fallback when audio asset missing.

**Definition of done:**
- An employee who completed the exam yesterday can come back to `/practice`
  today and get a drill at their level.
- Their streak increments correctly across day boundaries.
- 90 days of distinct drills exist per role × level (270 minimum).

### Phase E — Real WhatsApp delivery (3–4 days code + 1–3 wks Meta approval)

Twilio approval IS the calendar bottleneck. Diego, see §3.5 above — apply now
even if Claude Code isn't ready.

1. Migration `0007_whatsapp.sql`: whatsapp_conversations (employee, state,
   current_drill_id, last_inbound_at, last_outbound_at).
2. Webhook `/api/whatsapp/incoming` — already scaffolded; wire to a real state
   machine.
3. State handlers in `lib/whatsapp/states/`: idle, listening_drill,
   speaking_drill, review.
4. Cron `/api/cron/send-drills` — every 15 minutes, send the day's drill via
   the approved template to opted-in employees whose preferred_send_time
   matches the current 15-min window in their property's TZ.
5. Voice note scoring: download from Twilio URL, store in `recordings` bucket,
   call `scoreRecording()` from Phase A.
6. Streak DB writes (replace localStorage with server-side source of truth).

**Definition of done:**
- An employee receives a daily drill at the scheduled time.
- Sending a voice note returns AI-graded feedback within 30 seconds.
- Twilio webhook signature verification rejects forged requests.

### Phase F — Stripe billing (2 days)

1. `/hr/billing` page — show current plan, payment history, upcoming invoice.
2. `/api/billing/checkout` — creates Stripe Checkout session; on success the
   webhook updates `organizations.subscription_tier` and `subscription_status`.
3. `/api/billing/webhook` — handle the four event types from §3.6.
4. Middleware: when `subscription_status === 'past_due'` or `'canceled'`,
   show a banner; after 14-day grace, block exam creation and dashboard
   read-only.
5. Per-employee exam billing: separate `exam_credits` flow for the $50/employee
   placement exam wedge.
6. Mexican CFDI invoicing — trigger via Stripe metadata when invoice is paid.

**Definition of done:**
- An org admin can complete Stripe Checkout and the plan upgrades within 30s
  via webhook.
- A failed payment triggers an email to the billing contact.
- An org cannot exceed `max_employees` for their tier.

### Phase G — Reports + email digests (2 days)

1. PDF generator using `jspdf` + `jspdf-autotable`. Five-page report per the
   brief §8 — cover, executive summary, level distribution, employees table,
   methodology. Brand-locked colors, em-styled em phrases.
2. Excel export via SheetJS — three tabs: Empleados, Evaluaciones, Cohortes.
3. Cron `/api/cron/weekly-digest` — Monday 8 AM in property timezone, summary
   email via Resend.
4. PDF stored in `reports` bucket with 7-day signed URL.

**Definition of done:**
- Generating a PDF for 50 employees takes < 10s.
- Excel opens cleanly in Excel and Google Sheets.
- Weekly digest sends successfully to test properties.

---

## 5. Cross-cutting requirements (must thread through every phase)

### Testing
- Unit (Vitest): scoring rubric, level computation, streak math, retry logic.
- Integration (Vitest + Supabase test DB): every POST endpoint with one happy
  + one failure case.
- E2E (Playwright): one full registration → exam → results flow on every
  deploy to staging.
- RLS audit script in CI.

### Observability
- Sentry on every API route.
- Structured logging (pino) — emit JSON, ingest in Vercel/Netlify logs.
- Custom analytics events for: exam_started, exam_completed, recording_scored,
  drill_sent, drill_completed.
- Slack alerts (manual at first, automated at 50+ hotels):
  - Exam abandonment > 30% rolling 24h
  - Scoring queue > 100 pending items
  - 5xx on `/api/exams/*`
  - WhatsApp template send failure > 5%

### Security
- RLS audit before every release.
- Zod input validation on every API route.
- Rate limiting (Upstash Redis): 30/min per IP on public, 10/min on `/api/exams`,
  5/min on `/api/whatsapp/incoming`.
- Audio storage: private bucket, signed URLs with 1h (HR) / 4h (active exam)
  expiry.
- Quarterly key rotation; document in `docs/RUNBOOKS.md`.

### Privacy (LFPDPPP — non-negotiable for paid pilots)
- Privacy notice version tracked per consent (already in
  `/aviso-de-privacidad/page.tsx` as `PRIVACY_VERSION`).
- Voice recordings auto-deleted at 6 months via cron.
- ARCO rights: dashboard button to export or delete an employee's data.

### Backups
- Supabase Pro daily backups (built-in).
- Weekly logical dumps to Cloudflare R2 (90-day retention).
- Quarterly restore drill — actually restore to a test environment.

---

## 6. What NOT to build (YAGNI guardrail)

Reread this list every Monday. Each item burns weeks if you let it in.

- Native mobile apps (iOS/Android). PWA is enough until 5,000+ users.
- Live multiplayer / group classes.
- Custom voice cloning per hotel.
- AI tutor chat beyond scoring + feedback.
- Translation tool.
- Gamification beyond streaks + milestones.
- Second language. ONE language until the wedge is proven.
- Hotel-built custom content. Locked content is a feature for v1.
- Public APIs.
- AI-on-the-dashboard ("ask the dashboard a question").
- Anything that doesn't directly close a hotel, keep a hotel, or measure progress.

If you find yourself building something not on this list, stop and ask which
of those three things it serves. If you can't answer in one sentence, don't
build it.

---

## 7. Definition of "ready to charge real money"

Before signing a paid pilot, EVERY box checked:

**Product**
- [ ] Phase A, B, C complete (auth, RLS, real backend, PWA)
- [ ] Phase D shipping daily drills
- [ ] E2E test passes on Chrome desktop, Safari iOS, Chrome Android
- [ ] Calibration set drift < 10% across 50 gold-standard recordings
- [ ] PDF report renders cleanly on iPad and Windows laptop
- [ ] Privacy notice + ToS reviewed by Mexican lawyer
- [ ] LFPDPPP consent flow live and audited

**Operations**
- [ ] Supabase Pro plan with backups
- [ ] Weekly logical backups to R2 with tested restore
- [ ] Sentry alerts wired
- [ ] Health metrics dashboard exists (Notion is fine)
- [ ] On-call playbook in `docs/RUNBOOKS.md`
- [ ] Customer support email with 24h SLA

**Business**
- [ ] Pricing in Stripe matches website matches contract
- [ ] First contract template lawyer-reviewed
- [ ] Customer onboarding deck rehearsed
- [ ] Can produce 90-day cohort report from a real test hotel
- [ ] One reference hotel willing to take a prospect call

---

## 8. How to use this brief in a Claude Code session

Paste this at the start of a new session:

> Read `docs/CLAUDE-BRIEF.md`. Then read `.orcha/architecture.md` and the most
> recent `.orcha/phase-*.md`. Tell me the next unchecked phase, the three
> hardest open questions for that phase, and an estimated time. Don't write
> code until I confirm the phase and answer the questions.

Claude Code returns three things. You answer the questions. Claude Code writes
the migration + plan + code, commits each chunk separately, opens a PR-style
commit summary at the end.

You merge. Netlify auto-deploys. You move to the next phase.

---

## 9. Repo conventions that don't change

- Spanish copy lives in `src/content/*.ts`. NEVER hardcode Spanish strings in
  components.
- Domain types (`CEFRLevel`, `RoleModule`) live in `src/lib/supabase/types.ts`.
  Don't duplicate.
- `cn()` and `formatIndex()` live in `@/lib/utils`. Use them.
- Server-only files start with `import "server-only"`. Tripwire for accidental
  client bundling.
- `<em>` is restyled globally to ink-blue, weight 500, non-italic. Use it
  sparingly for emphasis.
- New Spirit + Plus Jakarta Sans + JetBrains Mono. NO terracotta, forest, or
  ochre. NO drop shadows. White cards on ivory. 10px border radius.
- Commit per task. Commit message: `[Phase X] What changed (≤72 chars)`.

---

## 10. Contact

**Diego Luján** — founder, only developer.
hola@ingleshotelero.com · diegolujanstudio.com

If something in this brief contradicts your sense of the right move, write a
one-page memo and put it in `.orcha/proposed-change-NNN.md`. Diego reviews. We
update the brief.

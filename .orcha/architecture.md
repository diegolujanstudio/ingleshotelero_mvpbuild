# Architecture — Inglés Hotelero

## Stack decisions
- **Framework:** Next.js 14 (App Router) + TypeScript + React Server Components where possible.
- **Styling:** Tailwind CSS with custom theme tokens + CSS variables. No component libraries (shadcn/ui etc.) in v1 — the design is custom editorial and we keep control.
- **Database + auth + storage:** Supabase (Postgres + Auth + Storage). Row-level security enforces multi-tenant isolation.
- **Transcription:** OpenAI Whisper API (~$0.006/minute).
- **Scoring + content generation:** Anthropic Claude API (~$0.01–0.02/evaluation).
- **TTS:** OpenAI TTS (voices: `nova`, `shimmer`, speed 0.85–0.95).
- **Messaging:** Twilio WhatsApp Business API (Session 5+).
- **Payments:** Stripe subscriptions (Session 6+).
- **Email:** Resend (transactional).
- **Hosting:** Vercel (Edge/Node runtimes per route).

## Three clients, one backend
1. **Employee web app (PWA)** — `/e/[slug]` entry → exam, daily practice, progress.
2. **HR dashboard** — `/hr/*` — cohorts, employee tables, PDF/Excel exports.
3. **WhatsApp bot** — webhook at `/api/whatsapp/incoming`, conversation state per phone number.

## API route layout
```
/api/auth/*          — Supabase auth helpers
/api/exams/*         — exam creation, answer submission, results
/api/practice/*      — daily drill generation, answer submission
/api/recordings/*    — upload, transcribe, score
/api/hr/*            — dashboard data, cohorts, PDF/Excel exports
/api/whatsapp/*      — Twilio inbound webhook
/api/content/*       — AI content generation + moderation
/api/billing/*       — Stripe subscription management
```

## Scoring pipeline (Session 3+)
```
Recording (WebM/MP3, 5–45s)
  → Supabase Storage (private bucket)
  → Queue for background job (Inngest or Supabase cron)
  → Whisper (transcript)
  → Claude (score: intent + vocabulary + fluency + tone, each 0–25)
  → Save scores + feedback_es + model_response
  → Update exam_session.speaking_avg_score
  → Recompute final_level (60% speaking + 40% listening)
```

## Data isolation
- Every query scoped by `organization_id` or `property_id` via RLS.
- Exam URLs are public by slug (`/e/gran-hotel-cancun`) but write scope is verified server-side against the property.
- Voice recordings stored in private Supabase Storage buckets, served via signed URLs only.

## Scale tiers
1. **Pilot (0–500 users):** Supabase Pro, Vercel free. ~$50–100/mo infra.
2. **Growth (500–10K):** Add Upstash Redis for caching, Inngest for queue. ~$200–400/mo.
3. **Scale (10K–100K):** Supabase Team or self-host, Cloudflare R2 for audio CDN. ~$1–3K/mo.
4. **Platform (100K–1M):** Self-host Postgres, multi-region (MX + BR). ~$5–15K/mo.

## Non-negotiables
- **Never lose a recording.** Upload retries (3x exponential backoff) → localStorage fallback → resume when connection restores. Employee never sees "error."
- **Session resume everywhere.** Every exam answer persists immediately. Closing the browser and reopening the link must resume at the exact last step.
- **Speaking > listening weight.** 60/40 in both assessment and practice. The employee's job is to PRODUCE English, not just understand it.
- **Generous A1/A2 scoring.** A bellboy saying "Yes, I help bags, room 304" scored 60–70, not 30. They communicated successfully.

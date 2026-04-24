# Setup

Step-by-step account setup for every external service the app uses. Do these in order. Mark the ones you've completed — the app runs on partial config (landing page works with zero env vars) but each capability needs its own service.

## Required to run locally (zero config)

Nothing. `npm install && npm run dev` will serve:
- `/` — landing page
- `/e/anything` — exam entry in **stub mode** (property name is derived from the slug, no database calls)

---

## Required for Phase 1 full functionality

### 1 — Supabase (database, auth, storage)

Used by: HR auth (Phase 4+), exam sessions (Phase 2+), voice recordings storage (Phase 3+), all data persistence.

1. Sign up at https://supabase.com and create a new project.
   - Region: `us-east-1` or `us-west-1` (lowest latency for Mexico).
   - Database password: save to your password manager.
2. In the Supabase dashboard → **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never commit)
3. Paste into `.env.local`.
4. Run the schema migration. Two options:
   - **SQL Editor** (easiest): open `supabase/migrations/0001_initial_schema.sql` in your editor, copy the whole file, paste into Supabase SQL Editor, run.
   - **CLI**: `npx supabase db push` after `npx supabase link --project-ref <your-ref>`.
5. Verify: the dashboard → **Table Editor** should show `organizations`, `properties`, `employees`, `exam_sessions`, etc.
6. Seed your first hotel (Phase 1 preview):
   ```sql
   insert into organizations (name, type) values ('Hotel Pilot MX', 'independent') returning id;
   -- copy the returned id
   insert into properties (organization_id, name, slug, city, country)
     values ('<org-id>', 'Gran Hotel Cancún', 'gran-hotel-cancun', 'Cancún', 'MX');
   ```
   Now `http://localhost:3000/e/gran-hotel-cancun` will render "Bienvenido a Gran Hotel Cancún." with `isStub = false`.

### 2 — Typefaces (New Spirit)

Inglés Hotelero uses **New Spirit** by Sharp Type for display headings. It's a licensed typeface.

1. Purchase a web license at https://sharptype.co/typefaces/new-spirit (or use an existing one).
2. Place the woff2 files in `public/fonts/`:
   - `NewSpirit-Regular.woff2`
   - `NewSpirit-Medium.woff2`
   - `NewSpirit-SemiBold.woff2`
3. Until the files exist, the browser falls back to `Cormorant Garamond` (will not render unless installed locally) and then to Georgia. The design system is designed so the fallback is usable, but New Spirit is part of the brand.

> **Before going public:** uncomment the `public/fonts/*.woff2` line in `.gitignore` so licensed fonts aren't committed to the repo.

---

## Required for Phase 2+

### 3 — OpenAI (TTS + Whisper)

Used by: static exam audio generation (Phase 2), voice transcription (Phase 3).

1. Sign up at https://platform.openai.com.
2. Create an API key → copy to `.env.local` as `OPENAI_API_KEY`.
3. Set a monthly spend limit (e.g., $50) in Billing settings. Whisper is ~$0.006/minute; TTS is ~$15/1M characters.

### 4 — Anthropic (Claude scoring + content generation)

Used by: speaking evaluation (Phase 3), daily drill generation (Phase 5+).

1. Sign up at https://console.anthropic.com.
2. Create an API key → copy to `.env.local` as `ANTHROPIC_API_KEY`.
3. Use model `claude-sonnet-4-6` for scoring. Set a monthly spend limit.

---

## Required for Phase 5+

### 5 — Twilio (WhatsApp Business API)

Used by: daily drill delivery, voice note intake.

1. Sign up at https://twilio.com → complete the WhatsApp Business API onboarding.
2. Submit Meta's **template messages** for approval: daily drill invite, weekly summary, streak reminder, exam invite, results ready.
3. Copy credentials to `.env.local`:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_NUMBER` (e.g., `whatsapp:+14155238886` for the sandbox)
4. Configure inbound webhook → `https://<your-domain>/api/whatsapp/incoming`.

---

## Required for Phase 6+

### 6 — Stripe (subscriptions + one-time payments)

Used by: $50/employee placement exam, $150–$500/month subscriptions.

1. Sign up at https://stripe.com.
2. Create products: Starter ($150/mo), Professional ($300/mo), Enterprise ($500/mo), Placement Exam ($50 one-time).
3. Copy keys to `.env.local`:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET` (after setting up the webhook at `/api/billing/webhook`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 7 — Resend (transactional email)

Used by: HR welcome emails, weekly digests, results-ready notifications.

1. Sign up at https://resend.com, verify the `ingleshotelero.com` domain.
2. Copy `RESEND_API_KEY` to `.env.local`.
3. Set `RESEND_FROM_EMAIL=hola@ingleshotelero.com`.

---

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub.
2. Import at https://vercel.com → connect the repo.
3. Add every env var from `.env.local` to **Project Settings → Environment Variables**.
4. Domain: connect `ingleshotelero.com` (or subdomain) once the DNS is ready.

### Alternative: self-host via `npm run build && npm start`

Works on any Node 18+ host. Make sure environment variables are set before `start`.

---

## Troubleshooting

| Symptom                                                              | Fix                                                                                           |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Display fonts look like Georgia / generic serif                      | New Spirit woff2 files missing from `public/fonts/`. See step 2 above.                        |
| `/e/xyz` shows "modo vista previa" banner                            | Supabase URL/anon key not set, or slug doesn't exist in `properties`. See step 1.             |
| SQL migration fails on `hr_users.id references auth.users`           | Run the migration on a Supabase project (auth.users exists there), not a generic Postgres.    |
| `createServiceClient` throws "SUPABASE_SERVICE_ROLE_KEY is not set"  | Add the service role key to `.env.local` — only used by server-only routes and workers.       |

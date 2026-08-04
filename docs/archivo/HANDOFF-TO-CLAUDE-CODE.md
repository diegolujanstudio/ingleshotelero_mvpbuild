# Handoff to Claude Code — Inglés Hotelero

**Last updated:** 6 May 2026 · written by Cowork session
**For:** Claude Code, running locally in this folder

---

## Open Claude Code with this exact prompt

Copy everything between the lines below and paste it as your first message in a fresh Claude Code session at the project root:

```
You are taking over Inglés Hotelero from a Cowork session that just finished setting up infrastructure. Your job is to build out the rest of the PWA, phase by phase.

REQUIRED FIRST STEPS — do these before anything else:

1. Read `docs/CLAUDE-BRIEF.md` end to end. This is the locked architecture and phase plan.
2. Read `.orcha/architecture.md` and the most recent `.orcha/phase-*.md` files for prior decisions.
3. Read `CLAUDE.md` for repo conventions.
4. Run `git log --oneline -5` and `git status` to see where the codebase is.
5. Look at `.env.local` (gitignored) to see which production credentials are wired up. The Supabase project, ElevenLabs key, and Netlify env vars are already set.

THEN tell me three things in one short message:
  (a) the next unchecked phase from the brief, in your words
  (b) the three hardest open questions for that phase
  (c) an estimated time to complete it

DO NOT WRITE CODE until I confirm the phase and answer your questions.

Conventions you must respect:
- Spanish copy lives in `src/content/*.ts`. Never hardcode Spanish in components.
- Server-only files start with `import "server-only"`.
- Use `cn()` from `@/lib/utils`.
- The single accent color is ink blue `#2E4761` — `<em>` is restyled globally to use it. No terracotta, forest, ochre, or drop shadows.
- Commit every meaningful chunk separately. Format: `[Phase X] What changed (≤72 chars)`.
- Push every commit. Netlify auto-deploys from `main`.
- Demo bypass on `/hr/login` must be unreachable in production. Env-gate AND hostname-gate it (see brief decision table).

When you're confused or about to make a load-bearing decision that isn't in the brief, write a one-page memo at `.orcha/proposed-change-NNN.md` and ask me before proceeding.
```

That's the entire kickoff. Claude Code will read the brief, plan Phase A, and ask you the three hardest questions.

---

## Infrastructure already provisioned — nothing for Claude Code to set up

| Service | Status | Notes |
|---|---|---|
| GitHub repo | ✅ Live, both commits pushed | `diegolujanstudio/ingleshotelero_mvpbuild`, branch `main` |
| Netlify | ✅ Auto-deploys from `main` | Project: `ingleshotelero` → `ingleshotelero.netlify.app` |
| Supabase | ✅ Project + 15 tables + 3 buckets + RLS | Org: Ingles Hotelero · Project ref: `ngllenlyhykeauknpctq` · region us-east-2 |
| Netlify env vars | ✅ All seven set in production | URL/anon/service-role/ElevenLabs/APP_URL/DEMO_MODE |
| Local `.env.local` | ✅ Mirrors Netlify | Gitignored. Used by `npm run dev`. |
| ElevenLabs | ✅ Account + API key | Free tier. Key stored in env. |
| Marketing site (`ingleshotelero.com`) | ✅ Untouched, separate Astro repo | Different Netlify project. Don't deploy MVP code there. |

---

## Phase order (from `docs/CLAUDE-BRIEF.md`)

Claude Code executes these in order. Don't skip ahead. Each phase ends with a definition-of-done check that must pass before the next phase starts.

| # | Phase | Estimated time | Diego must provide before this phase starts |
|---|---|---|---|
| A | Real Supabase backend + RLS audit | 3–4 days | Already done — Supabase live, env vars wired |
| B | Real HR auth + invite flow | 2–3 days | Resend account + verified domain DNS records |
| C | Production-grade PWA (service worker + offline queue) | 2 days | Nothing |
| D | Daily practice loop (replace V0 with real loop) | 3–4 days | OpenAI API key (for Whisper if speaking step returns) |
| E | Real WhatsApp delivery | 3–4 days code + 1–3 weeks Meta approval | **Twilio WhatsApp API approval — apply NOW, see brief §3.5** |
| F | Stripe billing | 2 days | Stripe account + Mexican RFC for CFDI invoicing |
| G | Reports + email digests | 2 days | Already covered (Resend) |

After Phase D, you can sign your first paid pilot. Phases E/F/G harden for scale.

---

## What Diego still needs to do, in order

These unblock the next phases. Do them one at a time, when Claude Code asks.

### Right now (before Phase B)
1. **Resend** — sign up at https://resend.com, verify the `ingleshotelero.com` domain by adding the SPF/DKIM/DMARC DNS records they give you, then paste the API key. **Why:** without this, HR invite emails can't go out, so Phase B can't ship.

### When Phase D is queued up (Whisper)
2. **OpenAI** — sign up at https://platform.openai.com, add billing with a $50/month cap, generate an API key. **Why:** speaking-step scoring needs Whisper transcription.

### Apply IMMEDIATELY in parallel (don't wait for Phase E)
3. **Twilio WhatsApp Business API** — apply at https://twilio.com. Submit Meta Business Manager verification. Pre-submit the 5 message templates from brief §3.5. **Why:** approval takes 1–3 weeks. If you start when Phase E is ready, you wait. Start now and the approval finishes by the time the code is ready.

### Before signing first paid hotel (Phase F prerequisites)
4. **Stripe** — activate account, create the 4 products listed in brief §3.6, configure the webhook endpoint. **Why:** can't take payment without this.
5. **Mexican lawyer review** — `$500–$1,500` for review of `/aviso-de-privacidad`, `/terminos`, and standard contract template. **Why:** required by LFPDPPP for paid pilots. Drafts already live; need legal certification.

### Optional but recommended
6. **Sentry** — sign up, capture DSN. **Why:** crash reporting before paying customers exist.

---

## What's pre-filled in `.env.local` and Netlify already

The actual values live in `.env.local` at the repo root (gitignored) and in
Netlify production env vars. Variable names:

```
NEXT_PUBLIC_SUPABASE_URL          # https://<project-ref>.supabase.co
SUPABASE_URL                      # same as above
NEXT_PUBLIC_SUPABASE_ANON_KEY     # sb_publishable_*
SUPABASE_SERVICE_ROLE_KEY         # sb_secret_*  — server-only
ELEVENLABS_API_KEY                # sk_*
NEXT_PUBLIC_APP_URL               # https://ingleshotelero.netlify.app
NEXT_PUBLIC_DEMO_MODE             # false in prod
SUPABASE_DB_PASSWORD              # local-only, not in Netlify
```

Project ref is `ngllenlyhykeauknpctq`, region us-east-2 (Ohio). All
credentials present — see `.env.local` for values.

Database migration `0001_initial_schema.sql` already applied. Tables present:
analytics_events, cohort_members, cohorts, content_items, diagnostic_answers, employees, exam_sessions, hr_users, listening_answers, organizations, practice_sessions, properties, speaking_recordings, streaks, vocabulary_progress.

Storage buckets: `recordings` (private), `reports` (private), `audio` (public).

---

## How Diego works with Claude Code, day to day

1. Open VS Code on the project folder.
2. Open the integrated terminal.
3. Run `claude` (or whichever way you launch it).
4. Paste the kickoff prompt from the top of this file the first time.
5. After that, just say: "Continue with Phase X" or answer Claude Code's questions.
6. When Claude Code commits, it pushes automatically. Netlify rebuilds in ~1 minute.
7. Visit https://ingleshotelero.netlify.app to see the live result.

If Claude Code does something off-brand or off-architecture, paste this back at it: "Re-read `docs/CLAUDE-BRIEF.md` section 2 (locked decisions). Then redo this without violating any of them."

---

## Quick "is it working" sanity checks

After any deploy completes, hit these URLs:

- https://ingleshotelero.netlify.app/ — product entry (admin login + employee context). NOT a marketing landing.
- https://ingleshotelero.netlify.app/pitch — interactive 20-slide sales deck. Use this in HR pitches.
- https://ingleshotelero.netlify.app/aviso-de-privacidad — privacy notice (LFPDPPP draft).
- https://ingleshotelero.netlify.app/terminos — terms draft.
- https://ingleshotelero.netlify.app/e/demo-hotel — exam entry preview (still in stub mode until Claude Code wires it to real Supabase in Phase A — wait, that's already done by Cowork tonight).
- https://ingleshotelero.netlify.app/hr/login — HR login (demo bypass works, real auth comes in Phase B).
- https://ingleshotelero.netlify.app/practice — daily-drill V0 (real loop in Phase D).
- https://ingleshotelero.netlify.app/precios — pricing page.

If any return 500, check Netlify deploy logs and tell Claude Code.

---

## Important security notes

- The PAT used to push tonight (`cowork-push-2026-05-06`) expires June 5, 2026. Revoke earlier at https://github.com/settings/personal-access-tokens if you don't need it.
- The Supabase `service_role` key is server-only. Never paste it into a client component. The repo has `import "server-only"` tripwires for this.
- The `.env.local` file is gitignored. Don't ever `git add .env.local`. If you do by accident, rotate every key in it immediately.

---

## When something goes sideways

- **"Push failed: auth"** → PAT expired or was revoked. Create a new one at https://github.com/settings/personal-access-tokens/new with Contents: Read & Write on `ingleshotelero_mvpbuild`.
- **"Netlify build failed"** → check the deploy log at https://app.netlify.com/projects/ingleshotelero/deploys. Common cause: a new env var Claude Code added that isn't set in Netlify.
- **"Supabase RLS denied a query that should work"** → run the query in the SQL Editor with the service role to confirm the data is there, then check the RLS policy. Brief §A item 6 is the audit script.
- **"Claude Code keeps asking me the same question"** → it forgot context. Restart the session and paste the kickoff prompt again.

---

That's the handoff. The work tonight covered everything Diego can't do himself: provisioning, env wiring, schema, push. From here, every line of code lives in Claude Code, executed against this brief.

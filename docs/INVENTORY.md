# Inglés Hotelero — What We Actually Have (Live Inventory)

*Verified against production on 2026-07-12. Status is real, not aspirational.*

**Legend:** ✅ live & working · 🟡 live but running in mock/fallback mode until a key is added · ⛔ currently DOWN · ⚙️ built, needs an account/key to switch on · 📄 written but not yet applied

---

## ⛔ READ THIS FIRST — the backend is paused right now
- ⛔ **Supabase database is auto-paused** (free tier pauses after ~7 idle days). DNS returns NXDOMAIN.
- **What this means:** the websites load fine, but the product **cannot save real data right now** — a real exam, practice session, or HR login would fail or fall back to demo mode.
- **The data is safe** (pause preserves everything) and it restores in ~2 minutes from the Supabase dashboard.
- **Permanent fix:** upgrade to **Supabase Pro (~$25/mo)** so it never pauses again. Until then, this recurs.
- **Bottom line:** the front end is live; the back end needs a one-click restore + the Pro upgrade before any real hotel touches it.

---

## 1. Live websites (public URLs)
- ✅ **Marketing site** — https://ingleshotelero.com (Astro, static, on Netlify)
- ✅ **Product app** — https://ingleshotelero.netlify.app (Next.js 14 PWA, on Netlify)
- ✅ Google Search Console verification tag is **live** on the marketing site (pending your final "Verify" + sitemap submit)

## 2. Marketing site — every page live (ingleshotelero.com)
- ✅ **Home** (`/`) — hero, how-it-works, departments, pricing, FAQ, boarding-pass design
- ✅ **Cadenas / franchises** (`/cadenas`) — the multi-property sales page
- ✅ **Ciudades directory** (`/hoteles`) — links to all 266 destinations, grouped by country
- ✅ **266 city hub pages** (`/hoteles/[city]`) — e.g. /hoteles/cancun, localized per city
- ✅ **~798 city × role pages** (`/hoteles/[city]/[recepcion|botones|restaurante]`)
- ✅ **8 country hubs** (`/hoteles/pais/[country]`) — Mexico, España, Colombia, etc.
- ✅ **Contacto** (`/contacto`) — lead form (boarding-pass styled)
- ✅ **Legal** — `/terminos`, `/privacidad`, `/aviso-legal`
- ✅ **~1,071 total pages**, one unified navbar/footer across all of them
- ✅ **SEO assets:** sitemap.xml (1,068 URLs), robots.txt, canonicals, hreflang, Organization/Service/FAQPage/Breadcrumb JSON-LD, on-brand OG share images

## 3. Product app — every surface built & deployed (ingleshotelero.netlify.app)
*(All routes return 200; full function depends on the backend being up — see §0.)*

**Public / sales**
- ✅ **Home / product entry** (`/`)
- ✅ **Pricing** (`/precios`) — three tiers + Product/Offer JSON-LD
- ✅ **Onboarding hub** (`/onboarding`) — hotel + employee paths
- ✅ **Pitch deck** (`/pitch`) — interactive sales deck
- ✅ **Support** (`/soporte`), **Terms** (`/terminos`), **Privacy** (`/aviso-de-privacidad`)
- ✅ **Colocación intake** (`/colocacion`) — warm-lead questionnaire
- ✅ **WhatsApp demo** (`/demo/conversacion`) — prospect-facing simulator
- ✅ **PWA:** installable, offline page, manifest, service worker, crisp app icons

**The placement exam (the wedge)**
- 🟡 **Hotel exam entry** (`/e/[slug]`) — the link a hotel shares with staff
- 🟡 **Exam flow** — diagnostic (13 Q) → listening (10, real audio) → speaking (voice, 6) → results
- 🟡 **Scoring** — listening scored server-side; **speaking currently uses MOCK scoring** (real AI needs OpenAI + Anthropic keys)

**The daily practice (the habit)**
- 🟡 **One-tap employee login** (`/i/[token]`) — passwordless, 1-year token
- 🟡 **Daily practice loop** (`/practice`) — listen → answer → speak → 3 vocab cards → streak
- 🟡 **Progress view** (`/practice/progress`), **done screen** with streak

**HR dashboard (what you sell to the hotel)**
- 🟡 **Login** (`/hr/login`) — real auth + accept-invite flow
- 🟡 **Overview** (`/hr`), **Employees** (`/hr/employees` + detail), **Cohorts** (`/hr/cohorts` + progress)
- 🟡 **Reports** (`/hr/reports`) — CSV / Excel / PDF export
- 🟡 **Organización** (`/hr/org`) — chain roll-up across properties (shows when 2+ properties)
- 🟡 **Property switcher** (chains), **Team** (`/hr/team`), **Settings** (`/hr/settings`)

**Master OS (your internal cockpit — super-admin only)**
- 🟡 **Dashboard** (`/masteros`) — the founder glance
- 🟡 **Atajos launcher** (`/masteros/launch`) — every surface in one place
- 🟡 **Módulos** — the drill editor (add/edit/deactivate content, AI-draft)
- 🟡 **Leads / CRM** — pipeline by source + status (your 7 leads live here)
- 🟡 **Revenue / pipeline**, **Resultados** (learning outcomes), **Command Center**
- 🟡 **Team & access**, **Audit log**, **Tasks + Resources**, **Colocación admin**

## 4. Backend & infrastructure
- ⛔ **Supabase** (project `ngllenlyhykeauknpctq`, us-east-2) — Postgres DB, Auth, Storage. **Currently paused (free plan).** ~23 tables, RLS security, 3 storage buckets (recordings/reports/audio).
- ✅ **Netlify** — 2 projects auto-deploying from GitHub `main` (app + landing)
- ✅ **GitHub** — 2 repos: `diegolujanstudio/ingleshotelero_mvpbuild` (app) + `ingleshotelero-landing`
- ✅ **ElevenLabs** (Starter plan) — text-to-speech; **168 audio files already generated** and cached in Supabase storage
- 📄 **Migrations 0001–0011 applied**; **0012 (WhatsApp) + 0013 (billing) written but NOT applied**

## 5. What's in the database (when it's up)
- 1 organization, 1 property (`master`), 3 HR/admin users, employee access tokens
- **60 practice drills** (content_items) — 5 per role × level (A1–B2)
- **7 leads** in the CRM (all still "new" / uncontacted)
- Some internal test exam + practice data (safe to delete)

## 6. Content library
- ✅ **60 role×level drills** (bellboy / front desk / restaurant, A1–B2) — listening + model phrase + vocabulary
- ✅ **Exam bank** — 13 diagnostic + 10 listening + 6 speaking prompts per role
- ✅ **168 audio files** (ElevenLabs, real voice) for drills + exam

## 7. Integrations & engines (built)
- 🟡 **AI scoring pipeline** — Whisper (transcribe) + Claude (score) — code complete, **runs in mock mode** until OpenAI + Anthropic keys are set
- ⚙️ **WhatsApp engine** — full conversation state machine + Twilio adapter + daily dispatcher; **inert until Twilio credentials + Meta template approval**
- ⚙️ **Stripe billing** — signature-verified webhook + soft-lapse banner; **inert until Stripe keys**
- ⚙️ **Scoring cron + WhatsApp daily cron** — endpoints built; **need an `INTERNAL_API_TOKEN` + a scheduler**
- ⚙️ **Email** (HR invites/digests) — needs custom SMTP in Supabase
- ⚙️ **Rate limiting** (Upstash), **Sentry** error monitoring — optional, need accounts

## 8. Documents you have
- ✅ `docs/PHILOSOPHY.md` — startup operating doctrine (Customer Development + Lean Startup)
- ✅ Operating Guide (hosted artifact) — how to run & sell the system
- ✅ QA Report (hosted artifact) — engineering scorecard

---

## The honest "does it work right now?" answer
- ✅ **The websites work** — anyone can visit all 1,071 marketing pages and the app shell right now.
- ⛔ **The product can't save data right now** — Supabase is paused. Restore it (2 min) + upgrade to Pro to fix permanently.
- 🟡 **Once the DB is up, the core flows work** — exam, practice, HR dashboard, Master OS — with speaking scored by a **mock** until you add the AI keys.
- ⚙️ **Paid features are off** until their keys: real AI scoring, WhatsApp delivery, Stripe billing.

**To make it fully real for a first paying hotel, in order:** (1) restore Supabase + upgrade to Pro, (2) apply migrations 0012 + 0013, (3) add OpenAI + Anthropic keys + cron token, (4) rotate the exposed secrets. Everything else (Twilio, Stripe) can wait for pilot #2+.

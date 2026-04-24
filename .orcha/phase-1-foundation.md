# Phase 1 — Foundation

**Status:** ✅ Shipped 2026-04-17
**Session prompt (bible §20, Session 1):** "Create a Next.js 14 app with App Router, TypeScript, and Tailwind CSS. Set up Supabase client. Configure fonts… Create the database tables. Build the landing page."

## Delivered
- Next.js 14 App Router + TypeScript scaffold (`package.json`, `tsconfig.json`, `next.config.mjs`).
- Tailwind theme wired to editorial design tokens (see `.orcha/design-system.md`).
- Supabase client setup: `src/lib/supabase/{client,server,types}.ts` using `@supabase/ssr` pattern.
- Full SQL migration at `supabase/migrations/0001_initial_schema.sql` — all tables from bible §11 plus RLS policies and indexes.
- Design primitives: `Button`, `Card`, `Input`, `Badge`, `LevelBadge`, `HairlineRule`, `NumberedPlaceholder`, `Logo`.
- Landing page at `/` — HR-facing conversion copy (ten editorial sections). Copy lives in `src/content/landing.ts` for iteration without touching JSX.
- Hotel-scoped exam entry at `/e/[slug]` — registration + role selection + consent + mic/audio check stub.
- Utilities: `src/lib/cefr.ts` (level calculation from bible §4 rubric), `src/lib/utils.ts`, `src/content/roles.ts`.
- **PWA baseline:** `src/app/manifest.ts` (installable, themed, categorized), `src/app/icon.tsx` (512×512 dynamic PNG from New Spirit monogram), `src/app/apple-icon.tsx` (180×180), viewport-fit:cover for iOS safe areas, apple-web-app meta tags.
- Docs: `README.md`, `SETUP.md`, `GETTING-STARTED.md` (non-coder onboarding), `CLAUDE.md`.

## Not yet in Phase 1
- Actual exam pages (diagnostic / listening / speaking / results) → Phase 2.
- MediaRecorder recording upload → Phase 2.
- **Service worker + offline support** — deferred to Phase 2 where it actually matters (exam answers must survive a lost connection). Manifest + icons are in place so the app is *installable*; true offline behavior arrives with the exam flow.
- Whisper + Claude scoring → Phase 3.
- HR dashboard → Phase 4.
- WhatsApp → Phase 5.
- Billing → Phase 6.

## Verification checklist for Diego
- [ ] `npm install` completes without peer conflicts
- [ ] `npm run dev` serves landing page on http://localhost:3000
- [ ] Typography renders correctly once New Spirit font files are placed in `public/fonts/` (fallback to Cormorant Garamond otherwise)
- [ ] `/e/test-hotel` renders the entry screen (uses static stub data in Phase 1)
- [ ] SQL migration runs clean on a fresh Supabase project

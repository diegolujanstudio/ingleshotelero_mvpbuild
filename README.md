# Inglés Hotelero

Hotel English training for Latin American hospitality staff — PWA + HR dashboard
+ marketing site.

### 👉 Si estás buscando por dónde empezar, abre **[`EMPIEZA-AQUI.txt`](EMPIEZA-AQUI.txt)**

That file is the human entry point, in Spanish, and it points at everything else.

---

## The two projects in this folder

| | Marketing site | The app |
|---|---|---|
| Live | https://www.ingleshotelero.com | https://ingleshotelero.netlify.app |
| Folder | `landing/` (its own git repo) | repo root |
| Stack | Astro, 1,079 static pages | Next.js 14 + Supabase |
| Audience | Hotels deciding whether to buy | Employees and HR |

**The visual map of the whole system** lives at
[/metodo](https://www.ingleshotelero.com/metodo) — 205 interactive nodes
covering the method, the research, every route, the database and the gaps.

## Documentation

| Folder | What's in it |
|---|---|
| `docs/operar/` | Credentials map, how to test the PWA, how to deploy |
| `docs/sistema/` | The IP — **`METODO-TURNO.md` is the key file**, plus pricing and GTM |
| `docs/estado/` | What is actually built, measured |
| `docs/research/` | 17 source extractions behind the method |
| `docs/archivo/` | Superseded — ignore |

---

## Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values (see docs/operar/01-CREDENCIALES.md)
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
├── EMPIEZA-AQUI.txt        ← START HERE (Spanish, plain text)
├── CLAUDE.md               ← conventions for AI coding tools
├── docs/
│   ├── operar/             ← credentials · testing the PWA · deploying
│   ├── sistema/            ← the IP (METODO-TURNO, PRICING, GTM, LATAM-UX)
│   ├── estado/             ← what is actually built, measured
│   ├── research/           ← the 17 sources behind the method
│   └── archivo/            ← superseded, ignore
├── landing/                ← the marketing site (its OWN git repo)
├── src/
│   ├── app/                ← routes: /practice, /exam, /hr, /masteros, /api
│   ├── components/
│   ├── content/            ← roles, drills, variants, interference, minimal pairs
│   └── lib/                ← supabase clients, practice engine, scoring, HR data
├── supabase/migrations/    ← 0001 … 0014 (0014 not yet run in production)
└── public/
```

---

## What's next

All six build phases shipped. The product now covers **8 departments × 4 CEFR
levels** — 160 authored situations expanded to 2,400 rehearsals by the
combinatorial engine — plus the pronunciation trainer and the Coach/Evaluator
split described in `docs/sistema/METODO-TURNO.md`.

**The three open blockers are operational, not code** (see `EMPIEZA-AQUI.txt`):

1. Run migration `0014` so the five new departments can be assigned
2. Move Supabase off the free tier so it stops auto-pausing
3. Add the AI keys in Netlify so scoring uses real models, not the fallback

Current state, measured: `docs/estado/PRODUCT-AUDIT.md`.
Live system map: https://www.ingleshotelero.com/metodo

---

## License

All rights reserved — Diego Luján Studio, 2026. Typefaces (New Spirit by Sharp Type) are licensed separately; font files are not redistributed in this repository.

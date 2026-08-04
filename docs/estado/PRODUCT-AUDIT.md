# PRODUCT AUDIT
### What the learning product actually does today, judged as instructional design
*Version 1.0 · Julio 2026 · Read against `METODO-TURNO.md`*

Audited by reading the code, not the docs. File references are real.

---

## VERDICT IN ONE LINE

The engineering is better than expected and the **content pool is critically thin**: a learner exhausts everything available at their level in **five days**. The endgame problem is not distant — it arrives on day six, inside the 14-day pilot.

---

## 1. WHAT IS GENUINELY GOOD

These are real assets. Do not rebuild them.

| Asset | Where | Why it matters |
|---|---|---|
| **SM-2 spaced repetition, correctly implemented** | `src/lib/practice/sm2.ts`, `vocabulary_progress` table | Real ease factors, intervals, repetition counts, lapse reset. This is the hard part of an SRS and it is done |
| **Adaptive drill picker** | `src/lib/practice/picker.ts` | Level filtering with downward fallback (never pushes above assessed level), weak-skill weighting from 14 days of history, anti-repeat window, deterministic daily rotation. More sophisticated than most edtech |
| **Generous, non-punitive AI calibration** | `src/lib/scoring.ts` | *"For A1-A2 be GENEROUS… NEVER score 0 if they attempted… The goal is placement and encouragement, not punishment."* Correct posture, already written |
| **`model_response` in every scoring result** | `src/lib/scoring.ts` | "What a good answer sounds like" — this is genuine language-parent modeling and it already exists |
| **Four-movement daily loop** | `src/app/practice/[drillId]/PracticeRunner.tsx` | listening → speaking → reinforce → review. The skeleton of El Método Turno is already the right shape |
| **Offline-tolerant completion** | `PracticeRunner.finish()` | Soft-fails to local storage, mirrors to server. Correct for a prepaid/Wi-Fi-only market |

---

## 2. THE BLOCKER: THE POOL DIES ON DAY 6

**Measured, not estimated.**

- `src/content/practice-drills.ts` contains **60 drills**
- Distributed across **3 modules × 4 levels**
- → **5 drills per (module, level)**

A learner practices once per day at a fixed level. **Their entire world is five drills.**

Worse, the picker's own anti-repeat rule is structurally unsatisfiable:

```
// src/lib/practice/picker.ts:117-119
// Anti-back-to-back: drop any drill seen in last 3 days.
let filtered = candidates.filter((d) => !recentIds.has(d.id));
if (filtered.length === 0) filtered = candidates.slice();
```

With a pool of 5 and a 3-day exclusion window, by day 4 the filter routinely empties and silently falls back to the full pool. From roughly **day 6 onward the learner sees the same five drills on rotation, forever.**

### Why this is the top priority
A 14-day pilot — the thing we sell — runs **more than twice as long as the content lasts.** The buyer will watch engagement decay inside the trial and conclude the product doesn't work. It isn't a motivation failure; it's an inventory failure.

**This moves the combinatorial engine from "P3 endgame polish" to "P0 pilot-blocker."** I had it ranked wrong in `METODO-TURNO.md` §11 before measuring; that ranking is corrected below.

---

## 3. GAPS AGAINST EL MÉTODO TURNO

### 3.1 No pronunciation dimension exists at all — blocks *La Semana Sin Pena*

```sql
-- 0001_initial_schema.sql:254
skill text not null check (skill in ('listening','speaking','vocabulary'))
```

There is no `pronunciation` skill, no phoneme entity, no minimal-pair structure, and no per-learner phoneme mastery table. **Week 1 of the method cannot be built without a migration.**

Needed:
- Extend the `skill` CHECK to include `pronunciation`
- A minimal-pair content type (contrast, word A, word B, audio each, L1 target)
- `phoneme_progress` — per learner, per contrast, mirroring `vocabulary_progress`'s SM-2 shape

### 3.2 `interference_group` does not exist — blocks Law 2

`content_items` has a free-text `topic` column, and the picker **does not use it** (the source comment says *"in v2 add `topic` to the drill model"*).

So there is currently no mechanism preventing two confusable items appearing together — the exact failure Wyner measures at **>30% slower learning**.

Needed: a constrained `interference_group` column plus picker constraints (never two new same-group items in a session; ≥24h between same-group introductions).

### 3.3 SRS covers words only

`vocabulary_progress` is keyed on `(employee_id, word, module)`. Scheduling exists for **vocabulary words** but not for:
- **utterances/situations** (the actual unit of job performance)
- **phonemes** (§3.1)

The method needs all three on the same scheduler.

### 3.4 One persona serves two jobs

`buildRubricSystemPrompt()` produces a 4-dimension score (intent/vocabulary/fluency/tone) and is used for both the placement exam and daily practice. Daily scoring violates Law 1 and re-creates the school dynamic that already failed this learner.

**Cheapest high-value fix in the entire audit** — it is a prompt-level change with no migration.

### 3.5 No CAPTURA entity
Nothing stores a learner-submitted situation. The evergreen content engine has no table to write to.

### 3.6 Single language, single sector — both hard-coded

```sql
module text not null check (module in ('bellboy','frontdesk','restaurant'))
```

- **No `language` column anywhere.** English is implicit throughout. A second language is a migration, not a config change.
- **`module` is a CHECK constraint.** Adding housekeeping or spa requires `ALTER TABLE`. A new sector (hospitals, airports) requires rethinking the taxonomy.

Neither blocks the next 12 months, but both should be fixed **while the table is small** — migrating 60 rows is free; migrating 60,000 is not.

---

## 4. MIGRATION VERDICT: ADDITIVE, NOT A REWRITE

Good news. Everything above is reachable by adding columns and tables, not by redesigning:

| Change | Type | Cost |
|---|---|---|
| Split Coach / Evaluator personas | Prompt only | Hours |
| Lapse-recovery doctrine (Law 5) | Logic only | Hours |
| `interference_group` + picker constraints | Additive column + picker logic | 1–2 days |
| `pronunciation` skill + minimal-pair content + `phoneme_progress` | Additive table + content authoring | ~1 week incl. content |
| Combinatorial drill generation | New generation layer over existing drills | ~1 week |
| `captured_situations` table + WhatsApp intake | Additive table + flow | ~1 week |
| `language` + generalized `sector`/`role` taxonomy | Additive columns, CHECK → FK | 1–2 days **if done now** |

**The schema is a sound v1. It is not a dead end.** But it was designed for a single-language, single-sector, enumerated-content product, and the method requires multi-dimensional, combinatorial, multi-skill content. Do the taxonomy migration while the data is 60 rows.

---

## 5. CORRECTED BUILD ORDER

Supersedes `METODO-TURNO.md` §11. The change: content inventory is a pilot-blocker and moves up.

### P0 — before the next pilot
1. **Combinatorial drill generation** — breaks the 5-drill ceiling. *Pilot-blocker.*
2. **Split Coach from Evaluator** — hours of work, removes daily scoring
3. **Lapse-recovery doctrine** — hours of work, protects every cohort
4. **Minimal-pair trainer + La Semana Sin Pena** — the method's opening move *and* the 30-second sales demo
5. **`interference_group` + picker constraint** — 30% learning-rate gain at zero learner cost

### P1 — the loop
6. CAPTURA over WhatsApp
7. Move daily audio into WhatsApp (removes learner data cost)
8. PREPARA scheduling from yesterday's CAPTURA + SRS due items
9. **Taxonomy migration** (`language`, generalized sector/role) — cheap now, expensive later

### P2 — depth
10. Las Primeras 400 per role
11. Own-voice recording as card audio
12. Back-chaining production drill
13. SRS extended to utterances and phonemes

### P3 — endgame
14. Padrino/Madrina program
15. Weekly live challenge
16. Second ladder beyond CEFR

---

## 6. THE ONE-SENTENCE SUMMARY FOR DIEGO

> The machinery is sound — real SRS, a smart picker, the right four-step loop, and an AI already calibrated to be kind. What is missing is **inventory and a pronunciation layer**, and the inventory problem will surface inside your next 14-day pilot unless the combinatorial engine ships first.

# EL MÉTODO TURNO
### El sistema de aprendizaje de Inglés Hotelero
*Version 1.0 · Julio 2026 · Synthesized from 543,000 words of primary sources + field research*

> **El turno es el salón de clases.**

---

## HOW TO READ THIS

This is the intellectual property of the company. Everything else — the app, the website, the pricing — is a delivery mechanism for what is written here.

- **§1 is the diagnosis.** If you read one page, read that one.
- **§2–§5 are the method.** This is what we build.
- **§6–§9 are the machinery.** Content model, AI personas, endgame, architecture.
- **§10–§11 are the future.** Other languages, other sectors, build order.

Sources are cited inline as `[source]`. Full extraction notes for each source live in the research appendix.

---

## 1. THE DIAGNOSIS

Rumelt's kernel demands a precise diagnosis before any strategy. Here it is.

### The learner's actual sentence

> **"Ya sé, pero me da pena."**
> *I know it, but I'm too embarrassed.*

A Mexican hotel worker with six years of school English is not missing information. They can often read a menu in English. They freeze at the front desk.

Julie Dirksen's central argument is that instructional design fails because designers "reflexively treat every performance problem as a knowledge gap and ship information at it." There are five gaps: **knowledge, skill, motivation, environment, communication.** Only one is fixed by delivering content.

**Ours is a motivation gap with a skill gap underneath it.** Not knowledge.

Every competitor — Duolingo, Open English, Berlitz, the private teacher the hotel hired for two years — ships content at a motivation gap. That is why the HR director's testimonial says *"El equipo pasó el examen. Pero frente al huésped, seguían paralizados."*

### The root cause of the shame is phonetic, and it is fixable

The embarrassment is not vague. It has a specific, documented, finite cause.

Spanish speakers have a **known and closed set** of English pronunciation problems, driven by their L1 phoneme inventory ([Problematic Phonemes for Spanish-speakers' Learners of English, GIST 2019]; Goswami & Chen 2010 tested Mexican Spanish speakers specifically and found explicit segmental instruction produces significant measurable improvement).

A subset of those errors do not merely confuse — **they humiliate**:

| Intended | What the guest hears | Cause |
|---|---|---|
| the bea**ch** | the b\*tch | /iː/ vs /ɪ/ |
| a clean **sh**eet | a clean sh\*t | /iː/ vs /ɪ/ |
| a **ch**air | a share | /tʃ/ vs /ʃ/ |
| **v**ery good | berry good | no /v/ in Spanish |
| I'll **st**ay | I'll *e*stay | Spanish has no /s/+consonant onset |

One humiliating incident in front of a guest ends a worker's willingness to speak English **for years**. In a Cancún beach resort, `beach` and `sheet` are not edge cases. They are daily vocabulary.

**This is the mechanism connecting the buyer's problem to the learner's problem.** The HR director says *"el personal evita el contacto."* The staff avoid guest contact. This is why.

### The market fact that makes this urgent

**Cancún scores 414 on the EF English Proficiency Index — one of the lowest city scores in Mexico** (national average 440; Playa del Carmen 517; Monterrey 532).

Mexico's largest international tourism market has among its weakest English. That is not a footnote. That is the first slide of the sales deck.

### The diagnosis, stated once

> Hotel staff in Latin America are not short of English knowledge. They are **carrying a specific, phonetically-rooted shame** that makes them avoid the guest interactions where English is learned. Shipping more lessons at a person who is afraid to speak produces certificates, not service.

---

## 2. THE GUIDING POLICY

Three commitments. Everything downstream follows from them.

### 2.1 We are the language parent, not the teacher

Chris Lonsdale's most important observation: *"A drowning man cannot learn to swim."* Immersion alone does not work. Foreigners live in Hong Kong for ten years and speak no Chinese.

**Our learners are already immersed.** A bellboy in Cancún hears English every shift. He is drowning in it. Every competitor's answer is *more English input*: water to a drowning man.

What reliably produces fluency is a **language parent** — the relationship every human used to acquire their first language. Its four rules:

1. **Works hard to understand you** even when you are badly off
2. **Never corrects your mistakes**
3. **Feeds back their understanding** so you can respond
4. **Uses words you already know**

This is a category position, not a feature. Duolingo is structurally a *teacher*: it corrects, it tests, it penalizes. We are the parent. No one owns this position and it is defensible, because being a language parent requires knowing the learner's real context — which requires the job, which requires the B2B relationship.

### 2.2 The shift is the curriculum

Gabriel Wyner's most powerful finding: memory operates at four levels of processing — structure, sound, concept, and **personal connection**. Personal connection produces roughly **50% better retention**; his cited study showed 6× recall for personally-connected items.

**Duolingo can never reach that level.** "The owl eats bread" has no personal connection available to anyone.

Our learner carried a guest's suitcase an hour ago. **Every item we teach can be anchored to a real memory from an actual shift.** The deepest level of processing is free for us and structurally unavailable to a consumer app.

So: *we do not teach English. We convert the shift they are already working into the curriculum.*

### 2.3 Dignity before vocabulary

Lonsdale's fifth principle: psycho-physiological state. *"If you're sad, angry, worried, upset, you're not going to learn. Period."*

A learner who is ashamed cannot acquire. Therefore **the first thing the product does is remove the shame**, not teach vocabulary. Week 1 fixes the sounds that can embarrass you. This buys the psychological safety that every subsequent week depends on.

---

## 3. THE FIVE LAWS

The pedagogical constitution. Any feature that violates one of these does not ship.

### Law 1 — Never score the daily practice
Assessment and coaching are different jobs and must never share a persona. Daily scoring re-creates the school experience that already failed this learner. The Coach never produces a number. (§7)

### Law 2 — Never present two confusable items together
Wyner's interference research: thematically related words take **11.3 repetitions** vs **7.2** for unrelated ones — over **30% slower**, with worse recall at one week. Teaching "all the room types" or "all the bathroom items" in one session is the single most common instructional-design error in language edtech, and we currently do it.

**Domain specialization is a huge win; thematic grouping within a session is a large loss.** These are different things and the difference is the whole game. (§6.1)

### Law 3 — Pronunciation before vocabulary
Wyner's "broken words": a word learned with wrong pronunciation cannot connect the spoken and written language, and stays broken forever. Fix perception first — minimal-pair training with immediate binary feedback measurably rewires adult phoneme perception in as little as 3×20-minute sessions.

### Law 4 — Recall, never review
Passive review does almost nothing. Retrieval under mild difficulty does almost everything. Every interaction must ask the learner to *produce* before it shows the answer. Wyner's Principle 4: make it hard enough that they nearly fail.

### Law 5 — Protect the habit above all content
When a learner lapses, **do not make them catch up.** Wyner lost a year of Japanese to a 6,000-card backlog he could never clear.

> *"The first day after a lapse is a terrible day to do that. So don't! Just review five flash cards and perhaps learn one new word... Your top priority right now is the health and safety of your habit, not working through your backlog."*

A shift worker **will** miss days. Design for it. On return: 5 items, 2 minutes, zero guilt, no broken-streak shaming. Ramp back 25–50% every couple of days.

---

## 4. THE LOOP

The daily cycle. Four movements, ~5 minutes of learner time, most of it free of data cost.

```
   PREPARA  ──▶   USA   ──▶  CAPTURA  ──▶   FIJA
   2 min           the shift      60 sec        SRS
   (WhatsApp)      (real guests)  (WhatsApp)    (scheduled)
        ▲                                          │
        └──────────────────────────────────────────┘
```

### PREPARA — before the shift, 2 minutes
A WhatsApp voice note: *"Hoy vas a necesitar esto."* Two or three utterances the learner is likely to need **today**, given their role, their level, and the property's current situation (high season, a big group checking in, the restaurant is short-staffed).

This is Dirksen's **rehearsed self-efficacy** — the specific fix for a motivation gap. The learner walks onto the floor with sentences already in their mouth. Combined with implementation intentions: *"Cuando llegue un huésped al mostrador, voy a decir…"*

### USA — during the shift
The rep happens with a real guest. This is free, infinite, maximally relevant practice that no consumer app can manufacture. We do nothing here except have prepared them well.

This is Lonsdale's Principle 2: *use the language as a tool to communicate from day one.*

### CAPTURA — after the shift, 60 seconds
One WhatsApp prompt: **"¿Qué no supiste decir hoy?"**

The learner sends a voice note in Spanish describing the moment. This single interaction is the most valuable in the entire system, because it simultaneously:

- Creates **personal connection** — the deepest level of processing (Law: §2.2)
- Generates **evergreen content** — the hotel becomes the content engine (§8)
- Solves the **pre-made deck problem** (§6.3)
- Produces **Epic Meaning** — *"tu situación ahora entrena a toda la cadena"*
- Feeds **product intelligence** no competitor has: a live map of exactly where hospitality English fails, by role, by property, by market

### FIJA — scheduled by the system
The captured moment becomes scheduled retrieval practice, spaced per §6.2, and returns as tomorrow's PREPARA.

**The loop closes.** What the learner failed at yesterday is what they rehearse before tomorrow's shift.

---

## 5. SEMANA 1 — "LA SEMANA SIN PENA"

The opening move, and the sharpest thing we sell.

**Week 1 teaches no vocabulary and no grammar.** It fixes the sounds that can embarrass you.

- 60–90 seconds/day of minimal-pair perception training, binary feedback (green check / red X)
- The dignity-critical contrasts first: `/iː/–/ɪ/` (beach, sheet, piece), then `/tʃ/–/ʃ/`, `/b/–/v/`, `/s/`-onset epenthesis
- A 15–20 second "cómo se hace este sonido" clip per phoneme (tongue, lips, voicing)
- Ends with the learner hearing themselves say `beach` and `sheet` correctly

**Why this is the right opening:**

1. It removes the shame that blocks everything else (§2.3)
2. It is **fast, binary, and objectively verifiable** — the learner *feels* competence in days, satisfying Octalysis CD2 during the Onboarding phase where it matters most
3. It is a **30-second sales demo**. An HR director who hears the beach/sheet problem once never forgets it, and immediately understands why their staff go quiet around guests
4. It is a Purple Cow in Godin's sense: remarkable, built into the product, and impossible to un-hear

**Binary feedback for perception. Never a red X on a learner's own recorded voice.** Perception is objective and can be marked wrong. Production is personal and must always open with what worked.

---

## 6. THE CONTENT MODEL

### 6.1 Interference groups — the highest-leverage, lowest-cost change

Tag every item with an `interference_group`, then enforce scheduler constraints:

- Never introduce two **new** items from the same group in one session
- Enforce **≥24 hours** between new items from the same group
- Never present two low-maturity cards from the same group in the same review batch
- Never reuse the same image across a group

Groups for hospitality: `room_types`, `amenities`, `bathroom_items`, `cutlery_tableware`, `numbers_1_20`, `days_week`, `colors`, `directions`, `payment_terms`, `complaint_verbs`, `breakfast_items`, `hotel_areas`, `time_expressions`, `polite_formulas`, `similar_sounds_*`.

**Expected effect: 30%+ improvement in learning speed and retention at zero additional learner time.** This alone justifies the content-model migration.

**Keep thematic grouping as a browsing view for the HR director. Never as the delivery order.**

### 6.2 SRS parameters

Intervals: **2–4 days → 9 days → 3 weeks → 2 months → 6 months → years.** Lapse returns to the short end.

Three grading buttons, not four: `No me acordé` / `Me costó` / `Fácil`.
**Celebrate `Me costó`** — that is the state with the highest retention payoff, and the copy should say so.

We already have SM-2 implemented at the vocabulary level with correct ease factors and intervals. This is a genuine asset. It needs to be extended from words to **utterances** and **phonemes**.

### 6.3 The pre-made deck problem, and its resolution

Wyner is blunt: *"no one has successfully used [downloaded decks] to learn a language."* Card **creation** is where the memory forms; an inherited card is "a dim reminder" of an experience the learner never had.

**This is an existential threat to any B2B pre-made-content product, including ours as currently designed.**

The resolution: the mechanism Wyner actually identifies is *personal choice and personal connection*, not literally typing. We cannot ask a tired bellboy to author flashcards. We can give him the same encoding by other means:

1. He **chooses** which situations matter (choice)
2. He **captures** his own real shift moments (personal connection, richer than anything he'd author)
3. He **records his own voice** as the item's production audio (own-voice production = deep encoding)
4. The system builds the card mechanics around his input

> **We do not ship cards. We ship a card factory that the learner's own shift feeds.**

### 6.4 "Las Primeras 400"

A hospitality frequency list per role, derived from real on-shift utterances: ~150 shared core + ~250 role-specific.

Justification for the buyer is Wyner's domain-specialization math: 2,000 general words gives 80% comprehension, but adding just **570 domain words gives 90% comprehension in that domain** — the same result as a 5,500-word general vocabulary, *for half the work.*

Selection criteria: concrete, picturable, high-frequency, **one sense each, no synonyms.** No "restroom / bathroom / toilet / WC" lesson at A1.

### 6.5 Combinatorial, not enumerated

A drill library that is *enumerated* runs out. A library that is *combinatorial* does not.

`situation × guest personality × pressure level × valid solution paths`

Forty situations become effectively unbounded. This is Octalysis Core Drive 3 (Empowerment of Creativity & Feedback) — the mechanism behind games that stay alive for centuries. **It is the difference between a content company and a system company.**

---

## 7. THE TWO PERSONAS

Currently one AI persona — an *evaluator* — serves both daily practice and assessment. That is a pedagogical error and it violates Law 1.

| | **EL COACH** (daily) | **LA EVALUACIÓN** (monthly) |
|---|---|---|
| Appears | Every day, in WhatsApp | Once a month, in the PWA |
| Produces | Understanding, modeling, encouragement | A CEFR number and a report |
| Never | Scores. Corrects. Shames. | Surprises the learner |
| Behaves like | Lonsdale's language parent | A fair, generous examiner |
| Sounds like | *"Te entendí perfecto. Otra forma de decirlo: …"* | *"Nivel actual: A2. Subiste desde A1."* |
| Serves | The learner's acquisition | The buyer's evidence |

The current scoring calibration is already generous and non-punitive, and it returns a `model_response` ("what a good answer sounds like") — which is genuine language-parent behavior. **Keep that. Split the persona.**

---

## 8. THE ENDGAME

Octalysis: *"the Endgame is the most neglected and one of the hardest phases to optimize."* Games that survive decades solve it. Games that don't die in three to eight months.

What happens when a learner completes their role library:

### 8.1 El Padrino / La Madrina — the highest-leverage feature in this document
B1+ learners become the designated language parent for new hires, in-app and on-shift.

- **Retains veterans** — mentorship proves and displays status (Octalysis technique #61)
- **Sells renewals** — it visibly lowers the hotel's training cost and builds a career ladder
- **Reduces turnover** — the buyer's actual pain
- **Closes the metaphor** — the learner who was parented becomes the parent

Graduation is not an exit. It is a promotion.

### 8.2 Evergreen content
Combinatorial drills (§6.5) plus learner-authored scenarios from CAPTURA. The library never empties because the hotel keeps generating it.

### 8.3 A second ladder
CEFR tops out. Job mastery does not. After B1, the ladder switches from **level** to **scope**: more situations, harder guests, mentoring, cross-role, second language.

### 8.4 The weekly live moment
A 5-minute property-wide challenge at a fixed hour, announced by WhatsApp. Appointment dynamic + group quest + social. Cheap to run, and very hard for a consumer app to copy because it requires the property.

---

## 9. ARCHITECTURE — WHERE EACH THING LIVES

This is determined by economics, not preference.

> **WhatsApp is zero-rated on ~59% of Mexican mobile lines. Our PWA is not.**

Telcel's *Amigo Sin Límite* packages include WhatsApp text, voice notes, photos, and calls **without consuming the data allowance**. Telcel holds 58.9% of Mexican mobile lines. **79.3% of Mexican cellphone users are prepaid-only; 16.7% of smartphone users are Wi-Fi-only.**

Every minute of audio we deliver in the PWA costs the learner money. The same audio in WhatsApp costs them nothing.

| Surface | Carries | Why |
|---|---|---|
| **WhatsApp** — *"la práctica diaria"* | PREPARA, CAPTURA, all audio, the daily habit, the weekly challenge | Zero-rated. Free to the learner. Where the habit can actually live. |
| **PWA** — *"el examen y tu progreso"* | Placement exam, monthly assessment, recording + scoring, progress, certificates | Needs the microphone, the screen, and the record. Worth the data cost occasionally. |
| **HR dashboard** | Everything the buyer buys | Desktop, on property Wi-Fi. |

**Do not deep-link from a WhatsApp message into the PWA for routine daily practice.** The moment they tap, they leave zero-rated territory and start burning prepaid data.

**Do not build a native app.** Download cost, storage cost, and it forfeits the zero-rating advantage.

### Habit engine
**Push notifications have a 3.1–3.4% median open rate.** A daily habit cannot be built on push. **WhatsApp template messages are the habit engine**; push is a secondary nudge.

### Unit economics
Design the loop so the **learner sends the first message** (a 07:00 utility template: *"responde LISTO para tu práctica"*), which opens a free 24-hour service window inside which every subsequent turn is free. One paid utility template per learner per day ≈ **$0.24 USD/learner/month** — trivial against a $150–500/property subscription. Categorize as *utility*, never *marketing*: it is a 4–5× cost difference.

---

## 10. SCALING BEYOND ENGLISH AND BEYOND HOTELS

The method is language-agnostic and sector-agnostic by construction. What changes and what doesn't:

**Stays fixed (the IP):** the diagnosis pattern, the four-movement loop, the five laws, interference-aware scheduling, the two personas, the padrino endgame, the WhatsApp-first architecture.

**Swaps per language:** the minimal-pair inventory (L1 → L2 phoneme conflicts are a lookup table — Portuguese→English, Spanish→French, Haitian Creole→Spanish all have known closed sets), and the frequency list.

**Swaps per sector:** the situation library and role taxonomy. Hospital orderlies, airport ground staff, retail, elder care, call centers — every sector where a frontline worker's language failure has an economic cost to an employer who will pay to fix it.

**The moat compounds in the right direction.** Every CAPTURA in every property makes the situation library better for every future customer, in a way a new entrant cannot replicate without the same installed base.

---

## 11. BUILD ORDER

Ranked by leverage per unit of effort. Not a wish list — a sequence.

> **Corrected after measuring the live content pool.** See `PRODUCT-AUDIT.md` §2.
> There are **5 drills per (module, level)**. A learner exhausts everything at their
> level in **five days**, and a 14-day pilot runs more than twice that long. The
> combinatorial engine was originally ranked P3; it is a **pilot-blocker** and moves to P0.

### P0 — Do these before selling another pilot
1. **Combinatorial drill generation** (§6.5). Breaks the 5-drill ceiling. Without it, engagement decays *inside* the trial we sell.
2. **Split the Coach from the Evaluator** (§7). Prompt-level change, no schema migration. Removes daily scoring.
3. **Lapse-recovery doctrine** (Law 5). Small logic change; protects every cohort from silent death.
4. **Minimal-pair trainer + Semana Sin Pena** (§5). The method's opening move, and the demo that sells.
5. **`interference_group` tagging + scheduler constraint** (§6.1). 30% learning-rate gain at zero learner cost.

### P1 — The loop
6. **CAPTURA over WhatsApp** (§4). The single most valuable interaction in the system.
7. **Move daily audio into WhatsApp** (§9). Removes the learner's data cost, fixes the habit engine.
8. **PREPARA scheduling** driven by yesterday's CAPTURA plus SRS due items.
9. **Taxonomy migration** — add `language`, generalize `module` from CHECK to FK (§10). Trivial at 60 rows, expensive at 60,000.

### P2 — Depth
10. **Las Primeras 400 per role** (§6.4)
11. **Own-voice recording as card audio** (§6.3)
12. **Back-chaining production drill** — build long utterances backwards: `…to your room` → `…your luggage to your room` → `Would you like me to bring your luggage to your room?`
13. **SRS extended to utterances and phonemes** (§6.2) — currently words only

### P3 — The endgame
14. **Padrino/Madrina program** (§8.1)
15. **Weekly live challenge** (§8.4)
16. **Second ladder beyond CEFR** (§8.3)

---

## APPENDIX — WHAT THE SOURCES SAID, AND WHERE

| Source | What we took |
|---|---|
| **Fluent Forever** (Wyner) | Five memory principles; interference law; SRS intervals; pronunciation-first; personal connection; the pre-made deck problem; lapse-recovery doctrine |
| **Actionable Gamification** (Chou) | 8 Core Drives; White/Black Hat; four experience phases; the Endgame answer (evergreen + mentorship); Evolved UI |
| **Design for How People Learn** (Dirksen) | The five gaps; motivation vs knowledge diagnosis; rehearsed self-efficacy; environment as instructional design |
| **Chris Lonsdale** (TEDx) | Five principles / seven actions; the language parent; "a drowning man cannot learn to swim"; comprehensible input; state |
| **Dr. Tommy Wood** (Huberman Lab) | Effortful practice and cognitive capacity |
| **GIST 2019 / Goswami & Chen 2010** | The Spanish-L1 problematic phoneme inventory; evidence that explicit segmental instruction works |
| **INEGI ENDUTIH 2025 · Telcel · IFT** | Prepaid share, Wi-Fi-only share, zero-rating, carrier weight |
| **Microsoft Spanish (Mexico) Style Guide** | `tú` over `usted`; no third-person "the user"; no leísmo |
| **EF EPI** | Cancún 414 vs national 440 — the market fact |
| **Refactoring UI · Atomic Design** | Visual craft and component architecture for the PWA |
| **Hooked** (Eyal) | Trigger → Action → Variable Reward → Investment applied to the daily WhatsApp habit |

---

*El turno es el salón de clases.*

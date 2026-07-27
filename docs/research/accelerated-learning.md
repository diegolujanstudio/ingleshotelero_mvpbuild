# Accelerated Learning — Madhan Kumar (2020)
## Mining notes for Inglés Hotelero
### Lens: encoding strategies, multi-sensory learning, review scheduling, state/emotion effects on retention, concrete 5-minute-session protocols

---

## 0. Source quality assessment (read this first — it changes how you weight everything below)

**This is a low-quality source and you must treat it accordingly.**

Three things are true about the text at
`corpus/accelerated-learning.txt` (1,004 lines, ~50k words):

1. **It is machine-paraphrased.** The whole text has been run through a synonym
   swapper — "accelerated learning" → "quickened learning", "brain" → "cerebrum",
   "focus" → "core interest", "regression" → "relapse". This is a red flag for a
   content-farm book, not a research monograph. It cites almost nothing precisely.
2. **~45% of the book is filler.** Chapter 5 is an Elon Musk biography. Chapter 9
   is Tony Robbins / Kiyosaki / Gary Vaynerchuk / Grant Cardone hustle content with
   zero learning science. Chapter 3 is SMART goals. Chapter 11 is a two-page
   "make a plan" worksheet. None of this belongs anywhere near our product.
3. **The remaining ~55% is a competent, if shallow, restatement of real cognitive
   psychology** — encoding/storage/retrieval, chunking and working-memory limits,
   distributed practice, spaced repetition, sleep consolidation, interleaving,
   the protégé effect, retrieval practice, elaborative/imagery encoding, and
   state effects on encoding. Those parts are consistent with the literature and
   are what we mine.

**Where the book makes empirical claims, verify before quoting externally.** Two
in particular are shaky:
- **Lozanov / Suggestopedia (Ch. 1, line 31):** "416 students learned 80 foreign
  words in one hour vs. the usual 7." This is the classic suggestopedia claim.
  It has never been independently replicated at that magnitude. *Use the
  mechanism (relaxed affective state + music + multisensory framing improves
  encoding) — do not use the number in a sales deck.*
- **Speed reading (Ch. 4, lines 277–390):** the entire Tim Ferriss / peripheral
  vision / "eliminate subvocalisation for +200%" section is not supported by
  reading science, and comprehension collapses at those WPMs. **This chapter is
  worthless to us and actively dangerous** — see Anti-pattern A6.

Net: mine it hard for mechanism, discard the hustle-porn and the speed reading,
and never cite it as an authority.

---

## 1. The book's actual spine

### 1.1 Lozanov's four "central principles" of Accelerated Learning (Ch. 1, line 44)

Verbatim from the source:

> • We humans have multiple senses and the more you engage them, the better you will learn.
> • When you create resources, you build energy and that is more efficient than consuming content when it comes to learning.
> • The more variety you get as a learner, the better you learn.
> • You learn best when in an inspiring, accommodating and relaxed environment.

Also, the AL foundational premise (Ch. 1, line 36):

> "knowledge is not something you are supposed to absorb but something you need to create"

**Why this matters to us.** Every one of those four principles is a direct
indictment of the way most language apps — including ours today — deliver
content. We currently deliver a *consumption* loop: hear audio → tap the right
Spanish option → read a model phrase → flip three flashcards. Only one of those
four steps is production. Principle 2 says production beats consumption; principle
1 says single-channel (tap) encoding is the weakest available; principle 3 says
our fixed 3-step template will decay in effectiveness; principle 4 says the
emotional frame around a tired, embarrassed bellboy is a first-class variable, not
decoration.

### 1.2 Memory model (Ch. 6, lines 518–548)

Three stages: **encoding → storage → retrieval.**

Encoding "registers the sounds, physical feeling, images and other sensory
details" of the event. The book's worked example (line 524): remembering a
cooking competition is built from smell + sound + sight simultaneously, and any
one of those channels can later trigger the memory.

**The three determinants of encoding quality (line 526–533) — this is the single
most actionable list in the book:**

| Factor | Sub-factors (verbatim) | Direction |
|---|---|---|
| **Content** | "The higher the degree of familiarity, the easier the encoding." | more familiar → better |
| | "The better the degree of organization in the material, the easier the encoding." | more pre-organized → better |
| | "The higher the volume of the material, the more difficult it is to encode." | more volume → worse |
| **Environment** | "socio-emotional climate, affection, noise, humidity, temperature" | can inhibit *or* stimulate |
| **Subjective** | "your emotional state or current mood, interests, motivation, health and sleep or fatigue" | gates everything |

Retrieval splits into **recognition** (cued — "you recognize a familiar face")
and **recall** (uncued — "you have to remember an object, event, or fact solely
from your memory"). The book explicitly states recall is harder than recognition
(line 546).

**Why this matters to us.** Our entire daily drill is currently *recognition*:
three Spanish options, tap the right one. That is the easy mode. It produces the
feeling of learning without the encoding strength of recall. And the "Subjective"
row is the row nobody in a product team ever builds for: our learner arrives at
the drill post-shift, fatigued, on a phone, possibly ashamed of their English.
The book says flatly that fatigue and emotional state determine whether the
encoding happens at all.

### 1.3 The mnemonic / encoding toolkit (Ch. 6, lines 551–611)

Eight named techniques. Ranked by usefulness to us:

1. **Chunking (line 555).** `233472856420` vs `2334-7285-6420`. Cites U. Missouri
   / PNAS: **working memory holds ~4 distinct items**; grouping raises effective
   capacity. Explicitly recommends chunking for language learners: "group words
   into categories like greetings, food items, plural, singular words."
2. **Spaced repetition (line 594).** Concrete expanding schedule given:
   **first review at 2–4 days, then 8, 11, 15, 21 days**, until it is long-term.
   Framed as "conquering forgetting."
3. **Visual mnemonics (line 565).** Three sub-rules:
   - *"Employ as many of your senses as possible"* — encode colour, temperature,
     texture, smell alongside the fact.
   - *"Animate your images"* — **"the crazier your images get, the better it is
     for you to recall them"** (line 571). Bizarre/vivid > neutral.
   - *Sound-to-image mapping for names* — "Kane" → sugar cane.
4. **Music mnemonics (line 581).** Melody supplies "a structure of information and
   then encourages you to perform repetition." Cites the ABC song, "Fifty Nifty."
   Claims musically-encoded memories can last "a very long time, or even forever."
   Explicitly invites turning hard subjects into songs.
5. **Linking / chaining (line 605).** Turn a list into one absurd narrative;
   "the more details you add, the better your chances of recall."
6. **Acronyms & acrostics (line 577).** KFC; "My Very Educated Mother…"
7. **Rhyming peg system (line 586).** one=bun, two=shoe… for ordered lists.
8. **Method of loci (line 601).** Familiar room, place items on objects, re-walk it.

### 1.4 The learning-speed techniques (Ch. 4, lines 213–276)

- **T1 — Deconstruct the skill into small pieces (line 214).** The stated
  mechanism is motivational, not just cognitive: *"When a task looks big and
  challenging to you, what usually happens is you begin looking for distractions
  because you really don't know where to start."* Worked example: learning to
  drive decomposed into pedals/gears → dashboard → drive+reverse → parking.
- **T2 — 80/20 (line 224).** Two applications given. (a) find the *one* study
  modality that works for you and drop the rest. (b) **Language-specific, line
  238: "the top 100 most common words … make up around 50% of the total written
  content in all languages."**
- **T3 — Pomodoro (line 239).** 25 on / 5 off; single-task hard inside the 25.
- **T4 — Teach what you studied (line 252).** Cites a Washington University in
  St. Louis study: *merely expecting to teach* accelerates learning and raises
  recall. Mechanism given: you spontaneously adopt teacher-style organisation —
  "seek out key points … then organize that information into a logical structure."
- **T5 — Distributed practice (line 258).** Explicit protocol:
  > Step 1: take notes when a topic is taught.
  > Step 2: take one or two days off *before* you review. Session under one hour.
  > Step 3: spread revision to three times a week.
  And the killer line (267): a person who reviews Mon/Wed/Fri beats the person
  who reads the same content once a week for three hours.
- **T6 — Napping / sleep (line 269).** University of Lyon study, 40 students,
  16 French→Swahili word pairs, two sessions. "Wake" group: both sessions same
  day (morning + evening). "Sleep" group: evening session, sleep, then morning
  session. **Recall: sleep group 10/16, wake group 7.5/16.** Also cites
  *Psychological Science*: sleep between study sessions helps recall **up to six
  months later.**

### 1.5 Focus (Ch. 7)

Mostly generic, but three usable items:

- **Cost of an interruption: up to 25 minutes to refocus (line 631).** And the
  book's claim that people focus on their work ~6 hours/week (David Rock).
- **Micro-breaks (line 497): "a 30-second micro break can increase your level of
  production by 30%."** Recommends 5–10 min break after every 30 min.
- **Doodling (line 702).** Mechanism given: when you stop attending, the brain
  drops into default mode and stops taking in the environment; a small continuous
  motor act keeps it out of default mode. → *motor engagement sustains attention.*
- **Re-engineer information to make it interesting (line 691).** Same multisensory
  move: don't read about baking, bake — texture, aroma, sight. "This activates
  different parts of your brain … more neural connections and therefore heightens
  your focus."

### 1.6 Obstacles & mistakes (Ch. 10) — the highest-value chapter

This chapter is where the book most sharply contradicts naive product design.

- **Obstacle 1 — Focusing too much on one thing (line 911).** *"Your brain
  naturally craves to learn different things within the day since that is how it
  works more efficiently."* Two prescribed remedies: **(a) vary the *modality*
  on one subject** (theory / practical / group / tutorial, switched through the
  day); **(b) vary the *subject* itself.** This is interleaving, stated plainly.
- **Obstacle 2 — Not paying attention to basics (line 922).** Shortcuts (80/20)
  fail if you skip the groundwork of identifying what the vital 20% actually is.
  "Always strive to master the basics of a skill first before you implement it."
- **Obstacle 3 — Not believing in yourself (line 928).** Self-efficacy as gate.
- **Obstacle 4 — Comparing yourself to professionals (line 931).** *"it's very
  easy for you to be discouraged by the abilities of professionals."* Prescribed
  fix: compete against your own prior self, not the leaders.
- **Obstacle 5 — Not celebrating your success (line 937).** Explicit mechanism:
  *"Celebrating your achievements activates the reward circuits in your brain.
  The neurotransmitter dopamine is released when you celebrate something."* And
  the failure mode: attending only to what you missed "decreases your motivation
  … the chances of you quitting French become very high."
- **Obstacle 6 — Procrastination (line 944).** Diagnose the *reason* (unpleasant?
  perfectionism? don't know where to start?) then match the countermeasure.
- **Mistake 1 — Not interested in what you're learning (line 958).** "No subject
  is boring… connect whatever you are learning with something that you care about."
- **Mistake 2 — Memorizing instead of understanding (line 966).** PEDMAS example:
  knowing *why* the order exists survives; the acronym alone doesn't.
- **Mistake 3 — Not doing enough practice (line 969).** **"You may think that
  re-reading a book or going through your notes is practising but it isn't and
  that is where you go wrong."** Two legitimate forms: (a) perform the skill,
  (b) **self-test from memory without referring to your notes**, then check.
- **Mistake 4 — Not choosing the right environment (line 976).** The sharpest
  idea in the book: *a demanding real project at work beats any evening class,
  because it "puts you under pressure to perform better than you do in ordinary
  conditions."* And: **"if you want to learn to speed-read, you have a better
  chance of learning faster if you join a reading competition rather than
  practising fast reading on your own."** Consequence > instruction.

---

## 2. What we build, change, or stop doing

This section is the point of the exercise. Ranked by leverage for Inglés Hotelero.

---

### P1. Make the daily drill **production-first**, not recognition-first
*(Ch. 6 recall-vs-recognition line 546; Ch. 10 mistake 3 line 969; Ch. 1 principle 2)*

**What's wrong today.** `src/content/practice-drills.ts` defines the daily loop as
`listening → reinforce → vocabulary`. Step 1 is a 3-option multiple choice
(recognition). Step 2 (`reinforce`) *displays* `model_en` and speaks it — pure
re-exposure, which the book names explicitly as the thing people mistake for
practice. Step 3 is flashcards. The file's own comment says
*"V1 deliberately omits the speaking step from the daily flow."* **That decision
is the single biggest learning-quality bug in the product.**

**Build.** Restructure the 5-minute session so the learner *produces the target
English out loud at least twice*, always before ever seeing the model:

```
0:00–0:20  ANCLA      one line of Spanish: the exact shift moment. No English yet.
0:20–1:10  ESCUCHA    guest audio (real TTS). Learner picks the action. (recognition — kept, it's the on-ramp)
1:10–2:20  DILO       "¿Qué le contestas?" → mic opens. Learner speaks BEFORE seeing model_en.
                      Free production, scored leniently (A1: any attempt in English ≥ 60).
2:20–2:50  COMPARA    now show model_en + the learner's own transcript, side by side, diffed.
2:50–4:00  REPITE     learner says the model phrase back. Shadowing. Second production.
4:00–5:00  RECUERDA   3 retrieval cards — see §P3, no multiple choice.
```

**Concretely:** add a `produce` step to the `Drill` type in
`src/content/practice-drills.ts`; reuse the existing MediaRecorder component from
`/exam/[id]/speaking` and the `/api/score-speaking` pipeline. The scoring rubric
already exists and already says be generous at A1–A2 — that is exactly the
calibration this step needs.

**Stop doing.** Stop shipping `reinforce` as a *read-this-phrase* card. Re-exposure
is not practice.

---

### P2. Rebuild the spacing engine so it schedules **phrases and job moments**, not just vocabulary
*(Ch. 6 line 594 expanding schedule; Ch. 4 T5 distributed practice line 258)*

**What's wrong today.** We have a correct SM-2 implementation at
`src/lib/practice/sm2.ts` (EF 2.5, floor 1.3, 1d → 6d → ×EF) — but it only drives
**vocabulary cards** (`src/lib/practice/vocab.ts`). The *drill* picker
(`src/lib/practice/picker.ts`) has **no spacing model at all**: it filters by
level, applies a weak-skill weight from 14 days of history, demotes anything done
in the last 3 days, then does `day_of_year % candidates.length`. That is rotation,
not scheduling. The thing the learner actually needs to retain — the *utterance*
("Of course, sir. Let me take your luggage to your room.") — is on a round-robin.

**Build.** Promote the schedulable unit from `vocab_item` to **`phrase`**. Every
`reinforce.model_en` and every `produce` target becomes an SM-2 card whose grade
comes from the speaking score, not from a self-report button:

```ts
// src/lib/practice/phrase-sm2.ts
export function speakingScoreToGrade(score: number): Grade {
  if (score < 40) return 1;   // said nothing usable → reset interval
  if (score < 60) return 2;   // attempted, unintelligible → reset
  if (score < 75) return 3;   // correct with serious difficulty
  if (score < 90) return 4;   // correct with hesitation
  return 5;                    // fluent
}
```

**Also build:** a floor-and-ceiling wrapper on SM-2 intervals for this population.
Canonical SM-2 will happily schedule a card 40 days out. A bellboy who last said
"Would you like a wake-up call?" 40 days ago cannot say it on shift. Cap
`interval_days` at **21** for phrases (the book's own terminal interval, line 598),
uncapped for passive vocab.

**Do NOT replace SM-2 with the book's fixed 2/8/11/15/21 ladder.** SM-2 is
strictly better — it is adaptive. Use the book's ladder only as the *initial*
interval sequence for a brand-new learner with no grade history, and as the
sanity bound. Say so out loud if anyone proposes "the book says 2-4 days."

---

### P3. Kill multiple choice from the review step; make it **cued recall**
*(Ch. 6 line 546 recall > recognition; Ch. 10 mistake 3, line 975 "self-test yourself")*

**What's wrong today.** Vocabulary is a flip-card with `no / hard / good / easy`
self-grading (`uxGradeToSm2`). Self-grading a flipped card is recognition plus an
honesty tax. Our learner — tired, low prior success, embarrassed — will over-rate.

**Build.** Three retrieval formats, rotated (which also satisfies P5 variety):
- **Voice cloze.** "El huésped pide ayuda con las maletas. Dile: ___" → mic. Scored.
- **Spanish→English typing, 1 word.** Cheap on data, works one-handed, no mic
  needed on a noisy shift floor. Fuzzy-match with Levenshtein ≤ 2 counted correct.
- **Reverse audio.** Play the model English; learner taps *which guest situation*
  it answers. (This is the only recognition format kept, and only 1 in 3.)

Every one of these produces an objective grade → feeds P2's SM-2 honestly.

---

### P4. Treat **emotional and physical state as a gating variable** and build a 20-second state-change ritual
*(Ch. 6 "Subjective" encoding factor line 533; Ch. 1 principle 4; Ch. 9 Robbins "state changing" line 834)*

The book is unambiguous: *"emotional state or current mood, interests, motivation,
health and sleep or fatigue"* determine whether encoding happens. Our learner's
default state at drill time is the worst case on every one of those axes.

**Build — three things:**

1. **Ask, then adapt.** First screen of the session, one tap, three states:
   `Con energía / Normal / Cansado`. If `Cansado`: drop to a **2-minute session**
   with *review only, zero new items*, and say so —
   *"Hoy sólo repasamos. Dos minutos."* This is not a lesser session; per the
   encoding-volume rule (line 529) it is the *correct* session for that state.
   Log the state on `drill_history`; it is also a genuinely novel HR metric
   (fatigue by shift pattern) the buyer has never been shown before.
2. **A 15-second opener that lowers threat.** Lozanov's whole finding is that the
   affective frame precedes the content. One line, name used, zero English:
   *"Buenas, Ramón. Ayer clavaste 'Let me take your luggage'. Hoy, tres minutos."*
   Never open with a score, a percentage, or a red state.
3. **Never show a red/error state on a first attempt.** Map wrong answers to
   `warn` (`#B38540`) not `error` (`#A84738`). Reserve `error` for system
   failures only. Shame is an encoding inhibitor, and this population arrives
   pre-loaded with it.

**Stop doing.** Stop treating "user is tired" as a retention problem to be solved
with a push notification. It is an *encoding* problem, and pushing a full session
onto a fatigued learner produces a completed-session metric with near-zero
retention — the worst possible outcome, because it looks like success in the HR
dashboard.

---

### P5. **Interleave.** Never let a session be one skill, and never let the session template be fixed
*(Ch. 10 obstacle 1, line 911–921; Ch. 1 principle 3 "the more variety, the better")*

The book prescribes both axes of variety: vary the **modality** on one subject,
*and* vary the **subject**. Our current session is monotone on both — same three
steps, same order, every day, forever.

**Build.**
- **Modality interleaving:** a session draws its 4–6 beats from a pool of ~8 beat
  types (listen-and-act / say-it-cold / shadow / cloze / minimal-pair discrimination
  / order-the-phrase / role-flip where the learner plays the guest / one-question
  quiz on *why* the phrase is polite). The picker composes the session; it is not
  a fixed template.
- **Content interleaving:** within one session, mix items from **2–3 different job
  moments** (check-in + luggage + complaint), not five items from one. Blocked
  practice feels better and retains worse — say this to anyone who objects that
  "the session feels less coherent." It should.

**Change `src/lib/practice/picker.ts`:** replace `day_of_year % candidates.length`
with a composer that (a) pulls due phrases from SM-2, (b) enforces ≥2 distinct
`topic` values per session, (c) enforces ≥3 distinct beat types. The picker's own
TODO already admits the model needs a `topic` field — add it.

---

### P6. Cap new material at **4 items per session**, and chunk everything into job moments
*(Ch. 6 chunking, line 555–564; encoding-volume rule line 529)*

The book's cited limit is ~4 items in working memory, extended by grouping. It
also explicitly tells language learners to group by category.

**Build.**
- **Hard cap: ≤4 new items per session** (new = never seen). Everything else in
  the session is review. Enforce in the picker, not in content authoring.
- **Chunk the curriculum by *job moment*, not by grammar or by word list.** The
  unit of content is `momento`: *La llegada del taxi. El huésped se queja del
  aire acondicionado. Piden la cuenta y quieren dividirla.* Each `momento` bundles
  4–8 phrases + the vocab inside them. This is chunking at the curriculum level and
  it is also the thing that makes the content transferable to other sectors and
  languages later (a `momento` is language-agnostic; the phrases are not).
- **Teach phrases, not words.** A 4-word phrase is one chunk, and it is directly
  usable on shift. Four isolated words are four chunks and usable for nothing.
  Our current vocab cards teach `luggage / equipaje` in isolation — downgrade
  isolated-word cards to a supporting role behind phrase cards.

---

### P7. Build the **80/20 corpus from real hotel transcripts**, not from frequency lists — and say so in the pitch
*(Ch. 4 T2, line 238; Ch. 10 obstacle 2 "not paying attention to basics", line 922)*

The book says the top-100 general words are ~50% of written content. **For us that
is the wrong 100.** Our learner does not need "because / people / world." They need
*"May I have your passport, please?"*, *"Would you like a wake-up call?"*,
*"I'll send someone right away."*

The book's obstacle 2 is precisely the warning: 80/20 fails when you skip the
groundwork of *determining what the vital 20% actually is.* That groundwork is
our defensible IP and we have not done it.

**Build.**
1. Instrument the pilot: get 20–40 hours of transcribed real guest↔staff exchanges
   per role (or, cheaply, structured interviews with 15 front-desk agents:
   *"list every English sentence a guest said to you last week"*).
2. Rank by **frequency × consequence** (a phrase that prevents a bad review or a
   comp'd night outranks a common pleasantry).
3. Freeze a **"Core 120"** per role. Publish the number. *"120 frases. Ésas son el
   80% de tu turno."* That is a far stronger claim to an HR director than
   "A1 to B2 curriculum," and it is the single sharpest wedge against Duolingo,
   which optimises general-purpose frequency.

---

### P8. Add the **protégé step** — "explain it to the new hire"
*(Ch. 4 T4, line 252; Ch. 10 mistake 2 "memorizing instead of understanding", line 966)*

Merely *expecting to teach* improves organisation and recall. Nobody in this
category builds it.

**Build.** Once per week, one beat: *"Llega un compañero nuevo. En 20 segundos,
explícale cuándo se dice 'Right away, sir' y cuándo 'One moment, please.'"* Mic
opens; the learner explains **in Spanish**. We score it for *conceptual*
correctness (does the distinction land?), not English quality.

**Two products fall out of this for free:**
- The best explanations become **peer-authored micro-content** — real audio from a
  real bellboy at that property, which is more credible to peers than any TTS.
- The HR dashboard gets a "mentores" signal: who can actually teach. HR directors
  will pay for that. It is a promotion/retention input, not a language metric.

This also fixes the "memorizing vs understanding" mistake: the `note_es` field we
already author (*"'Of course, sir' es más cálido que 'OK'"*) currently gets read
and forgotten. Make the learner *produce* that reasoning.

---

### P9. Bracket the second exposure across **sleep**, and schedule sends around shifts
*(Ch. 4 T6, line 269–272)*

Lyon: 10/16 vs 7.5/16 — a **33% recall advantage** from putting sleep between the
two exposures rather than a waking interval of the same length. Plus six-month
durability (*Psychological Science*).

**Build.** WhatsApp is the delivery channel that makes this trivially achievable
and it is where we can beat every app-only competitor.

- **Capture the shift pattern at onboarding** (matutino / vespertino / nocturno /
  rotativo). We already have a `Shift` enum in `src/lib/supabase/types.ts` — use it.
- **Two touches per day, deliberately sleep-bracketed:**
  - **Touch 1 (post-shift, ~30 min after shift end):** the full 5-minute session.
    New material lands here — closest to the real usage context, and it's the
    exposure that will be consolidated overnight.
  - **Touch 2 (pre-shift, ~45 min before shift start, i.e. after sleep):** a
    **60-second** WhatsApp retrieval ping on *yesterday's* items only.
    3 questions, voice-note answers accepted. This is the consolidation harvest
    *and* it primes the phrases immediately before they're needed on shift.
- For `nocturno` staff, "sleep" is daytime — the algorithm keys on shift boundaries,
  not on clock hours. Nobody does this. It is a genuinely differentiating detail.

**Stop doing.** Stop thinking of the WhatsApp drill as a *reminder to open the app*.
It is a second, sleep-separated encoding event — the highest-leverage 60 seconds
in the whole system.

---

### P10. Move practice **into the shift** — consequence beats instruction
*(Ch. 10 mistake 4, line 976–982)*

The most important paragraph in the book: an evening class never beats a demanding
real project, because the project *"puts you under pressure to perform better than
you do in ordinary conditions."* And: join a reading competition rather than
practising alone.

**This reframes the whole product.** We are currently building a better
*adjacent* practice loop. The book says the adjacent loop is structurally capped.

**Build — the Misión del Turno (Shift Mission).** One phrase per shift, assigned
before it starts, to be used **with a real guest**:

> **Misión de hoy:** usa *"Would you like me to store your luggage until check-in?"*
> con un huésped real. Al terminar tu turno, cuéntame cómo te fue.

At shift end, one WhatsApp message: `¿La usaste?` → `Sí / No pude / Casi`.
If `Sí`, a 15-second voice note: *"¿Qué te contestó?"*

Why this is the highest-leverage single feature in these notes:
- It is the only mechanism that produces **real-world retrieval under real stakes**.
- It converts our metric from "sessions completed" (a vanity metric HR can smell)
  to **"phrases used with real guests"** — which is literally the outcome the buyer
  is purchasing. *"Tus 40 empleados usaron 312 frases con huéspedes reales este mes"*
  is a renewal-winning line that no competitor can produce.
- It costs almost nothing to build: one scheduled message, one 3-button reply, one
  optional voice note.
- It requires supervisor buy-in — which is a *feature*, because it makes the
  product sticky inside the org rather than sitting on a personal phone.

**Risk to manage:** a learner who is told to perform in front of a guest and fails
may be humiliated — which per P4 is an encoding poison. Mitigate: missions are only
assigned for phrases already at SM-2 grade ≥4, the mission phrase is always
*low-risk* (never the complaint-handling ones early on), and the shift-end question
is framed with `No pude` as a fully acceptable answer with zero streak penalty.

---

### P11. Multi-sensory encoding: **hear + say + see + move**, on every item
*(Ch. 1 principle 1; Ch. 6 visual mnemonics line 568; Ch. 7 doodling line 702 and
"re-engineer information" line 691)*

The book's mechanism for doodling is that a small continuous motor act keeps the
brain out of default mode. Its mechanism for imagery is that vivid, *animated*,
weird images encode far better than neutral ones.

**Build.**
- **A motor act every ≤15 seconds.** No screen may be passive for longer. Tap,
  drag-to-order the words of a phrase, trace, or speak. This is a hard UI rule.
- **Vivid, specific, slightly absurd imagery on phrase cards — not stock photos.**
  The book: *"the crazier your images get, the better."* For `"Let me take your
  luggage"`, a neutral photo of a suitcase encodes weakly; a specific, memorable
  illustration encodes strongly. **Design-system caution:** we cannot do bright
  cartoon gradients — that violates *Editorial, no aplicación* and *Una sola nota
  de color*. The resolution is **specificity, not loudness**: single-colour ink
  line illustrations that are *unusual in composition* (an oversized suitcase, a
  guest with eleven bags) rather than unusual in palette. Get Diego to rule on this
  before building; it is exactly the kind of requirement that pushes on the tokens.
- **Audio is non-negotiable.** We already have ElevenLabs wired
  (`src/lib/tts`). Browser `SpeechSynthesis` fallback is acceptable for demo only —
  a robotic voice actively harms the listening-discrimination skill we're training.
  Pre-generate and cache real audio for the Core 120; that's a bounded, ~120-file
  job per role, and it also solves the offline/data-cost problem.

---

### P12. Progress must be **self-relative**, never peer-comparative
*(Ch. 10 obstacle 4, line 931; obstacle 5, line 937)*

Two book findings collide here, and together they produce the sharpest
anti-Duolingo position we have:

- Comparing yourself to high performers *"discourages you from learning."*
- Not celebrating *"decreases your motivation … the chances of you quitting French
  become very high."* Celebration releases dopamine and drives repetition.

**Build.**
- **Never ship a leaderboard ranking employees against each other.** Duolingo's
  leagues work because their user is a self-selected motivated hobbyist. Ours is
  a tired employee whose *boss* can see the board. A public ranking in a workplace
  hierarchy converts a learning tool into a performance-review threat. It will
  suppress attempts, which suppresses production, which suppresses encoding.
- **Ship "tú vs. tú hace 30 días" instead.** *"Hace un mes no podías contestar
  esta pregunta. Hoy sí."* Where possible, **play back their own recording from
  30 days ago against today's.** That is a viscerally motivating artefact and we
  already store the audio.
- **Celebrate specifically and soberly.** Not confetti (violates the design
  system, and reads as condescending — violates *Respeto, no condescendencia*).
  The celebration is: name the exact phrase, name where it's used, mark it
  mastered. *"Dominaste: 'I'll send someone right away.' Ya la puedes usar en
  cualquier queja."* Ink, not gold stars.
- **Team-level aggregate is fine and good** — *"tu equipo dominó 47 frases esta
  semana."* Cooperative, not comparative. The book's Ch. 2 point 3 (line 67)
  independently supports the social/collective framing.

---

### P13. The HR dashboard should report **encoding-relevant** metrics, not activity
*(Ch. 6 encoding factors; Ch. 10 obstacle 5)*

Right now `/hr` reports sessions and levels. Under this book's model the
retention-predictive quantities are: production count, retrieval success at
interval, sleep-bracketed second-touch completion, and real-use events.

**Build these four HR metrics** (all cheap once P1/P2/P9/P10 exist):
1. **Frases producidas** — count of learner-spoken utterances, not sessions opened.
2. **Frases retenidas a 21 días** — items still passing at the terminal interval.
   This is the honest retention number and it will be lower than anyone expects.
   Ship it anyway; it is credibility.
3. **Frases usadas con huéspedes reales** — from P10. The headline number.
4. **Fatiga por turno** — from P4's state tap. Novel, operationally useful to a GM,
   and costs one tap to collect.

**Stop reporting** minutes-in-app as a headline. It rewards the wrong thing and an
HR director who has been sold SaaS before will discount it.

---

### P14. Use rhythm/chant for the highest-frequency phrases
*(Ch. 6 music mnemonics, line 581–585)*

Genuinely underused in this category and cheap. Melodic/rhythmic encoding supplies
"a structure of information and then encourages repetition," and is unusually
durable.

**Build a bounded experiment, not a feature:** take the **12 highest-frequency
phrases per role** from the Core 120 and produce a 40-second rhythmic
call-and-response audio track (steady beat, English phrase, gap, learner repeats).
Ship it as an optional `/practice/ritmo` beat and as a WhatsApp voice note.
Measure 21-day retention on those 12 vs. 12 matched controls. If it wins, expand.
If it doesn't, we spent one afternoon.

**Caution:** it must not read as childish. *Respeto, no condescendencia.* Reference
the register of a work chant or a professional drill, not a nursery rhyme. If it
can't be made to feel adult, kill it.

---

### P15. Decompose "English" into named micro-skills the learner can see
*(Ch. 4 T1, line 214–223)*

The stated mechanism is motivational: a task that looks big drives avoidance.
"Aprender inglés" is the biggest, most avoidance-inducing task our learner has
ever failed at. **Never show them that framing.**

**Build.** The learner never sees "inglés" or "A2→B1" as their goal. They see a
visible ladder of `momentos`:

```
Recepción · 14 momentos
✓ La llegada          ✓ Registro           ✓ Formas de pago
● La queja del ruido  ○ Cambio de cuarto   ○ El check-out tardío   …
```

CEFR level stays — but it becomes **the buyer's metric on the HR dashboard**, not
the learner's. The learner's metric is `momentos dominados`. This is a two-audience
product and the two audiences need two different progress ontologies. We currently
show one, and it's the wrong one for the learner.

---

## 3. Anti-patterns — where this book contradicts what a naive product team would build

Ranked by how likely we are to get this wrong.

**A1. "Blocked practice is clearer, so teach one topic per session."**
The book (Ch. 10 obstacle 1) says the brain *"craves to learn different things
within the day."* Interleaved sessions feel messier and retain better. Anyone who
argues our session should be more thematically coherent is optimising the wrong
feel-good signal. Push back hard.

**A2. "Showing them the correct phrase is teaching."**
Ch. 10 mistake 3, verbatim: re-reading *"isn't"* practice. Our `reinforce` step is
exactly this. Every re-exposure screen must be preceded by an attempt.

**A3. "Add a leaderboard — Duolingo's leagues work."**
Ch. 10 obstacle 4. Their user opted in; ours was enrolled by their boss and is
being watched by them. Peer ranking in a workplace hierarchy inhibits attempts.
This is the clearest case in the notes where copying the category leader is wrong.

**A4. "Multiple choice is the friction-free format for a low-literacy, low-data user."**
It's frictionless *and* it's recognition (Ch. 6, line 546), which is the weak
retrieval mode. The right move is to keep entry friction low via *format variety*
(voice, one-word typing, ordering) — not by making everything a tap.

**A5. "Streaks and daily-completion metrics prove the product works."**
Ch. 10 obstacle 5 supports celebration, but Ch. 6's subjective-state factor and
Ch. 10's environment finding say a completed session by a fatigued learner encodes
close to nothing. A green streak on the HR dashboard that isn't backed by 21-day
retention or real-guest usage is a metric that will lose us the renewal the moment
the GM asks a bellboy to say something in English.

**A6. "Speed reading is part of accelerated learning, so add fast-reading drills."**
The book devotes ~15% of its length to this (lines 277–390) and it is the weakest,
least-supported material in it — and it is *aggressively* wrong for our learner,
who has low prior academic success and reads Spanish, not English. **Every screen
should be readable in under 10 seconds. Text is our enemy, not our medium.**
Discard this chapter entirely.

**A7. "Onboard with goal-setting: let them define their SMART objective."**
Ch. 3 spends 90 lines on this. For a hobbyist, fine. For a bellboy enrolled by HR
after a 12-hour shift, a goal-setting worksheet is pure friction and the goal is
already externally imposed. **The system sets the goal; the learner just starts.**
Give the SMART framing to the *HR director* during onboarding — they're the one
who needs a measurable target to defend the budget.

**A8. "Motivational mindset content will get them to come back."**
Ch. 8 and Ch. 9 are 200 lines of mantras, gratitude, and Grant Cardone. Zero of it
belongs in the product. The book's own Ch. 10 mistake 4 refutes it: environment and
consequence beat exhortation. Build the Misión del Turno, not a motivational quote
card.

**A9. "Let learners self-grade their flashcards — it's the standard SRS UX."**
Fine for Anki's self-selected user. Ours has low tolerance for friction and a
motive to over-rate (it ends the session faster and avoids the embarrassment of
"no"). Derive grades objectively from speaking scores and typed answers (P2/P3).

**A10. "New content every day keeps them engaged."**
Ch. 6's volume rule (line 529) and the ~4-item working-memory limit say the
opposite. **A session that is 80% review and 20% new is the correct session.** New
content is the cheap dopamine that competitors sell; retention is what our buyer
is actually paying for.

---

## 4. The concrete 5-minute protocol (synthesised)

Everything above, collapsed into one buildable spec.

```
PRE-SESSION (system, no UI)
  · picker composes from: due SM-2 phrases  +  ≤4 new items
  · enforce ≥2 distinct `momento` values, ≥3 distinct beat types  [P5]
  · if learner state = "cansado" → review-only, 2 min, 0 new       [P4]

0:00  ESTADO      1 tap: energía / normal / cansado                [P4]
0:10  ANCLA       Spanish, one line, names the shift moment. No English. [P15]
0:30  ESCUCHA     real TTS guest line → tap the action              [P11]
1:15  DILO        mic opens BEFORE the model is shown. Free production. [P1]
2:15  COMPARA     learner's transcript vs model_en, diffed          [P1]
2:45  REPITE      shadow the model. Second production.              [P1]
3:30  RECUERDA    3 retrieval beats, rotated formats, objectively graded [P3]
4:40  CIERRE      name the exact phrase mastered. Self-relative.    [P12]
                  assign tomorrow's Misión del Turno.               [P10]

+ ~8h later, post-sleep, pre-shift:
0:00  WHATSAPP    60s, 3 retrieval questions on yesterday's items,
                  voice notes accepted. Sleep-bracketed second touch. [P9]

+ at shift end:
      WHATSAPP    "¿Usaste la frase?"  Sí / Casi / No pude
                  if Sí → 15s voice note: "¿Qué te contestó?"        [P10]
```

**Hard rules that fall out of the source:**
- ≤4 new items per session, ever. [P6]
- No screen passive for >15 seconds. [P11]
- No re-exposure before an attempt. [P1/A2]
- No peer ranking, ever. [P12/A3]
- Wrong answers render `warn`, never `error`. [P4]
- Every session ends on a named, specific win. [P12]
- Total reading on any screen: <10 seconds. [A6]

---

## 5. What this source does *not* give us (go elsewhere)

For the synthesis pass, note the gaps — other corpus sources should fill these:

- **No treatment of desirable difficulty / the generation effect** beyond the
  surface claim. (→ *Design for How People Learn*, *Fluent Forever*.)
- **No phonology or pronunciation method at all** — critical for us, since
  Spanish-L1 speakers have specific, predictable English phoneme problems
  (/b/–/v/, /s/–/z/, initial /sp/→/esp/, vowel reduction). (→ *Fluent Forever*.)
- **No habit-formation or trigger design.** Its retention answer is willpower and
  mantras. (→ *Hooked*, *Actionable Gamification*.)
- **No motivation taxonomy** — it has no concept of extrinsic vs intrinsic, which
  matters enormously for an employer-mandated learner. (→ *Actionable Gamification*,
  Octalysis.)
- **No forgetting-curve math.** The 2/8/11/15/21 ladder is asserted, not derived.
  (SM-2 in our codebase is already better.)
- **No treatment of the two-audience problem** (learner vs buyer). That's ours to
  solve.

---

## 6. One-line verdict

A weak book with a strong 40 pages. Its durable contributions to Inglés Hotelero
are: **encoding is gated by emotional and physical state** (so build for the tired,
embarrassed learner explicitly); **re-exposure is not practice, retrieval and
production are**; **interleave, don't block**; **bracket the second exposure across
sleep**; **cap new items at four**; **never rank peers**; and — the sharpest one —
**consequence beats instruction, so the drill belongs inside the shift, not
adjacent to it.**

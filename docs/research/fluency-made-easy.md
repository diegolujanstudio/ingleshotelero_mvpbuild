# Fluency Made Easy — Ikenna Obi
## Mined for Inglés Hotelero | Lens: practical fluency-building tactics (comprehensible input, shadowing, chunking, speaking-from-day-one, fastest adult path to conversational ability)

Source: `scratchpad/corpus/fluency-made-easy.txt` (809 lines / ~101 book pages).
Read in full: Ch.1–8, including the FME Method breakdown, resource chapters, schedule chapter,
"The Clicking Point," "The Down Days," Ten Common Questions, Five Common Pitfalls.

---

## 0. What kind of book this is, and how much to trust it

This is a practitioner's playbook, not a research monograph. It is affiliate-monetized (Pimsleur,
Assimil, Glossika, italki links, plus the author's own $39–99 upsell course). There is **zero
citation of SLA literature** — no Krashen, no Nation, no Ericsson. Every claim is n=1 experience
across seven languages.

**Why it is still high-value for us:** the author is describing, from the inside, the exact learner
psychology we are up against — the person who "did Spanish in high school and concluded languages
aren't for them," who quits at month 2–4, who is time-poor and prone to resource-hopping. His
method is a *sequencing* argument, and sequencing is precisely what a product controls. Treat this
book as a **curriculum architecture source**, not an evidence source. Where it makes empirical
claims (hours, percentages, "proven to help retain"), triangulate against `fluent-forever.txt`,
`design-for-how-people-learn.txt`, and `accelerated-learning.txt` during synthesis.

**Where it is dangerous for us:** its learner is a *volunteer hobbyist* with intrinsic passion
("genuine interest" is his #1 variable, p.85) and 30–60 min/day. Ours is a tired bellboy with
5 minutes and no intrinsic interest. Several FME prescriptions must be inverted or re-engineered
for that gap. I flag every one of those explicitly below.

---

## 1. The spine: Input → Output → Refinement

**pp. 25–30, restated pp. 54–56, 77–79.**

> "The natural way to learn a language is very simple. There are three main steps: Input, Output,
> and Refinement." (Ch.2, p.5)

### Stage 1 — Input (3–6 mo easy / 4–9 mo medium / 8–12 mo hard, at 30–60 min/day)
Absorption. Explicitly **not** speaking, **not** intensive grammar study, **not** writing/texting.
> "The focus is not on speaking at this point. / The focus is not on intensively studying grammar
> rules. / The focus is not on writing or texting." (p.28)

**Exit criterion is a comprehension percentage, not a lesson count:**
> "The goal is to be able to understand 50-70% of what you hear in your target language without
> the use of subtitles." (p.28)

### Stage 2 — Output (2–6 mo)
Begins *when* comprehension is already substantial. Free production with a native who corrects you.
> "the most important thing is coming up with as many of your own sentences as possible,
> communicating them to a native speaker, and getting feedback on technique (grammar,
> pronunciation, and whether or not a native would phrase the sentence in the same way)." (p.29)

Exit criterion: can express most daily topics with relatively low effort. Explicitly **not** error-free.
> "This level doesn't mean that you make zero errors when speaking. On the contrary..." (p.26)

### Stage 3 — Refinement (optional, 1–4 years)
Only here does explicit grammar study become worthwhile:
> "You've already internalized the bulk of grammar rules naturally without knowing it... Thus,
> looking now at the rules all concretely laid out can clarify a lot of things." (p.50)

### Fluency tiers mapped to CEFR (p.25)
- A1–A2 = **Basic Fluency** — "the ability to fluently do basic things." Ordering, asking directions,
  introducing yourself, recognizing 10–30% of heard speech.
- B1–B2 = **Conversational Fluency** — the book's target.
- C1 = Advanced. C2+ = Near-Native (7+ years, "isn't possible for everyone").

### → What this means for Inglés Hotelero

**Our entire product currently lives in a compressed, collapsed version of this spine and does not
name the stages.** `src/content/practice-drills.ts` runs a 3-step loop (listening MCQ → see model
phrase → 3 vocab cards) at every level for every learner forever. There is no stage transition, no
comprehension threshold, no mode change.

**Build a two-mode learner state machine.**

| | **Modo Escucha (Input)** | **Modo Turno (Output)** |
|---|---|---|
| Trigger | default on placement | unaided comprehension ≥ 60% on role-relevant speech |
| Daily loop | heavy listening + scripted repetition | AI/supervisor roleplay, free production, correction |
| Support | Spanish scaffolds on | Spanish scaffolds off |
| HR metric | *Comprensión* % | *Desempeño en turno* score |

Persist `learner_stage` on the employee row. The single most important product decision this book
implies is that **the daily loop should not be the same shape for a week-2 learner and a month-4
learner.** Today it is.

**Crucially, redefine "Basic Fluency" as our commercial promise, not B1.** FME's own definition of
Basic Fluency — "fluently do basic things" — *is the entire job* for a bellboy. A2 that reliably
executes twelve hotel scenarios is a complete product outcome. We should stop implicitly framing
B1/B2 as the destination for line staff and start selling **"A2 that works on shift"** as the
90-day deliverable, with B1 as the promotion track. That reframing shortens time-to-value for HR
from ~9 months to ~10 weeks and is defensible from the book's own tiering.

---

## 2. THE BIGGEST FINDING: sentences/patterns, not words — the Glossika principle

**pp. 39–40, reinforced p.55.**

This is the mechanism most directly opposed to what our product currently does.

> "The core of Glossika is to help you remember key ideas, not just words. For example, you might
> hear 'he is wearing a watch/hat/shirt/hoodie' several times across the first 150 sentences. **The
> goal is not for you to learn the specific words for 'hoodie' or 'hat,' but rather for you to
> understand how to construct a sentence** with the purpose of telling someone what another person
> is wearing." (p.39, emphasis mine)

Four stated benefits of the sentence unit over the word unit (p.39–40):
1. **Pronunciation** — "when words are strung together in sentences, they can sound a little
   differently than when they are spoken alone. Oftentimes vowels are omitted, words blend into
   each other." Word-level audio actively mis-trains the ear.
2. **Syntax** — word order becomes automatic through exposure, not rules.
3. **Vocabulary** — "The meaning of words shifts constantly depending on what words surround them.
   For example, 'wash my face' vs. 'face the consequences.' ... This is why memorizing dictionaries
   and vocabulary lists isn't as effective as learning through sentences/context."
4. **Grammar** — acquired implicitly. "Most native speakers have a hard time explaining grammar
   rules in their own language."

And the training metaphor:
> "Sentences on Glossika are called **reps** (repetitions), and are meant to mimic reps in the gym.
> Much like the exercise we do in the gym to grow physical muscles, you are doing mental reps in
> order to grow your language muscles." (p.40)

Volume target: **1,000–2,000 unique sentences over 1–2 months** takes you to the doorstep of output.

### → What this means for Inglés Hotelero (highest-leverage change in this document)

**Our vocabulary system is built on the wrong unit.** Right now:
- `src/content/practice-drills.ts` → `Drill.vocabulary[]` is `{word_en, word_es, example_en, example_es}` —
  a word-level flashcard with a decorative example.
- `src/lib/practice/sm2.ts` + `src/lib/practice/vocab.ts` schedule **words** through SuperMemo-2.
- `src/lib/practice/seed-vocab.ts` seeds a word inventory.

FME says the word inventory is the least useful artifact and the example sentence is the actually
valuable one. We have it exactly backwards — the sentence is currently ornamentation on the card.

**Replace the word inventory with a PATTERN INVENTORY.** Concretely:

```ts
// new content primitive — replaces Drill.vocabulary as the SRS unit
type Pattern = {
  id: string;                    // "fd-offer-001"
  frame_en: string;              // "Would you like ___?"
  frame_es: string;              // "¿Le gustaría ___?"
  function_es: string;           // "Ofrecer algo a un huésped"
  slots: string[];               // ["a wake-up call","help with your bags","a table by the window", ...]
  module: RoleModule;
  level: CEFRLevel;
  reps: { en: string; es: string; audio_id: string }[]; // 8–20 rendered sentences
};
```

Then the daily loop delivers **pattern reps, not word cards**: the learner hears/says 6–10 fillings
of the *same frame* in a row. "Would you like a wake-up call? / Would you like help with your bags?
/ Would you like a table by the window?" The intended learning is the frame's automaticity, not the
slot fillers.

**Concrete backlog item:** author a **Pattern Inventory of ~120 frames per role** (≈360 total) and
render **~15 reps each ≈ 5,400 sentences**. That is FME's 1,000–2,000-sentence dose, three times
over, and it is generatable — the frames are hand-authored by Diego, the slot fillers are
LLM-expanded and human-reviewed. This is the single highest-ROI content project in the roadmap and
it is far cheaper than authoring 5,400 bespoke drills.

**Keep SM-2, change what it schedules.** `sm2.ts` is good code; point it at `pattern_id` instead of
`vocab_word_id`. A pattern is "known" when the learner can produce 3 unseen fillings unprompted.

**Stop reporting vocabulary counts to HR.** "Aprendió 240 palabras" is a Duolingo metric and it is
the metric FME says doesn't transfer. Report **"Domina 34 de 120 frases de recepción"** — patterns
mastered, mapped to job situations. HR can read that; a word count means nothing to a GM.

---

## 3. The comprehension threshold — "The Clicking Point" at 60%

**pp. 74–76.** This is the book's best original idea and it is directly implementable as a product
state transition.

> "The clicking point happens around the time where, on average, you can understand at least **six
> out of ten sentences** spoken by a native speaker. This is because you are now able to understand
> the minimum amount of information necessary in order to utilize context clues." (p.74)

He demonstrates it with a worked example (pp.74–75): a 10-sentence monologue about wanting to buy a
house. At 30% comprehension the meaning is unrecoverable — "The context is hard to determine with so
much information missing." At 60% the gist is fully recoverable, and — the key second-order effect —
> "When you can assume what a person is trying to say, you learn much quicker through listening than
> normal. Your brain essentially fills in the blanks." (p.75)

Below threshold, exposure to native-rate speech is noise ("one huge, continuous, indecipherable
sentence"). Above threshold, the same exposure becomes a learning engine. **The value of input is
non-linear in comprehension level.** That is a strong argument for hard difficulty gating.

And the affective note:
> "With most of the languages I now speak I still did not feel confident in my abilities in the days
> leading up to reaching the clicking point. It really does sneak up on you." (p.76)

### → What this means for Inglés Hotelero

1. **Instrument it. Make "Comprensión" the primary progress metric, replacing lessons-completed.**
   Once a week, serve a 90-second unaided listening probe: 10 role-relevant utterances at native
   speed, no Spanish, no text, learner taps the correct action. Score = comprehension %. Store the
   time series. This is a real, defensible, buyer-legible number and it costs one API route plus
   ~30 audio assets per role. Our `src/lib/practice/progress.ts` currently tracks completion; this
   should sit next to it and outrank it.

2. **Gate the stage transition on it.** Do not put a learner into free-form roleplay at 25%
   comprehension. FME is emphatic that early forced conversation is what breaks people (p.15: the
   learner who talks to a native too early, "understand[s] next to nothing," and quits). Gate
   `Modo Turno` at ≥60% on two consecutive weekly probes.

3. **Make the clicking point VISIBLE, because the learner will not feel it.** This is a product
   moment worth building deliberately. When the probe first crosses 60%, trigger a scripted
   celebration that is *evidential*, not confetti:
   - Replay the exact same audio clip they failed in week 1, and show them answering it correctly now.
   - Play back their own week-1 speaking recording next to today's. (We already store recordings —
     `src/app/api/recordings/route.ts`, `src/lib/offline/audio-store.ts`.)
   - Copy, in the design system's register: *"Hace ocho semanas no entendiste esto. Hoy sí."*

   For an embarrassed A1 learner with a history of school failure, self-evidence beats any badge we
   could design. This is the anti-Duolingo reward: proof instead of points.

4. **Notice this lands in the motivation trough.** FME predicts the lowest motivation at 2–4 months,
   "when you've already been learning the language for a while but you're still not ready to begin
   properly speaking" (p.92) — which is exactly the pre-clicking window. So the clicking-point
   reveal is also the retention intervention. Schedule proactive HR/supervisor nudges for weeks 8–16
   specifically.

---

## 4. Input volume: the passive channel is where the hours actually come from

**pp. 31–35 (media), 69–71 (schedule).**

FME's daily prescription is **two separate budgets**:
> "Commitment per day (applicable to all stages): 30 to 60 minutes studying **&** One episode of TV
> or a few YouTube videos (in your target language)" (p.78)

And explicitly:
> "**I don't include watching TV/films/videos as study time.** It's pretty effortless, fun, and
> something I'd be doing in English anyways." (p.69)

For the time-poor:
> "Make sure you are consuming media any time you can (lunchtime, while commuting, even on the
> toilet). If you are very strapped for time, you most likely won't have too much time to watch TV,
> so make sure you at least take in a lot of input from **audio-only sources** such as podcasts and
> music." (p.70)

On the value of the visual channel — this is his one genuinely original observation:
> "Body language is highly underrated... imagine you see the translation for 'run away' in a
> textbook. Tell me what's more likely: Remembering that word after reading it in a book a few
> times, or after seeing your favorite character screaming 'run away' while tears roll down his face
> as he tries to protect his young son? ... **They have body language. They help turn words into
> meaning that you intuitively understand even without initially knowing the words!**" (pp.31–32)

Music: portable, and worth memorizing whole.
> "If the average song has around 70 unique words and you learn three or four songs by heart, you
> are increasing your vocabulary substantially." (p.34)

Time math:
- 30–60 min/day = conversational in 6–12 months. **15 min/day ≈ doubles the timeline** (p.70).
- Cap at 2 hrs. "It's far better to have 6 one-hour learning sessions than 1 six-hour learning
  session," with claimed retention decay of 50%/25%/10%/5% per successive hour in one sitting (p.71).

### → What this means for Inglés Hotelero

**This is the finding that resolves our "5 minutes a day" problem.** Our stated target is 5 min/day.
By FME's own arithmetic, 5 min/day of active study will not produce conversational ability in any
timeframe a hotel GM will pay for. But FME also says the *active* budget is only half the input —
and the passive half is free, effortless, and pocket-sized.

**Ship "El Turno" — a passive audio channel. This is a missing product surface, not a feature.**

- A 15–25 minute audio program per role per level: role dialogues at natural speed, bilingual
  scaffolding early, English-only later. Think Pimsleur-shaped, hotel-specific.
- Downloadable over hotel WiFi, plays offline, background playback with lockscreen controls, low
  bitrate (mono, 32–48 kbps opus/aac — a 20-min episode is ~5 MB).
- Positioned for the commute, the locker room, prepping the cart, cleaning. Explicitly framed as
  **not study**: *"No es tarea. Ponlo en el camión."*
- Prepaid-data reality: never stream. Pre-cache tomorrow's episode when on WiFi. We already have
  `src/lib/offline/` (db, queue, sync, audio-store) — this is the natural consumer of it.
- We already have the TTS pipeline (`src/lib/tts/elevenlabs.ts`, `voices.ts`,
  `audio-bucket.ts`) — the marginal cost of generating an audio program from the Pattern Inventory
  is generation credits, not engineering.

**Then split the promise in the buyer narrative:** *"5 minutos de práctica activa + 20 minutos de
audio en el camino."* That is 25 minutes of daily contact — inside FME's stated effective band —
while asking for only 5 minutes of the learner's *attention*. This is honest and it is the only way
the math works.

**Second implication: replace emoji with real human faces.** Our drill options are currently
`{ emoji, text_es, correct }` — 🧳 / 🍽️ / 💳. That is (a) a direct violation of our own design
system ("Never: emoji in production UI") and (b) exactly the impoverished, body-language-free
representation FME identifies as the weakness of textbooks. Replace with **photographic or short
silent-video guest scenarios**: the guest's face, posture, the actual lobby, the actual restaurant.
An annoyed guest at 11pm and a delighted guest at check-out should look different, because the
learner's real job is reading that difference. This also serves "respeto, no condescendencia" —
emoji read as infantilizing to an adult professional.

**Third: the "known plot" advantage.**
> "Watch a TV show you've already watched before, dubbed into your target language... because you
> already understand the context and the plot of the show." (p.47)

**Our learner's job IS the pre-known plot.** They already know, in Spanish, exactly what happens when
a guest arrives with two suitcases. Every scenario we build starts with 100% context comprehension
and 0% linguistic comprehension — the ideal comprehensible-input condition, and a structural
advantage Duolingo can never have. Lean on it hard: never invent situations; only re-voice
situations the learner has lived a thousand times.

---

## 5. Scripted production from day one — the shadowing/chunking mechanism

**pp. 36–39.** This is where FME appears self-contradictory and where the resolution is the most
useful thing in the book for us.

He says "the focus is not on speaking" during Input (p.28). And yet the **first two programs he
mandates from day one both require speaking out loud**:

**Pimsleur (p.36):** audio-only, 30-min lessons. Structure: a dialogue you can't yet understand →
the lesson teaches its component chunks → by the end you understand it. Prompt in English, learner
produces, native model follows. Each lesson recycles previous lessons' material.
> "Pimsleur is essential for all beginners because it gets you used to the natural sound of the
> language, teaches you the most useful words for a beginner to know, and **greatly helps your
> pronunciation from day one**." (p.36)
Also — and this matters for our demoralized learner — *"Pimsleur is also a relatively easy and
straightforward course, thus it also helps to instill confidence."* (p.54)
He recommends stopping at lesson 60 (p.54); after that it gets repetitive and slow per new word.

**Assimil (p.38):** bilingual dialogues.
> "Over the course of the lesson Assimil makes you analyze the English translation, **read the
> dialogue in your target language out loud several times, and mimic the native speakers'
> pronunciation.**" (p.38)
Plus contextual notes, plus two exercises per lesson (one analysis, one fill-in-the-blank).
> "Memorizing eventually becomes understanding." (p.38)

**The resolution:** FME's ban on "speaking" in the Input stage is a ban on **unscripted conversation
with a native**, not a ban on **production**. Scripted, modeled, immediately-corrected production —
shadowing and chunk repetition — is present from hour one. What he defers is the *cognitively
expensive, socially exposing, ego-threatening* kind: improvising with a stranger who might judge you.

### → What this means for Inglés Hotelero

**This is the sharpest correction to our current build.** From the header comment in
`src/content/practice-drills.ts`:

> "V1 deliberately omits the speaking step from the daily flow — the exam already exercises that
> surface, and adding MediaRecorder here doubles the implementation cost."

That was a reasonable engineering tradeoff and it is a serious pedagogical error. **A learner whose
job is speaking English is currently doing zero English speaking on a normal day.** The daily loop is
listening-recognition + reading a model phrase + word cards. Under FME's model (and Pimsleur's, and
Assimil's) that will not produce a bellboy who can say "Let me take your luggage to your room" under
pressure at 11pm.

**Add "Repite" as a mandatory step in the daily loop, immediately.** Not free speech — shadowing:

1. Learner hears the model line at natural speed.
2. Learner hears it again, chunked ("Of course, sir. / Let me take your luggage / to your room.").
3. Learner records themselves saying it. 3–6 seconds. Tap-and-hold, one take.
4. Learner **hears their own recording back against the model.** Self-comparison is the primary
   feedback; ASR scoring is secondary.
5. Optional: one retry. Never more — this is a rep, not a performance.

The infrastructure exists: MediaRecorder is already implemented for the speaking exam
(`src/app/exam/[id]/speaking/page.tsx`), recordings upload via
`src/app/api/recordings/route.ts`, offline audio queueing lives in `src/lib/offline/audio-store.ts`,
and scoring at `src/app/api/score-speaking/route.ts`. The daily loop needs to reuse these, not
re-invent them. **The cited "doubles the implementation cost" is no longer true; the pieces shipped
in Phases 2–3.**

**Score it as a rep, not a test.** Do not send every daily shadowing take to Whisper+Claude — that is
expensive and, more importantly, it turns a rep into an exam. Score maybe 1 in 7 (a weekly "prueba
de turno"), silently, for the HR trendline. The other six are self-comparison only. This preserves
the gym metaphor: you don't get graded on every rep.

**Copy the Pimsleur prompt shape for our audio program:** Spanish prompt → pause → learner speaks →
native model. That interval where the learner must retrieve before hearing the answer is the
mechanism. It also works hands-free and eyes-free, which is the only way a housekeeper or bellboy
can practice mid-shift.

---

## 6. The Second Wave — a cheap, legible review scheduler

**pp. 38–39.**

> "After you finish half of the lessons, after each new lesson Assimil will prompt you to review a
> previous lesson, i.e. when you finish lesson 51, you review lesson 1 again, when you finish lesson
> 52, you review lesson 2 again, etc. That way, with a few minutes of extra revision you are fully
> cementing and solidifying what you've previously learned."

His own practice: two lessons/day until the wave starts, then one lesson + one review (p.39).

### → What this means for Inglés Hotelero

We have SM-2 (`src/lib/practice/sm2.ts`), which is algorithmically superior. But SM-2 has two costs
for our learner: it is opaque (you can't predict your day) and it schedules *items*, not *scenarios*.

**Add "La Segunda Ola" as a scenario-level review layer on top of item-level SM-2.** From day 31
onward, every daily session ends with a 60-second re-run of the scenario from day N−30 — **but in
production mode**. Day 1 you *recognized* the answer; day 31 you *say* it, unprompted, from the
Spanish situation description. Same content, harder mode. That is retrieval practice, difficulty
progression, and a built-in progress demonstration in one cheap mechanic.

It is also *narratively* legible in a way SM-2 never is: *"Hoy repites el turno del día 1. Vas a
notar la diferencia."* Deterministic, predictable, and it generates the self-evidence described in §3.

Also adopt the **scaffolding-removal ladder** implied by his subtitle progression (pp.41, 47, 53:
English subs → target-language subs → none). For a given scenario, four passes over ~6 weeks:
1. Spanish support + English text + slow audio
2. English text + natural audio
3. Audio only, natural speed
4. Audio only, natural speed, with lobby/kitchen background noise

Pass 4 is the one that matters and nobody builds it. Our learner works in a loud lobby. **Training
exclusively on studio-clean TTS is training for a room they will never work in.** Mix in ambient
noise beds on advanced passes — cheap to do, and directly maps to job performance.

---

## 7. Output stage: correction is the active ingredient, not exposure

**pp. 42–45.**

> "in the Output stage you don't need to be spending top dollar on professional teachers. The focus
> of this stage is to get as much speaking practice with a native speaker **whose job it is to
> correct you and help you have a good time**." (p.42)

Cadence: 30–60 min with a community tutor **every other day**, for 2–4 months (p.43). On off days:
Glossika, unsubtitled media, podcasts, reading, or —

**Self-talk** (p.43, footnote — one of the most portable techniques in the book):
> "if you watched a really exciting football game yesterday, challenge yourself to describe aloud
> what happened in the game. When you inevitably run into words you don't know how to express in
> your target language, translate and conjugate them, and continue to express your thoughts... The
> added benefit is that you can go at your own pace discovering how to say what you want to say
> piece by piece. This is helpful because when you are speaking to a native speaker you might feel
> uncomfortable putting so much time into expressing one thought."

**The shared correction document** (p.43):
> "make sure you and your tutor keep a list of important phrases/words that come up. I'd recommend
> sharing a google document with your tutor and having them write in the translations and
> explanations of everything you have difficulty with... That way you can use the list as a review on
> your days where you aren't speaking to your tutor."

### → What this means for Inglés Hotelero

1. **Build the AI roleplay partner as the italki substitute — but its job description is "corrects
   you," not "talks with you."** A chatty AI that lets errors slide is worthless here. Spec:
   - Plays a guest in a fixed scenario at the learner's level.
   - 4–6 turns max. Ends when the task is completed, not when conversation dies.
   - Corrects **one thing** at the end — the highest-impact error only, phrased as an upgrade, not a
     failure: *"Dijiste 'I bring your bags.' Un huésped espera: 'I'll bring your bags right up.'"*
   - Corrections auto-append to a per-learner **"Mi libreta"** — the shared-doc analog, our
     highest-value personalized asset. It becomes the source for that learner's next week of reps.
     Feed it back into the picker (`src/lib/practice/picker.ts` already weights recent misses — extend
     it to weight `libreta` entries).

2. **The self-talk technique is nearly free and ideally suited to WhatsApp.** Weekly prompt: *"Cuéntame
   en inglés qué pasó en tu turno de ayer. Manda un audio de 30 segundos."* No right answer, no
   score, permission to be slow. Bank the audio. Three months later it becomes the most powerful
   progress artifact we have — for the learner AND for the HR renewal conversation. Low build cost,
   very high emotional and commercial payoff.

3. **The highest-leverage "native speaker" in a hotel is the supervisor or the front-office manager
   who already speaks English.** FME's whole Output stage is "find a cheap human who will correct
   you every other day." Every hotel has these people on payroll. **Ship a supervisor-facing
   10-minute roleplay card deck** — printed or in-app — with the scenario, the target phrases, and
   the three errors to listen for. This costs us almost nothing, makes the product sticky inside the
   organization, gives the buyer a visible implementation ritual, and solves the "we need native
   correction but can't afford tutors at $150/property/month" economics problem outright.

---

## 8. Adherence mechanics: how FME keeps people from quitting

**pp. 69–73, 92–97.** This is a coherent anti-gamification philosophy and it is directly usable as
competitive positioning against Duolingo.

**Permission to miss a day.**
> "Instead of being down or upset that you skipped a day of studying, know that in the long run one
> single day doesn't matter much as long as you get back into it. **Skipping a day here and there is
> not the same as skipping weeks on end.**" (p.73)
> "what matters even more than consistency and discipline is happiness and genuine enjoyment. From
> my personal experience, one thing I've found that can really damper your happiness is unreasonable
> expectations." (p.73)

**The 5-minute start rule.**
> "you shouldn't rely on motivation. Motivation is fleeting. What is important to cultivate is
> discipline... If your brain resists, then tell yourself that you'll only study for 5 minutes. Just
> make the effort to start. After 5 minutes you'll probably keep going because you'll already be on
> a roll. **As you'll come to find, the hardest part of practicing most skills is starting.**" (p.92)

**Fixed time anchor.**
> "tackle your language learning the first thing in the morning or the last thing at night. I
> personally study my languages thirty minutes after waking up." (p.95) Night option: "you most
> likely have no external distractions right before you go to bed."

**Do not announce your goals — this one is counterintuitive and important.**
> "it's not just someone else's negative comments, but potentially their positive ones too. **Studies
> have shown that when you receive praise for something you haven't accomplished yet, you are less
> likely to go through with it. Your brain has already received part of the reward** (praise and
> social acceptance) for accomplishing the task without putting any work in yet." (p.93)
The one sanctioned exception: **a single accountability partner** you report to weekly. "If you are
held accountable by another person you are much more likely to hit your goals because you don't want
to let that person down." (p.94)

**Do not switch paths.** Pitfall #5, "Doubting the method" — "This one is the killer" (p.97).
Resource-hopping is named as the primary failure mode. Corollary, Q6: give any commitment a **30-day
trial**; after 30 days, no switching (p.87).

**Unrealistic goals kill people.** Specifically named as unrealistic: native pronunciation,
understanding all dialects, eavesdropping on strangers (pp.95–96).
> "There's no need to be perfect when it comes to accents. Everyone is unique." (p.96)

### → What this means for Inglés Hotelero

**a) Redesign the streak. Our current `src/lib/practice/streak.ts` is Duolingo's model and FME says
it is the wrong one.** `current_streak` resets to 1 on a gap. For a shift worker on rotating
schedules who will legitimately miss days, a resetting counter manufactures shame and then churn —
and shame is the single emotion we most need to avoid in a learner who "may feel embarrassed about
their English."

Change to a **rolling-window model**:
- Display **"Turnos completados: 18 de los últimos 30 días."** Never a number that can be destroyed.
- Add 2 "días libres" per month that auto-apply, silently. The learner never sees a break.
- Alarm on **weeks, not days** — exactly FME's distinction. Zero activity for 10 days fires the
  re-engagement flow (and only then does HR see an amber flag).
- Explicit in-product copy after a miss, in the design system's register: *"Faltaste ayer. No pasa
  nada — lo que cuenta son las semanas, no los días."* This one sentence is a differentiator against
  every consumer app in the category.

**b) Ship "Un minuto" mode.** A single scenario: hear it, say it, done. Surfaced *by name* when the
learner has been inactive 2+ days, and always available as the first option on a low-energy day.
This is the 5-minute rule, sized for someone who just finished a double shift. It also protects the
rolling window, which protects the HR dashboard, which protects renewal.

**c) Anchor the drill to shift end, not clock time.** Capture `shift` (already a domain enum per
CLAUDE.md — `Shift` in `src/lib/supabase/types.ts`). Send the WhatsApp nudge 30–60 min after the
learner's shift ends, per-employee. A 7am blast to someone who worked until 2am is a churn event.
The cron at `src/app/api/cron/whatsapp-daily/route.ts` currently has no shift awareness — this is a
small, concrete, high-value fix.

**d) DO NOT BUILD PUBLIC LEADERBOARDS OR SOCIAL GOAL-SHARING.** This is the loudest anti-pattern in
the book and a naive B2B product team ships it in week one because HR asks for it. FME's argument:
public praise for an unearned goal *pre-pays the social reward* and reduces follow-through. Layer on
our learner's specific psychology — embarrassment about their English in front of coworkers — and a
lobby-posted ranking is actively destructive. It will make the bottom quartile stop practicing where
anyone can see, which is everywhere.

Replace with the sanctioned mechanic: **one accountability partner.** Pair each learner with a
"compañero de práctica" or their supervisor. Weekly private check-in. Report **completion** to HR,
never comparison. If HR insists on team visibility, show **property-level aggregate progress only**
— never a per-employee ranking.

**e) Do not score accent. Score intelligibility and task completion.** Our rubric (per CLAUDE.md,
`.orcha/phase-3-ai-scoring.md`, used in `src/app/api/score-speaking/route.ts`) already says "for
A1-A2 be GENEROUS, never 0 if they attempted English" — good, keep it verbatim. Add an explicit
instruction that **a Spanish accent is not an error** and must not reduce the score. Then say it in
the product, to the learner, in week one: *"Tu acento no es un problema. Un huésped quiere
entenderte, no que suenes de Ohio."* This is the highest-empathy, lowest-cost copy change available
to us and it directly addresses the embarrassment barrier.

**f) One path. No library. No menu.** Pitfall #5 says resource-hopping is the killer. Do not build a
browsable content catalog for the learner. The daily loop should have **one** button. Choice is a
feature for the buyer and the Master OS admin, never for the tired learner. (This also means: do not
let a learner practice two role modules at once — see FME Q7, "you are too likely to confuse the
two." One role until the role is done.)

**g) Frame onboarding as a 30-day trial** (FME Q6). *"Danos 30 días. Después decides."* Matches his
one-month commitment rule and gives the HR pilot a natural evaluation block.

---

## 9. Positioning: the book's own verdict on Duolingo and Rosetta Stone

**pp. 15, 65–66, 82.** Free ammunition for our competitive frame.

On the classic failure arc (p.15) — worth quoting in a sales deck almost verbatim:
> "someone who wants to learn a language will spend $300 on something like Rosetta Stone. They'll
> use it for a month, and then life will get in the way and they'll stop using it. Then they'll try
> another approach like trying to aimlessly memorize a bunch of vocabulary **by category (health
> words, food words, etc.)** or using Duolingo... In their conversation with the native, they'll end
> up understanding next to nothing, they'll have a tough time speaking, and then they will be
> demotivated and quit."

On Duolingo (p.65):
> "Duolingo.com is a decent resource in order to help you learn and remember new vocabulary, **but it
> is not a program you should be overly reliant on. One of the problems I often see with beginner
> language learners is that they are using Duolingo as their only resource.**"

On Rosetta Stone (p.82):
> "Rosetta Stone is the most heavily marketed program on this list, so you might be surprised to
> hear that it's ineffective. **Remember that the most well known and most effective aren't
> necessarily the same.**"

On why learning feels hard (p.15):
> "Language learning itself is not hard. More specifically, learning a language **when you have a
> clear path to follow, know which resources to use, and know what to expect** both timewise and
> mentally, is not hard."

### → What this means for Inglés Hotelero

- **"Aimlessly memorize vocabulary by category (health words, food words)" is a description of a
  naive hotel-English course.** It is also uncomfortably close to what "vocabulary del restaurante"
  becomes if we're not careful. Our defense is §2: organize by **communicative function** ("ofrecer,"
  "disculparse," "confirmar," "dar direcciones"), never by semantic category ("palabras de la
  cocina"). Audit `practice-drills.ts` vocabulary sets against this.
- **Position on structure, not content.** "El problema no es que tu equipo no estudie. Es que no hay
  un camino." Our product is the path — placement → sequenced patterns → measured comprehension →
  supervised production. Duolingo has no path *for this job*; it has an endless tree.
- **The B2B asymmetry we should name explicitly:** Duolingo optimizes the learner's daily return
  visit. We optimize the guest's experience at the front desk on Tuesday. Those diverge. Every time
  we're tempted by a Duolingo mechanic (leagues, gems, streak-freeze purchases, lives), ask whether
  it improves shift performance or app DAU. Ship only the former.

---

## 10. Two claims to distrust / triangulate during synthesis

1. **"Praise before accomplishment reduces follow-through"** (p.93) is asserted as "studies have
   shown" with no citation. It maps to Gollwitzer's work on identity-goal substitution, which has
   mixed replication. The *product* recommendation (no public leaderboards) is still right for us,
   but on independent grounds — learner embarrassment and bottom-quartile withdrawal — so don't
   stake the argument on this claim alone.
2. **"Studying right before bed has been proven to help retain information"** (pp.71, 95). The
   sleep-consolidation literature broadly supports this, but the effect size for a 5-minute drill is
   probably small compared to the scheduling benefit of "no external distractions." Use the
   distraction argument, not the neuroscience one, and let the shift-end anchor (§8c) drive timing.

Also note the whole book's timeline claims (6–12 months to B1/B2 at 30–60 min/day) are personal-best
figures from a highly experienced polyglot learning his 3rd–7th language, and should not be used in
any customer-facing promise. Our defensible claim is §1's reframe: **A2-that-works-on-shift in ~90
days**, evidenced by the comprehension probe and before/after recordings.

---

## 11. Priority build list, condensed

| # | Change | Where | Effort | Leverage |
|---|---|---|---|---|
| 1 | Pattern Inventory replaces word inventory as the SRS unit | `src/content/practice-drills.ts`, `src/lib/practice/{sm2,vocab,seed-vocab}.ts` | L (content-heavy) | transformational |
| 2 | Add mandatory "Repite" shadowing step to the daily loop | reuse `exam/[id]/speaking`, `api/recordings`, `lib/offline/audio-store` | M | transformational |
| 3 | Weekly unaided comprehension probe → "Comprensión %" as primary metric + stage gate at 60% | new route + `lib/practice/progress.ts` | M | transformational |
| 4 | "El Turno" passive audio channel, downloadable, offline | `lib/tts/*` + `lib/offline/*` | M | high |
| 5 | Rolling-window streak; alarm on weeks not days; free days | `src/lib/practice/streak.ts` | S | high |
| 6 | Two-mode learner state machine (Escucha / Turno) | employee schema + picker | M | high |
| 7 | "La Segunda Ola" — day N−30 scenario in production mode | `lib/practice/picker.ts` | S | high |
| 8 | Clicking-point reveal: week-1 vs today audio A/B | new UI moment | S | high |
| 9 | Replace drill emoji with photographic guest scenarios | content + `practice-drills.ts` type | M | high |
| 10 | AI roleplay partner that corrects once, into "Mi libreta" | new | L | high |
| 11 | Supervisor 10-min roleplay card deck | content/print | S | high |
| 12 | Shift-anchored WhatsApp timing | `api/cron/whatsapp-daily` | S | medium |
| 13 | "Un minuto" low-energy mode | practice flow | S | medium |
| 14 | Rubric: explicitly do not penalize Spanish accent + tell the learner | `api/score-speaking` + copy | XS | medium |
| 15 | Noise-bed audio on advanced passes | TTS pipeline | S | medium |

---

## 12. Stop-doing list (loudest conflicts with naive product instinct)

1. **Stop treating vocabulary words as the learning unit.** Sentences/frames are the unit. Word
   counts are a vanity metric for both learner and buyer.
2. **Stop shipping a daily loop with no speaking in it.** A speaking product where the learner never
   speaks is the central defect in the current build.
3. **Stop reporting "lecciones completadas" as progress.** Report measured comprehension and
   patterns-mastered-by-job-situation.
4. **Do not build public leaderboards, rankings, or goal-announcement social features.**
5. **Do not build a punishing streak.** Days are noise; weeks are signal.
6. **Do not build a browsable content library for the learner.** One path, one button.
7. **Do not teach grammar rules to A1/A2 learners.** Grammar is a Refinement-stage tool
   (FME pp.39–40, 50). Notes-in-context yes; rule instruction no.
8. **Do not build writing/typing exercises.** "If your focus is on being able to speak and listen
   only then I'd recommend not putting the time into learning to write." (p.46) Our learner's job is
   spoken. Typing English on a mid-range Android is also pure friction.
9. **Do not build exam-prep content.** "Learning to pass an exam is both less fun and less
   effective." (p.90) The placement exam is our commercial wedge and a measurement instrument —
   never the learning target.
10. **Do not score or aspire to native accent.** Score intelligibility and task completion.
11. **Do not let a learner run two role modules at once.**
12. **Do not push free-form conversation before the 60% comprehension gate.** Early forced
    conversation with a native is FME's named cause of quitting (p.15).
13. **Do not use emoji in learning content.** Design-system violation *and* an impoverished
    substitute for the body language that makes meaning stick.
14. **Do not stream audio.** Prepaid data. Pre-cache on WiFi or don't ship it.

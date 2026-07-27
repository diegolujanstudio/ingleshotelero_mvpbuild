# Hooked Workbook (Nir Eyal, 2014) — mined for Inglés Hotelero

**Source file:** `scratchpad/corpus/hooked.txt` (280 lines, ~16KB — the 22-page *supplemental
workbook*, not the full book).

**What this source actually is.** It is a worksheet, not a treatise. Roughly 40% is front/back
matter (special offer, testimonials, repeated twice). The substance is seven "Remember this"
bullet blocks and seven exercises. Every "Remember this" block ends with *"Make sure you read
chapter N of Hooked to fully understand these concepts."* So the workbook gives us the **skeleton
and the interrogation method** but withholds the case studies and mechanisms.

**Therefore the value of this source is not its prose — it is that it is a diagnostic protocol.**
The right way to mine it is to *actually run the seven exercises against Inglés Hotelero* rather
than restate the model. That is what this document does. Where the workbook gives a bare prompt
("come up with three internal triggers"), I have done the work and committed to an answer.

Anchors below are given as `Exercise N, Q#` and `line NN` into the corpus file, so every claim is
verifiable.

---

## 0. The model, verbatim, and the one hard gate

**The Hooked Model has four phases: trigger → action → variable reward → investment** (line 49).
*"Hooks are experiences designed to connect the user's problem to a solution frequently enough to
form a habit"* (line 50). Habits are *"behaviors done with little or no conscious thought"*
(line 49).

The single hardest constraint in the whole workbook is a parenthetical in Exercise 1, Q6
(line 71):

> *"If the behavior does not occur within a week's time or less, you may have a very difficult
> time forming a habit."*

This is a **gate, not a guideline**. It says: any Inglés Hotelero design where the learner touches
the product less than once a week is not a habit product and will not retain. It has three
consequences we should treat as non-negotiable:

1. The **placement exam is not the product**. It is a one-shot, ~15-minute event. It cannot form a
   habit and will never retain anyone. It is correctly positioned as the *sales wedge*; it must
   never be mistaken for the retention engine.
2. The **daily WhatsApp drill is the only surface that clears the gate**. Everything else (PWA
   depth practice, HR reports, re-tests) is downstream of it. Resourcing should reflect that, and
   today it does not — Phase 5 (WhatsApp) is still the least-finished part of the product while
   Phases 4 and 6 (HR dashboard, billing, Master OS, org hierarchy) are built out.
3. **Frequency is the design target, not session length.** Two 90-second touches a day beats one
   5-minute session, both for habit formation and for a tired shift worker's ability. See §3.

---

## 1. Exercise 1 — the basics, worked for Inglés Hotelero

*(corpus lines 60–71)*

**Q1. Project.** Inglés Hotelero — daily WhatsApp English drill for hotel line staff in Mexico/LatAm.

**Q2. Why does the business model require a habit?**
This is worth answering precisely because our answer is unusual and it changes the design.

We are B2B: the hotel pays $150–500/month, not the learner. Naively, that means we *don't* need a
habit — we need the HR director to renew. But the renewal decision is made on **measurable results
across the property**, and results are a function of practice frequency. So the chain is:

> learner habit → practice frequency → CEFR movement → HR-visible result → renewal → revenue.

The habit is load-bearing, but **one step removed from the money**, and that has a specific
implication the workbook doesn't cover: *we can spend the buyer's authority to lower the learner's
activation energy* in ways a consumer app cannot. Duolingo has to earn every single open. We can
have the hotel put the QR in the break room, have the supervisor mention it at the daily briefing,
and count practice in the shift routine. **We should exploit this ruthlessly** — it is the single
biggest structural advantage we have over a consumer competitor, and it maps directly onto Fogg's
"non-routineness" ability factor (§3).

**Q3. What problem are users solving?** Not "learning English." The learner's felt problem is:
*"a guest is going to speak to me tonight and I won't understand, and I'll look stupid and lose
the tip."* The buyer's felt problem is: *"my guest scores and my turnover are bad and I can't
prove my training budget does anything."*

**Q4. How do they currently solve it, and why does it need a solution?** Today: nodding and
smiling, fetching a bilingual coworker, Google Translate under the desk, memorized fragments, or
avoidance (moving away from English-speaking guests). Duolingo, if anything — but Duolingo teaches
"the owl eats an apple," not "may I store your luggage until check-in?" The current solutions are
either socially costly (asking a coworker in front of the guest) or off-domain.

**Q5. Intended habitual behavior.** Commit to one sentence, because everything downstream depends
on it:

> **The learner opens WhatsApp during dead time on shift, answers one job-scenario drill, and
> sends/records one English phrase.**

Note what is *not* in that sentence: opening the PWA, doing four steps, completing a lesson. See §3.

**Q6. Expected frequency.** Daily — target 2 touches/day (pre-shift + post-shift), minimum 1.
Clears the one-week gate with margin.

---

## 2. Triggers (Exercise 2, corpus lines 77–104)

### 2.1 What the workbook says

- *"Triggers cue the user to take action and are the first step"* (line 79).
- **External** triggers *"tell the user what to do next by placing information within the user's
  environment"*; **internal** triggers *"through associations stored in the user's memory"*
  (lines 80–81).
- **Critical line 82:** *"Negative emotions frequently serve as internal triggers."*
- Exercise 2 Q3 instructs using **the 5 Whys** to find internal triggers (line 93).
- Exercise 2 Q7 (line 103): *"How can you time your external trigger so that it fires as closely
  as possible to when your user experiences their internal trigger?"*
- Exercise 2 Q8 (line 104) explicitly asks for **three conventional and three "crazy or currently
  impossible"** trigger mechanisms — the workbook is deliberately pushing past the obvious.

### 2.2 The 5 Whys, actually run

Starting question: *why does a bellboy in Cancún use an English app?*

1. **Why?** Because guests speak to him in English.
2. **Why does that matter?** Because when he doesn't understand, the interaction goes badly — he
   freezes, guesses, or fetches someone.
3. **Why does that matter?** Because he gets no tip, and occasionally a complaint reaches his
   supervisor.
4. **Why does that matter?** Because his income and his standing on the property depend on both.
5. **Why does that matter?** Because he feels **exposed as incompetent — stuck, replaceable, and
   embarrassed in front of a guest and his coworkers.**

**The internal trigger is shame-anxiety about being seen as incompetent in English.** Not
curiosity. Not self-improvement. Not fun.

This matters enormously because it dictates *tone*, and our design system already got the tone
right by instinct — CLAUDE.md's first design principle is **"Respeto, no condescendencia."** The
workbook explains *why* that instinct is correct: the internal trigger is shame, and a product
that arrives in a shame moment wearing cartoon mascots and confetti **amplifies the shame** rather
than relieving it. The editorial, adult, ink-blue register is not a taste preference — it is
functionally required by the internal trigger.

### 2.3 Internal trigger inventory (Exercise 2, Q3/Q4)

Three candidates, with the tradeoff between **emotional intensity** and **available attention**:

| # | Internal trigger | When | Intensity | Phone-in-hand? | Frequency |
|---|---|---|---|---|---|
| A | Shame right after a failed guest interaction | mid-shift, minutes after | **highest** | no — on the floor, guest present | ~1–3/week |
| B | Anticipatory anxiety before a shift with English-speaking guests | commute / locker room | high | **yes** | daily |
| C | Boredom in dead time (empty lobby 3am, break, bus, waiting for a table to turn) | mid/late shift | low | **yes** | many times daily |

**Q4 — most frequent internal trigger: C (boredom in dead time).** But C alone produces a Duolingo
clone: idle-time entertainment. The design that wins is **to use C's availability to discharge A's
emotion**:

> Fire the external trigger in dead time (C), but make the *content* about the failure moment (A).

Concretely: the drill that arrives in dead time should be recognizably *the thing that went wrong
last night*, or a near-miss of it. That converts low-intensity available time into high-intensity
relevance. This is the core creative insight from running this exercise, and we are not doing it
today.

**Narrative form (Exercise 2, Q5, line 100):**

> *Every time* **Rogelio has ten dead minutes on shift and the memory of the guest he couldn't
> understand surfaces*, **he opens the WhatsApp drill about exactly that situation.**

### 2.4 External trigger timing — where we are concretely broken

Exercise 2 Q7 is the question we fail. Our dispatcher
(`src/app/api/cron/whatsapp-daily/route.ts`) selects **every** opted-in employee in one batch:

```
.eq("is_active", true)
.eq("whatsapp_opted_in", true)
.not("phone", "is", null)
.limit(200)
```

There is no per-employee send time, no shift awareness, no timezone. It is a single global blast at
whatever hour the scheduler runs. **For a workforce on rotating turnos (matutino / vespertino /
nocturno), a single global send time is guaranteed to hit a large fraction of the roster while
they are asleep or actively serving a guest** — the two worst possible moments. A 9am message to
a night-shift bellboy who got off at 7am is not a trigger; it is a notification he'll clear
without reading, and every one of those trains him to ignore us.

**Build:** per-employee `shift` (already an enum in the codebase — `Shift` in
`src/lib/supabase/types.ts`) plus `timezone`, and a send-time policy per shift targeting that
shift's dead-time window. Then close the loop: log reply latency per employee per send-hour and
move each individual's send time toward their observed response peak (a simple per-user bandit
over ~4 candidate hours converges in about two weeks and needs no ML infrastructure).

### 2.5 Exercise 2 Q8 — three conventional, three "impossible"

The workbook explicitly asks for both, so here are both.

*Conventional:*
1. WhatsApp template message timed to shift dead-time (above).
2. **Physical trigger in the environment** — a small ink-blue card at the time clock / break room /
   staff entrance: *"Hoy: ¿cómo le dice a un huésped que su cuarto no está listo?"* with the
   answer only in WhatsApp. This is the highest-leverage external trigger available to us and it
   costs nothing, because **the buyer controls the physical environment and wants us to succeed.**
   Duolingo structurally cannot do this.
3. Supervisor mention in the pre-shift briefing (the *junta de pase de lista*) — again, buyer-
   granted.

*"Crazy / currently impossible":*
4. **PMS/PBX integration** — the property management system knows a guest with an English-language
   profile just checked into a room on this bellboy's floor. Trigger: *"Room 412 checked in — a
   phrase you'll probably need in the next hour."* This is the literal answer to Q7: the external
   trigger fires at the moment the internal trigger is about to be created. It is also a genuine
   enterprise moat and a reason a hotel chain would sign a bigger contract.
5. Guest-review NLP — a TripAdvisor/Google review mentions a communication breakdown at this
   property; next morning's drill for that department is that exact scenario.
6. Radio/earpiece integration for bell staff (they already wear one).

Item 4 should go on the roadmap as a real thing, not a fantasy. It is the strongest product idea
that came out of this source.

---

## 3. Action (Exercise 3, corpus lines 110–142)

### 3.1 What the workbook says

- *"The action is the simplest behavior in anticipation of reward"* (line 112). **Simplest.**
- **B = MAT** (Fogg): *"For any behavior to occur, a trigger must be present at the same time as
  the user has sufficient ability and motivation"* (line 113).
- Priority order is explicit (line 114): *"ensure a clear trigger is present; next, increase
  ability by making the action easier to do; finally, align with the right motivator."*
  **Ability before motivation.** Most teams reverse this.
- **Three Core Motivators** (line 115): pleasure/pain, hope/fear, social acceptance/rejection.
- **Six ability factors** (line 116): *time, money, physical effort, brain cycles, social
  deviance, non-routineness.*
- Exercise 3 Q1: *count the number of steps from internal trigger to outcome*, and compare to
  competitors (lines 124–126).

### 3.2 Our step count vs. the model

Exercise 3 Q1, counted honestly for the PWA daily practice
(`src/content/practice.ts` → `PRACTICE_COPY.steps`):

1. Feel trigger → 2. unlock phone → 3. find/open PWA → 4. intro screen, press "Empezar" →
5. **listening**: play audio, choose option → 6. **speaking**: grant mic, record, stop, submit,
wait for evaluation → 7. **reinforce**: listen, re-record → 8. **review**: 3 vocab cards ×
(reveal + grade) → 9. done screen.

That is roughly **15+ discrete interactions and 4 named phases** for one "5-minute" session, plus a
microphone permission prompt and a network-dependent scoring wait.

**This is the single biggest violation of the workbook in our product.** The Hook Model's *action*
is "the simplest behavior in anticipation of reward" — for Instagram it is *one scroll*, for
Google it is *one search*. **We have equated "the action" with "the lesson."** They are not the
same thing. The action is what must be trivially easy; the lesson is what happens *after* the hook
has already caught.

**Build:** the WhatsApp action must be **one keystroke — reply `2`**. The engine already supports
exactly this (`parseOptionReply` in `src/lib/whatsapp/engine.ts`, `awaiting_answer` state), which
is good. What must change is that everything after that first reply — the model phrase, the voice
note, the vocab — is **optional continuation, not required completion.** Today
`WHATSAPP_COPY.speakingPrompt` offers an out (`escriba LISTO`), which is right; but the streak
must tick on the **first reply**, not on completion. Reward the hook, not the homework.

### 3.3 The six ability factors, scored for a tired shift worker

This is the exercise (Q2, line 128) where our specific learner diverges hardest from a generic user.

| Factor | Severity for our learner | What it actually looks like | What we do |
|---|---|---|---|
| **Time** | High | Dead time comes in unpredictable 3–10 min slices that end without warning when a guest walks in | Drill must be **abandonable and resumable mid-step** with zero loss. Never a flow that punishes an interruption. Target time-to-first-reward **< 20 seconds**. |
| **Brain cycles** | **Very high** | End of a 9-hour shift on their feet; cognitively depleted; low prior success with school-style English | One decision per screen. Three options, never four. No instructions longer than one line. No new UI patterns after onboarding. Our 4-phase named structure ("01 Escuchar / 02 Responder / 03 Reforzar / 04 Repasar") reads as *school* — the exact frame that failed them before. |
| **Social deviance** | **Very high — and we are systematically ignoring it** | Speaking English aloud into a phone in a shared break room, in front of coworkers, when you're insecure about your accent | See §3.4. This is the finding. |
| **Physical effort** | Medium | One-handed, thumb-reach, possibly gloved/wet hands, uniform pockets, phone in a locker during some shifts | Everything reachable in the bottom third with one thumb. Tap targets oversized. No drag, no precise gestures. |
| **Money** | Medium–high | Prepaid data plan; WhatsApp is frequently **zero-rated** by Mexican carriers while general browsing is not | **This is a decisive architectural fact.** WhatsApp text may cost the learner literally nothing while the PWA costs data. Audio is the expensive part. Pre-cache audio over hotel wifi; never stream on cellular by default; keep drill payloads text-first. |
| **Non-routineness** | High for the PWA, **near zero for WhatsApp** | WhatsApp is already open dozens of times a day. A new installed app is a new routine. | **WhatsApp is the habit surface. The PWA is the depth/exam surface.** Stop treating them as equals. |

### 3.4 The ability barrier we are actively building into the product: social deviance

Fogg's "social deviance" factor (line 116) means: *how weird does this make you look to the people
around you?*

Our learner is an adult who is **embarrassed about their English** (that's the internal trigger,
§2.2), standing in a break room **with the coworkers they're embarrassed in front of**. Our
practice loop's steps 02 and 03 both require them to **speak English out loud into a phone**
(`micRequest`, `record`, `reRecord`, `practiceAgain` in `PRACTICE_COPY`), and the WhatsApp flow
asks for a voice note (`WHATSAPP_COPY.speakingPrompt`).

**We have made the highest-value learning activity coincide exactly with the highest social-cost
action, at the exact moment and place the user is most socially exposed.** That is a hard block on
B=MAT: motivation and trigger can both be present and the behavior still will not occur.

This does not mean drop speaking — speaking is the job skill and it's our differentiator. It means
**the speaking action must be re-engineered around social cost**:

- **Never make speaking the gate.** It must always be skippable without penalty, and skipping must
  never cost the streak. (Today's WhatsApp flow gets this right; the PWA's framing of step 02 as a
  numbered required stage does not.)
- **Whisper mode / sub-vocal**: explicitly invite a whisper. *"Puede decirlo en voz baja — el
  micrófono lo escucha."* One line of copy that removes a real barrier.
- **Silent alternatives that still train production**: choose-the-correct-phrase, order-the-words,
  type-the-phrase, shadow-along-muted-with-text. These carry most of the retrieval benefit at zero
  social cost, and they are what a learner will actually do in a break room.
- **Private-by-default and say so**: *"Nadie de su hotel escucha sus grabaciones"* — because the
  employer relationship means the learner will assume the opposite, and that assumption alone will
  suppress recording. This must be stated in the UI, not just in a privacy policy.
- **Route speaking to the private moments**: the commute, the locker room, the walk home. This is
  another argument for shift-aware send timing (§2.4) — the speaking-heavy drill should be the
  *post-shift* touch, not the mid-shift one.

### 3.5 Core motivator selection — where the Duolingo playbook actively misleads us

Line 115 gives three: pleasure/pain, hope/fear, social acceptance/rejection.

**Duolingo runs on pleasure** (cute, playful, entertaining) plus **loss-aversion on the streak**.
A naive team copies that. For our learner and our buyer it is the wrong pick on all three counts:

- **Pleasure/pain is our weakest lever.** Our learner is not a hobbyist; a tired 40-year-old
  waiter does not open an app for delight. Chasing "fun" also drags us toward the cartoon register
  that collides with the shame trigger (§2.2) and with the design system.
- **Hope/fear is our strongest lever.** Hope of a better tip, a front-desk promotion, a job at a
  better property, being the one who can handle the English-speaking guest. Fear of being passed
  over. Copy should be concrete about this: *"Esta frase la va a usar esta noche"* /
  *"Los huéspedes que reciben esto dejan mejor propina"* — never *"¡Diviértete aprendiendo!"*.
- **Social acceptance is our second strongest**, and it's real rather than abstract because our
  learner has a *real* peer group — their turno, their department — unlike a Duolingo user
  competing with strangers. See §4.2.

**Stop doing:** any copy or visual that reaches for cuteness or play. It is not a style
disagreement — it targets the one motivator we're weakest on and undermines the trigger.

---

## 4. Variable reward (Exercise 4, corpus lines 148–163)

### 4.1 What the workbook says, and the word everyone drops

Three types (lines 150–151):
- **Tribe** — *"social rewards fueled by connectedness with other people."*
- **Hunt** — *"the search for material resources and information."*
- **Self** — *"intrinsic rewards of mastery, competence, and completion."*

Exercise 4 Q2 (line 160) is the sharp one: *"What outcome (reward) alleviates the user's pain? Is
the reward fulfilling? **Does it leave the user wanting more?**"*

The load-bearing word is **variable**. A predictable reward stops working — the brain habituates
and the dopamine response flattens. Exercise 4 Q1 (line 158) insists this be found by
**open-ended interviews with five real users**, looking for *"moments of delight or surprise."*

### 4.2 Audit: every reward we ship today is 100% predictable

| Reward we ship | Where | Variable? |
|---|---|---|
| `"✅ ¡Correcto!"` | `src/content/whatsapp.ts` | **No** — identical string, every time |
| `"❌ No exactamente..."` | same | **No** |
| Model phrase after the answer | `WHATSAPP_COPY.modelLabel` | **No** — always appears |
| Streak +1 | `src/lib/practice/streak.ts` | **No** — deterministic |
| Vocab card scheduling | `src/lib/practice/sm2.ts` | **No** — SM-2 is deterministic |
| `"¡Terminó su práctica de hoy!"` | `WHATSAPP_COPY.doneCore` | **No** |

**Our reward schedule is fixed-ratio and fully predictable end to end.** By day 10 the learner
knows exactly what every screen will say before it says it. Under the model, that is a product
that will decay to zero engagement regardless of content quality — and it explains why "add more
drills" would not fix retention.

Note the trap here: **the drills themselves vary** (60+ of them, rotated by
`src/lib/practice/picker.ts`), and it is easy to mistake content rotation for variable reward. It
isn't. The *reward structure* is identical every time; only the noun changes. Variability has to
live in the payoff.

### 4.3 What to build, by type

**Hunt — variable value of the phrase itself.** Not every phrase is worth the same to a bellboy.
Some are worth a tip. Make that explicit and **unpredictable**:

- **"Frase de oro"** — roughly 1 in 5–7 sessions, at random, the drill yields a specially marked
  high-value phrase (the one that reliably produces a tip, defuses an angry guest, or handles the
  situation everyone dreads). Marked as rare, kept permanently in their phrasebook (§5).
  Variable-ratio schedule; the learner cannot predict which day it lands. This is the single
  highest-leverage reward change available to us and it is nearly free to build — it's a flag on
  existing content plus a delivery rule.
- **Guest-request roulette** — occasionally an unusually specific/absurd real guest request
  ("*Can you find a vegan birthday cake at 11pm?*"). War stories are inherently rewarding to
  service staff and infinitely shareable.
- Keep the *base* reward (correct/incorrect + model phrase) but **vary the surrounding payoff** so
  the ceiling is unknown.

**Tribe — our most underused reward, and the one Duolingo cannot copy.** Our learner has a real
tribe: their turno and their department, people whose opinion materially matters to them.

- **Crew presence, not leaderboards**: *"3 de 6 en recepción ya practicaron hoy."* Real coworkers,
  ambient, non-ranked.
- **Team-level goals** (turno vs. turno, department vs. department) rather than individual ranking.
  Individual public ranking is dangerous in a B2B context — see §6.
- **Peer recognition on voice**: a coworker or a supervisor can send a one-tap *"bien dicho"* on a
  recorded phrase. Genuinely variable (you don't know if or when it arrives) and socially real.
  Gate it carefully against the social-deviance risk in §3.4 — opt-in, never automatic.
- **The supervisor's unpredictable acknowledgment** — give supervisors a one-tap way to send
  recognition from the HR dashboard. Costs the supervisor 2 seconds, is high-variance and
  high-intensity for the learner, and increases buyer engagement with the product at the same
  time. Rare double-win.

**Self — mastery, and we already own the best asset in the category.** The CEFR level is a
credential this learner genuinely wants and currently only sees at exam time.

- **Continuous, visible progress toward the next CEFR band**, always on: *"Le faltan 12 frases
  para A2."* Competence made legible.
- **Unpredictable micro-recognition of real improvement** — when scoring detects a genuine jump
  (a sound they've been missing, a phrase they used to fail), surface it. Unpredictable because
  improvement is unpredictable, which makes it naturally variable and *earned* rather than
  administered.
- **The re-test as an event** the learner can request when they feel ready. Self-initiated
  assessment is a completion reward and doubles as our best B2B evidence artifact.

### 4.4 Exercise 4 Q1 is a direct instruction we have not followed

*"Speak with five of your customers or users in an open-ended interview"* (line 158).

Per project memory, we have **0 paying customers and 7 uncontacted leads**. We have therefore
never observed a single moment of delight or surprise in a real learner, which means every reward
decision above — including mine — is a **hypothesis, not a finding**. The workbook's framing is
explicit about this: its stated output is *"a set of hypotheses you can test"* (line 40).

**This is the honest headline from this source: the Hook Model cannot be completed from a desk.**
Two of its seven exercises (4 and 7) require user data we do not have.

---

## 5. Investment (Exercise 5, corpus lines 169–187)

### 5.1 What the workbook says

- *"Unlike the action phase, which delivers immediate gratification, the investment phase concerns
  the **expectation of a future benefit**"* (line 171).
- Why it works (line 172): people *"overvalue their work, seek to be consistent with past
  behaviors, and avoid cognitive dissonance"* — IKEA effect + consistency bias.
- **Stored value** (line 173): *"content, data, followers, reputation, and skill."*
- **Loading the next trigger** (line 174): investments *"increase the likelihood of users passing
  through the Hook again by loading the next trigger to start the cycle all over again."*
- Exercise 5 Q3 (line 186): *"Identify how long it takes for a 'loaded trigger' to reengage your
  users. How can you reduce the delay?"*

### 5.2 Stored-value audit against Eyal's five categories

| Eyal's category | What Inglés Hotelero stores today | Verdict |
|---|---|---|
| **Content** | Nothing the learner created | **Empty** |
| **Data** | `drill_history`, SM-2 vocab state, exam answers | Present but **invisible to the learner** — stored value the user can't see doesn't create switching cost |
| **Followers** | Nothing | Empty (and mostly N/A — but see Tribe, §4.3) |
| **Reputation** | HR-visible record, CEFR level | **Present and strong** — and unique to B2B |
| **Skill** | Real, but only legible at exam time | Under-surfaced |

Three of five empty, one invisible. **Our hook has almost no investment phase**, which is the
phase that makes a product get *better with use* and creates the switching cost. This is why the
product would feel replaceable by Duolingo even though it is objectively better-targeted.

### 5.3 The investments to build, in priority order

**1. The learner's own voice archive — "escúchese hace 30 días."**
Every recorded attempt is retained; at 30/60/90 days the learner hears their own first attempt
against their current one.

Why this is the best investment mechanic available to us:
- It is **content the user created** (IKEA effect) and **data** and **proof of skill** at once.
- It gets **better with use, automatically** — the archive's value grows every single day with no
  additional effort from the learner. That is Eyal's definition of stored value, exactly.
- It is **non-exportable**: a competitor cannot import it. This is a real moat.
- It converts an abstract claim ("you improved") into a visceral one. For a learner with **low
  prior success at English**, hearing undeniable evidence of their own progress attacks the exact
  belief that makes them quit.
- It doubles as the **buyer's** evidence artifact — a before/after reel is the single most
  persuasive thing a hotel GM could be shown at renewal.

Duolingo cannot do this. We already capture the recordings (`src/app/api/recordings/route.ts`);
we simply don't give them back. **Highest-value/lowest-cost item in this entire document.**

**2. "Mis frases" — the personal phrasebook.**
One tap to save a phrase. Grows into a personal, on-shift reference the learner can pull up mid-
task. Three effects: (a) content investment/IKEA effect; (b) the app becomes useful *during* the
shift, creating an entirely new trigger context; (c) it is a natural home for the "frase de oro"
rare rewards from §4.3, tying investment to variable reward.

**3. The failure capture — "¿Qué le dijeron hoy que no entendió?"**
Post-shift, one line of text or one voice note. This is simultaneously:
- an **investment** (a bit of work, expecting future benefit),
- the **load for tomorrow's trigger** (§5.4),
- and the mechanism that solves §2.3's problem of connecting the high-intensity internal trigger
  (A) to the high-availability moment (C).

It is also, quietly, a **content engine**: real guest utterances from real properties, which is
exactly the corpus we need and cannot buy. And it produces per-property intelligence the HR buyer
would pay for on its own ("your front desk is failing on late-checkout requests").

**4. Make the invisible data visible.** Surface the difficulty profile we already compute: *"sus
3 palabras más difíciles."* Zero new data, pure surfacing, immediate perceived stored value.

### 5.4 Loading the next trigger — the step teams skip

Line 174 is the mechanism most products never implement: the *end* of one hook must **load** the
next one. Today our session ends with a terminal statement —
`"¡Terminó su práctica de hoy! Mañana le enviamos el siguiente ejercicio."` Nothing is loaded.
Tomorrow's message is generic and system-chosen.

**Build:** end every session with a small act that determines tomorrow's content, then have
tomorrow's trigger *pay off that specific act*:

- Session ends: *"¿Qué situación le costó trabajo hoy?"* → learner taps one of three, or sends the
  failure capture.
- Tomorrow's WhatsApp message opens with: *"Ayer nos dijo que le costó el check-out tardío. Hoy
  practicamos eso."*

Now the external trigger is **about them**, references **their own work**, and delivers on an
expectation they created. That is the full investment→trigger loop, and it costs one extra tap.

### 5.5 Exercise 5 Q3 — shortening the loop, and the case for two hooks a day

*"How can you reduce the delay to shorten time spent cycling through the Hook?"* Our current cycle
is 24 hours. The natural structure of shift work gives us a way to halve it:

- **Pre-shift (loaded the night before):** 2 phrases you will likely need tonight, given your role
  and what you struggled with. ~45 seconds. Text-only, silent, zero social cost.
- **Post-shift:** the failure capture + optional voice note. Private moment (commute/home), which
  is where speaking belongs per §3.4.

Two hooks per day, each *shorter* than the current single session, each anchored to a real
boundary in the learner's actual day rather than an arbitrary clock time. Higher frequency is the
strongest predictor of habit formation (line 51: *"To form a habit, people must do the behavior
frequently"*), and pre/post-shift bracketing is a routine that already exists — so it scores well
on Fogg's non-routineness factor too.

### 5.6 A concrete bug that destroys our only existing stored value

`src/lib/practice/streak.ts` computes calendar days in **UTC**:

```js
export function isoDate(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);   // UTC
}
```

The file's own comment justifies this: *"Practice 'day boundaries' feel local to the user when
their device timezone matches the server, which is the typical case."* **That premise is false for
our entire user base.** The server is UTC (Vercel); Cancún/Quintana Roo is UTC−5 year-round, CDMX
is UTC−6. So **the UTC day boundary falls at 7:00 pm in Cancún and 6:00 pm in Mexico City** —
squarely inside the evening, which is prime practice time for hospitality staff.

Failure case: a waiter practices at **6:00 pm Monday local** (= 23:00 UTC Mon) and again at
**8:00 pm Tuesday local** (= 01:00 UTC Wed). Local calendar days: Monday, Tuesday — consecutive.
UTC days: Monday, Wednesday — a gap. `yesterdayOf()` doesn't match, so `nextCurrent = 1` and
**the streak silently resets to 1 despite two consecutive days of practice.**

This is not a cosmetic bug. The streak is currently the *only* stored value the learner can see
(§5.2), and evening practice is the modal case for this workforce, so this will fire routinely and
will read to the learner as *the app cheated me* — the fastest way to kill a fragile habit in
someone with low prior success. **Fix: store a per-employee timezone and compute the calendar day
in the learner's local zone** (America/Cancun, America/Mexico_City) in `streak.ts`,
`picker.ts` (`dayOfYear` rotation has the same flaw), and the daily cron.

### 5.7 The streak itself needs to be shift-aware

Related but separate from the bug: a strict consecutive-day streak **punishes exactly the behavior
our buyer requires**. A doble turno, a 6-day block, a family emergency — these are normal in
hospitality and none of them are a motivational failure. Copying Duolingo's punishing streak means
we churn our best-intentioned learners for working hard.

Build: **días de descanso** — the streak measures *"5 of the last 7 days"* rather than an unbroken
chain, plus explicit rest days that HR can align to the roster. Same motivational pull, no
punishment for being scheduled onto a double.

---

## 6. The Manipulation Matrix (Exercise 6, corpus lines 193–205)

Two questions (lines 203–205): *"Do you use your own product?"* and *"Do you believe that the
behavior you are designing materially improves people's lives?"* Answering yes/yes = **Facilitator**
(the only unambiguously defensible quadrant).

Inglés Hotelero is a Facilitator: functional English measurably raises a hospitality worker's
income (tips), mobility (front desk pays more than bellboy), and job security. Diego should also
be able to answer the first question honestly — *he does not currently use the product to learn
anything*, which is the standard Facilitator's blind spot. The nearest available proxy: **use the
product's own daily-drill format to learn something he actually needs**, and feel where it is
annoying.

**But B2B changes the ethics in a way the workbook doesn't cover, and it cuts both ways:**

- **In our favor:** the buyer wants the habit to form and will lend us the physical environment,
  the supervisor's voice, and paid time. Habit design that would be manipulative in a consumer app
  is legitimate here because the learner's employer is openly sponsoring the behavior.
- **Against us:** the learner **cannot freely opt out** the way a consumer can. Their performance
  is visible to the person who writes their schedule. That converts several standard Hooked
  techniques into coercion:
  - **Individual public leaderboards → do not build.** Being last on a list your supervisor sees
    is a workplace-safety problem for that employee, not a motivator. (This is why §4.3 specifies
    team-level tribe rewards and ambient crew presence, never individual ranking.)
  - **Streak-loss anxiety → cap it.** Combined with §5.7, never let a broken streak be reported to
    HR as a performance signal.
  - **Voice recordings → private by default, and say so** (§3.4). If the learner suspects their
    supervisor is listening to their accent, they will never record. State the boundary in the UI.
  - **HR-visible reputation is a real motivator** (§5.2) and we should use it — but as *evidence of
    progress*, never as *surveillance of effort*. Report level movement and completion rates at the
    cohort level; do not build a per-employee "days missed" column that reads as a discipline tool.

This is a place where doing the right thing is also the commercially correct thing: a product that
gets an employee in trouble will be quietly boycotted by the whole staff within a week, and the
buyer's numbers will collapse.

---

## 7. Habit Testing (Exercise 7, corpus lines 211–227)

### 7.1 What the workbook says

- Habit Testing is **identify → codify → modify** (line 215); it *"helps uncover product devotees,
  discover which product elements (if any) are habit forming, and why"* (line 214).
- The four questions (lines 224–227):
  1. How frequently would you expect a habituated user to interact?
  2. **What percentage of users used your product habitually over the past 60 days?**
  3. **What is unique about these habituated users? What did they do that non-habituated users
     did not?**
  4. **Can you modify the experience so that all users take the same actions as your habituated
     users?**

### 7.2 Applied — and this is where the source indicts our roadmap

Q2, Q3, Q4 all require live user data. Per project memory: **0 paying customers, 7 uncontacted
leads, and a product spanning 8 built phases including a Master OS, org hierarchy, CRM, and 1000+
programmatic SEO pages.** We cannot answer a single one of Exercise 7's questions.

The strategic reading is unambiguous, and it agrees with what's already in `docs/PHILOSOPHY.md`:
**the next unit of work is not a feature. It is one pilot property plus the instrumentation to run
Habit Testing on it.**

Concretely, before or alongside any of the builds above:

1. **Define the habituated user, in advance, in code.** Proposal: *practiced ≥4 of the last 7 days,
   sustained ≥3 weeks.* Commit to the number before seeing data so it can't be rationalized later.
2. **Instrument the funnel that actually matters** — not pageviews. Per employee per day:
   trigger sent → trigger opened → first reply (the *action*) → continuation → investment
   (capture/save). We currently log `drill_history` but have no funnel view of trigger→action.
3. **Identify** the devotees in the pilot cohort. **Codify** what they did differently in week 1 —
   Eyal's premise is that there is usually a specific early action ("the aha") that separates them.
   Hypotheses worth pre-registering: they were on a specific turno; they got their first "frase de
   oro" early; they had a coworker also using it; they replied to the very first message within
   the first hour.
4. **Modify** to force everyone through whatever week-1 action the devotees took.
5. **Kill features that no devotee touches.** With this much surface area built, this will be a
   large and useful list.

### 7.3 Nascent behaviors — free product intelligence during the pilot

Lines 216 and 245–246 push toward watching for *"products used in a way the maker had not
intended."* Specific things to watch for in the pilot, each of which is a product spec if observed:

- **Screenshotting a phrase** → they want an offline, on-shift reference → build "Mis frases" (§5.3)
  and make phrase cards deliberately screenshot-shaped.
- **Forwarding the drill to a group chat** → latent tribe demand → build crew features (§4.3).
- **Using it mid-task with a guest present** → they want a *live assist*, not training → an entirely
  separate and possibly larger product ("what do I say right now?").
- **HR forwarding drills to staff who aren't enrolled** → seat expansion demand → self-serve
  add-a-seat.
- **A supervisor running the drill aloud in the pre-shift briefing** → a group/team mode we don't
  have, and a strong retention surface because it's socially enforced.

---

## 8. Where this source contradicts what a naive product team would do

Flagged loudly, as requested.

1. **Naive: "the daily lesson is the action, make it a great 5-minute lesson."**
   Workbook: the action is *"the simplest behavior in anticipation of reward"* (line 112).
   **Our action is one reply — `2`. The lesson is what comes after the hook is set.** Our current
   15-interaction, 4-phase loop confuses the two. Tick the streak on the first reply.

2. **Naive: "increase motivation — more encouragement, more badges, better copy."**
   Workbook: order is **trigger → ability → motivation** (line 114). Ability comes first. Almost
   every retention problem we will hit is an ability problem (§3.3), and social deviance (§3.4) is
   the one we're actively making worse.

3. **Naive: "make it fun and playful so people want to come back."**
   The internal trigger is **shame about their English** (§2.2). Playfulness in a shame moment
   reads as mockery. Our "Respeto, no condescendencia" principle is functionally required, not
   stylistic. Motivator is **hope/fear + social acceptance**, not pleasure.

4. **Naive: "we have 60+ drills that rotate, so the experience is varied."**
   Content rotation ≠ variable reward. **Every reward we ship is deterministic** (§4.2). The
   payoff structure must vary — "frase de oro" on a variable-ratio schedule is the cheapest fix.

5. **Naive: "the streak is the retention mechanic, copy Duolingo."**
   The streak is our *only* stored value (§5.2), it's **computed in UTC and will silently break for
   evening practice in Mexico** (§5.6), and a punishing consecutive-day rule penalizes doble
   turnos (§5.7). Fix the timezone, then make it "5 of 7," then build real investment underneath it.

6. **Naive: "send the daily message every morning at 9."**
   Exercise 2 Q7 (line 103): fire the external trigger as close as possible to the internal
   trigger. For rotating turnos there is no global 9am. Our cron currently blasts all 200 at once
   (§2.4).

7. **Naive: "speaking practice is our differentiator, so require it."**
   Requiring speech in a break room is the highest social-deviance action we could ask for from the
   most embarrassed user at their most exposed moment (§3.4). Keep speaking; make it optional,
   private, whisper-friendly, and routed to post-shift.

8. **Naive: "build more features, then sell."**
   Exercise 7 cannot be answered without users (§7.2). We are 8 phases deep with 0 customers. The
   Hook Model's output is *"a set of hypotheses you can test"* (line 40) — we have hypotheses and
   no test.

9. **Naive: "leaderboards drive engagement."**
   In B2B, an individual ranking visible to the person who writes the schedule is coercion, not
   motivation (§6). Team-level and ambient only.

10. **Naive: "the exam is the product — it's what they pay for."**
    The exam cannot form a habit (line 71 gate). It's the wedge. The daily WhatsApp drill is the
    only surface that clears the frequency gate, and it is our least-finished phase.

---

## 9. Build list, ordered

**P0 — cheap, fixes something broken or unlocks the model**
1. Fix the UTC day-boundary bug in `src/lib/practice/streak.ts` (+ `picker.ts` `dayOfYear`, daily
   cron). Per-employee timezone. (§5.6)
2. Tick the streak on **first reply**, not on completion. (§3.2)
3. "Frase de oro" — variable-ratio (~1 in 5–7) high-value phrase. Flag existing content + a
   delivery rule. (§4.3)
4. Whisper-mode copy + explicit "nadie de su hotel escucha sus grabaciones." (§3.4)
5. Silent alternatives to the speaking step (order-the-words / choose-the-phrase). (§3.4)

**P1 — the missing investment phase**
6. Voice archive: "escúchese hace 30 días." Recordings are already captured; give them back. (§5.3)
7. "Mis frases" personal phrasebook, one-tap save. (§5.3)
8. Failure capture: "¿Qué le dijeron hoy que no entendió?" → loads tomorrow's trigger. (§5.3/§5.4)
9. Tomorrow's message references yesterday's capture by name. (§5.4)

**P2 — trigger timing and tribe**
10. Per-employee shift + timezone; send in that shift's dead-time window; per-user send-hour
    bandit. (§2.4)
11. Split into pre-shift (silent, 45s) and post-shift (private, speaking) hooks. (§5.5)
12. Crew presence ("3 de 6 en recepción ya practicaron hoy") — team-level only, never individual
    ranking. (§4.3/§6)
13. One-tap supervisor recognition from the HR dashboard. (§4.3)
14. Shift-aware streak: "5 of the last 7 days" + rest days. (§5.7)

**P3 — the moat**
15. Continuous CEFR progress bar + learner-requested re-test. (§4.3)
16. Physical break-room trigger cards for pilot properties. (§2.5)
17. PMS integration: trigger on English-profile guest check-in. (§2.5)

**Cross-cutting, do first: instrument for Habit Testing** (§7.2) — define the habituated cohort in
code, log the trigger→action funnel, run one pilot property.

**Stop doing**
- Building B2B surface area (Master OS, org hierarchy, SEO pages) ahead of one instrumented pilot.
- Any cute/playful register in learner-facing copy.
- Treating the PWA and WhatsApp as equal-priority habit surfaces.
- Requiring speech to complete a session.
- Planning any individual-ranking leaderboard.

---

## 10. Honest limitations of this source

- It is the **workbook, not the book**. The mechanisms (variable-ratio schedules, the Fogg model's
  derivation, the case studies, the Manipulation Matrix's quadrants) are referenced but not
  explained. Anything above that reads as mechanism is my inference plus general knowledge, not a
  citation from this file.
- It is **2014**, pre-dating the backlash to engagement optimization; Eyal's own later work
  (*Indistractable*) walks some of it back. The Manipulation Matrix (§6) is the only ethical
  guardrail here and it is thin for a B2B context where the user cannot freely leave.
- It is built for **consumer products with a direct user-payer relationship**. Our split
  learner/buyer structure creates both an advantage (§1 Q2) and an ethical hazard (§6) that the
  source does not address at all.
- **Two of its seven exercises (4 and 7) require user data we do not have.** Everything derived
  from those is a hypothesis awaiting a pilot.

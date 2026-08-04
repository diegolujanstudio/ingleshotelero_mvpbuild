# Design for How People Learn — Julie Dirksen (New Riders, 2012)
## Mined for Inglés Hotelero: instructional-design fundamentals

**Source file:** `scratchpad/corpus/design-for-how-people-learn.txt` (3116 lines; core content lines 1–2240, index/front-matter after)
**Structure:** 10 chapters — 1 Where Do We Start? (gaps) · 2 Who Are Your Learners? · 3 What's The Goal? · 4 How Do We Remember? · 5 How Do You Get Their Attention? (elephant/rider) · 6 Design for Knowledge · 7 Design for Skills (practice + feedback) · 8 Design for Motivation · 9 Design for Environment · 10 Conclusion

**Read status:** full read of all nine substantive chapters at depth.

---

## 0. The big idea in one paragraph

Dirksen's thesis: **the end of the learning journey isn't knowing more, it's *doing* more** — and the reason most training fails is that designers reflexively treat every performance problem as a knowledge gap and ship information at it. Before you design anything, diagnose *which of five gaps* you're actually facing (knowledge / skill / motivation / environment / communication), because only one of them is fixed by delivering content. Everything else in the book follows from that: memory works by association and context, so encode where you'll retrieve; skills require spaced practice plus frequent varied feedback, not exposure; the emotional/automatic brain ("the elephant") decides whether attention happens at all and is bigger than the rational "rider"; and the cheapest, most-neglected intervention is not teaching harder but **moving knowledge out of the learner's head and into their environment.**

For us this is not abstract. **Our learner's gap is only ~25% knowledge.** It is mostly skill (speaking requires practice, full stop), motivation (embarrassment, exhaustion, "I know but…"), and environment (nobody at the hotel supports English, no minute of the shift is free, no job aid exists at the front desk). A naive product team — and, frankly, our current daily drill — is building a knowledge-gap solution for a skill-and-environment problem. That is the single most valuable finding in this book for us.

---

## 1. Gap analysis (Ch. 1, lines 16–220; revisited Ch. 3, 665–672)

### What the book says

Five gap types. The diagnostic questions matter more than the taxonomy:

| Gap | Test question | Fix |
|---|---|---|
| **Knowledge** | "What information do they need, and *when along the route*?" | Supply it — cheap in the information age. Cache non-critical info for pickup at point of need. |
| **Skill** | *"Is it reasonable to think someone can be proficient without practice?"* If **no**, it's a skill. | Practice + feedback over time. Nothing else works. |
| **Motivation** | "Could they do it if they wanted to badly enough?" If **yes**, it's not knowledge or skill. Listen for *"I know, but…"* | Design for attitude, self-efficacy, immediacy, social proof. |
| **Environment** | "Is there anything — *anything at all* — we could do besides training that would make the right thing more likely?" | Job aids, process redesign, triggers, embedding behavior in tools. |
| **Communication** | "Are the goals being clearly communicated?" | Not a learning problem. Document it, handle politics, do no harm. |

Key sub-findings:
- **Change is a special motivation gap.** Learning that requires *unlearning* is much harder — the old behavior is automated, so the learner must consciously *not* do something, which "can make people grumpy." Backsliding is part of successful change, not evidence of failure. **Change is a process, not an event** (restated Ch. 8, line 2063).
- **L1 interference is named explicitly** (line 100): first-language knowledge interferes with second-language production. Dirksen uses this as her canonical example of old procedures blocking new ones.
- Her killer anecdote (line 202): a client with high turnover asked for *a training course on company history* to fix it. "We gently suggested that if they had a high turnover rate, it was probably not primarily due to employee ignorance of company history." They lost the contract.
- The drug-prevention curriculum that worked (line 207): earlier programs taught information ("THIS is a crack pipe. Crack is BAD."). The effective one drilled the *skill* of handling awkward social situations — role-plays, skits, rehearsed lines.

### Applied to Inglés Hotelero — the honest diagnosis

**Learner-side gaps, ranked by size:**
1. **Skill (largest).** Producing an English sentence to a real guest under time pressure is unambiguously a skill by Dirksen's test. No amount of vocabulary delivery produces it.
2. **Motivation / self-efficacy.** Not "doesn't want a better job" — but "is embarrassed," "has failed at school English before," "is tired at 11pm," "believes English is for other people." Classic *"I know, but…"*: many staff know the phrase and still default to Spanish + gestures because the elephant fears the humiliation *now* more than it wants the promotion *later*.
3. **Environment.** The shift has no slack. There is no phrase card at the bell stand. The supervisor doesn't reinforce. Nobody models it. Wifi is bad and data is prepaid.
4. **Knowledge (smallest).** ~150–300 job-specific phrases. This is genuinely small and genuinely fast.
5. **Communication.** The GM says "improve our English" but has never specified which situations. This is *our* problem to solve for them, and it is a sales asset.

**Buyer-side:** the HR director/GM is buying to close what they believe is a knowledge gap. Part of our sales job is to reframe it — "we don't teach English, we install the twelve situations your staff actually fail at, and we prove it." That reframe *is* the differentiation from Duolingo/Open English.

**Concrete build implications:**
- Add a **Gap Diagnostic** to the pre-sale/onboarding: 6 questions to the GM ("If your bellboy wanted to badly enough, could he handle a lost-bag complaint in English today?"). Output = a one-page gap map that scopes the pilot. This is a sales artifact *and* a curriculum-scoping instrument.
- **Stop calling the product "training."** Call it what it does: *"que tu personal resuelva en inglés las 12 situaciones que más pasan en tu hotel."*
- Explicitly design an **unlearning track** for staff who already speak "tourist-zone pidgin" ("Yes yes, room, no problem"). Expect backsliding; do not treat regression as churn. Ship counter-example drills (see §10).
- Add an **environment intervention** to every pilot — see §5. This is the highest ROI/lowest cost thing we are not doing.

---

## 2. Memory: encoding, retrieval, and the "closet" (Ch. 4, lines 734–1072; Ch. 2, 414–446)

### Mechanisms

- **Three-stage filter:** sensory → working → long-term. Working memory is the *gatekeeper*: "if the initial information overloads working memory, it's unlikely to make the transition to long-term memory" (line 839).
- **Habituation.** People stop noticing consistent stimuli — "banner blindness" (Nielsen 2007). Consequence: *"if you give the same type of feedback in the same location every single time, learners are going to learn to ignore it, particularly if the feedback is the generic 'Good Job!' kind"* (line 769). But **annoying, meaningless variability is also bad** (line 770) — vary *meaningfully*, not randomly.
- **Chunking.** `9 3 4 8 7 1 6 2 5` is hard; `100 500 800` is easy; `1 2 3 4 5 6 7 8 9` is one chunk. Her worked example: the apple-pie recipe as 18 flat steps vs. the same steps grouped as *Prepare the dough / Prepare the filling / Assemble / Bake* (lines 826–838).
- **Primacy & recency** (line 807): beginnings and ends of sequences survive; middles are lost.
- **The closet metaphor.** Experts have shelves (many indexed categories); novices have a pile on the floor. **Retrieval depends on how many shelves an item sits on.** "The more shelves you can put an item on, the more likely that you'll be able to retrieve it in the future. **This is the problem with pure memorization tasks, such as flash cards — things you've learned that way tend to be on only one shelf** (the 'things you've memorized' shelf)" (line 859).
- **Memorization is the blunt-force solution** (lines 1038–1051): like building a cathedral wall thick instead of engineering it. Three named limitations: one shelf only; no transfer across contexts; **sequential rather than random access** — you have to tick through the list every time.
- **Ways to build shelves for novices** (lines 427–436): high-level organizer; visuals; story; work through problems; have learners design their own organization; metaphor/analogy.
- **Bransford (1972) context experiment** (lines 394–405): the same opaque paragraph becomes comprehensible and memorable *only if you know what it's about beforehand*. The group told "this is about laundry" **before** reading beat the group told **after**.
- **In-context learning** (lines 873–899). Pop quiz: best place to study for a classroom exam is *the grey windowless classroom with the noisy A/C* — because environment becomes part of the association. "The further the learning is from the context of use, the fewer shelves are being utilized." She notes that **whenever lives are at stake we always do in-context training** (flight simulators, teaching hospitals, actual road time in driver's ed) — out-of-context training persists elsewhere purely from "habit, tradition, or lack of awareness."
- **Emotional context is the hardest and most neglected** (lines 900–916). You learn to give difficult feedback in a calm room and then have to use it while your heart is pounding. *"I believe this is why a lot of learning fails. Have you ever said to yourself 'I knew the right thing to do, but…'"* Stress makes us fall back on automatic responses. Remedies she gives: role-play (even fake role-play makes the words easier to recall because you *said them out loud*), **create pressure** (a tight time limit approximates other pressure), and invest in quality stories/acting.
- **Encoding must align with use** (lines 917–949). Three levels: **recognize < recall < do.** "If someone is just going to need to recognize the right answer, then recognition activities are good ways to learn and practice. If someone needs to recall something unprompted, then they will need to learn and practice by recalling." Multiple-choice dominates e-learning **for the practical reason that computers can grade it**, not because it teaches. Her CPR example: none of the plausible-looking e-learning activities are recall activities; CPR requires recall.
- **Real vs. perceived knowledge** (lines 940–948): recognition creates the illusion of knowing. Karpicke (2011): *retrieval practice* produces more learning than elaborative studying.
- **Types of memory** (lines 950–1027): declarative/semantic, **episodic** (stories), **conditioned** (stimulus→automatic response), **procedural** (automated, frees attention, acquired only through overlearning), **flashbulb** (emotion opens the floodgates). Using multiple types improves retention.
- **Stories stick** because (a) we already own the shelves, (b) sequence supplies organization, (c) characters give us more shelves, (d) an implied puzzle creates suspense.

### Applied — this is where our current drill design is weakest

**Finding: our daily drill is a recognition machine.** Per `src/content/practice-drills.ts`, each drill is `listening (3-option multiple choice in Spanish) → reinforce (model phrase shown to them) → vocabulary (3 flashcards)`. By Dirksen's ladder, that is **recognize, recognize, recognize** — with a *pure flashcard* component that she names as the canonical single-shelf failure. Our learner's job requires **do** (produce a sentence at a guest). We are practising the wrong operation.

Also note the file's own comment: *"V1 deliberately omits the speaking step from the daily flow… adding MediaRecorder here doubles the implementation cost."* That was a defensible V1 shortcut; it is **not** a defensible V2. The speaking step is not a nice-to-have — under this book it is the only part of the loop that is actually practising the target skill.

**Build / change / stop:**

1. **Every drill must end in production, not recognition.** Minimum viable: after the model phrase, the learner must *say it out loud* into the mic and hear their own audio played back next to the model. Even without scoring, "just having practised saying the words out loud makes them easier to recall in real-life situations" (line 914). This is cheap and it converts the whole loop from recognize→do.
2. **Kill standalone vocabulary flashcards.** Replace with the same words embedded in a situation with a guest, a place, a consequence, and a required utterance. Flashcards put words on one shelf; we need six.
3. **Ladder every item explicitly.** Tag each content item `recognize | recall | produce` and enforce that a learner cannot be marked "domina" on a phrase they have only recognized. Our progress UI currently rewards recognition; that is manufacturing false confidence in the learner *and false evidence for the buyer*.
4. **Encode in context — visually and sonically.** Set each drill in a photographed real lobby / front desk / restaurant floor (we already own a Pexels/location image library from the SEO work — reuse it). Add ambient audio (lobby murmur, restaurant clatter) under the guest's line. Both are near-free and add shelves.
5. **Add emotional context deliberately.** Currently a drill feels like a calm quiz. Real retrieval happens with a tired learner and an impatient guest. Ship a **"guest heat" mechanic**: guest audio in three temperaments (neutral / hurried / annoyed), and a **response timer** on higher levels (Dirksen: a tight time limit approximates other pressure — with her explicit caution that 15–18 min for a 20-min task creates urgency, 5 min creates *pissed-off learners*; so calibrate to ~80% of comfortable, never 25%).
6. **Chunk by situation, not by grammar or word list.** Our unit of content should be a *situation* ("check-in with a reservation problem"), containing 4–6 utterances — the pie-recipe fix. Never present 3 unrelated new vocab items.
7. **Exploit primacy/recency.** In a 5-minute session, put the single most job-critical utterance first and repeat it last. Bury nothing important in the middle.
8. **Vary feedback meaningfully to beat habituation.** Our feedback surface is almost certainly identical every time → banner blindness within two weeks. Rotate *kinds* of feedback tied to content type (guest reaction / audio playback comparison / a "what the guest heard" paraphrase / a supervisor voice note), not random placement.
9. **Prime with context before content (Bransford).** Every drill opens with one Spanish line establishing the scene *before* the English audio plays: *"Son las 11 de la noche. Llega una familia con reservación a nombre equivocado."* One sentence, enormous comprehension gain.

---

## 3. Attention, cognitive load, and the elephant & rider (Ch. 5, lines 1076–1391)

### Mechanisms

- Haidt's model: the **rider** = conscious, rational, plan-for-the-future. The **elephant** = automatic, emotional, visceral; drawn to novel, pleasurable, comfortable, familiar things. **The elephant is bigger and stronger.** When they conflict, the elephant wins.
- The rider *can* force the elephant to pay attention — but **willpower is a depletable resource**. Shiv (1999): people asked to hold a 7-digit number in memory chose cake over fruit salad roughly twice as often as those holding a 2-digit number. "You can control the elephant, just not for very long."
- **Dragging the elephant uphill is the default design.** Her demonstration: read a paragraph of the Minnesota Driver's Manual on right-of-way, then read the story about her friend Karen who can't tell left from right and glued a lighthouse to the right side of her dashboard ("Right-light"). Identical content. Wildly different effort.
- **Ways to engage the elephant:** stories · surprise · shiny things (visuals, humor, rewards) · social ("all the other elephants are doing it") · leverage its habits.
- **Urgency beats importance.** "You can't capture the elephant's attention by just asserting that a topic is important." Compare *"You may need to know these safety evacuation procedures"* with *"A fire just broke out on the 8th floor! Quick — what do you need to do first?"* Devices: compelling story, show-don't-tell, time/resource constraint, **immediacy**, **interesting dilemmas**, and **consequences, not feedback**.
- **Interesting dilemmas must not be right/wrong.** "You can't wring much tension out of a right/wrong choice." Use: good vs. very good · two bad options · good/better/best · two options each mixing good and bad differently.
- **Surprise & unexpected rewards.** Berns (2001): unexpected rewards produce stronger reward-system activation than expected ones. Grandma's predictable $5 birthday check vs. finding $5 on the sidewalk. Variable reward schedules are why slot machines and video-game drops work — "we immediately start looking for the pattern."
- **Cognitive dissonance = the teachable moment.** The purple dog. Friction forces reconciliation.
- **Curiosity = a felt knowledge gap** (Loewenstein). Make it by asking interesting questions (if Google can answer it, it isn't interesting), being mysterious, **leaving stuff out**, and **being less helpful** (Dan Meyer).
- **Social.** Okita (2008, MIT Media Lab): subjects who *believed* they were interacting with a person — while actually interacting with an identical computer agent — paid more attention, learned more, and scored higher on post-tests. **The belief alone did it.** Treisman: minority students underperformed in math not from preparation or support but because **they studied alone** while Asian students studied together; creating group structures closed and often reversed the gap.
- **Social proof** (Cialdini): activity looks more worthwhile when others do it.
- **Competition is a problem** (lines 1271–1278). Three objections: not everyone is competitive and *the negative for competition-averse learners is larger than the positive for competitive ones*; **competition teaches learners how to win, not how to master** — "a focus on winning means learners are no longer focusing on the material"; and it implies non-competitive material is unworthy. "Should be used sparingly, if at all."
- **Extrinsic rewards demotivate.** Ariely's LEGO experiment: identical pay, but the group whose creations were destroyed in front of them built significantly fewer. Kohn: kids rewarded for drawing draw less. Dirksen's "gift card effect": *"We can't actually compensate you appropriately for this, but if you do it anyway, you can enjoy the equivalent of three pricey Coffee Beverages on us."* Fine as after-the-fact appreciation; counterproductive as motivation.
- **Intrinsic rewards require autonomy: "You don't get to decide what's intrinsic to the learner."** If you can't give learners any autonomy, **stay away from rewards entirely as an attention device.**
- **Visuals:** know *why* you're adding one (decoration is the shallowest and can distract — Thalheimer 2004 on seductive augmentation); progression; conceptual/metaphorical. Visuals distribute cognitive load across verbal and visual channels, build shelves, and supply scenario/emotional context and **contextual triggers** (her vampire-energy example: train the association *sight of plugged-in phone → wasted energy → unplug*).
- **Attracting attention ≠ maintaining attention**, and any attention device *not intrinsic to the material* actively hurts learning.

### Applied — the streak is the most dangerous thing in our product

**Loud conflict with what a naive product team does (and what we currently do):** `src/lib/streak.ts` implements a Duolingo-style streak — the paradigm extrinsic motivator. Under Ariely/Kohn/Dirksen, a streak that is *the* reward (a) shifts the goal from "speak better" to "don't break the number," (b) makes the learner's own progress feel like someone else's property, and (c) **collapses catastrophically on the first missed day** — which for a shift worker doing a double, or with no data credit, is inevitable. Duolingo can absorb streak-break churn because they have 500M consumer users and re-acquisition is free. **We cannot: our unit of value is a specific bellboy at a specific hotel that a GM is paying for.** One broken streak that makes him feel like a failure is a churned seat and a weakened renewal.

**Concrete changes:**
1. **Demote the streak; never let it reset to zero.** Replace "racha rota" with a **capability ledger**: *"Ya resuelves 9 situaciones de recepción en inglés."* That is intrinsic (a real new ability), it only ever goes up, and it is exactly the "before and after" Dirksen prescribes for making learners feel capable. Keep the streak as a small secondary stat, or make it forgiving (weekly target: 5 of 7 days; freezes granted, not bought).
2. **Never ship a leaderboard.** Competition teaches winning, and it will humiliate the A1 learner in front of colleagues — precisely the learner we most need to retain. If we want the social effect, use **social proof and peer modelling** instead (§11).
3. **Never ship gift cards / points-for-cash / prize draws** as the motivator. If the hotel wants recognition, make the reward *intrinsic to the domain*: name on the staff board as "certificado para recepción — nivel B1," first pick of shifts, a real certificate the employee can take to their next job. (That last one is a genuinely powerful intrinsic reward for this population and it costs us nothing.)
4. **Make the reward unexpected sometimes.** Variable, surprising acknowledgements ("hoy resolviste una situación que el 70% falla") beat identical daily confetti, which will habituate inside a week.
5. **Rebuild the drill question as a dilemma, not a right/wrong.** Today: 1 correct option, 2 obviously wrong. Instead, for B1+: *"El huésped está molesto porque su habitación no está lista. (a) Ofrecer guardar el equipaje y una bebida en el bar; (b) Explicar que el check-in es a las 3pm; (c) Llamar al supervisor."* All three are defensible; each has consequences. This creates the tension Dirksen says right/wrong cannot.
6. **Consequences, not feedback.** Replace "¡Correcto!" with *what the guest does*: the guest's face/voice softens, or the guest repeats themselves slower and louder (the real-world punishment for failed English), or the guest asks for someone else. Show the outcome; let the learner draw the conclusion.
7. **Design for zero willpower.** The learner practises after a 9-hour shift with a depleted rider. Therefore: **WhatsApp push is not a channel choice, it is the core insight** — it puts the drill in front of the elephant instead of requiring the rider to decide to open an app. Corollary: the very first interaction must be answerable in one tap, offline, in under 10 seconds. Any friction at the front door (login, loading, permission prompt) spends willpower we do not have.
8. **Believed-social framing (Okita).** Frame drills as coming *from a person* — a named coach, a real voice note, a real photographed guest — rather than from "the system." The MIT result says the *belief* alone raises attention and post-test scores. This is nearly free.
9. **Audit every decorative graphic.** Thalheimer's seductive-augmentation research says decoration that isn't intrinsic actively hurts retention. Our design system is already austere (no emoji in production UI per CLAUDE.md) — good — but note the current drill data uses emoji in options (`🧳 🍽️ 💳`). Those are *decorative*, they violate the design system, and under this research they're load without benefit. Replace with the situational photograph.

---

## 4. Practice design and spacing (Ch. 7, lines 1714–1924)

### Mechanisms

- **Two components of skill: practice and feedback.** Nothing else.
- **"A lot of learning experiences purport to teach a skill, when really all they do is *introduce* the skill."**
- **"Either you give your learners the opportunity to practice, or they'll practice on their own"** — on the job, badly, and you take what you get.
- **Learning new material is metabolically expensive.** Haier (1992) PET imaging: a brain learning Tetris burns dramatically more glucose than the same brain after weeks of practice, even on a harder level. New info = biking uphill; automated behavior = coasting.
- **Most curricula are straight uphill** — all new, all the time. "In the straight-uphill model, everything is new and everything is important, so therefore nothing is." Alternate uphill (new) and downhill (consolidation) so the **new material stands out** and the learner has energy for it. **"If you don't give your learners a chance to rest, they'll take it anyway."**
- **Flow** (Csikszentmihalyi): keep challenge just above ability. Too hard → frustration; too easy → boredom.
- **Spacing.** Distributed beats massed. "The first time you learn something, you obviously want to spend enough time to ensure you have a good grasp… but extra practice at that time will provide a diminishing return." Longer inter-practice intervals → longer retention. **Sleep between reinforcements consolidates learning**, so spread across days at minimum.
- **THE RULE OF THUMB (line 1800):** *"A good general rule of thumb is to time the practices to how often you'll need to use the behavior."* Her worked example: the recycling coordinator should send the practice game **once a month**, not daily for two weeks, because the problem items are collected monthly — *and* time it a day or two before that learner's collection date so it doubles as a job aid.
- **Cycles of expertise** (James Paul Gee): practise a skill to near-automaticity → have it *fail* in a way that forces re-thinking → learn anew → practise to mastery → be challenged again. This is what good game pacing is.
- **Nested goal structure** (Deterding): immediate → short-term → medium-term → long-term. *Diner Dash*: seat/order/deliver/clear → complete a shift → upgrade the restaurant → win. **Failing a lower goal blocks the higher one**; you practise until proficient.
- **Restructure curricula by accomplishment, not by topic.** Her restaurant-manager example: the old course was 11 topic modules (Hiring, Safety, Financials…), each visited once. The redesign is *survive a shift → run a week → run a quarter* — so Safety recurs three times in three different framings across the course.
- **Feedback frequency.** Video games give feedback every few seconds; the worst learning designs give it twice a semester. Increase frequency — *and* vary the form (sounds, points, character reactions, visual cues), because "Good Job. You successfully killed a zombie!" every time is Worst Game Ever.
- **Follow-up coaching** on a schedule: when will you follow up, what's evaluated, what criteria. Annual review = weather forecasting a year out.
- **Explicit criteria / checklists make self-assessment feasible**, which keeps the learner aware of the standard.
- **On assessment (lines 1839–1852) — quoted almost in full because it's the sharpest passage in the book:** multiple-choice tests are popular because they're efficient, objective, and consistent — "OK, so what ISN'T on that list? Oh yeah — there's pretty much nothing on there about the learning advantages for the person taking the test." *"Mainly what you learn from multiple-choice tests is how good the learner is at taking… multiple-choice tests."* If your goal is coaching and assessing competency: **(1) have the learner perform the task, (2) give them useful feedback. That's it.**
- **Practising incorrectly is worse than not practising** — the error gets ingrained and must later be unlearned. This raises the stakes on feedback quality.

### Applied — this chapter gives us a genuinely differentiated scheduler

**The single most valuable, most stealable idea in this book for us:**

> **Frequency-of-use-weighted spacing.** Not a generic SM-2/Anki forgetting curve. Not Duolingo's "everything daily." Schedule each situation at the frequency the learner actually encounters it on shift.

Worked out for our roles:
- Front desk: *greeting + "How may I help you?"* → **every shift**, dozens of times → high frequency, but it automates fast, so it should drop out of active practice quickly and only appear as an occasional maintenance check.
- Front desk: *"Your card was declined"* → maybe weekly → practise weekly.
- Bellboy: *lost/damaged luggage complaint* → maybe monthly → **practise monthly, not daily** — and, per the recycling example, this is where practice does the most work, because it's the low-frequency high-stakes item the learner will otherwise have zero reps on.
- Restaurant: *allergy / dietary restriction* → low frequency, catastrophic failure cost → deliberately over-scheduled relative to its natural frequency.

This produces a **use-frequency × consequence-severity matrix** that drives the scheduler. It is defensible IP, it's explainable to an HR buyer in one sentence ("we drill the situations your staff face, as often as they face them, and extra-hard on the ones that cost you a bad review"), and Duolingo structurally cannot do it because they don't know their user's job.

**Implementation:** add to the drill schema `use_frequency: 'per_shift' | 'weekly' | 'monthly' | 'rare'` and `failure_cost: 'low' | 'medium' | 'high'`. Schedule interval = f(use_frequency) adjusted upward by failure_cost. Per-property override (a beach resort in Cancún has different frequencies than a business hotel in CDMX — and that override is itself a sellable customization).

**Other concrete changes:**

1. **Stop the straight-uphill drill.** Today every drill introduces a new listening item + new model phrase + 3 new vocab words = 100% new. Restructure the 5-minute session as **~70% consolidation / ~30% new**: one new situation, three items the learner already half-owns. Dirksen's point is not just kindness — *the new item only stands out if the rest is familiar.*
2. **Build the nested goal ladder** to replace the streak as the progress spine:
   - *Inmediato:* resolve one guest turn.
   - *Corto plazo:* complete one situation end-to-end (4–6 turns) — "check-in con problema de reservación."
   - *Mediano plazo:* **survive a full simulated shift** — 8–10 mixed situations, unpredictable order, timed. This is the Diner Dash level and it's the emotional and marketing centerpiece.
   - *Largo plazo:* certified for the role at a CEFR level, verified by performance.
   - **Gate progression:** you cannot enter the simulated shift until you can produce the component situations. Failing sends you back to practice, not to a "score."
3. **Ship "Turno" (the simulated shift) as the flagship mode.** This is the single feature that would most differentiate us in a demo, and it maps 1:1 to Gee's cycles of expertise and to the buyer's mental model ("can he handle a shift?").
4. **Fix the placement exam's evidence base.** Our diagnostic is 13 multiple-choice questions. Under Dirksen that measures test-taking. Since the exam is **the $50 wedge and the artifact the buyer judges us by**, this is a commercial issue, not just a pedagogical one. The CEFR level and the HR report should be **weighted overwhelmingly toward the recorded speaking tasks** (we already have MediaRecorder + Whisper + Claude scoring — the machinery exists). Recommend: MC section reduced to a fast router (which level of speaking prompts to serve), with the *reported* level derived from performance. Say so explicitly in the HR report: *"Nivel determinado por desempeño grabado en 6 situaciones reales, no por examen de opción múltiple."* That line sells against every competitor.
5. **Explicit criteria + self-assessment.** Give the learner the same rubric the scorer uses, in Spanish, in plain language ("¿Se entiende? ¿Es cortés? ¿Resolviste el problema?"), and let them rate themselves before seeing the score. Keeps the standard visible and builds metacognition (§6).
6. **Feedback every few seconds, varied.** In a 5-minute session we should have 8–15 feedback moments in at least 4 different forms.
7. **Guard against ingraining errors.** Since bad practice is worse than none, never let a mispronounced/wrong production pass silently. If scoring is unavailable offline, do not mark it correct — queue it and defer.
8. **Schedule the human follow-up.** Build into the product a **supervisor check-in cadence** (weekly, 5 minutes, with a checklist of 3 competencies to observe on the floor). Dirksen: "ultimately, the best feedback would be ongoing coaching based on real performance." This also gives the HR buyer a ritual that makes the subscription sticky.

---

## 5. Design for environment — the underexploited moat (Ch. 9, lines 2092–2226)

### Mechanisms

- Her opening case: a call center where reps took ~6 months to become competent and ~6 months to transfer out. "The real gaps weren't knowledge, or skills, or motivation. The real gaps were in the environment."
- **Knowledge in the head vs. knowledge in the world** (Norman). The four-burner stove with ambiguous dials vs. the offset layout that requires remembering nothing. **"Changing the design of the environment can make knowledge or skills gaps disappear."**
- **Proximity matters.** The further the knowledge is from the task, the less likely it's used. If you must find a manual, open the TOC, scan, turn, consult the index — you'll just ask the person next to you instead.
- **Job aids** = "training wheels" (produce expert-like results without internalizing expert knowledge) and "guard rails" (protect against unsafe performance) — Dave Ferguson. Her example: the yellow tag on her jumper cables.
- **Supply caching:** don't hand out mittens in summertime; deliver detail at the point of need. Example: the *"Paste in Place — Ctrl+Shift+V"* hint inside the menu, teaching the shortcut at the exact moment of the slow behavior. And the tax software showing only the 5–6 questions relevant to the current page, plus "This is unusual" next to obscure ones.
- **Implementation intentions** (Gollwitzer): goals ("I intend to X") are weak; **if-then plans** are strong. *"If situation Y occurs, then I will initiate goal-directed behavior Z."* And **specificity is crucial**: not "if I crave a cigarette I'll distract myself" but "if stress makes me want a cigarette, I will call my sister." She explicitly proposes this as a fix for single-event soft-skills training that never changes behavior — have learners write their *own* anticipated critical situations and responses — and then **put the triggers physically into their environment.**
- **Putting behaviors in the world:** the soda machine with small/medium/large buttons lets a brand-new employee perform at veteran level. The pretzel-shop countertop with pretzel outlines molded into it — a prompt that *also* teaches the task. Her own call-center fix: replaced a 9–10 step loan calculation with a 3-question screen; accuracy jumped.
- **The inversion (line 2188):** in learning and assessment, recall beats recognition. **In environment design, the opposite is true — you deliberately convert recall tasks into recognition tasks, for the same reason: recognition is easier.**
- **Electronic isn't always better.** The Freedom Trail in Boston is a red line painted on the ground. No app, no OS compatibility, no cell reception needed.
- **Clearing the path.** Obesity rose because environments changed, not because people did. Ask: can we make the process simpler? Can we make the system better? What barriers exist? "If you hear the words 'that's the process' or 'that's how we've always done it,' that should be a big screaming alarm."
- **THE BIG QUESTION (line 2210):** *"What's everything else we could do (besides training) that will allow learners to succeed?"* Plus: what could we do beforehand to make people readier, and afterwards to reinforce?

### Applied — the highest ROI thing we are not doing

**This chapter says our product should ship physical and ambient artifacts, not just an app.** A naive edtech team refuses to do this because it doesn't drive DAU. It is exactly why we would win a B2B renewal.

1. **Ship a printed job-aid kit with every pilot.** Cost: pennies. Effect: converts recall to recognition *at the moment of use*.
   - A **card at the front desk** (or under the counter glass) with the 8 highest-frequency guest turns and the model English response.
   - A **strip on the bell cart / luggage trolley**.
   - A **server's apron card** for the restaurant module.
   - Designed in our design system, co-branded with the hotel. This is also a physical reminder of *us* sitting in the workplace every day — a retention and upsell asset the software alone can't buy.
   - Per Dirksen: **let learners practise *with* the job aid** as part of the drill, so using it on the floor isn't a new skill.
2. **Lock-screen / wallpaper job aid.** Generate a per-role phone wallpaper with the learner's 6 current phrases. Free, zero-data, works offline, and lives at maximum proximity to the learner's most-checked surface.
3. **Implementation intentions as a first-class product feature.** After each situation is learned, ask the learner to author one line in Spanish: *"Cuando un huésped llegue con maletas, voy a decir: 'Good evening, may I help you with your luggage?'"* Store it. Print it on their card. Send it back to them on WhatsApp the next morning. This is Gollwitzer applied verbatim, it takes an afternoon to build, and it directly attacks the know–do gap. **I'd rank this the single highest value-per-engineering-hour feature in this whole document.**
4. **Design the trigger, not just the phrase.** For every situation, store `trigger_es` — the observable cue on the floor ("cuando el huésped saca su pasaporte", "cuando suena el teléfono de la habitación"). Teach cue→response pairs, not vocabulary. This is conditioned/procedural memory, and it's what "5 minutes a day" can realistically install.
5. **Ask the Big Question with every buyer, on the record.** In pilot kickoff: *"Besides training, what else could we change so your staff succeed in English?"* Likely answers we can then productize: put the English phrase on the PMS screen; add a "guest speaks English" flag to the reservation so the shift lead can staff accordingly; give the bellboy 60 seconds of pre-shift review as part of the huddle; put a QR on the timeclock. **Some of these are worth more than our app**, and shipping them makes us the partner rather than the vendor.
6. **Fight our own environment gaps.** Prepaid data, spotty wifi, low storage. Our offline queue work (`src/lib/offline`) is not a nice-to-have; under this chapter it *is* instructional design. Audio must be pre-cached and tiny. The Freedom Trail lesson: prefer the dumb robust solution (a WhatsApp text message with a 15-second voice note) over the clever fragile one (a PWA requiring a fresh install and 40MB of audio).
7. **Pre- and post-work.** Beforehand: a 2-minute manager huddle script. Afterwards: the weekly supervisor observation checklist (§4.8) and a monthly re-send of the job aid.

---

## 6. Design for knowledge: friction, the right amount of content, misconceptions (Ch. 6, lines 1395–1709)

### Mechanisms

- **Friction is necessary.** "Telling is smooth, but showing has friction: it requires learners to make some of their own connections." Kuperberg (2006): sentence pairs that were *intermediately* causally related (you have to read between the lines) took the longest, activated the most brain areas, and were remembered best. Obvious connections and unrelated ones both lost.
- **Muller (2008), the most counterintuitive study in the book:** students shown clear, well-explained physics videos rated them highly (clear! easy!). Students shown videos where characters first discuss *common misconceptions* rated them as **more confusing** — and **scored substantially higher on the post-test with more improvement**. Feeling confused ≠ learning worse. **Learner satisfaction ratings are actively misleading.**
- **"Whenever you want to tell your learners something, first ask yourself if there's any way they can tell you instead."**
- **Metacognition:** problem-based learning's whiteboard (what we know / what we think / where we don't know enough). Or give learners a content inventory and have them self-rate comfort, adjusting as they go.
- **The right content is less than you think it is** — enough detail but no more, relevant, and able to fit their closet. "Be ruthless." **Start lean and test**: gaps "bubble up like leaks in a submerged air mattress," whereas excess is invisible.
- **The "average attention span" is a myth.** Eleven hours of extended-edition Lord of the Rings, well attended. "What may be much more limited is the length of time someone can *force themselves* to pay attention."
- **Counter-examples** (Goofus and Gallant). "You could use five good examples… and not clarify the concept as much as you would by matching one good example with a single counter-example." Even better: **lead with bad examples** and have learners generate the guidelines themselves.
- **How much guidance?** Step-by-step = fast but brittle (the hair salon became a tattoo parlor and now your learner is lost). Full conceptual = robust but overkill. **Wayfinding is the middle ground**: apply in multiple circumstances, troubleshoot, feel confident.
- Her GPS example: *"The GPS is the low-friction choice. If you just want people to get there, exact instructions are great, but if you want people to learn how to get there, you want the process to be more effortful."* Also: you remember a route better if you **drove** than if you were a **passenger**.
- **Examples → concepts beats concepts → examples.** Her sequence: (1) work through examples, (2) have learners identify the concepts they saw, (3) clarify and correct misconceptions using those examples as context, (4) apply to further examples.
- **Tell them less, not more** — leave holes so learners practise filling them ("season to taste").
- **CCAF** (Michael Allen): **Context** (general, emotional, triggers, physical) → **Challenge** (a real-world accomplishment) → **Activity** (a physical response) → **Feedback** (a reflection of effectiveness).
- Her worked CCAF example is a call-center *irate customer* course, and it is almost exactly our problem shape. Notable moves: because reps only get 1–3 irate calls per shift, **spread the training to match** (3 scenarios/day × 3 days, not 9 in one sitting); mimic the time pressure and heat; use the *actual* screens and headsets as artifacts; **first scenario is an untimed walkthrough** (like a video game's tutorial level); include distractor scenarios where the process *doesn't* apply; follow up with one scenario per week for weeks afterward.
- Blunt caveat (line 1666): **"unfacilitated e-learning is not a good medium for providing successful recall activities"** — computers grade selections well and productions poorly. (Note: this was written in 2012, pre-LLM. **This is the one place where our technology invalidates her constraint — and it's precisely where our moat is.** Whisper + Claude can now evaluate a spoken production. Dirksen's own logic says that if you *can* grade production, you should be practising production. We can. So we must.)
- **Rapid, ugly prototypes.** She prototypes in PowerPoint before storyboarding.
- Bain / Saari: *"I want the students to feel like they have invented calculus and that only some accident of birth kept them from beating Newton to the punch."*

### Applied

1. **Counter-examples are a killer feature for Spanish L1 speakers and nobody ships them.** Duolingo, by policy, never shows you incorrect English. But our learners *produce* predictable L1-interference errors, and the fastest fix is confronting the misconception directly (Muller). Build a **"Así no / Así sí"** card type:
   - *"What you want?"* → **"How may I help you?"**
   - *"I no understand."* → **"I'm sorry, could you repeat that?"**
   - *"Wait a moment please, I go ask."* → **"One moment please, let me check for you."**
   - *"Is possible…"* / *"I have 30 years"* / *"Do you want a table for eat?"*
   Sourced from real transcripts we already collect via the speaking exam. This is a **content moat**: an error corpus of Mexican-hospitality English that compounds with every exam sold.
2. **Accept — and design for — the "feels harder, works better" tradeoff.** Muller means our in-app satisfaction ratings will *understate* our best content. **Do not optimize the drill for feeling easy.** Instrument outcomes (production accuracy at 30 days), not smiley faces. And warn the buyer: week 2 feels harder than week 1.
3. **Apply CCAF verbatim as our content authoring template.** Our Master OS editor should force authors to fill: general context / emotional context / **trigger** / physical context → challenge → activity → feedback. Right now the drill schema captures none of the context fields. Adding four text fields to the schema changes the quality of every future drill.
4. **First drill of every new situation is an untimed walkthrough.** Video-game tutorial level. Removes the fear tax for the embarrassed learner.
5. **Include "this doesn't apply" distractors.** Some situations should *not* use the taught script. Otherwise we teach pattern-matching to the lesson, not to the guest.
6. **Examples before concepts.** Don't open with a grammar or vocabulary rule. Open with two real guest interactions; have the learner spot what the good one did.
7. **Be less helpful, deliberately, at higher levels.** At A1, scaffold hard. At B1+, give the situation and *withhold* the model until after they've attempted a production. Right now `reinforce` always shows the model — that's the GPS, and it makes passengers.
8. **Ruthlessly cut content.** 5 minutes/day means roughly **one situation and one production**. Our current drill (listening + model + 3 vocab) is already over budget. Start leaner than feels safe and let the gaps bubble up.
9. **Ugly prototypes with real staff before building.** Paper + WhatsApp voice notes with five bellboys in one hotel would tell us more in a week than another sprint.

---

## 7. Motivation to *do* (Ch. 8, lines 1928–2088)

### Mechanisms

- Two motivations: **to learn** and **to do**. The second is where training dies.
- **"I know, but…"** = the diagnostic phrase. It usually appears when **the action is now and the consequence is later** — and the elephant is a creature of immediacy.
- **We learn from experience, and sometimes we learn the wrong thing.** Her texting-while-driving example: the driver who texts 50 times without incident has *learned from experience* that texting while driving is fine.
- **TAM** (Davis 1989): adoption = **perceived usefulness** × **perceived ease of use**. "If your audience believes that it's pointless or it's going to be a major pain, they will probably figure out ways around it."
- **Diffusion of Innovations** (Rogers): **Relative Advantage · Compatibility · Complexity · Observability · Trialability.** Her nursing-home worked example is worth copying: to show relative advantage don't cite statistics (statistics talk to the rider) — tell the story of Millie, a lively resident who fell; translate 17% fewer falls into "X more residents who can visit family for the holidays"; and have learners re-run old cases with the new method and **report back on the advantage themselves** (Show, not Tell).
- **Self-efficacy** (Bandura): belief in your own ability to succeed. Project ALERT builds *resistance* self-efficacy by rehearsing lines until students have them ready, plus peer-group confidence.
- **Dweck (Mueller & Dweck 1998):** praising *intelligence* → fixed mindset → students chose the easy task and **did worse** on subsequent problems. Praising *effort* → growth mindset → chose the challenging task and **did better.** Praise what's in the learner's control.
- **Walk learners a few steps down the path:** have them apply the material to *their own* real problems before they leave. Four benefits — they picture using it; they get practice with support still available; **sunk cost / loss aversion** makes them reluctant to abandon the investment; and they're ready to go, having already scaled part of the starting barrier.
- **Social proof and opinion leaders.** "Who is, or should be, the actual authority figure when it comes to doing your actual job? Is it the CEO, or is it the person in the next cubicle who has five times as much experience as you?" Project ALERT uses high-schoolers, not adults, to talk to middle-schoolers. Tactics: have people describe their own successes; **engage opinion leaders first** and let them pilot; make progress visible (but never shame low performers).
- **Visceral beats abstract.** The cake is more tempting when it's physically in front of you. The Gwent Police texting-crash video still fires in her memory years later.
- **Change is a process, not an event.** Reinforce or it trickles away.

### Applied

1. **Our learner's core sentence is "Ya sé, pero me da pena."** That's a motivation gap, and the fix is **rehearsed self-efficacy**, exactly as Project ALERT does it: the learner should have specific sentences *ready and already spoken aloud*, for specific anticipated situations. Combine with implementation intentions (§5.3). This is the through-line of the whole product.
2. **Praise effort and specificity, never ability.** Copy audit needed across the app: banish *"¡Eres muy bueno!" / "¡Qué inteligente!"* Ship *"Practicaste 5 días seguidos"*, *"Repetiste esta frase hasta que salió clara"*, *"Ya resuelves esta situación sin ayuda."* Dweck says the difference is measurable in subsequent performance — this is a copy change with a behavioral payoff.
3. **Run TAM on the app itself, from the learner's POV.** *Useful?* — only if the phrases are the ones his guests actually say (so per-property customization is not a luxury feature, it's the usefulness lever). *Easy?* — must survive: no wifi, 2GB free storage, prepaid data, one hand, in a uniform, standing. Every friction point is an adoption tax.
4. **Run Rogers on the buyer:** *Relative advantage* — vs. their current option, which is usually "nothing" or "a $3,000 in-person course that 6 people attended once." *Compatibility* — must fit shift schedules and existing huddles. *Complexity* — near-zero implementation work is the buyer's stated requirement. *Observability* — the HR dashboard is literally an observability product; make it visible *to peers too*, not just to HR. *Trialability* — **the $50 placement exam is our trialability mechanism.** Name it that internally and optimize it as such.
5. **Use hotel opinion leaders, not the GM.** The person whose adoption matters is the senior bellboy / the front-desk shift lead. **Onboard them first, individually, and let them be visible.** A launch email from the GM is the CEO-video anti-pattern Dirksen calls out. Product feature: let the first 2–3 staff who complete a situation record a 10-second Spanish voice note that plays for their colleagues.
6. **Make usefulness visceral, not statistical.** Don't sell the GM "23% improvement." Play them the *before* and *after* recording of one of their own employees handling an angry guest. That's the Millie story, and we can generate it automatically from exam + practice audio. **This should be the centerpiece of the renewal conversation.**
7. **Have learners apply it to their own problems.** In onboarding, ask: *"¿Cuál fue la última vez que un huésped te habló en inglés y no supiste qué decir?"* Use their answer to seed their first week's content. Sunk cost + relevance + it's free contextual research for us.
8. **Plan for backsliding.** Week 3–4 attrition isn't failure; it's the documented shape of change. Build a re-entry path that doesn't punish (see the streak critique, §3.1).

---

## 8. Goals, objectives, and honest scope (Ch. 3, lines 534–730)

### Mechanisms

- **Define the problem before the goal.** "A lot of learning projects start with the goal, rather than the problem, but that puts you in the position of solving problems you don't actually have."
- Two tests for a learning objective: **"Is this something the learner would actually do in the real world?"** and **"Can I tell when they've done it?"** If either is no, rewrite. Ban "understand." Even "define/describe/explain" is a hedge — "you don't actually care if they can define it, you want to know if they can do it."
- **Break big goals down.** "Students need to learn to be better managers" is "Meet me in Africa" — a destination that doesn't let you book a flight.
- **Bloom** (Remember → Understand → Apply → Analyze → Evaluate → Create) and **Gery's proficiency scale** (Familiarization → Comprehension → Conscious Effort → Conscious Action → Proficiency → **Unconscious Competence**). Plot as an XY axis. **"You absolutely cannot get past Conscious Action without a significant amount of practice distributed over time."** A single exposure gets you Familiarization, no further.
- **Don't announce learning objectives as a bullet slide.** "Just say no." Use a challenge, a scenario, or a mission.
- **Pace layering** (Stewart Brand): contents change daily, décor in months, layout in years, structure in decades, foundation ~never. *"The fast parts learn, propose, and absorb shocks; the slow parts remember, integrate, and constrain. The fast parts get all the attention. The slow parts have all the power."*
- **Fast vs. slow skills.** Her GMAT story: they could move Quantitative scores in a weekend (shortcuts, rusty formulas, an unfamiliar question format) but essentially never Verbal — vocabulary, reading comprehension, complex reasoning take *decades*. "There are very few quickie shortcuts you can teach someone if the foundations of their language skills aren't there."
- For slow skills: find "throw pillows" (cheap immediate wins — a job aid, a checklist, a model) but **don't try to solve big problems with a throw pillow.** Provide sturdier pieces knowing they take time. **"Recognize that you aren't going to change their structure"** — and that accepting this "involves letting go of the deeply held belief that we can do major renovations in a short period of time. We can't — and it's a waste of resources to pretend we can." **Respect the foundation** (culture, personality).

### Applied — this chapter tells us what to promise and what to refuse

1. **Language fluency is Dirksen's canonical SLOW skill** — she names GMAT Verbal explicitly. So **stop promising fluency, ever.** What we can actually deliver fast: **scripted, situation-bound job performance.** That is the "throw pillow + sturdier pieces" layer, and it's genuinely valuable because *the job only requires that layer*. Positioning: *"En 90 días tu personal resuelve en inglés las situaciones de su puesto. No prometemos que hablen inglés como nativo — prometemos que hagan su trabajo en inglés."* This is more honest, more differentiated, and more defensible at renewal than any competitor's claim.
2. **Rewrite every objective as an observable job act.** Not "el empleado entenderá vocabulario de recepción." Instead: *"El recepcionista recibe a un huésped con reservación, confirma el nombre, pide identificación y entrega la llave, en inglés, sin ayuda, en menos de 90 segundos."* Both tests pass. Every one of these becomes a drill, a rubric line, an HR dashboard row, and a certificate line. **The objective list *is* the product spec, the assessment, and the sales sheet.**
3. **Target Gery level explicitly per situation.** For the top 8 per-shift situations aim at **Unconscious Competence** (over-practice deliberately). For rare-but-costly situations aim at **Conscious Action + a job aid** — that's the honest ceiling and the job aid closes the rest.
4. **Never ship a learning-objectives screen.** Use a mission: *"Hoy: un huésped llega a las 11pm y su reservación no aparece."*
5. **Respect the foundation.** Don't fight the culture (formality, indirectness, deference to guests). Teach English that *fits* Mexican hospitality warmth rather than importing a US-service register. This is also a real differentiator against generic ESL.
6. **Refuse the wrong sale.** If a GM asks for "general English for all 300 staff," that's a Grand-Canyon-with-a-rope-bridge request. Say so, and scope to two roles and twelve situations.

---

## 9. Who the learner is — the expert's curse and audience research (Ch. 2)

- **"Your learners are not you."** Dirksen wants it on a bumper sticker. She confesses assuming everyone enjoys learning new things, then realizing many people find it scary, or a nuisance to be circumvented. **Directly relevant: everyone building this product likes learning languages. Our user does not.**
- **The barrier is often how much *you* know**, not how little they know — expertise makes it hard to remember not knowing.
- **Learners want to not feel stupid.** That's the actual value proposition of "…for Dummies" books: they promise *not to make you feel stupid*. "Your job is to make your learners feel smart and, even more important, they should feel **capable**."
- **Dan Meyer's low-investment entry:** "I'll ask a struggling learner for a **wrong** answer. Give me a number that's too high. Give me a number that's too low. I'm involving students at a very low investment that has a huge return."
- Three moves for wary learners: **leverage what they already know · give them early success · create safe places to fail.**
- **Learning styles are not supported by evidence** (Pashler 2010, Coffield 2004). Salvageable ideas: vary approaches (also fights habituation); **everyone is a visual learner**; match the method to the *content*, not to the person.
- **Novices need structure and guidance; experts need autonomy and pull.** Don't lock menus, don't force sequential progress, don't block "next" until audio finishes.
- **Scaffolding:** reduce environment complexity (fade out all but a few cockpit controls, add them back); walkthroughs with simplified cases (she once taught a sales process by first having reps sell *snowsuits in Hawaii* — silly and low-stakes, so they learned the interface and process before the technical content); embed supports at hand.
- **Research methods:** talk to learners (they tell you how it *actually* works, not how the manual says; recent learners are your best friend because they remember what was confusing) · **follow them around** ("if you can do only one type of audience analysis, do this") · **try stuff out** — prototype, pilot, watch. "All the learning theory in the world won't help you as much as testing your learning designs and fixing the problems."

### Applied

1. **Design the first 60 seconds to make an embarrassed A1 adult feel capable.** Copy the Meyer move: open the placement exam by asking for something *impossible to get wrong* — "escoge la que te suena menos correcta" — before anything that can be failed.
2. **Make the placement exam feel like a fitting, not a test.** Never show a raw score to the learner. Show capability: *"Ya entiendes X. Vamos a construir sobre eso."* Naming it *colocación* (we already do) is right; audit the exam copy for anything that reads as judgment.
3. **Private by default for the learner.** Recordings and scores are visible to HR, but never surface a learner's ranking to peers. Safe place to fail is a precondition for any speaking practice with this population.
4. **Ship the "snowsuits in Hawaii" first drill:** a deliberately low-stakes, slightly funny first situation to learn the *interface* before any real content load.
5. **Do the contextual inquiry. This is the loudest recommendation in this document.** Per memory, the strategic gap is over-built/under-validated: 0 paying customers, 7 uncontacted leads. Dirksen's prescription is unambiguous — *follow your learners around*. **Spend two days in one Cancún hotel, on the floor, with a notebook**: log every English interaction a bellboy and a front-desk agent actually have, verbatim, with timestamps. That log becomes (a) the real situation list and use-frequencies for §4's scheduler, (b) the L1-error corpus for §6's counter-examples, (c) the environment-gap list for §5, and (d) the sales narrative. It is worth more than the next three engineering sprints.
6. **Vary approach; drop any learning-styles framing** if it exists in marketing copy — it's unsupported and a sophisticated buyer may know it.

---

## 10. Ranked conflicts with what a naive product team would do

These are the findings most worth arguing about internally.

| # | Naive move | What Dirksen says | Our verdict |
|---|---|---|---|
| 1 | Ship a streak + leaderboard + points (copy Duolingo) | Extrinsic rewards demotivate (Ariely, Kohn); competition teaches winning and hurts the non-competitive more than it helps the competitive | **Demote the streak, never ship a leaderboard.** Replace with a capability ledger. Highest-risk item in our current build. |
| 2 | Multiple-choice everything because it's gradeable | "Mainly what you learn from multiple-choice tests is how good the learner is at taking multiple-choice tests." Have them perform the task. | **Rebuild the drill to end in production; re-weight the exam onto recorded speaking.** |
| 3 | Flashcards for vocabulary | Memorization puts items on one shelf, with sequential-only access and no transfer | **Delete standalone flashcards.** Embed words in situations. |
| 4 | Generic SRS / forgetting-curve scheduling | "Time the practices to how often you'll need to use the behavior" | **Frequency-of-use × failure-cost scheduler.** Our best defensible IP. |
| 5 | Daily practice for everything | Low-frequency situations should be practised at *low* frequency — and that's where practice pays most | Daily *session*, but item scheduling by use-frequency. |
| 6 | Optimize for "learners say it's clear and easy" | Muller: the group that felt *more confused* learned significantly more | **Don't optimize the drill for satisfaction.** Instrument 30-day production accuracy. |
| 7 | Always show the correct model immediately | That's the GPS — creates passengers, not drivers. Be less helpful. | Withhold the model until after an attempt, at A2+. |
| 8 | Never show wrong English (Duolingo policy) | Counter-examples clarify better than five good examples; confronting misconceptions is what produced the Muller effect | **"Así no / Así sí" is a differentiating feature**, especially for L1 interference. |
| 9 | Promise fluency | Fluency is a *slow* skill; you cannot renovate the structure in a quarter | Promise *situational job performance*. Honest and more sellable. |
| 10 | "It's an app, so everything goes in the app" | Proximity matters; put knowledge in the world; the Freedom Trail is a painted line | **Ship printed job aids, apron cards, lock-screen wallpapers.** Costs pennies, wins renewals. |
| 11 | Launch with a GM/CEO endorsement email | The authority that matters is the person in the next cubicle | **Onboard the senior bellboy first.** |
| 12 | Praise the learner ("¡Qué inteligente!") | Dweck: intelligence praise → fixed mindset → *worse* subsequent performance | Praise effort and specific accomplishment only. |
| 13 | Add more content because the buyer wants comprehensiveness | "The right content is less than you think it is." Start lean; excess is invisible, gaps bubble up | One situation, one production, per session. |
| 14 | Build more before selling | "Follow your learners around" — if you do only one kind of research, do this | Two days on a hotel floor beats three sprints. |

---

## 11. Direct build backlog (extracted, deduplicated, ordered by value-per-effort)

**Do first (days, not weeks):**
1. Add a **production step** to every daily drill — record, play back next to the model. (Converts recognize→do.)
2. **Implementation-intention capture** after each situation: learner authors one if-then line in Spanish; echoed back on WhatsApp; printed on their card.
3. **Copy audit for Dweck**: remove all ability praise; ship effort/accomplishment praise.
4. **Context priming line** (one Spanish sentence setting the scene) before every drill's English audio.
5. **Streak demotion** + capability-ledger progress ("Ya resuelves N situaciones").
6. Add `use_frequency` + `failure_cost` + `trigger_es` + the four CCAF context fields to the drill schema and the Master OS editor.

**Do next (weeks):**
7. **Frequency-of-use scheduler** built on the new schema fields, per-property overridable.
8. **"Así no / Así sí"** counter-example card type, seeded from real speaking-exam transcripts.
9. **Printed job-aid kit** + phone lock-screen generator, per role, co-branded.
10. Situational photography + ambient audio on every drill (reuse the existing location image library).
11. **Untimed walkthrough** as the first drill of every situation; deliberately low-stakes "snowsuits in Hawaii" onboarding drill.
12. Guest-heat temperament variants + response timer at B1+; **consequence-based feedback** (guest reaction) replacing "¡Correcto!".
13. Re-weight the placement exam's reported CEFR level onto recorded speaking performance; state this on the HR report.

**Do when the above is proven (months):**
14. **"Turno" — the simulated shift.** Nested-goal capstone, 8–10 mixed situations, timed, gated on component mastery. Demo centerpiece.
15. Supervisor weekly observation checklist + coaching cadence as a product surface.
16. Before/after audio pairs auto-generated for renewal conversations.
17. Peer voice-note social proof from in-hotel opinion leaders.

**Do immediately and it isn't engineering:**
18. **Two days of contextual inquiry in one operating hotel.** Everything above gets better with the resulting log.

---

## 12. Verbatim anchors worth keeping

- Gap test: *"Is it reasonable to think that someone can be proficient without practice?"* (Ch. 1)
- Environment test: *"Is there anything — anything at all — that we could do, besides training, that would make it more likely that people would do the right thing?"* (Ch. 1)
- Objectives test: *"Is this something the learner would actually do in the real world?"* / *"Can I tell when they've done it?"* (Ch. 3)
- Spacing rule: *"Time the practices to how often you'll need to use the behavior."* (Ch. 7, line 1800)
- Assessment: *"Have the learner perform the task. Give them useful feedback. That's it."* (Ch. 7, line 1849–1852)
- Content: *"The right content is less than you think it is."* (Ch. 6)
- Practice: *"Either you give your learners the opportunity to practice, or they'll practice on their own."* (Ch. 7)
- Motivation diagnostic: *"I know, but…"* (Ch. 8)
- The Big Question: *"What's everything else we could do (besides training) that will allow learners to succeed?"* (Ch. 9, line 2210)
- Change: *"Change is a process, not an event."* (Ch. 8, line 2063)
- Aspiration: learners should finish feeling *"like they have invented calculus"* (Bain/Saari, Ch. 6)

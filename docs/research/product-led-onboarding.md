# Product-Led Onboarding (Ramli John) + B2B2C Activation
### Applied to Inglés Hotelero — decision-ready field notes
Research date: 2026-07-26. Every claim below is tagged with a source and a confidence level.

**Source confidence legend**
- `[PRIMARY-ACADEMIC]` peer-reviewed, abstract or full text verified
- `[PRIMARY-PRACTITIONER]` the author's own publication (ProductLed, Amplitude, Lenny's/Duolingo CPO)
- `[VENDOR]` marketing content from a company selling the thing being measured — directionally useful, numerically suspect
- `[UNVERIFIED]` widely repeated, original source not located

---

## 0. The one-paragraph thesis

Ramli John's framework is built for a user who *chose* to sign up. Our learner did not.
That single difference inverts three of his defaults. In voluntary PLG, **performance
expectancy** ("will this help me?") drives adoption and social pressure barely matters. In
**mandated** settings, that reverses — social influence becomes the dominant lever
(Venkatesh et al. 2003, UTAUT). So the highest-leverage activation surface for Inglés
Hotelero is **not the app's first screen — it is the supervisor's mouth and the peer group
on shift.** Everything else in this doc is downstream of that.

Second inversion: our activation clock is not "did they finish onboarding," it's **"did they
come back on day 2."** Third: we have *two* activation events that must both fire — the
buyer's (HR pushed links to ≥N employees) and the learner's (completed drill #1 and
returned). A property where HR bought but never distributed links is a churned account that
looks healthy in Stripe.

---

## 1. Ramli John's framework — what it actually says

### 1.1 Definition of onboarding
> "User onboarding is the process that takes people from perceiving, experiencing, and
> adopting the product's value to improve their lives."
— `[PRIMARY-PRACTITIONER]` https://productled.com/book/onboarding

Critically, John rejects three myths explicitly: onboarding is **not** a single "aha"
moment; it does **not** start at signup; it does **not** end at conversion.

In his Intercom interview he goes further and says he avoids the word "aha" entirely,
preferring **"value moments"** — "moments when your user sees the value and is actively
signing up and starting to experience it" — and frames the real goal as repetition:
> "how do you get users to get to that value moment of your product multiple times so that
> it becomes a habit?"
— `[PRIMARY-PRACTITIONER]` https://www.intercom.com/blog/podcasts/growth-marketing-ramli-john-on-user-onboarding/

**So what for us:** our "aha" is not "I got a score." It's *"I said a real sentence to a
guest on shift and it worked."* That moment happens **outside our product**, on the floor.
This is the single most important reframe in this document — see §6.

### 1.2 The three moments of value (the actual spine of the book)
| Moment | Definition | When |
|---|---|---|
| **MVP** — Moment of Value *Perception* | User first visualizes the product in the context of their own situation | Usually **before** signup |
| **MVR** — Moment of Value *Realization* | User first experiences value / achieves desired outcome | First session(s) |
| **MVA** — Moment of Value *Adoption* | User integrates it into their routine/workflow | Weeks |
— `[PRIMARY-PRACTITIONER]` productled.com/book/onboarding

**So what for us:** MVP is normally earned by a landing page the user chose to read. Our
learner never sees our landing page. **MVP has to be manufactured by the employer** — which
means the shift-briefing script is a product artifact we ship, not a sales leave-behind.

### 1.3 EUREKA (6 steps)
1. **E**stablish an onboarding team (cross-functional)
2. **U**nderstand users' desired outcomes (JTBD — functional, emotional, social jobs; plus
   the four progress-making forces: push, pull, anxiety, inertia)
3. **R**efine onboarding success milestones (signup complete → first value → consistent use)
4. **E**valuate the new user's journey (minimize time-to-value; Bowling Alley)
5. **K**eep new users engaged (product bumpers + conversational bumpers; BJ Fogg B=MAP)
6. **A**pply changes and repeat ("multiple iterations usually beat a commitment to the first idea")
— `[PRIMARY-PRACTITIONER]` https://productled.com/blog/the-eureka-framework-to-improve-user-onboarding

**Forces note (step 2) is the underused one for us.** Push/pull/anxiety/inertia. For a
bellboy the *anxiety* force is enormous and almost never designed for: embarrassment about
their English, fear that the score goes to their boss and costs them their job. Our product
currently sends every score straight to an HR dashboard. That is an anxiety amplifier
sitting directly on the activation path.

### 1.4 The Bowling Alley Framework (Wes Bush) — the operational half
Core concept: the **value gap** = the gap between *Perceived Value* (what you promised) and
*Experienced Value* (what they got).

- **Straight-Line Onboarding** — the minimum essential path. Three questions:
  1. What steps can be **eliminated**? (non-essential fields, confirmations)
  2. What steps can be **delayed**? (advanced features, taught contextually later)
  3. What steps are **mission-critical**? (things without which the product cannot work)
  Claim: this can "shave off anywhere from 20 to 75% of your onboarding steps."
  `[PRIMARY-PRACTITIONER]` but **no source given for the 20–75% figure — treat as rhetoric, not data.**
- **Product bumpers** — tours, checklists, empty states, tooltips (explicitly warns against tooltip overuse)
- **Conversational bumpers** — behaviour-triggered messages on three signals: signup signal,
  quick win, desired outcome. Explicitly says track "leads to value achieved," not signups.
— `[PRIMARY-PRACTITIONER]` https://productled.com/blog/user-onboarding-framework

### 1.5 Statistics John cites (with my provenance check)
| Claim | Attributed to | My assessment |
|---|---|---|
| 40–60% of new users sign up once and never return | Intercom | Repeated across John's book page, blog, and the Aakash Gupta masterclass. Original Intercom study not locatable at primary source. `[UNVERIFIED]` — **do not put this in a sales deck** |
| 73% of mobile apps deleted after a single use | — | `[UNVERIFIED]` |
| HubSpot Sidekick: 15% W1 retention lift → 50% increase in 10-week retention | HubSpot | `[UNVERIFIED]` at primary; directionally consistent with retention-curve math |
| Onboarding completers 38% more likely to return | InnerTrends | `[UNVERIFIED]` |
| Positive onboarding → 2–3x more willing to pay | ProfitWell | `[UNVERIFIED]` |
| Slack: teams sending 2,000 messages are "93% more likely to stick around" | Slack | Widely cited; attributed to Josh Pritchard (Slack analytics). Amplitude repeats the 2,000 figure. `[UNVERIFIED]` at primary source. **Use as an illustration of the *method*, never as a benchmark.** |

**Discipline rule for Diego:** none of the above numbers survived primary-source
verification. Use the *verified* numbers in §2 and §4 instead.

---

## 2. Activation benchmarks — the numbers that ARE verifiable

### 2.1 What "good" looks like
Lenny Rachitsky's survey of 500+ products `[PRIMARY-PRACTITIONER]`
(https://www.lennysnewsletter.com/p/what-is-a-good-activation-rate):

- **Overall average activation: 34%. Median: 25%.** SaaS-only: 36% avg / 30% median.
- By category (GOOD = 60th pct, GREAT = 80th pct):
  - B2B Enterprise SaaS: **~50% GOOD, ~75% GREAT**
  - B2C Freemium/Subscription: ~65% GOOD, ~85% GREAT
  - B2C Marketplace: ~25% GOOD, ~45% GREAT
- Only **~6%** of respondents used a time-bound activation definition; **median window 10
  days, mode 7 days.**
- Two criteria for a valid activation event: (1) **predictive** — activated users retain
  **2x+** better; (2) **actionable** — the team can actually move it.
- Named failure modes: threshold set too early (signup = activation), too late, not
  correlated with retention, or too complex.

Userpilot's 2025 benchmark (first-party analytics across 547 SaaS companies) `[VENDOR]`:
- Average activation **37.5%** (median 37%)
- **Median time-to-value: 1 day, 12 hours, 23 minutes** (n=62)
- **Onboarding checklist completion: 19.2% average, 10.1% median** (n=188) ← see §3.3
- 1-month retention 46.9% (n=83); core feature adoption 24.5% (n=181)
— https://userpilot.com/blog/user-activation-benchmarks/ (report gated; figures reported
consistently across Userpilot's own posts and third-party citations)

**So what for us — set the target now.**
We are B2B-mandated with a captive audience and a personal link. Our floor should be *well
above* consumer PLG norms because we skip acquisition friction entirely. Proposed targets
for pilot #1:
- **Learner activation ≥ 70%** of links sent → completed drill #1 within 72h
- **Learner activation (real bar) ≥ 45%** → completed drill #1 AND returned on a different
  calendar day within 7 days
- **Property activation ≥ 80%** → HR distributed ≥80% of purchased seats within 14 days of
  payment
If we hit only the consumer-PLG 34%, the pilot has failed even if HR is happy.

### 2.2 The aha-moment methodology (Amplitude)
Amplitude defines it as "the moment that the utility of the product really clicks for the
users; when the users really get the core value" and is explicit that **aha ≠ activation ≠
onboarding completion** — finishing a tutorial is a prerequisite activity, not an aha.
Their discovery method: segmentation → journey analysis → direct feedback from churned
users → retention correlation.

**Their caveat is the important part:** they warn explicitly about **selection bias** —
if you only look at users who completed your onboarding flow, you'll credit the flow for
retention that actually came from an aha those users had off-path.
— `[PRIMARY-PRACTITIONER]` https://amplitude.com/blog/aha-moment

**So what for us:** when we analyse our first cohort, we must include the learners who
*skipped* the intro page and went straight to a drill. If they retain better, our
`/onboarding/empleado` page is a tax, not a bumper.

---

## 3. The mechanics — what to build, with evidence

### 3.1 Progressive disclosure (Nielsen, 1995)
Two principles, verbatim: *"Initially, show users only a few of the most important
options."* / *"Offer a larger set of specialized options upon request."*
Improves three usability components: **learnability, efficiency, error reduction.**
Nielsen gives **no 80/20 rule** — he says decide via task analysis, field studies, and
frequency-of-use instrumentation.
— `[PRIMARY-PRACTITIONER]` https://www.nngroup.com/articles/progressive-disclosure/

**So what for us:** we currently explain four concepts (Escucha / Habla / Refuerza /
Vocabulario) before the learner has done anything. That is the opposite of progressive
disclosure — it's front-loaded disclosure. Ship one concept (Escucha) and reveal the
others as they are first encountered.

### 3.2 Empty states
NN/g's framing (via secondary citation, `[VENDOR]`-adjacent): the zero-data screen is a
"teachable moment." A good first-use empty state answers four questions: where am I, why is
this empty, what do I do next, what will it look like when full. Rule of thumb offered:
**two parts instruction, one part delight.**

**So what for us:** `/practice/progress` on day 0 is our biggest empty state and it's
currently a graveyard. It should show the *shape* of what's coming (a filled example week,
greyed) rather than zeros. Zeros on day 0 tell a low-confidence learner "you are behind."

### 3.3 Checklists — the counterintuitive finding
**Average onboarding checklist completion is 19.2%; median 10.1%** (n=188, Userpilot 2025)
`[VENDOR]`.

Read that again. **Nine out of ten users never finish the onboarding checklist.** The
industry treats checklists as a best practice; the data says they're mostly ignored.

**So what for us:** do **not** build a multi-step onboarding checklist for the learner.
Build one for **HR** (who is a motivated, self-selected user for whom checklists work), and
give the learner a *single next action* instead. If we ever do show the learner progress,
it must be the streak/progress artifact, not a task list.

### 3.4 Endowed progress — the highest-ROI mechanic on this list
Nunes & Drèze (2006), *Journal of Consumer Research* 32(4), 504–512. Car-wash loyalty
cards. Group A: 8-stamp card, 0 stamps given. Group B: 10-stamp card, **2 stamps
pre-awarded**. Identical work required (8 washes).
- **Group A completion: 19%. Group B completion: 34%.** Group B also completed *faster*.
— `[PRIMARY-ACADEMIC]` https://academic.oup.com/jcr/article-abstract/32/4/504/1787425

**So what for us — concrete and cheap:** the placement exam is *already* effort the learner
expended. **Their streak/progress must start at 2–3, credited to the exam, not at 0.**
Frame it as: *"Ya llevas 3 pasos: tu examen contó."* This is a one-line change with a
peer-reviewed 1.8x effect size behind it. Do this before anything else in this document.

### 3.5 Goal gradient + the post-reward reset
Kivetz, Urminsky & Zheng (2006), *Journal of Marketing Research* 43(1), 39–58.
- Café loyalty card: customers **buy more frequently as they approach** the reward.
- **Illusionary progress** (12-stamp card with 2 free vs 10-stamp card) also accelerates.
- **Critical second finding:** in both programs, participants **reduced engagement after
  receiving the first reward**, then re-accelerated approaching the second.
— `[PRIMARY-ACADEMIC]` https://journals.sagepub.com/doi/abs/10.1509/jmkr.43.1.39

**So what for us:** never build a single terminal goal ("complete your 30-day program").
Build **overlapping short arcs** — the next arc must already be visible and partially
progressed *at the moment* the previous one completes. Our `/practice/done` screen is
exactly where the post-reward slump happens; it must hand off, not congratulate and stop.

### 3.6 Habit formation timing
Lally et al. (2010), *European Journal of Social Psychology* 40(6), 998–1009. 96 volunteers
chose a daily eating/drinking/activity behaviour in a stable context; 82 gave analysable
data; automaticity modelled with asymptotic curves over 84 days. Automaticity rises with
repetition in a **stable context** and plateaus, with **wide individual variation** in time
to plateau.
`[PRIMARY-ACADEMIC]` (abstract verified via PubMed-indexed record and multiple citing
sources) https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674
> **Honesty note:** the famous "median 66 days, range 18–254" figures are from this paper
> and universally cited, but I could not open the full text or abstract at a primary,
> non-paywalled source in this session. Cite the paper, describe the finding
> qualitatively ("roughly two months, with enormous individual variation"), and do **not**
> put "66 days" in a customer-facing deck until someone reads the PDF.

Two design-relevant findings that ARE safe to use: (a) **context stability matters** — the
cue must be the same each day; (b) missing an occasional day did not meaningfully harm
habit formation.

**So what for us:** (a) the drill must fire at the **same anchor in the shift** every day
(e.g. "after you clock in"), not at a fixed clock time that ignores rotating shifts.
(b) **Do not punish a missed day.** Duolingo-style streak destruction is
psychologically wrong for a low-confidence, shift-working adult and is contradicted by the
habit-formation evidence. Build a forgiving streak (see §5) — and note the buyer doesn't
care about streaks, they care about level movement.

---

## 4. The mandated-software problem — the part no PLG book covers

This is where our situation genuinely diverges from every framework above, and where the
most valuable findings are.

### 4.1 Social influence dominates when use is mandated
Venkatesh, Morris, Davis & Davis (2003), *MIS Quarterly* 27(3), 425–478. UTAUT: four
constructs (performance expectancy, effort expectancy, social influence, facilitating
conditions) with four moderators, one of which is **voluntariness of use**.
- Performance expectancy is the strongest predictor of intention **in both** voluntary and
  mandatory settings.
- **Social influence is significant in mandatory settings and much weaker/non-significant
  in voluntary ones.** It is more pronounced for **women, older users, and low
  voluntariness** — and it **wanes with experience.**
— `[PRIMARY-ACADEMIC]` https://misq.umn.edu/misq/article/27/3/425/1340/User-Acceptance-of-Information-Technology-Toward-A

**So what for us — three concrete builds:**
1. **The supervisor is a product surface.** Ship a *jefe de turno* one-pager + a
   60-second WhatsApp voice note the supervisor forwards in their own voice. Not a PDF for
   HR's file. A thing a shift supervisor actually says out loud at pase de lista.
2. **Make peer participation visible, and only positively.** "8 de 12 en recepción ya
   practicaron hoy" — never "tú no." Social proof at team level, never individual shaming;
   shaming feeds the anxiety force (§1.3) in an already-embarrassed learner.
3. **Front-load social influence, then let it decay by design.** UTAUT says its effect wanes
   with experience — so weeks 1–2 lean on the supervisor and peers, and weeks 3+ shift the
   messaging to performance expectancy ("aquí está el inglés que usaste esta semana").

### 4.2 Perceptions of voluntariness vary *within* the same mandate
Research consistently finds voluntariness is a **continuum**, not a binary — the same
mandate feels more or less voluntary to different individuals in the same org.
— `[PRIMARY-ACADEMIC, secondary-verified]` Brown, Massey, Montoya-Weiss & Burkman (2002),
"Do I really have to? User acceptance of mandated technology," *European Journal of
Information Systems* 11(4). (Abstract behind a 403; finding corroborated across multiple
citing sources.) Also Venkatesh et al. 2003 on the voluntariness moderator.

**So what for us:** don't assume the mandate landed. **Measure the felt mandate.** Add one
question to the day-3 WhatsApp: *"¿Tu jefe te dijo que esto es parte del trabajo? Sí / No /
No estoy seguro."* Properties where >30% answer No/No-sé are properties about to churn, and
the fix is a conversation with the GM, not a product change.

### 4.3 THE most actionable finding in this entire document
Baldwin, Magjuka & Loher (1991), "The Perils of Participation: Effects of Choice of
Training on Trainee Motivation and Learning," *Personnel Psychology* 44, 51–65.
207 trainees randomly assigned to three conditions:
(a) no choice of training; (b) choice offered — **choice NOT received**; (c) choice offered
— **choice received**.

Findings, controlling for cognitive ability:
- Trainees with choice had **greater motivation to learn — but only if they actually got
  what they chose.**
- **Trainees who were asked to choose and then got something else were LESS motivated and
  LEARNED LESS than trainees who were never asked at all.**
— `[PRIMARY-ACADEMIC]` https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1744-6570.1991.tb00690.x

**So what for us — this is a hard product rule:**
> **Never ask the learner a preference question we will not honour exactly.**

This kills a whole category of "onboarding personalization theatre" that PLG blogs
recommend. If our first screen asks *"¿Qué te cuesta más: check-in, quejas, o el
teléfono?"* then **the very next drill must be that thing.** If our content library can't
guarantee that for all role × level × topic combinations, **do not ask the question** — a
generic drill with no question asked outperforms a question we ignore.

Corollary: this also makes honoured choice a *weapon*. Offering a real, honoured choice at
drill #1 is one of the few evidence-backed ways to inject autonomy into a mandated
experience. Build the content coverage so we can afford to ask.

### 4.4 Training motivation is a real, measurable, and movable variable
Colquitt, LePine & Noe (2000), "Toward an integrative theory of training motivation: a
meta-analytic path analysis of 20 years of research," *Journal of Applied Psychology*
85(5), 678–707. Verified via PubMed (PMID 11055143).
- Motivation to learn predicts **declarative knowledge, skill acquisition, and transfer**,
  and explains **incremental variance beyond cognitive ability.**
- Antecedents: locus of control, conscientiousness, anxiety, age, cognitive ability,
  **self-efficacy, valence, job involvement**, and **climate**.
- Effects of personality, climate, and age on outcomes are **partially mediated** by
  self-efficacy, valence, and job involvement.
— `[PRIMARY-ACADEMIC]` https://pubmed.ncbi.nlm.nih.gov/11055143/

**So what for us:** the three mediators are the three things our onboarding must
manufacture in the first session.
- **Self-efficacy** ("puedo hacer esto") → the first drill must be *winnable*. Score the
  first attempt generously; our CLAUDE.md scoring rubric already says "for A1-A2 be
  GENEROUS, never 0 if they attempted English" — that instruction is not a nicety, it's
  the self-efficacy lever. Protect it.
- **Valence** ("this matters to me") → tie to *tips, guest reviews, promotion*, not CEFR
  letters. A1/A2 is buyer language, not learner language.
- **Job involvement** → every drill must be visibly from *their* shift, their role, their
  hotel type. Generic English destroys this.

### 4.5 Transfer depends on the supervisor, not the trainee
Blume, Ford, Baldwin & Huang (2010), "Transfer of Training: A Meta-Analytic Review,"
*Journal of Management* 36, 1065–1105. 89 studies.
- **Transfer climate: ρ ≈ .27** (strongest work-environment predictor)
- **Supervisor support: ρ ≈ .31** — notably **stronger than peer support (≈ .14)**
- Social support overall ≈ .21
- No clear superiority of individual vs situational variables
— `[PRIMARY-ACADEMIC]` https://journals.sagepub.com/doi/10.1177/0149206309352880

**So what for us:** we sell "measurable results." The meta-analysis says results depend
substantially on the supervisor. **Therefore supervisor enablement is not customer success
overhead — it is the product.** Concretely: a weekly WhatsApp to each shift supervisor
with (a) the three phrases their team practised this week and (b) one instruction: *"pide
esa frase a una persona hoy."* That single loop is probably worth more measured lift than
any in-app feature we could ship this quarter.

---

## 5. The competitive frame — what to steal from Duolingo and what to reject

Jorge Mazal (former CPO, Duolingo), `[PRIMARY-PRACTITIONER]`
https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth :
- They decomposed DAU into retention-rate segments (CURR/NURR/RURR/SURR). Sensitivity
  analysis showed **Current User Retention Rate had 5x the DAU impact of the next-best
  metric** — so they de-prioritized acquisition and new-user onboarding in favour of
  retaining already-engaged users.
- Over four years: **CURR +21% (>40% churn reduction), DAU 4.5x**, and users with **7+ day
  streaks tripled to over half of DAU.**
- **Streak-saver notifications were the first big win** — warning before loss, not
  punishing after.
- Leaderboards: **learning time +17%, highly-engaged learners tripled.**
- Notifications: they deliberately **constrained volume** and optimized timing/copy/
  localization instead, citing Groupon as the cautionary tale of channel destruction via
  opt-out accumulation.
- The retention team ran **600+ A/B tests on the streak alone**, with heavy focus on the
  **0–7 day window.** `[PRIMARY-PRACTITIONER]` (Jackson Shuttleworth on Lenny's Podcast)

### What to steal
1. **Segment the metric.** Don't track "active learners." Track new-learner retention
   (day 1, day 7) separately from current-learner retention. They behave differently and
   need different interventions.
2. **Obsess over days 0–7.** That's where 600 experiments went.
3. **Warn before loss, never punish after.** Streak-saver > streak-broken.
4. **Protect the WhatsApp channel with religious discipline.** WhatsApp reaches ~78% of
   Mexican users and ~92% of the online audience `[VENDOR/aggregator]` (Mazkara/Statista via
   search; DataReportal Digital 2025 Mexico confirms 110M internet users / 83.3% and 127M
   mobile connections `[PRIMARY-PRACTITIONER]` https://datareportal.com/reports/digital-2025-mexico).
   But a WhatsApp block is **permanent and account-level** — far worse than an email
   unsubscribe. **One message per day, maximum. No exceptions. Ever.**

### What to REJECT
1. **Streak-loss anxiety as a motivator.** Duolingo's user chose to be there and can quit
   guilt-free. Ours cannot quit, is tired, works rotating shifts, and already feels bad
   about their English. Streak destruction here converts a mandate into resentment aimed at
   the employer. Use a **forgiving streak**: "días practicados este mes" (a count that only
   goes up) plus a repairable weekly goal. Never a number that resets to 0.
2. **Leaderboards ranking individuals.** In a workplace with a real power hierarchy,
   ranking employees on English is a hostile act. Use **team-vs-team or property-vs-itself-
   last-week** only.
3. **General-language content and gamified filler.** Our whole differentiation is that
   every minute maps to their shift. Duolingo optimizes minutes-in-app; we optimize
   phrases-used-on-shift.
4. **Duolingo's north star.** DAU is the wrong metric for us — see §7.

---

## 6. The two-sided activation model for Inglés Hotelero

PLG assumes one funnel. We have two, in series, and the first one is where accounts
silently die.

```
BUYER FUNNEL (HR / GM)                    LEARNER FUNNEL (bellboy / recepción / mesero)
─────────────────────────                 ────────────────────────────────────────────
1. Signed contract                        1. Received link (WhatsApp, from supervisor)
2. Roster uploaded (≥80% of seats)   ──►  2. Opened link (no signup — /i/[token] ✅)
3. Links distributed                      3. Completed drill #1  ← MVR
4. Supervisor briefed  ────────────────►  4. Returned on day 2   ← the real activation
5. First report opened (day 7)            5. Used a phrase on shift ← the TRUE aha
6. Report shared upward (day 30)     ◄──  6. Level moved (day 30)  ← the buyer's proof
```

**Buyer-side activation events (build these into the HR dashboard as blocking states):**
- `roster_uploaded` — seats claimed ≥ 80%
- `links_distributed` — ≥80% of employees have an issued, unexpired token
- `supervisors_briefed` — supervisor pack acknowledged (one tap)
- `first_report_viewed` — HR opened /hr/reports within 7 days

Any property stalled at a state for >72h is a churn alarm. **Today we have no
instrumentation of the buyer's rollout at all — Stripe says "paid" and we assume the rest.**
That is the single biggest hole in our current activation model.

**Learner-side, in order of leverage:**
1. Link opened (measures the *supervisor*, not the learner — attribute it to the property)
2. Drill #1 complete
3. Day-2 return ← **this is our activation metric**
4. Day-7 return
5. Phrase-used-on-shift (self-reported, one tap — see §6.1)

### 6.1 Instrumenting the true aha
The real aha happens off-product. Capture it with the cheapest possible mechanic: on the
day-3 WhatsApp, one question, two buttons — *"¿Usaste algo de lo que practicaste con un
huésped? Sí / Todavía no."* A "Sí" is the strongest activation signal we will ever get,
it's a story for the HR report, and it's a testimonial pipeline. Nothing else we can build
gives that much per unit of effort.

---

## 7. Metrics we should actually adopt

**North Star (learner):** *Weekly Practising Learners* — distinct learners who completed
≥3 drills in a rolling 7 days, as a % of provisioned seats. (Not DAU: a shift worker
practising 4 of 7 days is a *success*, and a DAU north star would label them a failure and
push us toward punishing streak mechanics.)

**North Star (buyer):** *Property Health* = % of provisioned seats that are Weekly
Practising. That is the number on the HR dashboard hero, and the number renewal hangs on.

**Activation (learner):** completed drill #1 AND returned on a different calendar day
within 7 days. Time-bound at 7 days (matches Lenny's survey mode of 7 days).

**Validation gate (per Lenny's criterion):** before we lock this, verify activated learners
retain **≥2x** non-activated at day 30. If they don't, the event is wrong.

**Time-to-value target:** **under 3 minutes from link tap to first scored utterance.** The
SaaS median TTV is 1d 12h; we should be ~500x faster because we have no setup, no signup,
no integration. This is a genuine structural advantage and we should defend it violently.

**Leading indicator for the buyer:** supervisor-brief completion rate. Per Blume et al.
(ρ=.31), it should predict property outcomes better than any learner-side metric.

---

## 8. Concrete audit of what we have today

Files reviewed:
- `src/app/i/[token]/route.ts` — magic-link entry → session cookie → `/practice`
- `src/app/onboarding/empleado/page.tsx` — 4-card "how it works" explainer
- `src/app/practice/page.tsx` — resolves employee, picks drill, shows intro card + streak + level chips
- `src/app/acceso/page.tsx` — link-failure fallback
- `src/app/practice/done/page.tsx`, `src/app/practice/progress/page.tsx`

### What we already get right (don't break these)
- **Zero-signup entry via `/i/[token]`.** No password, no email, no account creation. This
  removes the single largest activation killer in employer-provided software. Most
  competitors make the employee create an account; we don't. This is a moat.
- **Graceful token-failure page** (`/acceso`) with a human next step ("pide uno nuevo a
  RH") instead of a dead end.
- **Generous A1–A2 scoring rubric** — this is the self-efficacy lever from §4.4. It is
  currently framed in CLAUDE.md as a calibration instruction; it should be reframed as a
  *product principle* so nobody "fixes" it later.
- **Role + level resolved server-side from the employee row** — no learner-facing setup
  questions. Correct.

### What's actively costing us activation
1. **`/onboarding/empleado` is a pre-value tour.** Four concept cards *before* any value.
   This is precisely the anti-pattern John names (his grocery-store analogy: they wanted a
   sandwich, don't walk them down every aisle) and it violates progressive disclosure. It
   sits directly on the straight line between the link tap and the first drill.
   **Fix:** default the token redirect straight to drill #1. Move the four cards to a
   post-drill-#1 "esto es lo que acabas de hacer" reveal, or to `/practice/done`.
2. **Streak starts at 0.** Free 1.8x from endowed progress (§3.4) is being left on the
   table. Credit the placement exam.
3. **`/practice/progress` day-0 empty state shows zeros.** Zeros to a low-confidence
   learner read as "you're already behind." Show a greyed forecast instead.
4. **No honoured choice anywhere.** We have the content to offer one (bellboy/frontdesk/
   restaurant × A1–B2), and §4.3 says honoured choice is one of the few autonomy levers
   available under a mandate. Add exactly one, and honour it exactly.
5. **No supervisor surface at all.** Given ρ=.31 for supervisor support and the UTAUT
   mandatory-context finding, this is the largest missing feature in the product — larger
   than anything on the current post-MVP hardening list.
6. **No buyer-side rollout instrumentation.** We cannot currently tell a property that
   bought 40 seats and distributed 6. That property will churn and we won't see it coming.
7. **Scores flow to HR with no learner-facing framing.** The anxiety force (§1.3) is
   unmanaged. The learner should be told, in plain Spanish, exactly what their boss sees —
   and what they don't. Ideally the first week is explicitly private ("tu primera semana es
   solo tuya"), which converts an anxiety source into a trust asset.

---

## 9. Design rules (hand these to a designer verbatim)

See the structured `designRules` output. Ordering note: rules 1–5 are the ones with
peer-reviewed evidence behind them and should not be traded away in a design review.

---

## 10. Open questions / what I could NOT verify

- **Lally "66 days / 18–254 range."** Paper confirmed, exact figures not read at primary.
  Someone should open the PDF before this appears in any deck.
- **Every Ramli John statistic** (40–60% never return, 73% app deletion, Slack 2,000
  messages, ProfitWell 2–3x). Repeated everywhere, sourced nowhere I could reach. Treat as
  rhetoric.
- **Brown et al. 2002 (mandated technology)** — abstract 403'd at Taylor & Francis. Finding
  corroborated via citing literature; would like the primary.
- **PWA "add to home screen" lift numbers** (Flipkart 70% higher conversion, Trivago +150%
  engagement, "+30% install rate if prompted after 2 pages") are all `[VENDOR]` case studies
  with obvious selection bias — users who install were already engaged. Directionally
  useful for *why* to prompt install; useless as forecasts. Do not model on them.
- **"95%+ completion with TikTok-style microlearning vs <5% for traditional LMS"** — this
  is frontline-training vendor marketing (5mins.ai et al.), not research. Do not repeat it.
- **Unknown for us specifically:** what fraction of learners open the link at all without a
  supervisor saying something. This is the highest-value thing to learn in pilot #1 —
  run it as an explicit A/B across two properties (briefed vs not briefed).

# Value Proposition Design — applied to Inglés Hotelero

Research date: 2026-07-26
Method: Strategyzer primary material (Osterwalder / Pigneur / Bernarda / Smith) + verified third-party evidence for the two customer profiles.
Everything below is either (a) cited to a source I actually fetched, (b) explicitly labelled as *my derivation* from cited figures, or (c) explicitly labelled as a **hypothesis to test** — because per `docs/PHILOSOPHY.md` this company has 0 paying customers and 0 real hotel deployments, so nothing on the customer side is yet a fact.

---

## PART 1 — The method, from primary sources

### 1.1 Canvas structure

Two independent building blocks, and the whole discipline of the tool is keeping them independent.

**Customer Profile (right):** contains only what can be *observed* about a segment, all outside your control.
- **Customer Jobs** — what customers attempt to accomplish: functional, social, emotional tasks, and basic needs.
- **Customer Pains** — negative emotions, undesired costs, situations and risks encountered *before, during, or after* completing jobs.
- **Customer Gains** — expected or desired benefits: functional utility, social gains, positive emotions, cost savings.

**Value Map (left):** what you *design* to address the profile.
- **Products & Services** — tangible, digital, intangible, financial.
- **Pain Relievers** — how the offering eliminates or reduces specific pains.
- **Gain Creators** — how the offering produces benefits customers expect or desire.

Source: <https://www.strategyzer.com/value-proposition> · <https://www.strategyzer.com/library/value-proposition-design-book-summary>

Job types, per the authors:
- **Functional** — practical tasks ("ship a project on time").
- **Social** — how the customer wants to be *perceived* ("look competent in front of my board").
- **Emotional** — feelings and personal satisfaction ("feel less overwhelmed on Mondays").
- **Supporting** — jobs that help get the core job done (e.g. comparing products before buying).

### 1.2 The five mistakes (Strategyzer)

Verbatim-anchored from <https://www.strategyzer.com/library/5-common-mistakes-to-avoid-when-using-the-value-proposition-canvas>:

1. **Not viewing the canvas as two separate building blocks.** Right side = observable, outside your control. Left side = designed by you.
2. **Mixing several customer segments into one canvas.** "each distinct customer segment has different jobs, pains, and gains" → separate canvas per segment. *(This is why this document has two canvases and refuses to merge them.)*
3. **Building the customer profile through your value proposition's lens** — people "immediately start listing only the jobs, pains, and gains that they see their value proposition resolving." Antidote: Five Whys, step into the customer's shoes.
4. **Only focusing on functional jobs** — "functional jobs are what's most visibly apparent," but social and emotional jobs often drive behaviour more powerfully. **This is Inglés Hotelero's biggest single gap (see §2.6).**
5. **Trying to address every pain and gain** — results in "time wasted in a fruitless, unfocused effort." Pick the highest-priority ones and make trade-offs.

### 1.3 Osterwalder's own test for a **high-value job** (the prioritisation rule)

From his Business of Software talk, <https://businessofsoftware.org/talks/jobs-pains-gains-designing-better-value-propositions-alex-osterwalder/>. A job worth building a business on is:

| Criterion | Meaning |
|---|---|
| **Important** | Failing it creates extreme pain or blocks a key gain |
| **Tangible** | The customer feels/sees the pain or gain *regularly* |
| **Unsatisfied** | Competitors haven't solved it well |
| **Lucrative** | Customers will pay |

He notes tangibility is chronically underestimated — "the daily email avalanche" is low-importance but high-tangibility, and that drives engagement. He also warns social/emotional jobs are "frequently overlooked, even in B2B software," and that value propositions must be **quantified in dollars, percentages or time**, not vague claims about "faster" or "better."

Failure statistics — note the two Strategyzer-side numbers disagree, so use them carefully:
- Osterwalder in the talk: "7 out of 10 new product introductions flop."
- Strategyzer site: "6 out of 10 ideas fail in the real world because teams launch something nobody wants." (<https://www.strategyzer.com/value-proposition>)

### 1.4 Gains are NOT the inverse of pains

<https://www.strategyzer.com/library/are-gains-the-opposite-of-pains>

- Payment failing = pain. Payment succeeding ≠ gain — it merely **meets the expectations bar**.
- Coffee expected in 5 min: 2 min = gain, 5 min = neutral, 10 min = pain. Pains and gains sit on **continuums with boundaries** (coffee too hot to hold is a pain, not a bigger gain).
- Three hacks: (1) define the expectations bar — falling below it is a clear pain; (2) find the continuums; (3) clarify the continuum boundaries.

**Why this matters for us:** most of what Inglés Hotelero currently ships is *bar-meeting*, not gain-creating. "The app loads," "the audio plays," "the exam gives a level" are the expectation bar. Real gains are only what *exceeds* expectation — and for both our segments the bar is set by things they already use (WhatsApp for the learner; Excel + the PMS for the buyer).

### 1.5 The three types of fit

<https://www.strategyzer.com/library/survival-of-the-fittest>

| Fit | Achieved when you have evidence that... | Our status |
|---|---|---|
| **Problem–Solution** | "customers care about certain jobs, pains, and gains" | **NOT achieved** — 0 discovery interviews per `docs/PHILOSOPHY.md` §4 |
| **Product–Market** | "your value proposition is actually creating value for customers by alleviating their pains and creating the gains they desire" | Not achieved — 0 real staff, 0 hotels |
| **Business Model** | "your value proposition is embedded in a profitable and scalable business model" | Not achieved — pricing untested |

Reaching them requires "going back and forth between your original idea and the outside world, getting out of the building all along the way."

### 1.6 The testing roadmap

<https://www.strategyzer.com/library/roadmap-to-test-your-value-proposition> — a funnel that narrows:

1. **Test the circle** (jobs / pains / gains) — broadest pool. Suggested cheap instrument: a keyword ad campaign measuring search volume + CTR on *problem* terms.
2. **Test the square** (products, services, features) — which offerings do they want most. Suggested instrument: Luke Hohmann's *Buy-a-Feature*.
3. **Test the rectangle** (revenue / willingness to pay) — "Setting up a fake-sales website is a quick and cheap way to test if customers will put money where their mouth is."

Experiment design (<https://www.strategyzer.com/library/design-experiment-that-connects-to-your-value-proposition-canvas>): take the **top 1–3 voted pains and gains** off the canvas and put them verbatim into the experiment (e.g. a landing page: value-prop statement as headline, product description centre, pains bottom-left, gains bottom-right, CTA). Do not create the value proposition "in a vacuum or neglect the work that you've already done."

And the book's own warning: "Customer opinions about hypothetical solutions aren't always accurate."

---

## PART 2 — CANVAS A: the learner (el colaborador)

### 2.0 Segment definition (mistake #2 discipline)

**One canvas = one segment.** This canvas is for:

> Guest-facing frontline employee (botones / recepción / restaurante) at an 80–400-room resort in Cancún, Riviera Maya or Los Cabos. Native Spanish speaker, self-assessed A1–A2 English. Mid-range Android, prepaid data, storage near full. Rotating shifts. Paid partly in tips. Has previously "studied English" at school and does not consider it a success.

**The segmentation axis that actually matters is NOT role — it is English exposure frequency × stakes.**
- **Botones:** high frequency, low complexity, high tip sensitivity, short exchanges → wants *fluent recall of 40 phrases*.
- **Recepción:** lower frequency, high complexity/stakes (billing disputes, complaints), audience of waiting guests → wants *comprehension under pressure + recovery lines*.
- **Restaurante:** high frequency, medium complexity, safety-critical subset (allergies) → wants *comprehension of unfamiliar accents + confirmation lines*.

If the daily drill doesn't differ across those three on *exposure and stakes* (not just vocabulary), we are treating three segments as one.

### 2.1 Grounding evidence for this profile (verified)

| Fact | Figure | Source |
|---|---|---|
| Mexico EF EPI 2025 | score **440**, global rank **#103**; global average **488** | [EF EPI 2025 Mexico fact sheet](https://www.ef.com/assetscdn/WIBIwq6RdJvcD9bc8RMd/cefcom-epi-site/fact-sheets/2025/ef-epi-fact-sheet-mexico-english.pdf) |
| Skill split — the job's two skills are Mexico's weakest | Reading **455**, Listening **422**, Speaking **413**, Writing **399** | ibid. |
| **Cancún scores *below* the national average** | Cancún **414** vs national 440; Quintana Roo state **435**; Mexico City **428**; Acapulco **448**; Cabo San Lucas **469**; Playa del Carmen **517**; Puerto Vallarta **518** | ibid. |
| Wage premium for English in Mexico | **19.4%** | Charles-Leija & Torres García (2022), *Análisis Económico*, Mincer equation w/ Heckman correction, INEGI survey, >20,000 respondents — <https://www.scielo.org.mx/scielo.php?pid=S2448-66552022000100167&script=sci_abstract&tlng=en> |
| English is scarce | "less than 10% of those surveyed said they speak that language" | ibid. |
| WhatsApp reach | Mexico internet penetration 83.3%, 110M users at start of 2025; WhatsApp among the most-used platforms | [DataReportal Digital 2025 Mexico](https://datareportal.com/reports/digital-2025-mexico) |

**Caveat I must flag honestly:** the EF EPI sample is *self-selected online test-takers*, not a representative population sample. Note that EF's Mexico "Customer Service" job-function score is **599** — far above the national 440. Do **not** read that as "hotel frontline staff are B1+." The self-selection runs the other way: people who voluntarily take an online English test skew toward people already pursuing English. Our A1 bellboy is precisely the person *absent* from that sample. Treat 440 as an optimistic ceiling for our learner, not a floor.

**The decision this data forces:** Mexico's *reading* score (455) is 42 points above its *speaking* score (413). Every app that teaches by reading is optimising the skill Mexicans are already relatively best at, for a job that requires the two they are worst at. Our listening-first + voice-first architecture is evidence-aligned. Say so on the sales page with the citation.

### 2.2 CUSTOMER JOBS — learner

Ranked by importance to the learner (not to us).

**Functional (core)**
| # | Job | Importance |
|---|---|---|
| F1 | Get through my shift without an interaction going wrong | **Extreme** |
| F2 | Understand what the guest just said — first time, normal speed, unfamiliar accent, lobby noise | **Extreme** |
| F3 | Answer fast enough that the guest doesn't switch to gestures or ask for someone else | **Extreme** |
| F4 | Handle the 15–25 situations that actually recur on *my* station | High |
| F5 | Recover when I don't understand ("could you repeat that, please?") without losing face | High |

**Functional (supporting)**
| S1 | Get this on my phone without installing, without a password, without eating my data or storage |
| S2 | Practice without a coworker/supervisor/guest hearing me fail |
| S3 | Remember to practice on a rotating shift with no fixed daily slot |
| S4 | Prove I did it (to my supervisor, if it helps me) |

**Social**
| # | Job | Importance |
|---|---|---|
| SO1 | **Not be the one who has to call someone else over** | **Extreme** |
| SO2 | Be trusted with English-speaking guests → get the good station → get better tips | High |
| SO3 | Not be condescended to by a guest | High |
| SO4 | Be seen (by family, by peers) as someone moving up | Medium |

**Emotional**
| # | Job | Importance |
|---|---|---|
| E1 | Stop the stomach-drop when a foreign guest walks toward me | **Extreme** |
| E2 | Feel competent, not stupid — undo "I was bad at English in school" | **Extreme** |
| E3 | Feel safe practising — no audience, no permanent record of me failing | High |
| E4 | Believe this is **finite and ends**, not an infinite grind | High |

**Applying Osterwalder's high-value-job test:** F2 (understand first time) and SO1 (not needing rescue) score Important ✓, Tangible ✓ (felt every shift), Unsatisfied ✓ (no product addresses "rescue moments"), Lucrative — indirectly (tips, station assignment; and the buyer pays). **SO1 is the highest-value job on this canvas and the product currently does nothing explicit about it.**

### 2.3 PAINS — learner (ranked by severity)

**EXTREME**
1. **The freeze / the rescue moment.** Not understanding, saying "one moment please," and fetching a colleague — in front of the guest and coworkers. Humiliation + lost tip.
2. **Shame at being heard.** Will not speak English out loud where coworkers, guests, family or bus passengers can hear. *This is a hard physical constraint on a voice-first product, not a preference.*
3. **Everything before this failed.** School English produced nothing usable; the hotel's occasional 2-hour class produced nothing; gamified apps produced an owl. Prior-failure history = default expectation of failure.

**HIGH**
4. **Effort after an 8-hour shift on their feet.** The competing alternative is not "another app," it is *doing nothing*. Any friction above the friction of opening TikTok loses.
5. **Data & storage.** Prepaid plan; a phone with full storage. Audio is the #1 data consumer in our product. An install prompt is a cost.
6. **Rotating shifts destroy fixed-time habits** — and therefore destroy streaks. A streak that breaks because you worked a double is a *punishment for working*.
7. **No correction.** Self-study gives no answer to "was what I said actually understandable?"
8. **Irrelevant vocabulary.** Generic apps teach sentences no guest has ever said.

**MODERATE**
9. **Being measured.** The placement exam is a *gain for the buyer and a pain for the learner*: a test whose result goes to my boss and might be used against me. (See §4, conflict #4.)
10. **Login friction** — passwords, corporate email they don't have or check.

### 2.4 GAINS — learner (Strategyzer's four tiers)

**Required** (absence = deal-breaker)
- Understand + respond in the recurring situations of *my* station.
- Practise privately, with no audience.
- Costs me nothing in money and effectively nothing in data.

**Expected** (the bar — meeting these creates neutrality, not delight)
- An exact phrase I can trust and reuse tonight.
- Genuinely ≤5 minutes, interruptible mid-way, resumable.
- Visible progress.

**Desired** (what they'd name if asked)
- **More tips.** The only personal, monetary, weekly-visible gain.
- A better station / shift assignment; being picked for VIP guests.
- A credential that is **mine and portable**.

**Unexpected** (delight — where the differentiation lives)
- A guest or supervisor spontaneously compliments something I said.
- **Hearing my own recording from 30 days ago next to today's.** Highest-leverage unexpected gain available to us; we already store the audio.
- Becoming the person coworkers ask for help.

### 2.5 VALUE MAP — learner

**Products & Services (what exists today, per `docs/INVENTORY.md`)**
- 15-min placement exam → CEFR A1–B2 (13 diagnostic + 10 listening + 6 speaking per role)
- Daily 5-min loop: listen → answer → speak → reinforce → 3 vocab cards (SM-2), + streak
- 60 role×level drills, 168 real ElevenLabs audio files
- AI speaking score (Whisper + Claude; currently mock until keys)
- One-tap passwordless token login (`/i/[token]`, 1-year)
- Offline PWA; WhatsApp daily-drill engine (built, inert)

**Pain Relievers — each must name the pain it kills**

| Reliever | Kills | Exists? |
|---|---|---|
| One-tap token link, no password/email/app-store | P10, S1 | ✅ built |
| Pre-downloaded audio + offline PWA + a visible "0 MB usados hoy" counter | P5 | ⚠️ PWA built, the *counter* (the reassurance) does not exist |
| **Silent mode**: whisper-level input accepted, or a "responder por escrito" fallback for any speaking step | **P2 (extreme)** | ❌ **missing** |
| Role- and station-specific scripted phrases | P8 | ✅ built |
| Feedback that says *entendible / no entendible* + the one sound to fix — never a percentage score | P7, P3 | ⚠️ scoring exists; the *framing* does not |
| Streak that pauses on días de descanso / doubles; "racha de turnos," not "racha de días" | P6 | ❌ **missing** |
| Privacy contract shown in-product: HR sees your level and whether you practised, **never your recordings** | P9, E3 | ❌ **missing** |
| Exam reframed as "punto de partida"; learner sees their result *first*, always | P9 | ❌ **missing** |
| A finite, visible map: "42 frases. Vas 17." | E4, P3 | ❌ **missing** |

**Gain Creators**

| Creator | Gain it creates | Exists? |
|---|---|---|
| Each drill labelled with the exact station moment ("Lo que dirás hoy en el lobby a las 3pm") | Required + Desired | ⚠️ content exists, labelling doesn't |
| **"Antes / Ahora"** — day-1 recording replayed beside today's | Unexpected (highest leverage) | ❌ **missing**, audio already stored |
| Named, portable, level-based certificate | Desired | ⚠️ certification is a Phase-3 vision item |
| Rescue-moment drills: a dedicated micro-set of recovery lines ("Sorry, could you say that again more slowly?") | Kills the extreme social job SO1 | ❌ **missing** |
| Opt-in recognition surface the employee controls | Social | ❌ missing |
| Tip framing at onboarding: cite the 19.4% English wage premium in the learner's own language | Desired | ❌ missing |

### 2.6 FIT VERDICT — learner canvas

**Functional fit: strong.** Role-specific finite content, 5-minute loop, listening+speaking emphasis, CEFR levels, offline. This is genuinely better-aimed than a general consumer app.

**Social + emotional fit: weak — and this is exactly Strategyzer's mistake #4.** Of the four extreme-severity pains, the product currently addresses **one** (P8, irrelevant vocabulary). It addresses none of: the rescue moment (SO1/P1), the can't-be-heard constraint (P2), the prior-failure expectation (P3), or the shift-schedule/streak collision (P6).

The streak mechanic is the clearest symptom: it was imported from consumer language apps designed for people with fixed daily rhythms, and applied unmodified to shift workers. For our learner it converts working a double into a visible failure. That is a gain creator that functions as a pain generator.

---

## PART 3 — CANVAS B: the buyer (Director de RRHH / Gerente General)

### 3.0 Segment definition

> HR Director or GM of an independent or 2–8 property chain resort, 80–400 rooms, Cancún / Riviera Maya / Los Cabos. Reports to an owner or an asset manager. **Has no formal L&D function.** Spends most of the week on staffing, not development. Buys with a signature threshold; anything larger needs the owner.

Evidence for "no L&D function": in a study of **67 hotel HR managers** in Guanajuato, only **4** had formal recruitment procedures and only **4** provided induction courses; training was informal and on-the-job with "no formal programs or certifications." (<https://www.redalyc.org/journal/3312/331267304006/html/>)

A chain L&D director at a Hilton/Marriott-managed property is a **different segment** — separate canvas, different jobs (brand-standard compliance, global vendor procurement, LMS integration). Do not sell to both with one deck.

### 3.1 Grounding evidence for this profile (verified)

| Fact | Figure | Source |
|---|---|---|
| Hotel turnover, Mexico | **48.72% annual** (4.06% monthly); 67 HR managers interviewed | [Redalyc / Rev. Ibero-Americana de Estratégia](https://www.redalyc.org/journal/3312/331267304006/html/) |
| Cost to replace an employee | "potentially reaching up to **30% of an individual's annual compensation**" | [AHLA + Actabl, *Turning Down Turnover* (Oct 2023)](https://www.ahla.com/sites/default/files/Turning_Down_Turnover-10.16.23.pdf) |
| Worked example the buyer will recognise | 40-position hotel moving from high- to mid-turnover segment ≈ 8 fewer departures/yr × $6,000 = **$48,000/yr saved** | ibid. |
| "Quick-turn" (first-30-day) turnover is rising post-pandemic; manager turnover up **25–35%** vs 2019 | ibid. |
| **"Skill and Career Development"** is one of the top five trends shaping turnover; recommended action = "Create structured training programs and clear pathways for growth" | ibid. |
| Recommended channel | "Communicate using phone-based tools that team members are familiar with" | ibid. |
| Review score → pricing power | **+1 point on a 5-point scale → the hotel can raise price 11.2% and hold occupancy/market share** | Anderson, *The Impact of Social Media on Lodging Performance*, Cornell Hospitality Report **Vol. 12 No. 15 (Nov 2012)** — <https://scholarship.sha.cornell.edu/chrpubs/5/> |
| Reputation elasticity | +1% reputation score → up to **+0.89% ADR**, **+0.54% occupancy**, **+1.42% RevPAR**; >50,000 monthly observations, 11 global cities, Jan 2010–Jun 2012 | ibid. |
| Which review categories move ratings | **"Service Friendliness" (+2.8 pp) and "Service" (+2.3 pp) are the #1 and #2 most positive categories**; negatives hurt more than positives help | [TrustYou](https://www.trustyou.com/blog/insights/these-categories-are-most-positively-and-negatively-impacting-hotel-ratings/) |
| Frontline device preference | **84%** of employees want training accessible on their personal devices | Axonify, State of Frontline Employee Training (via <https://axonify.com/blog/top-mobile-learning-platforms/>) |
| Leader/worker perception gap | 87% of leaders believe information reaches frontline workers effectively; only **56%** of workers agree | [Axonify 2026 Frontline Operations Report](https://axonify.com/frontline-operations-report/) |
| US hotel staffing pressure (context, not Mexico) | 65% of hotels report staffing shortages; ~6–7 open positions per property | AHLA 2025 survey, via [HR Dive](https://www.hrdive.com/news/industries-with-highest-quit-rates/721216/) |

### 3.2 CUSTOMER JOBS — buyer

**Functional (core)**
| # | Job | Importance |
|---|---|---|
| BF1 | **Keep every guest-facing position filled and covered this week** | **Extreme** — this, not training, is job #1 |
| BF2 | Onboard a new hire to productive in days, repeatedly, forever | **Extreme** (48.72% annual turnover) |
| BF3 | Protect / raise the property's online review score | High — it is a pricing lever (Cornell) |
| BF4 | Decide who goes on which station / who gets promoted | High |
| BF5 | Produce evidence of training for the brand audit / owner / STPS file | High |
| BF6 | Report to the GM or owner in numbers | High |

**Supporting**
| BS1 | Find budget inside an existing line (capacitación, calidad, brand standards) |
| BS2 | Justify the vendor choice if challenged |
| BS3 | Roll something out **without adding work to supervisors** |
| BS4 | Get a compliant invoice (factura/CFDI) and a payment method that works |

**Social**
| BSO1 | Look competent to the GM / owner / brand inspector — be the person who brought in the thing that worked | **Extreme** |
| BSO2 | **Not be the one who wasted budget on an app nobody used** | **Extreme** |

**Emotional**
| BE1 | Stop dreading the escalation where a guest complains staff "didn't understand me" | High |
| BE2 | Feel in control of a workforce that churns | High |

### 3.3 PAINS — buyer (ranked by severity)

**EXTREME**
1. **"I train them and they leave."** With 48.72% annual turnover and replacement costing up to 30% of annual comp, training reads as money walking out the door. **This is the #1 objection and it kills the sale if the pitch is framed as *training*.**
2. **Implementation cost in my time and my supervisors' time.** Anything with a classroom, a schedule, a computer lab, an LMS integration, or personal follow-up is dead on arrival — this buyer has no L&D function (4/67 hotels have even an induction course).
3. **Adoption risk with my name on it.** "I bought a platform once, nobody logged in, and I heard about it for a year." (BSO2.)

**HIGH**
4. **Budget + approval.** $150–500/mo is small but needs a line item and an owner's yes, with no proof it works.
5. **Cannot measure English.** "They attended a course" is not evidence. There is no before/after artefact today.
6. **No corporate IT surface for frontline staff** — no company email, no computers, rotating shifts, personal phones only.
7. **Labour / compliance exposure in Mexico** — asking employees to use personal phones and personal data off-shift touches working-time and NOM-035-style questions, and is union-sensitive in Cancún/Los Cabos. *Flagged as a hypothesis to verify with a Mexican labour lawyer and in discovery interviews — I did not find a definitive source.*

**MODERATE**
8. Procurement friction: contract, CFDI, purchase order, security questions.
9. Vendor risk: a startup that may not exist in 18 months.

### 3.4 GAINS — buyer

**Required**
- A roster of **who can actually work in English, today, by department and shift**.
- Near-zero implementation labour.
- A proper factura/CFDI.

**Expected** (the bar)
- Measurable movement in 30–90 days.
- A report I can forward to the GM without editing it.
- Zero supervisor labour.

**Desired**
- Fewer language-related complaints in reviews (Service/Service Friendliness are the #1/#2 positive rating drivers — TrustYou).
- Better placement decisions: the right person on the right station.
- **Faster onboarding of each new hire** — this is the gain that converts turnover from an objection into a reason to buy.
- A credential the property can market.

**Unexpected**
- Retention improves *because* staff got a portable skill (AHLA lists skill/career development among the top five turnover levers).
- The exam becomes a **hiring screen**, saving recruiting time on every requisition.
- The certification becomes a listing/marketing asset.

### 3.5 VALUE MAP — buyer

**Products & Services (existing):** $50/employee placement exam; HR dashboard (overview, employees + detail, cohorts, reports); CSV/Excel/PDF export; chain roll-up (`/hr/org`); property switcher; per-property subscription; Master OS behind it.

**Pain Relievers**

| Reliever | Kills | Exists? |
|---|---|---|
| **Reposition the exam as a HIRING & PLACEMENT instrument, not a training investment** — 48.72% turnover means you hire constantly, so a 15-min, $50 English screen gets *more* valuable as turnover rises | **BP1 (the deal-killer)** | ❌ **positioning change, no code** |
| One link/QR per property; employee needs only a phone; no email, no password, no install, no IT | BP2, BP6 | ✅ built (`/e/[slug]`, `/i/[token]`) |
| "Su equipo completo evaluado en una semana, sin sacar a nadie de su turno" | BP2 | ❌ copy |
| **Weekly digest email to HR** so the buyer gets value without logging in | BP2, BP3 | ⚠️ Resend/SMTP listed as not shipped |
| Dashboard leads with **activation %** (who is actually practising), not enrolment | BP3, BSO2 | ⚠️ data exists; the framing/hierarchy doesn't |
| Written labour-compliance pack: voluntary opt-in language, on-property practice option, data-privacy statement, policy template | BP7 | ❌ missing |
| First purchase sized under the GM's discretionary limit (20 exams × $50 = $1,000) rather than a subscription needing the owner | BP4 | ⚠️ pricing exists; the *first ask* is wrong |
| Data-export + "you keep your data" clause | BP9 | ❌ missing |

**Gain Creators**

| Creator | Gain | Exists? |
|---|---|---|
| **"Mapa de inglés de la propiedad"** — one page, departments × CEFR levels, with named risk cells ("Recepción, turno nocturno: 3 de 4 en A1") | Required — this is the artefact that closes the first sale | ❌ **missing; highest-ROI thing to build** |
| Δ-CEFR per employee at 30/60/90 days **with a date-stamped before/after audio pair** | Expected + proof | ⚠️ data exists, artefact doesn't |
| ROI calculator anchored to a *published* elasticity: the buyer enters their own review score and ADR; we apply Cornell's +11.2%-per-point and cite it. **Never invent our own number.** | Desired, and satisfies Osterwalder's "quantify in dollars/percent/time" | ❌ missing |
| New-hire onboarding pack: exam day 1 → station placement day 2 → role drill set day 3 | Desired (BF2) | ❌ missing |
| Certification badge usable in marketing/OTA listing | Desired/Unexpected | Phase-3 vision item |

### 3.6 FIT VERDICT — buyer canvas

**The gap is not features. It is framing.** The dashboard, exports, cohorts and org roll-up already cover most required and expected gains. But the whole offer is currently framed as **training**, which collides head-on with the buyer's single most extreme pain (turnover). Reframed as **placement + proof + onboarding**, the same product turns that pain into the *reason to buy*: the more you churn, the more often you need a 15-minute English screen.

Second gap: everything requires the buyer to **log in**. The evidence says this buyer's time is the scarce resource. Value must be **pushed** (weekly digest, one-page map) not **pulled** (dashboard).

Third gap: no quantified claim. Osterwalder's rule is explicit — quantify in dollars, percentages or time. We have two publishable anchors and use neither: **11.2% price headroom per review point** (Cornell) and **up to 30% of annual comp per replacement** (AHLA).

---

## PART 4 — Where the two canvases COLLIDE

This is the section that matters most, and it is invisible if you draw only one canvas. Five conflicts; each needs an explicit decision, not a compromise.

**C1 — Measurement.** Buyer's #1 required gain is visibility. Learner's #9 pain is being watched and judged.
→ **Decision:** HR sees *level* and *activity*, never raw audio. Learner sees their own result **first, always**, before it is visible to HR. Publish exactly what HR can see, inside the product, in Spanish, on the first screen. This asymmetry must be a designed feature, not an accident of what we happened to build.

**C2 — Portable credential.** Learner desires a portable certificate. Buyer fears training people who leave.
→ **Decision:** make it **property-endorsed but employee-owned**, and sell that to the buyer as a *retention* lever — AHLA names skill and career development a top-five turnover trend and recommends structured programs and growth pathways. Don't hide the portability; monetise it.

**C3 — Effort.** Buyer wants more practice (more data, faster results). Learner wants less.
→ **Decision:** cap the daily loop at 5 minutes and **never give HR a lever to raise it.** Give HR a *coverage* lever (more employees, more departments) instead of an *intensity* lever. Coverage also happens to be the expansion path that drives NRR.

**C4 — The exam is asymmetric.** It is a required gain for the buyer and a moderate pain for the learner.
→ **Decision:** within 60 seconds of finishing, the learner must receive something of *personal* value — their level, their three phrases to fix, and one sentence about what it means for their station. The exam must pay the learner before it pays us.

**C5 — Payer ≠ user, and the user has zero obligation.** Revenue is 100% controlled by the buyer; retention is 100% earned from the learner.
→ **Decision:** run two separate funnels in innovation accounting. Learner funnel = invited → first session → **activated (≥3 sessions in week 1)** → day-30 retained. Buyer funnel = conversation → exam order → activation ≥ threshold → subscription → renewal. A pilot can pass one and fail the other, and the failure mode is completely different. `docs/PHILOSOPHY.md` §9 already names three metrics; this splits them correctly by segment.

---

## PART 5 — The competitive frame: why Duolingo is not the benchmark to beat, it is the benchmark to *reframe*

Primary source: Jiang, Peters & Pajak, **Duolingo Research Report DRR-23-01** (27 Feb 2023), *Reading and Listening Outcomes of Learners in the Duolingo English Course for Portuguese Speakers* — <https://duolingo-papers.s3.amazonaws.com/reports/duolingo-efficacy-english-reading-listening-whitepaper.pdf>

What the study actually says (all verbatim-anchored):
- **n = 92** learners who **completed** the Basic content (CEFR A2).
- Outcome measured: **reading and listening only** (STAMP 4S). Result: Intermediate High reading, Intermediate Mid listening on the ACTFL scale.
- **Speaking was not measured.** The report title and abstract are explicit: reading and listening.
- Reaching end-of-A2 requires **81 units**; "An average unit contains around 25 2-3 minute sessions."
- Participants were *excluded* if they took classes or used any other app.

**My derivation from those stated figures** (labelled as derivation, not a Duolingo claim):
81 units × 25 sessions × 2.5 min ≈ **5,060 minutes ≈ 84 hours** of study to reach **A2**. At the 5 min/day our learner will tolerate, that is roughly **2.8 years** — to reach A2, in a course whose measured outcomes exclude speaking.

Also note the study says nothing about **what fraction of starters ever reach unit 81**; it samples only finishers.

**The positioning this licences (all defensible):**
1. Duolingo's own published efficacy evidence is for **reading and listening**. Our buyer is buying **spoken guest interaction**. Different outcome variable — that is not a knock on Duolingo, it is a different product category.
2. Duolingo's unit of success is *the learner's streak*. Ours must be *the employee's shift performance*, verified by the employer.
3. Duolingo teaches general A2 English. Our vision doc claims ~300–400 functional phrases covers 95% of front-desk interactions. **That claim is currently unsourced and is itself a leap-of-faith assumption** — it should be validated by logging real guest interactions at a pilot property before it goes on a sales page.
4. The honest one-liner: *"Duolingo mide lectura y comprensión. Su recepcionista necesita hablar. Nosotros medimos lo que su huésped escucha."*

**Do not claim** we are "X times faster than Duolingo." We have no comparative study. What we can claim, with the citation, is that Duolingo's published A2 evidence does not measure speaking.

---

## PART 6 — Testing plan (Strategyzer funnel × our situation)

Evidence hierarchy to enforce: **what people say < what people do < what people pay.**

### Stage 1 — Test the circle (jobs/pains/gains)

**T1 · Buyer discovery, 15 interviews.** Not a pitch. Script: (a) list your top five operational problems this month, unprompted; (b) where does staff English rank; (c) tell me about the last guest complaint involving communication — what did it cost; (d) what have you tried, what happened; (e) who signs a $1,000 purchase and what does it require.
**Pre-registered kill criterion:** if fewer than 5 of 15 place staff English in their unprompted top three, the *segment* is wrong (pivot to resorts with higher international mix, or to chains), not the product.

**T2 · Learner behavioural test — the single most important experiment in this document.** At one hotel that agrees, hand 10 frontline staff a phone in the actual lobby/back-of-house and ask them to record a 20-second English answer. **Measure the refusal and whisper rate.** This validates or destroys the voice-first architecture in one afternoon. It tests P2 (can't be heard), which is the extreme pain no one has verified.

**T3 · Rescue-moment interview.** Ask 10 employees to narrate the last time they had to fetch a colleague. Count how many can recall it instantly and how they describe the feeling. Tests SO1/E1 — whether the social/emotional jobs are as extreme as this canvas asserts.

### Stage 2 — Test the square (which offering)

**T4 · Buy-a-Feature with 5 HR directors** across eight artefacts: property English map · Δ-CEFR report · before/after audio · activation dashboard · WhatsApp delivery · certification badge · new-hire onboarding pack · chain roll-up. Fixed budget, forced trade-offs. Tests mistake #5 directly — we currently ship all eight and lead with none.

**T5 · Landing-page test built from the canvas** (per Strategyzer's template): value-prop statement as headline, top 3 buyer pains bottom-left, top 3 gains bottom-right, single CTA. Two variants: **"capacitación de inglés"** vs **"evaluación y colocación de personal bilingüe."** This tests conflict C1/reframing directly, and the 1,071 existing SEO pages are the traffic source that makes it nearly free.

### Stage 3 — Test the rectangle (money)

**T6 · Charge for the exam first.** 20 employees × $50 = $1,000 — sized for a GM's signature, not the owner's. A signed order is the only strong evidence of problem–solution fit. `docs/PHILOSOPHY.md` §8 already says "Charge *something*"; this makes the first ask the exam, not the subscription.

**T7 · Pre-registered activation gate.** Before pilot #1 starts, write down the activation number that means the loop is wrong: **<40% of invited staff completing ≥3 sessions in week 1 = the learner value proposition failed**, and no amount of buyer-side selling fixes it. Writing it *before* is what makes it an experiment rather than a rationalisation.

---

## PART 7 — Priority stack (what to do differently, in order)

1. **Reframe the offer from *training* to *placement + proof*.** Zero code. Kills the extreme buyer pain (turnover) by turning it into the reason to buy. Test with T5.
2. **Build the "Mapa de inglés de la propiedad."** One page, departments × CEFR, named risk cells. This is the artefact that closes the first sale and it doesn't exist.
3. **Run T2 (the lobby recording test) before building any more voice features.** If frontline staff won't speak on camera-less audio in the workplace, the entire speaking loop needs a silent path.
4. **Ship the silent path anyway** (whisper-accepted or text fallback on every speaking step). Kills the #2 extreme learner pain at low cost.
5. **Ship "Antes / Ahora."** Same asset, two segments: learner delight + buyer proof. The audio is already stored.
6. **Fix the streak for shift work.** "Racha de turnos," not días; rest days pause it.
7. **Push, don't pull, for the buyer.** Weekly digest email so the buyer never has to log in.
8. **Publish the privacy contract in-product** — resolves conflict C1 and it's a differentiator no competitor bothers with.
9. **Build the ROI calculator on the Cornell elasticity**, with the citation visible. Never invent our own number.
10. **Split innovation accounting into two funnels** (learner activation, buyer conversion) per conflict C5.

---

## Source list

- Strategyzer, Value Proposition Canvas — <https://www.strategyzer.com/library/the-value-proposition-canvas> · template PDF <https://assets.strategyzer.com/assets/resources/the-value-proposition-canvas.pdf>
- Strategyzer, Value Proposition Design book summary — <https://www.strategyzer.com/library/value-proposition-design-book-summary>
- Strategyzer, 5 Common Mistakes — <https://www.strategyzer.com/library/5-common-mistakes-to-avoid-when-using-the-value-proposition-canvas>
- Strategyzer, Are Gains the Opposite of Pains? — <https://www.strategyzer.com/library/are-gains-the-opposite-of-pains>
- Strategyzer, Survival of the Fittest (three fits) — <https://www.strategyzer.com/library/survival-of-the-fittest>
- Strategyzer, Roadmap to Test Your Value Proposition — <https://www.strategyzer.com/library/roadmap-to-test-your-value-proposition>
- Strategyzer, Design an Experiment Connected to the VPC — <https://www.strategyzer.com/library/design-experiment-that-connects-to-your-value-proposition-canvas>
- Strategyzer, Value Proposition (definitions + "6 out of 10 ideas fail") — <https://www.strategyzer.com/value-proposition>
- Osterwalder, Business of Software talk (high-value-job test; "7 out of 10 flop") — <https://businessofsoftware.org/talks/jobs-pains-gains-designing-better-value-propositions-alex-osterwalder/>
- EF EPI 2025 Mexico fact sheet — <https://www.ef.com/assetscdn/WIBIwq6RdJvcD9bc8RMd/cefcom-epi-site/fact-sheets/2025/ef-epi-fact-sheet-mexico-english.pdf>
- Charles-Leija & Torres García (2022), *English Proficiency and Salary in Mexico*, Análisis Económico — <https://www.scielo.org.mx/scielo.php?pid=S2448-66552022000100167&script=sci_abstract&tlng=en>
- Hotel turnover, Guanajuato (67 HR managers; 48.72% annual) — <https://www.redalyc.org/journal/3312/331267304006/html/>
- AHLA + Actabl, *Turning Down Turnover* (Oct 2023) — <https://www.ahla.com/sites/default/files/Turning_Down_Turnover-10.16.23.pdf>
- Anderson (2012), *The Impact of Social Media on Lodging Performance*, Cornell Hospitality Report 12(15) — <https://scholarship.sha.cornell.edu/chrpubs/5/>
- TrustYou, categories most impacting hotel ratings — <https://www.trustyou.com/blog/insights/these-categories-are-most-positively-and-negatively-impacting-hotel-ratings/>
- Jiang, Peters & Pajak (2023), Duolingo Research Report DRR-23-01 — <https://duolingo-papers.s3.amazonaws.com/reports/duolingo-efficacy-english-reading-listening-whitepaper.pdf>
- Axonify Frontline Operations Report 2026 — <https://axonify.com/frontline-operations-report/>
- DataReportal, Digital 2025: Mexico — <https://datareportal.com/reports/digital-2025-mexico>
- Internal: `docs/PHILOSOPHY.md`, `docs/INVENTORY.md`, `.orcha/vision.md`

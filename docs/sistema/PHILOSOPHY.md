# Inglés Hotelero — Startup Operating Philosophy

*Our doctrine for building Latin America's hospitality-tech unicorn, drawn from Steve Blank's* **The Four Steps to the Epiphany** *and Eric Ries's* **The Lean Startup**, *applied without mercy to where we actually are.*

**Last honest assessment: July 2026.**

---

## 0. The one paragraph you must not forget

A startup is not a small version of a big company. It is a **temporary organization searching for a repeatable, scalable, and profitable business model** (Blank). Everything we do until we find that model is a *search*, not an *execution*. The way you search is not by building more — it is by running experiments that turn assumptions into facts (Ries). **We have been executing a plan we have not yet earned the right to execute.** We built a product for a customer we have not yet talked to, priced it at a number no one has yet paid, and marketed it to 1,000+ cities before closing a single hotel. This document exists to correct that — permanently.

---

## 1. The two books, distilled

### Steve Blank — Customer Development ("get out of the building")
The core insight: **product development and customer development are two different processes, and most startups die because they run the first and skip the second.** You cannot discover the truth about your market from inside your office. The facts are *outside*, with customers. Blank's four steps:

1. **Customer Discovery** — Turn the founder's vision into hypotheses, then test them face-to-face with customers. *Does the problem we imagine actually exist? Do they care enough to pay?* You are looking for **problem/solution fit**. You do not scale, hire, or spend here.
2. **Customer Validation** — Prove you have a **repeatable, scalable sales process**. Can you sell it again and again, the same way, to strangers? This is where you earn the right to grow. **Product/market fit lives at the end of this step.**
3. **Customer Creation** — *Now* you spend on demand generation. You pour fuel on a fire that is already lit.
4. **Company Building** — Transition from a search organization to an execution organization (departments, process, scale).

Blank's law: **you cannot skip a step, and you cannot fake one.** Building features is not progress; converting a hypothesis into a validated fact is progress.

### Eric Ries — The Lean Startup
Ries operationalizes Blank into a loop. The core unit of progress is **validated learning** — evidence that you are building something people want.

- **Build → Measure → Learn.** Build the smallest thing that tests an assumption, measure real behavior, learn, repeat. Minimize *total time through the loop*, not time spent building.
- **The MVP** is the smallest experiment that produces validated learning — often not a product at all (a landing page, a manual "concierge" delivery, a pitch). Its job is to *learn*, not to impress.
- **Leap-of-faith assumptions.** Every plan rests on two: the **value hypothesis** (do people find real value once they use it?) and the **growth hypothesis** (how do new customers find and adopt it?). Test these *first*, because everything else depends on them.
- **Innovation accounting.** Establish a baseline with real metrics, tune the engine toward the ideal, then decide: **pivot or persevere.**
- **Vanity vs. actionable metrics.** Vanity metrics feel like progress (page counts, commits, total signups) but don't inform decisions. Actionable metrics are per-cohort and causal (this change → that behavior).
- **Engines of growth.** Sustainable growth comes from one of three engines: **sticky** (retention > churn), **viral** (each user brings more users), **paid** (LTV funds CAC). Pick one, measure its specific loop.

**Where the two books agree, and it is the whole game:** *Stop guessing. Get in front of customers. Learn faster than you spend.*

---

## 2. The single hardest truth about Inglés Hotelero

We have world-class **execution** and almost no **validated learning**. In Blank's terms we behaved like a company (build, polish, deploy, market at scale) while we are still, in fact, a startup that has not completed **Customer Discovery**.

The evidence is not opinion — it's in our own system:

| Signal | Reality |
|---|---|
| Paying customers | **0** |
| Hotels that have used the product with real staff | **0** (only internal/test data) |
| Leads in the CRM | **7 — all still marked "new," uncontacted, some 6+ weeks old** |
| Product surfaces built | Exam, scoring, HR dashboard, Master OS, WhatsApp engine, Stripe scaffold, chain module, offline PWA |
| Marketing pages shipped | **1,071** |
| Validated pricing | **None** — $150/$300/$500 is a hypothesis no hotel has accepted |
| Validated channel | **None** — SEO is a bet, not yet a proven acquisition engine |

**Both Blank and Ries would say the same sentence to us:** *You are the textbook case of premature execution.* This is not a criticism of the work — the product is excellent and it is now a real asset. It is a diagnosis of **sequence**. We did steps 3 and 4 (creation, company-building: a 1,071-page demand-gen machine, a scalable multi-tenant platform) before finishing steps 1 and 2 (discovery, validation).

The good news: the cost of that inversion is already sunk, and the fix is cheap and fast. **The fix is to talk to hotels this week.**

---

## 3. Our leap-of-faith assumptions (still untested)

Everything rests on these. Until each has a green check from a real hotel, treat it as a guess.

**Value hypothesis** — *Once a hotel uses this, do they get enough value to pay and keep paying?*
- ⬜ Hotel GMs/HR believe weak staff English is a real, expensive problem worth a line item.
- ⬜ The $50 placement exam is compelling enough to say "yes" to on the first call.
- ⬜ Staff actually complete the daily 5-minute loop with real (not tester) motivation.
- ⬜ Measurable improvement appears fast enough (14–90 days) to justify renewal.
- ⬜ The HR dashboard is the artifact that makes a manager renew.

**Growth hypothesis** — *How does the next hotel find us, and does that repeat?*
- ⬜ Hotels search Google for "capacitación de inglés para hoteles en [city]" with buying intent (the entire SEO bet).
- ⬜ Or: the real channel is founder-led outbound / referrals / chain expansion — not search at all.
- ⬜ A won hotel expands (more departments, more properties) — the sticky/land-and-expand loop works.

We do not yet know a single one of these. **The next 90 days exist to convert these to facts.**

---

## 4. What we have built vs. what is actually missing

### Built (the asset — real and valuable)
- **Product:** placement exam (CEFR A1–B2), daily practice loop (listen/speak/reinforce/review, SM-2), AI scoring pipeline, WhatsApp delivery engine, HR dashboard, Master OS console, chain/multi-property module, Stripe billing scaffold, offline PWA. Multi-tenant, hardened (32 confirmed defects fixed), deployed live.
- **Content:** 60 role×level drills, 168 audio files.
- **Demand surface:** 1,071 SEO/AEO/GEO pages live at ingleshotelero.com, sitemap in Search Console, on-brand.

### Missing (the only things that matter now)
- **A single paying pilot.** The entire company is theoretical until one hotel pays.
- **Customer Discovery interviews.** We have never sat with a hotel HR director and heard, in their words, whether this problem ranks above their other fires.
- **A repeatable sales motion.** We cannot yet describe "how we close a hotel" as a process a second person could run.
- **Instrumented funnel + innovation accounting.** We cannot answer: of X leads, how many demo, pilot, activate, retain, pay? We have no baseline.
- **Proof staff will use it unpaid-for by us.** Test data ≠ a real hotel's staff choosing to practice.
- **The activated switches** (Supabase Pro, AI keys, cron, Twilio/Meta, Stripe, applied migrations) — the product cannot fully *deliver* until these are on. See `docs/` Operating Guide, Ch. 10.

**The imbalance in one line:** we are ~90% built and ~5% validated. Unicorns are not built by widening that gap; they are built by closing it.

---

## 5. Vanity vs. actionable metrics — for us specifically

**Stop celebrating (vanity):**
- Number of pages, commits, features, or lines of code.
- Total pageviews or impressions with no downstream conversion.
- "The product is done."

**Start counting (actionable, per-cohort, causal):**
- **Discovery:** # of real hotel conversations / week; % who rank staff English a top-3 operational pain.
- **Funnel:** lead → demo booked → pilot started → **activated** (staff actually practicing) → **paid**.
- **Value:** Day-14 staff completion rate; measurable CEFR movement; HR logins/week.
- **Retention:** month-2 and month-3 renewal; departments-per-hotel and properties-per-chain over time (the expand loop).
- **Economics:** CAC (founder time counts), gross margin, LTV, payback period.

A metric only counts if a bad number would change what we do tomorrow.

---

## 6. Our engine of growth (name it, then measure only it)

Hypothesis: our primary engine is **STICKY** (a daily habit + HR lock-in + certification switching cost), fed by a **PAID/SEO** top-of-funnel and amplified by **land-and-expand** inside chains.

- **Sticky loop to prove:** staff practice daily → HR sees measurable results → hotel renews → churn stays below new-department/new-property adds. The metric that matters: **net revenue retention > 100%.**
- **Paid/SEO loop to prove:** city page ranks → HR director with intent lands → books demo → converts, at a CAC the LTV can fund.
- **Do not** try to prove all three at once. In the pilot phase, **retention/activation (sticky) is the only engine that matters** — because growth on top of a leaky bucket is how startups die fast instead of slow.

---

## 7. The MVP we should have run — and can still run now

The Lean MVP for this business was never the platform. It was: **a one-page pitch + a manual "concierge" delivery to 3 hotels**, where we place staff, hand-send drills over WhatsApp ourselves, and hand-build the HR report in a spreadsheet. That tests every leap-of-faith assumption in two weeks with zero of the code we wrote.

We skipped it. **That's fine — we can run it now, and we have an unfair advantage: the "manual" version is already automated.** So our MVP experiment today is simply:

> Get **3 hotels** to run a real **14-day pilot** with real staff, and watch — with our own instrumentation — whether they activate, improve, and say "yes" to paying.

That is the whole job. Nothing else we could build matters more than those 3 pilots.

---

## 8. The next 90 days — a search plan, not a build plan

**Days 1–7 — Turn the machine on + get out of the building.**
- Flip the activation switches (Supabase Pro, AI + cron keys, Twilio, apply migrations 0012/0013, rotate secrets). The product must actually *deliver* before a pilot.
- **Call all 7 leads today.** Then line up 15–20 more hotel conversations (SMA is your backyard — start there, in person).
- Interview goal (Discovery): *not* to pitch. To learn: How do you handle guests who only speak English today? What has it cost you (a bad review, a lost booking)? What have you tried? Would you notice if your team got measurably better? Rank this against your other problems.

**Days 8–30 — Sign 3 paying (or paid-intent) pilots.**
- Convert the warmest conversations into 14-day pilots with a *named* success metric agreed up front ("by day 14, X% of your front desk completes daily practice and we show CEFR movement").
- Charge *something* — even the $50 exam. Free pilots validate nothing about willingness to pay.
- Instrument everything: activation, completion, HR engagement. This is your baseline (innovation accounting).

**Days 31–60 — Learn, then pivot or persevere.**
- Run the pilots. Watch the actionable metrics. Sit with the HR user weekly.
- **Persevere** if: staff activate, HR logs in, results show, and at least one hotel says "I'll pay to continue." Then write down *exactly how you closed them* — that's the seed of Customer Validation.
- **Pivot** if the numbers are flat. Candidate pivots to hold in reserve: zoom-in (just the exam as a hiring tool), customer-segment (chains vs. independents; resorts vs. business hotels), channel (outbound vs. SEO), or model (per-employee vs. per-property).

**Days 61–90 — Prove repeatability (enter Customer Validation).**
- Close pilots #4–#8 using the written playbook, ideally without inventing a new pitch each time.
- If you can close strangers the same way twice, you are approaching **product/market fit** — the moment the whole company changes gears.
- *Only then* does the 1,071-page SEO engine become the fuel it was built to be. (It's not wasted — it was built early; it becomes an asset the day you have a proven funnel to pour it into.)

---

## 9. Innovation accounting — the scoreboard

Keep one dashboard (Master OS is the natural home). Three numbers per cohort of hotels:

1. **Activation rate** — % of a hotel's staff who complete practice ≥3 days in week 1.
2. **Value signal** — measurable CEFR movement + HR logins by day 14.
3. **Conversion** — pilot → paid.

Set a baseline from the first 3 pilots. Every product or sales change is judged by whether it moves these. If three consecutive cycles don't move them, **pivot** the assumption that isn't holding.

---

## 10. The road to a Latin American unicorn (grounded, not hype)

Unicorns are made in Blank's **step 4**, but they are *decided* in steps 1–2. The sequence that gets us there:

1. **Search (now → ~6 mo):** 3 → 10 → 25 paying hotels. Prove the sticky engine (NRR > 100%) and a repeatable close. *This is the only phase that matters right now.*
2. **Execute (6–18 mo):** With product/market fit proven, turn on the demand machine (the SEO pages, outbound, partnerships with hotel associations). Land-and-expand inside chains — one property becomes twenty on one contract. This is where the per-property model and the chain module earn their keep.
3. **Moat (18–36 mo):** The vision's Phase 3 — the **"Propiedad Certificada en Servicio Bilingüe"** program and the talent-intelligence data layer. The data (who can actually work in English across LatAm hospitality) is the defensible asset no competitor can copy, and the certification is the switching cost that makes churn structural.

**The unicorn math to keep honest:** LatAm has hundreds of thousands of hotels; hospitality is a top employer and English is a hard revenue lever (ADR, reviews, direct bookings). A per-property SaaS at $150–$500/mo with strong NRR and chain expansion is a credible nine-figure-revenue path *if and only if* the retention and expansion loops are real. Everything above is in service of proving they are.

---

## 11. Our creed (print this)

1. **We are searching, not executing, until a stranger pays us twice the same way.**
2. **Get out of the building.** The truth is with hotels, not in the repo.
3. **The most valuable thing we can build this week is a conversation with a customer.**
4. **A metric only counts if a bad number changes tomorrow's plan.**
5. **Charge early.** "Free" teaches us nothing about value.
6. **Fall in love with the problem (a hotel losing a guest to language), not our solution.**
7. **Ship to learn, not to impress.** Minimize time through Build-Measure-Learn.
8. **Retention before growth.** Don't pour fuel on an unlit fire.
9. **Write down how we win** the moment we win once — that repeatability *is* the company.
10. **We already have the product. Now we have to earn the customer.**

---

*If reading this doc makes us want to open the code editor, we've missed the point. It should make us pick up the phone.*

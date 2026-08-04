# Actionable Gamification — Yu-kai Chou
## Mined for Inglés Hotelero's learning system

Source file: `scratchpad/corpus/actionable-gamification.txt` (6,012 lines, OCR of the print edition).
Note: the scan **begins at Chapter 3**. Chapters 1–2 (the "PBLs are lipstick" polemic) are absent; the
Level II Octalysis book (the dedicated 4-Phases volume) was never written at time of publication — Chou
repeatedly forward-references "Chapter 20" and a sequel that does not exist in this text. Everything on
the Experience Phases below is assembled from ~25 scattered passages plus the two worked audits
(Facebook, Waze) in Ch.16. Anchors are given as `Ch.N` plus line numbers in the corpus file.

---

## 0. The big idea, stated plainly

**Human-Focused Design, not Function-Focused Design.** Chou's whole thesis (Ch.3, L72–92; Ch.4, L649–664):
every product team can tell you *what a user can do*. Almost none can tell you *why the user would do it*.
Games are the only industry that had to solve motivation as a survival problem, because **nobody has to play
a game** — the second it stops being engaging, the player leaves. Work, taxes, and mandated corporate
training all run on what he calls **"tainted motivation"** (Ch.15, L4693–4696): people comply, so designers
never learn whether the experience is actually motivating.

**This is the single most important sentence in the book for us.** Inglés Hotelero is mandated training.
Our learners are on *tainted motivation* from minute one. Every engagement metric we collect is inflated by
compulsion, and the moment the mandate softens (the GM stops asking, the manager rotates out, the pilot
ends), usage will collapse to whatever the real motivation was. **We must design as if the app were
voluntary, because at renewal time it effectively is.**

The framework: **8 Core Drives**, arranged on an octagon where position is meaning.
- **Left side = extrinsic / goal-oriented** (CD2, CD4, CD6). **Right side = intrinsic / process-oriented** (CD3, CD5, CD7).
- **Top = White Hat** (CD1, CD2, CD3) — make you feel powerful, fulfilled, in control. **Bottom = Black Hat**
  (CD6, CD7, CD8) — make you feel obsessed, anxious, addicted. Very effective; leaves a bad taste.
- CD4 and CD5 sit in the middle and can go either way (Ch.14, L4626–4640).
- Hidden **9th drive: Sensation** — physical pleasure (Ch.3, L192–204). Excluded because it's physical not
  psychological, but explicitly acknowledged.

Corollary he repeats a dozen times: **if none of the 8 Core Drives is present behind a Desired Action, there
is zero motivation and no behavior happens** (L91, L432, L4002–4004).

---

## 1. The 8 Core Drives — mechanism, evidence, and our reading

### CD1 — Epic Meaning & Calling (White Hat, top)
*You are doing something bigger than yourself, and/or you were chosen.*

**Mechanism.** Not about what makes you feel good; about seeing yourself as a character in a grander story
(Ch.5, L768–771). Turns passive users into evangelists who **forgive your product's failures and rush to fix
them for you** (the Waze traffic-monster story, L854–868: when Waze routed him wrong, he panicked to go fix
the map rather than delete the app).

**Evidence.**
- Wikipedia: obscenity edits removed in **1.7 minutes average** (MIT study, L772). Editors are **9× more likely
  to donate money** than pure consumers — 28% vs 3% — and **80% of editor-donors have donated 5+ times** (L774).
  People will pay to do the unpaid grunt work when the meaning is right.
- Apple's "1984" and "Think Different": the first rule of Think Different was **no products in the commercials**
  (L847). $150M in earned airtime; $155M of Macs sold in three months (L817).
- Zamzee: kids given fantasy quests ("run the stairs 15 times to learn your first spell") **move 59% more**
  than kids who don't (L935). The narrative is *disconnected from the action* and it still works.
- Chinese 孝 (xiào) as parenting-scale Epic Meaning (L883–918).

**Techniques.** Narrative (#10), Humanity Hero (#27), Elitism (#26), Beginner's Luck (#23), Free Lunch (#24).

**Weaknesses, stated by Chou (L998):** (a) **believability** — a gas company saying "pumping with us protects
the planet" *insults* people (L990); (b) **no urgency** — "go change the world today!" gets you "yes, right
after breakfast" (L4412). CD1 alone always produces intenders, never doers.

**IH reading.** We are sitting on a *true* Epic Meaning we are almost certainly under-using, and we are one
copy decision away from an *insulting* one.
- **Insulting framing (avoid at all costs):** "learn English so you can serve foreign guests better," "so the
  hotel gets better reviews." That subordinates the learner to the guest and to the employer. It is the gas
  company ad. It will be read as condescension, which is the exact thing the design system forbids.
- **Believable framing (use):** *"Tu inglés es tuyo. Nadie te lo puede quitar."* — the skill is portable
  property that outlives this job (this is also CD4). And: *"Eres la primera cara de México que ve ese
  huésped."* — dignity and national representation, which is real and felt, not manufactured.
- **The Waze move for us:** Onboarding should be a single image/screen with a named antagonist, not a text
  wall. Waze's monster was "Traffic." Ours is **"El momento en que te quedas callado"** — the freeze. The
  community is beating the freeze together. This is one screen, ~15 seconds, and it reframes the entire
  mandate from "the hotel is testing me" to "we're all beating this thing."

### CD2 — Development & Accomplishment (White Hat, left/extrinsic)
*Progress, skill, mastery, overcoming challenge.*

**Mechanism.** "A badge or trophy **without a challenge** is not meaningful at all" (L100). Games are
"unnecessary obstacles we volunteer to tackle" (McGonigal/Suits, L1034–1042). The Win-State is the unit.

**Evidence.**
- **Betty Crocker**: the mix was *too easy*; they **removed powdered egg and made bakers add a real egg**, and
  sales broke out (L1098–1100). Adding a step increased accomplishment.
- **eBay**: Yellow Star at 10 sales — Chou printed the certificate and kept it on his dorm wall for years
  (L1076–1083). Buyers aren't purchasing, they're *winning*: "you are paying to play" (L1093).
- **LinkedIn progress bar**: a few developer-hours, **+20% profile completeness**, after millions spent on the
  same goal (L1316).
- **Never make users feel dumb.** "If a user spends four seconds on an interface and can't figure out what to
  do, they feel stupid and will start to disengage emotionally" (L1189). Google vs Yahoo!/Google+ (L1190–1217).
- **Candy Crush's Glowing Choice** deliberately suggests a *suboptimal* move: "feeling a sense of progress and
  ultimately losing is much better than feeling stuck and confused" (L1219–1220).
- **Achievement Symbols must symbolize achievement.** The "Clicked On My First Button Badge" is *insulting*
  (L1356–1361). Military badge analogy. Crucially: **"some of those 'insulting badges' do work great for
  children, because as small children, these are actual feats"** (L1368–1370).
- **Leaderboards, done wrong, demotivate.** Foursquare newbie sees Mayor at 250 check-ins → gives up (L1402).
  Fixes (L1406–1413): (1) **position the user in the middle** — show the person just above and just below;
  (2) **group leaderboards** — nobody wants to be the one dragging the team down; (3) **weekly resets**;
  (4) **micro-leaderboards** among friends/similar people — "top 5 of 22" not "95,253 of 1,000,000."
  Jane McGonigal's **Urgent Optimism** is the target state.
- **Status Points communicate your values.** Chou made *commenting* on his blog worth 100 pts and
  *tweeting* 10, deliberately, because point weights tell users "is this a game worth playing?" If you
  reward the things that only benefit you, users conclude the game is shallow (L1382–1394).

**IH reading.** This is the drive we are already touching (streak, level chips, CEFR) and the one where we
are most likely to accidentally insult an adult.
- Our learner is an adult professional who **may already be embarrassed about their English**. Chou's
  children-vs-adults badge distinction is a direct hit on our biggest risk. **Any badge that celebrates mere
  attendance is condescension.** "¡Completaste tu primer día!" is the Clicked-My-First-Button badge.
- **The placement exam is currently a CD2 landmine.** Telling a nervous adult "eres A1" is a *loss* framed as
  a result. It is the demoralizing opposite of a First Major Win-State. Rewrite results as an inventory of
  *what they already can do* ("ya manejas 14 frases de recepción; te faltan 6 para el turno completo"),
  with the CEFR letter present but subordinate — and never as the headline.
- **The 4-second rule and the Glowing Choice apply literally.** On a mid-range Android in a break room, every
  screen must have exactly one obvious next action. Adopt **Desert Oasis** (#38 — clear everything else away)
  for the practice runner and **Glowing Choice** (#28) for the home screen.
- **Point weights are a values statement.** If we ever add points, do *not* weight "invite a coworker" or
  "share to WhatsApp" highest. Weight **speaking out loud** highest. That tells the learner what game
  this is.
- **Never ship a global leaderboard.** If HR asks (they will), give them: micro-leaderboard within the
  learner's own shift/role (~10–25 people), weekly reset, and a **group** number for the property.

### CD3 — Empowerment of Creativity & Feedback (White Hat, right/intrinsic — the "golden corner")
*Repeatedly figuring things out, trying combinations, seeing results, adjusting.*

**Mechanism.** The **only** drive that produces **Evergreen Mechanics**: "the game designer no longer needs to
continuously add additional content to keep the activity fresh… The brain simply entertains itself" (L104,
L1509). This is *the* answer to the Endgame.

**Evidence.**
- **Chess vs Tic-Tac-Toe** (L1510–1561). Tic-Tac-Toe dies because creativity is bounded. Chess survives
  centuries because a 40-move game has ~10^120 variations — and, critically, because **there is no single
  best way to win**: aggressive, positional, squeezing styles all reach the Win-State.
- **Starcraft** as a national sport in Korea a decade after launch; 100k-seat stadiums; QMUL/UCL study shows
  ~1hr/day for 6–8 weeks improves memory, visual search, informational filtering (L1508).
- **Draw Something died** (L1654–1659): 35M downloads in 7 weeks, sold to Zynga for ~$200M, then collapsed
  because (a) they stopped adding words so the same prompts repeated, (b) too many concurrent games turned
  play into obligation, (c) players "gamed" it by drawing the letters — **"if you block users from expressing
  their creativity in ways that are beneficial for the ecosystem, they will use their creativity to find
  loopholes."**
- **The Piano Staircase** (+66% stair use) is explicitly called out as **bad Endgame design** (L1611): great
  feedback, almost no creative range, so novelty dies.
- **Pokémon/Magic memorization**: children memorize *more data than the periodic table* — every card's stats
  and every counter-relationship — and cannot name the 5th element. "This gaping difference is not a
  transition in intelligence but simply a change in motivation" (L1568–1586).
- **Autonomy pays**: Cornell study of 320 small businesses — the autonomy half grew **4× faster with 1/3 the
  turnover** (L1626).
- **Meaningful Choice test (L1745–1752):** 100 users, one path to the Win-State = zero meaningful choice.
  Three clusters = some. All 100 different = optimal (the Lego test).

**Techniques.** Boosters (#31), Milestone Unlock (#19), Meaningful Choices / "Plant Picker" (#11), Choice
Perception / "Poison Picker" (#89), Refreshing Content (#73).

**Weakness.** Hardest drive to implement; demands attention that an attention-poor audience won't give;
therefore Chou says CD3 lands best in **Scaffolding and Endgame, not Discovery/Onboarding** (L1792–1797).

**IH reading — this is our #1 unsolved problem and our #1 opportunity.**
- **The Pokémon finding is the most important learning-science claim in the whole book for us.** Rote
  vocabulary volume is not the obstacle; motivation for the vocabulary is. Kids memorize hundreds of cards
  *because they need them to build strategies against friends*. We should stop treating vocabulary as
  content-to-deliver and start treating it as **equipment the learner selects to solve situations**.
- **The Plant Picker maps directly onto hotel English.** A guest situation is a "level." The learner has a
  small deck of phrases (the "plants"). Multiple phrase combinations resolve the same situation — polite
  vs. fast, apologize-first vs. offer-solution-first, formal vs. warm. Grade on *whether the guest is
  handled*, not on matching one canonical answer. This is what makes it evergreen: 40 phrases combine into
  hundreds of viable responses. **This is the single change that converts us from Tic-Tac-Toe to chess.**
- **Rewards must be Boosters, not badges** (L2937, L2481, L5921): "the most effective rewards are often
  Boosters that allow the user to go back into the ecosystem and play more effectively." For us: a *frase
  comodín* they can deploy in a hard scenario, a slow-audio unlock, a "pista" token, an offline pack for a
  data-less week, the right to hear a native-speed version. Never a trophy that does nothing.
- **Milestone Unlock (#19) — the stopping-point trick.** Plants vs. Zombies gives you the plant that would
  have made the level you just beat easy, right as you're about to quit (L1704–1708). For us: end the daily
  drill by *revealing* the new phrase/power the learner just earned and letting them try it once — not by
  showing a completion screen. Our `/practice/done` page currently ends flat on a streak count; it should
  end on an unlock the learner is itching to use tomorrow.
- **Draw Something is our warning label.** If we ship a fixed drill library and stop authoring, we will
  repeat their collapse exactly. Evergreen mechanics are cheaper than a content treadmill.

### CD4 — Ownership & Possession (Left/extrinsic, dual-hat)
*I own it, therefore I want to improve, protect, and get more of it.*

**Mechanism + evidence.**
- **Endowment Effect.** Duke basketball tickets: winners demanded **$2,400** on average to sell; non-winners
  who did identical work offered **$170** — a **14×** gap (Ariely/Carmon, L1918–1920). Pens vs chocolate:
  only 10% would trade (Knetsch, L1926–1929). Merely being top bidder longer → more aggressive bidding
  (L1930–1931).
- **IKEA Effect** (Norton/Mochon/Ariely, L2041–2043): people love the furniture they assembled more than the
  expensive furniture they didn't. Hence **Build-From-Scratch (#43)**.
- **Collection Sets (#16)** are the strongest CD4 lever. Geomon Four-Season Deer: capturable only in the real
  calendar season, so completing the set took 3–6 months; players traded rare pets and spent real money for
  deer that **weren't even powerful** (L2056–2063). Key operating principle (L2075–2077): **"When you give
  users rewards, don't just give them physical items directly, for those generally have less motivational
  longevity. More often, giving them collection pieces will result in longer-term engagement."**
- **Monitor Attachment (#42)**: Google Analytics is "the biggest motivator that fuels the blogosphere"
  (L2107–2119) — a lonely blogger with 3 visitors keeps going because they're watching the number, and
  watching leads to experimenting (CD4 → CD3).
- **Alfred Effect (#83)**: the system knows you so well you can't imagine switching (L2121–2162). Waze at 6pm
  asking "home?"; 8pm Wednesday asking "gym?"
- **Identity & consistency**: 482 dentists named Dennis vs ~257 Walter / 270 Jerry — **+80% base rate**
  (Pelham, L1955–1959). Foot-in-the-door: tiny "BE A SAFE DRIVER" sticker → **76% vs 17%** accepted the
  giant billboard two weeks later (Freedman & Fraser, L1982–1997). Writing a commitment down makes people
  far less likely to revise it (Deutsch & Gerard, L2006–2010). Restaurant no-shows fell **30% → 10%** by
  changing "Please call if you have to cancel" to "**Will you** please call if you have to cancel?" (L2017).

**IH reading.**
- **Ownership is our best answer to the mandate problem.** In a B2B forced-adoption context, the employee's
  question is "what's in this for me, not the hotel?" CD4 answers it: *the skill, the certificate, the
  recording archive, and the phrasebook are yours and portable.* Make that structurally true and visible.
- **Build-From-Scratch during onboarding.** Do not hand a fully-configured profile. Have the learner pick
  role, shift, hotel type, and the guest nationalities they actually deal with, and then **assemble their own
  phrasebook** from the drills they complete. Caveat from Chou (L2044–2046): Build-From-Scratch must not
  delay the **First Major Win-State** — so keep it to ~3 taps with sane defaults, or make the setup itself
  feel like a win.
- **Collection Sets beat badges and beat the certificate-at-the-end model.** Do not award "certificación B1"
  as one lump at the end. Award **8 situation cards of "El check-in completo"**; the learner gets 3 quickly
  and the set-completion pressure does the rest. This also solves a business problem: it gives every learner
  something at every session without giving away the expensive thing.
- **Monitor Attachment for a learner who feels like they're not improving.** Language progress is invisible
  week to week and that is the classic dropout cause. Give them a chart they can stare at: words retained,
  seconds spoken, situations covered, pronunciation trend. Chou's point is that **watching the number
  produces experimentation** — the learner starts inventing ways to move it.
- **Alfred Effect is cheap and we already have the data.** Shift-aware triggers ("son las 6:40, antes de tu
  turno de las 7"), role-aware scenarios, and drills that remember which three words they keep missing.
  This is also our anti-churn moat: a competitor's generic app cannot know their shift.
- **Commitment device on day one.** Have the learner *type* (not select) one sentence: "Quiero aprender inglés
  para ____." Written, self-authored commitments resist revision. Cost: one input field.
- **Ethical line (Chou draws it himself, L5818–5819):** he refuses to build a Sunk Cost Prison into his own
  product — "If I am not delivering awesome value to my users, I don't feel comfortable collecting a single
  dollar." Build **White Hat sunk cost** (their recordings, their phrasebook, their certificate — all
  exportable) rather than hostage-taking.

### CD5 — Social Influence & Relatedness (Right/intrinsic, dual-hat)
*Mentorship, acceptance, feedback, companionship, competition, envy, relatedness.*

**Mechanism + evidence.**
- **Mentorship (#61) is the standout technique in the entire book.** Chou planned 2 hours in Parallel Kingdom;
  a human mentor teleported in, gave him gear (+7 sword vs his +2), took him through dungeons, and he played
  **two months**. Three distinct hooks fired in sequence (L2240–2261): (1) curiosity about who the mentor is;
  (2) *obligation* — "if I quit now, I'd be wasting the gear he gave me"; (3) *envy with a visible path* —
  "I wish I could be like that one day."
  - Explicit warning (L2254–2256): **"When you design an environment where people are prone to be envious of
    others, you want to make sure there is a realistic path for them to follow… Otherwise you will simply
    generate user denial and disengagement."**
  - **Mentorship is also the best-documented Endgame mechanic**: "the Endgame is the most neglected and one
    of the hardest phases to optimize. Good mentorship design in the Endgame makes veterans feel as if
    they've worked hard enough to prove their status" (L2458).
  - The **worked eCommerce example** (L2461–2482) is a template we can lift wholesale: veterans toggle
    "available to mentor," newbies get routed to them instead of to support; veterans get **Boosters** as
    compensation; company saves support cost; newbies bond to the community; veterans get status.
- **Social norming is dangerous in both directions.**
  - **Petrified Forest**: no sign = **3%** theft; "many past visitors have removed the wood" (negative social
    norm) = **7.9%** — the sign *increased* theft **160%**; "please don't remove the wood" = **1.67%**
    (L2297–2307). The Keep America Beautiful "Back by Popular Neglect" campaign backfired the same way.
  - **Hotel towels** (directly relevant to us): "75% of guests reuse their towels" → **+25% reuse**; and
    "nearly 75% of guests **who stayed in this room**" performed **even better** — relatedness specificity
    multiplies the effect (L2328–2334).
  - **oPower**: neighbor-comparison charts cut consumption **10%** vs <3% for money/greenhouse-gas/civic-duty
    messages (L2339–2344); 2.6 TWh saved across 16M households (L2623). But: **top performers regressed
    toward the mean** until oPower added smiley faces to reward being above average (L2628–2633).
- **Workplace competition mostly backfires** (Ch.9, L2366–2427). GE Rank-and-Yank: "everyone hired people
  weaker than themselves"; Microsoft stack ranking — "every current and former Microsoft employee I
  interviewed — every one — cited stack ranking as the most destructive process inside of Microsoft."
  Basketball **assists**: high-assist NBA teams win ~72% of games; measure the collaborative stat and you get
  collaborative play.
  - Mario Herger's conditions where competition **works**: mastery-oriented, gain-oriented, even matchups,
    players care about the team, players care about the competitors (friends, not strangers).
  - Where it **fails**: **learning-focused environments**, prevention-oriented mindsets, when creativity is
    required, when the matchup is skewed.
  - **Note the first item on the fails list. We are a learning-focused environment.**
- Other techniques: Group Quests (#22 — WoW 40-player raids, Groupon's whole business model), Social
  Treasures (#63 — only a friend can give it to you; the real-world example is a *vote*), Social Prods (#62 —
  LinkedIn Endorsements are *engineered to be meaningless and effortless*, L2578–2597), Brag Buttons (#57 —
  fire them only at Major Win-States), Trophy Shelves (#64), Conformity Anchors (#58), Water Coolers (#55 —
  **do not launch a forum into an empty room; an empty forum is negative social proof**, L2650).

**IH reading — CD5 is our largest untapped drive and it is culturally native to our market.**
- **Hotel work is already a high-relatedness environment**: shifts, cuadrillas, departments, a break room.
  Duolingo cannot access any of it. This is a structural advantage we are currently ignoring entirely.
- **Build peer mentorship, and build it as a product feature the buyer pays for.** The learner who reaches
  B1 becomes a *padrino/madrina* for a new hire. Chou's four benefits map 1:1: (1) the new hire gets a
  relatable helper instead of an app; (2) the veteran gets a genuine, *earned* status; (3) it is a real
  Endgame; (4) it cuts our support and the hotel's onboarding cost. **And it is a killer B2B pitch: "your
  best people become your trainers."** Compensate mentors in Boosters + real recognition, not cash (see the
  Market Norms trap in §2).
- **Conformity Anchor copy must be hyper-local.** Copy the "this room" finding: *"8 de cada 10 botones del
  turno matutino de tu hotel ya practicaron hoy."* Never *"10,000 usuarios en todo el mundo."*
- **The Petrified Forest sign is a live risk in our HR product.** If our reports or nudges ever tell
  employees "solo el 34% del equipo completó su práctica," we will *reduce* completion. Low-participation
  numbers go to the buyer's dashboard only, phrased as an action item; employee-facing copy must anchor on
  whoever *is* participating, or on the sub-group where participation is high.
- **oPower's regression finding**: when a learner is top of their shift, comparison stops motivating and they
  coast. Give above-average learners a distinct positive signal (mentor invitation, harder tier) rather than
  a rank.
- **Group Quest at the property level.** "El turno completa 40 prácticas esta semana → se desbloquea X." This
  is the correct shape for our B2B buyer's competitive instinct: **collaborative** (assists), not
  **individual rank** (stack ranking). Explicitly refuse individual leaderboards across a property.
- **Social Treasure over WhatsApp.** A phrase card that only a *compañero* can send you, at no cost to them.
  This is native to WhatsApp, costs us nothing, and generates the peer trigger we can't otherwise buy.
- **Do not build a forum.** Chou is explicit: forums don't create community, they let an existing community
  mingle, and an empty one is actively harmful. Our "water cooler" should be the existing WhatsApp group,
  not a feature we build.

### CD6 — Scarcity & Impatience (Black Hat, left/extrinsic)
*I want it because I can't have it yet.*

**Mechanism + evidence.**
- Cookie jar experiment (Worchel/Lee/Adewole 1975, L2790–2798): identical cookies rated higher when only 2
  remained; and value tracks **relative change**, not absolute level.
- Geomon's Mozzy and Laurelix — geo/temperature-gated monsters, **not** the most powerful ones, drove the
  strongest desire and monetization; Chou himself, 7 months after quitting, thought "I wonder if I could
  catch a Laurelix here" in a hot country (L2730–2786).
- Infomercial line change: "Operators are waiting, please call now" → **"If operators are busy, please call
  again"** — perceived scarcity beats convenience (L2815–2824).
- Price as a value cue: turquoise jewelry sold out after the price was accidentally **doubled** (Cialdini,
  L2880–2885); Chou bought the $49.99 knee brace over the $24.99 without reading either label (L2891–2907).
- **Magnetic Caps (#68)**: "Limit 12 per person" increases purchase **30%–105%** vs "No limit per person"
  (Wansink, L2972–2973). Method: find the current upper bound of the behavior (e.g. 90% of users pick <5
  hobbies) and set the cap there — perceived scarcity without real constraint. Power users unlock a higher
  cap but always still face one (L2978–2981).
- **Appointment Dynamics (#21)**: happy hour; garbage truck Tuesday. **eMart "Sunny Sale"**: a sculpture whose
  noon shadow forms a scannable QR code — usable only 12–1pm — **+25% lunchtime sales** (L2998–3005).
- **Torture Breaks (#66)**: Candy Crush's 25-minute life timer; social games that cut you off at will.
  The design insight (L3014–3020): if the player would naturally stop satisfied at 3 hours, cut them off at
  **2h59m** so they spend the day thinking about the last minute. Twitter's **Fail Whale** functioned as an
  accidental Torture Break and increased obsession (L3030–3057).
- **Dangling (#44) + Anchored Juxtaposition (#69)**: show the thing they can't have; then offer *two* paths —
  pay, or perform a large number of Desired Actions. **Dropbox** is the canonical case: invite friends **or**
  pay; most do the actions first and pay eventually, so the company gets both (L2942–2947). Critically: with
  only one option ("pay or go away") users go into **denial mode** and leave (L2938).
- **Evolved UI (#37)**: interfaces are "too complex during Onboarding, while too basic for the Endgame"
  (L3059). WoW starts with a handful of buttons and ends as a wall of panels. Sony shipped this as
  "Evolution UI" for Android. Gmail Labs is a mini-version. Chou notes clients emotionally resist withholding
  features (L3079).
- **Denial mode is the failure state.** If the goal looks impossible, CD6 flips into an **Anti Core Drive**:
  "Who cares about a bunch of stuck up, spoiled brats" (L2922–2927). Always show a realistic path.

**IH reading.**
- **Appointment Dynamics is the single best fit between this book and our learner's life.** Shift workers have
  hard temporal anchors that a consumer app doesn't get. Fire the daily WhatsApp trigger at
  **T-20 minutes before their shift starts**, not at a global 8pm. Their day already has an alarm; attach to it.
- **Magnetic Cap the daily practice — deliberately cap it.** This is counterintuitive and I am confident it is
  right. Today an eager learner can presumably keep going. Capping at ~2 drills/day (a) protects the daily
  return loop, (b) preserves scarcity, (c) fits the 5-minute promise, (d) *saves their data plan*, and (e)
  prevents burn-through of a finite content library. Power users unlock a 3rd; the cap never fully disappears.
- **Evolved UI is both a motivation win and an engineering win for us.** Our learner has a mid-range Android
  with limited storage on a prepaid plan. Ship an initial UI with **one button**, unlock features as
  Win-States land. Smaller initial payload, less decision paralysis, more Milestone Unlocks. This is a rare
  case where the motivational and the technical arguments point the same way.
- **Anchored Juxtaposition for the certificate.** "Obtén la constancia oficial: completa 60 prácticas **o**
  paga $X." Whether or not we ever sell it to the learner, presenting both paths makes the free path feel
  chosen rather than assigned — and it's the Dropbox pattern that made both conversions happen.
- **Price the B2B product with confidence.** Chou's whole pricing section (L3109–3119) says the same thing our
  own strategy notes say: buyers who don't buy usually don't perceive value, not price. The $150–$500/mo
  ladder is probably *under*-priced for a chain if the alternative framing is "the cost of one bad review."
- **Careful:** CD6 is Black Hat. Torture Breaks on a *learning* product for a tired worker will read as the
  app being broken, not as suspense. Use Appointment Dynamics and Magnetic Caps (soft, predictable) and
  **avoid** Torture Breaks and life-timers entirely.

### CD7 — Unpredictability & Curiosity (Black Hat, right/intrinsic)
*I don't know what happens next.*

**Mechanism + evidence.**
- Skinner Box, correctly attributed: the lever-pressing obsession comes from **variable reinforcement**, not
  from points and badges — the animal presses **whether or not it's hungry** (L3243–3261). Chou is pointed
  about this: critics blame PBLs for "Skinner Box" design, but the Skinner Box is purely CD7.
- We are more engaged when winning is *possible* than when it is *certain* (L3240–3242). Casino: "I lost
  $200 but I had so much fun" — they bought the *intrinsic joy of possibly winning* (L4053).
- **Glowing Choice (#28)**: WoW's exclamation points; "never allow your users to accidentally stumble upon a
  bad experience"; **4-second rule**; "users should have to think hard and decide **not** to take the Desired
  Action" (L3492–3504).
- **Mystery Boxes / Random Rewards (#72)**: unexpected *reward* on an expected *trigger*. **Easter Eggs /
  Sudden Rewards (#30)**: reward on an *unexpected* trigger. Chase Picks Up The Tab; the Foursquare
  "#ThankYouSteve" badge that Mario Herger still talks about years later (L3537–3568).
- **Lottery / Rolling Rewards (#74)**: somebody must win each period. **Taiwan's Uniform Invoice Lottery** —
  every receipt is a lottery ticket, so consumers demand receipts and tax evasion collapses; **+75% tax
  revenue in year one (1951)** (L3583–3608). Best gamification case in the book for a compliance problem.
- LuckyDiem × La Quinta (a *hotel chain* — worth citing in our sales deck): 83,600 emails → 2,000 signups
  (2.4%) → **10,700 referral signups (K-factor 5.3)**, 34% daily return, 3.75 min/session, **14.1% became
  paying customers**, **712% sales lift** vs control (L3317–3402).
- **Oracle Effect (#71)** (named in the Waze audit, L5424): a prediction makes you stay engaged to see whether
  it comes true. Waze says "disabled car ahead" and you watch for it.
- Blendtec "Will It Blend?" — **+700% revenue**, 242M views (L3408–3419). Adobe "Real or Fake" (L3420–3429).

**IH reading.**
- **Cheapest high-leverage drive we have.** Adding controlled randomness costs almost nothing.
  - **Mystery Box on drill completion**: after the drill, the reward *type* is variable — a booster, a rare
    phrase card, an Easter-egg voice line, a collection piece. Chou's constraint (L4286–4296): variable
    rewards must sit behind a **short, easy** action. A 5-minute drill qualifies; a 60-drill certificate
    does not.
  - **Oracle Effect in the drill itself**: "hoy llega un huésped difícil" before the scenario loads. One line
    of copy, real anticipation.
  - **Easter Egg**: occasionally the model voice says something warm and specific back. Foursquare's Jobs
    badge is remembered years later because it was unexpected and meaningful.
- **HARD CONSTRAINT: never gate progress on chance.** A tired worker on a prepaid plan, in a mandated
  program, who "doesn't win" will read it as the app wasting their data. Randomize the *upside* only —
  everyone always gets something; the variance is in *what*.
- **Taiwan's invoice lottery is the model for our HR-side compliance problem.** Hotels need staff to actually
  complete training. Instead of the hotel policing it (CD8, expensive, resented), make each completed
  practice an entry into a small weekly draw run by the property. This converts enforcement into
  participation — exactly the Taiwan pattern, at hotel scale, and it's a feature HR pays for.
- **La Quinta case study belongs in the sales deck**, not just the product. Same buyer, same vertical,
  published numbers.

### CD8 — Loss & Avoidance (Black Hat, bottom)
*Avoiding something negative; refusing to admit prior effort was wasted.*

**Mechanism + evidence.**
- Loss aversion is roughly **2×** gain-seeking (Kahneman, L3775–3778).
- Farmville's withering crops made Chou's technophobe mother **wake at 5am** and recruit a cousin to farm
  while she travelled (L3646–3671). He names the eventual failure mode: **"Black Hat Rebound"** — users burn
  out and find the courage to leave (L3671).
- The Shenzhen portrait artist: after the drawing was done, "$15 extra for the protective layer or it will
  smudge." Chou paid $40 for something he'd refused at $35 minutes earlier — **and resolved never to buy
  from Chinese street vendors again** (L3672–3704). The lesson he draws (L3701–3706): Black Hat gets the
  conversion and **destroys the subsequent relationship**; use it only at critical conversion bumps,
  immediately followed by White Hat.
- **Ultimate Loss vs Executable Loss (L3780–3793) — the most operationally useful rule in the chapter.**
  Dangle the large setback; actually execute only small ones. **Executable Loss should never exceed 30% of
  what the user has invested, ideally never more than 15%, and 2–5% is usually enough.** Above 30%, "the odds
  of them feeling demoralized and quitting become extremely high."
- **Fear without a remedy backfires.** Leventhal/Singer/Jones tetanus study: only the group given **both**
  the scary pamphlet **and** a concrete plan acted (L3820–3823). Otherwise the brain concludes "since I don't
  know how to deal with it, it's probably not a big problem." Amend FDR: **"the only thing we have to fear is
  fear by itself."**
- **The Israeli daycare fine** (Gneezy & Rustichini, L4576–4590): a **$3** late fee made lateness *worse*, and
  removing it didn't restore the old behavior — it converted CD1/CD5 (be a good parent, don't burden the
  staff) into a cheap market transaction. Current best practice is **$1 per minute**.
- **Rightful Heritage (#46)**: "You've earned 3,000 credits — sign up to save them" outperforms "Sign up to
  get 3,000 free credits," identical outcome (L3833–3845). Startup equity cliffs work the same way.
- **Status Quo Sloth (#85)**: "I'll sign up tomorrow" = never (L3884–3893). Countered by the **FOMO Punch
  (#84)** — Jobs to Sculley: "sugar water… or a chance to change the world." Netherlands **Postcode Lottery**
  works because you'd have to watch your *neighbors* win without you (L3918–3925).
- **Sunk Cost Prison (#50)**: Facebook's hostage-holding of your friends, photos, and history (L3928–3946).

**IH reading — this is where we most differ from Duolingo, and the difference is the product.**
- **Duolingo's streak is CD8 + CD6 optimized for consumer DAU.** It works on a hobbyist who opted in.
  On our learner it is dangerous: a broken streak in a *mandated work-skill* program is not a game loss, it
  is **evidence of personal failure at work**, delivered to someone who already feels embarrassed about their
  English. That is the Black Hat Rebound with a career attached.
- **Concrete streak rules, derived from the Executable Loss ceiling:**
  1. Never zero a streak. Cap the Executable Loss: a missed day costs a small, visible, recoverable amount
     (a "día de gracia," a −1 rather than a reset). Our current `src/lib/streak.ts` **resets `current` to 1
     on any gap** (`nextCurrent = 1`). For a 40-day learner that is a **~97% Executable Loss** — more than
     3× the level Chou says causes demoralized quitting. **This is the highest-priority change in this
     document.**
  2. Never shame. Returning after a lapse must be greeted with the White Hat frame — "12 días acumulados en
     total; sigamos" — not "perdiste tu racha."
  3. Always pair any loss signal with the exact remedy (tetanus rule): the message that says you're about to
     lose something must contain the one-tap action that prevents it.
  4. Keep `longest` and `totalDays` prominent — they are one-way, unloseable accumulations (CD4 ownership),
     and they are what a returning learner needs to see.
- **Rightful Heritage on the placement exam.** Reframe the exam output as an earned asset: *"Ganaste 14
  frases de recepción. Guárdalas."* Same data, loss-framed, and consistent with the "never make them feel
  A1" fix above.
- **The daycare fine is a warning to our buyer.** Some HR director will propose docking or penalizing
  non-completion, or paying a small bonus for completion. Both convert a White Hat motive (be good at my job,
  don't let my shift down) into a cheap market transaction — and it does not revert when removed. We should
  have a written recommendation in the onboarding playbook telling GMs what *not* to do.
- **Use CD8 on the buyer, not the learner.** HR/GM buyers are genuinely loss-motivated (turnover cost, review
  scores, compliance risk). That's the right place for FOMO Punches and Evanescent Opportunities — the sales
  motion, not the learning loop.

---

## 2. Left Brain vs Right Brain — extrinsic vs intrinsic (Ch.13)

**Left Brain (extrinsic, goal/result-focused): CD2, CD4, CD6.**
**Right Brain (intrinsic, process/journey-focused): CD3, CD5, CD7.**

Chou's test for whether something is intrinsic (L4069–4078): *if the goal or reward were removed, would the
person still do it?* By this test **Mastery is extrinsic** in Octalysis, which is where he differs from
Pink/SDT terminology (L4058–4081). Social hangouts and creative puzzles pass; points, accumulation, and
shooting free throws don't.

**The overjustification effect** (Deci 1971; Lepper/Greene/Nisbett 1973, L4095–4110): the reliable way to make
someone stop drawing for pleasure is to pay them and then stop. Extrinsic reward *replaces* the intrinsic
motive; when the reward is removed, motivation falls **below baseline**.

**Extrinsic rewards destroy creative performance:**
- Ariely et al. (Federal Reserve Bank of Boston): subjects paid the most (5 months' pay) performed **far
  worse** on quick tasks than those paid a day's or two weeks' wage (L4111).
- LSE meta-review: "financial incentives may indeed reduce intrinsic motivation and diminish ethical or other
  reasons for complying with workplace social norms such as fairness… the provision of incentives can result
  in a negative impact on overall performance" (L4112–4116).
- **Candle Problem**: paid subjects took **3.5 minutes longer** (Glucksberg, L4169–4174). Reward narrows
  focus — helpful for mechanical tasks, harmful when the solution requires stepping outside the box.

**Social Norms vs Market Norms** (Ariely, L4190–4230). Two incompatible modes.
- People will do mundane tasks, move furniture, give legal advice, and write open-source code for free. Offer
  **1¢** and they're insulted and refuse — and the *social relationship itself* is questioned.
- Chocolate truffles: 10¢ → 5¢ → 1¢ increased demand 240% then 400% (market norms). **1¢ → free** *halved*
  total demand, because people switched to social norms: "I don't want to be a jerk and take too many."
- **Gifts stay in Social Norms; naming the gift's dollar value snaps you into Market Norms.** "Can you help?
  I'll give you this chocolate bar" works; "I'll give you this **50¢** chocolate bar" insults. Gift cards
  and Chinese red envelopes are described as devices that launder cash into a social frame.

**The educational-system critique (L4126–4159)** — worth quoting to ourselves. We are born curious (CD7) and
want to use knowledge (CD3); school converts that into grades, parental approval, and diplomas (CD2, CD4);
so students do the minimum and forget everything after the exam. Chou's teenager doesn't know why math
matters. Chou to his friends: remember 80% instead of forgetting 80% and you're **4× better than everyone
else** — and they answer "but what's the point, we already finished the test."

**Sequencing rule (Michael Wu via Chou, L4242–4245):** attract with **Extrinsic Rewards** (gift cards, money,
merchandise, discounts) → transition through **Intrinsic Rewards** (recognition, status, access) → land on
**Intrinsic Motivation** (the activity itself).

**Chou's three actionable ways to make an experience more intrinsic (L4248–4321):**
1. **More social** — but not friend-spam. Ask for invites only **after the First Major Win-State**; make the
   default share text believable rather than promotional; and prefer **collaborative play inside the Desired
   Action** over sharing bolted on outside it.
2. **More unpredictability** — controlled randomness; variable rewards only behind short easy actions;
   never open-ended "work hard for a year and *maybe* you'll get something."
3. **More meaningful choices and feedback** — the Lego/100-users test; 2–3 options at any decision point
   (not 1, not 20 — the "Google+ Problem" of decision paralysis is an Anti-CD2); design **Boosters**, and
   let boosters combine into strategies (the Mega Man example: pick your boss order, absorb powers).

**IH reading.**
- **Our learners arrive fully overjustified.** School already converted their curiosity about English into
  grades and shame — this is precisely the population Chou describes, and it's why "low prior success with
  school-style English" is in our own learner profile. **Any design that smells like school reactivates the
  extrinsic/shame association.** Test every screen against: "does this feel like a classroom?"
- **The Market Norms finding kills the most obvious B2B feature request.** HR directors will ask for cash
  bonuses, gift cards, or hour-credits for completion. Per the LSE/Ariely/daycare evidence this will
  (a) crowd out the intrinsic and social motives, (b) reduce performance on the creative parts (which is
  most of speaking), and (c) not revert when the budget runs out. **Our recommendation to buyers should be:
  recognize publicly, promote, and give time — never pay per lesson.** If they insist on a tangible, use a
  *gift* framing with the value unnamed (a meal, a day off, a jacket) — Chou's red-envelope loophole.
- **Sequencing gives us our onboarding arc:** Extrinsic (the certificate, the promotion path, the placement
  result) → Intrinsic Reward (recognition at the shift meeting, mentor status, being the one called when an
  English speaker arrives) → Intrinsic Motivation (the Plant-Picker drill is genuinely fun to play).
- **The Rockstar Effect (#92) is available to us for free and we are not using it.** The strongest possible
  intrinsic reward for a bellboy is the moment the front desk calls *them* because an English-speaking guest
  walked in. Our HR product should make that happen: surface "quién puede atender en inglés" by shift, so
  competence converts into on-shift status. That is Left-Brain training becoming Right-Brain identity, and
  it happens in the real world at zero content cost.

---

## 3. White Hat vs Black Hat (Ch.14)

**White Hat (CD1, CD2, CD3):** powerful, fulfilled, satisfied, in control. **Weakness: no urgency.**
"Go change the world!" → "yes, after breakfast" (L4411–4414).

**Black Hat (CD6, CD7, CD8):** obsessed, anxious, addicted. **Strength: urgency.** "Change the world or I
shoot" → you move, and you stop caring the moment you escape.

**Origin of the theory (L4376–4392):** Chou was studying why most games burn hot for 3–8 months then hemorrhage
users, while Chess, Poker, Mahjong, Starcraft, WoW, DotA/LoL, Counter-Strike stay alive for years. The
difference is what drives the **late Scaffolding and Endgame**. Black Hat games keep players grinding via
Sunk Cost Prison while the joy is gone; eventually a critical mass finds the strength to quit and CD5 causes
an exodus.

**Zynga is his worked negative case** (L4421–4448). Zynga called it "Data-Driven Design"; all short-term
metrics (monetization, virality, DAU, addiction) looked great; and re-skins failed because "it is almost like
the users are still playing the same Endgame — right in Onboarding phase." Their two durable hits — Zynga
Poker and Words with Friends — are Poker and Scrabble, i.e. **they accidentally inherited sound CD3 design**.

**Black Hat isn't evil** (L4449–4468). SnuzNLuz donates to a charity you hate when you snooze; the Shredder
Clock destroys money. People *volunteer* for Black Hat toward goals they already hold. What people hate is
Black Hat used to make them buy things they don't need.

**Ethics test (L4482–4490):** (a) full transparency of intended purpose; (b) the user implicitly or explicitly
opts in. Saying "please" is manipulation. Hypnotism passes the test. Hidden agendas fail it.

**When to use which (L4496–4551):**
- **Workplace / long-term engagement → White Hat.** Google's example: CD1 mission + "don't be evil"; CD2 via
  **eight engineer levels** (later nine) so ICs who shouldn't manage can still level up; CD3 via 20% time;
  CD4 project ownership; CD5 campus culture.
- **Sales, fundraising, eCommerce conversion → Black Hat.** Investors only close when they'll lose the deal
  (Chou's own $600k round became $1.05M the moment he told everyone he was closing without them).

**The transition sandwich (L4591–4624) — the single most actionable pattern in the chapter:**
> **White Hat environment → Black Hat at the conversion moment → immediately back to White Hat.**

Battle Camp: 25 players, 8 hours on a boss, 20% health left, pay $10 or waste everyone's time (CD8 — you buy,
and feel awful). Then the game showers you with achievement (CD2), trophies (CD4), and teammates cheering
"you spent real money to save our troop, you're our hero" (CD5) — and you conclude the $10 was well spent.
TOMS does the same after purchase remorse. **"If you want good Endgame design, you must immerse your users in
White Hat Gamification techniques"** (L4625).

**IH reading.**
- **Our default posture must be White Hat, more than a typical consumer app's.** Long-horizon relationship,
  vulnerable user, employer-mediated, and a renewal-based business model. Black Hat Rebound in our product
  doesn't just churn a user — it churns a *property*, because a demoralized floor tells the GM the program is
  demoralizing.
- **Apply the sandwich at exactly three moments and nowhere else:**
  1. **Activation** — the first-session FOMO Punch that gets a skeptical worker to try it at all.
  2. **Reactivation** — the "estás por perder X" nudge after a lapse (with the remedy attached, and with the
     Executable Loss capped per §CD8).
  3. **Buyer conversion** — pilot→paid, and renewal. This is where Black Hat belongs; this is the Chou
     fundraising story, and our own strategy notes say we are under-selling.
  In all three, follow immediately with White Hat (accomplishment, recognition, meaning). Never leave the
  learner sitting in a Black Hat state.
- **Google's "eight levels of engineers" is directly transplantable.** Not every bellboy will become a
  supervisor, but everyone needs a visible path. Build a **ladder inside the role**: Botones → Botones
  Bilingüe Nivel 1/2/3 → Padrino. CEFR is our natural spine and we already compute it (`@/lib/cefr`); the
  missing piece is the *named, role-local, socially legible* ladder on top of it.
- **The ethics test lets us tell the buyer where the line is.** Transparency + opt-in. A mandate breaks
  opt-in, which is another argument for making the program feel chosen (Choice Perception #89) even when it
  is assigned.

---

## 4. The Four Experience Phases — with the Endgame deep dive

The four phases (L413): **Discovery** (why anyone would try it) → **Onboarding** (learning the rules and
tools) → **Scaffolding** (the regular repeated journey toward a goal) → **Endgame** (retaining veterans).

Core premise (L429–432): **"the reason you are using a product on Day 1 is often very different from that of
Day 100."** Treating the product as one experience is the mistake. At any phase where none of the 8 drives
is present, the user drops out. Chou's example distribution of what typically dominates each phase (L444–448):
Discovery = CD7; Onboarding = CD2; Scaffolding = CD5 + CD6; Endgame = CD8.

**Chou's per-drive phase guidance, collected:**
- CD1 → best in **Discovery and Onboarding** (L784, L997).
- CD2 → the Onboarding workhorse; and the Onboarding rule is *make them feel smart*, don't overwhelm
  (L1317, L5108, L5408).
- CD3 → hardest; lands in **Scaffolding and Endgame**, poorly in Discovery/Onboarding (L1792–1797).
- CD5 → Mentorship is the flagship **Endgame** mechanic (L2458); invites go **after** the First Major
  Win-State, never at signup (L4254–4259).
- CD6 → Evolved UI solves the "too complex at Onboarding, too basic at Endgame" problem (L3059).
- CD7 → Mystery Boxes/Random Rewards "drive players in the **Endgame** Phase" (L3511).
- CD8 → FOMO Punch is a **Discovery** tool; Status Quo Sloth is an **Endgame** tool (L3908); Sunk Cost
  Prison makes leaving hard in the Endgame (L3937).
- Extrinsic rewards are most defensible in **Discovery**, where no other motive exists yet (L4236–4240).

**Discovery (L5392):** "the user experience of a service does not start when people sign up… but when they
first hear about it. How they hear about it, in what context, motivated by what Core Drives will all affect
how users behave during Onboarding and Scaffolding." Also (L3915): gamified systems must be voluntary; if
employees must do the work anyway, **the Discovery Phase design is what entices them to *play*.**

**Onboarding (Waze audit, L5400–5411):** one Epic Meaning image instead of a text/video wall; immediate
social proof ("363 Wazers nearby"); big obvious buttons so the user feels competent; a hint of the unlockables
to come — and explicitly **do not** ask for contribution yet.

**Scaffolding (L5412–5443):** "the regular journey… normally involves a repeated set of actions on a daily or
weekly basis" until it becomes habit. Where CD4 (Alfred Effect) compounds and CD3 begins.

### ENDGAME — the direct answer to our open question

**The problem, in his words:** "the Endgame is the most neglected and one of the hardest phases to optimize"
(L2458). "Many games are only popular for three to eight months, but ones that have impeccable Endgame design
can last over decades — or even centuries" (L498). Endgame begins "when the user has been going through the
activity loops for a long period of time and has done everything there is to do within their own perceptions"
(L5445).

**Every Endgame mechanism the book offers, ranked by how well it fits us:**

1. **CD3 Evergreen Mechanics — the only real answer.** "When a user can continuously tap into their
   creativity and derive an almost limitless number of possibilities, the game designer no longer needs to
   constantly create new content… The user's mind becomes the evergreen content" (L1509). Chess, Poker,
   Scrabble, Starcraft, Minecraft. **This is the difference between a content company and a system company.**
   → *For us:* the Plant-Picker phrase-combination model; learner-authored scenarios from their own real
   shift; multiple valid solutions per situation; combinatorial rather than enumerated content.
2. **Mentorship (#61).** Veterans stay because mentoring proves and displays their status, and because
   newbies depend on them. Worked cost-saving template at L2461–2482.
   → *For us:* the padrino/madrina program. **Highest-leverage single feature in this entire document.**
3. **Collection Sets (#16) as Endgame play.** McDonald's Monopoly: "because people are so desperate in
   completing a set that is almost finished, they are highly motivated to complete it as a strong Endgame
   play" (L2071).
   → *For us:* role-complete situation sets, seasonal sets, cross-role sets (a front-desk agent collecting
   restaurant situations).
4. **Random Rewards / Mystery Boxes (#72)** — "often, this unpredictable process is what drives players in
   the Endgame Phase" (L3511). Cheap, but Black Hat; use as seasoning.
5. **Status Quo Sloth (#85)** — build the habit loop so hard that changing behavior is the effortful option
   (L3893). Nir Eyal's Hook Model is cited as the mechanism.
6. **Alfred Effect (#83)** — personalization deep enough that switching means losing an understanding no
   competitor has (L2121–2162; reprised in the Waze Endgame at L5449).
7. **Sunk Cost Prison (#50)** — effective and Black Hat; Chou declines to use it on his own audience.
8. **Evolved UI (#37)** — the Endgame interface must be *richer* than the Onboarding one, or veterans
   outgrow you (L3059).
9. **Epic Meaning deepening** — Waze veterans take more pride in the community over time (L5448).

**Chou's own product's Endgame (Ch.17, L5719–5723)** is instructive because it's the only fully-specified one
in the book. His Endgame Desired Actions are: subscribe to the paid tier, attend **live weekly office hours**,
**learn and apply one new technique per week**, join **exclusive discussion groups**, review **case studies of
other members' projects**, **become a licensee**, and eventually **work directly with him**. Note the shape:
the Endgame is **live, social, applied, and status-conferring** — not more content.

**And his failure analyses all point the same way:**
- Piano Staircase: great feedback, bounded creativity → dies (L1611).
- Draw Something: stopped adding content, creativity gameable, play became obligation → dies (L1654–1659).
- Waze: CD3 is "still very limited for a veteran user" because there are only so many ways to say "there's
  trash here"; CD6 and CD7 both decay once avatars are unlocked and the Oracle Effect loses novelty
  (L5453–5460).

**IH reading — our Endgame, concretely.**
Our Endgame arrives when a learner has completed the role's drill library at their level. Today, nothing
happens there. The build:
1. **Combinatorial drills, not enumerated ones** (CD3). Situations × guest personality × pressure level ×
   valid solution paths. A 40-situation library becomes effectively unbounded.
2. **Padrino program** (CD5). B1+ learners mentor new hires in-app and on-shift; mentors get boosters,
   visible status, and a line in the HR report. This is the mechanic that both retains veterans *and* sells
   renewals.
3. **Learner-authored scenarios** (CD3 + CD4 + CD1). "Cuéntanos la situación más difícil de tu turno" →
   curated into the library with attribution. IKEA effect, evergreen content at zero authoring cost, and
   genuine Epic Meaning ("your situation is now training the whole chain").
4. **Cross-role and seasonal collection sets** (CD4 + CD6).
5. **A second ladder beyond CEFR** (CD2). CEFR tops out; job-specific mastery doesn't. Once B1 is reached,
   the ladder should switch from *level* to *scope* (more situations, harder guests, mentoring, second
   language).
6. **Live weekly moment** (CD5 + CD6 + CD7) — the one thing Chou's own Endgame leans on hardest. A weekly
   5-minute property-wide challenge at a fixed hour, announced over WhatsApp. Appointment Dynamic + Group
   Quest + social. Cheap to run, very hard for a consumer app to copy.

---

## 5. Game technique index (numbers as given, with fit for us)

| # | Technique | CD | Fit | Note |
|---|---|---|---|---|
| 1 | Status Points | 2 | Medium | Weights are a values statement — weight *speaking* highest |
| 2 | Achievement Symbols | 2 | **Careful** | Must symbolize real challenge or it insults adults |
| 3 | Leaderboards | 2 | **Only micro/group** | Never global; middle-position, weekly reset, ≤25 peers |
| 4 | Progress Bars | 2 | High | LinkedIn +20%; the cheapest CD2 win there is |
| 10 | Narrative | 1 | High | One image, not a video. Waze's "Traffic monster" |
| 11 | Meaningful Choices / Plant Picker | 3 | **Highest** | The phrase-combination model = our evergreen engine |
| 16 | Collection Sets | 4 | **Highest** | Give pieces, not prizes. Situation sets per role |
| 19 | Milestone Unlock | 3 | High | End every session on an unlock, not a summary |
| 21 | Appointment Dynamics | 6 | **Highest** | Anchor to shift start — our unfair advantage |
| 22 | Group Quests | 5 | High | Shift-level, collaborative. The safe form of competition |
| 23 | Beginner's Luck | 1/7 | High | Fix the demoralizing placement result |
| 24 | Free Lunch | 1 | Medium | Day-one gift; sets a social (not market) norm |
| 26 | Elitism | 1 | Medium | "Los que sí hablan inglés en este hotel" — careful, exclusion cuts both ways |
| 27 | Humanity Hero | 1 | Low | We have real meaning; don't bolt on a charity |
| 28 | Glowing Choice | 7/2 | **High** | 4-second rule. One glowing action per screen |
| 30 | Easter Eggs / Sudden Rewards | 7 | High | Cheap, memorable, word-of-mouth |
| 31 | Boosters | 3 | **Highest** | Replace badges with boosters wholesale |
| 37 | Evolved UI | 6 | **High** | Motivation win *and* payload win on cheap Android |
| 38 | Desert Oasis | 2 | High | Practice runner: strip everything but the action |
| 40 | Chain Combos | — | Later | Booster stacking, once boosters exist |
| 42 | Monitor Attachment | 4 | High | The progress chart they stare at |
| 43 | Build-From-Scratch | 4 | High | Self-assembled phrasebook; keep setup ≤3 taps |
| 44 | Dangling | 6 | Medium | Show the locked situation; always a visible path |
| 46 | Rightful Heritage | 8 | High | "Ganaste X — guárdalo" beats "obtén X gratis" |
| 50 | Sunk Cost Prison | 8 | **Avoid** | Build White Hat accumulation instead |
| 53 | Last Mile Drive | 2/6 | Medium | Final-item push within a set |
| 55 | Water Cooler | 5 | **Use existing** | Don't build a forum. Use their WhatsApp group |
| 57 | Brag Buttons | 5 | Medium | Only at Major Win-States; believable copy |
| 58 | Conformity Anchor | 5 | **Highest** | Hyper-local: "tu turno", never "el mundo" |
| 61 | Mentorship | 5 | **Highest** | Endgame + support cost + B2B pitch, all at once |
| 62 | Social Prods | 5 | High | One-tap "ánimo" over WhatsApp; designed to be effortless |
| 63 | Social Treasures | 5 | High | A card only a compañero can give you |
| 64 | Trophy Shelf | 5 | Medium | Physical: a pin, a name badge line. Works on-shift |
| 65 | Countdown Timer | 8/6 | Low | Only for the weekly live moment |
| 66 | Torture Break | 6 | **Avoid** | Will read as "the app is broken" |
| 67 | Moats | 6 | Medium | Gate the certificate behind real difficulty |
| 68 | Magnetic Cap | 6 | **High** | Cap daily drills ~2. Scarcity + data plan + content burn |
| 69 | Anchored Juxtaposition | 6 | Medium | Certificate: practice N times **or** pay |
| 71 | Oracle Effect | 7 | High | "Hoy llega un huésped difícil" — one line of copy |
| 72 | Mystery Box / Random Rewards | 7 | High | Vary the reward *type*, never gate progress on chance |
| 73 | Refreshing Content | 3/7 | High | Draw Something's cause of death |
| 74 | Lottery / Rolling Rewards | 7 | **High (HR)** | The Taiwan invoice model for completion compliance |
| 75 | Exchangeable Points | 4 | **Later** | Economies are hard; Chou warns repeatedly. Not MVP |
| 83 | Alfred Effect | 4 | **High** | Shift-aware, role-aware, weakness-aware. Our moat |
| 84 | FOMO Punch | 8 | Discovery/Sales | For activation and for the buyer — not the daily loop |
| 85 | Status Quo Sloth | 8 | Endgame | The habit loop itself |
| 86 | Evanescent Opportunity | 8 | Sales | Buyer-side only |
| 89 | Choice Perception | 3 | **High** | Make a mandate feel chosen. Cheap and honest-enough |
| 92 | Rockstar Effect | 2/5 | **Highest** | Make the workplace call on them. Costs us nothing |

---

## 6. Reluctant adult worker vs. motivated hobbyist — the drive prescription

This was the specific question. The book doesn't answer it directly, but Ch.13–15 plus the Bartle/Marczewski
mapping (L4794–4890) and the workplace-vs-consumer split in Ch.14 give a clean answer.

**The hobbyist (Duolingo's user):**
- **Discovery is voluntary** — they chose it, so the Discovery Phase already did its job.
- Tolerates and *enjoys* Black Hat: CD6 (gems, hearts, timers), CD7 (chests, variable rewards), CD8 (streak
  freeze economy). These drive DAU and are exactly what Duolingo optimizes.
- CD2 is safe territory: they *want* to see numbers go up, and a badge for showing up doesn't insult them
  because they opted into the game frame.
- Grind tolerance is high; retention is the KPI; the *skill* is almost incidental.
- Bartle-wise: Achievers and Explorers.

**Our learner (reluctant adult worker):**

| Drive | Prescription | Why |
|---|---|---|
| **CD1 Epic Meaning** | **Load-bearing. Highest priority.** | Discovery is compulsory ("tainted motivation"). CD1 is the only drive that converts *have to* into *want to*. Must be true and dignity-preserving, never guest-servitude. |
| **CD2 Accomplishment** | **Calibrate carefully; Anti-CD2 is the #1 churn risk.** | Adults who feel stupid disengage in 4 seconds, and this adult already associates English with failure. Guarantee an early real win; ban attendance badges; never headline "A1". |
| **CD3 Empowerment** | **The Endgame and the differentiator.** | Only source of evergreen content. Also the antidote to school-feel: play, not drill. |
| **CD4 Ownership** | **Very high — it's the answer to the mandate.** | Portable skill, own recordings, own phrasebook, own certificate. The one thing the *employee* gains that the *employer* can't take back. |
| **CD5 Social** | **Very high — culturally native, structurally unavailable to Duolingo.** | Shift, cuadrilla, break room, real coworkers. Mentorship + local conformity anchors + group quests. |
| **CD6 Scarcity** | **Selective: Appointment Dynamics + Magnetic Caps only.** | Shift schedules give us free appointment anchors; caps protect the 5-min promise and the data plan. Avoid Torture Breaks and life-timers. |
| **CD7 Unpredictability** | **Moderate, upside-only.** | Cheap engagement; but a tired user on prepaid data will not forgive "you didn't win." Randomize what they get, never whether. |
| **CD8 Loss** | **Lowest. Hard-capped.** | Executable Loss ≤5%; never zero a streak; never shame; always attach the remedy. Use CD8 on the *buyer*, not the learner. |

**Spike, don't spread.** Chou's own scoring math (L5276–5277): eight drives at 1 each = 8; two drives at 9 =
162. **"It is generally better being extremely strong in a few Core Drives, as opposed to having a little bit
of everything."** Our spikes should be **CD1, CD3, CD4, CD5** — all White Hat or intrinsic, all things a
consumer app in a foreign market structurally cannot do. We should be *deliberately mediocre* at CD6/CD7/CD8,
which is precisely where Duolingo is strongest. **We should not try to out-streak Duolingo. We should make
streaks a minor feature and win on meaning, mastery, ownership, and the people they work with.**

**Third player type we keep forgetting: the buyer.** Chou's Level III Octalysis says design per player type.
HR/GM has its own octagon: CD8 (turnover, review scores, compliance risk) + CD2 (measurable results, minimal
implementation work) + CD5 (**benchmarking against comparable properties — the oPower move, and the single
most under-used mechanic in our HR dashboard**) + CD1 for the GM who wants to say "we develop our people."
Their **Endgame is renewal**, which means the HR dashboard needs its own Scaffolding and Endgame design, not
just a reporting screen.

---

## 7. Octalysis audit of Inglés Hotelero as it stands (July 2026)

Based on `src/lib/streak.ts`, `src/content/practice.ts`, `src/app/practice/*`, `src/lib/cefr.ts`,
`src/app/hr/*`, `src/lib/masteros/*`.

| Drive | Score (0–10) | What exists | What's missing |
|---|---|---|---|
| CD1 Epic Meaning | **1** | Public copy has some dignity framing | Nothing in-product. No narrative, no named antagonist, no calling in onboarding |
| CD2 Accomplishment | **4** | Streak, CEFR levels, LevelChip, progress page, scored speaking | Placement result is demoralizing; no named role ladder; no micro-leaderboard; unlock moments unused |
| CD3 Empowerment | **2** | Speaking with AI feedback = real feedback loop | No meaningful choices at all — one path per drill. No boosters. No evergreen mechanic. **This is the biggest gap.** |
| CD4 Ownership | **2** | Vocabulary SRS, progress, recordings exist server-side | No collection sets, no phrasebook the learner owns/builds, no personalization surfaced, no export |
| CD5 Social | **1** | Cohorts exist (HR-side); WhatsApp channel exists | Zero peer mechanics: no mentorship, no conformity anchors, no group quests, no social treasures |
| CD6 Scarcity | **2** | Daily-only streak credit | No shift-anchored appointment, no cap, no Evolved UI, nothing dangled |
| CD7 Unpredictability | **1** | Drill variety | No mystery box, no easter eggs, no Oracle Effect, no variable reward |
| CD8 Loss | **3** (miscalibrated) | Streak reset | **Reset is a ~97% Executable Loss — 3× over Chou's demoralization threshold.** No graceful recovery, no remedy-attached nudge |

**Octalysis score ≈ 1+16+4+4+1+4+1+9 = 40.** For reference, Chou puts most non-game products under 150,
successful products at 350+, and says products insensitive to Human-Focused Design fall below 50.

The shape is telling: **we are a Function-Focused product with one Left-Brain drive (CD2) lightly implemented
and one Black-Hat drive (CD8) implemented at a dangerous magnitude.** Every drive that would differentiate us
from Duolingo — CD1, CD3, CD4, CD5 — is near zero.

---

## 8. Build list, ranked

**P0 — do these first; small, and they fix active harm or unlock the most**
1. **Fix the streak's Executable Loss.** `src/lib/streak.ts` resets `current` to 1 on any gap. Change to a
   graceful decay (grace day, or −1 per missed day with a floor), keep `longest`/`totalDays` prominent, and
   rewrite return copy to be White Hat. *Chou: >30% loss ⇒ demoralized quitting; 2–5% is enough.*
2. **Rewrite the placement result as an inventory of capability, not a verdict.** Beginner's Luck + Rightful
   Heritage framing. CEFR letter stays, subordinate.
3. **Add the Epic Meaning onboarding screen.** One image, one named antagonist ("el momento en que te quedas
   callado"), one line: *"Lo vencemos juntos."* Waze's exact play, ~15 seconds.
4. **Instrument and shorten time-to-First-Major-Win-State.** Define it as *first English utterance the system
   confirms was understood*. Measure minutes to it. Move every permission/install/invite prompt to *after*
   it. Target <90 seconds.
5. **Kill any attendance-only badge; convert rewards to Boosters.**

**P1 — the differentiating build**
6. **Meaningful Choices in the drill (Plant Picker).** Multiple valid response strategies per situation;
   grade on whether the guest is handled. This is the evergreen engine and the single most important
   architectural change.
7. **Collection Sets.** Situation cards per role; sets of 6–8; partial-set pressure; sets are the currency,
   not badges.
8. **Shift-anchored Appointment Dynamic** on the WhatsApp trigger (T-20min before shift), replacing any
   global send time. Every trigger must carry a core drive — CD7 ("hoy llega un huésped difícil") or CD5
   ("3 de tu turno ya practicaron").
9. **Local Conformity Anchors** in-product and in nudges. "Tu turno", never "el mundo". Never surface a
   low-participation number to employees.
10. **Magnetic Cap** at ~2 drills/day, +1 unlockable for power users, cap never fully removed.
11. **Milestone Unlock ending** on `/practice/done` — end on the new thing, let them try it once.
12. **Evolved UI** — start with one button; unlock surfaces on Win-States.

**P2 — Endgame and B2B**
13. **Padrino/madrina mentorship program.** Highest-leverage single feature: Endgame retention + support cost
    + a strong renewal pitch. Compensate in boosters and status, never cash.
14. **Rockstar Effect in the HR product** — surface "who can handle English, by shift," so competence
    converts into on-shift status.
15. **Property-level Group Quest** (weekly, collaborative) + **a weekly live 5-minute moment** at a fixed hour.
16. **Learner-authored scenarios**, curated into the library with attribution.
17. **oPower the HR dashboard**: benchmark this property against comparable properties, with a positive
    signal for top performers (the smiley-face fix). This is the buyer's CD5 and it is missing entirely.
18. **Property-run completion lottery** (Taiwan invoice model) as an HR feature — converts enforcement into
    participation.
19. **Named role ladder** on top of CEFR (Google's eight engineer levels), with an Endgame that switches from
    *level* to *scope*.
20. **Buyer-side Black Hat, deliberately**: FOMO Punch and Evanescent Opportunity in the sales and renewal
    motion, always sandwiched back into White Hat.

**Written policy for the buyer playbook (not a build, but load-bearing):**
- **Do not pay per lesson.** Cash and gift-card incentives crowd out intrinsic and social motives, degrade
  performance on creative tasks, and don't revert when withdrawn (Deci; Ariely; LSE; Gneezy & Rustichini).
- **Do not penalize non-completion.** The $3 daycare fine made lateness worse *permanently*.
- **Do not run individual leaderboards or rank staff.** GE and Microsoft; and competition explicitly fails in
  learning-focused environments.
- **Do recognize publicly, promote, and give time.** Recognition is an Intrinsic Reward and stays inside
  Social Norms. A gift with an unnamed value is safe; a stated dollar value is not.

---

## 9. Where the book conflicts loudly with what a naive product team would do

1. **"Add a streak like Duolingo."** The streak is Black Hat CD6/CD8 tuned for a *voluntary consumer*. On a
   mandated work-skill program for someone ashamed of their English, a hard reset is a ~97% Executable Loss
   and manufactures exactly the Black Hat Rebound that kills renewals. **Keep a streak; make it forgiving;
   don't build the product around it.**
2. **"Ship badges and points."** Badges without challenge insult adults — Chou says explicitly they work on
   *small children* because first-friend is a genuine feat there. Our design system already forbids
   condescension; this is the same rule arriving from motivation theory. **Boosters, not badges.**
3. **"Make it as easy as possible."** Fogg says lower the bar; Chou says raise the motivation, and Betty
   Crocker *removed* the powdered egg to make baking harder and won. Our 5-minute target is about *cost*,
   not *difficulty*. A 5-minute session that requires nothing produces no Win-State.
4. **"Add a leaderboard so the hotel can see who's winning."** Global leaderboards demotivate everyone
   outside the top; workplace competition explicitly fails in learning environments; and stack ranking is the
   most-cited destructive process at Microsoft. **Group quests and assists, not ranks.**
5. **"Let HR pay a bonus for completion."** Overjustification + Market Norms. It will work for one quarter,
   degrade speaking performance (the creative part), erode the social motive, and not revert.
6. **"Show the team their completion rate to motivate them."** The Petrified Forest sign *increased* theft
   160%. Negative social proof to employees will lower completion. Low numbers go to the buyer only.
7. **"Just write more drills."** Draw Something had 35M downloads and died from exactly this. Content is a
   treadmill; CD3 combinatorics is an engine. **Build the engine.**
8. **"Ask for referrals/invites at signup."** Chou calls this a "gigantic mistake" — it delays the First
   Major Win-State, which is itself the most damaging thing you can do. Invites go *after* the wow.
9. **"Let motivated learners do as much as they want."** Magnetic Cap: limits *increase* the behavior
   (+30–105%), protect the daily loop, and save their data.
10. **"Show all our features so they see the value."** Google+ is Chou's running example of great technology
    that makes users feel stupid. Evolved UI: withhold, then unlock. Clients resist this emotionally; do it
    anyway.
11. **"Make it fun with random rewards / loot boxes."** Yes to variable *upside*; absolutely no to gating
    progress on chance for a user paying for data by the megabyte.
12. **"Our differentiator is better content / better AI."** Chou's Zynga analysis: all the short-term metrics
    can look great and the product still dies in the Endgame. **Our differentiator has to be CD1/CD3/CD4/CD5
    — meaning, evergreen play, ownership, and the coworkers standing next to them.** Those are the four
    things a global consumer app structurally cannot reach.

---

## 10. Octalysis Strategy Dashboard for Inglés Hotelero (Ch.17 format)

**1. Business Metrics → Game Objective** (ordered; the top ones are the ones that must succeed)
- Property renewal rate (the real Endgame metric)
- Pilot → paid conversion
- % of enrolled staff with ≥1 CEFR level gain in 90 days
- Weekly active learners / enrolled (not DAU — shift work is weekly-shaped)
- Placement exams sold per property

**2. Users → Players**
- **Learner** (bellboy / front desk / restaurant) — compulsory Discovery, A1–A2, shift-bound, embarrassed,
  low-friction tolerance
- **Buyer** (HR director / GM) — loss-motivated, wants measurable results and near-zero implementation
- **Champion** (supervisor / trainer inside the property) — the Marczewski "Philanthropist"; usually
  unrewarded by our system today, and probably decisive for adoption

**3. Desired Actions → Win-States**
- *Discovery:* hear about it from a supervisor or coworker; open the WhatsApp link; see the meaning screen
- *Onboarding:* complete placement; **speak one English sentence and be understood**; choose role/shift;
  write one commitment line
- *Scaffolding:* practice daily at shift−20min; complete situation sets; retain vocabulary; use a phrase on
  an actual shift; nudge a coworker
- *Endgame:* mentor a new hire; author a scenario from their own shift; complete cross-role sets; join the
  weekly live moment; earn and display the role-ladder title

**4. Feedback Mechanics → Triggers** (every one must carry a core drive)
- WhatsApp daily message (CD1/CD5/CD7 — never a bare reminder)
- PWA notification at shift−20 (CD6 Appointment)
- Progress chart / Monitor Attachment (CD4)
- Situation-set completion meter (CD4/CD6)
- Peer prod from a compañero (CD5)
- Booster unlock reveal (CD3/CD2)
- HR benchmark email to the buyer (CD5/CD8 — buyer-side)

**5. Incentives → Rewards** (abundant → scarce)
- Boosters (comodín, slow audio, hint token, offline pack)
- Situation cards / collection pieces
- Recognition at the shift meeting
- Role-ladder title
- Physical trophy shelf item (pin / name-badge line)
- Mentor status + mentor-only tools
- Official constancia / certificate
- Being the one the front desk calls (Rockstar Effect)

---

## 11. Open questions the book does not answer for us

- **How to make a mandate feel voluntary.** Chou insists play must be voluntary and that Discovery design is
  what entices a mandated employee (L3915) — but he gives no worked example. Choice Perception (#89) is the
  only tool offered. Worth pairing with the Customer Development / Lean sources in the corpus.
- **Spaced repetition vs. evergreen mechanics.** Our SRS is inherently enumerated and schedule-driven; CD3
  wants combinatorial and learner-driven. These pull against each other and the book has nothing to say
  about it. Resolve against `fluent-forever` / `design-for-how-people-learn`.
- **Where the Plant-Picker grading boundary sits.** "Multiple valid answers" is easy to say and hard to
  score. This is a real AI-scoring design problem, not a motivation problem.
- **Ethics of the Alfred Effect with employer-owned data.** Shift-aware personalization is powerful and it
  runs on data the *employer* provided. Needs a privacy position before it ships.
- **The 4-Phases material is thin here by design** — the Level II volume was never written. What we have is
  the two audits (Facebook L5183–5260, Waze L5330–5535) and scattered guidance. The Waze audit is the best
  template in the book for how to structure our own phase-by-phase design pass; it's worth re-reading as a
  format, not just as content.

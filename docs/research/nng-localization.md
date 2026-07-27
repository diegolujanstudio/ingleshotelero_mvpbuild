# NN/g Localization + International UX — Applied to Inglés Hotelero

Research date: 2026-07-26. All findings below were read from the primary source (nngroup.com article
pages, plus W3C i18n and the Harvard CHI paper NN/g cites). Where a claim is NN/g's opinion rather
than measured data, it is labelled **[opinion, no data]**. Where a number is old or from a
non-Latin-American population, that is called out — do not launder US data into Mexican claims.

---

## 0. The verdict in one paragraph

NN/g's localization body of work says three things that matter to us. **First**, translation is the
cheap 10% of localization and we have already spent it — the expensive 90% is content strategy,
imagery, formality, form conventions and channel choice, and we have made almost none of those
decisions deliberately. **Second**, the single hardest-hitting NN/g dataset (OECD PIAAC, 215,942
people, 33 countries) says roughly two thirds of working-age adults cannot complete a task that
requires navigating between two applications with an implicit goal — our learner is at the harder
end of that distribution, and our current exam flow assumes far more than Level 1 skill. **Third**,
and most uncomfortably, the peer-reviewed study NN/g cites for cross-cultural visual preference
(Reinecke & Gajos, CHI 2014, 2.4M ratings, ~40k people) found that **Mexicans and Chileans rate
high-visual-complexity sites higher**, and that **higher education correlates with lower preference
for colorfulness**. Our Design System v0.1 — ivory, one accent, editorial restraint, no emoji — is
optimized for the profile *least* like our learner and *most* like our buyer. That is not
necessarily wrong, but it is currently an unexamined assumption, and it should be split by audience
and then tested.

---

## 1. What real localization requires beyond translation

**Source:** [Modify Your Design for Global Audiences: Crosscultural UX Design](https://www.nngroup.com/articles/crosscultural-design/)

NN/g's definitions, verbatim:

- **Translation** — "the interface language changes depending on the target audience. The look and
  feel of the product stays the same; the only difference is the language."
- **Localization** — "making the design of the digital product culturally relevant to the target
  audience. This type of change is often more dramatic: visual presentation and content strategy can
  be totally different."

NN/g's four decision factors for how far to go:

1. **Audience heterogeneity.** "If none of these subgroups reach a sizeable portion of your general
   audience, then rely mostly on translation."
2. **Cultural dimensions** (Hofstede: power distance, individualism/collectivism, uncertainty
   avoidance, long-term orientation).
3. **Product usage impact.** "The more your products or services are involved in daily life, the more
   localized your design should be."
4. **Market value / ROI.** "Localizing your design costs much more than mere translation."

NN/g's concrete examples of localization-not-translation are almost all *infrastructure* decisions,
not copy decisions: culturally relevant **payment and authentication methods** (WeChat login,
one-time passwords), **QR codes** for region-specific services, and imagery that supports navigation.

### So what do we do differently

- **We are at the maximum end of factor 3.** This is a daily, on-shift, 5-minutes-a-day habit product.
  NN/g's own rule says daily-life products demand deep localization, not translation. We do not get
  to treat "the Spanish is good" as done.
- **Our localization debt is in authentication and channel, not copy.** NN/g's China finding (WeChat
  login, QR) has an exact Mexican analogue: **WhatsApp is the identity layer, not email.** A hotel
  bellboy has a phone number and WhatsApp; he may not have a working email he checks, and he almost
  certainly will not do an email-confirm round trip during a shift. Our current HR auth path
  (Supabase Auth + invite emails, per CLAUDE.md's "NOT production-ready" list) is fine for the
  buyer. For the **learner**, email-based account creation is a localization failure. Enrollment
  should be: HR uploads phone numbers → learner receives WhatsApp message → tapping the link is the
  auth. Phone + OTP, or magic-link-over-WhatsApp. Never a password the learner must invent and recall.
- **Do the field study before more building.** NN/g: "You're not the user!" — "at the beginning of
  designing a cross-cultural product, conduct field studies, like contextual inquiries, with your
  target users." Given MEMORY.md's note that we are over-built and under-validated with 0 paying
  customers, this is the finding with the highest ROI in the whole document. Two shifts observed in
  a Cancún hotel beats another sprint.

---

## 2. The distribution of user skill — the most load-bearing number we have

**Source:** [The Distribution of Users' Computer Skills: Worse Than You Think](https://www.nngroup.com/articles/computer-skill-levels/)
(Jakob Nielsen, based on OECD's PIAAC "Problem Solving in Technology-Rich Environments")

Study: 2011–2015, **33 OECD countries, 215,942 participants aged 16–65**, minimum 5,000 per country,
14 computer-based tasks on simulated software.

| Level | % of population | What they can do |
|---|---|---|
| Cannot use a computer at all | 26% | — |
| Below Level 1 | 14% | Single-function tasks with explicit criteria only ("delete this email") |
| Level 1 | 29% | Familiar apps (email, browser); little navigation; no inference |
| Level 2 | 26% | Multiple applications; some navigation; inferential reasoning |
| Level 3 | 5% (US) | Multi-step, implicit goals, high monitoring |

Level 3 by country: US 5%, Australia/UK 6%, Canada + Northern Europe 7%, Singapore/Japan 8%.

Nielsen's conclusions, verbatim:
- "Keep it extremely simple, or two thirds of the population can't use your design."
- "You are not the user, unless you're designing for an elite audience."
- "If you think something is easy, or that surely people can do this simple thing on our website,
  then you may very well be wrong."
- For broad consumer audiences, "it's safest to assume that users' skills are those specified for
  level 1."

**Honesty caveat:** Mexico was not in PIAAC round 1's problem-solving module; Chile was added in a
later round. These percentages are **not** measured Mexican figures and must not be quoted as such.
The defensible claim is directional: our learner population (hospitality line staff, low prior
academic success, mid-range Android) sits at or below the Level 1 band, i.e. the band Nielsen says
to design for as a *floor*, not a ceiling.

### So what do we do differently

- **Design every learner surface to Level 1.** Level 1 = "familiar applications, little navigation
  needed, no inferential reasoning." Concretely: one decision per screen, zero cross-screen state
  the user must hold, no "go back and check your earlier answer," no settings the learner must
  configure before value appears.
- **Audit the exam flow against this.** `/exam/[id]/{diagnostic,listening,speaking,results}` is a
  four-mode flow with a MediaRecorder permission gate in the middle. Mic permission is a *browser
  chrome* interaction — it is not part of our UI and it is exactly the kind of "navigate between
  applications" step PIAAC Level 2 measures. Assume a meaningful share of learners will fail it.
  We already fixed one mic-denied dead end (task #8); the deeper fix is (a) a pre-permission
  explainer screen in Spanish before the browser prompt, (b) a recovery path that lets the learner
  *finish the exam without speaking* and be re-prompted later, and (c) an HR-visible flag rather
  than a silent drop.
- **Never make the learner type.** Typing English on a Spanish Android keyboard with autocorrect
  fighting them is a Level 2+ task with an unforgiving failure mode. Tap-to-select, tap-to-record,
  tap-to-continue. If we need production, it should be spoken, not typed.
- **Reframe the buyer pitch around this number.** "Two thirds of adults can't complete a two-app
  computer task (OECD, n=215,942) — that's why our training runs in WhatsApp and needs zero IT
  onboarding" is a strong, verifiable line for `/precios` and the HR deck. It converts a UX
  constraint into a sales differentiator against LMS incumbents.

---

## 3. Lower-literacy users — reading behaviour and rules

**Source:** [Lower-Literacy Users: Writing for a Broad Consumer Audience](https://www.nngroup.com/articles/writing-for-lower-literacy-users/)
(Jakob Nielsen, **March 13, 2005** — old; US population; the 43% figure is from the US Dept. of
Education's **National Assessment of Adult Literacy (NAAL)**, i.e. 2003 data.)

Nielsen's definition: "Lower literacy is different than illiteracy: people with lower literacy can
read, but they have difficulties doing so."

Behavioural findings:
- Lower-literacy users **plow** text line-by-line rather than scan it.
- They have a **narrow field of view** and miss objects outside the main text flow.
- They read word for word; multi-syllabic words are a stumbling point.
- They **skip dense information sections entirely** and satisfice on minimal information.
- **Scrolling "breaks lower-literacy users' visual concentration."**
- **Search is a trap** — spelling difficulty on input, plus difficulty processing a results page.

Redesign case study (50 users, between-subjects, double-blind — neither users nor experimenters knew
which version was being tested):

| Metric | Original (lower-lit) | Revised (lower-lit) | Original (higher-lit) | Revised (higher-lit) |
|---|---|---|---|---|
| Success rate | 46% | 82% | 68% | 93% |
| Total time, 7 tasks | 22.3 min | 9.5 min | 14.3 min | 5.1 min |
| Satisfaction (1–5) | 3.5 | 4.4 | 3.7 | 4.8 |

Lower-literacy users improved **135%** on task time. Critically: **higher-literacy users improved
too.** Simplification is not a tax on your best users.

Guidelines given: 6th-grade reading level on the homepage / key landing pages, 8th grade elsewhere;
main point at the very top; important content above the fold; **"Avoid text that moves or changes,
such as animations and fly-out menus. Static text is easier to read."**; single main column; linear
menu for main navigation; misspelling-tolerant search with short, easy summaries.

Cross-check from [Legibility, Readability, and Comprehension](https://www.nngroup.com/articles/legibility-readability-comprehension/):
users "read only 28% of the words" on an average visit; after one content rewrite, recall of product
characteristics went from **33% to 65%**.

### So what do we do differently

- **Set a measurable Spanish readability floor and enforce it in CI.** Target the Spanish equivalent
  of 6th grade — use the **Fernández Huerta** or **INFLESZ** index (the Spanish-language analogues of
  Flesch), not an English Flesch-Kincaid run on Spanish text, which is invalid. Add a lint step over
  `src/content/*.ts` that fails the build when a string exceeds the threshold. This is the single
  most mechanizable finding in this document.
- **Kill scrolling inside the drill loop.** "Scrolling breaks lower-literacy users' visual
  concentration." A drill card must fit one viewport on a 360×640 Android with no scroll. If it
  doesn't fit, the drill is too long — that's the signal, not a CSS problem.
- **The whole product should be navigable without ever reading a paragraph.** Instruction text is a
  fallback, not the mechanism. If a learner cannot infer what to do from layout + one 5-word label,
  the screen fails.
- **No search anywhere in the learner app.** Not a nav item, not a "find a lesson" box. NN/g is
  explicit that search is where lower-literacy users break. The system chooses today's drill.
- **The 33%→65% recall number is the argument for content rewriting as a product investment**, and
  it is a number worth quoting to Diego when scope-cutting: rewriting existing content beats
  building new content.
- **Tension to resolve deliberately:** Nielsen says avoid animation because static text is easier to
  read. A language-learning product legitimately needs motion (audio playing state, recording state,
  correct/incorrect feedback). The reconciliation: **motion may indicate system state, never carry
  meaning, and never move text the user is currently reading.** That is a clean, enforceable rule.

---

## 4. Reading patterns — and why the famous one doesn't apply to our learner

**Sources:** [F-Shaped Pattern of Reading on the Web](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/),
[The Layer-Cake Pattern](https://www.nngroup.com/articles/layer-cake-pattern-scanning/),
[International Usability: Big Stuff the Same, Details Differ](https://www.nngroup.com/articles/international-usability-details-differ/)

- The F-pattern is **a symptom of bad formatting**, not a target: "The F-pattern is the default
  pattern when there are no strong cues to attract the eyes towards meaningful information."
- Consequence: "users may skip important content simply because it appears on the right side of the
  page." And: "When people scan in an F-shape, they miss big chunks of content."
- It occurs on mobile too: "the F-shaped scanning pattern is alive and well in today's world — both
  on desktop and on mobile."
- The **layer-cake pattern** (eyes hopping headings/subheadings) is "by far the most effective way to
  scan pages."
- Fixes: most important points in the first two paragraphs; prominent headings; **"Start headings and
  subheadings with the words carrying most information"**; visual grouping and bolding; bullets.
- Arabic readers show a **mirrored-F** pattern; the fix is to "mirror-image the design patterns."
  (Not relevant to Spanish — Spanish is LTR and shares Western reading direction. Worth banking for a
  future Arabic/Hebrew market; irrelevant for LATAM.)

**The important collision:** the F-pattern and layer-cake are *scanning* behaviours. NN/g's
lower-literacy research says our users **do not scan — they plow.** These two bodies of research
describe different populations, and our buyer and our learner are on opposite sides of it.

### So what do we do differently

- **Split the writing standard by audience.**
  - Buyer surfaces (`/precios`, `/hr/*`, landing, city SEO pages): write for **scanning** — front-load
    headings, layer-cake structure, information-first heading words. An HR director skims.
  - Learner surfaces (exam, drills, WhatsApp): write for **plowing** — short single-column text, no
    right-rail content, nothing important placed to the right of anything else, every word intended
    to be read.
- **Nothing meaningful goes in a right-hand column on learner screens.** Not a "tip," not a streak
  counter, not a progress hint. If it matters, it is in the single centre column.
- **Rewrite HR dashboard headings to lead with the informative word.** "Nivel promedio del equipo"
  beats "Resumen del nivel promedio del equipo." Applies to `/hr`, `/hr/employees`, `/hr/reports`.

---

## 5. Text expansion — the real numbers

NN/g's guidance is a rule of thumb, stated twice and consistently:
- [International Usability: Big Stuff the Same, Details Differ](https://www.nngroup.com/articles/international-usability-details-differ/):
  "reserve 50% extra space for UI labels when translating from English to other languages," motivated
  by a UAE participant: "English is one word or two. Arabic is more talking, more words."
- [International B2B Audiences](https://www.nngroup.com/articles/international-b2b/): allocate
  **"50% more room for languages other than English."**

The harder data is not NN/g's — it's the IBM table republished by W3C:
[Text size in translation (W3C i18n)](https://www.w3.org/International/articles/article-text-size.en.html)

| Characters in English source | Average expanded size |
|---|---|
| Up to 10 | 200–300% |
| 11–20 | 180–200% |
| 21–30 | 160–180% |
| 31–50 | 140–160% |
| 51–70 | 130–150% |
| Over 70 | 130% |

**Read that correctly: the shorter the string, the worse the expansion.** Buttons, chips, tab labels
and badges — our shortest strings — are the ones that can triple. W3C's example is exactly ours:
"FAQ" → "Preguntas frecuentes."

W3C's recommendations: "Allow text to reflow and avoid small fixed-width containers or tight squeezes
where possible"; separate presentation from content; size **database fields in characters**, not
pixels; "Think twice about abbreviations."

### So what do we do differently

- **Our source language is Spanish, so we live at the wide end already.** The risk is inverted and
  usually missed: any layout Diego designed by eye in Spanish will look *loose* in English and will
  break when we add Portuguese (Brazil is the obvious sector-adjacent expansion). Do not tighten
  containers to fit the Spanish string.
- **Hard rule: no fixed-width text containers anywhere.** No `w-[120px]` on a button, no truncation
  with ellipsis on a label that carries meaning. Chips and badges (`Badge`, `LevelBadge`) are the
  highest-risk primitives in the codebase for this — audit them.
- **Bilingual layouts must budget for the Spanish being ~1.3–2× the English.** Our drills show an
  English target phrase with a Spanish gloss. Never lay these out as two equal-width columns. Stack
  them, or give Spanish the wider track.
- **CEFR level names and role names are our shortest, most expansion-prone strings** ("Recepción",
  "Botones", "Restaurante" vs "Front desk", "Bellboy", "Restaurant"). Test the UI at 2× label length
  as a QA breakpoint, not just at 3 screen widths.
- **Store content in character-counted DB fields**, and set the limit from the *longest* target
  language, not from Spanish.

---

## 6. Imagery and visual identity — the finding that challenges Design System v0.1

**Sources:** [International Usability Testing: Why You Need It](https://www.nngroup.com/articles/why-international-usability-testing/),
[7 Tips for Memorable and Easy-to-Understand Imagery](https://www.nngroup.com/articles/7-tips-memorable-imagery/),
[Photos as Web Content](https://www.nngroup.com/articles/photos-as-web-content/)

NN/g quotes, verbatim, from the international-testing article:

> "Researchers Katharina Reinecke and Krzysztof Gajos collected 2.4 million subjective ratings on
> website aesthetics from more than 39,000 participants all over the world. They found out that
> Russian participants significantly preferred websites with lower visual complexity, while people
> from Mexico and Chile gave higher scores to sites with high visual complexity. The same study also
> found that monochrome designs are preferred by Finns, Russians, French, and Germans, while
> Malaysians and Chileans tend to like colorful visuals."

Citation NN/g gives: **Reinecke, K., & Gajos, K. Z. (2014). Quantifying visual preferences around the
world. *Proc. SIGCHI CHI 2014*, pp. 11–20.**
Primary source verified at [Harvard EECS](https://www.eecs.harvard.edu/~kgajos/papers/2014/reinecke14visual.shtml)
— abstract confirms "2.4 million ratings of the visual appeal of websites from nearly 40 thousand
participants of diverse backgrounds." Additional findings from the primary abstract:
- **Women preferred colorful websites more than men.**
- **Higher education level corresponded with reduced preference for colorfulness.**
- Russians favored lower visual complexity; Macedonians showed the highest preference for colorful
  designs of any country in the dataset.

Imagery guidance (7 Tips + Photos as Web Content):
- Users "pay close attention to photos and other images that contain relevant information but ignore
  fluffy pictures used to 'jazz up' web pages."
- **Photos of real people are scrutinized; stock photos of models are ignored.** "Users are likely to
  overlook photos they have seen previously" and won't remember them.
- Show products "in a realistic context" — the environment and the target audience.
- Place visuals close to the related text; keep resolution high; don't over-use imagery.
- Tip #7 verbatim: **"Imagery can translate differently from one culture to another."**
- Scanning research: once users decide images aren't useful, they avoid them — the "images as
  obstacle course" pattern.

### So what do we do differently

- **This is a direct, evidence-based challenge to "una sola nota de color" — but only on the learner
  side.** The Reinecke/Gajos result points the same way twice for our learner (Mexican + lower formal
  education → higher tolerance for complexity, higher preference for colorfulness) and the opposite
  way for our buyer (educated HR/GM → lower preference for colorfulness). **Do not rip up the design
  system. Split it.** Keep ivory/ink editorial restraint for `/`, `/precios`, `/hr/*` — the buyer
  surfaces where it also signals credibility. Build a warmer, denser, higher-contrast learner theme
  for the drill and exam surfaces and A/B it.
- **State the caveat honestly when arguing this with Diego:** Reinecke & Gajos measured *aesthetic
  appeal ratings of screenshots*, not learning outcomes, task success, or retention. Appeal ≠
  efficacy. The correct move is not "add color because Mexicans like color," it is "our minimalism is
  an untested aesthetic bet on a population whose measured preferences run the other way — so test
  it, with a first-session completion-rate metric, before treating it as settled."
- **Kill every stock photo on learner-facing surfaces.** We have a `public/img/` set and a
  `cityImages.ts` allow-list built from Pexels. NN/g is unambiguous: generic stock is ignored and
  unremembered. For city/role SEO pages aimed at the buyer, location stock is defensible as scenery.
  For anything a learner sees, it must be a real person in a real Mexican hotel doing the actual job —
  which means we should be **commissioning photography during the first pilot**, not sourcing it.
- **Imagery must carry the drill's meaning, not decorate it.** If a drill is about the difference
  between a "wake-up call" and "room service," the image should disambiguate. Decorative hero
  imagery inside the drill loop is an obstacle course.
- **Cultural specificity of imagery is a per-market asset, not a global one.** Cancún resort ≠ CDMX
  business hotel ≠ Los Cabos boutique. If we tell a bellboy in a business hotel that his job looks
  like a beach resort, we have made exactly the mistake Tip #7 warns about.

---

## 7. Formality, register, and tone

**Sources:** [The Impact of Tone of Voice on Users' Brand Perception](https://www.nngroup.com/articles/tone-voice-users/),
[The Four Dimensions of Tone of Voice](https://www.nngroup.com/articles/tone-of-voice-dimensions/),
[International B2B Audiences](https://www.nngroup.com/articles/international-b2b/)

NN/g's four tone dimensions: **funny vs. serious, formal vs. casual, respectful vs. irreverent,
enthusiastic vs. matter-of-fact** — each a 3-point spectrum with a neutral midpoint.

The tone study: qualitative in-person testing plus an online survey, **n=100 US adults**, 4 industry
pairs (auto insurance, checking accounts, home security, hospital care), 5-point Likert scales for
friendliness, trustworthiness, and desirability. "The only things we varied between the pairs was the
tone and the name of the fake organization."

Results (deltas in Likert points):

| Industry | Friendliness | Trustworthiness | Desirability |
|---|---|---|---|
| Auto insurance | playful +0.3 | **serious +0.3** | no sig. difference |
| Banking | casual +0.7 | casual +0.3 | casual +0.4 |
| Home security | humorous +0.5 | humorous +0.4 | humorous +0.4 |
| Hospital | casual/enthusiastic +0.5 | casual marginal (p=0.05) | — |

The most useful number in the study: **"52% of the variability in the desirability scores is explained
by trustworthiness"** while **"friendliness only explains an extra 8%."**

NN/g's summary: "Casual, conversational, and moderately enthusiastic tones performed best," but
humour in high-stakes contexts backfired — "The friendliness and irreverence actually undermined
users' perceptions of trustworthiness."

For B2B international audiences, NN/g says to **"vary tone of voice based on regional business
formality levels."**

**Explicit gap:** NN/g has published nothing I could find on the **tú / usted / ustedes / vosotros**
decision, or on Spanish register generally. Anyone claiming NN/g guidance on this is fabricating.
The decision has to be reasoned from the tone framework plus market knowledge, and then tested.

### So what do we do differently

- **The 52% / 8% split is the whole strategy.** Trustworthiness drives desirability; friendliness
  barely moves it. For a learner who is *embarrassed about their English*, "friendly" is not the goal
  — **credible and non-judgmental** is. This is a research-backed restatement of the design system's
  first principle ("Respeto, no condescendencia"), and it means: no cheerleading, no "¡Wow!", no
  exclamation-mark inflation. Warmth without hype.
- **Recommended register decision (to be validated, not assumed):**
  - **Learner-facing, both PWA and WhatsApp: "tú."** Mexican service-workplace Spanish in a coaching
    context is tú; "usted" from a training app to a bellboy reads institutional and distancing, and
    lands closer to school — the exact association we are fighting. Casual scored higher on *both*
    friendliness and trustworthiness in 3 of 4 NN/g industry pairs.
  - **Buyer-facing (`/precios`, HR emails, sales): "usted"** — Mexican B2B correspondence norm, and
    NN/g's B2B article explicitly says to match regional business formality.
  - **Plural: "ustedes" everywhere.** Never "vosotros" — that is Spain-only and immediately marks the
    product as foreign in LATAM. This should be a lint rule.
  - Prefer neutral-LATAM lexis over Mexico-only slang so the same content ships to Colombia/Perú/DR
    without a rewrite. Test the exceptions where hotel vocabulary genuinely differs by country.
- **No humour in scoring, feedback, or results.** The exam result is our "high-stakes industry."
  NN/g's finding that irreverence undermines trust in serious contexts applies exactly here — a
  learner receiving an A1 result is at maximum vulnerability. Matter-of-fact + constructive.
  Humour is permissible, sparingly, in the WhatsApp daily drill, which is low-stakes.
- **Revisit the "never emoji in production UI" rule for the WhatsApp channel specifically.** NN/g
  does not condemn emoji; the tone research favours casual/conversational, and WhatsApp in Mexico is
  an emoji-native medium where their total absence reads as an automated corporate broadcast — the
  thing people mute. Proposal: **PWA stays emoji-free (design system holds); WhatsApp gets a tiny,
  fixed, functional emoji vocabulary** (e.g. one check for correct, one for the daily prompt) treated
  as iconography, never decoration. This is a channel-appropriate localization decision, not a
  weakening of the system — and it is Diego's call, so raise it explicitly rather than quietly
  breaking the rule.

---

## 8. Forms, names, addresses, dates, units

**Sources:** [International Sites: Minimum Requirements](https://www.nngroup.com/articles/international-sites-requirements/),
[International Web Usability](https://www.nngroup.com/articles/international-web-usability/)

- **Character sets:** "accept an extended character set that goes beyond plain ASCII." Unicode ideally.
- **Names:** a **single full-name field** is safest; splitting into first/last is "a prescription for
  confusion" in cultures with different ordering, and some people have only one name.
- **Addresses:** accommodate house numbers after street names and postal codes of varying length that
  precede city names. Say **"postal code"**, not "ZIP code."
- **Phone:** "allow for international numbers containing a varying number of digits and a country
  code." Never use letter-based phone numbers (1-800-TOO-EASY) — many keypads lack letters.
- **Dates:** **"Always spell out the name of the month."** "8/9" is ambiguous; "Aug. 9" is not.
- **Units:** provide both metric and imperial, or "be explicit about which measurement you use."
- **Availability:** state clearly if a product is only available in certain countries.

### So what do we do differently

- **Mexican names break the two-field pattern hard.** Mexican legal names routinely have two given
  names plus **two surnames** (apellido paterno + apellido materno). A `first_name` / `last_name`
  schema will mangle "José Luis Hernández Ramírez" and — worse — will mis-sort the HR employee table
  and produce wrong names on the certificate and the PDF report. **Audit `src/lib/supabase/types.ts`
  and the HR employee import for this now**; it is cheap to fix pre-pilot and expensive after.
  Recommended: store one `full_name` plus an optional `display_name` (what the learner is called on
  shift, often a nickname), and sort by the field HR actually recognizes.
- **Never spell dates numerically anywhere.** Mexico uses DD/MM/YYYY; a US-built component defaulting
  to MM/DD/YYYY will silently mislabel every date on `/hr/reports` and every exported PDF/CSV. Use
  "9 de agosto de 2026" or "9 ago 2026" in all UI and exports. This is a concrete bug class to grep
  for — check every `toLocaleDateString` call and pin the locale to `es-MX`.
- **`es-MX` everywhere, explicitly.** Number formatting, date formatting, and currency. Prices on
  `/precios` are USD — say **"USD"** explicitly next to every figure, because "$" alone reads as
  Mexican pesos to a Mexican HR director and a 20× price misread will kill a deal. This is the
  highest-consequence single-character fix in the document.
- **Phone as the primary learner identifier means E.164 storage** with country code, tolerant input
  (spaces, dashes, parens, the Mexican "1" after +52 that people still add), and validation that
  explains rather than rejects.
- **Certificates and reports must render accented characters and ñ correctly through the entire
  pipeline** — including the PDF-via-browser-print path and the client-side CSV blob export. CSV in
  particular: Excel on a Spanish Windows install will mojibake UTF-8 without a BOM. Emit a UTF-8 BOM
  on the CSV export or every HR director who opens our report sees "Hernández" as "HernÃ¡ndez" and
  concludes the product is broken.

---

## 9. Onboarding — NN/g's evidence says do less

**Sources:** [Mobile Tutorials: Wasted Effort or Efficiency Boost?](https://www.nngroup.com/articles/mobile-tutorials/),
[Mobile-App Onboarding](https://www.nngroup.com/articles/mobile-app-onboarding/),
[Instructional Overlays and Coach Marks](https://www.nngroup.com/articles/mobile-instructional-overlay/),
[Designing Empty States](https://www.nngroup.com/articles/empty-state-interface-design/)

The tutorial study — the best data in this whole area:
- **Between-subjects, remote unmoderated quantitative test on Userlytics. 70 iOS users, 35 per group.**
  Four apps (Movesum, Brainsparker, LaunchCenter Pro, Sketch.Book). No prior experience with the apps.
- Task success: **tutorial group 91%, skip-tutorial group 94%** — "This difference was not
  statistically significant (p=0.443)."
- Perceived difficulty (SEQ, 1–7, higher = easier): **tutorial 4.92, skip 5.49** — "This difference
  was statistically significant (p=0.047)." **The tutorial made the tasks feel harder.**
- Time on task: tutorial 93.49s, skip 85.17s — not significant (p > 0.1).
- NN/g: "Think twice about creating a tutorial for simple applications." Effort "would be better
  spent on making the UI easy to use and thus alleviating the need for a tutorial."

Onboarding component analysis **[opinion, no data — the article reports no sample sizes]**:
- Three components: feature promotion, customization, instructions.
- Deck-of-cards tutorials: not recommended; they "strain the user's memory" and make simple
  interfaces look complicated.
- Instructional overlays: acceptable **if timely, unobtrusive, contextual**.
- Interactive walkthroughs: viable for genuinely complex/novel workflows; learning-by-doing.
- **"Instructional onboarding should not be used to supplement poor design."**
- **"No matter the form, instructional onboarding should be brief, optional, and should only
  highlight the minimum that users need to know to use the app."**
- Onboarding is justified only when: info is required to initialize, experience is heavily
  personalized, or features are genuinely novel.
- Empty states should "provide brief yet explicit instructions or, better yet, link directly to the
  steps that need to be taken."

### So what do we do differently

- **Do not build a carousel/deck-of-cards intro for the learner app.** If one exists, remove it. The
  measured effect of tutorials was *negative on perceived ease* with no gain in success.
- **Our onboarding is justified on exactly one of NN/g's three grounds: initialization.** We need
  role (recepción / botones / restaurante) and a placement level. That's it. Two questions, then
  straight into value. Everything else — how streaks work, what CEFR means, what the exam is for —
  is contextual help delivered at the moment it becomes true.
- **The placement exam is our onboarding, and it is currently far too long to be a first
  experience.** 13 diagnostic + 10 listening + 6 speaking prompts is a serious ask of a tired worker
  on a break. Consider: run a 3-question micro-placement, deliver a first real drill inside 60
  seconds, and complete the full exam over the first week. The buyer wants a defensible CEFR score;
  they do not care whether it was collected in one sitting. This preserves the $50 placement wedge
  while removing the biggest first-session drop-off risk.
- **Do the mic-permission explainer as an instructional overlay** — this is NN/g's "timely,
  unobtrusive, contextual" case, and it is a genuinely novel interaction for this user. One sentence
  before the browser prompt: what will happen, why, and that no one else hears it. (That last clause
  matters more than the others for an embarrassed learner.)
- **Empty states in `/hr` are a sales surface, not a void.** An HR director logging in before any
  employee has tested must see what the populated dashboard will look like plus one clear next
  action, not "no data." NN/g: link directly to the step that populates it.

---

## 10. Error messages

**Sources:** [Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/),
[10 Design Guidelines for Reporting Errors in Forms](https://www.nngroup.com/articles/errors-forms-design-guidelines/)

Definition: "a system-generated interruption to the user's workflow that informs the user of an
incomplete, incompatible, or undesirable situation."

Visibility: show the error **near its source**; use redundant, accessible indicators (bold,
high-contrast, red) — **never color alone** (≈350 million people have color-vision deficiency);
match severity to weight (toast vs modal); don't fire errors prematurely during exploration.

Communication: human-readable language, no jargon or codes (NN/g notes the 404 page violates this);
describe the issue concisely and precisely, not "An error occurred"; offer constructive advice;
**positive tone, no blame — avoid "invalid," "illegal," "incorrect."**

Efficiency: safeguard against likely mistakes; **preserve user input** — let users edit rather than
restart; reduce correction effort with a short list of suggested fixes; educate concisely.

The 10 form guidelines: inline validation whenever possible; confirm successful entry on complex
fields; keep messages next to the field; use color to differentiate state; add icons or subtle
animation (never animated text); use modals sparingly; **don't validate before input is complete**;
never use a top-of-page summary as the only indicator; **never use tooltips to report errors**;
provide extra help after a user hits the same error 3+ times.

### So what do we do differently

- **Rewrite every learner-facing error in blame-free Spanish.** For a learner who is embarrassed
  about their English, "Respuesta incorrecta" is a small wound repeated forty times a week. Prefer
  "Casi. La respuesta es…" / "Escuchemos otra vez." Never "inválido," "ilegal," "error." Ban
  "incorrecto" from learner feedback strings.
- **Never lose a recording or an answer, and never say "upload failed."** CLAUDE.md already commits
  to this — NN/g's "preserve user input" guideline is the research backing. The offline answer queue
  on the post-MVP list is not a nice-to-have; on a prepaid plan with spotty data it is the difference
  between a working product and an abandoned one.
- **The 3-strikes rule maps directly onto our pedagogy.** NN/g: repeated identical errors signal a
  design flaw and warrant extra help. In our case they signal a *content* gap — after three misses on
  the same construction, escalate to a different explanation or drop the difficulty. Instrument this;
  it is also the most valuable teaching signal we can collect.
- **Never report a learner error in a tooltip or a modal.** Inline, adjacent, and dismissible by
  continuing.
- **Color-plus-icon, always.** Our semantic tokens are `success #3E6D4D`, `warn #B38540`,
  `error #A84738`. Every one of them needs a shape or an icon alongside. Check contrast of these on
  ivory `#F5F0E6` — dark-on-light should pass, but verify at the small sizes used in the drill UI.

---

## 11. Progress indicators, waiting, and response time

**Sources:** [Progress Indicators Make a Slow System Less Insufferable](https://www.nngroup.com/articles/progress-indicators/),
[Response Time Limits](https://www.nngroup.com/articles/response-times-3-important-limits/)

Thresholds:
- **< 1 s** — no indicator needed.
- **1–2 s** — immediate feedback required; avoid looped animation.
- **2–10 s** — looped animation (spinner).
- **10 s +** — percent-done indicator.

The headline number: **"People who saw the moving feedback bar experienced higher satisfaction and
were willing to wait on average 3 times longer than those who did not see any progress indicators."**

Other guidance: always give immediate feedback; include text explanation ("Loading comments…",
"Updating address 3 of 50"); **static indicators should be replaced** — they don't carry enough
information; **never use "don't click again" warnings** — "The way to avoid extra clicks is to show
the user that the first click has been accepted"; for percent-done bars, "Start the progressive
animation slower and allow it to move faster as it approaches the end."

### So what do we do differently

- **The 3× wait-tolerance multiplier is our single best defence against spotty prepaid data.** Every
  network-dependent step in the learner flow — voice upload, scoring dispatch, audio fetch — must
  have a determinate, labelled, moving indicator. This is cheap to build and directly buys retention
  on bad connections.
- **`/api/score-speaking` is the critical case.** Whisper + Claude scoring will routinely exceed 10 s,
  which puts it firmly in percent-done territory, and the results page currently polls. Replace any
  bare spinner with a labelled staged indicator: "Transcribiendo tu voz…" → "Evaluando pronunciación…"
  → "Preparando tu resultado…". Staged text does the work of a percent bar when true percentage is
  unknowable, and it also communicates that real analysis is happening — which is the product's
  perceived value.
- **Audit the double-submit paths.** The exam persists each answer before navigation. If any screen
  shows "no vuelvas a presionar," replace it with a state change that makes the first press
  obviously accepted (button disables + inline spinner + label change).
- **Distinguish learning progress from system progress.** A CEFR progress bar (A1→B2) and a
  "loading" bar must never look alike. Different shape, different placement, different color role.
  Getting these confused is a real risk in a product where "progress" means two things.

---

## 12. Mobile reading and typography

**Sources:** [Reading Content on Mobile Devices](https://www.nngroup.com/articles/mobile-content/),
[Typography for Glanceable Reading: Bigger Is Better](https://www.nngroup.com/articles/glanceable-fonts/)

**Important correction to a widely-repeated claim.** The old "mobile content is twice as difficult"
line comes from Singh et al. (University of Alberta, 2011). **NN/g's own 2016 study did not
replicate it.**
- 276 participants across four phases; 1,629 total cases. Easy articles averaged 404 words at 8th-grade
  level; hard articles averaged 988 words at 12th-grade level. Participants alternated between phone
  and computer, then answered comprehension questions.
- Result: "Comprehension on mobile was about 3 percentage points higher than on a computer"
  (statistically significant, not practically meaningful).
- "Easy passages were read about as fast on both devices, but hard passages actually took longer on
  mobile versus computer" — about **30 ms more per word** on mobile for difficult content.
- Recommendation stands for complex material: prioritize brevity and cut unnecessary content, and
  "run your own usability studies of any high-complexity material."

Glanceable typography (Dr. Ben D. Sawyer, MIT AgeLab; lexical-decision task; 3 mm vs 4 mm text,
uppercase vs lowercase, condensed vs regular, Frutiger; all effects p<0.01):
- **"Lowercase lettering required 26% more time for accurate reading than uppercase, and condensed
  text required 11.2% more time than regular."**
- Larger sizes beat smaller; the lowercase penalty **worsens at small sizes**.
- **Explicit scope limit, verbatim:** "These findings don't necessarily apply to scanning or reading
  longer text. We generally *don't* recommend using all-caps text for longer passages where users
  consume multiple words." The study used isolated words, not sentences.

### So what do we do differently

- **Stop repeating "mobile is twice as hard" — it's not NN/g's current position.** The defensible
  statement is that *difficult* content costs measurably more on mobile, and English at A1–A2 is
  difficult content for our user. So the brevity mandate holds for us specifically, on the grounds of
  material difficulty, not screen size.
- **The glanceable-typography result vindicates our `.caps` style — narrowly.** JetBrains Mono, 10px,
  uppercase, 0.2em tracking is a legitimate glanceable treatment for single-word labels. But **10px is
  small**, and the study's clearest finding is that bigger wins and that small size amplifies
  penalties. Raise `.caps` to at least 11–12px on learner surfaces, or reserve it strictly for buyer
  surfaces viewed at desk distance. A tired bellboy in a back-of-house corridor is the AgeLab's
  "distracting environment."
- **Do not extend all-caps beyond single words.** NN/g says so explicitly. Any multi-word caps label
  in the drill UI should go sentence-case.
- **Avoid condensed and light weights on learner surfaces.** 11.2% slower, p<0.01. New Spirit 300 is
  a beautiful editorial weight and the wrong choice for anything a learner reads on a phone in a
  service corridor. Restrict 300 to buyer-facing display type; use 400/500 minimum in the app.
- **Set a real minimum body size.** Nothing a learner reads should be below 16px, and drill target
  text should be considerably larger.

---

## 13. Icons

**Sources:** [Icon Usability](https://www.nngroup.com/articles/icon-usability/),
[Classifying Icons](https://www.nngroup.com/articles/classifying-icons/),
[Usability Testing of Icons](https://www.nngroup.com/articles/icon-testing/)

- "A text label must be present alongside an icon to clarify its meaning in that particular context."
  Icon understanding is based on prior experience, and there is no standard usage for most icons.
- **Resemblance icons** (depicting the thing) generally have the best usability; **arbitrary** icons
  work only when already widely standardized.
- Testing methods: **icon intuitiveness test** — show the icon to ~5 users *without* its label and ask
  what they think it means; **recognition testing** out of context; **time-to-locate** plus
  first-click rate.
- NN/g's international warning is blunter: "don't use icons that give your users the finger (or the
  foot, or other gestures that are offensive in their culture)" and avoid culture-specific metaphors
  (their example: baseball references). Their own international test found users "didn't understand
  the difference between the Information button and the Documentation button."

### So what do we do differently

- **Every icon in the learner app carries a Spanish text label. No exceptions, no icon-only nav.**
  This is the highest-frequency, lowest-cost correctness fix available and it compounds with the
  Level 1 skill constraint.
- **Run the 5-user unlabelled intuitiveness test on our icon set during the pilot.** It costs an hour
  and is the only way to know whether our microphone, replay, streak and level icons read at all.
  Highest-risk candidates: anything abstract representing "CEFR level," "racha/streak," or "módulo."
- **Audit for hand gestures and culture-bound metaphors.** No thumbs-up, no OK sign, no pointing
  hands — all are risky or offensive in parts of LATAM and beyond, and they cost us nothing to avoid.
- **Prefer resemblance icons drawn from the job**, not from generic UI kits: an actual bell, an actual
  key card, an actual tray. This also does double duty on the imagery guidance in §6 — job-specific
  iconography is culturally located and informationally useful.

---

## 14. WhatsApp / conversational channel

**Sources:** [The User Experience of Chatbots](https://www.nngroup.com/articles/chatbots/),
[Customer-Service Chat: 20 Guidelines](https://www.nngroup.com/articles/chat-ux/)

- A chatbot is "a domain-specific text-based conversational interface that supports users with a
  limited set of tasks."
- **Be transparent that it's a bot** — "Users are pleased when the business is transparent about
  using a bot because they can calibrate their expectations and language," tending to be more direct
  and keyword-based.
- **State capability up front:** on first open, "the chatbot should clearly and concisely indicate
  what it can do, as vague greetings leave users guessing."
- Visually distinguish agent from user messages; show timestamps.
- **Buttons and links beat free-text input** — "predetermined links and buttons save users from
  typing."
- If a response is slow, say so — progress indication applies in chat too.
- Availability must be continuous; "a chatbot that disappears between pages is one that users will
  stop trying to use."

### So what do we do differently

- **Buttons over typing is the governing rule for the WhatsApp drill.** WhatsApp supports quick-reply
  buttons and list messages; use them for every answer selection. Free-text answers require English
  spelling on a Spanish keyboard — the exact combination NN/g's international research flagged
  ("every single participant made spelling mistakes in English"). Reserve free input for **voice
  notes**, which is the natural WhatsApp affordance and also our pedagogically richest signal.
- **Say what it is in message one.** Not "¡Hola! 👋 Soy tu asistente" — instead: what this is, how
  long it takes (one line), and what happens today. NN/g's transparency finding says being open about
  automation *improves* the interaction; it doesn't cheapen it.
- **Keep the daily drill to a genuinely bounded set of tasks.** NN/g's definition of a workable
  chatbot is "a limited set of tasks." Resist building a general conversational tutor before the
  bounded drill loop is proven — that also matches CLAUDE.md's post-MVP sequencing.
- **Timestamps and delivery states come free in WhatsApp** — one more reason the channel beats a
  custom chat surface. Don't rebuild in-app what WhatsApp already does correctly.
- **`/demo/conversacion` should mirror the real constraints**, not an idealized version. If the demo
  shows free-text conversation we can't ship, we're selling something we won't deliver.

---

## 15. Language switching (banked for multi-language)

**Sources:** [6 Tips for Improving Language Switchers on Ecommerce Sites](https://www.nngroup.com/articles/language-switching-ecommerce/),
[International Web Usability](https://www.nngroup.com/articles/international-web-usability/),
[Flag Problems](https://www.nngroup.com/articles/flag-problems/)

1. Default to the language matching the browser settings — "the simplest for users because they don't
   have to interrupt their task."
2. Desktop: top corners (users look upper-right first, then top-left).
3. Mobile: above the fold or inside the nav menu.
4. **Name each language in that language** — "Español," not "Spanish."
5. Combine symbols (flag + currency + language name) for findability.
6. Let users change language, country, and currency **separately**.

The failure that motivates all of this, from the international-testing article: a Chinese user
"scrolled 13 screenfuls" before finding the language options in the footer — "why do they put it at
the end of such a long page? I may have missed it."

Flags are a language-selection anti-pattern: "some languages are spoken in many countries… using an
American flag for the English language understandably makes the British upset."

### So what do we do differently

- **Not needed today** — the product is Spanish-first for a Spanish-speaking market, and adding a
  language switcher now would add a Level-2 decision for a Level-1 user with zero benefit.
- **When the platform expands** (Portuguese for Brazil; or English-language chain HQ dashboards): a
  language switcher belongs in the **HR/chain-admin** surface, never in the learner app — the learner's
  interface language is a property of their enrollment, set by HR, not a choice they make.
- **Never use flags for language.** Spanish across 20 countries is the textbook case NN/g warns about;
  a Mexican flag on "Español" would actively alienate Colombian and Dominican users, which is a real
  cost given LATAM expansion is in the plan.

---

## 16. What NN/g does *not* give us (do not fabricate these)

- **No tú/usted or Spanish-register research.** The §7 recommendation is reasoned from NN/g's tone
  framework plus market knowledge, and is explicitly a hypothesis to test.
- **No Spanish text-expansion percentage.** NN/g gives a 50% rule of thumb for "languages other than
  English" generally. The per-length table is IBM's, via W3C.
- **No Mexican or LATAM literacy/skill data.** The 43% low-literacy figure is US NAAL (2003 data,
  article published 2005). PIAAC's problem-solving module did not cover Mexico in round 1. Neither
  can be quoted as a Mexican statistic.
- **No hospitality, workplace-training, or language-learning research.** Nothing NN/g publishes
  addresses habit formation, spaced repetition, or whether streaks work. The Duolingo comparison must
  be argued from other evidence.
- **No research on emoji.** The §7 WhatsApp recommendation is inference from the tone study plus
  channel norms, not an NN/g finding.
- **No PWA-vs-native or offline-UX guidance surfaced in this research.** The offline queue design has
  to come from elsewhere.
- **The visual-complexity finding measures aesthetic appeal ratings of screenshots, not learning or
  task outcomes.** It is a strong reason to test our aesthetic, not proof it is wrong.

---

## 17. Ranked action list

| # | Action | Effort | Why it ranks here |
|---|---|---|---|
| 1 | Field study: observe 2 shifts + 5 contextual interviews before further building | Days | NN/g's #1 cross-cultural instruction; MEMORY.md says we are over-built/under-validated |
| 2 | Label prices "USD" on `/precios`; pin all dates/numbers to `es-MX`; spell out months | Hours | A 20× price misread kills deals; date ambiguity corrupts every HR report |
| 3 | Fix the name model for Mexican double surnames (`full_name`, not first/last) | Hours | Cheap now, expensive after data exists; breaks certificates + sorting |
| 4 | Add UTF-8 BOM to the CSV export; verify ñ/accents through PDF print path | Hours | Buyer-visible correctness; trivially avoidable credibility loss |
| 5 | Replace bare spinners with staged labelled progress on `/api/score-speaking` | Hours | 3× wait tolerance; directly buys completion on prepaid data |
| 6 | Remove/never build a deck-of-cards tutorial; cut onboarding to role + micro-placement | Days | Measured: tutorials made tasks *feel harder* (p=0.047), no success gain |
| 7 | Rewrite all learner error/feedback strings blame-free; ban "incorrecto"/"inválido" | Days | NN/g tone + our embarrassed-learner reality |
| 8 | Spanish readability lint (Fernández Huerta/INFLESZ) over `src/content/*` in CI | Days | Mechanizes the 6th-grade floor; 33%→65% recall is the prize |
| 9 | Type-scale audit: min 16px body, `.caps` ≥11px, no weight-300 or condensed in-app | Days | p<0.01 legibility effects; our tokens currently violate this |
| 10 | Text-label every icon; run the 5-user unlabelled icon test in the pilot | Days | Highest-frequency low-cost fix under the Level-1 constraint |
| 11 | Move learner auth to phone/WhatsApp; kill email+password for learners | Weeks | The real localization debt — auth, not copy |
| 12 | Split the design system: keep editorial for buyer, test a warmer learner theme | Weeks | Reinecke & Gajos points against our aesthetic for this exact population |
| 13 | Decide the emoji-in-WhatsApp policy explicitly with Diego | Hours | Design-system rule vs channel norms — needs an owner's decision, not a quiet break |

---

## 18. Source index (all read directly)

**NN/g**
- Lower-Literacy Users — https://www.nngroup.com/articles/writing-for-lower-literacy-users/
- Crosscultural UX Design — https://www.nngroup.com/articles/crosscultural-design/
- International Usability Testing: Why You Need It — https://www.nngroup.com/articles/why-international-usability-testing/
- International Usability: Big Stuff the Same, Details Differ — https://www.nngroup.com/articles/international-usability-details-differ/
- International Sites: Minimum Requirements — https://www.nngroup.com/articles/international-sites-requirements/
- International Web Usability — https://www.nngroup.com/articles/international-web-usability/
- International B2B Audiences — https://www.nngroup.com/articles/international-b2b/
- Language Switchers on Ecommerce Sites — https://www.nngroup.com/articles/language-switching-ecommerce/
- The Distribution of Users' Computer Skills — https://www.nngroup.com/articles/computer-skill-levels/
- Mobile Tutorials: Wasted Effort or Efficiency Boost? — https://www.nngroup.com/articles/mobile-tutorials/
- Mobile-App Onboarding — https://www.nngroup.com/articles/mobile-app-onboarding/
- Error-Message Guidelines — https://www.nngroup.com/articles/error-message-guidelines/
- 10 Design Guidelines for Reporting Errors in Forms — https://www.nngroup.com/articles/errors-forms-design-guidelines/
- Progress Indicators — https://www.nngroup.com/articles/progress-indicators/
- Response Time Limits — https://www.nngroup.com/articles/response-times-3-important-limits/
- Reading Content on Mobile Devices — https://www.nngroup.com/articles/mobile-content/
- Typography for Glanceable Reading — https://www.nngroup.com/articles/glanceable-fonts/
- F-Shaped Pattern of Reading — https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- The Impact of Tone of Voice on Users' Brand Perception — https://www.nngroup.com/articles/tone-voice-users/
- The Four Dimensions of Tone of Voice — https://www.nngroup.com/articles/tone-of-voice-dimensions/
- 7 Tips for Memorable and Easy-to-Understand Imagery — https://www.nngroup.com/articles/7-tips-memorable-imagery/
- Photos as Web Content — https://www.nngroup.com/articles/photos-as-web-content/
- Legibility, Readability, and Comprehension — https://www.nngroup.com/articles/legibility-readability-comprehension/
- Icon Usability — https://www.nngroup.com/articles/icon-usability/
- The User Experience of Chatbots — https://www.nngroup.com/articles/chatbots/
- Designing Empty States — https://www.nngroup.com/articles/empty-state-interface-design/
- Instructional Overlays and Coach Marks — https://www.nngroup.com/articles/mobile-instructional-overlay/

**Non-NN/g primary sources**
- W3C i18n, "Text size in translation" (IBM expansion table) — https://www.w3.org/International/articles/article-text-size.en.html
- Reinecke, K. & Gajos, K. Z. (2014). *Quantifying Visual Preferences Around the World.* CHI '14,
  pp. 11–20 — https://www.eecs.harvard.edu/~kgajos/papers/2014/reinecke14visual.shtml
- OECD PIAAC (2011–2015), via NN/g's computer-skills analysis
- US Dept. of Education, National Assessment of Adult Literacy (NAAL), via NN/g's lower-literacy article

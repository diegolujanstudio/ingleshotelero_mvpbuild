# Google's "Next Billion Users" — Research Brief for Inglés Hotelero

Compiled 2026-07-26. Method: primary-source WebFetch against Google Design, Android
developer docs, web.dev, blog.google, IDEO/Google/Gates digital-confidence material,
plus INEGI/DataReportal/GSMA for LATAM calibration. Third-party summaries are flagged
as such. Numbers I could not verify against a primary document are marked
**[UNVERIFIED]** and should not be quoted externally.

---

## 0. Executive posture — read this first

Google's NBU corpus is the single best-documented body of "design for constrained users"
work in existence. But it was mostly produced 2016–2021 and its field sites were India,
Nigeria, Indonesia, Kenya, Brazil. **Mexico in 2026 is not India in 2016.** Applying NBU
literally would make us build a 2G-era app for a country with 33 Mbps median mobile
download speed.

The correct read is a **split**:

| NBU finding class | Transfers to our learner? | Why |
|---|---|---|
| Raw bandwidth scarcity (2G, 250MB/mo) | **Weakly** | Mexico: 97.7% of connections are 3G/4G/5G; 33.10 Mbps median mobile download (Ookla via DataReportal, Jan 2025) |
| Data *cost anxiety* and prepaid rationing | **Strongly** | Mexican prepaid users averaged 155.4 pesos/month (INEGI ENDUTIH 2023). Prepaid is the default for hourly hospitality staff. Anxiety outlives the constraint. |
| Storage scarcity / install resistance | **Strongly** | Mid-range Android, photo-full phones. Install friction is the #1 PWA argument. |
| Low digital confidence / fear of breaking things | **Very strongly** | This is about prior experience with school and institutions, not bandwidth. Compounded by English shame. |
| Voice as primary input; stigma around voice | **Very strongly** | We are a *speaking* product. This is the highest-leverage section of the whole corpus. |
| Shared devices / "one person one account" is wrong | **Moderately** | Hotel staff share phones with family, and shift workers sometimes share a back-of-house device. |
| Anti-minimalism aesthetic finding | **Contested** — see §7 | Direct tension with our design system. Do not over-apply. |
| Intermediated / assisted use | **Strongly** | Onboarding will happen in an HR-run group session, not solo. Design for the intermediary. |

**The one-line takeaway:** our constraint is not the network, it is *confidence,
consent-to-spend-data, storage, and the 30 seconds of attention a tired bellboy has at
shift change.* Optimize for those, not for 2G.

---

## 1. Source corpus (what I actually read)

Primary:
- Google Design, *Connectivity, Culture, and Credit — nine ways designers can create effective products for emerging markets* — https://design.google/library/connectivity-culture-and-credit
- Google Design, *Making YouTube Go* — https://design.google/library/making-youtube-go
- Google Design, *Sketch, Scroll, or Swipe?* — https://design.google/library/sketch-scroll-or-swipe
- Android Developers, *Build for Billions* (overview + connectivity, device-capacity, data-cost, UI sub-pages) — https://developer.android.com/docs/quality-guidelines/build-for-billions
- web.dev, *Your first performance budget* — https://web.dev/articles/your-first-performance-budget
- web.dev, *Adaptive loading — improving web performance on slow devices* (Osmani) — https://web.dev/articles/adaptive-loading-cds-2019
- blog.google, *How to help people navigate the internet, voice-first* (Voice Playbook launch) — https://blog.google/innovation-and-ai/technology/next-billion-users/voice-users-playbook/
- blog.google, *An anthology of insights, for a more inclusive internet* — https://blog.google/innovation-and-ai/technology/next-billion-users/anthology-insights-more-inclusive-internet/
- Google Developers Blog, *Building better products for new internet users* — https://developers.googleblog.com/building-better-products-for-new-internet-users/
- IDEO, *5 Tools to Design for Digital Confidence* (IDEO × Google NBU × Gates Foundation) — https://www.ideo.com/journal/5-tools-to-design-for-digital-confidence
- Android Developers Blog, *Optimize for Android (Go edition): lessons from Google apps, Part 1* — https://android-developers.googleblog.com/2022/09/optimize-for-android-go-lessons-from-google-apps-part-1.html
- DataReportal, *Digital 2025: Mexico* — https://datareportal.com/reports/digital-2025-mexico
- INEGI ENDUTIH press releases 2024/2025 — https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2024/ENDUTIH/ENDUTIH_23.pdf

Secondary / could not fully verify (flagged in text):
- Voice Playbook PDF itself (https://nextbillionusers.google/tools/voice-playbook.pdf — served but >10MB, could not be parsed in-session; contents corroborated via blog.google launch post + Voicebot coverage)
- 99% Invisible, *The Next Billion Users* transcript (interviews Google's Asif Baki, Payal Arora)
- Sambasivan, Cutrell, Toyama, Nardi — *Intermediated technology use in developing communities*, CHI 2010, https://dl.acm.org/doi/10.1145/1753326.1753718 (abstract-level only; ACM and the author PDF both blocked/unparseable)
- Sambasivan et al., SOUPS 2018, *"Privacy is not for me, it's for those rich women"* — 403 on USENIX PDF

**Note on site status:** `nextbillionusers.google` now 301-redirects to blog.google. The NBU
site's A–Z anthology and research index are effectively retired. The PDFs are still served
from `static.googleusercontent.com/media/nextbillionusers.google/en/tools/...` — if we want
the Voice Playbook verbatim, download it out-of-band.

---

## 2. The nine principles (Google Design) — verbatim findings and our translation

Source: https://design.google/library/connectivity-culture-and-credit

### 1. "Internet access isn't guaranteed"
Findings: products must survive switching WiFi → 3G → 2G → nothing. Manila commuters
stuck 3+ hours/day navigating connectivity pockets. India internet access cited at 17%
(dated). **"YouTube Go app was designed to be 'offline first' meaning that it's usable
even when it isn't connected to the internet."**

→ **IH:** Our failure mode is not "no signal in the village." It is *back-of-house*: service
corridors, laundry, basement lockers, staff cafeterias — dead zones inside a connected
hotel. And it is the commute (bus from Cancún centro to the hotel zone), which is exactly
where a 5-minute drill fits. Offline-first is required not for the country but for the
*building and the bus*.

### 2. "Smaller, simpler devices are the norm"
$40–60 devices, 512MB memory, small low-res screens, limited battery. Second-hand phones,
dual SIM. **Google Translate was designed to use only 5MB storage.**

→ **IH:** Set a hard storage budget for our cached audio/drills. Google shipped Translate
at 5MB. Our entire offline drill cache — audio included — should have a stated ceiling and
be *visible and clearable by the user*.

### 3. "Data is limited"
~95% of emerging-market users on expensive prepaid; often only ~250MB/month affordable.
Users power phones down at night to avoid accidental spend. **"When a $0.99 app can cost
as much as an entire meal, you really need to consider how to optimize."**

→ **IH:** The behavior that transfers is not the 250MB; it is **prepaid users treat every
byte as a discretionary purchase**. If our app downloads audio without asking, we are
spending our learner's money without consent. That is a trust-destroying act, and worse,
it is *invisible* — they'll blame the app for "eating data" and uninstall.

### 4. "Forget about credit cards"
~38% of world unbanked; <2% of Indians hold credit cards; cash-on-delivery dominates;
M-PESA-style mobile money.

→ **IH:** Non-issue for the learner (B2B — the hotel pays). Relevant only if we ever go
B2C/self-serve in LATAM, where OXXO/SPEI/cash vouchers, not cards, are the answer.

### 5. "Bridge the cultural divide"
Researchers embody privilege. Google Station research in India found women feared public
WiFi after a profile photo was copied and misused. Portal states **"Your number is safe
with us"** with linked FAQs. Hike lets users password-hide chats on family-shared devices.

→ **IH:** Two direct implications. (a) Voice recordings of a learner's bad English are
*sensitive*. Say explicitly, in Spanish, on the recording screen, who can hear it. (b) The
employee will assume their boss hears everything. We must decide and then *state* the
policy — not bury it in a privacy page.

### 6. "Get beyond language"
India: 22 languages with >1M speakers. Non-literate users served by visual interfaces
minimizing text input and language hierarchy. Ugandan user learns apps through "symbolic
and visual literacy," searches Google Images instead of text results.

→ **IH:** Our learner is literate in Spanish but *functionally illiterate in the interface
language of the thing they're learning*. Never make English the chrome. Every instruction,
error, and label in Spanish; English appears only as content-under-study, visually marked
as such.

### 7. "Leverage human relationships"
**"social media is the internet."** Devices and data are shared. Word-of-mouth builds
trust. Google Station research: train passengers asked shopkeepers for information even
though TVs and speakers displayed it — so Google deployed **on-site human agents** to build
person-to-person trust. YouTube Go added offline peer-to-peer video sharing.

→ **IH:** This is a go-to-market finding as much as a design one. Adoption will not come
from a push notification; it comes from a supervisor who already did it and one respected
peer on the shift. Build for the **champion**, not the individual.

### 8. "Leave minimalism at the door"
Users rejected apps with white space and muted colors — **"I don't like the way it looks."**
Western minimal aesthetics lack impact in sensory-rich environments. UC Browser's dense
design cited as locally successful.

→ **IH:** See §7 below. This is the finding most in tension with our design system and the
one most likely to be misapplied.

### 9. "Design for delight"
Users facing daily hardship appreciate surprising, charming design. Even utility apps need
personality.

→ **IH:** Directly supports "engaging, not school." Our design system's austerity must not
read as *clinical*. Delight is allowed — it just has to come from motion, typography,
copy voice, and reward moments, not from bright color.

**Bonus:** get out of the studio. Field research reveals usage that differs from designer
intent.

---

## 3. Hard numbers we can build to (Android Build for Billions + web.dev)

These are the citable thresholds. Sources in §1.

**Device / memory**
- Android (Go edition) targets devices with ≤1GB RAM (2017–2019: 512MB; 2020–2021: 1GB; 2022: 2GB) — Android Developers Blog, Go edition Part 1
- Proportional Set Size ceiling Google sets for its own apps: **90MB for apps, 150MB for games**
- Go edition app package must be **under 40MB**
- **Startup must be under 5 seconds**
- Runtime signals: `isLowRamDevice()`, `getMemoryClass()`; on web the equivalents are
  `navigator.deviceMemory`, `navigator.hardwareConcurrency`

**Network**
- Google's stated planning assumption: *"Over half of all users worldwide will experience
  your app over a 2G connection"* (dated but it is their published number)
- Their prefetch illustration: **3 articles at a time on 2G vs 20 on Wi-Fi**
- Adaptive signals on web: `navigator.connection.effectiveType` (`slow-2g|2g|3g|4g`),
  `navigator.connection.saveData`, `Save-Data` request header, `Device-Memory` client hint
- Twitter's Data Saver result cited by Osmani: **50% image-data savings on iOS/Android,
  80% on web**

**Data cost**
- *"Data plans in some countries cost upwards of 10% of a typical user's monthly income"*
  — developer.android.com/.../build-for-billions/data-cost

**Web performance budget (web.dev, "Your first performance budget")**

| Network | Device | JS | Images | CSS | HTML | Fonts | Total | TTI |
|---|---|---|---|---|---|---|---|---|
| Slow 3G | Moto G4 | 100 KB | 30 | 10 | 10 | **20** | **~170 KB** | **5 s** |
| Slow 4G | Moto G4 | 200 KB | 50 | 35 | 30 | 30 | ~345 KB | 3 s |
| WiFi | Desktop | 300 KB | 250 | 50 | 50 | 100 | ~750 KB | 2 s |

Also: *"set Lighthouse performance score budget to at least 85 (out of 100)"*, and the
"20% rule" — be 20% faster than the competitor for the difference to be perceptible.

**UI responsiveness**
- Target **60 fps → 16 ms per frame** on low-cost devices
- *Never* block the UI with loading indicators; one activity indicator per operation max
- Tactile feedback on **every** touchable element to reduce *perceived* latency
- Handle empty states with starter content or best-match options, never a blank screen
- Reduce or remove animations on low-cost devices
- Use placeholder UI rather than spinners for launch

### Immediate audit finding against our repo
`public/fonts/` contains **six OTF files, ~64–69 KB each (~406 KB total)**:
NewSpirit Light / Regular / Medium / SemiBold / Bold / Condensed. Google's slow-3G font
budget is **20 KB**. Even two OTFs blow it by ~7×. OTF is also the wrong container for web.

→ Action: subset to Latin + the exact glyphs used, convert to **WOFF2**, ship **at most two
weights** on the learner surface, `font-display: swap`, and preload only the display face.
This is likely the single largest byte win available and it costs zero design change.
(A service worker already exists — `public/sw.js` + `workbox-000be579.js` — so the fonts
will be cached after first load; the cost is the *first* load, which is exactly the moment
we lose people.)

---

## 4. YouTube Go — the most directly transferable case study

Source: https://design.google/library/making-youtube-go

2014 research in India, Brazil, Nigeria found data consumption felt **mysterious and
unpredictable**. A 20-year-old entrepreneur in Lagos: **"data just flies away."** A
24-year-old IT specialist in Jaipur, after streaming music: **"That data is burnt."**

Five principles they landed on:

1. **Don't just retrofit a degraded version.** They tested low-res keyframes with audio
   overlay. Users rejected it hard — a Gurgaon participant: **"Just because I have less
   data, does not mean I want a bad experience—video is video."**
2. **Respect prepaid budgets.** 96% of Indian users on prepaid bought at local kiosks and
   rationed daily. Solution: **"video preview"** — keyframes plus the **exact file size**
   shown *before* the user spends anything.
3. **Human information networks.** Friend recommendations beat algorithmic ones; users
   browsed friends' galleries and sideloaded via SD card. Solution: **nearby sharing** over
   local Wi-Fi.
4. **Offline is the normal state, not an error.** Beta testing showed *downloading* was the
   most frequently observed behavior. One-tap and bulk download; offline treated as normal.
5. **Locally relevant content.** International content didn't resonate; regional home
   screens in local languages.

→ **IH translation — this is a spec, not an inspiration:**

- **Never auto-download audio.** Before any pack downloads, show: *"Semana 3 · 12 ejercicios ·
  4.2 MB · ~3 min con Wi-Fi."* Exact MB. Google proved the exact number is the trust unlock.
- **Offer "descargar la semana" on Wi-Fi**, then run the whole week offline. Mirrors their
  bulk-download finding and matches shift-worker reality (download at home, drill on the bus).
- **Do not degrade the audio to save bytes.** "Video is video" → *"la pronunciación es la
  pronunciación."* A learner listening to a crunchy 16 kbps native speaker learns the wrong
  thing and feels condescended to. Compress the UI, not the pedagogy. (Concretely: keep
  speech audio at a quality where phonemes are unambiguous; cut bytes from images, JS,
  and fonts instead.)
- **Show a running "data used this week" number** in the app. Make the invisible visible;
  that is the entire YouTube Go thesis.
- **Peer sharing analog:** let a learner send a drill or their own recording to a
  co-worker over WhatsApp. Cheap to build (share sheet), and it plugs straight into the
  "human information networks" finding *and* our WhatsApp channel.

---

## 5. Digital confidence — the highest-leverage section for us

Sources: IDEO × Google NBU × Gates Foundation, https://www.ideo.com/journal/5-tools-to-design-for-digital-confidence
and https://digitalconfidence.design (site is JS-rendered; content confirmed via IDEO and
Google secondary coverage). Validated with 22 product teams including Google Pay, Flipkart,
Airtel, Hindustan Unilever (as of May 2020).

Findings:
- **Fear of irreversible error.** Indonesian participant: *"If I click the wrong button, my
  money might go somewhere else."* Generalized: novice users fear **breaking something**.
- **Convention illiteracy.** A shopping-cart icon means nothing to someone who's never used
  a supermarket cart. Account prerequisites (e.g. "you need a Gmail") confuse when the
  relationship between companies isn't understood.
- **Social learning is preferred.** People would rather learn beside family and neighbors
  than troubleshoot alone.
- **Voice used as an escape from typing** — *"nearly a third of Indian search queries use
  voice because typing is hard"* — but voice errors alienate users still learning phones.
- **"Look before you leap."** Let people preview an experience risk-free. Preview overcomes
  the fear of doing something "wrong."
- Stated design principles: **multiple modes of interaction; timely guidance; celebrate
  wins early and often.**
- Novice internet users ≈ **2.5 billion of ~4.7 billion internet users** globally
  [reported via secondary summary — treat as directional].

→ **IH translation:**

- **Nothing in the learner app may be irreversible or feel irreversible.** Every recording
  is re-recordable. Every answer is changeable until submit. Say so *on screen*, in
  Spanish, before the first recording: *"Puedes repetirlo las veces que quieras. Nadie más
  escucha esto todavía."*
- **The placement exam is our biggest confidence hazard.** Framed as an exam it triggers
  every school failure the learner has. Frame it as *calibration*: "esto no se aprueba ni
  se reprueba — sirve para darte el nivel correcto." Show a low-stakes practice item before
  the real first item ("look before you leap").
- **Ship a real preview mode.** A no-login, no-mic, 30-second walkthrough of one drill —
  tap-through, nothing recorded, nothing sent. This is both the digital-confidence unlock
  *and* the sales demo. We already have `/demo/conversacion`; make the learner-facing
  equivalent exist inside the app's front door.
- **First win inside 60 seconds.** "Celebrate wins early and often" is a documented
  principle, not a growth-hack. The first session must end with the learner having *said
  one useful English sentence correctly* and being told so.
- **Multiple modes:** every drill answerable by tap OR by voice. Never voice-only — see §6
  on stigma. Never tap-only — see literacy and speed.
- **Design for the intermediary.** Onboarding will realistically be an HR-run 20-minute
  group session in a break room. Build a *supervisor-led* onboarding path: a printable /
  projectable one-pager, a shared join code, and an install flow that survives being done
  by someone else on the learner's phone. (Sambasivan et al., CHI 2010, formalized this as
  *intermediated technology use* — non-literate or low-skill users benefiting from
  technology through a digitally skilled helper. We should treat the helper as a first-class
  user role.)

---

## 6. Voice — read this twice, it is our core mechanic

Sources: https://blog.google/innovation-and-ai/technology/next-billion-users/voice-users-playbook/
(Google's own launch post for the Voice Playbook, June 2021), corroborated by Voicebot's
coverage of the PDF.

Stats:
- **42% of the global population has conducted a voice search recently**; **50% in
  Asia-Pacific.** Growth fastest where there are many new internet users.
- Typing a paragraph in Hindi takes **~3× longer** than in English (illustrates why voice
  wins for non-Latin scripts — less relevant for Spanish, but the *effort* logic holds for
  tired thumbs).
- Google's four voice interaction categories: **recording, commands, conversational,
  dictation** — each with distinct flows.

Barriers Google documents:
1. **Misinterpretation → self-blame → abandonment.** New users say *"it couldn't understand
   my accent"* and stop using the feature. **They blame themselves, not the system.**
2. **Self-perception.** Users worry voice makes them look uneducated, or invites ridicule
   from peers.
3. **Privacy / bystanders.** People won't speak to a device in a crowded place.

Google's recommendations:
- **Discoverable icon**: simple, industry-standard, *not* a retro 1950s microphone; large
  target; **no more than one tap** to reach.
- **Simplify output**: break long passages into short sentences; slow the TTS down.
- **Support natural speech**: breathing and thinking pauses, and **code-switching** between
  languages mid-utterance.

→ **IH translation — these map almost 1:1 onto our failure modes:**

- **Barrier 1 is existential for us.** Our product's whole job is to score a Spanish
  speaker's English. Whisper *will* mis-hear an A1 Mexican accent. If the learner reads that
  as "even the machine can't understand me," we have reinforced the exact shame that keeps
  hotel staff from speaking English at work. **Rule: the system never blames the learner for
  a recognition failure, and never shows a raw low-confidence transcript as if it were
  truth.** On low ASR confidence, say *"no te escuché bien — ¿lo intentas otra vez, más
  cerca del micrófono?"* Never "incorrect."
- **Calibration already reflects this** — our scoring rubric's "for A1–A2 be GENEROUS, never
  0 if they attempted English" is the right instinct and is now backed by published
  research. Keep it verbatim.
- **Barrier 2 is why we need a silent mode.** A bellboy will not speak English aloud in a
  staff corridor with co-workers listening. Ship **every drill with a non-voice path**
  (tap-to-choose, shadow-listen, type) and let the learner switch without losing streak or
  credit. Label it neutrally — *"modo silencioso"*, never "modo fácil."
- **Barrier 3 → offer headphone-friendly and whisper-tolerant capture.** At minimum, gain
  normalization so a quiet voice isn't scored down.
- **Code-switching support is a feature, not a bug.** An A1 learner will say *"the room is
  listo"*. Our scorer should recognize the Spanish token, not fail the utterance. Treat
  code-switching as an expected A1–A2 behavior and score the English part.
- **Mic affordance:** one tap, large, standard glyph, never a stylized/decorative mic.
  Given our design system's austerity, resist the temptation to make the mic a small
  hairline icon. It should be the single biggest touch target on the screen.
- **TTS output**: short sentences, deliberate pace. Our ElevenLabs prompts should generate
  *one clause at a time*, with pauses, not paragraphs.

---

## 7. The minimalism problem — how to resolve it against our design system

Google's finding is blunt: users **rejected apps with white space and muted colors**,
saying *"I don't like the way it looks."* Western minimal aesthetics — reduced color, sound,
text, abstraction — *"lack impact in sensory-rich environments."* UC Browser's dense design
is cited as locally successful.

Our design system (`.orcha/design-system.md`) is: ivory, one accent (ink `#2E4761`),
editorial, no shadows, no emoji, generous whitespace. That is **exactly the aesthetic
Google's participants rejected**.

**Do not throw out the design system.** Three reasons the finding doesn't transfer wholesale:
1. It is India ~2016, consumer apps, and users whose visual reference was TV/kiosk culture.
   Mexican hospitality staff in 2026 use Instagram, TikTok and WhatsApp daily; their
   aesthetic literacy is contemporary, not naive.
2. Our **buyer** is an HR director. The editorial look is doing real commercial work on
   `/precios`, the landing site and the HR dashboard. Changing it there would cost us money.
3. The finding is really about **impact and signal density**, not about color. Google's own
   remedy line is *"balance density with meaningful hierarchy and local aesthetics."*

**The resolution — split the surfaces:**

| Surface | Aesthetic |
|---|---|
| Marketing site, `/precios`, HR dashboard, reports | Keep Design System v0.1 unchanged. Editorial austerity = credibility with the buyer. |
| **Learner app (exam + daily drill)** | Same tokens, *different density and scale*. |

For the learner surface, apply these without introducing a single new color:
- **Raise scale, not saturation.** Bigger type, bigger targets, bigger numbers. A tired
  person at 6am reads size before they read color.
- **One unmistakable primary action per screen**, at large size. Not a hairline text button.
- **Use the ink accent aggressively** — full-bleed ink blocks for the active state, ink
  progress bars, ink-filled buttons. We have one accent; use it at 100%, not at 8% tint.
- **Increase information density where the information is a reward.** Streak, level,
  "faltan 2 ejercicios", "esta semana: 4 de 5 días" — dense, visible, above the fold.
  Whitespace is for the buyer's report, not the learner's 5-minute drill.
- **Motion is our substitute for color.** Google Design's own field-research article notes
  static interfaces caused confusion and that *adding motion and responsiveness
  significantly improved comprehension* for new internet users
  (https://design.google/library/sketch-scroll-or-swipe). Our design system bans "bounce
  animations" — that ban is about taste, not about motion. Purposeful state-change motion
  is permitted and, per the research, load-bearing.
- **The emoji ban stays** — but note that Google's Viber example (sticker sets in local
  slang) shows expressive glyphs *do* work. If we ever need affect, use our own drawn marks,
  not system emoji. Take this to Diego rather than deciding unilaterally.

---

## 8. Shared devices, trust and privacy

From the NBU anthology (blog.google): *"Many families in NBU countries share their mobile
devices with one another — yet device privacy and account settings are still mostly built
on the principle of 'one person, one account'."* Also: ~3 billion people came online
2015–2022; novice users speak **7,000+ languages**; women are the majority of the next
billion users and *"face higher barriers to internet access than men, as well as threats to
their safety and privacy online."*

[UNVERIFIED] A widely-repeated figure claims 73% of Indian smartphone users share a phone
within the household vs 8% Japan / 9% Germany. I could not reach a primary source — do not
cite externally.

Related academic work by Google researchers (Sambasivan et al., SOUPS 2018, *"Privacy is not
for me, it's for those rich women"*) documents performative privacy practices — app hiding,
password-locking chats — by women in South Asia. USENIX PDF returned 403; treat as
directional.

→ **IH translation:**
- **Assume the phone is not private.** A housekeeper's phone may be looked at by a partner;
  a shared back-of-house tablet may be used by three shifts.
- Therefore: **no sensitive content on the lock screen or in notification previews.** A
  WhatsApp drill that says "Tu nivel es A1" on a shared lock screen is a small humiliation.
  Notification copy should be neutral: *"Tu práctica de hoy está lista."*
- **Fast, explicit session exit** on any shared-device path, and never keep a session
  logged in indefinitely on a device flagged as shared.
- **State the recording policy in plain Spanish at the point of recording**, not in a
  privacy page. Suggested: *"Tu grabación se usa solo para medir tu nivel. Tu supervisor ve
  tu progreso, no tus audios."* — and then that must actually be true in RLS. If we *do*
  expose audio to HR (we currently surface transcripts on `/hr/employees/[id]`), say so
  honestly instead. **This is a product decision that needs Diego, not a copy tweak.**
- **Gender note:** housekeeping and front-desk staff in Mexican hotels skew female. Google's
  own research says women face higher privacy/safety barriers. Any feature that broadcasts
  a learner's performance to peers should be opt-in.

---

## 9. LATAM / Mexico calibration (so we don't cargo-cult India)

- **Mexico internet users: 110 million, 83.3% penetration** (Kepios via DataReportal,
  Jan 2025). 16.7% still offline.
- **INEGI ENDUTIH 2024: 100.2 million internet users = 83.1% of population aged 6+**, up
  from 81.2% in 2023. **Smartphone is the leading device at 97.2%.**
- **127 million cellular connections, 96.5% of population; 97.7% are broadband (3G/4G/5G)**
  (GSMA Intelligence via DataReportal).
- **Median mobile download speed: 33.10 Mbps** (Ookla via DataReportal, +31.7% YoY).
- **Prepaid vs postpaid spend (INEGI, 2023): 155.4 pesos/month prepaid vs 439.6 postpaid.**
  Prepaid is the hospitality-staff norm; that's roughly one day's wage at entry level.
- **Sharp regional gap:** CDMX 84.4% and Sonora 84.4% connected vs **Chiapas 50.7%, Oaxaca
  55.5%, Guerrero 58.9%** (INEGI). Relevant because much Cancún/Los Cabos hotel labor
  *migrates from* Chiapas, Oaxaca, Veracruz, Tabasco. **Our learner may have 2 years of
  smartphone experience, not 10.** Digital-confidence findings apply to them far more than
  bandwidth findings do.
- **GSMA:** LATAM mobile internet penetration ~64% (2024) → ~75% by 2030; roughly **190
  million people in LATAM are covered by mobile internet but don't use it** — a *usage* gap
  driven by affordability and relevance, not coverage.
- **WhatsApp is the messaging monopoly in Mexico** (~77M users, ~90%+ reach among internet
  users — third-party estimates, directionally solid). Facebook 93.0M, TikTok 85.4M (18+),
  YouTube 83.6M (DataReportal, Jan 2025).

→ **IH translation:**
- Our WhatsApp-first channel choice is **strongly validated**. It's the one app that is
  already installed, already whitelisted in the user's habits, and often zero-rated on
  Mexican prepaid plans. Don't fight it.
- **Do not build for 2G.** Build for *intermittent 4G with a hard data budget and dead zones
  inside buildings*. Different problem, different solution: aggressive service-worker
  caching and background sync, not byte-starved UI.
- **TikTok reach (91.7% of adults 18+) is the real aesthetic and pedagogical benchmark**,
  not Duolingo. Our learner's expectation for a 30-second piece of instructional media is
  set by vertical video, not by a flashcard app.

---

## 10. Concrete design rules (hand these to a designer/engineer as-is)

See the `designRules` array in the structured output — same list, deduplicated.

## 11. What to instrument

If we adopt these, we must be able to tell if they worked. Minimum event set:
- `first_useful_utterance_ms` — time from app open to first correctly-said English sentence
  (target: <60s, per "celebrate wins early")
- `asr_low_confidence_rate` by CEFR level — if A1 learners hit low confidence >30% of
  attempts, our capture or our prompts are wrong, not the learner
- `silent_mode_share` — % of drills completed without voice; if high, we've learned
  something enormous about the shift-floor environment
- `download_consent_rate` and `bytes_per_active_week` per learner
- `preview_to_start` — does the risk-free preview convert into a first real session
- Lighthouse mobile score on the learner route (budget ≥85) and total transfer on first
  load (budget: get under 170 KB critical path; today the fonts alone are ~406 KB unsubset)
- Cold-start TTI on a throttled slow-4G / mid-range Android profile (budget 3s; 5s hard fail)

## 12. Open questions to settle with Diego / in the field

1. **Does HR hear the audio?** We currently expose transcripts in the HR detail view. Decide
   the policy, then say it in plain Spanish at the point of recording. This is the single
   biggest trust lever and it cannot be decided by a copy edit.
2. **Anti-minimalism:** how far do we push learner-surface density before Diego considers it
   a design-system violation? Proposal in §7 uses zero new colors — needs his sign-off.
3. **Do we allow non-system expressive marks** (drawn glyphs) as an emoji substitute for
   reward moments?
4. **Field test:** Google's method note is to prototype cheaply and test in situ. Their
   finding is that for new internet users, *realistic digital* prototypes parse better than
   paper, and offline "swipe-through" screenshot decks are the right tool for low-connectivity
   sites. Take a swipe-through deck to one hotel break room before building any of this.

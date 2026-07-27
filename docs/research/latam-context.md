# LATAM / Mexican Operating Context for Inglés Hotelero

Field research, July 2026. Every claim below is tied to a source I actually fetched and read.
Where I could not verify a widely-repeated number, I say so explicitly rather than pass it on.

**How to read this:** each section ends with `→ DO` (build this) and `→ DON'T` (stop doing this).

---

## 0. The five things that should change the product

1. **WhatsApp is zero-rated on ~59% of Mexican mobile lines — including voice notes and media. Our PWA is not.** Telcel's Amigo Sin Límite packages give unlimited WhatsApp (text, voice notes, photos, video, calls inside Mexico) that does not consume the data allowance. Every minute of audio we deliver in the PWA costs the learner money; the same audio inside WhatsApp costs zero. This is the single largest architectural implication in this document.
2. **79.3% of Mexican cellphone users are prepaid-only, and 16.7% of smartphone users use Wi-Fi *only*.** One in six of our learners has no mobile data at all — they are online at home, at the staff Wi-Fi, or not at all. Offline-first is not a nicety.
3. **Push notifications are a broken habit engine: median direct open rate is 3.1–3.4%.** We cannot build a daily habit on push. WhatsApp template messages are the habit engine; push is a secondary nudge.
4. **Cancún scores 414 on the EF EPI — one of the *lowest* city scores in Mexico** (national 440, Playa del Carmen 517, Monterrey 532). Our biggest target market is also the weakest. That is the sales pitch, verbatim.
5. **`tú`, not `usted`.** Microsoft's own Spanish (Mexico) localization standard states it flatly. `usted` is the register of the Mexican *government form* — the exact thing that has failed these learners before.

---

## 1. DEVICE / NETWORK REALITY

### 1.1 Connectivity and device baseline (INEGI ENDUTIH 2025 — primary)

Source: INEGI, *Comunicado de prensa 32/26, ENDUTIH 2025*, published 16 June 2026 —
https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2026/endutih/ENDUTIH_25.pdf
and the longer *Reporte de Resultados 19/26* —
https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2026/endutih/ENDUTIH_25_RR.pdf

| Fact (2025, pop. 6+) | Value |
|---|---|
| Used the internet | 86.1% (104.9M people) |
| Urban / rural internet use | 88.9% / 75.2% |
| Used a cellphone | 84.6% |
| Of cellphone users: smartphone | 97.0% |
| Households with internet | 78.3% |
| Households **without** internet | 21.7% — main reason **"falta de recursos económicos" (12.1%)**; 5.5% "no interest"; 1.9% "don't know how to use it" |
| Internet users connecting **via smartphone** | 97.3% (vs 36.2% via computer) |
| **Contract type: prepago only** | **79.3%** |
| Contract type: pospago | 15.7% (0.6% both) |
| Smartphone users: **both Wi-Fi + mobile data** | 72.8% |
| Smartphone users: **Wi-Fi ONLY** | **16.7%** |
| Smartphone users: mobile data only | 10.5% |
| Smartphone users using **instant-messaging apps** | **90.6%** — the #1 app category |
| Smartphone users using social networks | 80.4% |
| Smartphone users using audio/video content | 77.8% |
| Internet use by age: 15–24 / 25–34 / 35–44 | 97.6% / 96.5% / 94.3% |

Two numbers matter more than all the others:

- **79.3% prepaid.** Prepaid means a *conscious purchase decision every week*. When their saldo runs out — which happens — they are not "offline for a moment", they are offline until payday. Any flow that assumes continuous connectivity will silently drop these users.
- **16.7% Wi-Fi only.** This person literally cannot open our PWA on the bus. They can, however, still receive WhatsApp if their carrier zero-rates it (see 1.3), because zero-rated traffic works with zero balance on some plans — but treat that as unverified and design for "they will see it when they hit Wi-Fi."

→ **DO:** Build a real offline queue (IndexedDB + Service Worker) — this is already listed as unshipped hardening in `CLAUDE.md` and it is the highest-value remaining infra item. Answers, recordings, and drill state must survive a full day offline and sync on reconnect.
→ **DO:** Show a persistent, honest "guardado en tu teléfono / se enviará cuando tengas señal" state. Never "upload failed."
→ **DO:** Precache the entire day's drill (audio included) the moment the learner is on Wi-Fi, so the on-shift experience costs zero data.
→ **DON'T:** Stream audio on demand. Every stream is a peso.
→ **DON'T:** Gate progress behind a network round-trip.

### 1.2 Android version + device class

Source: StatCounter, *Mobile Android Version Market Share Mexico*, June 2026 —
https://gs.statcounter.com/android-version-market-share/mobile/mexico

Android 16: 26.49% · 13: 17.46% · 15: 17.11% · 14: 14.71% · 12: 9.04% · 11: 5.62%.
The six named versions sum to ~90.4%; the remaining ~9.6% sits on Android 10 and older.

Caveat I am obliged to state: StatCounter is page-view weighted, so it over-represents heavy-browsing (newer) devices. The real long tail among low-wage workers is older than this chart.

Market composition: entry- and mid-range phones under USD $250 accounted for ~64% of Mexican smartphone sales in 2025; the Samsung Galaxy A06 was the best-selling phone in LATAM for 2025 (Counterpoint, via GSMArena — https://www.gsmarena.com/counterpoint_samsung_galaxy_a06_was_the_bestselling_phone_in_latam_for_2025-news-71620.php). The A06 ships with 4 GB RAM and 64/128 GB storage — this is our reference device, not a Pixel.

Browsers (StatCounter, Mexico mobile, June 2026 — https://gs.statcounter.com/browser-market-share/mobile/mexico): Chrome **79.1%**, Safari 18.37%, Samsung Internet 1.11%.

Screen resolutions (StatCounter, Mexico mobile, June 2026 — https://gs.statcounter.com/screen-resolution-stats/mobile/mexico) are extremely fragmented: 414×896 (8.23%), 360×800 (4.23%), 384×832 (3.4%), 390×844 (3.3%), 412×915 (2.34%), 393×873 (2.19%). No resolution exceeds 9%.

→ **DO:** Set the CSS design floor at **360 px wide**, and test at 360×640 as the worst realistic case. Tap targets ≥ 48 px.
→ **DO:** Target Android 11 as the compatibility floor (~95%+ coverage) and verify MediaRecorder/`audio/webm;codecs=opus` behavior there — recording APIs are exactly where old Android bites.
→ **DO:** Ship the `beforeinstallprompt` install flow for the ~80% on Chromium, **plus an explicit illustrated "Añadir a pantalla de inicio" instruction for Safari's 18%** — Safari never fires that event.
→ **DO:** Keep the total installed PWA payload small and cap the offline audio cache (e.g. rolling 7-day window, then evict). A learner with a 64 GB phone that is 95% full will uninstall anything that grows.
→ **DON'T:** Assume `Notification` permission, `SpeechSynthesis` voice quality, or persistent storage. All three are unreliable on budget Android.
→ **DON'T:** Ship heavy JS. Median mobile download speed in Mexico is 33.10 Mbps (Ookla via DataReportal Digital 2025 Mexico — https://datareportal.com/reports/digital-2025-mexico), but that is a median on a good day, not a hotel back-of-house basement.

### 1.3 Zero-rating: the decisive economic fact

Source (primary, carrier's own page): Telcel, *Paquetes Amigo Sin Límite* —
https://www.telcel.com/personas/amigo/paquetes/paquetes-amigo-sin-limite

Published Amigo Sin Límite ladder (MXN / validity / data):
$10 / 7 d / 0.5 GB · $20 / 7 d / 1 GB · $30 / 7 d / 1.5 GB · $50 / 7 d / 2.5 GB · $80 / 7 d / 4 GB · $100 / 30 d / 5 GB · $150 / 30 d / 7.5 GB · $200 / 30 d / 10 GB · $270 / 30 d / 13.5 GB · $300 / 30 d / 15 GB · $400 / 30 d / 20 GB · $500 / 30 d / 25 GB.

**Included without consuming data:** WhatsApp (text, voice notes, photo/video sharing, and calls/video calls within Mexico), Facebook/Messenger, X, Instagram, Snapchat. WhatsApp specifically works in Mexico, USA and Canada. Excluded from the benefit: calls/video calls via Messenger, and "Live" features.

Carrier weight: Telcel held **83,465,156 active lines = 58.9%** of the Mexican mobile market in Q2 2025; AT&T 16.2%, Movistar 14.6%, BAIT 5.9% (CRT/IFT figures reported by Xataka México — https://www.xataka.com.mx/telecomunicaciones/mexico-pone-orden-cifras-lineas-moviles-bait-cuarto-lugar-8-3-millones-telcel-lider). AT&T's prepaid pages advertise "redes sociales y aplicaciones" bundled from $10 recharges (https://www.att.com.mx/planes/prepago/) but I could **not** confirm from AT&T's primary page that WhatsApp specifically is zero-rated — treat AT&T/Movistar as "probable, verify before quoting." Zero-rating of WhatsApp/Facebook/Instagram/Twitter across Telcel, AT&T and Movistar has been documented in Mexico since at least 2017 by R3D (https://r3d.mx/2017/05/16/se-profundizan-ofertas-de-zero-rating-en-mexico-el-ift-sigue-en-silencio/).

**Affordability math for our actual learner.** A *mozo de hotel y restaurante* averages ~$6,510 MXN/month (men) / $5,650 (women) — Data México, Q1 2026 (see §3). A $100/30-day Telcel package is **~1.6% of a male mozo's monthly wage**; the $270 package is ~4.1%. That is a real, felt cost. Meanwhile ITU reports that in the Americas the data-only mobile-broadband basket now costs under 2% of average income (ITU, *The affordability of ICT services 2024* — https://www.itu.int/dms_pub/itu-d/opb/ind/D-IND-ICT_PRICES.01-2025-PDF-E.pdf) — but "average income" is roughly double what our learner earns, so the national affordability picture flatters our user's reality by ~2×.

→ **DO: Make WhatsApp the primary delivery surface for anything with audio.** Voice notes, listening drills, and pronunciation prompts sent *as WhatsApp voice messages* are free to the learner on the majority of lines. The same content in the PWA is not.
→ **DO:** Reserve the PWA for the things WhatsApp can't do: the placement exam, the recording+scoring loop, progress views, and the HR dashboard. Frame the PWA as "el examen y tu progreso"; frame WhatsApp as "la práctica diaria."
→ **DO:** Put a data-cost promise in the marketing copy: *"La práctica diaria por WhatsApp no consume tus datos en Telcel."* Verify per carrier before publishing; this is a claim a user can falsify.
→ **DO:** Measure and display our own payload. If a drill session costs 300 KB, say so.
→ **DON'T:** Deep-link from a WhatsApp message into the PWA for routine daily practice — the moment they tap the link, they leave zero-rated territory and start burning data. Links are for the exam and weekly progress, not for the daily 5 minutes.
→ **DON'T:** Build a native app. It has to be downloaded (data cost) and stored (storage cost) and it loses the zero-rating advantage entirely.

### 1.4 WhatsApp Business Platform economics (our cost side)

Meta moved from conversation-based to **per-message pricing on 1 July 2025**; each delivered *template* message is billed by category and recipient country. Free: all non-template messages inside the 24-hour customer service window (CSW) opened by a user message; utility templates inside an open CSW; and everything inside a 72-hour Free Entry Point window opened by a Click-to-WhatsApp ad. Source: Meta for Developers, WhatsApp pricing docs — https://developers.facebook.com/docs/whatsapp/pricing/ (rate card is a downloadable CSV; Mexico's exact per-message rates are **not** published inline on that page and I could not extract them from the interactive tool at https://whatsappbusiness.com/es-la/products/platform-pricing/).

Third-party summaries put Mexico's utility rate at roughly $0.008–$0.0085 USD and marketing at $0.03–$0.044 USD (MEF, https://mobileecosystemforum.com/2026/02/26/whatsapp-business-platform-business-models-2023-2025-updates/). **Treat these as unverified.** Pull the official CSV before pricing anything.

→ **DO:** Design the daily loop so that **the learner sends the first message of the day** (e.g. a scheduled 07:00 utility template says "responde LISTO para tu práctica"), opening a free 24-hour CSW inside which all the drill turns are free. One paid template per learner per day, everything else free.
→ **DO:** Model unit economics at 1 utility template/day × 30 days. At ~$0.008/msg that's ~$0.24 USD/learner/month — trivial against a $150–500/property subscription. At marketing rates it would be ~$1.00+/learner/month. **Categorize correctly; it's a 4–5× cost difference.**
→ **DON'T:** Send marketing-category templates for training reminders. They cost more and are more likely to get the number blocked.

---

## 2. SPANISH REGISTER — how to actually write this product

### 2.1 The tú/usted decision: `tú`. Settled.

The strongest available primary source is Microsoft's own localization standard for our exact locale:

> **"For Spanish Microsoft voice, the informal second person singular pronoun 'tú' is recommended."**
> — Microsoft, *Spanish (Mexico) Localization Style Guide*, §4.1.12 Pronouns, p. 32.
> https://download.microsoft.com/download/9/0/1/9016efc5-6455-4a9d-ae78-ed3df93b2851/spa-mex-StyleGuide.pdf

The same guide adds two rules we should adopt verbatim:

- **Third-person references to "the user" are banned.** "Los usuarios pueden determinar cuándo instalar nuevas actualizaciones" → "**Puedes** determinar cuándo instalar nuevas actualizaciones." The guide's stated reason: third person "sound[s] formal and impersonal."
- **No leísmo.** "In Spanish for Mexico we will use *lo*." → "**Lo** ayudarás a resolver sus problemas", never "le ayudarás."

The counter-argument for `usted` (Mexico is a high-`usted` culture; workers address guests and supervisors as `usted`) is real but points the wrong way. Consider what `usted` sounds like in Mexican *institutional writing*:

> "Si **usted** se inscribe en este subprograma dentro de las fechas establecidas por ASERCA, recibirá respuesta en los siguientes 20 días hábiles."
> — Gobierno de México, *Manual de Lenguaje Ciudadano*, worked example, p. 5.
> https://www.gob.mx/cms/uploads/attachment/file/706632/Manual_de_Lenguaje_Ciudadano_VF.pdf

That is the voice of a government trámite. Our learner has *already* been failed by an institution that talked to them that way (school English). `usted` in our UI would import that exact emotional association. `tú` from the app, `usted` in the English we teach them to use with guests — the split is the correct one, and it is also pedagogically honest, because guest-facing register is part of the job skill.

→ **DO:** `tú` everywhere in UI, notifications, WhatsApp, and HR-facing employee-visible copy.
→ **DO:** Keep `usted` **inside the teaching content** when modeling Spanish glosses of guest interactions, and teach the English formal register (`Sir/Ma'am`, `May I…`, `Would you like…`) explicitly as the professional equivalent.
→ **DO:** Use `usted` in the **buyer-facing** surfaces only if the material is a formal proposal or contract. `/precios` and sales pages can stay `tú` — Mexican B2B SaaS increasingly does.
→ **DON'T:** Mix. A single stray "ingrese su código" next to "escribe tu código" reads as sloppy and instantly signals "this was translated, not written."
→ **DON'T:** Use `vosotros`. Ever. Plural is always `ustedes` in Mexico.

### 2.2 The "corporate Spanish" problem — with the actual swap list

Two primary sources give us concrete, non-hand-wavy word swaps.

**Microsoft, Spanish (Mexico) Style Guide, §2.1.1 "Words and phrases to avoid"** (p. 7) — the guide's framing: *"Microsoft voice avoids an unnecessarily formal tone… long, formal constructions should be avoided in favor of a simpler, more direct syntax."*

| Avoid | Use |
|---|---|
| realice los siguientes pasos… / llevar a cabo los siguientes pasos | haz lo siguiente… |
| solicitar / requerir | pedir |
| suministrar / proporcionar | dar |
| sin embargo / no obstante | pero |
| asimismo | además / también |
| acerca de | sobre |
| siempre y cuando | si |
| y, a continuación, … | y después… / y luego… |
| junto con | con |
| subsiguiente | siguiente |
| tener la oportunidad de | poder |
| inténtelo de nuevo | prueba otra vez / vuelve a intentarlo |
| desear | querer |
| utilizar | usar |
| volver a instalar | reinstalar |
| detectar (un error) | encontrar (un error) |
| (cuando sea) apropiado | (cuando) se pueda |
| si ya has permitido… | si ya permitiste… (simple tense over compound) |

**Gobierno de México, *Manual de Lenguaje Ciudadano*** (Dirección General de Transparencia y Archivos) adds:

| Más complicado | Más simple |
|---|---|
| Habida cuenta de que | Como |
| Cierto número de | Algunos |
| De conformidad con | Según |
| Llevar a cabo | Realizar |
| Si no fuera así | De no ser así |

Plus three structural rules from the same manual, stated as the conclusion of the document:

- **Brevedad** — cut superfluous detail, leftover prepositions, conjunctions and adverbs.
- **Sencillez** — direct language, "sin rebuscamientos"; *don't lean on passive forms*; avoid words uncommon for your audience.
- **Claridad** — "No incluir varias ideas generales en un sólo párrafo. Usar la frase corta, conservando el orden gramatical."

And two specific bans, with the manual's own before/after:
- **Gerunds:** "Se concretó el acuerdo *modificando* los requisitos" → "Se concretó el acuerdo *que modifica* los requisitos."
- **-mente adverbs:** "debe entregarse *obligatoriamente* y *ordenadamente*" → "es obligatoria y debe entregarse en orden."

The manual also flags "**uso excesivo de mayúsculas**" as a defect and puts the **purpose at the very start** of the document, not the end.

→ **DO:** Ship this as a lint list. Literally grep `src/content/` and the WhatsApp templates for: `usted`, `deberá`, `favor de`, `proporcion`, `solicit`, `realice`, `a continuación`, `sin embargo`, `asimismo`, `mediante`, `dicho/dicha`, `el mismo`, `-mente`, and any gerund in an instruction.
→ **DO:** Purpose first. "Hoy practicas cómo dar direcciones al huésped." — then the drill. Never "Bienvenido al módulo…".
→ **DO:** Short sentences, one idea per line. Bullets over prose.
→ **DON'T:** ALL CAPS headings. (Both sources flag it; our JetBrains Mono `.caps` at 10px is fine as a *typographic* device on short labels, but never for sentences.)
→ **DON'T:** Passive voice ("se ha registrado tu respuesta") — use "guardamos tu respuesta" or "tu respuesta quedó guardada".

### 2.3 Warm without fake slang — and why regionalisms are dangerous here

The Riviera Maya tourism workforce is **not** local. In a study of tourism workers in the Riviera Maya, origins were: Yucatán 20.2%, Chiapas 12.6%, Veracruz 10.6%, Tabasco 8.5%, Campeche 4.3%, and 15.9% from within Quintana Roo (Fernández Rodríguez et al., "Migración interna y dinámicas laborales en la industria turística de la Riviera Maya, Quintana Roo, México," *Revista ABRA* 40(60), 2020, pp. 68–100 — https://www.scielo.sa.cr/scielo.php?script=sci_arttext&pid=S2215-29972020000100068). Nationally, Quintana Roo has the highest internal net-migration rate in Mexico.

**The same study: 22.2% of these workers speak an indigenous language (19.3% Maya).** For roughly one in five of our Cancún/Riviera Maya learners, Spanish is already a second language and English will be a third. Nationally, INEGI found 4.7% of internet users report speaking an indigenous language and 26.6% self-identify as indigenous (ENDUTIH 2025).

That combination — a linguistically mixed, internally-migrant, partly-L2-Spanish floor staff — makes "sounding local" actively counterproductive. Chilango slang alienates the Yucatecos; Yucateco idiom alienates the Chiapanecos; Spain-Spanish alienates everyone.

**The warmth has to come from structure, not vocabulary.** Specifically:
- Second person singular (`tú`) and first person plural for the system's own actions ("guardamos", "te avisamos"). Microsoft's guide explicitly endorses "we" for system actions: *"Use of 'we' provides a more personal feel."*
- Contractions of formality, not of words: "¿Listo?" beats "¿Se encuentra usted preparado para continuar?"
- Naming the person's job, not their level: "Como botones, esto es lo que más vas a oír." Role identity is dignifying; CEFR level is abstract.
- Acknowledging effort before correcting: our scoring rubric already says "for A1-A2 be GENEROUS" — the *copy* must match that posture.

→ **DO:** Write a neutral, warm, Mexican-standard register. Mexico City educated-neutral is the safe center; it is what Mexican dubbing, news, and Microsoft's es-MX all use.
→ **DO:** Use the few genuinely pan-Mexican markers that read as human, not as costume: "listo", "ya quedó", "va", "ándale" (sparingly), "sale" (avoid — too chilango).
→ **DO:** Assume the learner may read slowly in Spanish too. See §2.4.
→ **DON'T:** Use `güey`, `chido`, `neta`, `no manches`, `padrísimo`, or emoji-as-tone. (Emoji are already banned by the design system; that ban is correct and is now also justified by register — emoji are how brands fake warmth they haven't earned.)
→ **DON'T:** Use Spain forms: `vosotros`, `ordenador`, `móvil`, `coger`, `vale`, `pulsa`. Use `computadora`, `celular`, `tomar`, `está bien`, `toca`.
→ **DON'T:** Use `usted` "to be respectful." It reads as distance, and this audience already has enough institutional distance.

### 2.4 Writing for lower-literacy readers (NN/g — primary)

Source: Jakob Nielsen / Nielsen Norman Group, *Lower-Literacy Users: Writing for a Broad Consumer Audience* — https://www.nngroup.com/articles/writing-for-lower-literacy-users/
Method: 50 participants, mixed literacy, between-subjects double-blind, 7 tasks, p<.05.

Findings that map directly onto our screens:
- Lower-literacy users **"plow" text word by word rather than scanning**, with a narrow field of view; they miss page elements outside the main text flow.
- They **satisfice aggressively** — accept "good enough" because digging deeper costs too much reading.
- **Scrolling breaks their concentration.** Search is hard because of spelling.
- NN/g's recommendations: **6th-grade reading level on homepages and key pages, 8th-grade elsewhere**; main point at the very top; important content above the fold; **single-column layouts**; linear menus with plain next-steps; avoid animation.
- Measured effect of simplification in their case study: lower-literacy task success **46% → 82%**, task time **22.3 min → 9.5 min**. Higher-literacy users improved too.

→ **DO:** One idea per screen. Our exam already does "13 Qs one per screen" — extend that discipline to every drill and every settings page.
→ **DO:** Single column, no horizontal scroll, no carousels, no reveal-on-hover.
→ **DO:** Put the instruction *above* the interactive element, never beside or below it.
→ **DO:** Never require reading to succeed — pair every instruction with the audio version. This is also why WhatsApp voice notes are pedagogically right, not just economically right.
→ **DO:** Target ~6th-grade Spanish. Practical proxy: sentences under 15 words, no subordinate clauses stacked, no word longer than 4 syllables unless it's the thing being taught.
→ **DON'T:** Rely on a search box, on icon-only navigation, or on progressive disclosure ("ver más").
→ **DON'T:** Put critical instructions in a tooltip, a placeholder, or helper text under a field.

### 2.5 UI verb form: infinitive vs imperative

The Microsoft es-MX guide's rule: *"use second person (you, your) when the program or a wizard is telling the customer what to do… when the user is telling the program or a wizard what to do, the infinitive is used."*

Practical translation for us:
- **Buttons where the user commands the system → infinitive.** `Guardar`, `Continuar`, `Grabar de nuevo`, `Cerrar sesión`.
- **Instructions where the system directs the user → tú imperative.** `Escucha y repite.`, `Graba tu respuesta.`, `Escribe tu código.`
- **Encouragement/feedback → tú, present or preterite.** `Lo lograste.` `Casi. Escucha otra vez.`

→ **DO:** Codify this in the design system doc alongside the tokens, so it survives contributor churn.
→ **DON'T:** Mix `Grabar` and `Graba` on the same screen.

---

## 3. THE HOSPITALITY WORKFORCE

### 3.1 Sector size and where the buyers are

- Tourism employment in Mexico reached **4,992,000 people in Q3 2025**, +1.8% YoY (+90,477), per SECTUR's ITET, built on INEGI's ENOE — https://www.gob.mx/sectur/articulos/sectur-el-empleo-turistico-crece-1-8-y-llega-a-4-9-millones-de-personas-durante-el-tercer-trimestre-de-2025
- SECTUR describes tourism as the country's **primary employer of youth and second employer of women**.

### 3.2 Who the learner actually is (Data México / ENOE, Q1 2026 — government primary)

**Mozos de hotel y restaurante** (our "botones" module) — https://www.economia.gob.mx/datamexico/es/profile/occupation/mozos-de-hotel-y-restaurante
- Average age **37.4 years** (not 22 — this matters for tone and for assumptions about app fluency)
- 45.6% male ($6.51k MXN/month) / 54.4% female ($5.65k MXN/month)
- **Modal schooling band: 7–9 years** (≈ secundaria, complete or not)
- Informality **56.2%** nationally, vs 54.8% national average
- Largest state workforce: **Quintana Roo, 15.1k workers**; highest average pay: Baja California Sur $9.91k, Quintana Roo $7.87k

**Meseros** (our "restaurante" module) — https://www.economia.gob.mx/datamexico/es/profile/occupation/meseros
- Modal schooling band: **10–12 years** (prepa, complete or not) — 250k workers
- Informality is **10.5 pp above** the national rate. But by state: Chiapas 96.6%, Hidalgo 95.9%, Michoacán 91.4% vs **Baja California Sur 30.9% and Quintana Roo 12.2%**

That last line is the most commercially important number in this section. **Quintana Roo has 12.2% informality among waiters** — an order of magnitude below the country. Formal employment means an employer with HR, payroll, a training budget, and a compliance motive. Los Cabos (BCS, 30.9%) is second.

**Riviera Maya tourism workers specifically** (Fernández Rodríguez et al. 2020, *Revista ABRA*):
- **51.4% aged 20–29**
- Education: 36.8% preparatoria, 30.3% licenciatura, 21.8% secundaria; literacy 94.6%
- Average wage **$7,584.70 MXN/month — 25.8% below the national average of $10,222.30**
- **Shifts range 10 to 72 hours; 68.3% work Saturdays, 43.6% work Sundays**
- Migration motive: economic advancement 64.7%

→ **DO: Sell into Quintana Roo and Baja California Sur first.** That is where formal, HR-having, budget-holding hotel employers are concentrated, and where our learner is most likely to be a payroll employee rather than an informal worker.
→ **DO:** Design for a **37-year-old with 8 years of schooling** as the bellboy persona and a **25-year-old with prepa** as the waiter persona. Two different reading speeds, one interface — so build to the lower one.
→ **DO:** Never schedule the daily drill for a fixed clock time. 68% work Saturdays; shifts range 10–72 hours. Let the learner (or HR) pick the window, and let it float.
→ **DON'T:** Assume weekends off. Don't build "streak" logic that breaks on a double shift.
→ **DON'T:** Assume literacy in the reading-comprehension sense from the 94.6% literacy figure — that's "can read", not "reads comfortably."

### 3.3 Turnover: the buyer's actual pain

- **30%–80% annual turnover** in Mexican restaurants and hotels depending on establishment type, per CANIRAC, reported by Expansión — https://expansion.mx/empresas/2026/05/18/hoteles-mexico-ajustes-jornada-laboral-40-horas
- Academic measurement in Guanajuato hotels: **4.06% monthly / 48.72% annual**; some individual hotels reported far higher. Study: Caldera González et al., "Rotación de personal en la industria hotelera en el estado de Guanajuato, México," *Revista Ibero-Americana de Estratégia* 18(4), 2019 — 67 hotel HR managers interviewed — https://www.redalyc.org/journal/3312/331267304006/html/
- Same study's causes, ranked: (1) non-competitive compensation, (2) poor recruitment/selection, (3) demotivation from unclear task definition.
- Damning operational detail from that study: **only 4 of 67 hotels had a formal recruitment process** and **only 4 conducted induction training.** Most hired via social media or referrals.

→ **DO:** Lead the sales conversation with turnover, not with English. "Con 50% de rotación anual, cada empleado nuevo llega sin inglés. ¿Cuánto tiempo tarda hoy en poder atender a un huésped?"
→ **DO:** Build **time-to-competence** as the headline HR metric — days from hire to "can handle the 20 phrases this role needs." That is the number that survives turnover; average CEFR level does not.
→ **DO:** Make onboarding a *product feature*: a new hire should be enrolled, placed, and drilling within one shift. 63 of 67 hotels have no induction process — we can *be* their induction process.
→ **DO:** Design for churn: bulk enroll/offboard, seat reassignment, and reporting that is per-role and per-cohort rather than per-named-individual.
→ **DON'T:** Price or pitch on per-seat annual commitments that assume the same humans are there in 12 months. They won't be. (Our current per-property pricing is right; protect it.)

### 3.4 The 2026–2030 regulatory tailwind

Mexico's 40-hour workweek reform: the reduction **begins in 2027 and phases to 40 hours by 2030**, starting with a two-hour weekly cut. Hotels have roughly seven months (as of May 2026) to restructure 24/7 operations — shift schedules, rest days, and staffing for front desk, housekeeping, kitchen and guest services. Wyndham (100 properties, 15 brands in Mexico) is already reworking: some hotels move from six days/one rest day to five days/two rest days. Short-term cost increases are expected, mainly from hiring more people. Source: Expansión, 18 May 2026 — https://expansion.mx/empresas/2026/05/18/hoteles-mexico-ajustes-jornada-laboral-40-horas

→ **DO:** Use this as the 2026–2027 sales wedge. Hotels are about to hire *more* people into *shorter* shifts — which means more onboarding, less on-the-job absorption time, and a harder case for pulling staff into a classroom. A 5-minute asynchronous drill is exactly the format that survives a 40-hour restructure.
→ **DO:** Make "cero horas de aula, cero horas de nómina" an explicit line in the pitch.
→ **DON'T:** Propose anything that consumes paid shift time in a block. That is precisely the resource that is about to get scarcer and more expensive.

### 3.5 Phone use at work

Mexico's Ley Federal del Trabajo does not regulate cellphone use at work. Employers may set internal rules via the *reglamento interior de trabajo*, provided the rules have a valid justification (safety, confidentiality, productivity) and are properly published and communicated; they cannot prohibit arbitrarily or without notice. Summary of the legal position: Expansión, https://expansion.mx/carrera/2024/05/07/pueden-prohibir-el-uso-del-celular-en-mi-trabajo

In practice, front-of-house hotel staff are almost universally barred from visible phone use in guest areas. Assume the phone lives in a locker or a back pocket during shift.

→ **DO:** Design the drill for **before shift, after shift, on break, and on the commute** — not during. Nothing time-critical, nothing that punishes a 9-hour gap.
→ **DO:** Give HR an explicit artifact for this: a one-page "política de práctica" they can attach to the reglamento interior, authorizing 5 minutes in the break room. Removing the *permission ambiguity* is a real adoption lever and costs us one PDF.
→ **DO:** Consider a shared-device / kiosk mode for the placement exam, since the exam is the one thing hotels may want to run on-site in a batch.
→ **DON'T:** Send drill notifications during typical shift hours by default. Ask for the learner's turno at enrollment and schedule around it.

### 3.6 What motivates this worker

The evidence here is thinner and more qualitative than I'd like; I'm labeling confidence honestly.

**Well-evidenced:**
- **Pay is the #1 driver of exit** — the Guanajuato study ranks compensation first among turnover causes, and Riviera Maya workers earn 25.8% below the national average.
- **Migration for economic advancement** dominates the workforce's own stated motive (64.7%, Riviera Maya study). These are people who already moved states to earn more. They are *not* change-resistant when the payoff is legible — they are resistant to effort with unclear payoff.
- **Recognition correlates with retention** — Mexican hotel-sector study on recognition and motivation (Durango) reports lower turnover and higher performance where managers use recognition (https://www.researchgate.net/publication/367068161_La_Motivacion_y_su_Correlacion_con_el_Reconocimiento_Laboral_Enfocada_en_una_Empresa_del_Sector_Hotelero_de_la_Ciudad_de_Durango_Mexico) — I read only the abstract-level description, so treat as directional.

**Credential gap = opportunity.** Mexico's national competency standards for hotel work (CONOCER/SEP) exist — e.g. **EC0045 "Prestación de servicios de atención y recepción del huésped durante su alojamiento temporal"** — but EC0045 contains **no English-language performance criteria** (https://www.agder.org.mx/ec0045-prestacion-de-servicios-de-atencion-y-recepcion-del-huesped-durante-su-alojamiento-temporal/). There is no recognized national credential for hotel English.

**International mobility.** H-2B (the visa U.S. hotels actually use for seasonal hospitality) is capped at 66,000/year, and as of 17 Jan 2025 USCIS removed the requirement that beneficiaries be nationals of a designated country (USCIS, https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-2b-temporary-non-agricultural-workers; industry context: CoStar, https://www.costar.com/article/1881801560/how-us-hotels-are-using-the-h-2b-visa-program). USCIS may verify claimed English proficiency. I did **not** find a published English-level requirement for H-2B, and I did not verify J-1 hospitality volumes for Mexico — do not put a specific number in marketing.

→ **DO: Issue a real, named, verifiable certificate.** Role-specific, CEFR-anchored, with the hotel's and our name on it, a verification URL, and a date. This is the highest-leverage motivation mechanic available to us precisely *because* no national equivalent exists. Duolingo cannot give a bellboy something to put on a job application; we can.
→ **DO:** Frame the certificate in terms of the ladder the worker actually sees: recepción pays more than botones; a supervisor role pays more than recepción; a chain property in Los Cabos pays more than a local hotel; the U.S. seasonal market pays more than all of it. Say "esto vale para tu siguiente puesto," not "esto mejora tu nivel."
→ **DO:** Explore CONOCER alignment / becoming an Entidad de Certificación seriously — a SEP-recognized credential for hotel English would be a durable moat and a procurement unlock.
→ **DO:** Give the *manager* a recognition tool — a weekly "quién avanzó más" that a supervisor can read out in the pre-shift briefing. Recognition delivered by a human beats a badge delivered by an app, and it costs us nothing to generate.
→ **DO:** Tie progress to tips where honest: guest-facing English measurably affects service interactions, and tips are a real, immediate, per-shift incentive. "Practica esto y hoy vas a entender lo que te pide el huésped."
→ **DON'T:** Build streaks/leaderboards as the primary motivator. Shift patterns break streaks through no fault of the learner, and a broken streak on a 12-hour-shift day is a punishment for working.
→ **DON'T:** Claim H-2B/J-1 outcomes in marketing without verified sourcing.

---

## 4. COMMUNICATION CHANNELS — what actually reaches this person

### 4.1 The honest numbers

**Messaging is the dominant channel, by INEGI's own measurement:**
- **90.6% of Mexican smartphone users use instant-messaging apps** — the highest of any app category, above social networks (80.4%) and audio/video (77.8%). (INEGI ENDUTIH 2025, Reporte de Resultados.)
- WhatsApp reach among Mexico's online population: **91.4%** (Statista consumer survey, Q2 2025 — https://www.statista.com/statistics/1310360/social-networks-penetration-mexico/); 27.6% name WhatsApp as their favorite platform.
- WhatsApp voice messages: **~7 billion/day globally**, stated by Meta/Zuckerberg in March 2022 (TechCrunch — https://techcrunch.com/2022/03/30/people-are-sending-7-billion-voice-messages-on-whatsapp-every-day). Old, but it's the last official figure and it establishes that voice notes are a mainstream behavior, not a niche one.

**Push notifications are much weaker than people assume:**
Source: Airship, *Mobile App Push Notification Benchmarks for 2025* (2024 data, monthly rates averaged over 12 months) — https://growth.airship.com/rs/313-QPJ-195/images/Airship-2025-Push-Notification-Benchmarks-EN.pdf

| Metric | 2023 | 2024 |
|---|---|---|
| Android opt-in — high / median / low | 88.0% / 71.3% / 42.1% | **79.7% / 59.5% / 37.1%** |
| iOS opt-in — high / median / low | 73.9% / 49.1% / 27.3% | 74.1% / 49.4% / 27.1% |
| Android direct open — high / median / low | 10.9% / 3.4% / 0.6% | **10.7% / 3.4% / 0.7%** |
| iOS direct open — high / median / low | 8.6% / 3.1% / 0.9% | 8.0% / 3.1% / 0.8% |

Airship's own note: Android opt-in **dropped significantly across all percentiles** because apps targeting Android 13+ must now request notification consent. Our Android 13+ population in Mexico is ~76% and rising.

**Email is not a frontline channel and the benchmark that exists is inflated:**
Mailchimp's published all-industry average open rate is 35.63% (Education & Training 35.64%, click 3.02%), but the page states the data "was last updated in December 2023" and carries Mailchimp's own caveat that open rates are distorted by Apple Mail Privacy Protection — https://mailchimp.com/resources/email-marketing-benchmarks/. Those are opt-in marketing lists at global scale, not hotel line staff.

**The "98% WhatsApp open rate" claim: I could not verify it.** It is repeated across dozens of vendor blogs with no traceable primary study. Do not put it in a deck. The defensible version is INEGI's 90.6% messaging-app usage plus Statista's 91.4% WhatsApp reach — both are real, sourced, and strong enough.

### 4.2 What this means for our channel architecture

| Channel | Reach with our learner | Cost to learner | Cost to us | Role |
|---|---|---|---|---|
| WhatsApp template + session | Highest (90.6% use messaging; 91.4% WhatsApp reach) | **Zero on Telcel Sin Límite** | ~1 paid template/day | **Primary: daily habit + audio drills** |
| PWA push | ~60% opt-in (Android median), **3.4% median direct open** | Zero | Zero | Secondary nudge only |
| PWA itself | Requires install + data | **Data-costly** | Zero | Exam, recording, progress, HR |
| SMS | Universal but disliked, no audio | Carrier-dependent | Per-message | Fallback for enrollment codes only |
| Email | Low among frontline; high among HR buyers | Zero | ~Zero | **HR/buyer channel, not learner channel** |

→ **DO:** Split the channel strategy by *person*, not by *feature*. **Learner = WhatsApp. Buyer = email + PDF.** Our existing weekly-digest-via-Resend plan is right — for HR only.
→ **DO:** Make WhatsApp opt-in part of enrollment, not an afterthought. Getting the phone number is the activation event.
→ **DO:** Ask for push permission *only after* the learner completes their first drill, with a soft in-app prompt first — Airship's own guidance, and the difference between median (59.5%) and top-decile (79.7%) opt-in is largely onboarding quality.
→ **DO:** Treat push as redundancy for WhatsApp, never as the primary. Budget for 3–4% of pushes producing an open.
→ **DON'T:** Build any learner-facing flow that requires email. Many frontline hotel staff have no work email and use their personal address rarely.
→ **DON'T:** Cite the 98% open-rate figure.

---

## 5. THE COMPETITIVE FRAME, restated with this evidence

Duolingo optimizes consumer streak retention on general language. Every constraint in this document argues against that model for this user:

- Duolingo is a **download** (data + storage cost) that lives in the **app**, not in the zero-rated channel. We can live inside WhatsApp.
- Duolingo's habit engine is **push + streak**. Median push direct open is 3.4%; streaks break on double shifts. Our habit engine is a WhatsApp message the learner answers on their commute.
- Duolingo skews written over spoken — a limitation repeatedly identified in the Spanish-language literature on its use (e.g. https://dialnet.unirioja.es/descarga/articulo/10343540.pdf). Our learner's job is **entirely spoken**, and the national EF EPI skill breakdown shows Mexico weakest exactly there: writing 399, **speaking 413**, listening 422, reading 455.
- Duolingo has **no buyer**. We have an HR director with a 30–80% turnover problem and a 40-hour-week restructure landing in 2027.
- Duolingo issues no credential this worker can use. **EC0045 has no English criteria** — the credential space for hotel English in Mexico is empty.

### The market fact to put on the first slide

EF English Proficiency Index 2025, Mexico fact sheet — https://www.ef.com/assetscdn/WIBIwq6RdJvcD9bc8RMd/cefcom-epi-site/fact-sheets/2025/ef-epi-fact-sheet-mexico-english.pdf

- Mexico: **global rank #103, score 440**, vs global average 488. Score fell 19 points.
- By skill: Reading 455 · Listening 422 · **Speaking 413** · Writing 399.
- **Cancún: 414.** Quintana Roo state: 435. Mérida 470, Cabo San Lucas 469, Playa del Carmen 517.
- For contrast: Monterrey 532, Nuevo León 519, Mexico City 428.

**Cancún — Mexico's largest international-tourism labor market — scores below the national average and below Mexico City.** Playa del Carmen's 517 is almost certainly an artifact of its expat/digital-nomad population taking the test, which makes the Cancún number more, not less, telling about the working population.

**Required caveat:** the EF EPI is built from a self-selected online test, not a representative sample. State that when you use it. It is directionally powerful and methodologically weak — use it as a conversation opener with a GM, not as evidence in a technical document.

---

## 6. Things I could not verify (do not ship these as facts)

1. **"WhatsApp has a 98% open rate."** No traceable primary source. Widely repeated by vendors.
2. **Meta's exact per-message WhatsApp rates for Mexico.** Not published inline; requires downloading the official rate-card CSV. Third-party figures range $0.008–$0.0085 (utility) and $0.03–$0.044 (marketing).
3. **AT&T México / Movistar zero-rating WhatsApp specifically, in 2026.** Their pages advertise bundled "redes sociales y aplicaciones"; I confirmed WhatsApp explicitly only for Telcel. Verify before making a carrier-agnostic claim.
4. **Mexico-specific ITU mobile-broadband affordability percentage.** The 2024 report gives regional (Americas) figures only.
5. **English-proficiency requirements for H-2B, and J-1 hospitality volumes from Mexico.** USCIS "may seek to confirm" claimed proficiency; no published CEFR-equivalent threshold found.
6. **Any statistic sourced only to Statista's paywalled tiles.** The 91.4% WhatsApp reach figure came through a search summary of a Statista consumer-survey page, not the underlying survey. It is consistent with INEGI's 90.6% messaging figure, which is the one I'd quote.

---

## 7. Source list (everything I actually opened)

**Government / official primary**
- INEGI, ENDUTIH 2025 press release (32/26): https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2026/endutih/ENDUTIH_25.pdf
- INEGI, ENDUTIH 2025 Reporte de Resultados (19/26): https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2026/endutih/ENDUTIH_25_RR.pdf
- Gobierno de México, *Manual de Lenguaje Ciudadano*: https://www.gob.mx/cms/uploads/attachment/file/706632/Manual_de_Lenguaje_Ciudadano_VF.pdf
- Secretaría de Economía, Data México — Mozos de hotel y restaurante: https://www.economia.gob.mx/datamexico/es/profile/occupation/mozos-de-hotel-y-restaurante
- Secretaría de Economía, Data México — Meseros: https://www.economia.gob.mx/datamexico/es/profile/occupation/meseros
- SECTUR, empleo turístico Q3 2025: https://www.gob.mx/sectur/articulos/sectur-el-empleo-turistico-crece-1-8-y-llega-a-4-9-millones-de-personas-durante-el-tercer-trimestre-de-2025
- CONOCER standard EC0045 (via AGDER): https://www.agder.org.mx/ec0045-prestacion-de-servicios-de-atencion-y-recepcion-del-huesped-durante-su-alojamiento-temporal/
- USCIS, H-2B: https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-2b-temporary-non-agricultural-workers
- ITU, *The affordability of ICT services 2024*: https://www.itu.int/dms_pub/itu-d/opb/ind/D-IND-ICT_PRICES.01-2025-PDF-E.pdf

**Industry primary**
- Microsoft, *Spanish (Mexico) Localization Style Guide* (62 pp): https://download.microsoft.com/download/9/0/1/9016efc5-6455-4a9d-ae78-ed3df93b2851/spa-mex-StyleGuide.pdf
- Telcel, Paquetes Amigo Sin Límite: https://www.telcel.com/personas/amigo/paquetes/paquetes-amigo-sin-limite
- Meta for Developers, WhatsApp pricing: https://developers.facebook.com/docs/whatsapp/pricing/
- Airship, *Mobile App Push Notification Benchmarks for 2025*: https://growth.airship.com/rs/313-QPJ-195/images/Airship-2025-Push-Notification-Benchmarks-EN.pdf
- Mailchimp, Email Marketing Benchmarks: https://mailchimp.com/resources/email-marketing-benchmarks/
- Nielsen Norman Group, *Lower-Literacy Users*: https://www.nngroup.com/articles/writing-for-lower-literacy-users/
- EF EPI 2025 Mexico fact sheet: https://www.ef.com/assetscdn/WIBIwq6RdJvcD9bc8RMd/cefcom-epi-site/fact-sheets/2025/ef-epi-fact-sheet-mexico-english.pdf
- StatCounter Mexico — Android versions / browsers / screen resolutions: https://gs.statcounter.com/android-version-market-share/mobile/mexico
- DataReportal, *Digital 2025: Mexico*: https://datareportal.com/reports/digital-2025-mexico

**Academic**
- Fernández Rodríguez et al., "Migración interna y dinámicas laborales en la industria turística de la Riviera Maya," *Revista ABRA* 40(60), 2020: https://www.scielo.sa.cr/scielo.php?script=sci_arttext&pid=S2215-29972020000100068
- Caldera González et al., "Rotación de personal en la industria hotelera en el estado de Guanajuato, México," *Revista Ibero-Americana de Estratégia* 18(4), 2019: https://www.redalyc.org/journal/3312/331267304006/html/
- Clemente, M. de los Á., "El uso de los pronombres 'tú' y 'usted' en una familia mexicana," *Lengua y Habla* 7, 2002: https://dialnet.unirioja.es/descarga/articulo/4004060.pdf

**Press / secondary (used only where noted)**
- Expansión, hoteles y jornada de 40 horas (18 May 2026): https://expansion.mx/empresas/2026/05/18/hoteles-mexico-ajustes-jornada-laboral-40-horas
- Expansión, prohibición de celular en el trabajo: https://expansion.mx/carrera/2024/05/07/pueden-prohibir-el-uso-del-celular-en-mi-trabajo
- Xataka México, líneas móviles por operador: https://www.xataka.com.mx/telecomunicaciones/mexico-pone-orden-cifras-lineas-moviles-bait-cuarto-lugar-8-3-millones-telcel-lider
- R3D, zero rating en México: https://r3d.mx/2017/05/16/se-profundizan-ofertas-de-zero-rating-en-mexico-el-ift-sigue-en-silencio/
- TechCrunch, 7B WhatsApp voice messages/day: https://techcrunch.com/2022/03/30/people-are-sending-7-billion-voice-messages-on-whatsapp-every-day
- GSMArena/Counterpoint, best-selling LATAM phone 2025: https://www.gsmarena.com/counterpoint_samsung_galaxy_a06_was_the_bestselling_phone_in_latam_for_2025-news-71620.php

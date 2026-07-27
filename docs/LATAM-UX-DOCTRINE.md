# LATAM UX DOCTRINE
### How Inglés Hotelero is designed, written, and delivered for the Mexican hospitality worker
*Version 1.0 · Julio 2026*

Companion to `METODO-TURNO.md`. That document says *what we teach*. This one says *how it reaches the person*.

---

## 0. THE OPERATING PICTURE

Design decisions here are downstream of five verified facts, not preferences.

| Fact | Source | Consequence |
|---|---|---|
| WhatsApp is **zero-rated** on ~59% of Mexican lines; our PWA is not | Telcel *Amigo Sin Límite*; IFT/CRT Q2 2025 (Telcel 58.9% share) | Audio lives in WhatsApp. Always. |
| **79.3%** of Mexican cellphone users are prepaid-only; **16.7%** of smartphone users are Wi-Fi-only | INEGI ENDUTIH 2025 | Offline-first is mandatory, not a feature |
| Push notification median open rate: **3.1–3.4%** | Industry benchmarks | Habit cannot run on push. WhatsApp templates are the engine |
| **22.2%** of Riviera Maya tourism workers speak an indigenous language (19.3% Maya) | Fernández Rodríguez et al., *Revista ABRA* 40(60), 2020 | For 1 in 5 learners Spanish is already L2; English is L3 |
| Lower-literacy users "plow" word-by-word; simplification moved task success **46% → 82%** | NN/g, *Lower-Literacy Users* (n=50, p<.05) | Target 6th-grade Spanish. One idea per screen |

---

## 1. THE REGISTER DECISION

### 1.1 `tú`, not `usted` — in everything the learner touches

The strongest primary source for our exact locale:

> **"For Spanish Microsoft voice, the informal second person singular pronoun 'tú' is recommended."**
> — Microsoft, *Spanish (Mexico) Localization Style Guide*, §4.1.12

The counter-argument (Mexico is a high-`usted` culture) points the wrong way. Consider what `usted` sounds like in Mexican institutional writing:

> *"Si **usted** se inscribe en este subprograma dentro de las fechas establecidas por ASERCA, recibirá respuesta en los siguientes 20 días hábiles."*
> — Gobierno de México, *Manual de Lenguaje Ciudadano*

That is the voice of a government trámite. **Our learner has already been failed by an institution that talked to them that way** — school English. Importing that register imports the association.

**The split that is both correct and pedagogically honest:**

- `tú` from the app, always
- `usted` **inside the English we teach**, because guest-facing formal register (`Sir/Ma'am`, `May I…`, `Would you like…`) is part of the job skill

Two rules adopted verbatim from the same guide:
- **No third-person "the user."** Not *"los usuarios pueden…"* → **"puedes…"**
- **No leísmo.** *"Lo ayudarás"*, never *"le ayudarás"*
- **Never `vosotros`.** Plural is always `ustedes`

> **Open decision for Diego:** the *buyer-facing* landing site is currently written in `usted`. The research supports either for B2B surfaces, and notes Mexican B2B SaaS increasingly uses `tú`. The learner app must be `tú`. The landing is a brand call — flagged, not silently changed.

### 1.2 Kill corporate Spanish — ship this as a lint rule

Sources: Microsoft es-MX Style Guide §2.1.1; Gobierno de México *Manual de Lenguaje Ciudadano*.

| Never | Always |
|---|---|
| realice los siguientes pasos / llevar a cabo | haz lo siguiente |
| solicitar / requerir | pedir |
| proporcionar / suministrar | dar |
| sin embargo / no obstante | pero |
| asimismo | además / también |
| siempre y cuando | si |
| tener la oportunidad de | poder |
| inténtelo de nuevo | prueba otra vez |
| utilizar | usar |
| desear | querer |
| de conformidad con | según |
| habida cuenta de que | como |
| acerca de | sobre |

**Structural bans**, from the Manual de Lenguaje Ciudadano:
- **No gerunds in instructions.** *"Se concretó el acuerdo modificando…"* → *"…que modifica…"*
- **No `-mente` adverbs.** *"debe entregarse obligatoriamente y ordenadamente"* → *"es obligatoria y debe entregarse en orden"*
- **No passive voice.** *"se ha registrado tu respuesta"* → *"guardamos tu respuesta"*
- **No ALL CAPS sentences.** (Our 10px mono `.caps` on short labels is a typographic device and is fine. Sentences are not.)
- **Purpose first.** *"Hoy practicas cómo dar direcciones al huésped."* Never *"Bienvenido al módulo…"*

**Implementation:** grep `src/content/` and all WhatsApp templates for: `usted`, `deberá`, `favor de`, `proporcion`, `solicit`, `realice`, `a continuación`, `sin embargo`, `asimismo`, `mediante`, `dicho`, `-mente`, and gerunds in instructions. Fail CI on hits.

### 1.3 Warm without costume

The Riviera Maya hospitality workforce is **internally migrant**: Yucatán 20.2%, Chiapas 12.6%, Veracruz 10.6%, Tabasco 8.5%, Campeche 4.3%; only 15.9% from Quintana Roo itself.

Chilango slang alienates the Yucatecos. Yucateco idiom alienates the Chiapanecos. Spain-Spanish alienates everyone.

**Warmth must come from structure, not vocabulary:**
- `tú` for the learner; **first-person plural for the system's own actions** — *"guardamos tu respuesta"*, *"te avisamos"*. Microsoft explicitly endorses "we" for system actions: it "provides a more personal feel."
- Contract the formality, not the words: *"¿Listo?"* beats *"¿Se encuentra usted preparado para continuar?"*
- **Name the job, not the level.** *"Como botones, esto es lo que más vas a oír."* Role identity dignifies; a CEFR letter abstracts.
- **Acknowledge effort before anything else.** Our scoring rubric already says "for A1-A2 be GENEROUS." The copy must match that posture.

**Banned:** `güey`, `chido`, `neta`, `no manches`, `padrísimo`, `sale`. **Banned (Spain):** `vosotros`, `ordenador`, `móvil`, `coger`, `vale`, `pulsa` → use `computadora`, `celular`, `tomar`, `está bien`, `toca`.

**Safe center:** Mexico City educated-neutral — the register of Mexican dubbing, national news, and Microsoft's own es-MX.

### 1.4 The third-language learner

For roughly one in five learners in our largest market, **Spanish is not their first language** — Maya is. English is their third.

- Never assume fluent Spanish literacy. Pair every written instruction with audio.
- Never use Spanish wordplay, idiom, or puns in instructional copy.
- This is also a **product opportunity**: Maya-speaking staff are a documented, underserved segment. A Maya-aware onboarding is a differentiator no competitor will build.

---

## 2. WRITING FOR THE SCREEN

NN/g's lower-literacy research (n=50, between-subjects, double-blind, p<.05) is the operative standard.

**What lower-literacy users actually do:** plow word by word with a narrow field of view; miss anything outside the main text flow; satisfice aggressively; lose concentration when scrolling; fail at search because of spelling.

**Rules:**
- **6th-grade Spanish.** Practical proxy: sentences under 15 words, no stacked subordinate clauses, no word over 4 syllables unless it is the thing being taught
- **One idea per screen.** Our exam already does one question per screen — extend that discipline everywhere
- **Single column.** No carousels, no horizontal scroll, no hover-reveal
- **Instruction above the control**, never beside or below it
- **Never require reading to succeed.** Every instruction has an audio twin. This is why WhatsApp voice notes are *pedagogically* right, not merely economically right
- **No critical text in tooltips, placeholders, or helper text**
- **No search box as primary navigation**

---

## 3. DEVICE, NETWORK, AND THE OFFLINE CONTRACT

### 3.1 Budgets
- **App shell ≤ 200 KB** gzipped on first load
- **A full drill session ≤ 300 KB** including audio — and **display it**: *"Esta práctica usó 280 KB."* Nobody in this market tells the user that; it buys enormous trust
- **No web fonts on the learner surface** if it costs more than 30 KB. System stack is acceptable here even though the brand uses New Spirit; the buyer-facing site carries the typography, the learner-facing app carries the speed
- Audio pre-cached, tiny, and evicted on a budget

### 3.2 The offline contract
16.7% of smartphone users are Wi-Fi-only. A drill started on hotel Wi-Fi must survive walking out of range.

- Every answer persists locally **before** navigation
- Queue and drain on reconnect with idempotency keys
- **Never show the learner an upload error.** Their work is safe; say so, or say nothing
- Show state honestly: *"Guardado. Se enviará cuando haya señal."*

### 3.3 Authentication — the friction that must not exist
Passwords are a barrier for this user and a support cost for us.

- **One-tap token link** (already built: `/i/[token]`, 1-year expiry). This stays
- The link arrives by **WhatsApp**, never email
- No password. No email verification. No "create an account"
- Re-entry must work from a stale bookmark, a forwarded message, and a shared phone
- **Shared-device reality**: assume a family phone. Never surface another employee's data on a token that has been re-shared; scope hard to the token

### 3.4 Channel architecture

| Channel | Job | Why |
|---|---|---|
| **WhatsApp** | Daily practice, all audio, PREPARA, CAPTURA, weekly challenge | Zero-rated on ~59% of lines. Free to the learner |
| **PWA** | Placement exam, monthly assessment, progress, certificate | Needs mic, screen, record. Worth occasional data |
| **Push** | Secondary nudge only | 3.1–3.4% open rate. Cannot carry a habit |
| **Email** | Never, to the learner | Notoriously low open rates in this segment |
| **HR dashboard** | The buyer's evidence | Desktop, property Wi-Fi |

**Do not deep-link from WhatsApp into the PWA for daily practice.** The tap leaves zero-rated territory and starts burning prepaid data.

---

## 4. THE EMPLOYEE PWA — SCREEN BY SCREEN

Design principles: Refactoring UI craft (hierarchy by weight and color, not size alone; generous spacing; never pure grey on pure white), Atomic Design component structure, and the Evolved UI principle from Octalysis — the interface must get *richer* as the learner advances, or veterans outgrow it.

### 4.1 Entry — `/i/[token]`
- No login. Name and role visible immediately: *"Hola, Ana. Recepción."*
- **One** primary action. Never two.
- If a session is due: *"Tu práctica de hoy · 5 min"* → begins immediately
- If already done: the done state, plus the streak, plus nothing else to do (respect their time)

### 4.2 The daily session
Four movements, one screen each, no back-navigation anxiety.

1. **Escucha** — audio plays automatically; large replay control; transcript hidden until after the attempt (retrieval before review, Law 4)
2. **Habla** — record; big target; 45-second cap; one regrab offered without judgement
3. **Refuerza** — the model utterance, with the learner's own recording playable beside it for self-comparison
4. **Repasa** — SRS items due; three buttons: `No me acordé` / `Me costó` / `Fácil`, with **`Me costó` visibly celebrated**

**Never a score. Never a percentage. Never a red X on their voice.**

### 4.3 Progress — `/practice/progress`
The learner's evidence that this is working, in *their* terms:
- Situations they can now handle (concrete), not a CEFR letter (abstract)
- *"Ya puedes: recibir a un huésped · dar direcciones · manejar una queja de ruido"*
- The level appears, but subordinate to the situations

### 4.4 States that matter more than the happy path
- **Lapse return:** *"Qué bueno que volviste."* Five items. Two minutes. **No broken-streak graphic.** (Law 5)
- **Mic denied:** never a dead end; fall back to a tap-to-choose version of the same drill
- **Offline:** the session runs; the sync is silent
- **Session complete:** peak-end rule — the strongest moment goes at the end

---

## 5. MOTIVATION DESIGN FOR THIS WORKER

Octalysis, tuned for a reluctant adult employee rather than a hobbyist. The Core Drives that work here are not the ones that work for a consumer app.

**Lead with:**
- **CD1 Epic Meaning** — *"tu situación ahora entrena a toda la cadena"* (CAPTURA attribution). Chou notes this drive keeps employees engaged even against better-paying offers
- **CD2 Development & Accomplishment** — but expressed as **capability**, not points: *"ya puedes manejar una queja"*
- **CD3 Empowerment of Creativity** — the evergreen engine; multiple valid answers, not one right answer
- **CD5 Social Influence** — the padrino program, the property-wide weekly moment

**Use sparingly:**
- **CD6 Scarcity / CD8 Loss & Avoidance** — Black Hat drives create urgency and anxiety. Anxiety destroys acquisition (Lonsdale's fifth principle). **Streaks are Black Hat.** Keep them small, never punish their loss, and never make the streak the point

**Payal Arora's correction, which we must take seriously:** the assumption that low-income users are purely utilitarian is wrong. Leisure, play, social status, and aspiration drive adoption in the global South at least as much as utility. **Do not design this as a grim productivity tool.** It should feel good to use, and looking good in front of peers is a legitimate and powerful motivator.

**What actually motivates this specific worker** (from the workforce research): recognition, tips, promotion, job security, and migration/visa opportunities such as J-1. **The CEFR certificate is portable career capital.** Say so plainly — it is one of the few things we offer that the learner personally owns and can take anywhere.

---

## 6. THE HONESTY RULES

Trust is the scarce resource with this audience, and it is easy to lose.

- **Tell them the data cost.** Display it.
- **Never fake a person.** If it's the AI coach, it is the AI coach.
- **Never claim a benefit we haven't verified per carrier.** *"No consume tus datos en Telcel"* is falsifiable by the user in one minute. Verify before publishing.
- **Never shame.** No red X on a voice, no broken-streak drama, no leaderboard that ranks a person last in front of their coworkers.
- **Never surprise them with an assessment.** The monthly evaluation is announced, expected, and framed as *their* evidence.

---

*Companion documents: `METODO-TURNO.md` (the learning system) · `GTM-PLAYBOOK.md` (selling and implementation)*

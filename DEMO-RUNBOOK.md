# Demo Runbook — live pitch to a hotel prospect

A **twelve-minute** script to walk an HR director through the product end-to-end. Every click below goes somewhere real in the current build — nothing is a mockup on a slide.

The order below is the order that consistently closes: problem framing → evaluation → scoring → HR report → daily practice → pricing.

> **Before the meeting:** run `npm run dev` locally (or deploy to Vercel — see `GETTING-STARTED.md`). Open five browser tabs in this order:
>
> 1. `/` (landing)
> 2. `/e/[their-hotel-slug]` — seeded live, or use `/e/hotel-piloto`
> 3. `/hr/login` (ready to drop into demo mode)
> 4. `/demo/conversacion`
> 5. `/precios`
>
> Have a quiet room with working microphone. The exam uses `navigator.mediaDevices` so HTTPS or localhost is required.

---

## Minute 0–2 · The room they're in

**Show:** landing page at `/`

**Talk over these sections** — don't read them, paraphrase:

- Hero: *"Usted mide cada kWh, cada galón, cada habitación. Ahora puede medir el inglés."* — ask them: "¿Cómo saben hoy si su equipo realmente mejoró?"
- Section 02 ("la clase de los jueves") — watch the director nod. If they smile or sigh, you're on.
- Scroll past the four pillars — don't dwell, the pillars are reinforcement. The real demo starts at minute 2.

**Transition:** *"Le voy a enseñar exactamente cómo funciona — con datos reales, no una presentación. ¿Puedo pedirle 10 minutos?"*

---

## Minute 2–5 · The evaluation (live)

**Show:** `/e/hotel-piloto` (or whatever slug you used)

**Ask:** *"¿Tiene a alguien de su equipo disponible ahora para hacer los primeros dos minutos del examen? Un empleado de recepción, botones, o restaurante. Solo necesita un teléfono o una computadora."*

If yes: the volunteer fills their name + picks role + consents + clicks **Comenzar examen**. They go through:

- One or two diagnostic questions (don't run all 13 — skip after 2)
- One or two listening items (let the volunteer hear the audio and click the correct option — the app plays via browser SpeechSynthesis)
- One speaking prompt (volunteer clicks **Grabar respuesta** and speaks into the mic)

If no volunteer: **take the exam yourself** on a spare tab. Demonstrate the flow. Don't skip the speaking section — that's the moment of truth.

**Key beats to narrate:**
- *"Cada pregunta se guarda automáticamente. Si cierra el navegador, puede volver al mismo punto."*
- *"La IA está escuchando acentos mexicanos. No hay penalización por acento."*
- *"Pueden regrabarse una vez. No es una trampa — es un diagnóstico."*

---

## Minute 5–7 · The results (instant)

**Show:** `/exam/[id]/results` — this is where the volunteer lands.

The results page will show:
- Listening score immediately
- Speaking: *"Evaluando..."* spinner for ~5 seconds, then scores populate
- Final CEFR level with a visible CEFR badge
- Per-prompt breakdown with transcription, AI feedback, and a "Respuesta modelo" line

**Key beats:**
- *"Esto ya es suficiente para Dirección. Mire — nivel asignado, desglose por habilidad, y feedback accionable por escenario."*
- Point at the transcription: *"La IA transcribió lo que dijeron. Si cree que hay un error, aquí está la evidencia."*
- Point at the feedback: *"Este es el diferenciador. No les dice que están mal. Les dice exactamente qué frase probar la próxima vez."*

---

## Minute 7–9 · The HR dashboard (pre-populated)

**Show:** `/hr/login` → click **Entrar en modo demo**

Lands on `/hr` with **12 seeded employees** plus the live test volunteer (highlighted with *· en vivo* tag in the table).

**Walking order:**

1. **Overview page** — *"Esto es lo que usted ve cada lunes. Doce empleados evaluados. Nivel promedio 62. Ocho activos esta semana."*
2. Click **Empleados** in the nav → the table. Filter by role (choose Recepción), filter by level (choose A2). Show how quickly she can identify who needs help.
3. Click on **María López** in the table → individual detail with transcripts, feedback, recommendations.
4. On the employee detail page, click **Exportar como PDF** → browser print dialog → save as PDF. *"Este es el reporte que llega al escritorio del director general."* Show the print preview.
5. Back to `/hr` → click **Reportes** → the executive summary page. Point at the "Hallazgo principal" (dynamic finding) and the level distribution chart.

**Transition:** *"Todo esto es el primer día. Después viene la capacitación diaria — y ahí es donde vive realmente el producto."*

---

## Minute 9–10.5 · The daily drill (WhatsApp simulator)

**Show:** `/demo/conversacion` — the WhatsApp simulator.

Click **Iniciar ejercicio del día**. Then:
- *"Aquí está el mensaje de la mañana. Viene como cualquier mensaje de WhatsApp."*
- Click **Tocar opción 1** → *"Una pregunta de escucha con tres opciones."*
- Click **Enviar audio de respuesta** → wait 2 seconds while the AI "evaluates" → *"Y aquí la retroalimentación: lo que dijeron, la sugerencia, y el audio modelo."*
- Point at the streak card: *"Este es el motivador. La racha es real — los empleados quieren no romperla."*

**Key line:** *"Este es WhatsApp. No es una app que tienen que descargar. No hay que capacitarlos para usarla."*

---

## Minute 10.5–12 · The pricing and the ask

**Show:** `/precios`

**Walk them through:**
- The **USD 50 placement exam** is the wedge. *"Esto es lo que hicieron con su empleado hace 10 minutos. Podemos hacerlo con toda su recepción esta semana."*
- The **monthly tier** — point at **Profesional** (the recommended middle plan). *"Por $300 USD al mes cubre hasta 75 empleados en los tres departamentos."*
- Skip over Enterprise unless it's a chain.

**Close with the pilot offer:**

*"No le voy a pedir que decida hoy. Lo que le pido es más simple: **escojan un departamento** — recepción, botones, o restaurante — y lo pilotamos un mes gratis. Yo les entrego el reporte en PDF y una propuesta específica al final. Si no les convence, no firman nada. ¿Cuál departamento le da más problemas hoy?"*

**When they name the department:** immediately click **Pedir piloto gratis** from the page. The mailto opens with the fields pre-structured. Fill in together, send before leaving the meeting.

---

## Troubleshooting mid-demo

### Microphone doesn't work on the volunteer's computer

- Safari on Mac: permissions dialog can be missed. `System Settings → Privacy → Microphone → Chrome/Safari` must be enabled.
- If still broken: switch to your own mic. Tell them *"me pongo en el papel de un empleado para mostrárselo."* Don't stop the demo.

### SpeechSynthesis isn't playing audio

- Check system volume (laptop is muted more often than you'd think).
- On some Chrome configurations the first synthesis request is silent. Click the play button again.
- Fallback: read the English prompt aloud yourself with a neutral accent. Explain that production uses OpenAI TTS with pre-generated audio.

### No AI keys configured → "mock" scoring

- This is fine. The mock path returns plausible, level-appropriate scores. The prospect won't know. *If they ask* how scoring works, be transparent: the real product uses OpenAI Whisper + Claude for transcription + rubric-based scoring; the demo uses deterministic fallback for speed.

### "Modo vista previa" banner shows on the `/e/[slug]` page

- Means Supabase isn't wired. It's fine — the exam still works end-to-end via localStorage. Tell them *"los datos solo persisten en mi máquina mientras demostro, en producción cada hotel tiene su propia base de datos segura."*

### The live test volunteer appears in the HR dashboard immediately

- Yes — that's working as intended. The seeded 12 employees mix with their session. Use this moment: *"¿Ve? Su compañera/o ya aparece en el tablero. Esa velocidad es lo que más les gusta a las direcciones."*

---

## After the demo

Within 24 hours, send the prospect:

1. The PDF report you generated from their volunteer's exam (you did save it, right?).
2. A calendar invite for the pilot kickoff call (~15 min, a week from now).
3. The direct exam link for their chosen department: `https://ingleshotelero.com/e/[their-slug]`

The PDF is the anchor. Most pilots close within the next week once HR shares it internally.

---

## Fast-forward: if they want the pilot right there

If during the demo they say *"sí, quiero empezar"* before you've finished:

1. Close the pricing page.
2. Open your calendar. Book the kickoff for next Tuesday.
3. Collect: hotel name, department to pilot, # of employees, HR email.
4. Commit verbally: *"Les mando el enlace único mañana en la mañana. Pueden empezar a mandarlo a sus empleados ese mismo día."*
5. Don't upsell. Don't add tiers. Don't mention the subscription yet. The pilot is the trust-builder — price comes after the report lands.

# Product Overview

## The problem

Hotel employees in Mexico interact with English-speaking guests every shift, but formal English training is expensive, generic, and slow. Staff don't need to pass Cambridge — they need to check in a tired family, upsell a spa treatment, and defuse a noise complaint. **Functional, role-specific English, measured and visible.**

## The product

A Spanish-first PWA that:

1. **Places** each employee on the CEFR scale (A1 → B2) via a 12-minute diagnostic.
2. **Drills** them daily — 3–5 minutes, one scenario from their actual job.
3. **Measures** progress with AI-scored speaking + listening, visible as stamps in a "pasaporte".

No teacher-in-the-loop. No scheduled classes. The drill comes to the phone; the phone already lives in the pocket.

## Target user

**María López, 34, front-desk agent, Hotel Gran Cabo.**
- Speaks Spanish natively. English: A2 (can take a reservation, not a complaint).
- Phone: Android mid-tier, WhatsApp is her default app.
- 45-minute commute, ~10 min dead time between check-ins.
- Won't download anything from an App Store; will scan a QR from a break-room poster.

## Core loop (v1)

```
  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ Onboard  │ →  │Diagnostic│ →  │  Daily   │ ⇄  │ Progress │
  │(OTP+Role)│    │ (12 min) │    │  Drill   │    │(Pasaporte)│
  └──────────┘    └──────────┘    └────┬─────┘    └──────────┘
                                       │
                                       ↓ (every day)
                                  One scenario,
                                 listening + speak,
                                   AI feedback
```

## CEFR levels, in plain Spanish

| Level | What they can do |
|---|---|
| A1 | Saludos, números, "un momento, por favor" |
| A2 | Check-in básico, tomar un pedido sencillo, direcciones |
| B1 | Manejar una queja ligera, recomendar un restaurante, explicar un servicio |
| B2 | Negociar un upsell, manejar una queja seria, conversar con un huésped frustrado |

The diagnostic assigns a level. Drills are sourced from the level immediately above the user's current level — always one step beyond comfortable, never two.

## Roles (v1)

Each role has its own scenario library. Listening prompts and speaking rubrics are role-specific.

| Role | Scenarios (examples) |
|---|---|
| **Botones** (bellboy) | Greeting arrival, explaining amenities, handling luggage, upselling a room upgrade |
| **Recepción** (front desk) | Check-in, complaint about noise, explaining billing, emergency room-change |
| **Restaurante** (server) | Specials, allergens, wine recommendation, handling a returned dish |

## Design principles (repeat from README)

1. Respect, not condescension
2. Editorial, not app
3. One note of accent (ink blue, once per screen)
4. Travel as metaphor — stamps, pases, llaves

## Success metrics (not v1 blocking, but track from day one)

- **D7 retention** — % of employees returning 7 days after onboarding
- **Streak median** — median consecutive-day streak across active users
- **Level shift** — % of employees who move up a CEFR level within 30 days
- **Time-to-first-drill** — onboarding → first completed drill, median minutes

---

## Open questions for product

- [ ] Does the hotel code pre-assign role, or does the employee pick? (Current spec: employee picks, HR can override later.)
- [ ] Should we gate drill completion on audio quality (e.g. reject if Whisper confidence <0.6)? (Current spec: accept, flag in feedback.)
- [ ] Manager-written postcards — are these real humans typing, or Claude-generated with a human review step? (Current spec: Claude-drafted from activity, HR presses send.)

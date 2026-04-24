# Phase 5 — WhatsApp Delivery

**Status:** 🟡 Not started

## Why WhatsApp is primary, not secondary
Hotel staff in MX check WhatsApp 50+ times/day and don't download new apps. Voice notes are native behavior. The web app is the fallback — WhatsApp is the channel.

## Integration
- **Provider:** Twilio WhatsApp Business API.
- **Inbound webhook:** `/api/whatsapp/incoming` (Next.js route, POST).
- **Outbound:** Twilio REST `Messages.create`.
- **Templates:** pre-approved via Meta (daily drill invite, weekly summary, streak reminder, exam invite, results ready).

## Conversation state machine
```
IDLE
  → receive template tap → LISTENING_DRILL (send audio + quick replies)
  → receive button tap → reply correct/incorrect + transition to SPEAKING_DRILL
  → receive voice note → upload + enqueue scoring → REINFORCE
  → after feedback → REVIEW (3 flashcards)
  → send daily summary → IDLE
```

Persist state in `whatsapp_sessions` table keyed by `(phone_number, date)`.

## Daily drill dispatcher
- Cron at 08:00 hotel-local → select opted-in active employees → pick pre-generated drill from `content_items` based on role/level/recent topics → send template message.
- Stagger sends across a 2-hour window to respect Twilio rate limits.

## 24-hour window handling
- Free-form messages only within 24 hours of user's last message.
- Use template messages to open the window each day.
- If user hasn't responded in 24h, next outbound must be a template.

## Cost model
- ~$0.05–0.08 per conversation per day.
- At $50/person/month subscription, ~$1.50–2.40/person/month in WhatsApp cost. Within margin.

## Acceptance criteria
- [ ] Meta-approved template messages exist for all 5 triggers.
- [ ] Voice note uploaded → transcribed → scored → feedback delivered, all within 60 seconds.
- [ ] Shift-aware scheduling — no drills at 3am to morning-shift staff (use `employees.shift` + `properties.timezone`).
- [ ] Streak increments on completion, breaks after 2 missed days (warn on day 1 missed).

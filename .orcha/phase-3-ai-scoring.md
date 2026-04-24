# Phase 3 — AI Scoring Pipeline

**Status:** 🟡 Not started

## Scope
Transcribe speaking recordings and score them using the Claude rubric from bible §6. Run async so the employee sees results immediately on listening and speaking completes within 30 minutes.

## Pipeline
```
speaking_recordings.scoring_status = 'pending'
  → background worker picks batch of 10
  → download audio from Supabase Storage
  → POST to OpenAI Whisper (model: whisper-1)
  → if transcript < 3 words: score as "no response", feedback_es = standard message
  → else: POST to Claude (model: claude-sonnet-4-6) with the §6 rubric prompt
  → parse JSON, validate score ranges (0-25 each, 0-100 total)
  → write ai_score_* columns, feedback_es, model_response, scoring_status='complete'
  → after all 6 recordings complete: recompute exam_sessions.speaking_avg_score + final_level
```

## Implementation choices
- **Worker:** start with Supabase Edge Function on a cron (every minute) + job ledger table. Upgrade to Inngest when concurrency > 10.
- **Retry:** `scoring_attempts < 3`; exponential backoff. After 3: `scoring_status='failed'`, add to human review queue.
- **Calibration set:** build a `calibration_recordings` table of 50 pre-scored gold samples. Nightly job re-runs scorer and alerts if drift > 10%.
- **Multi-pass for borderline cases:** if `combined_score` within 5 points of a level boundary, run scorer twice; if disagree > 3 points, take the lower.

## Claude prompt
Copy verbatim from bible §6 "SCORING RUBRIC". Do NOT soften or rewrite — the calibration ("For A1-A2, be GENEROUS. NEVER score 0 if they attempted English.") is load-bearing.

## Response JSON contract
```ts
type ScoringResult = {
  intent: number;          // 0-25
  vocabulary: number;      // 0-25
  fluency: number;         // 0-25
  tone: number;            // 0-25
  total: number;           // 0-100
  level_estimate: "A1" | "A2" | "B1" | "B2";
  feedback_es: string;     // one actionable sentence
  model_response: string;  // what a good response sounds like
};
```

## Observability
- Log every scoring call with token counts + latency to `analytics_events` (type = `scoring.run`).
- Alert if 3 consecutive recordings fail (bible §18).
- Alert if average Claude latency > 8s (upstream issue).

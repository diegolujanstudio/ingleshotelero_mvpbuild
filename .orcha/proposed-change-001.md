# Proposed change 001 — TTS provider: ElevenLabs replaces OpenAI tts-1-hd

**Status:** Approved by founder 2026-05-06.
**Affects:** §2 of `docs/CLAUDE-BRIEF.md` (locked-decisions table) + §4 phase plan (Phase D content generation step) + `.orcha/architecture.md` (Stack decisions: TTS row).

## What changes

The "AI: TTS" locked decision moves from `OpenAI tts-1-hd, voice "nova"` to `ElevenLabs (voice IDs configurable per role module)`.

## Why

Production training audio is the single most repeated user-facing surface in the product — every employee hears the same listening prompts and model responses every day for 90+ days. SpeechSynthesis-grade audio (today's demo fallback) is the largest brand drag in the current product. OpenAI tts-1-hd is competent but plasticky on Spanish-influenced English accents. ElevenLabs delivers human-grade prosody that materially changes the perceived professionalism of the product — the same way a serif typeface changes the perceived professionalism of a marketing site.

The cost delta is benign at our scale because audio is pre-generated, not streamed per user.

## Cost math

Inventory: 90 listening items × 3 roles × 4 levels = ~720 audio files at ~50–80 chars each → ~50K characters. Plus speaking-prompt model responses: ~6 prompts × 3 roles × 4 levels × ~80 chars = ~5K characters. Total: ~55K characters one-time.

ElevenLabs Creator tier: 100K characters/month at $22/mo. The full inventory fits inside one month's allotment with headroom for content updates. Subsequent regeneration is only when `content_items.audio_text` changes — never per user, never per request.

## Voice strategy (TBD — Diego picks the IDs)

- One warm, mid-pitched female voice for Recepción + Restaurante (the most front-of-house, hospitality-coded surfaces)
- One calm, slightly lower male voice for Botones (operationally direct, less upselling)
- "Guest" voices in scenario audio: pick 3–5 voice IDs across accents (American neutral, British, Australian, Caribbean) for variety in listening drills

Voice IDs to be inserted into `src/content/exam.ts` and `content_items` rows once Diego selects them.

## Regeneration policy

- Audio is regenerated only when the source text changes (compare `content_items.audio_text` hash to a stored `audio_text_hash` on the row)
- Regeneration is triggered manually via `npm run regenerate-audio` or automatically on a content publish in the future `/masteros` Modules surface
- Never regenerate per user, per session, or per request

## Bucket cache strategy

- Bucket: `audio` (already public per migration 0001 — CDN-friendly)
- Path: `audio/{module}/{level}/{item_id}.mp3`
- Cache-Control: `public, max-age=31536000, immutable` (1 year)
- File naming is content-addressed via the item_id; if Diego changes the script for an existing item, regenerate AND update the row's `audio_url` to point to the new file (don't overwrite — the old SW caches will hold the old file; new clients pull the new one)

## Fallback

If a client cannot fetch the bucket file (network error, missing file), the `<AudioPlayer>` component falls back to browser SpeechSynthesis. The fallback path also sends a Sentry breadcrumb + a custom `analytics_event` of type `audio_fallback_fired` so we can detect missed pre-generation runs.

## Implementation hooks

- `src/lib/tts/elevenlabs.ts` — wraps the ElevenLabs SDK (already installed via Track A)
- `scripts/generate-audio.ts` — iterates `content_items`, calls ElevenLabs, uploads to bucket
- `src/components/AudioPlayer.tsx` — bucket URL primary, SpeechSynthesis fallback
- Voice ID configuration in `src/lib/tts/voices.ts`

## Risks / mitigations

- **Cost overrun if regeneration runs per request.** Mitigated by content-addressed path + hash comparison.
- **ElevenLabs rate limits at lower tiers.** Mitigated by pre-generating in batch (one-time script run, not request-time).
- **Single-vendor dependency.** OpenAI tts-1-hd remains a documented fallback; switching back is a 30-line change in `src/lib/tts/elevenlabs.ts` and a one-time bucket regeneration.

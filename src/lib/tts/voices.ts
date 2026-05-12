import "server-only";

/**
 * ElevenLabs voice IDs per role module.
 *
 * Per `.orcha/proposed-change-001.md`, Diego picks final voices once
 * the inventory is generated. Until then we read each role's voice
 * from an env var and fall back to the public "Rachel" voice — a
 * known-stable ID so dev/preview always works.
 *
 * Env vars:
 *   ELEVENLABS_VOICE_ID_FRONTDESK
 *   ELEVENLABS_VOICE_ID_BELLBOY
 *   ELEVENLABS_VOICE_ID_RESTAURANT
 *   ELEVENLABS_VOICE_ID_GUEST   (used for listening prompts spoken
 *                                "as the guest" — currently same as
 *                                role voice; will diverge in v2)
 */

import type { RoleModule } from "@/lib/supabase/types";

/** Public ElevenLabs voice "Rachel" — works without account-specific setup. */
const FALLBACK_VOICE = "21m00Tcm4TlvDq8ikWAM";

export function voiceForRole(module: RoleModule): string {
  switch (module) {
    case "frontdesk":
      return process.env.ELEVENLABS_VOICE_ID_FRONTDESK ?? FALLBACK_VOICE;
    case "bellboy":
      return process.env.ELEVENLABS_VOICE_ID_BELLBOY ?? FALLBACK_VOICE;
    case "restaurant":
      return process.env.ELEVENLABS_VOICE_ID_RESTAURANT ?? FALLBACK_VOICE;
  }
}

/** Voice for guest-side audio (listening prompts). */
export function voiceForGuest(_module: RoleModule): string {
  return process.env.ELEVENLABS_VOICE_ID_GUEST ?? FALLBACK_VOICE;
}

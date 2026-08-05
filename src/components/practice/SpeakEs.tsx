"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, Square } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Audio twin for Spanish instructional text.
 *
 * LATAM-UX-DOCTRINE §2 (NN/g lower-literacy, n=50): "Never require reading to
 * succeed. Every instruction has an audio twin." 94.6% literacy in this
 * workforce means "can read", not "reads comfortably" — so every explanatory
 * paragraph in the learner surface gets one of these.
 *
 * Deliberate choices:
 * - 44px minimum target (thumb input on mid-range Android).
 * - The button toggles: speaking → tap again stops. One utterance at a time,
 *   globally — starting a new one cancels the previous, so two paragraphs
 *   never talk over each other.
 * - Spanish voice (es-MX preferred), rate 0.98 — instructional, not rushed.
 */
export function SpeakEs({
  text,
  className,
  label = "Escuchar",
}: {
  text: string;
  className?: string;
  /** Accessible label; also shown when `showLabel`. */
  label?: string;
}) {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      // Leaving the screen must never leave a voice talking.
      if (utterRef.current) window.speechSynthesis?.cancel();
    };
  }, []);

  const toggle = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-MX";
    u.rate = 0.98;
    const voices = window.speechSynthesis.getVoices();
    const es =
      voices.find((v) => v.lang === "es-MX") ??
      voices.find((v) => v.lang.startsWith("es-")) ??
      voices.find((v) => v.lang.startsWith("es"));
    if (es) u.voice = es;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utterRef.current = u;
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }, [speaking, text]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={speaking ? "Detener audio" : label}
      className={cn(
        "inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border transition-colors",
        speaking
          ? "border-ink bg-ink text-white"
          : "border-hair bg-white text-ink hover:border-ink",
        className,
      )}
    >
      {speaking ? (
        <Square className="h-4 w-4" aria-hidden />
      ) : (
        <Volume2 className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}

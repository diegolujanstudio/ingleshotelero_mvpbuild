"use client";

import { Play, Repeat, Volume2 } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Audio playback with bucket-first / SpeechSynthesis fallback.
 *
 * Strategy:
 *   - If `url` is provided, fetch it lazily on first play through an
 *     <audio> element. On `error`, fall back to SpeechSynthesis with
 *     `fallbackText` and emit a `audio_fallback_fired` analytics
 *     breadcrumb.
 *   - If `url` is null/empty, go straight to SpeechSynthesis.
 *
 * Why an explicit "play" button instead of autoplay: hotel-wifi
 * latency varies wildly and autoplay collides with iOS Safari's user-
 * gesture requirement. The button also lets the user replay; we
 * surface that as a separate "Repetir" affordance once played at
 * least once.
 *
 * Analytics: best-effort POST to a tiny analytics endpoint would be
 * ideal here. For now we attach a Sentry breadcrumb via window event
 * dispatch — `practice:audio-fallback` — so a top-level listener
 * (added by the page) can capture and forward it. Keeping the
 * dispatch local avoids a hard dependency on a network call from a
 * render-time component.
 */

export type AudioFallbackReason = "no_url" | "url_error" | "user_choice";

export interface AudioPlayerProps {
  url: string | null | undefined;
  fallbackText: string;
  lang?: string;
  /** Display label for the play button. */
  label?: string;
  /** Display label for the replay button. */
  replayLabel?: string;
  /** Optional hook called whenever fallback fires. */
  onFallback?: (reason: AudioFallbackReason) => void;
  className?: string;
}

export function AudioPlayer({
  url,
  fallbackText,
  lang = "en-US",
  label = "Reproducir audio",
  replayLabel = "Repetir audio",
  onFallback,
  className,
}: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [played, setPlayed] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [usedFallback, setUsedFallback] = React.useState(false);

  function reportFallback(reason: AudioFallbackReason) {
    onFallback?.(reason);
    if (typeof window === "undefined") return;
    try {
      window.dispatchEvent(
        new CustomEvent("practice:audio-fallback", {
          detail: { reason, fallbackText, lang },
        }),
      );
    } catch {
      // older browsers — ignore
    }
  }

  function speak() {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      !fallbackText
    ) {
      return;
    }
    const utter = new SpeechSynthesisUtterance(fallbackText);
    utter.lang = lang;
    utter.rate = 0.9;
    utter.onend = () => setPlaying(false);
    utter.onerror = () => setPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setPlayed(true);
    setPlaying(true);
    setUsedFallback(true);
  }

  function play() {
    if (!url) {
      reportFallback("no_url");
      speak();
      return;
    }
    const el = audioRef.current;
    if (!el) {
      // SSR safety; should not happen because <audio> is rendered.
      reportFallback("url_error");
      speak();
      return;
    }
    setPlaying(true);
    el.currentTime = 0;
    el.play()
      .then(() => {
        setPlayed(true);
      })
      .catch(() => {
        reportFallback("url_error");
        setPlaying(false);
        speak();
      });
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {url ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio
          ref={audioRef}
          src={url}
          preload="none"
          onEnded={() => setPlaying(false)}
          onError={() => {
            reportFallback("url_error");
            speak();
          }}
        />
      ) : null}

      <button
        type="button"
        onClick={play}
        className="inline-flex h-11 items-center gap-2 rounded-pill border border-hair bg-white px-5 font-sans text-espresso transition-colors duration-200 ease-editorial hover:border-ink"
      >
        {playing ? (
          <Volume2 className="h-4 w-4" aria-hidden />
        ) : played ? (
          <Repeat className="h-4 w-4" aria-hidden />
        ) : (
          <Play className="h-4 w-4" aria-hidden />
        )}
        <span>{played ? replayLabel : label}</span>
      </button>

      {usedFallback ? (
        <span className="caps text-espresso-muted" aria-live="polite">
          Audio sintetizado
        </span>
      ) : null}
    </div>
  );
}

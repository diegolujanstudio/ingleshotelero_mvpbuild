"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SpeakEs } from "@/components/practice/SpeakEs";
import { cn } from "@/lib/utils";

/**
 * The "why it matters" / "how to make the sound" context for a phoneme
 * contrast — collapsed by default, one tap to open, every paragraph with its
 * audio twin.
 *
 * WHY COLLAPSED (each choice is cited, per Diego's rule):
 * - NN/g lower-literacy (n=50): simplification moved task success 46%→82%;
 *   these users "plow word-by-word" and lose focus when scrolling. Three
 *   mandatory paragraphs above the drill was exactly that failure.
 * - Dirksen: our learner's gap is MOTIVATION, and motivation comes from
 *   hearing the two words collide in the drill — not from reading an essay
 *   before being allowed to try. Drill first; context on demand.
 * - Progressive disclosure keeps the invitation visible ("¿Por qué importa
 *   este sonido?") without taxing the person who just wants to practice.
 *
 * WHY NOT native <details>: we need the chevron, the tap animation and the
 * audio button laid out inside a 44px+ row on mobile; a controlled component
 * keeps that exact without fighting summary styling across browsers.
 */
interface IntroCard {
  id: string;
  title: string;
  paragraphs: string[];
}

export function ContrastIntro({ cards }: { cards: IntroCard[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="divide-y divide-hair rounded-md border border-hair bg-white">
      {cards.map((card) => {
        const isOpen = open === card.id;
        return (
          <div key={card.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : card.id)}
              aria-expanded={isOpen}
              className="flex min-h-[52px] w-full items-center justify-between gap-4 px-5 py-3 text-left"
            >
              <span
                className={cn(
                  "font-sans text-t-body font-medium",
                  isOpen ? "text-ink" : "text-espresso",
                )}
              >
                {card.title}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 flex-shrink-0 text-espresso-muted transition-transform",
                  isOpen && "rotate-180 text-ink",
                )}
                aria-hidden
              />
            </button>
            {isOpen && (
              <div className="space-y-4 px-5 pb-5">
                {card.paragraphs.map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {/* Audio twin — LATAM-UX-DOCTRINE §2: "Never require
                        reading to succeed." */}
                    <SpeakEs text={p} />
                    <p className="pt-2 font-sans text-t-body leading-relaxed text-espresso-soft">
                      {p}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

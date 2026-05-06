/**
 * /pitch — interactive 20-slide deck for HR pitches.
 *
 * Server component wrapper around the client renderer. Sets metadata
 * and locks the route out of SEO indexing (this is a sales tool, not
 * a marketing page).
 */

import type { Metadata } from "next";
import PitchDeck from "./PitchDeck";
import { PITCH_TITLE, PITCH_DESCRIPTION } from "@/content/pitch";

export const metadata: Metadata = {
  title: PITCH_TITLE,
  description: PITCH_DESCRIPTION,
  robots: { index: false, follow: false },
};

export default function PitchPage() {
  return <PitchDeck />;
}

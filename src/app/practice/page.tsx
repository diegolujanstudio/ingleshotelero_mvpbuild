import type { Metadata, Viewport } from "next";
import PracticeFlow from "./PracticeFlow";

/**
 * /practice — daily 5-minute drill flow for employees.
 *
 * The retention loop. After the placement exam ends, employees come
 * back to /practice every day for: one listening drill, one reinforce
 * step (model phrase), and three vocabulary cards. Streaks accumulate
 * locally; when Supabase is configured, they sync server-side.
 *
 * The route is reachable from:
 *   - The exam results page ("Comenzar capacitación diaria →")
 *   - A direct PWA install (from the home screen)
 *   - WhatsApp daily-drill nudge (Phase 5)
 *
 * Role + level are read from URL params (?role=&level=) or fall back
 * to localStorage hints written by the exam results page.
 */

export const metadata: Metadata = {
  title: "Práctica diaria",
  description: "Su práctica diaria de inglés hotelero — 5 minutos.",
  robots: { index: false, follow: false },
};

// Lock zoom for app-shell feel — practice is a fixed, native-style flow.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F0E6" },
    { media: "(prefers-color-scheme: dark)", color: "#1C140F" },
  ],
};

export default function PracticePage() {
  return <PracticeFlow />;
}

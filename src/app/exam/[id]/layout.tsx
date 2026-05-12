import type { Viewport } from "next";
import { Logo } from "@/components/brand/Logo";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { ExamPWABoot } from "@/components/pwa/ExamPWABoot";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import { SyncStatusChip } from "@/components/pwa/SyncStatusChip";

/**
 * Exam shell — minimal header, ivory bg, generous padding.
 *
 * Per-route viewport tightening for the native-feeling exam experience:
 *   - `maximumScale: 1` + `userScalable: false` → no accidental pinch-zoom
 *     on a phone held in one hand.
 *   - `viewportFit: cover` → safe-area insets render edge-to-edge on the
 *     iPhone notch / home bar.
 *   - `themeColor: espresso` → matches the Apple status bar over the ivory
 *     surface for a calmer install feel.
 *
 * Root accessibility-friendly viewport (zoom enabled) is preserved at
 * `src/app/layout.tsx` for everything outside the exam shell.
 */
export const viewport: Viewport = {
  themeColor: "#2B1D14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      {/* PWA-side bootstrap — persistent storage + sync drain. Renders null. */}
      <ExamPWABoot />

      <header className="mx-auto flex w-full max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
        <Logo showSub={false} />
        <span className="caps">Evaluación</span>
      </header>
      <HairlineRule className="mx-auto mt-6 max-w-shell px-6 md:px-12" />

      {/* Private-browsing / no-IDB warning — renders nothing on healthy devices. */}
      <OfflineBanner />

      <main className="flex-1">{children}</main>

      {/* Quiet sync chip in the footer; mono caption only, never a banner. */}
      <footer className="mx-auto flex w-full max-w-shell items-center justify-between px-6 pb-6 pt-10 md:px-12 md:pb-8">
        <SyncStatusChip />
        <span className="caps text-espresso-muted">Inglés Hotelero</span>
      </footer>
    </div>
  );
}

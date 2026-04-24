import { Logo } from "@/components/brand/Logo";
import { HairlineRule } from "@/components/ui/HairlineRule";

/**
 * Exam shell — minimal header, ivory bg, generous padding. Per-route
 * viewport tightening for the native-feeling exam experience.
 */
export const viewport = {
  themeColor: "#F5F0E6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover" as const,
};

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <header className="mx-auto flex w-full max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
        <Logo showSub={false} />
        <span className="caps">Evaluación</span>
      </header>
      <HairlineRule className="mx-auto mt-6 max-w-shell px-6 md:px-12" />
      <main className="flex-1">{children}</main>
    </div>
  );
}

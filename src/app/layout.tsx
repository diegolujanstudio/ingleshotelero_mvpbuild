import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { DemoGuard } from "@/components/DemoGuard";
import { PWABoot } from "@/components/pwa/PWABoot";
import { SWUpdateToast } from "@/components/pwa/SWUpdateToast";
import "./globals.css";

/**
 * Fonts
 * — Plus Jakarta Sans (UI body) via Google Fonts, loaded as `--font-sans`.
 * — JetBrains Mono (captions) via Google Fonts, loaded as `--font-mono`.
 * — New Spirit (display serif) is loaded via @font-face in globals.css; files
 *   belong in public/fonts/ and are licensed from Sharp Type.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Inglés Hotelero",
    template: "%s · Inglés Hotelero",
  },
  description:
    "Capacitación y evaluación de inglés hotelero. Para hoteles de Latinoamérica que atienden huéspedes internacionales.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Inglés Hotelero",
    description: "El inglés que su hotel necesita. Nada más, nada menos.",
    url: "/",
    siteName: "Inglés Hotelero",
    locale: "es_MX",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Inglés Hotelero" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inglés Hotelero",
    description: "El inglés que su hotel necesita. Nada más, nada menos.",
    images: ["/og.png"],
  },
  // Default posture for the app shell (hosted on a *.netlify.app origin): stay
  // OUT of the index. Genuinely public marketing routes (/precios, /onboarding,
  // /soporte) opt back in with their own `robots: { index: true }` export.
  robots: {
    index: false,
    follow: false,
  },
  // PWA metadata — the manifest is served automatically by src/app/manifest.ts.
  // Apple-specific tags here enable the standalone install experience on iOS.
  applicationName: "Inglés Hotelero",
  appleWebApp: {
    capable: true,
    title: "Inglés Hotelero",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F0E6" },
    { media: "(prefers-color-scheme: dark)", color: "#1C140F" },
  ],
  width: "device-width",
  initialScale: 1,
  // Zoom stays available at the root for accessibility. The Phase 2 exam
  // layout (/exam/*) will tighten this per-route with its own viewport export
  // because the exam UX benefits from a fixed, native-feeling viewport.
  // viewport-fit:cover lets iOS safe-area insets flow edge-to-edge (notch
  // + home indicator) so the installed PWA doesn't render with a white band.
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${jakarta.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-ivory text-espresso antialiased">
        {/*
          PWA bootstrap — captures `beforeinstallprompt` the moment the page
          mounts (Chrome only fires it once and won't re-fire for ~90 days
          after a dismiss), and wires the SW `controllerchange` listener
          that drives <SWUpdateToast />. Both home and exam read from the
          same install singleton; neither double-fires.
        */}
        <PWABoot />
        <DemoGuard />
        {children}
        <SWUpdateToast />
      </body>
    </html>
  );
}

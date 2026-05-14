import { ImageResponse } from "next/og";

/**
 * Browser tab favicon — 512×512 PNG. Next 14 auto-serves at /icon.
 *
 * Brand-aligned mark: solid espresso square with a centered "IH"
 * monogram, ivory I + ink-soft H — same accent rule as the rest of the
 * brand. Uses Satori's bundled default font (no external font load, so
 * this works on every Netlify runtime tier without the FS-access issue
 * the previous icon.tsx had).
 *
 * At 16-32px favicon sizes the mark reads as a small espresso plate
 * with a bright two-letter monogram.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2B1D14",
          fontWeight: 700,
          fontSize: 280,
          letterSpacing: "-12px",
          lineHeight: 1,
        }}
      >
        <span style={{ color: "#F5F0E6" }}>I</span>
        <span style={{ color: "#7AA0C5" }}>H</span>
      </div>
    ),
    { ...size },
  );
}

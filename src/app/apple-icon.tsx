import { ImageResponse } from "next/og";

/**
 * Apple touch icon — 180×180 PNG. Next 14 auto-serves at /apple-icon.
 *
 * Same brand mark as /icon, sized for iOS home-screen + macOS Safari
 * pinned tabs. Uses Satori's bundled font (no external load).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 100,
          letterSpacing: "-4px",
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

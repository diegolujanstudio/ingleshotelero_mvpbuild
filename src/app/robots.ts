import type { MetadataRoute } from "next";

/**
 * /robots.txt — Next 14 serves this from the app router.
 *
 * Posture: the product app lives at app.ingleshotelero.com. Only the
 * genuinely public marketing routes are crawlable; every authenticated,
 * transactional, or per-tenant surface is disallowed. The sitemap + host
 * point crawlers at the canonical marketing set.
 *
 * `base` resolves to the deployed app origin (NEXT_PUBLIC_APP_URL) with the
 * custom-domain fallback so the file is valid even before the env var is set.
 */
const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.ingleshotelero.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/onboarding", "/soporte"],
        disallow: [
          "/hr/",
          "/masteros/",
          "/exam/",
          "/practice/",
          "/i/",
          "/e/",
          "/api/",
          "/acceso",
          "/colocacion",
          "/demo",
          "/contacto",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

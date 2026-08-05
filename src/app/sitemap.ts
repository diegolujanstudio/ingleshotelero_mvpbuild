import type { MetadataRoute } from "next";

/**
 * /sitemap.xml — Next 14 serves this from the app router.
 *
 * Only the public, indexable routes belong here. These mirror the `allow`
 * list in robots.ts and the per-route `robots: { index: true }` exports;
 * keeping the three lists in sync is what prevents crawlers from indexing
 * the app shell or any per-tenant surface.
 */
const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.ingleshotelero.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    // /precios is intentionally absent: pricing is published only on the
    // marketing site, and the app's route 308s there (see next.config.mjs).
    {
      url: `${base}/onboarding`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/soporte`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}

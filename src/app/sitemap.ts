import type { MetadataRoute } from "next";

/**
 * /sitemap.xml — Next 14 serves this from the app router.
 *
 * Only the public, indexable routes belong here. These mirror the `allow`
 * list in robots.ts and the per-route `robots: { index: true }` exports;
 * keeping the three lists in sync is what prevents crawlers from indexing
 * the app shell or any per-tenant surface.
 */
const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://ingleshotelero.netlify.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${base}/precios`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
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

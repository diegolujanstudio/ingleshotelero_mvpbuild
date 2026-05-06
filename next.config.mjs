import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable:
    process.env.NODE_ENV === "development" ||
    process.env.DISABLE_PWA === "true",
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  workboxOptions: {
    runtimeCaching: [
      // API routes — never cached. Offline queue lives in page-level JS / IndexedDB.
      {
        urlPattern: /^https?.*\/api\/.*/i,
        handler: "NetworkOnly",
        options: { matchOptions: { ignoreSearch: false } },
      },
      // Auth-dependent areas — never cached.
      {
        urlPattern: /^https?.*\/hr\/.*/i,
        handler: "NetworkOnly",
      },
      {
        urlPattern: /^https?.*\/masteros\/.*/i,
        handler: "NetworkOnly",
      },
      // Next.js static build assets.
      {
        urlPattern: /^https?.*\/_next\/static\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "next-static",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
      // Fonts — long-lived.
      {
        urlPattern: /\.(?:woff2|woff|ttf|otf)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "fonts",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // Pre-generated TTS audio (ElevenLabs / OpenAI).
      {
        urlPattern: /^https?.*\/audio\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "audio-tts",
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
          cacheableResponse: { statuses: [0, 200] },
          rangeRequests: true,
        },
      },
      // Exam — session state must be fresh.
      {
        urlPattern: /^https?.*\/exam\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "exam-pages",
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 2, // 2 hours
          },
        },
      },
      // Practice flow — also network-first.
      {
        urlPattern: /^https?.*\/practice\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "practice-pages",
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 2, // 2 hours
          },
        },
      },
      // Home — short cache.
      {
        urlPattern: ({ url, sameOrigin }) =>
          sameOrigin && url.pathname === "/",
        handler: "NetworkFirst",
        options: {
          cacheName: "home",
          networkTimeoutSeconds: 5,
          expiration: {
            maxEntries: 1,
            maxAgeSeconds: 60 * 60, // 1 hour
          },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Supabase Storage signed URLs — add your project ref here once provisioned.
      // { protocol: "https", hostname: "<your-project>.supabase.co" },
    ],
  },
  experimental: {
    // Server Actions are on by default in 14.x; keep explicit for clarity.
    serverActions: { allowedOrigins: ["localhost:3000"] },
  },
};

export default withPWA(nextConfig);

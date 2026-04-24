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

export default nextConfig;

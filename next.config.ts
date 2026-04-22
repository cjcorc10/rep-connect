import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  /* Maps JS needs a public env var; default to GOOGLE_API_KEY so one key works for Geocoding + Maps. */
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
      process.env.GOOGLE_API_KEY ??
      "",
    /* Required for AdvancedMarkerElement (district number pins). Create in Google Cloud → Map Management. */
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "",
  },
  experimental: {
    viewTransition: true,
  },
  images: {
    /**
     * Same-origin `/api/rep-image?…` is not covered by `remotePatterns` (those
     * only apply to absolute URLs). Next.js requires `localPatterns` when
     * `next/image` optimizes a local src with a query string.
     */
    localPatterns: [
      {
        pathname: "/api/rep-image",
        // Omit `search` so any query params (bioguide_id, fallback, etc.) are allowed.
      },
      {
        pathname: "/images/*.jpg",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.congress.gov",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "*senate.texas.gov",
      },
      {
        protocol: "https",
        hostname: "*house.texas.gov",
      },
      {
        protocol: "https",
        hostname: "*.gov",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Maps JS needs a public env var; default to GOOGLE_API_KEY so one key works for Geocoding + Maps. */
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
      process.env.GOOGLE_API_KEY ??
      "",
  },

  images: {
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

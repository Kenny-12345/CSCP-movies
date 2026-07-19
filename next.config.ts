import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'img.purehd.cc' },
      { protocol: 'https', hostname: 'a.espncdn.com' },
      { protocol: 'http', hostname: 'a.espncdn.com' },
    ],
  },
};

export default nextConfig;

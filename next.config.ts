import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pinned so Turbopack does not walk up and pick a lockfile outside the repo.
  turbopack: { root: import.meta.dirname },
  images: {
    // Album art served by Spotify's CDN, used by the now-playing tile.
    remotePatterns: [{ protocol: "https", hostname: "i.scdn.co" }],
  },
};

export default nextConfig;

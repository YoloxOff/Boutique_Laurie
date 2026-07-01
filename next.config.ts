import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    // Redirections 301 permanentes (SEO). Ajouter ici les anciennes URLs a rediriger
    // une fois le site precedent audite.
    return [];
  },
};

export default nextConfig;

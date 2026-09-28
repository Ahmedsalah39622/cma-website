import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    cpus: 2,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'th.bing.com',
      },
    ],
  },
};

export default nextConfig;

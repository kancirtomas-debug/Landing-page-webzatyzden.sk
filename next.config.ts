import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "srv930691.hstgr.cloud",
        port: "3002",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;

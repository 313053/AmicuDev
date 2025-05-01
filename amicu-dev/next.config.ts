import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'linkedin.com',
      },
      {
        protocol: 'https',
        hostname: 'pinterest.com',
      },
      {
        protocol: 'https',
        hostname: 'x.com',
      },
      {
        protocol: 'https',
        hostname: 'threads.com',
      },
      {
        protocol: 'https',
        hostname: 'youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'substack.com',
      },
      {
        protocol: 'https',
        hostname: 'udemy.com',
      },
    ],
  },
};



export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/test/50-100', destination: '/test/basic', permanent: true },
      { source: '/test/100-150', destination: '/test/advanced', permanent: true },
      { source: '/test/150%2B', destination: '/test/elite', permanent: true }
    ];
  }
};

export default nextConfig;

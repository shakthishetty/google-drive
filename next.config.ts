import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript:{
    ignoreBuildErrors: true,
  },
  eslint:{
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100MB",
    }
  },
   images:{
    remotePatterns:[
      {
        hostname:"*",
        protocol:"https",
      }
    ]
   }
};

export default nextConfig;

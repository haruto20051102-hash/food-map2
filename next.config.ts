import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "skisscyhmkbhtgnwotfj.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

// Add dummy webpack config to force fallback from Turbopack to Webpack
// since Turbopack's Edge runtime has an issue with ReferenceError: __dirname in 16.1.6
nextConfig.webpack = (config) => {
  return config;
};

export default nextConfig;

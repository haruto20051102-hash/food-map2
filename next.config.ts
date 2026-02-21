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
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer, nextRuntime, webpack }) => {
    if (nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@supabase/ssr': require.resolve('@supabase/ssr'),
      };

      // Inject a global __dirname to prevent Webpack's Edge runtime crash
      config.plugins.push(
        new webpack.BannerPlugin({
          banner: 'var __dirname = "/";',
          raw: true,
        })
      );
    }
    return config;
  },
};

export default nextConfig;

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
  webpack: (config, { nextRuntime, webpack }) => {
    if (nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@supabase/ssr': require.resolve('@supabase/ssr'),
      };

      // Polyfill __dirname at the global scope for the Vercel Edge runtime.
      // Next.js internal edge chunks (like ua-parser-js) hardcode `__dirname`, which crashes V8.
      config.plugins.push(
        new webpack.BannerPlugin({
          banner: 'globalThis.__dirname = "/";',
          raw: true,
        })
      );
    }
    return config;
  },
};

export default nextConfig;

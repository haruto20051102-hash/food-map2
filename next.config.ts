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
  webpack: (config, { isServer, nextRuntime }) => {
    if (nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@supabase/ssr': require.resolve('@supabase/ssr'),
      };

      // Prevent Webpack's Edge Native module injection triggered by @opentelemetry
      // by forcefully scrubbing the __dirname string from the code AST before Webpack evaluates it
      config.module.rules.push({
        test: /\.(js|mjs|cjs)$/,
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              search: '__dirname',
              replace: '""',
              flags: 'g',
            },
          },
        ],
      });
    }
    return config;
  },
};

export default nextConfig;

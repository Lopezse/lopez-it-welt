/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    scrollRestoration: true,
    // Optimierungen für Development
    optimizePackageImports: ['@next/font'],
  },
  // Development-Optimierungen
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Schnellere Development-Builds
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.next', '**/coverage'],
      };

      // Weniger aggressive TypeScript-Prüfung im Development
      config.resolve.alias = {
        ...config.resolve.alias,
        typescript: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  typescript: {
    // TypeScript-Fehler blockieren Build nur in Production
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    // ESLint-Fehler blockieren Build nur in Production
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
};

module.exports = nextConfig;

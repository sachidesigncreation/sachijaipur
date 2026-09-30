import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      // Cloudflare R2 public bucket domain
      { protocol: 'https', hostname: '*.r2.dev' },
      // Custom CDN — set NEXT_PUBLIC_R2_CDN_URL to your CDN hostname
      ...(process.env.NEXT_PUBLIC_R2_CDN_URL
        ? [
            {
              protocol: 'https' as const,
              hostname: new URL(process.env.NEXT_PUBLIC_R2_CDN_URL).hostname,
            },
          ]
        : []),
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  // Static export only in production builds; dev runs as a normal Next.js server
  // so the Sanity Studio's deep links (which use dynamic ;<id>,path=… segments)
  // don't have to be enumerated in generateStaticParams.
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  basePath: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
};

export default nextConfig;

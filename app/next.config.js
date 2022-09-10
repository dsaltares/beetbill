const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['page.ts', 'page.tsx', 'next.tsx', 'route.ts'],
  eslint: {
    dirs: ['src'],
  },
};

module.exports = withBundleAnalyzer(nextConfig);

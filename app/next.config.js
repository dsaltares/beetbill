/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['page.ts', 'page.tsx', 'next.tsx', 'route.ts'],
  eslint: ['pages', 'components', 'lib', 'server', 'tests-integration'],
};

module.exports = nextConfig;

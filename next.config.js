/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // This allows the Vercel build to pass even with ESLint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // This allows the Vercel build to pass even with ESLint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

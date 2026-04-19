/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true, // We added this in a later step
  },
  eslint: {
    // This tells Vercel to skip ESLint errors and deploy anyway
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

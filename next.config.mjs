/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Preserve public folder and /images paths
  images: {
    unoptimized: false,
  },
  // Keep existing @ alias
  transpilePackages: [],
};

export default nextConfig;

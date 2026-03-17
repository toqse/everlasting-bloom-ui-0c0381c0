/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Build to /out for cPanel/static hosting
  output: "export",
  // Nice static paths like /about/ → /about/index.html
  trailingSlash: true,
  images: {
    // Required for static export unless you add a custom image loader
    unoptimized: true,
  },
  transpilePackages: [],
};

export default nextConfig;

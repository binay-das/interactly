/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/validation", "@repo/ui", "@repo/types", "@repo/auth"],
};

export default nextConfig;

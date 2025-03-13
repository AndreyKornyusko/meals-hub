import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Вимикає ESLint під час збірки
  },
};

export default nextConfig;

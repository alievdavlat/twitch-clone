import { config } from 'process';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack:(config) => {
    config.module.rules.push({
      test:/\.mjs$/,
      include: /node_modules/,
      type:'javascript/auto'
    })
    return config
  },
  images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "img.clerk.com",
    },
    {
      protocol: "https",
      hostname: "utfs.io",
    },
  ],
  }
};

export default nextConfig;

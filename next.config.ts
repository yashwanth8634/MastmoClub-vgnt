import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // ✅ Allow UploadThing images
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // Allow placeholders
      }
    ],
  },
};

export default nextConfig;

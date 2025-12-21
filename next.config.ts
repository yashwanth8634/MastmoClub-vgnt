/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // ✅ Allow UploadThing
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // (Optional) If you use Clerk for Auth
      },
    ],
    // ✅ FORCE SPEED: Compresses images even more for mobile users
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'], 
  },
};

export default nextConfig;
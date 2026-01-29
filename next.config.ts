/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

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

  async redirects() {
    return [
      {
        source: '/instagram',
        destination: 'https://www.instagram.com/mastmo_vgnt', // Your actual Insta URL
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
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
    minimumCacheTTL: 604800,
    formats: ['image/avif', 'image/webp'], 
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [48, 64, 96, 128, 256, 384, 520],
  },
  async redirects() {
    return [
      {
        source: '/instagram',
        destination: 'https://www.instagram.com/mastmo_vgnt',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Security headers applied to every route
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // RFC 8288 Link headers for AI agent discovery — homepage only
        source: '/',
        headers: [
          {
            key: 'Link',
            value: [
              '</.well-known/api-catalog>; rel="api-catalog"',
              '</api/health>; rel="status"',
              '</.well-known/agent-skills/index.json>; rel="service-desc"',
            ].join(', '),
          },
        ],
      },
    ];
  },
};
export default nextConfig;

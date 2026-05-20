/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  

  trailingSlash: false,
  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },

  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  images: {
    domains: [
      'localhost',
      'via.placeholder.com',
      'caterly-uploads-unique-id.s3.ap-southeast-2.amazonaws.com',
      'stdreux.com.au',
      'api.stdreux.com.au',
      'stdreux-api-production.up.railway.app',
    ],
    remotePatterns: [
      { protocol: 'https', hostname: '*.s3.ap-southeast-2.amazonaws.com' },
      { protocol: 'https', hostname: '*.s3.amazonaws.com' },
      {
        protocol: 'https',
        hostname: 'caterly-uploads-unique-id.s3.ap-southeast-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'stdreux.com.au',
      },
      {
        protocol: 'https',
        hostname: 'api.stdreux.com.au',
      },
      {
        protocol: 'https',
        hostname: 'stdreux-api-production.up.railway.app',
      },
    ],
  },

  // Prevent Engintron/Nginx from caching dynamic pages
  async headers() {
    return [
      {
        source: '/shop/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      {
        source: '/shop',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ];
  },

  // Proxy /uploads/* to the API so image URLs like stdreux.com.au/uploads/... work
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stdreux-api-production.up.railway.app';
    return [
      {
        source: '/uploads/:path*',
        destination: `${apiUrl}/uploads/:path*`,
      },
    ];
  },
}

module.exports = nextConfig

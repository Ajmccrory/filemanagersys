import type { NextConfig } from 'next'

const config: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        // Customize Turbopack behavior if needed
      }
    }
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [], // Add any image domains you need
  },
  // Ensure we can make API calls to our Flask backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ]
  },
}

export default config
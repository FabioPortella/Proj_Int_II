/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5268/api/:path*',
      },
    ]
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
}

export default nextConfig

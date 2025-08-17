import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	devIndicators: false,
	eslint: {
		ignoreDuringBuilds: true,
	},

	// experimental: {
	// 	nodeMiddleware: true,
	// },
}

export default nextConfig

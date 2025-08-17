import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	devIndicators: false,
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		esmExternals: true,
	},
	typescript: {
		ignoreBuildErrors: false,
	},
}

export default nextConfig

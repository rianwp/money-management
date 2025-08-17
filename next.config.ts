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

	reactStrictMode: true,
}

export default nextConfig

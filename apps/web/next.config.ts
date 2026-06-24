import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	env: {
		NEXT_PUBLIC_API_URL:
			process.env.NEXT_PUBLIC_API_URL ||
			'https://api-production-f74dc.up.railway.app',
	},
}

export default nextConfig

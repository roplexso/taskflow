import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { db } from './db'

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
	},
	trustedOrigins: [
		'http://localhost:3000',
		process.env['BETTER_AUTH_TRUSTED_ORIGIN'] ?? '',
	].filter(Boolean),
})

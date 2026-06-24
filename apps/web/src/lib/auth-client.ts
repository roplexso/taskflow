import { createAuthClient } from 'better-auth/react'

const API_URL =
	process.env.NEXT_PUBLIC_API_URL ||
	'https://api-production-f74dc.up.railway.app'

export const authClient = createAuthClient({
	baseURL: API_URL,
})

export const { signIn, signUp, signOut, useSession } = authClient

import { Redis } from '@upstash/redis'

export const redis = new Redis({
	url: process.env['UPSTASH_REDIS_REST_URL']!,
	token: process.env['UPSTASH_REDIS_REST_TOKEN']!,
})

// Cache TTL in seconds
export const CACHE_TTL = 60 // 1 minute

// Cache key helpers — keeps key format consistent
export const cacheKeys = {
	tasks: (userId: string) => `tasks:${userId}`,
	profile: (userId: string) => `profile:${userId}`,
}

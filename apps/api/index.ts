import { auth } from './src/lib/auth'
import { tasksRouter } from './src/routes/tasks'
import { db } from './src/lib/db'

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': 'http://localhost:3000',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	'Access-Control-Allow-Credentials': 'true',
}

async function checkDeadlines() {
	const now = new Date()
	const overdueTasks = await db.task.findMany({
		where: { status: 'TODO', deadline: { lt: now } },
	})

	if (overdueTasks.length > 0) {
		await db.task.updateMany({
			where: { status: 'TODO', deadline: { lt: now } },
			data: { status: 'FAILED' },
		})
		console.log(
			`[deadline-checker] Marked ${overdueTasks.length} task(s) as FAILED`,
		)
	}
}

async function updateStreaks() {
	const now = new Date()
	const hours = now.getHours()
	const minutes = now.getMinutes()
	if (hours !== 0 || minutes > 1) return

	console.log('[streak-checker] Running daily streak update...')

	const yesterday = new Date(now)
	yesterday.setDate(yesterday.getDate() - 1)
	yesterday.setHours(0, 0, 0, 0)

	const endOfYesterday = new Date(yesterday)
	endOfYesterday.setHours(23, 59, 59, 999)

	const users = await db.user.findMany()

	for (const user of users) {
		const tasksDueYesterday = await db.task.findMany({
			where: {
				userId: user.id,
				deadline: {
					gte: yesterday,
					lte: endOfYesterday,
				},
			},
		})

		if (tasksDueYesterday.length === 0) continue

		const allCompleted = tasksDueYesterday.every(
			(t: { status: string }) => t.status === 'COMPLETED',
		)

		if (allCompleted) {
			const lastStreak = user.lastStreakDate
			const isConsecutive = lastStreak
				? new Date(lastStreak).toDateString() === yesterday.toDateString()
				: false

			await db.user.update({
				where: { id: user.id },
				data: {
					streak: isConsecutive ? user.streak + 1 : 1,
					lastStreakDate: yesterday,
				},
			})

			console.log(
				`[streak-checker] User ${user.email} streak: ${isConsecutive ? user.streak + 1 : 1}`,
			)
		} else {
			await db.user.update({
				where: { id: user.id },
				data: { streak: 0, lastStreakDate: null },
			})
			console.log(`[streak-checker] User ${user.email} streak reset to 0`)
		}
	}
}

checkDeadlines()
setInterval(checkDeadlines, 60 * 1000)
setInterval(updateStreaks, 60 * 1000)

const server = Bun.serve({
	port: 3001,
	async fetch(request) {
		const url = new URL(request.url)

		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: CORS_HEADERS })
		}

		let response: Response

		if (url.pathname.startsWith('/api/auth')) {
			response = await auth.handler(request)
		} else if (url.pathname.startsWith('/api/tasks')) {
			response = await tasksRouter(request)
		} else if (url.pathname === '/api/me') {
			const session = await auth.api.getSession({ headers: request.headers })
			if (!session) {
				response = Response.json({ error: 'Unauthorized' }, { status: 401 })
			} else {
				const user = await db.user.findUnique({
					where: { id: session.user.id },
					select: {
						id: true,
						name: true,
						email: true,
						streak: true,
						lastStreakDate: true,
					},
				})
				response = Response.json(user)
			}
		} else {
			response = new Response('API is running', { status: 200 })
		}

		const newResponse = new Response(response.body, response)
		Object.entries(CORS_HEADERS).forEach(([key, value]) => {
			newResponse.headers.set(key, value)
		})
		return newResponse
	},
})

console.log(`API running on http://localhost:${server.port}`)

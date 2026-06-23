import { db } from '../lib/db'
import { auth } from '../lib/auth'

export async function tasksRouter(request: Request): Promise<Response> {
	const session = await auth.api.getSession({ headers: request.headers })

	if (!session) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const userId = session.user.id
	const url = new URL(request.url)
	const method = request.method

	// GET /api/tasks
	if (method === 'GET') {
		const tasks = await db.task.findMany({
			where: { userId },
			orderBy: [{ status: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }],
		})
		return Response.json(tasks)
	}

	// POST /api/tasks
	if (method === 'POST') {
		const body = (await request.json()) as {
			title: string
			description?: string
			priority?: 'LOW' | 'MEDIUM' | 'HIGH'
			deadline?: string
		}

		if (!body.title?.trim()) {
			return Response.json({ error: 'Title is required' }, { status: 400 })
		}

		const task = await db.task.create({
			data: {
				userId,
				title: body.title.trim(),
				description: body.description?.trim(),
				priority: body.priority ?? 'MEDIUM',
				deadline: body.deadline ? new Date(body.deadline) : null,
			},
		})

		return Response.json(task, { status: 201 })
	}

	// PATCH /api/tasks/:id
	if (method === 'PATCH') {
		const id = url.pathname.split('/').pop()
		if (!id)
			return Response.json({ error: 'Task ID required' }, { status: 400 })

		const body = (await request.json()) as {
			title?: string
			description?: string
			priority?: 'LOW' | 'MEDIUM' | 'HIGH'
			status?: 'TODO' | 'COMPLETED' | 'FAILED'
			deadline?: string | null
		}

		// Verify task belongs to user
		const existing = await db.task.findFirst({ where: { id, userId } })
		if (!existing) {
			return Response.json({ error: 'Task not found' }, { status: 404 })
		}

		const task = await db.task.update({
			where: { id },
			data: {
				...body,
				deadline: body.deadline
					? new Date(body.deadline)
					: body.deadline === null
						? null
						: undefined,
				completedAt: body.status === 'COMPLETED' ? new Date() : undefined,
			},
		})

		return Response.json(task)
	}

	// DELETE /api/tasks/:id
	if (method === 'DELETE') {
		const id = url.pathname.split('/').pop()
		if (!id)
			return Response.json({ error: 'Task ID required' }, { status: 400 })

		const existing = await db.task.findFirst({ where: { id, userId } })
		if (!existing) {
			return Response.json({ error: 'Task not found' }, { status: 404 })
		}

		await db.task.delete({ where: { id } })
		return Response.json({ success: true })
	}

	return Response.json({ error: 'Method not allowed' }, { status: 405 })
}

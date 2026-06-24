const API_URL =
	process.env.NEXT_PUBLIC_API_URL ||
	'https://api-production-f74dc.up.railway.app'

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, {
		...options,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...options?.headers,
		},
	})

	if (!response.ok) {
		const error = await response
			.json()
			.catch(() => ({ error: 'Unknown error' }))
		throw new Error(error.error ?? 'Request failed')
	}

	return response.json()
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
export type TaskStatus = 'TODO' | 'COMPLETED' | 'FAILED'

export type Task = {
	id: string
	userId: string
	title: string
	description: string | null
	priority: Priority
	status: TaskStatus
	deadline: string | null
	completedAt: string | null
	createdAt: string
	updatedAt: string
}

export type CreateTaskInput = {
	title: string
	description?: string
	priority?: Priority
	deadline?: string
}

export type UpdateTaskInput = Partial<CreateTaskInput> & {
	status?: TaskStatus
}

export type UserProfile = {
	id: string
	name: string
	email: string
	streak: number
	lastStreakDate: string | null
}

export const tasksApi = {
	getAll: () => fetchApi<Task[]>('/api/tasks'),

	create: (data: CreateTaskInput) =>
		fetchApi<Task>('/api/tasks', {
			method: 'POST',
			body: JSON.stringify(data),
		}),

	update: (id: string, data: UpdateTaskInput) =>
		fetchApi<Task>(`/api/tasks/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(data),
		}),

	delete: (id: string) =>
		fetchApi<{ success: boolean }>(`/api/tasks/${id}`, {
			method: 'DELETE',
		}),
}

export const userApi = {
	getMe: () => fetchApi<UserProfile>('/api/me'),
}

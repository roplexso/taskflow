'use client'

import { useAppSelector } from '@/store/hooks'
import { useTasks } from '@/hooks/use-tasks'
import { TaskCard } from './task-card'
import { Task } from '@/lib/api'

function sortTasks(tasks: Task[], sortBy: string): Task[] {
	return [...tasks].sort((a, b) => {
		if (sortBy === 'priority') {
			const order = { HIGH: 0, MEDIUM: 1, LOW: 2 }
			return order[a.priority] - order[b.priority]
		}
		if (sortBy === 'deadline') {
			if (!a.deadline) return 1
			if (!b.deadline) return -1
			return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
		}
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	})
}

export function TaskList() {
	const { filter, sortBy } = useAppSelector((s) => s.ui)
	const { data: tasks, isLoading, error } = useTasks()

	if (isLoading) {
		return (
			<div
				style={{
					padding: '48px',
					textAlign: 'center',
					color: 'var(--text-tertiary)',
				}}
			>
				Loading tasks...
			</div>
		)
	}

	if (error) {
		return (
			<div
				style={{ padding: '48px', textAlign: 'center', color: 'var(--danger)' }}
			>
				{error.message}
			</div>
		)
	}

	const filtered =
		tasks?.filter((t) => filter === 'ALL' || t.status === filter) ?? []
	const sorted = sortTasks(filtered, sortBy)

	if (sorted.length === 0) {
		return (
			<div style={{ padding: '48px', textAlign: 'center' }}>
				<p style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>
					{filter === 'ALL'
						? 'No tasks yet. Create one to get started.'
						: `No ${filter.toLowerCase()} tasks.`}
				</p>
			</div>
		)
	}

	return (
		<div>
			{sorted.map((task) => (
				<TaskCard key={task.id} task={task} />
			))}
		</div>
	)
}

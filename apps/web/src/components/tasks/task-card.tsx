'use client'

import { Task } from '@/lib/api'
import { useAppDispatch } from '@/store/hooks'
import { selectTask } from '@/store/task-slice'
import { useUpdateTask, useDeleteTask } from '@/hooks/use-tasks'

const PRIORITY_COLORS = {
	HIGH: 'var(--priority-high)',
	MEDIUM: 'var(--priority-medium)',
	LOW: 'var(--priority-low)',
}

function formatDeadline(deadline: string | null): string {
	if (!deadline) return ''
	const date = new Date(deadline)
	const now = new Date()
	const diff = date.getTime() - now.getTime()
	const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

	if (days < 0) return `${Math.abs(days)}d overdue`
	if (days === 0) return 'Due today'
	if (days === 1) return 'Due tomorrow'
	return `${days}d left`
}

function isOverdue(deadline: string | null, status: string): boolean {
	if (!deadline || status !== 'TODO') return false
	return new Date(deadline) < new Date()
}

export function TaskCard({ task }: { task: Task }) {
	const dispatch = useAppDispatch()
	const updateTask = useUpdateTask()
	const deleteTask = useDeleteTask()

	const overdue = isOverdue(task.deadline, task.status)

	function handleComplete() {
		updateTask.mutate({
			id: task.id,
			data: { status: task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED' },
		})
	}

	function handleDelete() {
		deleteTask.mutate(task.id)
	}

	return (
		<div
			onClick={() => dispatch(selectTask(task.id))}
			style={{
				backgroundColor: 'var(--bg-secondary)',
				border: '1px solid var(--border)',
				borderLeft: `3px solid ${PRIORITY_COLORS[task.priority]}`,
				borderRadius: '4px',
				padding: '16px',
				marginBottom: '8px',
				cursor: 'pointer',
				opacity: task.status === 'COMPLETED' ? 0.6 : 1,
				transition: 'border-color 0.15s',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
				{/* Checkbox */}
				<button
					onClick={(e) => {
						e.stopPropagation()
						handleComplete()
					}}
					style={{
						width: '18px',
						height: '18px',
						borderRadius: '3px',
						border: `1.5px solid ${task.status === 'COMPLETED' ? 'var(--accent)' : 'var(--border)'}`,
						backgroundColor:
							task.status === 'COMPLETED' ? 'var(--accent)' : 'transparent',
						cursor: 'pointer',
						flexShrink: 0,
						marginTop: '2px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#000',
						fontSize: '11px',
						fontWeight: 700,
					}}
				>
					{task.status === 'COMPLETED' ? '✓' : ''}
				</button>

				{/* Content */}
				<div style={{ flex: 1, minWidth: 0 }}>
					<p
						style={{
							fontSize: '14px',
							fontWeight: 500,
							color: 'var(--text-primary)',
							textDecoration:
								task.status === 'COMPLETED' ? 'line-through' : 'none',
							marginBottom: '6px',
						}}
					>
						{task.title}
					</p>

					{task.description && (
						<p
							style={{
								fontSize: '12px',
								color: 'var(--text-secondary)',
								marginBottom: '8px',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{task.description}
						</p>
					)}

					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						{/* Priority badge */}
						<span
							style={{
								fontSize: '10px',
								fontWeight: 600,
								color: PRIORITY_COLORS[task.priority],
								letterSpacing: '0.08em',
							}}
						>
							{task.priority}
						</span>

						{/* Status badge */}
						{task.status === 'FAILED' && (
							<span
								style={{
									fontSize: '10px',
									fontWeight: 600,
									color: 'var(--status-failed)',
									letterSpacing: '0.08em',
								}}
							>
								FAILED
							</span>
						)}

						{/* Deadline */}
						{task.deadline && (
							<span
								style={{
									fontSize: '11px',
									color: overdue ? 'var(--danger)' : 'var(--text-tertiary)',
									fontFamily: 'var(--font-geist-mono)',
								}}
							>
								{formatDeadline(task.deadline)}
							</span>
						)}
					</div>
				</div>

				{/* Delete */}
				<button
					onClick={(e) => {
						e.stopPropagation()
						handleDelete()
					}}
					style={{
						backgroundColor: 'transparent',
						border: 'none',
						color: 'var(--text-tertiary)',
						cursor: 'pointer',
						fontSize: '16px',
						padding: '0 4px',
						flexShrink: 0,
					}}
				>
					×
				</button>
			</div>
		</div>
	)
}

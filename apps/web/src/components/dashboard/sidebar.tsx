'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setFilter, toggleTheme, openCreateModal } from '@/store/ui-slice'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useTasks } from '@/hooks/use-tasks'

export function Sidebar() {
	const dispatch = useAppDispatch()
	const { filter, theme, isSidebarOpen } = useAppSelector((s) => s.ui)
	const { data: tasks } = useTasks()
	const router = useRouter()

	const counts = {
		ALL: tasks?.length ?? 0,
		TODO: tasks?.filter((t) => t.status === 'TODO').length ?? 0,
		COMPLETED: tasks?.filter((t) => t.status === 'COMPLETED').length ?? 0,
		FAILED: tasks?.filter((t) => t.status === 'FAILED').length ?? 0,
	}

	const filters = [
		{ key: 'ALL', label: 'All Tasks', color: 'var(--text-secondary)' },
		{ key: 'TODO', label: 'Active', color: 'var(--status-todo)' },
		{ key: 'COMPLETED', label: 'Completed', color: 'var(--status-completed)' },
		{ key: 'FAILED', label: 'Failed', color: 'var(--status-failed)' },
	] as const

	if (!isSidebarOpen) return null

	return (
		<aside
			style={{
				width: '240px',
				minHeight: '100vh',
				backgroundColor: 'var(--bg-secondary)',
				borderRight: '1px solid var(--border)',
				display: 'flex',
				flexDirection: 'column',
				padding: '24px 0',
				flexShrink: 0,
			}}
		>
			{/* Logo */}
			<div style={{ padding: '0 24px 32px' }}>
				<span
					style={{
						fontSize: '18px',
						fontWeight: 700,
						color: 'var(--accent)',
						letterSpacing: '-0.5px',
					}}
				>
					TASKFLOW
				</span>
			</div>

			{/* New Task Button */}
			<div style={{ padding: '0 16px 24px' }}>
				<button
					onClick={() => dispatch(openCreateModal())}
					style={{
						width: '100%',
						padding: '10px',
						backgroundColor: 'var(--accent)',
						color: '#000',
						border: 'none',
						borderRadius: '4px',
						fontSize: '13px',
						fontWeight: 600,
						cursor: 'pointer',
						letterSpacing: '0.05em',
					}}
				>
					+ NEW TASK
				</button>
			</div>

			{/* Filters */}
			<div style={{ padding: '0 8px', flex: 1 }}>
				<p
					style={{
						fontSize: '10px',
						fontWeight: 600,
						color: 'var(--text-tertiary)',
						letterSpacing: '0.1em',
						padding: '0 12px 8px',
					}}
				>
					VIEWS
				</p>
				{filters.map(({ key, label, color }) => (
					<button
						key={key}
						onClick={() => dispatch(setFilter(key))}
						style={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: '8px 12px',
							backgroundColor:
								filter === key ? 'var(--bg-elevated)' : 'transparent',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							borderLeft:
								filter === key ? `2px solid ${color}` : '2px solid transparent',
							marginBottom: '2px',
						}}
					>
						<span
							style={{
								fontSize: '13px',
								color:
									filter === key
										? 'var(--text-primary)'
										: 'var(--text-secondary)',
								fontWeight: filter === key ? 500 : 400,
							}}
						>
							{label}
						</span>
						<span
							style={{
								fontSize: '11px',
								color: 'var(--text-tertiary)',
								backgroundColor: 'var(--bg-tertiary)',
								padding: '2px 6px',
								borderRadius: '2px',
								fontFamily: 'var(--font-geist-mono)',
							}}
						>
							{counts[key]}
						</span>
					</button>
				))}
			</div>

			{/* Bottom actions */}
			<div style={{ padding: '16px' }}>
				<button
					onClick={() => dispatch(toggleTheme())}
					style={{
						width: '100%',
						padding: '8px 12px',
						backgroundColor: 'transparent',
						border: '1px solid var(--border)',
						borderRadius: '4px',
						color: 'var(--text-secondary)',
						fontSize: '12px',
						cursor: 'pointer',
						marginBottom: '8px',
					}}
				>
					{theme === 'dark' ? '☀ Light Mode' : '◑ Dark Mode'}
				</button>
				<button
					onClick={() => signOut().then(() => router.push('/login'))}
					style={{
						width: '100%',
						padding: '8px 12px',
						backgroundColor: 'transparent',
						border: '1px solid var(--border)',
						borderRadius: '4px',
						color: 'var(--danger)',
						fontSize: '12px',
						cursor: 'pointer',
					}}
				>
					Sign Out
				</button>
			</div>
		</aside>
	)
}

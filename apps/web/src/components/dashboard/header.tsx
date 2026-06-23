'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setSortBy, toggleSidebar, openCreateModal } from '@/store/ui-slice'
import { useSession } from '@/lib/auth-client'
import { useTasks, useProfile } from '@/hooks/use-tasks'

export function Header() {
	const dispatch = useAppDispatch()
	const { sortBy, filter } = useAppSelector((s) => s.ui)
	const { data: session } = useSession()
	const { data: tasks } = useTasks()
	const { data: profile } = useProfile()

	const streak = profile?.streak ?? 0
	const completedCount =
		tasks?.filter((t) => t.status === 'COMPLETED').length ?? 0
	const totalCount = tasks?.length ?? 0

	return (
		<header
			style={{
				height: '56px',
				borderBottom: '1px solid var(--border)',
				display: 'flex',
				alignItems: 'center',
				padding: '0 24px',
				gap: '16px',
				backgroundColor: 'var(--bg-primary)',
				flexShrink: 0,
			}}
		>
			<button
				onClick={() => dispatch(toggleSidebar())}
				style={{
					backgroundColor: 'transparent',
					border: 'none',
					color: 'var(--text-secondary)',
					cursor: 'pointer',
					fontSize: '18px',
					padding: '4px',
				}}
			>
				☰
			</button>

			<h1
				style={{
					fontSize: '14px',
					fontWeight: 600,
					color: 'var(--text-primary)',
					letterSpacing: '0.05em',
					flex: 1,
				}}
			>
				{filter === 'ALL' ? 'ALL TASKS' : filter}
			</h1>

			{streak > 0 && (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '6px',
						padding: '4px 10px',
						backgroundColor: 'var(--accent-glow)',
						border: '1px solid var(--accent-dim)',
						borderRadius: '4px',
					}}
				>
					<span style={{ fontSize: '12px' }}>🔥</span>
					<span
						style={{
							fontSize: '11px',
							fontWeight: 600,
							color: 'var(--accent)',
							fontFamily: 'var(--font-geist-mono)',
						}}
					>
						{streak} day{streak !== 1 ? 's' : ''}
					</span>
				</div>
			)}

			<div
				style={{
					fontSize: '11px',
					color: 'var(--text-tertiary)',
					fontFamily: 'var(--font-geist-mono)',
				}}
			>
				{completedCount}/{totalCount} done
			</div>

			<select
				value={sortBy}
				onChange={(e) =>
					dispatch(
						setSortBy(e.target.value as 'priority' | 'deadline' | 'createdAt'),
					)
				}
				style={{
					backgroundColor: 'var(--bg-tertiary)',
					border: '1px solid var(--border)',
					borderRadius: '4px',
					color: 'var(--text-secondary)',
					fontSize: '12px',
					padding: '4px 8px',
					cursor: 'pointer',
				}}
			>
				<option value='priority'>Sort: Priority</option>
				<option value='deadline'>Sort: Deadline</option>
				<option value='createdAt'>Sort: Created</option>
			</select>

			<button
				onClick={() => dispatch(openCreateModal())}
				style={{
					padding: '6px 14px',
					backgroundColor: 'var(--accent)',
					border: 'none',
					borderRadius: '4px',
					color: '#000',
					fontSize: '12px',
					fontWeight: 600,
					cursor: 'pointer',
					letterSpacing: '0.05em',
				}}
			>
				+ NEW
			</button>

			<div
				style={{
					width: '28px',
					height: '28px',
					borderRadius: '50%',
					backgroundColor: 'var(--accent-dim)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '11px',
					fontWeight: 700,
					color: 'var(--accent)',
				}}
			>
				{session?.user.name?.[0]?.toUpperCase() ?? 'U'}
			</div>
		</header>
	)
}

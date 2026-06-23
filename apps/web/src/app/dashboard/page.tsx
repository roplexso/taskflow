'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { TaskList } from '@/components/tasks/task-list'
import { CreateTaskModal } from '@/components/tasks/create-task-modal'

export default function DashboardPage() {
	const { data: session, isPending } = useSession()
	const router = useRouter()

	useEffect(() => {
		if (!isPending && !session) {
			router.push('/login')
		}
	}, [session, isPending, router])

	if (isPending) {
		return (
			<div
				style={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'var(--bg-primary)',
					color: 'var(--text-tertiary)',
					fontSize: '13px',
					letterSpacing: '0.1em',
				}}
			>
				LOADING...
			</div>
		)
	}

	if (!session) return null

	return (
		<div
			style={{
				display: 'flex',
				minHeight: '100vh',
				backgroundColor: 'var(--bg-primary)',
			}}
		>
			<Sidebar />

			<div
				style={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					minWidth: 0,
				}}
			>
				<Header />

				<main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
					<TaskList />
				</main>
			</div>

			<CreateTaskModal />
		</div>
	)
}

'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { closeCreateModal } from '@/store/ui-slice'
import { useCreateTask } from '@/hooks/use-tasks'

export function CreateTaskModal() {
	const dispatch = useAppDispatch()
	const isOpen = useAppSelector((s) => s.ui.isCreateModalOpen)
	const createTask = useCreateTask()

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')
	const [deadline, setDeadline] = useState('')

	if (!isOpen) return null

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!title.trim()) return

		createTask.mutate(
			{
				title: title.trim(),
				description: description.trim() || undefined,
				priority,
				deadline: deadline ? new Date(deadline).toISOString() : undefined,
			},
			{
				onSuccess: () => {
					setTitle('')
					setDescription('')
					setPriority('MEDIUM')
					setDeadline('')
					dispatch(closeCreateModal())
				},
			},
		)
	}

	const inputStyle = {
		width: '100%',
		padding: '10px 12px',
		backgroundColor: 'var(--bg-tertiary)',
		border: '1px solid var(--border)',
		borderRadius: '4px',
		color: 'var(--text-primary)',
		fontSize: '14px',
		outline: 'none',
	}

	const labelStyle = {
		display: 'block',
		fontSize: '11px',
		fontWeight: 600,
		color: 'var(--text-tertiary)',
		letterSpacing: '0.08em',
		marginBottom: '6px',
	}

	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				backgroundColor: 'rgba(0,0,0,0.7)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 50,
			}}
			onClick={() => dispatch(closeCreateModal())}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					backgroundColor: 'var(--bg-secondary)',
					border: '1px solid var(--border)',
					borderRadius: '4px',
					padding: '32px',
					width: '480px',
					maxWidth: '90vw',
				}}
			>
				<h2
					style={{
						fontSize: '16px',
						fontWeight: 600,
						color: 'var(--text-primary)',
						marginBottom: '24px',
						letterSpacing: '-0.3px',
					}}
				>
					NEW TASK
				</h2>

				<form onSubmit={handleSubmit}>
					<div style={{ marginBottom: '16px' }}>
						<label style={labelStyle}>TITLE</label>
						<input
							autoFocus
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder='Task title...'
							style={inputStyle}
							required
						/>
					</div>

					<div style={{ marginBottom: '16px' }}>
						<label style={labelStyle}>DESCRIPTION</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder='Optional description...'
							rows={3}
							style={{ ...inputStyle, resize: 'none' }}
						/>
					</div>

					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: '16px',
							marginBottom: '24px',
						}}
					>
						<div>
							<label style={labelStyle}>PRIORITY</label>
							<select
								value={priority}
								onChange={(e) =>
									setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')
								}
								style={inputStyle}
							>
								<option value='LOW'>Low</option>
								<option value='MEDIUM'>Medium</option>
								<option value='HIGH'>High</option>
							</select>
						</div>

						<div>
							<label style={labelStyle}>DEADLINE</label>
							<input
								type='datetime-local'
								value={deadline}
								onChange={(e) => setDeadline(e.target.value)}
								style={inputStyle}
							/>
						</div>
					</div>

					<div
						style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}
					>
						<button
							type='button'
							onClick={() => dispatch(closeCreateModal())}
							style={{
								padding: '10px 20px',
								backgroundColor: 'transparent',
								border: '1px solid var(--border)',
								borderRadius: '4px',
								color: 'var(--text-secondary)',
								fontSize: '13px',
								cursor: 'pointer',
							}}
						>
							Cancel
						</button>
						<button
							type='submit'
							disabled={createTask.isPending}
							style={{
								padding: '10px 20px',
								backgroundColor: 'var(--accent)',
								border: 'none',
								borderRadius: '4px',
								color: '#000',
								fontSize: '13px',
								fontWeight: 600,
								cursor: 'pointer',
								opacity: createTask.isPending ? 0.7 : 1,
							}}
						>
							{createTask.isPending ? 'CREATING...' : 'CREATE TASK'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

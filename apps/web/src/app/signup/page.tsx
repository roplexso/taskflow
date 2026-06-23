'use client'

import { useState } from 'react'
import { signUp } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [error, setError] = useState('')

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')

		const { error } = await signUp.email({
			email,
			password,
			name,
		})

		if (error) {
			setError(error.message ?? 'Something went wrong')
			return
		}

		router.push('/dashboard')
	}

	return (
		<div className='min-h-screen flex items-center justify-center'>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4 w-80'>
				<h1 className='text-2xl font-bold'>Sign Up</h1>
				{error && <p className='text-red-500 text-sm'>{error}</p>}
				<input
					type='text'
					placeholder='Name'
					value={name}
					onChange={(e) => setName(e.target.value)}
					className='border p-2 rounded'
					required
				/>
				<input
					type='email'
					placeholder='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className='border p-2 rounded'
					required
				/>
				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className='border p-2 rounded'
					required
				/>
				<button type='submit' className='bg-black text-white p-2 rounded'>
					Sign Up
				</button>
				<a href='/login' className='text-sm text-center text-blue-500'>
					Already have an account? Login
				</a>
			</form>
		</div>
	)
}

'use client'

import { useState } from 'react'
import { signIn } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')

		const { error } = await signIn.email({
			email,
			password,
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
				<h1 className='text-2xl font-bold'>Login</h1>
				{error && <p className='text-red-500 text-sm'>{error}</p>}
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
					Login
				</button>
				<a href='/signup' className='text-sm text-center text-blue-500'>
					Don't have an account? Sign up
				</a>
			</form>
		</div>
	)
}

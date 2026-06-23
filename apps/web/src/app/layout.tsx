import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/lib/query-client'
import { ReduxProvider } from '@/store/provider'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'TaskFlow',
	description: 'High performance task management',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en' data-theme='dark'>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<script
					dangerouslySetInnerHTML={{
						__html: `document.documentElement.setAttribute('data-theme','dark')`,
					}}
				/>
				<ReduxProvider>
					<QueryProvider>{children}</QueryProvider>
				</ReduxProvider>
			</body>
		</html>
	)
}

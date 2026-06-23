export type User = {
	id: string
	email: string
	name: string | null
	createdAt: Date
}
export type ApiResponse<T> =
	| { success: true; data: T }
	| { success: false; error: string }

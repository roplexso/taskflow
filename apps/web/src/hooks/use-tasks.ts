import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tasksApi, userApi, CreateTaskInput, UpdateTaskInput } from '@/lib/api'

export const TASKS_KEY = ['tasks'] as const
export const PROFILE_KEY = ['profile'] as const

export function useTasks() {
	return useQuery({
		queryKey: TASKS_KEY,
		queryFn: tasksApi.getAll,
	})
}

export function useProfile() {
	return useQuery({
		queryKey: PROFILE_KEY,
		queryFn: userApi.getMe,
	})
}

export function useCreateTask() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateTaskInput) => tasksApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_KEY })
		},
	})
}

export function useUpdateTask() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
			tasksApi.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_KEY })
		},
	})
}

export function useDeleteTask() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => tasksApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_KEY })
		},
	})
}

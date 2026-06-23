import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TaskState {
	selectedTaskId: string | null
	editingTaskId: string | null
}

const initialState: TaskState = {
	selectedTaskId: null,
	editingTaskId: null,
}

const taskSlice = createSlice({
	name: 'task',
	initialState,
	reducers: {
		selectTask(state, action: PayloadAction<string | null>) {
			state.selectedTaskId = action.payload
		},
		setEditingTask(state, action: PayloadAction<string | null>) {
			state.editingTaskId = action.payload
		},
	},
})

export const { selectTask, setEditingTask } = taskSlice.actions
export const taskReducer = taskSlice.reducer

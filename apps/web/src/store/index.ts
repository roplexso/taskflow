import { configureStore } from '@reduxjs/toolkit'
import { uiReducer } from './ui-slice'
import { taskReducer } from './task-slice'

export const store = configureStore({
	reducer: {
		ui: uiReducer,
		task: taskReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

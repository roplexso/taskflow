import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Theme = 'dark' | 'light'
type Filter = 'ALL' | 'TODO' | 'COMPLETED' | 'FAILED'
type SortBy = 'priority' | 'deadline' | 'createdAt'

interface UiState {
	theme: Theme
	filter: Filter
	sortBy: SortBy
	isCreateModalOpen: boolean
	isSidebarOpen: boolean
}

const initialState: UiState = {
	theme: 'dark',
	filter: 'ALL',
	sortBy: 'priority',
	isCreateModalOpen: false,
	isSidebarOpen: true,
}

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		setTheme(state, action: PayloadAction<Theme>) {
			state.theme = action.payload
		},
		toggleTheme(state) {
			state.theme = state.theme === 'dark' ? 'light' : 'dark'
		},
		setFilter(state, action: PayloadAction<Filter>) {
			state.filter = action.payload
		},
		setSortBy(state, action: PayloadAction<SortBy>) {
			state.sortBy = action.payload
		},
		openCreateModal(state) {
			state.isCreateModalOpen = true
		},
		closeCreateModal(state) {
			state.isCreateModalOpen = false
		},
		toggleSidebar(state) {
			state.isSidebarOpen = !state.isSidebarOpen
		},
	},
})

export const {
	setTheme,
	toggleTheme,
	setFilter,
	setSortBy,
	openCreateModal,
	closeCreateModal,
	toggleSidebar,
} = uiSlice.actions

export const uiReducer = uiSlice.reducer

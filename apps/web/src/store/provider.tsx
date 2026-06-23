'use client'

import { Provider } from 'react-redux'
import { store } from './index'
import { useAppSelector } from './hooks'
import { useEffect } from 'react'

function ThemeApplier({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Set immediately on mount before useEffect fires
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<ThemeApplier>{children}</ThemeApplier>
		</Provider>
	)
}

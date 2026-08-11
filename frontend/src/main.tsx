import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { queryClient } from './app/queryClient'
import { router } from './app/router'
import { theme } from './app/theme'
import { AppErrorBoundary } from './components/feedback/AppErrorBoundary'
import { CurrentUserProvider } from './app/currentUser'

const root = document.getElementById('root')
if (!root) throw new Error('No existe el elemento #root en index.html')

createRoot(root).render(
  <StrictMode>
    <AppErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <CurrentUserProvider>
            <RouterProvider router={router} />
          </CurrentUserProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  </StrictMode>,
)

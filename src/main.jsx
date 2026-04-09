import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import App from './App.jsx'

// React Query is the app's shared server-state cache.
// Conceptually, it sits between UI components and the API:
// components ask for data through hooks, React Query decides
// when to fetch, reuse cached data, and retry failed requests.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000,
    },
  },
})

// The root tree is composed in layers:
// 1. StrictMode helps catch unsafe React patterns during development.
// 2. QueryClientProvider exposes the shared data cache to every hook.
// 3. BrowserRouter enables URL-driven navigation on the frontend.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)


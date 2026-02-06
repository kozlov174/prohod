import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { SnackbarProvider } from 'notistack'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './app.tsx'
import './index.css'
import './styles/reset.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <AnimatePresence>
          <App />
        </AnimatePresence>
      </SnackbarProvider>
    </QueryClientProvider>
  </React.StrictMode>
)

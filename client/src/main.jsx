import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              border: '1px solid rgba(51, 65, 85, 0.5)',
              color: '#e2e8f0',
              fontSize: '13px',
            },
          }}
          richColors
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './contexts/AuthContext'
import { SeoConfigProvider } from './contexts/SeoConfigContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <SeoConfigProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SeoConfigProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)

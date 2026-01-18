import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './components/Auth/AuthProvider.jsx'

// ✅ GitHub Pages SPA fallback
const params = new URLSearchParams(window.location.search)
const redirect = params.get('redirect')
if (redirect) {
  window.history.replaceState(null, '', redirect)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { AppointmentsProvider } from './context/AppointmentsContext'
import { TestsProvider } from './context/TestsContext'
import { NotificationsProvider } from './context/NotificationsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppointmentsProvider>
        <TestsProvider>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </TestsProvider>
      </AppointmentsProvider>
    </AuthProvider>
  </StrictMode>,
)
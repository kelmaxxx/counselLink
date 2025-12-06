import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { AppointmentsProvider } from './context/AppointmentsContext'
import { TestsProvider } from './context/TestsContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { TestResultsProvider } from './context/TestResultsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppointmentsProvider>
        <TestsProvider>
          <NotificationsProvider>
            <TestResultsProvider>
              <App />
            </TestResultsProvider>
          </NotificationsProvider>
        </TestsProvider>
      </AppointmentsProvider>
    </AuthProvider>
  </StrictMode>,
)
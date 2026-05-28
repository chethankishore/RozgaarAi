// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'

import AppLayout     from './components/layout/AppLayout'
import HomePage      from './pages/HomePage'
import ATSPage       from './pages/ATSPage'
import InterviewPage from './pages/InterviewPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage     from './pages/LoginPage'
import RegisterPage  from './pages/RegisterPage'
import ProtectedRoute from './components/layout/ProtectedRoute'
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: {
            fontFamily:   'var(--font-body)',
            fontSize:     'var(--text-sm)',
            borderRadius: 'var(--radius-md)',
            border:       '1px solid var(--color-border)',
          }
        }} />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/"          element={<HomePage />} />
            <Route path="/ats"       element={<ATSPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/register"  element={<RegisterPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
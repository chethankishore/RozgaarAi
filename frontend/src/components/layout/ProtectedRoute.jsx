// src/components/layout/ProtectedRoute.jsx
import { Navigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()
  if (loading) return null  // or a full-page spinner
  return token ? children : <Navigate to="/login" replace />
}

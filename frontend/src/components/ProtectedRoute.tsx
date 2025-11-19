// componente de rota protegida para apenas usuarios autenticados
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedRoute() {
  const { token, loading } = useAuth()
  const location = useLocation()

  // enquanto carrega estado inicial, evita flicker
  if (loading) return null

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}

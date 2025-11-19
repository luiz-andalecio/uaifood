// rota protegida por papel (role): permite apenas ADMIN/ROOT conforme necessidade
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

type Props = {
  allowed: Array<'ADMIN' | 'ROOT' | 'CLIENTE'>
}

export default function RoleRoute({ allowed }: Props) {
  const { token, user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />

  const role = (user?.role || 'CLIENTE') as 'CLIENTE' | 'ADMIN' | 'ROOT'
  if (!allowed.includes(role)) return <Navigate to="/" replace />

  return <Outlet />
}

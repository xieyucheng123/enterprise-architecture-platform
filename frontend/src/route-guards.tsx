import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

export function AdminRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  // While authenticated but user data hasn't loaded yet (e.g. after refresh),
  // block access instead of letting a non-admin sneak through.
  if (isAuthenticated && !user) return null
  if (user && user.role !== 'admin') return <Navigate to="/architectures/value-streams" replace />
  return <Outlet />
}
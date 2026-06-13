import { useAuth } from './hooks/useAuth'
import { Navigate, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex h-screen items-center justify-center text-gray-400">
      Loading...
    </div>
  )
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} /> */}
      {/* <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} /> */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}


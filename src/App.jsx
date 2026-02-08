import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'
import Bacheca from './pages/Bacheca'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import Training from './pages/Training'
import VideoPlayer from './pages/VideoPlayer'

const ProtectedRoute = ({ children }) => {
  const { profile, loading } = useAuth()

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--gradient-bg)'
    }}>
      <div className="loading-spinner" />
    </div>
  )
  if (!profile) return <Navigate to="/login" />

  return children
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="documents" element={<Documents />} />
            <Route path="bacheca" element={<Bacheca />} />
            <Route path="profile" element={<Profile />} />
            <Route path="training" element={<Training />} />
            <Route path="training/:id" element={<VideoPlayer />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </HashRouter>
  )
}

export default App

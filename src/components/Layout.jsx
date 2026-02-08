import { useAuth } from '../context/AuthContext'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Newspaper, FileText, MessageSquare, Shield, User, GraduationCap, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Layout = () => {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!profile) return null

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname === ''
    return location.pathname.startsWith(path)
  }

  const navLinks = [
    { to: '/', icon: Newspaper, label: 'News' },
    { to: '/documents', icon: FileText, label: 'Documenti' },
    { to: '/bacheca', icon: MessageSquare, label: 'Bacheca' },
    { to: '/training', icon: GraduationCap, label: 'Formazione' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '64px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.025em'
            }}>
              Tecnor Macchine
            </h1>
          </Link>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${isActive(to) ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
            {profile.role === 'admin' && (
              <Link
                to="/admin"
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                style={isActive('/admin') ? {} : { color: 'var(--secondary)' }}
              >
                <Shield size={18} />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/profile"
            style={{
              color: isActive('/profile') ? 'var(--primary)' : 'var(--text-light)',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.75rem',
              borderRadius: 'var(--radius-lg)',
              transition: 'all 0.2s',
              fontSize: '0.875rem'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              {profile.first_name?.[0]}{profile.last_name?.[0]}
            </div>
            <span>{profile.first_name}</span>
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 0.75rem' }}>
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>

      <footer style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--border)',
        padding: '2rem',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '500', marginBottom: '0.75rem' }}>
            Intranet Aziendale - Riservato al Personale Tecnor
          </p>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
            <p style={{ fontWeight: '600' }}>TECNOR MACCHINE S.p.A.</p>
            <p>P. IVA 00753520154 | Registro Imprese di Milano - REA: MI 712252</p>
            <p>
              Tel. <a href="tel:+390282428511" style={{ color: 'var(--primary)', textDecoration: 'none' }}>+39 02 8242851</a>
              {' | '}
              E-mail: <a href="mailto:info@tecnormacchine.it" style={{ color: 'var(--primary)', textDecoration: 'none' }}>info@tecnormacchine.it</a>
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.65rem' }}>
              &copy; {new Date().getFullYear()} Tecnor Macchine S.p.A. - Tutti i diritti riservati
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout

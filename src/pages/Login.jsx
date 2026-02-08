import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Lock, User, UserPlus, ArrowRight, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [regUsername, setRegUsername] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register, profile } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (profile) navigate('/')
  }, [profile])

  useEffect(() => {
    if (isRegistering) {
      const cleanStr = (str) =>
        str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
      const cleanFirst = cleanStr(firstName)
      const cleanLast = cleanStr(lastName)
      if (cleanFirst && cleanLast) setRegUsername(`${cleanFirst}.${cleanLast}`)
      else if (cleanFirst) setRegUsername(cleanFirst)
      else setRegUsername('')
    }
  }, [firstName, lastName, isRegistering])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const emailToUse = email.includes('@') ? email : `${email}@tecnor.local`
    const result = await login(emailToUse, password)
    setLoading(false)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.message === 'Invalid login credentials'
        ? 'Credenziali non valide. Verifica username e password.'
        : result.message)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!regUsername.includes('.')) {
      setError('Lo username deve essere nel formato nome.cognome')
      return
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/
    if (!passwordRegex.test(regPassword)) {
      setError('La password deve essere di almeno 6 caratteri, contenere una lettera maiuscola e un carattere speciale')
      return
    }

    setLoading(true)
    const result = await register({ firstName, lastName, username: regUsername, password: regPassword })
    setLoading(false)

    if (result.success) {
      setSuccess('Registrazione avvenuta! Il tuo account e\' in attesa di approvazione dall\'amministratore.')
      setIsRegistering(false)
      setFirstName('')
      setLastName('')
      setRegUsername('')
      setRegPassword('')
    } else {
      setError(result.message)
    }
  }

  const inputStyle = {
    paddingLeft: '2.75rem',
    background: 'rgba(15, 23, 42, 0.5)',
    borderColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    borderRadius: '0.75rem'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#CBD5E1',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '0.025em'
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,61,0.08) 0%, transparent 70%)',
        top: '-200px',
        right: '-200px'
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(61,76,159,0.08) 0%, transparent 70%)',
        bottom: '-100px',
        left: '-100px'
      }} />

      <div className="animate-fade-in" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '2.5rem',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 1rem',
            borderRadius: '1rem',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(255,107,61,0.3)'
          }}>
            <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>T</span>
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            marginBottom: '0.25rem',
            background: 'linear-gradient(to right, #FF6B3D, #FF8C5F)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.025em'
          }}>
            Tecnor Macchine
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Intranet Aziendale
          </p>
        </div>

        {error && (
          <div className="animate-slide-down" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#FCA5A5',
            padding: '0.875rem 1rem',
            borderRadius: '0.75rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.8rem',
            textAlign: 'left'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        {success && (
          <div className="animate-slide-down" style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            color: '#86EFAC',
            padding: '0.875rem 1rem',
            borderRadius: '0.75rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.8rem',
            textAlign: 'left'
          }}>
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            {success}
          </div>
        )}

        {!isRegistering ? (
          <form onSubmit={handleLogin} className="animate-fade-in">
            <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
              <label style={labelStyle}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="text"
                  className="input-field"
                  style={inputStyle}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome.cognome"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '0.5rem', textAlign: 'left' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  style={{ ...inputStyle, paddingRight: '2.75rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Inserisci password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                marginTop: '1.25rem',
                borderRadius: '0.75rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Accesso in corso...' : <>Accedi <ArrowRight size={18} /></>}
            </button>

            <div style={{ marginTop: '1.5rem', color: '#94A3B8', fontSize: '0.8rem' }}>
              Non hai un account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegistering(true); setError(''); setSuccess('') }}
                style={{ background: 'none', border: 'none', color: '#FF8C5F', cursor: 'pointer', fontWeight: '600' }}
              >
                Registrati
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={labelStyle}>Nome</label>
                <input
                  type="text"
                  className="input-field"
                  style={{ ...inputStyle, paddingLeft: '1rem' }}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div style={{ textAlign: 'left' }}>
                <label style={labelStyle}>Cognome</label>
                <input
                  type="text"
                  className="input-field"
                  style={{ ...inputStyle, paddingLeft: '1rem' }}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label style={labelStyle}>Username (automatico)</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type="text"
                  className="input-field"
                  style={{ ...inputStyle, background: 'rgba(15, 23, 42, 0.7)', color: '#94A3B8', cursor: 'not-allowed' }}
                  value={regUsername}
                  readOnly
                  placeholder="nome.cognome"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label style={labelStyle}>
                Password <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: '400' }}>(min 6 car., 1 maiusc., 1 speciale)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="password"
                  className="input-field"
                  style={inputStyle}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: '0.75rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Registrazione...' : <><UserPlus size={18} /> Crea Account</>}
            </button>

            <div style={{ marginTop: '1.5rem', color: '#94A3B8', fontSize: '0.8rem' }}>
              Hai gia' un account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegistering(false); setError(''); setSuccess('') }}
                style={{ background: 'none', border: 'none', color: '#FF8C5F', cursor: 'pointer', fontWeight: '600' }}
              >
                Accedi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { User, Lock, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const Profile = () => {
  const { profile, user } = useAuth()
  const [activeTab, setActiveTab] = useState('info')

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [myPosts, setMyPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)

  useEffect(() => {
    if (activeTab === 'posts') fetchMyPosts()
  }, [activeTab])

  const fetchMyPosts = async () => {
    setLoadingPosts(true)
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
    setMyPosts(data || [])
    setLoadingPosts(false)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordMessage('')
    setPasswordError('')

    if (newPassword !== confirmPassword) {
      setPasswordError('Le nuove password non coincidono')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('La password deve essere di almeno 6 caratteri')
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordMessage('Password aggiornata con successo!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  const getStatusBadge = (status, archived) => {
    if (archived) return <span className="badge badge-warning"><Clock size={12} /> Archiviato</span>
    switch (status) {
      case 'approved':
        return <span className="badge badge-success"><CheckCircle size={12} /> Pubblicato</span>
      case 'rejected':
        return <span className="badge badge-danger"><XCircle size={12} /> Rifiutato</span>
      default:
        return <span className="badge badge-muted"><Clock size={12} /> In Attesa</span>
    }
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem' }}>Il Mio Profilo</h2>

      <div className="tabs">
        <button className={`tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
          <User size={16} /> Dati Personali
        </button>
        <button className={`tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
          <MessageSquare size={16} /> I Miei Messaggi
        </button>
      </div>

      {activeTab === 'info' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
              <User size={20} style={{ color: 'var(--primary)' }} /> Informazioni Account
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {[
                { label: 'Nome', value: profile.first_name },
                { label: 'Cognome', value: profile.last_name },
                { label: 'Username', value: profile.username },
                { label: 'Ruolo', value: profile.role === 'admin' ? 'Amministratore' : 'Dipendente' }
              ].map(({ label, value }) => (
                <div key={label}>
                  <label style={{ display: 'block', color: '#64748B', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: '500' }}>{label}</label>
                  <div style={{ fontSize: '1.05rem', fontWeight: '600' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
              <Lock size={20} style={{ color: 'var(--primary)' }} /> Cambio Password
            </h3>

            {passwordMessage && <div className="alert alert-success"><CheckCircle size={18} /> {passwordMessage}</div>}
            {passwordError && <div className="alert alert-error"><AlertCircle size={18} /> {passwordError}</div>}

            <form onSubmit={handleChangePassword} style={{ maxWidth: '400px' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>Nuova Password</label>
                <input type="password" className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>Conferma Nuova Password</label>
                <input type="password" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary">Aggiorna Password</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>Storico Messaggi Bacheca</h3>

          {loadingPosts ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <div className="loading-spinner" />
            </div>
          ) : myPosts.length === 0 ? (
            <p style={{ color: '#64748B', textAlign: 'center', padding: '2rem' }}>Non hai ancora inviato messaggi.</p>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {myPosts.map((post) => (
                <div key={post.id} style={{
                  padding: '1rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  background: '#FAFBFD'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      {new Date(post.date).toLocaleString('it-IT')}
                      {post.is_anonymous && <span style={{ marginLeft: '0.5rem', fontStyle: 'italic' }}>(Anonimo)</span>}
                    </div>
                    {getStatusBadge(post.status, post.archived)}
                  </div>
                  <p style={{ color: '#334155', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Profile

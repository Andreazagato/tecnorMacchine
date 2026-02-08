import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { MessageSquare, Send, User, MessageCircle } from 'lucide-react'

const Bacheca = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles:user_id(first_name, last_name)')
      .eq('status', 'approved')
      .eq('archived', false)
      .order('date', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('posts').insert({
      content: newPost,
      is_anonymous: isAnonymous,
      user_id: user.id
    })
    if (!error) {
      setNewPost('')
      setIsAnonymous(false)
      setMessage('Messaggio inviato! Sara\' visibile dopo l\'approvazione.')
      setTimeout(() => setMessage(''), 5000)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <div className="loading-spinner" />
    </div>
  )

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <MessageSquare size={20} color="white" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Bacheca Aziendale</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map((post) => (
            <div key={post.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '40px', height: '40px',
                  background: post.is_anonymous ? '#E2E8F0' : 'var(--gradient-primary)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: post.is_anonymous ? '#64748B' : 'white',
                  fontWeight: '700', fontSize: '0.8rem'
                }}>
                  {post.is_anonymous ? <User size={18} /> :
                    (post.profiles ? `${post.profiles.first_name[0]}${post.profiles.last_name[0]}` : '?')
                  }
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                    {post.is_anonymous ? 'Anonimo' :
                      (post.profiles ? `${post.profiles.first_name} ${post.profiles.last_name}` : 'Utente')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(post.date).toLocaleDateString('it-IT')}
                  </div>
                </div>
              </div>
              <p style={{ whiteSpace: 'pre-wrap', color: '#334155', lineHeight: '1.7', fontSize: '0.9rem' }}>{post.content}</p>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <MessageCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-light)' }}>Nessun messaggio in bacheca.</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="card" style={{ position: 'sticky', top: '80px' }}>
          <h3 style={{
            fontSize: '1.1rem', marginBottom: '1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700'
          }}>
            <Send size={18} style={{ color: 'var(--primary)' }} /> Scrivi un messaggio
          </h3>

          {message && (
            <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <textarea
              className="input-field"
              rows="5"
              placeholder="Condividi un'opinione, un consiglio o un'idea..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              style={{ resize: 'vertical', marginBottom: '1rem' }}
              required
            />

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Invia come Anonimo</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} /> Invia Messaggio
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Bacheca

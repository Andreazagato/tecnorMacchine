import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Calendar, Newspaper } from 'lucide-react'

const Dashboard = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    const { data } = await supabase
      .from('news')
      .select('*, profiles:user_id(first_name, last_name)')
      .eq('archived', false)
      .order('date', { ascending: false })
    setNews(data || [])
    setLoading(false)
  }

  const formatText = (text) => {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>')
    return formatted
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <div className="loading-spinner" />
    </div>
  )

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '0.75rem',
          background: 'var(--gradient-warm)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <Newspaper size={20} color="white" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Ultime Novita'</h2>
      </div>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {news.map((item) => (
          <div key={item.id} className="card card-interactive">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', fontWeight: '700' }}>{item.title}</h3>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                color: 'var(--text-muted)', fontSize: '0.8rem',
                background: '#F8FAFC', padding: '0.375rem 0.75rem',
                borderRadius: '9999px', flexShrink: 0
              }}>
                <Calendar size={14} />
                {new Date(item.date).toLocaleDateString('it-IT')}
              </div>
            </div>
            <div
              style={{ whiteSpace: 'pre-wrap', color: '#475569', lineHeight: '1.7' }}
              dangerouslySetInnerHTML={{ __html: formatText(item.content) }}
            />
            <div style={{
              marginTop: '1.25rem', paddingTop: '1rem',
              borderTop: '1px solid var(--border-light)',
              fontSize: '0.8rem', color: 'var(--text-muted)'
            }}>
              Pubblicato da: <strong style={{ color: 'var(--text-light)' }}>
                {item.profiles ? `${item.profiles.first_name} ${item.profiles.last_name}` : 'Sistema'}
              </strong>
            </div>
          </div>
        ))}

        {news.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Newspaper size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>Nessuna novita' pubblicata al momento.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

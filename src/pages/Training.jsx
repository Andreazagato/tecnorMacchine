import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { PlayCircle, GraduationCap, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const Training = () => {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const { data: videosData } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: progressData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)

    const videosWithProgress = (videosData || []).map(video => {
      const progress = (progressData || []).find(p => p.video_id === video.id)
      return { ...video, progress: progress || { percentage: 0, completed: false } }
    })

    setVideos(videosWithProgress)
    setLoading(false)
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
          background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <GraduationCap size={20} color="white" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Formazione</h2>
      </div>

      {videos.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <GraduationCap size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-light)' }}>Nessun video formativo disponibile al momento.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {videos.map(video => {
            const { progress } = video
            return (
              <div key={video.id} className="card card-interactive" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #F1F5F9, #E2E8F0)',
                  height: '160px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative'
                }}>
                  <PlayCircle size={52} color="var(--primary)" style={{ opacity: 0.8 }} />
                  {progress.completed && (
                    <div style={{
                      position: 'absolute', top: '12px', right: '12px',
                      background: '#16A34A', color: 'white',
                      padding: '0.25rem 0.625rem', borderRadius: '9999px',
                      fontSize: '0.7rem', fontWeight: '700',
                      display: 'flex', alignItems: 'center', gap: '0.25rem'
                    }}>
                      <CheckCircle size={12} /> Completato
                    </div>
                  )}
                </div>
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.375rem', fontWeight: '700' }}>{video.title}</h3>
                  <p style={{ color: '#64748B', marginBottom: '1rem', flex: 1, fontSize: '0.85rem' }}>{video.subtitle}</p>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-light)' }}>Progresso</span>
                      <span style={{ fontWeight: '700', color: progress.completed ? '#16A34A' : 'var(--primary)' }}>
                        {progress.percentage}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{
                        width: `${progress.percentage}%`,
                        background: progress.completed ? '#16A34A' : 'var(--gradient-primary)'
                      }} />
                    </div>
                  </div>

                  <Link
                    to={`/training/${video.id}`}
                    className="btn btn-primary"
                    style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                  >
                    {progress.completed ? 'Rivedi Video' : (progress.percentage > 0 ? 'Riprendi' : 'Inizia')}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Training

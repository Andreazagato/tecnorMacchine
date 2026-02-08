import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft } from 'lucide-react'

const VideoPlayer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [video, setVideo] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const videoRef = useRef(null)
  const lastSaved = useRef(0)

  useEffect(() => {
    fetchVideo()
  }, [id])

  const fetchVideo = async () => {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('id', parseInt(id))
      .single()

    if (data) {
      setVideo(data)
      const { data: urlData } = supabase.storage.from('videos').getPublicUrl(data.file_path)
      if (urlData?.publicUrl) setVideoUrl(urlData.publicUrl)
    }
  }

  const saveProgress = async (percentage) => {
    if (Math.abs(percentage - lastSaved.current) < 5) return
    lastSaved.current = percentage

    const completed = percentage >= 95

    await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        video_id: parseInt(id),
        percentage: Math.min(percentage, 100),
        completed
      }, { onConflict: 'user_id,video_id' })
  }

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const percentage = Math.floor((videoRef.current.currentTime / videoRef.current.duration) * 100)
      if (percentage > 0 && percentage % 5 === 0) {
        saveProgress(percentage)
      }
    }
  }

  const handleEnded = () => {
    saveProgress(100)
  }

  if (!video) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <div className="loading-spinner" />
    </div>
  )

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/training')}
        className="btn btn-secondary"
        style={{ marginBottom: '1rem' }}
      >
        <ArrowLeft size={16} /> Torna alla lista
      </button>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          style={{ width: '100%', display: 'block', maxHeight: '70vh', background: '#000' }}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
        <div style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.375rem', fontWeight: '700' }}>{video.title}</h2>
          {video.subtitle && (
            <h3 style={{ fontSize: '1rem', color: '#64748B', marginBottom: '1rem', fontWeight: '500' }}>{video.subtitle}</h3>
          )}
          {video.description && (
            <p style={{ lineHeight: '1.7', color: '#475569' }}>{video.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer

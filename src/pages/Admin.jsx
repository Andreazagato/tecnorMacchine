import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import {
  Plus, Trash2, Check, X, Upload, Edit2, Bold, Italic, List,
  Archive, ArchiveRestore, Lock, LayoutDashboard, FileText,
  MessageSquare, Video, Users, UserCheck, Shield
} from 'lucide-react'

const Admin = () => {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activeSection, setActiveSection] = useState('create')

  // Dashboard
  const [stats, setStats] = useState({
    usersApproved: 0, usersPending: 0, usersResetReq: 0,
    postsActive: 0, postsPending: 0, documentsTotal: 0, videosTotal: 0
  })

  // News
  const [newsTitle, setNewsTitle] = useState('')
  const [newsContent, setNewsContent] = useState('')
  const [newsList, setNewsList] = useState([])
  const [archivedNews, setArchivedNews] = useState([])
  const [editingNews, setEditingNews] = useState(null)

  // Documents
  const [docTitle, setDocTitle] = useState('')
  const [docDescription, setDocDescription] = useState('')
  const [docFile, setDocFile] = useState(null)
  const [docCategory, setDocCategory] = useState('')
  const [documentsList, setDocumentsList] = useState([])
  const [archivedDocs, setArchivedDocs] = useState([])

  // Categories
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDesc, setNewCategoryDesc] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)

  // Posts
  const [pendingPosts, setPendingPosts] = useState([])
  const [approvedPosts, setApprovedPosts] = useState([])
  const [archivedPosts, setArchivedPosts] = useState([])

  // Users
  const [pendingUsers, setPendingUsers] = useState([])
  const [approvedUsers, setApprovedUsers] = useState([])
  const [activeUserSection, setActiveUserSection] = useState('approved')
  const [newUserFirstName, setNewUserFirstName] = useState('')
  const [newUserLastName, setNewUserLastName] = useState('')
  const [newUserRole, setNewUserRole] = useState('employee')

  // Training
  const [videoTitle, setVideoTitle] = useState('')
  const [videoSubtitle, setVideoSubtitle] = useState('')
  const [videoDescription, setVideoDescription] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [videosList, setVideosList] = useState([])

  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000) }

  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats()
    else if (activeTab === 'news') { fetchNews(); if (activeSection === 'archived') fetchArchivedNews() }
    else if (activeTab === 'documents') { fetchDocuments(); fetchCategories(); if (activeSection === 'archived') fetchArchivedDocs() }
    else if (activeTab === 'moderation') { fetchPendingPosts(); fetchApprovedPosts(); if (activeSection === 'archived') fetchArchivedPosts() }
    else if (activeTab === 'users') { fetchPendingUsers(); fetchApprovedUsers() }
    else if (activeTab === 'training') fetchTrainingVideos()
  }, [activeTab, activeSection, activeUserSection])

  // === FETCH FUNCTIONS ===
  const fetchStats = async () => {
    const { data } = await supabase.rpc('get_admin_stats')
    if (data) setStats(data)
  }

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*, profiles:user_id(first_name, last_name)').eq('archived', false).order('date', { ascending: false })
    setNewsList(data || [])
  }

  const fetchArchivedNews = async () => {
    const { data } = await supabase.from('news').select('*, profiles:user_id(first_name, last_name)').eq('archived', true).order('date', { ascending: false })
    setArchivedNews(data || [])
  }

  const fetchDocuments = async () => {
    const { data } = await supabase.from('documents').select('*, categories:category_id(name)').eq('archived', false).order('date', { ascending: false })
    setDocumentsList(data || [])
  }

  const fetchArchivedDocs = async () => {
    const { data } = await supabase.from('documents').select('*, categories:category_id(name)').eq('archived', true).order('date', { ascending: false })
    setArchivedDocs(data || [])
  }

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
  }

  const fetchPendingPosts = async () => {
    const { data } = await supabase.from('posts').select('*, profiles:user_id(first_name, last_name)').eq('status', 'pending').order('date', { ascending: false })
    setPendingPosts(data || [])
  }

  const fetchApprovedPosts = async () => {
    const { data } = await supabase.from('posts').select('*, profiles:user_id(first_name, last_name)').eq('status', 'approved').eq('archived', false).order('date', { ascending: false })
    setApprovedPosts(data || [])
  }

  const fetchArchivedPosts = async () => {
    const { data } = await supabase.from('posts').select('*, profiles:user_id(first_name, last_name)').eq('archived', true).order('date', { ascending: false })
    setArchivedPosts(data || [])
  }

  const fetchPendingUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('status', 'pending').order('created_at', { ascending: false })
    setPendingUsers(data || [])
  }

  const fetchApprovedUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('status', 'approved').order('first_name')
    // Fetch progress counts
    if (data) {
      const { data: progressData } = await supabase.from('user_progress').select('user_id, completed').eq('completed', true)
      const progressMap = {}
      ;(progressData || []).forEach(p => { progressMap[p.user_id] = (progressMap[p.user_id] || 0) + 1 })
      setApprovedUsers(data.map(u => ({ ...u, level: progressMap[u.id] || 0 })))
    }
  }

  const fetchTrainingVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
    setVideosList(data || [])
  }

  // === ACTION HANDLERS ===
  const insertFormatting = (before, after = '') => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = newsContent.substring(start, end)
    setNewsContent(newsContent.substring(0, start) + before + selected + after + newsContent.substring(end))
    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(start + before.length, end + before.length) }, 0)
  }

  const handleCreateNews = async (e) => {
    e.preventDefault()
    if (editingNews) {
      await supabase.from('news').update({ title: newsTitle, content: newsContent }).eq('id', editingNews.id)
      showMsg('News aggiornata!')
      setEditingNews(null)
    } else {
      await supabase.from('news').insert({ title: newsTitle, content: newsContent, user_id: profile.id })
      showMsg('News pubblicata!')
    }
    setNewsTitle(''); setNewsContent(''); fetchNews()
  }

  const handleArchiveNews = async (id) => { await supabase.from('news').update({ archived: true }).eq('id', id); fetchNews(); showMsg('News archiviata!') }
  const handleUnarchiveNews = async (id) => { await supabase.from('news').update({ archived: false }).eq('id', id); fetchArchivedNews(); fetchNews(); showMsg('News ripristinata!') }
  const handleDeleteNews = async (id) => { if (confirm('Eliminare definitivamente?')) { await supabase.from('news').delete().eq('id', id); fetchNews(); fetchArchivedNews(); showMsg('News eliminata!') } }

  const handleUploadDoc = async (e) => {
    e.preventDefault()
    const file = docFile
    const fileName = `${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('documents').upload(fileName, file)
    if (uploadError) { showMsg('Errore upload: ' + uploadError.message); return }

    await supabase.from('documents').insert({
      title: docTitle, description: docDescription, file_name: file.name,
      file_path: fileName, category_id: docCategory || null, user_id: profile.id
    })
    setDocTitle(''); setDocDescription(''); setDocFile(null); setDocCategory('')
    fetchDocuments(); showMsg('Documento caricato!')
  }

  const handleArchiveDoc = async (id) => { await supabase.from('documents').update({ archived: true }).eq('id', id); fetchDocuments(); showMsg('Documento archiviato!') }
  const handleUnarchiveDoc = async (id) => { await supabase.from('documents').update({ archived: false }).eq('id', id); fetchArchivedDocs(); fetchDocuments(); showMsg('Documento ripristinato!') }
  const handleDeleteDoc = async (id) => { if (confirm('Eliminare definitivamente?')) { await supabase.from('documents').delete().eq('id', id); fetchDocuments(); fetchArchivedDocs(); showMsg('Documento eliminato!') } }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    await supabase.from('categories').insert({ name: newCategoryName, description: newCategoryDesc })
    setNewCategoryName(''); setNewCategoryDesc(''); fetchCategories(); showMsg('Categoria creata!')
  }

  const handleUpdateCategory = async (id) => {
    await supabase.from('categories').update({ name: editingCategory.name, description: editingCategory.description }).eq('id', id)
    setEditingCategory(null); fetchCategories(); showMsg('Categoria aggiornata!')
  }

  const handleDeleteCategory = async (id) => { if (confirm('Eliminare questa categoria?')) { await supabase.from('categories').delete().eq('id', id); fetchCategories(); showMsg('Categoria eliminata!') } }

  const handleModeration = async (id, status) => {
    await supabase.from('posts').update({ status }).eq('id', id)
    fetchPendingPosts(); fetchApprovedPosts(); showMsg(`Messaggio ${status === 'approved' ? 'approvato' : 'rifiutato'}!`)
  }

  const handleArchivePost = async (id) => { await supabase.from('posts').update({ archived: true }).eq('id', id); fetchApprovedPosts(); showMsg('Messaggio archiviato!') }
  const handleUnarchivePost = async (id) => { await supabase.from('posts').update({ archived: false }).eq('id', id); fetchArchivedPosts(); fetchApprovedPosts(); showMsg('Messaggio ripristinato!') }
  const handleDeletePost = async (id) => { if (confirm('Eliminare definitivamente?')) { await supabase.from('posts').delete().eq('id', id); fetchApprovedPosts(); fetchArchivedPosts(); showMsg('Messaggio eliminato!') } }

  const handleApproveUser = async (id) => { await supabase.from('profiles').update({ status: 'approved' }).eq('id', id); fetchPendingUsers(); showMsg('Utente approvato!') }
  const handleRejectUser = async (id) => { if (confirm('Rifiutare questa registrazione?')) { await supabase.from('profiles').update({ status: 'rejected' }).eq('id', id); fetchPendingUsers(); showMsg('Richiesta rifiutata.') } }

  const handleResetPassword = async (id) => {
    if (confirm('Resettare la password di questo utente?')) {
      // Note: Admin password reset requires Supabase admin API or edge function
      await supabase.from('profiles').update({ reset_requested: false }).eq('id', id)
      showMsg('Richiesta di reset processata.')
    }
  }

  const handleUpdateRole = async (id, newRole) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    fetchApprovedUsers(); showMsg(`Ruolo aggiornato a ${newRole === 'admin' ? 'Admin' : 'Dipendente'}!`)
  }

  const handleDeleteUser = async (id) => {
    if (confirm('Eliminare definitivamente questo utente?')) {
      await supabase.from('profiles').delete().eq('id', id)
      fetchApprovedUsers(); showMsg('Utente eliminato!')
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    const cleanStr = (str) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
    const username = `${cleanStr(newUserFirstName)}.${cleanStr(newUserLastName)}`
    const email = `${username}@tecnor.local`

    const { data, error } = await supabase.auth.signUp({
      email,
      password: 'Tecnor@2026',
      options: {
        data: { username, first_name: newUserFirstName, last_name: newUserLastName, role: newUserRole }
      }
    })

    if (error) { showMsg('Errore: ' + error.message); return }

    // Auto-approve the created user
    if (data?.user) {
      await supabase.from('profiles').update({ status: 'approved' }).eq('id', data.user.id)
    }

    showMsg(`Utente ${newUserFirstName} ${newUserLastName} creato!`)
    setNewUserFirstName(''); setNewUserLastName(''); setNewUserRole('employee')
    fetchApprovedUsers(); setActiveUserSection('approved')
  }

  const handleUploadVideo = async (e) => {
    e.preventDefault()
    const file = videoFile
    const fileName = `${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('videos').upload(fileName, file)
    if (uploadError) { showMsg('Errore upload: ' + uploadError.message); return }

    await supabase.from('videos').insert({
      title: videoTitle, subtitle: videoSubtitle, description: videoDescription,
      file_name: file.name, file_path: fileName
    })
    setVideoTitle(''); setVideoSubtitle(''); setVideoDescription(''); setVideoFile(null)
    fetchTrainingVideos(); showMsg('Video caricato!')
  }

  const handleDeleteVideo = async (id) => {
    if (confirm('Eliminare questo video?')) {
      await supabase.from('videos').delete().eq('id', id)
      fetchTrainingVideos(); showMsg('Video eliminato!')
    }
  }

  if (profile?.role !== 'admin') {
    return <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
      <Shield size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
      <p>Accesso Negato. Area riservata agli amministratori.</p>
    </div>
  }

  const tabItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'news', icon: FileText, label: 'News' },
    { id: 'documents', icon: FileText, label: 'Documenti' },
    { id: 'moderation', icon: MessageSquare, label: 'Bacheca' },
    { id: 'users', icon: Users, label: `Utenti (${pendingUsers.length})` },
    { id: 'training', icon: Video, label: 'Formazione' },
  ]

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '0.75rem',
          background: 'var(--gradient-primary)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <Shield size={20} color="white" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Pannello Amministrazione</h2>
      </div>

      <div className="tabs">
        {tabItems.map(({ id, icon: Icon, label }) => (
          <button key={id} className={`tab ${activeTab === id ? 'active' : ''}`}
            onClick={() => { setActiveTab(id); if (id === 'users') setActiveUserSection('approved') }}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      {/* DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {[
            { label: 'Utenti Registrati', value: stats.usersApproved, color: '#3B82F6', icon: Users, onClick: () => { setActiveTab('users'); setActiveUserSection('approved') } },
            { label: 'Richieste Registrazione', value: stats.usersPending, color: '#EAB308', icon: UserCheck, badge: stats.usersPending > 0, onClick: () => { setActiveTab('users'); setActiveUserSection('pending') } },
            { label: 'Reset Password', value: stats.usersResetReq, color: '#F97316', icon: Lock, onClick: () => { setActiveTab('users') } },
            { label: 'Messaggi Bacheca', value: stats.postsActive, color: '#10B981', icon: MessageSquare, onClick: () => { setActiveTab('moderation'); setActiveSection('approved') } },
            { label: 'Da Approvare', value: stats.postsPending, color: '#EF4444', icon: ArchiveRestore, badge: stats.postsPending > 0, onClick: () => { setActiveTab('moderation'); setActiveSection('pending') } },
            { label: 'Documenti', value: stats.documentsTotal, color: '#8B5CF6', icon: FileText, onClick: () => setActiveTab('documents') },
            { label: 'Video Formazione', value: stats.videosTotal, color: '#EC4899', icon: Video, onClick: () => setActiveTab('training') },
          ].map(({ label, value, color, icon: Icon, badge, onClick }) => (
            <div key={label} className="stat-card" style={{ borderLeftColor: color }} onClick={onClick}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '600' }}>{label}</p>
                  <p style={{ fontSize: '2rem', fontWeight: '800', color: '#1E293B' }}>{value}</p>
                </div>
                <div style={{ background: `${color}15`, padding: '0.75rem', borderRadius: '50%' }}>
                  <Icon size={22} color={color} />
                </div>
              </div>
              {badge && <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color, fontWeight: '600' }}>Richiede azione</div>}
            </div>
          ))}
        </div>
      )}

      {/* NEWS */}
      {activeTab === 'news' && (
        <div>
          <div className="tabs">
            <button className={`tab ${activeSection === 'create' ? 'active' : ''}`} onClick={() => { setActiveSection('create'); setEditingNews(null); setNewsTitle(''); setNewsContent('') }}>
              {editingNews ? 'Modifica' : 'Crea Nuova'}
            </button>
            <button className={`tab ${activeSection === 'manage' ? 'active' : ''}`} onClick={() => setActiveSection('manage')}>
              Gestisci ({newsList.length})
            </button>
            <button className={`tab ${activeSection === 'archived' ? 'active' : ''}`} onClick={() => setActiveSection('archived')}>
              <Archive size={14} /> Archiviate ({archivedNews.length})
            </button>
          </div>

          {activeSection === 'create' && (
            <div className="card" style={{ maxWidth: '900px' }}>
              <h3 style={{ marginBottom: '1.25rem', fontWeight: '700' }}>{editingNews ? 'Modifica Notizia' : 'Nuova Notizia'}</h3>
              <form onSubmit={handleCreateNews}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}>Titolo</label>
                  <input type="text" className="input-field" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}>Contenuto</label>
                  <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.5rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: 'var(--radius-lg)' }}>
                    <button type="button" className="btn btn-secondary" style={{ padding: '0.375rem 0.5rem' }} onClick={() => insertFormatting('**', '**')} title="Grassetto"><Bold size={14} /></button>
                    <button type="button" className="btn btn-secondary" style={{ padding: '0.375rem 0.5rem' }} onClick={() => insertFormatting('*', '*')} title="Corsivo"><Italic size={14} /></button>
                    <button type="button" className="btn btn-secondary" style={{ padding: '0.375rem 0.5rem' }} onClick={() => insertFormatting('\n• ')} title="Elenco"><List size={14} /></button>
                  </div>
                  <textarea ref={textareaRef} className="input-field" rows="8" value={newsContent} onChange={(e) => setNewsContent(e.target.value)} required />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary">{editingNews ? <><Edit2 size={16} /> Aggiorna</> : <><Plus size={16} /> Pubblica</>}</button>
                  {editingNews && <button type="button" className="btn btn-secondary" onClick={() => { setEditingNews(null); setNewsTitle(''); setNewsContent('') }}>Annulla</button>}
                </div>
              </form>
            </div>
          )}

          {activeSection === 'manage' && (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {newsList.length === 0 && <p style={{ color: 'var(--text-light)' }}>Nessuna news pubblicata.</p>}
              {newsList.map((news) => (
                <div key={news.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--primary)', fontWeight: '700' }}>{news.title}</h3>
                      <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{news.content.substring(0, 150)}...</p>
                      <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                        {new Date(news.date).toLocaleDateString('it-IT')} - {news.profiles ? `${news.profiles.first_name} ${news.profiles.last_name}` : 'Sistema'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem', marginLeft: '1rem' }}>
                      <button onClick={() => { setEditingNews(news); setNewsTitle(news.title); setNewsContent(news.content); setActiveSection('create') }} className="btn btn-secondary" style={{ padding: '0.5rem' }}><Edit2 size={16} /></button>
                      <button onClick={() => handleArchiveNews(news.id)} className="btn btn-warning" style={{ padding: '0.5rem' }}><Archive size={16} /></button>
                      <button onClick={() => handleDeleteNews(news.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'archived' && (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {archivedNews.length === 0 && <p style={{ color: 'var(--text-light)' }}>Nessuna news archiviata.</p>}
              {archivedNews.map((news) => (
                <div key={news.id} className="card" style={{ opacity: 0.7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{news.title}</h3>
                      <p style={{ color: '#475569', fontSize: '0.85rem' }}>{news.content.substring(0, 150)}...</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button onClick={() => handleUnarchiveNews(news.id)} className="btn btn-success" style={{ padding: '0.5rem' }}><ArchiveRestore size={16} /></button>
                      <button onClick={() => handleDeleteNews(news.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DOCUMENTS */}
      {activeTab === 'documents' && (
        <div>
          <div className="tabs">
            <button className={`tab ${activeSection === 'create' ? 'active' : ''}`} onClick={() => setActiveSection('create')}>Carica Nuovo</button>
            <button className={`tab ${activeSection === 'manage' ? 'active' : ''}`} onClick={() => setActiveSection('manage')}>Gestisci ({documentsList.length})</button>
            <button className={`tab ${activeSection === 'categories' ? 'active' : ''}`} onClick={() => setActiveSection('categories')}>Categorie ({categories.length})</button>
            <button className={`tab ${activeSection === 'archived' ? 'active' : ''}`} onClick={() => setActiveSection('archived')}><Archive size={14} /> Archiviati ({archivedDocs.length})</button>
          </div>

          {activeSection === 'create' && (
            <div className="card" style={{ maxWidth: '800px' }}>
              <h3 style={{ marginBottom: '1.25rem', fontWeight: '700' }}>Carica Documento</h3>
              <form onSubmit={handleUploadDoc}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}>Titolo</label>
                  <input type="text" className="input-field" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}>Descrizione (opzionale)</label>
                  <textarea className="input-field" rows="3" value={docDescription} onChange={(e) => setDocDescription(e.target.value)} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}>Categoria</label>
                  <select className="input-field" value={docCategory} onChange={(e) => setDocCategory(e.target.value)}>
                    <option value="">Nessuna categoria</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}>File</label>
                  <input type="file" className="input-field" onChange={(e) => setDocFile(e.target.files[0])} required />
                </div>
                <button type="submit" className="btn btn-primary"><Upload size={16} /> Carica</button>
              </form>
            </div>
          )}

          {activeSection === 'manage' && (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {documentsList.length === 0 && <p style={{ color: 'var(--text-light)' }}>Nessun documento.</p>}
              {documentsList.map(doc => (
                <div key={doc.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>{doc.title}</h4>
                      {doc.description && <p style={{ color: '#64748B', fontSize: '0.85rem' }}>{doc.description}</p>}
                      <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{new Date(doc.date).toLocaleDateString('it-IT')} - {doc.file_name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button onClick={() => handleArchiveDoc(doc.id)} className="btn btn-warning" style={{ padding: '0.5rem' }}><Archive size={16} /></button>
                      <button onClick={() => handleDeleteDoc(doc.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'categories' && (
            <div>
              <div className="card" style={{ maxWidth: '600px', marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem', fontWeight: '700' }}>Nuova Categoria</h4>
                <form onSubmit={handleCreateCategory}>
                  <div style={{ marginBottom: '1rem' }}>
                    <input type="text" className="input-field" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nome categoria" required />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <textarea className="input-field" rows="2" value={newCategoryDesc} onChange={(e) => setNewCategoryDesc(e.target.value)} placeholder="Descrizione (opzionale)" />
                  </div>
                  <button type="submit" className="btn btn-primary"><Plus size={16} /> Crea</button>
                </form>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {categories.map(cat => (
                  <div key={cat.id} className="card">
                    {editingCategory?.id === cat.id ? (
                      <div>
                        <input type="text" className="input-field" style={{ marginBottom: '0.75rem' }} value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} />
                        <textarea className="input-field" rows="2" style={{ marginBottom: '0.75rem' }} value={editingCategory.description || ''} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleUpdateCategory(cat.id)} className="btn btn-primary"><Check size={14} /> Salva</button>
                          <button onClick={() => setEditingCategory(null)} className="btn btn-secondary"><X size={14} /> Annulla</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ fontWeight: '600', color: 'var(--primary)' }}>{cat.name}</h4>
                          {cat.description && <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{cat.description}</p>}
                        </div>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <button onClick={() => setEditingCategory(cat)} className="btn btn-secondary" style={{ padding: '0.5rem' }}><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteCategory(cat.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'archived' && (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {archivedDocs.length === 0 && <p style={{ color: 'var(--text-light)' }}>Nessun documento archiviato.</p>}
              {archivedDocs.map(doc => (
                <div key={doc.id} className="card" style={{ opacity: 0.7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1rem' }}>{doc.title}</h4>
                      <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{doc.file_name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button onClick={() => handleUnarchiveDoc(doc.id)} className="btn btn-success" style={{ padding: '0.5rem' }}><ArchiveRestore size={16} /></button>
                      <button onClick={() => handleDeleteDoc(doc.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODERATION */}
      {activeTab === 'moderation' && (
        <div>
          <div className="tabs">
            <button className={`tab ${activeSection === 'pending' ? 'active' : ''}`} onClick={() => setActiveSection('pending')}>In Attesa ({pendingPosts.length})</button>
            <button className={`tab ${activeSection === 'approved' ? 'active' : ''}`} onClick={() => setActiveSection('approved')}>Approvati ({approvedPosts.length})</button>
            <button className={`tab ${activeSection === 'archived' ? 'active' : ''}`} onClick={() => setActiveSection('archived')}><Archive size={14} /> Archiviati ({archivedPosts.length})</button>
          </div>

          {activeSection === 'pending' && (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {pendingPosts.length === 0 && <p style={{ color: 'var(--text-light)' }}>Nessun messaggio in attesa.</p>}
              {pendingPosts.map(post => (
                <div key={post.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      {post.profiles ? `${post.profiles.first_name} ${post.profiles.last_name}` : 'Utente'} {post.is_anonymous && '(Anonimo)'}
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.9rem' }}>{post.content}</p>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{new Date(post.date).toLocaleString('it-IT')}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button onClick={() => handleModeration(post.id, 'approved')} className="btn btn-success" style={{ padding: '0.5rem' }}><Check size={18} /></button>
                    <button onClick={() => handleModeration(post.id, 'rejected')} className="btn btn-danger" style={{ padding: '0.5rem' }}><X size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'approved' && (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {approvedPosts.length === 0 && <p style={{ color: 'var(--text-light)' }}>Nessun messaggio approvato.</p>}
              {approvedPosts.map(post => (
                <div key={post.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                      {post.is_anonymous ? 'Anonimo' : (post.profiles ? `${post.profiles.first_name} ${post.profiles.last_name}` : 'Utente')}
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.9rem' }}>{post.content}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button onClick={() => handleArchivePost(post.id)} className="btn btn-warning" style={{ padding: '0.5rem' }}><Archive size={16} /></button>
                    <button onClick={() => handleDeletePost(post.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'archived' && (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {archivedPosts.length === 0 && <p style={{ color: 'var(--text-light)' }}>Nessun messaggio archiviato.</p>}
              {archivedPosts.map(post => (
                <div key={post.id} className="card" style={{ opacity: 0.7, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#475569', fontSize: '0.9rem' }}>{post.content}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button onClick={() => handleUnarchivePost(post.id)} className="btn btn-success" style={{ padding: '0.5rem' }}><ArchiveRestore size={16} /></button>
                    <button onClick={() => handleDeletePost(post.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* USERS */}
      {activeTab === 'users' && (
        <div>
          <div className="tabs">
            <button className={`tab ${activeUserSection === 'approved' ? 'active' : ''}`} onClick={() => setActiveUserSection('approved')}>Registrati</button>
            <button className={`tab ${activeUserSection === 'pending' ? 'active' : ''}`} onClick={() => setActiveUserSection('pending')}>Richieste ({pendingUsers.length})</button>
            <button className={`tab ${activeUserSection === 'create' ? 'active' : ''}`} onClick={() => setActiveUserSection('create')}><Plus size={14} /> Nuovo</button>
          </div>

          {activeUserSection === 'create' && (
            <div className="card" style={{ maxWidth: '600px' }}>
              <h3 style={{ marginBottom: '1.25rem', fontWeight: '700' }}>Crea Nuovo Utente</h3>
              <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
                <div>
                  <p style={{ fontSize: '0.85rem' }}>Username generato come <strong>nome.cognome</strong>. Password predefinita: <strong>Tecnor@2026</strong></p>
                </div>
              </div>
              <form onSubmit={handleCreateUser}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}>Nome</label>
                    <input type="text" className="input-field" value={newUserFirstName} onChange={(e) => setNewUserFirstName(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}>Cognome</label>
                    <input type="text" className="input-field" value={newUserLastName} onChange={(e) => setNewUserLastName(e.target.value)} required />
                  </div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}>Ruolo</label>
                  <select className="input-field" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
                    <option value="employee">Dipendente</option>
                    <option value="admin">Amministratore</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Crea Utente</button>
              </form>
            </div>
          )}

          {activeUserSection === 'pending' && (
            <div>
              {pendingUsers.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <UserCheck size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                  <p style={{ color: 'var(--text-light)' }}>Nessuna richiesta in attesa.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {pendingUsers.map(u => (
                    <div key={u.id} className="card" style={{ borderLeft: '4px solid #3B82F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: '600' }}>{u.first_name} {u.last_name}</h4>
                        <p style={{ color: '#64748B', fontSize: '0.85rem' }}>{u.username}</p>
                        <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{new Date(u.created_at).toLocaleDateString('it-IT')}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <button onClick={() => handleApproveUser(u.id)} className="btn btn-success"><Check size={16} /> Approva</button>
                        <button onClick={() => handleRejectUser(u.id)} className="btn btn-danger"><X size={16} /> Rifiuta</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeUserSection === 'approved' && (
            <div>
              {approvedUsers.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-light)' }}>Nessun utente registrato.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Utente</th>
                        <th>Video Completati</th>
                        <th>Ruolo</th>
                        <th style={{ textAlign: 'right' }}>Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedUsers.map(u => (
                        <tr key={u.id}>
                          <td>
                            <div style={{ fontWeight: '600' }}>{u.first_name} {u.last_name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{u.username}</div>
                            {u.reset_requested && <span className="badge badge-warning" style={{ marginTop: '0.25rem' }}>Reset Richiesto</span>}
                          </td>
                          <td><span className="badge badge-primary">{u.level || 0}</span></td>
                          <td>
                            <select
                              value={u.role}
                              onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                              style={{
                                background: u.role === 'admin' ? '#E0E7FF' : '#F1F5F9',
                                color: u.role === 'admin' ? '#4338CA' : '#475569',
                                padding: '0.25rem 0.5rem', borderRadius: '0.375rem',
                                fontSize: '0.75rem', fontWeight: '600', border: 'none', cursor: 'pointer'
                              }}
                            >
                              <option value="employee">Dipendente</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                              <button onClick={() => handleResetPassword(u.id)} className="btn btn-danger" style={{ padding: '0.375rem 0.625rem', fontSize: '0.8rem' }}>
                                <Lock size={14} /> Reset
                              </button>
                              <button onClick={() => handleDeleteUser(u.id)} className="btn btn-danger" style={{ padding: '0.375rem 0.625rem', fontSize: '0.8rem' }}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TRAINING */}
      {activeTab === 'training' && (
        <div>
          <div className="card" style={{ maxWidth: '800px', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', fontWeight: '700' }}>Carica Video Formativo</h3>
            <form onSubmit={handleUploadVideo}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}>Titolo</label>
                <input type="text" className="input-field" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}>Sottotitolo</label>
                <input type="text" className="input-field" value={videoSubtitle} onChange={(e) => setVideoSubtitle(e.target.value)} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}>Descrizione</label>
                <textarea className="input-field" rows="3" value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}>File Video</label>
                <input type="file" accept="video/*" className="input-field" onChange={(e) => setVideoFile(e.target.files[0])} required />
              </div>
              <button type="submit" className="btn btn-primary"><Upload size={16} /> Carica Video</button>
            </form>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Video Caricati ({videosList.length})</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {videosList.length === 0 && <p style={{ color: 'var(--text-light)' }}>Nessun video caricato.</p>}
            {videosList.map(video => (
              <div key={video.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: '600' }}>{video.title}</h4>
                    <p style={{ color: '#64748B', fontSize: '0.85rem' }}>{video.subtitle}</p>
                    <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{new Date(video.created_at).toLocaleDateString('it-IT')} - {video.file_name}</span>
                  </div>
                  <button onClick={() => handleDeleteVideo(video.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin

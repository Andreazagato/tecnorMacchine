import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { FileText, Download, Filter, FolderOpen } from 'lucide-react'

const Documents = () => {
  const [documents, setDocuments] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchDocuments()
  }, [selectedCategory])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
  }

  const fetchDocuments = async () => {
    let query = supabase
      .from('documents')
      .select('*, categories:category_id(name)')
      .eq('archived', false)
      .order('date', { ascending: false })

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory)
    }

    const { data } = await query
    setDocuments(data || [])
    setLoading(false)
  }

  const handleDownload = async (filePath, fileName) => {
    const { data } = supabase.storage.from('documents').getPublicUrl(filePath)
    if (data?.publicUrl) {
      window.open(data.publicUrl, '_blank')
    }
  }

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase()
    const colors = {
      pdf: '#EF4444',
      doc: '#2563EB', docx: '#2563EB',
      xls: '#16A34A', xlsx: '#16A34A',
      ppt: '#EA580C', pptx: '#EA580C',
      jpg: '#8B5CF6', png: '#8B5CF6', jpeg: '#8B5CF6',
    }
    return colors[ext] || 'var(--primary)'
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
          background: 'var(--gradient-cool)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <FileText size={20} color="white" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Documenti Aziendali</h2>
      </div>

      {categories.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontWeight: '500', color: 'var(--text-light)', fontSize: '0.85rem' }}>Filtra per categoria:</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              className={`tab ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              Tutte
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {documents.map((doc) => (
          <div key={doc.id} className="card card-interactive" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
          }}>
            <div style={{
              width: '56px', height: '56px',
              background: `${getFileIcon(doc.file_name)}15`,
              borderRadius: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <FileText size={28} color={getFileIcon(doc.file_name)} />
            </div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>{doc.title}</h3>

            {doc.categories && (
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                {doc.categories.name}
              </span>
            )}

            {doc.description && (
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.75rem', textAlign: 'left', width: '100%', lineHeight: '1.5' }}>
                {doc.description}
              </p>
            )}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {new Date(doc.date).toLocaleDateString('it-IT')}
            </p>

            <button
              onClick={() => handleDownload(doc.file_path, doc.file_name)}
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: 'auto' }}
            >
              <Download size={16} /> Scarica
            </button>
          </div>
        ))}

        {documents.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
            <FolderOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-light)' }}>
              {selectedCategory ? 'Nessun documento in questa categoria.' : 'Nessun documento disponibile.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Documents

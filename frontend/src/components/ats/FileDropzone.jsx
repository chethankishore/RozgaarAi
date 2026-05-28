import { useRef, useState } from 'react'

export default function FileDropzone({ onFileSelect }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState(null)

  function handleFile(file) {
    if (!file) return
    const allowed = ['application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(file.type)) {
      alert('Only PDF or DOC/DOCX files allowed')
      return
    }
    setFileName(file.name)
    onFileSelect(file)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div
      className={`dropzone ${dragging ? 'dragover' : ''}`}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
      />

      {/* upload icon */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
        style={{ margin: '0 auto var(--space-3)' }}>
        <rect width="36" height="36" rx="10"
          fill="var(--color-primary-subtle)" />
        <path d="M18 22V14M15 17l3-3 3 3"
          stroke="var(--color-primary)" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 26h12"
          stroke="var(--color-primary)" strokeWidth="1.5"
          strokeLinecap="round" opacity=".4" />
      </svg>

      {fileName ? (
        <p style={{
          fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
          color: 'var(--color-primary)'
        }}>
          {fileName}
        </p>
      ) : (
        <>
          <p style={{
            fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
            color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)'
          }}>
            Drag & drop your resume here
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
            PDF or DOC · max 5MB
          </p>
        </>
      )}
    </div>
  )
}
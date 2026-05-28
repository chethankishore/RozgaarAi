import { useState } from 'react'

export default function LinkedInImport({ onImport }) {
  const [url, setUrl] = useState('')

  return (
    <div style={{
      background: 'var(--color-bg-surface-2)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-8)',
      textAlign: 'center',
    }}>
      <p style={{
        fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
        color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)'
      }}>
        Paste your LinkedIn profile URL
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <input
          className="input"
          placeholder="https://linkedin.com/in/yourname"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onImport(url)}
          disabled={!url.trim()}
        >
          Import
        </button>
      </div>
      <p style={{
        fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)',
        marginTop: 'var(--space-3)'
      }}>
        Or upload your LinkedIn PDF export below
      </p>
    </div>
  )
}
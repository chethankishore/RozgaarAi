export default function SourceToggle({ active, onChange }) {
  return (
    <div className="toggle-group">
      <button
        className={`toggle-btn ${active === 'upload' ? 'active' : ''}`}
        onClick={() => onChange('upload')}
      >
        Upload resume
      </button>
      <button
        className={`toggle-btn ${active === 'linkedin' ? 'active' : ''}`}
        onClick={() => onChange('linkedin')}
      >
        LinkedIn import
      </button>
    </div>
  )
}
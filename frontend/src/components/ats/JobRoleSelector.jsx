const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Data Analyst', 'Data Scientist', 'Product Manager',
  'UX Designer', 'DevOps Engineer', 'Full Stack Developer',
]

export default function JobRoleSelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <label style={{
        fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
        color: 'var(--color-text-secondary)', whiteSpace: 'nowrap'
      }}>
        Target role
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          height: 40, padding: '0 var(--space-4)',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--color-text-primary)',
          background: 'var(--color-bg-surface-2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)', outline: 'none',
          cursor: 'pointer',
        }}
      >
        <option value="">Select a role</option>
        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
    </div>
  )
}
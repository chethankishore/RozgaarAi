const TABS = ['All', 'Technical', 'Behavioural', 'Gap-based']

export default function CategoryTabs({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      {TABS.map(tab => (
        <button key={tab}
          onClick={() => onChange(tab)}
          style={{
            padding: '6px 16px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-medium)',
            borderRadius: 'var(--radius-full)',
            border: 'none', cursor: 'pointer',
            background: active === tab
              ? 'var(--color-primary)'
              : 'var(--color-primary-subtle)',
            color: active === tab ? '#fff' : 'var(--color-primary)',
            transition: 'background var(--transition-fast)',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
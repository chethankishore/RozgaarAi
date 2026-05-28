export default function EmptyState({ title = 'Nothing here yet', description = '' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 'var(--space-16)',
      textAlign: 'center', gap: 'var(--space-3)'
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 'var(--radius-lg)',
        background: 'var(--color-primary-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 'var(--space-2)'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="6" height="8" rx="1.5" stroke="var(--color-primary)" strokeWidth="1.5"/>
          <rect x="14" y="4" width="6" height="5" rx="1.5" stroke="var(--color-primary)" strokeWidth="1.5" opacity=".6"/>
          <rect x="4" y="16" width="16" height="2" rx="1" fill="var(--color-primary)" opacity=".3"/>
          <rect x="4" y="20" width="10" height="2" rx="1" fill="var(--color-primary)" opacity=".2"/>
        </svg>
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-md)', color: 'var(--color-text-primary)' }}>
        {title}
      </p>
      {description && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: 280, lineHeight: 'var(--line-normal)' }}>
          {description}
        </p>
      )}
    </div>
  )
}
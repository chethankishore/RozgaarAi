const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="var(--color-primary)" strokeWidth="1.5"/>
        <path d="M9 6v3.5l2 1.5" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    iconBg:  'var(--color-primary-subtle)',
    title:   'Instant ATS score',
    desc:    "Know exactly how recruiters' systems rank your resume before you apply.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 9h10M10 5l4 4-4 4" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    iconBg:  'var(--color-success-bg)',
    title:   'AI-powered rewrites',
    desc:    'Get specific, actionable rewrites for every weak section of your resume.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="3" width="5" height="5" rx="1" stroke="var(--color-warning)" strokeWidth="1.5"/>
        <rect x="10" y="3" width="5" height="5" rx="1" stroke="var(--color-warning)" strokeWidth="1.5" opacity=".5"/>
        <rect x="3" y="10" width="12" height="1.5" rx=".75" fill="var(--color-warning)" opacity=".4"/>
        <rect x="3" y="13" width="8" height="1.5" rx=".75" fill="var(--color-warning)" opacity=".3"/>
      </svg>
    ),
    iconBg:  'var(--color-warning-bg)',
    title:   'Job description match',
    desc:    'Paste any JD and see exactly which keywords your resume is missing.',
  },
]

export default function FeaturePills() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      borderTop:    '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)',
    }}>
      {FEATURES.map((f, i) => (
        <div key={f.title} style={{
          padding: 'var(--space-6) var(--space-8)',
          display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start',
          borderRight: i < 2 ? '1px solid var(--color-border)' : 'none',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: f.iconBg, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {f.icon}
          </div>
          <div>
            <div style={{
              fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
              fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-1)',
            }}>
              {f.title}
            </div>
            <div style={{
              fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)',
              lineHeight: 'var(--line-normal)',
            }}>
              {f.desc}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
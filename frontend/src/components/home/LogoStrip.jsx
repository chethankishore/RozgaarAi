const LOGOS = ['ASUS','AECOM','Stripe','Nike','eBay','Intel']

export default function LogoStrip() {
  return (
    <div style={{
      padding: 'var(--space-6) var(--container-pad)',
      borderTop: '1px solid var(--color-border)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
    }}>
      {LOGOS.map(l => (
        <span key={l} style={{
          fontFamily:     'var(--font-display)',
          fontSize:       'var(--text-xs)',
          fontWeight:     'var(--weight-bold)',
          color:          'var(--color-primary-muted)',
          textTransform:  'uppercase',
          letterSpacing:  '0.06em',
        }}>
          {l}
        </span>
      ))}
    </div>
  )
}
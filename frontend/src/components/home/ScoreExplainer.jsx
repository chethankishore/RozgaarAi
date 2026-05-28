const BLOCKS = [
  {
    pct:   '75+',
    label: 'Strong score',
    desc:  "Your resume will likely pass ATS filters and reach a human recruiter. You're in a strong position — keep optimizing for the specific role.",
    bg:    'var(--color-success-bg)',
    color: 'var(--color-success)',
  },
  {
    pct:   '50–74',
    label: 'Fair score',
    desc:  "You're on the borderline. A few targeted improvements can push you into the strong zone quickly.",
    bg:    'var(--color-warning-bg)',
    color: 'var(--color-warning)',
  },
  {
    pct:   'Below 50',
    label: 'Needs work',
    desc:  "Most ATS systems will filter you out. Our AI suggestions identify and fix the biggest issues first.",
    bg:    'var(--color-danger-bg)',
    color: 'var(--color-danger)',
  },
]

export default function ScoreExplainer() {
  return (
    <div style={{ padding: 'var(--space-16) var(--container-pad)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <div className="badge badge-purple" style={{ marginBottom: 'var(--space-3)' }}>
            Understanding your score
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)',
          }}>
            What does an ATS score mean?
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: 480, margin: '0 auto' }}>
            Applicant tracking systems filter resumes before a human ever sees them. Here's what your score tells you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-5)' }}>
          {BLOCKS.map(b => (
            <div key={b.label} style={{
              background: b.bg, borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--weight-black)', color: b.color,
                marginBottom: 'var(--space-2)',
              }}>
                {b.pct}
              </div>
              <div style={{
                fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
                color: b.color, marginBottom: 'var(--space-3)',
              }}>
                {b.label}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-normal)' }}>
                {b.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
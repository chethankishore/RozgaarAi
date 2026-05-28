import { useNavigate } from 'react-router'

export default function QuickTips() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#fff', padding: 'var(--space-16) var(--container-pad)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <div className="badge badge-purple" style={{ marginBottom: 'var(--space-3)' }}>
          Improve faster
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-8)',
        }}>
          Quick ways to boost your score
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>

          {/* Purple card */}
          <div className="card card-purple" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', color: '#fff' }}>
              Match your resume to the JD
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.8)', lineHeight: 'var(--line-normal)' }}>
              Paste the job description into our JD matcher. We highlight every missing keyword and show you where to add them naturally.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {['Docker','CI/CD'].map(k => (
                <span key={k} style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)' }}>{k}</span>
              ))}
              <span style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.35)', color: '#fff', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)' }}>
                + Add skills
              </span>
            </div>
          </div>

          {/* Action keywords */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
              Use strong action keywords
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-normal)' }}>
              Words like "engineered", "led", "reduced" score better than "worked on". Our AI rewrites every weak bullet instantly.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <span className="badge keyword-pill-present">Engineered</span>
              <span className="badge keyword-pill-present">Reduced by 35%</span>
              <span className="badge keyword-pill-missing">Worked on</span>
            </div>
          </div>

          {/* Sections */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
              Fill every standard section
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-normal)' }}>
              ATS systems look for Education, Experience, Skills, and Summary. Missing even one can drop your score by 15–20 points.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[
                { label: 'Work experience', ok: true  },
                { label: 'Education',       ok: true  },
                { label: 'Skills section',  ok: false },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: s.ok ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  <span>{s.ok ? '✓' : '✗'}</span>
                  <span style={{ color: s.ok ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {s.label} {!s.ok && '— missing'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interview prep */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
              Prep for the interview too
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-normal)' }}>
              Once your resume is strong, practice with our AI interview prep. Role-specific questions, a live timer, and self-analysis tips.
            </div>
            <div
              onClick={() => navigate('/interview')}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-primary-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-dark)', fontWeight: 'var(--weight-medium)' }}>
                Go to interview prep
              </span>
              <span style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
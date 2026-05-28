import { useState } from 'react'

const STEPS = [
  {
    title: 'Upload your resume',
    desc:  'Drop your PDF or DOC file — or import from your LinkedIn profile. We parse it instantly with no data stored.',
    visual: <UploadVisual />,
  },
  {
    title: 'Get your ATS score',
    desc:  'See your real ATS score broken down by keyword match, section completeness, and formatting — just like employers\' systems.',
    visual: <ScoreVisual />,
  },
  {
    title: 'Add a job description',
    desc:  'Paste the JD for the role you want. We compare it against your resume and highlight every missing keyword and skill gap.',
    visual: <JDVisual />,
  },
  {
    title: 'Apply AI suggestions',
    desc:  'One-click rewrites for weak bullet points, missing sections, and formatting issues. Download your improved resume instantly.',
    visual: <SuggestVisual />,
  },
]

export default function HowItWorks() {
  const [active, setActive] = useState(0)

  return (
    <div style={{ background: '#fff', padding: 'var(--space-16) var(--container-pad)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <div className="badge badge-purple" style={{ marginBottom: 'var(--space-3)' }}>
            How it works
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)',
          }}>
            The free ATS resume rater
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Four simple steps. No sign-up needed to get your score.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'start' }}>

          {/* Steps list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {STEPS.map((step, i) => (
              <button
                key={step.title}
                onClick={() => setActive(i)}
                style={{
                  display: 'flex', alignItems: 'flex-start',
                  gap: 'var(--space-4)', padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                  border: 'none', textAlign: 'left', width: '100%',
                  background: active === i ? 'var(--color-bg-surface)' : 'transparent',
                  boxShadow: active === i ? 'var(--shadow-card)' : 'none',
                  transition: 'background var(--transition-base), box-shadow var(--transition-base)',
                }}
              >
                {/* Number */}
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-bold)',
                  background: active === i ? 'var(--color-primary)' : 'var(--color-primary-subtle)',
                  color:      active === i ? '#fff'                  : 'var(--color-primary)',
                  transition: 'background var(--transition-base), color var(--transition-base)',
                }}>
                  {i + 1}
                </div>

                <div>
                  <div style={{
                    fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
                    fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)',
                    marginBottom: active === i ? 'var(--space-2)' : 0,
                  }}>
                    {step.title}
                  </div>
                  {active === i && (
                    <div style={{
                      fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)',
                      lineHeight: 'var(--line-normal)',
                    }}>
                      {step.desc}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Visual panel */}
          <div style={{
            background: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8)',
            boxShadow: 'var(--shadow-lg)',
            minHeight: 300,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'sticky', top: 'calc(var(--navbar-height) + 16px)',
          }}>
            {STEPS[active].visual}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Visuals ────────────────────────────────────────────────

function UploadVisual() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', width: '100%', maxWidth: 240 }}>
      <div className="dropzone" style={{ width: '100%', padding: 'var(--space-8)', cursor: 'default' }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto var(--space-3)' }}>
          <rect width="36" height="36" rx="10" fill="var(--color-primary-subtle)"/>
          <path d="M18 24v-9M15 18l3-3 3 3" stroke="var(--color-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 27h12" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
        </svg>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)', textAlign: 'center' }}>
          Drop resume here
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
          PDF · DOC · LinkedIn
        </p>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        {['PDF','DOC','LinkedIn'].map(t => (
          <span key={t} className="badge badge-purple">{t}</span>
        ))}
      </div>
      <div style={{
        width: '100%', padding: 'var(--space-3) var(--space-4)',
        background: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="var(--color-success)" strokeWidth="1.2"/>
          <path d="M4.5 7l2 2 3-3" stroke="var(--color-success)" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
          resume_final_v3.pdf uploaded
        </span>
      </div>
    </div>
  )
}

function ScoreVisual() {
  const bars = [
    { label: 'Keyword match',        pct: 82, color: 'var(--color-primary)' },
    { label: 'Section completeness', pct: 90, color: 'var(--color-success)'  },
    { label: 'Formatting',           pct: 60, color: 'var(--color-warning)'  },
  ]
  return (
    <div style={{ width: '100%', maxWidth: 240 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
        padding: 'var(--space-4)', background: 'var(--color-bg-surface-2)',
        borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)',
      }}>
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="22" fill="none" stroke="var(--color-accent-light)" strokeWidth="5"/>
          <circle cx="28" cy="28" r="22" fill="none" stroke="var(--color-primary)" strokeWidth="5"
            strokeDasharray="92 46" strokeDashoffset="23" strokeLinecap="round"/>
          <text x="28" y="32" textAnchor="middle" fontFamily="var(--font-display)" fontSize="14" fontWeight="800" fill="var(--color-text-primary)">78</text>
        </svg>
        <div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>ATS Score</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>Good · above average</div>
        </div>
      </div>
      {bars.map(b => (
        <div key={b.label} style={{ marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
            <span>{b.label}</span><span>{b.pct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${b.pct}%`, background: b.color }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function JDVisual() {
  return (
    <div style={{ width: '100%', maxWidth: 240 }}>
      <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
        JD keyword analysis
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        {[
          { word: 'React',      status: 'present' },
          { word: 'Node.js',    status: 'present' },
          { word: 'TypeScript', status: 'present' },
          { word: 'Docker',     status: 'missing' },
          { word: 'Kubernetes', status: 'missing' },
          { word: 'CI/CD',      status: 'missing' },
          { word: 'REST API',   status: 'present' },
          { word: 'GraphQL',    status: 'partial' },
        ].map(k => (
          <span key={k.word} className={`badge keyword-pill-${k.status}`}>{k.word}</span>
        ))}
      </div>
      <div style={{
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--color-danger-bg)', borderRadius: 'var(--radius-md)',
      }}>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--color-danger)', marginBottom: 'var(--space-1)' }}>
          3 missing keywords
        </div>
        <div style={{ fontSize: 10, color: 'var(--color-danger)', lineHeight: 'var(--line-normal)' }}>
          Add Docker, Kubernetes, CI/CD to pass this JD's ATS filter
        </div>
      </div>
    </div>
  )
}

function SuggestVisual() {
  return (
    <div style={{ width: '100%', maxWidth: 240 }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--space-3)' }}>
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--color-bg-surface-2)',
          borderBottom: '1px solid var(--color-border-surface)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ padding: '2px 8px', background: '#FCE4D6', color: '#712B13', borderRadius: 'var(--radius-full)', fontSize: 10 }}>Improve</span>
          <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>Experience</span>
        </div>
        <div style={{ padding: 'var(--space-3) var(--space-4)' }}>
          <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>Before</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', background: 'var(--color-bg-surface-2)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            "Worked on backend features"
          </p>
          <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>After</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', background: 'var(--color-success-bg)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2)' }}>
            "Built 4 REST APIs in Node.js, cutting response time by 35%"
          </p>
        </div>
      </div>
      <button className="btn btn-primary" style={{ width: '100%' }}>
        Apply all &amp; download
      </button>
    </div>
  )
}
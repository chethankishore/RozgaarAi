import { useNavigate } from 'react-router'

export default function HeroSection() {
  const navigate = useNavigate()

  const btnBase = {
    display:      'inline-flex',
    alignItems:   'center',
    borderRadius: '999px',
    border:       'none',
    cursor:       'pointer',
    fontFamily:   'var(--font-body)',
    fontWeight:   500,
    fontSize:     '15px',
    padding:      '12px 28px',
    transition:   'opacity 0.2s',
  }

  return (
    <section style={{
      background: 'radial-gradient(ellipse 80% 55% at 50% -5%, #DDD9FF 0%, transparent 70%), radial-gradient(ellipse 40% 80% at -5% 60%, #DDD9FF 0%, transparent 55%), radial-gradient(ellipse 40% 80% at 105% 60%, #DDD9FF 0%, transparent 55%)',
    }}>
      <div style={{
        maxWidth:            1200,
        margin:              '0 auto',
        padding:             '52px 48px 44px',
        display:             'grid',
        gridTemplateColumns: '1fr 1fr',
        gap:                 24,
        alignItems:          'center',
      }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          <span style={{
            display:      'inline-block',
            width:        'fit-content',
            padding:      '4px 14px',
            background:   '#EEEEFF',
            borderRadius: '999px',
            fontSize:     11,
            fontWeight:   500,
            color:        '#4B44CC',
            marginBottom: 20,
          }}>
            AI-powered resume analysis
          </span>

          <h1 style={{
            fontFamily:    'var(--font-display)',
            fontSize:      'clamp(36px, 5vw, 60px)',
            fontWeight:    800,
            lineHeight:    1.08,
            color:         '#1A1A2E',
            letterSpacing: '-1.5px',
            marginBottom:  16,
          }}>
            Resume<br />
            <span style={{ color: '#6C63FF' }}>Analyzer</span>
          </h1>

          <p style={{
            fontSize:     15,
            color:        '#5A5A7A',
            lineHeight:   1.75,
            maxWidth:     340,
            marginBottom: 24,
          }}>
            Transform your résumé into a job-winning document. Get instant ATS scores,
            skill gap insights, and interview prep — all in one place.
          </p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
            <button
              style={{ ...btnBase, background: '#1A1A2E', color: '#fff' }}
              onClick={() => navigate('/ats')}
            >
              Check my ATS score
            </button>
            
          </div>

          
                
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}>
          <ScoreCardPreview />
          <BottomCards />
        </div>

      </div>
    </section>
  )
}

function ScoreCardPreview() {
  const bars = [
    { label: 'Resume structure', pct: 75, color: '#6C63FF' },
    { label: 'Keyword match',    pct: 88, color: '#3B82F6' },
    { label: 'Formatting',       pct: 54, color: '#F59E0B' },
  ]

  return (
    <div style={{
      width:        256,
      background:   '#fff',
      borderRadius: 16,
      border:       '1px solid rgba(108,99,255,0.12)',
      boxShadow:    '0 4px 24px rgba(108,99,255,0.12)',
      padding:      24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <svg width="110" height="82" viewBox="0 0 110 82">
          <path d="M15 77 A45 45 0 1 1 95 77" fill="none" stroke="#D6D3FF" strokeWidth="8" strokeLinecap="round"/>
          <path d="M15 77 A45 45 0 1 1 95 77" fill="none" stroke="#6C63FF" strokeWidth="8" strokeLinecap="round" strokeDasharray="141 165"/>
          <text x="55" y="64" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="22" fontWeight="800" fill="#1A1A2E">89%</text>
          <text x="55" y="77" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="9" fill="#9999BB">Overall Score</text>
        </svg>
      </div>
      {bars.map(b => (
        <div key={b.label} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#5A5A7A', marginBottom: 4 }}>
            <span>{b.label}</span><span>{b.pct}%</span>
          </div>
          <div style={{ height: 5, background: '#EEEEFF', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${b.pct}%`, height: '100%', background: b.color, borderRadius: 999 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function BottomCards() {
  return (
    <div style={{ display: 'flex', gap: 12, width: 256 }}>

      {/* User success */}
      <div style={{ flex: 1, background: '#EEEEFF', borderRadius: 16, padding: 16 }}>
        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 11, fontWeight: 600, color: '#6C63FF', marginBottom: 8 }}>
          User Success
        </div>
        <div style={{ display: 'flex', marginBottom: 6 }}>
          {[
            { l: 'R', bg: '#6C63FF'  },
            { l: 'S', bg: '#A89CF7'  },
            { l: 'K', bg: '#4B44CC'  },
          ].map(({ l, bg }) => (
            <div key={l} style={{
              width: 22, height: 22, borderRadius: '50%',
              background: bg, border: '2px solid #EEEEFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, fontWeight: 700, color: '#fff', marginRight: -5,
            }}>
              {l}
            </div>
          ))}
        </div>
        <div style={{ background: '#6C63FF', color: '#fff', borderRadius: 999, fontSize: 9, padding: '2px 8px', display: 'inline-block' }}>
          10k+ users
        </div>
      </div>

      {/* Chart card */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #6C63FF 0%, #9B8FF8 100%)',
        borderRadius: 16, padding: 16,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 999, fontSize: 9, color: '#fff', padding: '2px 8px', display: 'inline-block', marginBottom: 8, fontFamily: 'Sora, sans-serif', fontWeight: 600 }}>
          Score boost
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 44 }}>
          {[18, 28, 22, 42, 30, 35, 20].map((h, i) => (
            <div key={i} style={{
              height: h, width: 10,
              borderRadius: '3px 3px 0 0',
              background: h === 42 ? '#fff' : 'rgba(255,255,255,0.35)',
            }} />
          ))}
        </div>
      </div>

    </div>
  )
}
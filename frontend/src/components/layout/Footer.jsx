// src/components/layout/Footer.jsx
import { useNavigate } from 'react-router'

const YEAR = new Date().getFullYear()

const LINKS = {
  Product: [
    { label: 'Check ATS Score',    to: '/ats'       },
    { label: 'Interview Prep',     to: '/interview'  },
    { label: 'Dashboard',          to: '/dashboard'  },
    { label: 'LinkedIn Import',    to: '/ats'        },
    { label: 'JD Matcher',         to: '/ats'        },
  ],
  Resources: [
    { label: 'How ATS works',      to: '/'           },
    { label: 'Resume tips',        to: '/'           },
    { label: 'Interview guide',    to: '/interview'  },
    { label: 'Skill gap analysis', to: '/ats'        },
  ],
  Company: [
    { label: 'About this project', to: '/'           },
    { label: 'GitHub',             href: 'https://github.com' },
    { label: 'Privacy policy',     to: '/'           },
    { label: 'Terms of use',       to: '/'           },
  ],
}

const TEAM = [
  { initials: 'FE', role: 'Frontend Dev 1',   color: '#6C63FF', bg: '#EEEEFF'  },
  { initials: 'FE', role: 'Frontend Dev 2',   color: '#0F6E56', bg: '#E1F5EE'  },
  { initials: 'BE', role: 'Backend Dev 1',    color: '#854F0B', bg: '#FAEEDA'  },
  { initials: 'BE', role: 'Backend Dev 2',    color: '#993C1D', bg: '#FAECE7'  },
  { initials: 'IN', role: 'Integration Dev',  color: '#534AB7', bg: '#EEEDFE'  },
]

const TECH = [
  'React', 'Tailwind CSS', 'Node.js', 'Express',
  'MongoDB', 'GoogleAI API', 'JWT Auth', 'Cloudinary',
]

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer style={{
      background:  '#1A1A2E',
      color:       '#fff',
      paddingTop:  48,
    }}>

      {/* ── Top band ── */}
      <div style={{
        maxWidth:     1200,
        margin:       '0 auto',
        padding:      '0 48px 48px',
        display:      'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap:          40,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>

        {/* Brand column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: '#6C63FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="8" rx="1.5" stroke="#fff" strokeWidth="1.3"/>
                <rect x="10" y="2" width="6" height="5" rx="1.5" stroke="#fff" strokeWidth="1.3" opacity=".6"/>
                <rect x="2" y="12" width="14" height="2" rx="1" fill="#fff" opacity=".4"/>
                <rect x="2" y="15" width="9" height="1.5" rx=".75" fill="#fff" opacity=".3"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 18 }}>
              RozgaarAI
            </span>
          </div>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>
            An AI-powered resume analyzer built as a full-stack training project.
            Designed to demonstrate real-world product development skills.
          </p>

          {/* Project badge */}
          

          {/* Tech stack pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {TECH.map(t => (
              <span key={t} style={{
                padding:      '3px 10px',
                background:   'rgba(255,255,255,0.06)',
                border:       '1px solid rgba(255,255,255,0.1)',
                borderRadius: 999,
                fontSize:     11,
                color:        'rgba(255,255,255,0.6)',
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([heading, links]) => (
          <div key={heading}>
            <div style={{
              fontSize:      11,
              fontWeight:    600,
              color:         'rgba(255,255,255,0.35)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom:  16,
            }}>
              {heading}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {links.map(link => (
                <span
                  key={link.label}
                  onClick={() => link.href ? window.open(link.href, '_blank') : navigate(link.to)}
                  style={{
                    fontSize:   13,
                    color:      'rgba(255,255,255,0.5)',
                    cursor:     'pointer',
                    transition: 'color 0.15s',
                    width:      'fit-content',
                  }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
                >
                  {link.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      

      

      {/* ── Bottom bar ── */}
      <div style={{
        maxWidth:       1200,
        margin:         '0 auto',
        padding:        '20px 48px',
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        flexWrap:       'wrap',
        gap:            12,
      }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
          © {YEAR} RozgaarAI · Built for learning · Not affiliated with any company
        </span>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
              v1.0 · In development
            </span>
          </div>
        </div>
      </div>

    </footer>
  )
}
// src/components/layout/Navbar.jsx
import { Link, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()

  const navLinks = [
    { label: 'Home',          to: '/' },
    { label: 'Check ATS',     to: '/ats' },
    { label: 'Interview Prep',to: '/interview' },
  ]

  return (
    <nav style={{
      position:        'sticky',
      top:             0,
      zIndex:          100,
      height:          'var(--navbar-height)',
      background:      'rgba(244,243,255,0.85)',
      backdropFilter:  'blur(12px)',
      borderBottom:    '1px solid var(--color-border-surface)',
      display:         'flex',
      alignItems:      'center',
      paddingInline:   'var(--container-pad)',
    }}>
      <div style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        width:           '100%',
        maxWidth:        'var(--container-max)',
        margin:          '0 auto',
      }}>

        {/* Logo */}
        <Link to="/" style={{
          fontFamily:  'var(--font-display)',
          fontWeight:  'var(--weight-bold)',
          fontSize:    'var(--text-lg)',
          color:       'var(--color-text-primary)',
          textDecoration: 'none',
        }}>
          RozgaarAI
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              fontSize:       'var(--text-sm)',
              fontWeight:     pathname === link.to ? 'var(--weight-medium)' : 'var(--weight-regular)',
              color:          pathname === link.to ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              textDecoration: 'none',
              transition:     'color var(--transition-fast)',
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth area */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--color-primary-subtle)',
                border: '1.5px solid var(--color-primary-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-bold)',
                fontSize: 'var(--text-xs)', color: 'var(--color-primary)',
                textDecoration: 'none',
              }}>
                {user.name?.slice(0,2).toUpperCase() || 'U'}
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
                textDecoration: 'none',
              }}>
                Log in
              </Link>
              <Link to="/register" className="btn btn-dark btn-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
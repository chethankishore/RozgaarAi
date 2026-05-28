import ScoreRing from '../ui/ScoreRing'
import { scoreColor } from '../../utils/scoreColor'

export default function ScorePanel({ result }) {
  if (!result) return null

  const { atsScore, breakdown, keywords, jobRole } = result

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

      {/* Score ring + label */}
      <div className="card" style={{ textAlign: 'center' }}>
        <ScoreRing score={atsScore} size={130} />
        <p style={{
          marginTop: 'var(--space-3)',
          fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
          color: scoreColor(atsScore)
        }}>
          {atsScore >= 75 ? 'Great · above average'
           : atsScore >= 50 ? 'Fair · needs work'
           : 'Low · significant gaps'}
        </p>
        <p style={{
          fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)',
          marginTop: 'var(--space-1)'
        }}>
          {jobRole}
        </p>
      </div>

      {/* Breakdown bars */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <p style={{
          fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
          color: 'var(--color-text-primary)'
        }}>
          Score breakdown
        </p>
        {breakdown.map(item => (
          <div key={item.label}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-1)'
            }}>
              <span>{item.label}</span>
              <span>{item.value}%</span>
            </div>
            <div className="progress-track">
              <div
                className={`progress-fill ${
                  item.value >= 75 ? 'success' :
                  item.value >= 50 ? 'warning' : ''
                }`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Keyword pills */}
      <div className="card">
        <p style={{
          fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
          color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)'
        }}>
          JD keyword match
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {keywords.present.map(k => (
            <span key={k} className="badge keyword-pill-present">{k}</span>
          ))}
          {keywords.missing.map(k => (
            <span key={k} className="badge keyword-pill-missing">{k}</span>
          ))}
        </div>
        <p style={{
          fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)',
          marginTop: 'var(--space-3)'
        }}>
          Green = present · Red = missing from JD
        </p>
      </div>
    </div>
  )
}
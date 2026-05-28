export default function ScoreRing({ score = 0, size = 120 }) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)

  const color =
    score >= 75 ? 'var(--color-success)' :
    score >= 50 ? 'var(--color-warning)' :
                  'var(--color-danger)'

  return (
    <div className="score-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius}
          fill="none" stroke="var(--color-accent-light)"
          strokeWidth="8" />
        <circle cx="50" cy="50" r={radius}
          fill="none" stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="score-ring-label">
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-bold)', fontSize: size * 0.22, color: 'var(--color-text-primary)' }}>
          {Math.round(score)}
        </span>
      </div>
    </div>
  )
}
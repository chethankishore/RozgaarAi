import CountdownTimer from './CountdownTimer'
import toast from 'react-hot-toast'

const CATEGORY_STYLE = {
  Technical:   { bg: 'var(--color-info-bg)',    color: 'var(--color-info)'    },
  Behavioural: { bg: 'var(--color-success-bg)', color: 'var(--color-success)' },
  'Gap-based': { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
}

export default function QuestionCard({ question, index, total, onNext, onPrev, onSkip }) {
  if (!question) return null
  const style = CATEGORY_STYLE[question.category] || CATEGORY_STYLE.Technical

  return (
    <div className="card" style={{
      border: '2px solid var(--color-primary-muted)',
      display: 'flex', flexDirection: 'column', gap: 'var(--space-5)',
    }}>

      {/* Top meta row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          padding: '3px 12px', borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
          background: style.bg, color: style.color,
        }}>
          {question.category}
        </span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          Q {index + 1} of {total}
        </span>
      </div>

      {/* Question text */}
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)',
        color: 'var(--color-text-primary)', lineHeight: 'var(--line-snug)',
      }}>
        "{question.text}"
      </p>

      {/* Timer */}
      <CountdownTimer
        key={question.id}
        duration={120}
        onComplete={() => toast('Time up! Answer or skip to continue.', { icon: '⏱' })}
      />

      {/* Self-analysis tip */}
      <div style={{
        background: 'var(--color-warning-bg)',
        border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3) var(--space-4)',
      }}>
        <p style={{
          fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
          color: 'var(--color-warning)', marginBottom: 'var(--space-1)'
        }}>
          Self-analysis tip
        </p>
        <p style={{
          fontSize: 'var(--text-xs)', color: 'var(--color-warning)',
          lineHeight: 'var(--line-normal)',
        }}>
          {question.tip}
        </p>
      </div>

      {/* Navigation row — Prev | Skip | Next */}
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ flex: 1 }}
          onClick={onPrev}
          disabled={index === 0}
        >
          Previous
        </button>

        {/* ← new skip button */}
        <button
          className="btn btn-ghost btn-sm"
          style={{
            flex: 1,
            borderColor: 'var(--color-warning)',
            color: 'var(--color-warning)',
          }}
          onClick={onSkip}
        >
          Skip
        </button>

        <button
          className="btn btn-primary btn-sm"
          style={{ flex: 1 }}
          onClick={onNext}
          disabled={index === total - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}
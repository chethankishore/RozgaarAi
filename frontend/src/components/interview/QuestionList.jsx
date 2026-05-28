const CATEGORY_STYLE = {
  Technical:   { bg: 'var(--color-info-bg)',    color: 'var(--color-info)'    },
  Behavioural: { bg: 'var(--color-success-bg)', color: 'var(--color-success)' },
  'Gap-based': { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
}

export default function QuestionList({
  questions, currentIndex, doneIndexes, skippedIndexes = [], onSelect
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {questions.map((q, i) => {
        const isActive  = i === currentIndex
        const isDone    = doneIndexes.includes(i)
        const isSkipped = skippedIndexes.includes(i)
        const isLocked  = !isActive && !isDone && !isSkipped
        const style     = CATEGORY_STYLE[q.category]

        return (
          <button
            key={q.id}
            onClick={() => onSelect(i)}
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              padding:        'var(--space-3) var(--space-4)',
              background: isActive
                ? 'var(--color-primary-subtle)'
                : isSkipped
                ? 'var(--color-warning-bg)'
                : 'var(--color-bg-surface)',
              border: isActive
                ? '2px solid var(--color-primary)'
                : isSkipped
                ? '1px solid rgba(245,158,11,0.3)'
                : '1px solid var(--color-border-surface)',
              borderRadius: 'var(--radius-md)',
              cursor:       'pointer',
              textAlign:    'left',
              width:        '100%',
              transition:   'border var(--transition-fast), background var(--transition-fast)',
            }}
          >
            {/* Number circle */}
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 'var(--space-3)', flex: 1, minWidth: 0,
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: isActive
                  ? 'var(--color-primary)'
                  : isDone
                  ? 'var(--color-success)'
                  : isSkipped
                  ? 'var(--color-warning)'
                  : 'var(--color-bg-surface-2)',
                border: `1px solid ${
                  isActive  ? 'var(--color-primary)'
                  : isDone  ? 'var(--color-success)'
                  : isSkipped ? 'var(--color-warning)'
                  : 'var(--color-border)'
                }`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize:   'var(--text-xs)',
                fontWeight: 'var(--weight-bold)',
                color: isActive || isDone || isSkipped ? '#fff' : 'var(--color-text-tertiary)',
              }}>
                {isDone ? '✓' : isSkipped ? '↪' : i + 1}
              </span>

              {/* Question text */}
              <span style={{
                fontSize:     'var(--text-sm)',
                color: isActive
                  ? 'var(--color-text-primary)'
                  : isSkipped
                  ? 'var(--color-warning)'
                  : 'var(--color-text-secondary)',
                fontWeight: isActive
                  ? 'var(--weight-medium)'
                  : 'var(--weight-regular)',
                overflow:     'hidden',
                textOverflow: 'ellipsis',
                whiteSpace:   'nowrap',
                maxWidth:     180,
                filter:       isLocked ? 'blur(4px)' : 'none',
                userSelect:   isLocked ? 'none'      : 'auto',
                transition:   'filter 0.3s ease',
              }}>
                {isLocked ? `Question ${i + 1}` : q.text}
              </span>
            </div>

            {/* Status badge */}
            {isDone ? (
              <span style={{
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                fontSize: 10, flexShrink: 0,
                background: 'var(--color-success-bg)',
                color: 'var(--color-success)',
              }}>
                Answered
              </span>
            ) : isSkipped ? (
              <span style={{
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                fontSize: 10, flexShrink: 0,
                background: 'var(--color-warning-bg)',
                color: 'var(--color-warning)',
              }}>
                Skipped
              </span>
            ) : isActive ? (
              <span style={{
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                fontSize: 10, flexShrink: 0,
                background: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
              }}>
                Active
              </span>
            ) : isLocked ? (
              <span style={{
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                fontSize: 10, flexShrink: 0,
                background: 'var(--color-bg-surface-2)',
                color: 'var(--color-text-tertiary)',
              }}>
                Locked
              </span>
            ) : (
              <span style={{
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                fontSize: 10, flexShrink: 0,
                background: style.bg, color: style.color,
              }}>
                {q.category}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
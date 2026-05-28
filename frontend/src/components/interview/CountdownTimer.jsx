import { useEffect, useRef, useState } from 'react'

export default function CountdownTimer({ duration = 120, onComplete }) {
  const [timeLeft,  setTimeLeft]  = useState(duration)
  const [running,   setRunning]   = useState(false)
  const intervalRef = useRef(null)

  const radius        = 44
  const circumference = 2 * Math.PI * radius
  const offset        = circumference * (1 - timeLeft / duration)

  const color =
    timeLeft > duration * 0.5 ? 'var(--color-primary)'  :
    timeLeft > duration * 0.2 ? 'var(--color-warning)'  :
                                 'var(--color-danger)'

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            onComplete?.()
            return 0
          }
          return t - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  function start()  { if (timeLeft > 0) setRunning(true) }
  function pause()  { setRunning(false) }
  function reset()  { setRunning(false); setTimeLeft(duration) }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 'var(--space-4)',
    }}>
      {/* SVG ring */}
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius}
          fill="none" stroke="var(--color-accent-light)" strokeWidth="7" />
        <circle cx="50" cy="50" r={radius}
          fill="none" stroke={color}
          strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.4s ease' }}
        />
        <text x="50" y="46" textAnchor="middle"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18, fontWeight: 700,
            fill: 'var(--color-text-primary)',
          }}
        >
          {mins}:{secs}
        </text>
        <text x="50" y="60" textAnchor="middle"
          style={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }}
        >
          {running ? 'running' : timeLeft === 0 ? 'done' : 'paused'}
        </text>
      </svg>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        {!running ? (
          <button className="btn btn-primary btn-sm"
            onClick={start} disabled={timeLeft === 0}>
            {timeLeft === duration ? 'Start' : 'Resume'}
          </button>
        ) : (
          <button className="btn btn-secondary btn-sm" onClick={pause}>
            Pause
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  )
}
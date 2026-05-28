export default function Skeleton({ width = '100%', height = '16px', radius = 'var(--radius-sm)' }) {
  return (
    <div style={{
      width, height,
      borderRadius: radius,
      background: 'linear-gradient(90deg, var(--color-accent-light) 25%, var(--color-primary-subtle) 50%, var(--color-accent-light) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  )
}
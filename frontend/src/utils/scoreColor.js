// src/utils/scoreColor.js
export function scoreColor(score) {
  if (score >= 75) return 'var(--color-success)'
  if (score >= 50) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

export function scoreBadgeVariant(score) {
  if (score >= 75) return 'success'
  if (score >= 50) return 'warning'
  return 'danger'
}
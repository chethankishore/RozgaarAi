export default function Button({
  children, variant = 'primary', size = 'md',
  onClick, disabled = false, loading = false, className = ''
}) {
  const base = 'btn'
  const variants = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    ghost:     'btn-ghost',
    dark:      'btn-dark',
  }
  const sizes = { sm: 'btn-sm', md: '', lg: 'btn-lg' }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <span className="btn-spinner" /> : children}
    </button>
  )
}
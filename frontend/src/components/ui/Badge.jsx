export default function Badge({ children, variant = 'purple' }) {
  const variants = {
    purple:  'badge badge-purple',
    success: 'badge badge-success',
    warning: 'badge badge-warning',
    danger:  'badge badge-danger',
    info:    'badge badge-info',
  }
  return <span className={variants[variant]}>{children}</span>
}
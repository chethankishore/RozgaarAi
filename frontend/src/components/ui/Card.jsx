export default function Card({
  children, variant = 'default',
  float = false, className = '', style = {}
}) {
  const variants = {
    default: 'card',
    purple:  'card card-purple',
    soft:    'card card-soft',
  }
  return (
    <div
      className={`${variants[variant]} ${float ? 'card-float' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
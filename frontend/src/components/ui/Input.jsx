export default function Input({
  label, placeholder, value, onChange,
  type = 'text', error, name, id
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label htmlFor={id} style={{
          fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
          color: 'var(--color-text-secondary)'
        }}>
          {label}
        </label>
      )}
      <input
        id={id} name={name} type={type}
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)' }}>
          {error}
        </span>
      )}
    </div>
  )
}
// Labeled text/email input for the identity fields. Brand-locked styling via
// .tc-input. `required` only renders the marker — gating lives in the parent.
export default function TextField({
  name,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  autoComplete,
}) {
  return (
    <label className="tc-field" htmlFor={name}>
      <span className="tc-field-label">
        {label}
        {required && <span className="tc-field-req"> *</span>}
      </span>
      <input
        id={name}
        name={name}
        type={type}
        className="tc-input"
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
      />
    </label>
  )
}

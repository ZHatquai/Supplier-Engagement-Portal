// Renders one questionnaire field by type: number, long text, or Yes/No.
// Every field is optional, so no required markers and no validation gating.
// `field` is { name, type, label }; value is the current string; onChange is
// (name, value).
export default function Field({ field, value, onChange }) {
  const { name, type, label } = field

  return (
    <label className="tc-field" htmlFor={name}>
      <span className="tc-field-label">{label}</span>

      {type === 'number' && (
        <input
          id={name}
          name={name}
          type="number"
          inputMode="decimal"
          step="any"
          className="tc-input"
          value={value ?? ''}
          onChange={(e) => onChange(name, e.target.value)}
        />
      )}

      {type === 'textarea' && (
        <textarea
          id={name}
          name={name}
          className="tc-textarea"
          value={value ?? ''}
          onChange={(e) => onChange(name, e.target.value)}
        />
      )}

      {type === 'yesno' && (
        <select
          id={name}
          name={name}
          className="tc-select"
          value={value ?? ''}
          onChange={(e) => onChange(name, e.target.value)}
        >
          <option value="">— Select —</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      )}
    </label>
  )
}

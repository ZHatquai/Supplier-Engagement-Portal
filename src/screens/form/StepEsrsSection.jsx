import Field from '../../components/Field'

// Guided form, steps 3–8: one ESRS section per step, fields rendered by type.
// All fields optional. The final section shows Submit instead of Next.
export default function StepEsrsSection({
  section,
  formData,
  setField,
  isLast,
  submitting,
  errorMessage,
  onBack,
  onNext,
  onSubmit,
}) {
  return (
    <div>
      <div className="tc-subhead tc-flow-eyebrow">{section.code}</div>
      <h1 className="tc-h2">{section.title}</h1>
      <p className="tc-body tc-flow-intro">
        Every field below is optional — answer what you can and leave the rest blank.
      </p>

      {section.fields.map((field) => (
        <Field
          key={field.name}
          field={field}
          value={formData[field.name]}
          onChange={setField}
        />
      ))}

      {errorMessage && <p className="tc-error" role="alert">{errorMessage}</p>}

      <div className="tc-step-nav">
        <button type="button" className="tc-link" onClick={onBack} disabled={submitting}>
          ← Back
        </button>
        {isLast ? (
          <button
            type="button"
            className="tc-btn-primary"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        ) : (
          <button type="button" className="tc-btn-primary" onClick={onNext} disabled={submitting}>
            Next
          </button>
        )}
      </div>
    </div>
  )
}

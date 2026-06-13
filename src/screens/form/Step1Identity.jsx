import TextField from '../../components/TextField'
import ConsentGate from '../../components/ConsentGate'
import { identityComplete } from '../../lib/validation'

// Guided form, step 1: identity + GDPR consent, captured before anything is
// written (including before the EcoVadis save-and-redirect). Next is blocked
// until all three identity fields are filled and consent is ticked.
export default function Step1Identity({ formData, setField, onBack, onNext }) {
  const canAdvance = identityComplete(formData) && formData.consent === true

  return (
    <div>
      <h1 className="tc-h2">Your details</h1>
      <p className="tc-body tc-flow-intro">
        Tell us who is submitting on behalf of your organisation. These three fields and your
        consent are required; everything after is optional.
      </p>

      <TextField
        name="company_name"
        label="Company name"
        value={formData.company_name}
        onChange={setField}
        required
        autoComplete="organization"
      />
      <TextField
        name="contact_name"
        label="Contact name"
        value={formData.contact_name}
        onChange={setField}
        required
        autoComplete="name"
      />
      <TextField
        name="contact_email"
        label="Contact email"
        type="email"
        value={formData.contact_email}
        onChange={setField}
        required
        autoComplete="email"
      />

      <ConsentGate checked={formData.consent === true} onChange={(v) => setField('consent', v)} />

      <div className="tc-step-nav">
        <button type="button" className="tc-link" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="tc-btn-primary" onClick={onNext} disabled={!canAdvance}>
          Next
        </button>
      </div>
    </div>
  )
}

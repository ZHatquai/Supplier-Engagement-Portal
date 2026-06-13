import { DATA_STATEMENT, CONSENT_LABEL, DELETION_EMAIL } from '../constants'

// GDPR consent gate, shared by the CSV upload screen and guided-form step 1.
// Renders the checkbox, the verbatim data statement, and the deletion contact.
// No data is written on any path until `checked` is true (the parent disables
// Submit / Next accordingly).
export default function ConsentGate({ checked, onChange }) {
  // Split the data statement so the deletion email renders as a real mailto
  // link (underline + Ink, never blue) while keeping the wording verbatim.
  const [before] = DATA_STATEMENT.split(DELETION_EMAIL)

  return (
    <div className="tc-consent">
      <label className="tc-consent-row">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby="tc-consent-statement"
        />
        <span className="tc-consent-label">{CONSENT_LABEL}</span>
      </label>
      <p id="tc-consent-statement" className="tc-consent-statement">
        {before}
        <a href={`mailto:${DELETION_EMAIL}`}>{DELETION_EMAIL}</a>.
      </p>
    </div>
  )
}

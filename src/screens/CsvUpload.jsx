import { useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import TextField from '../components/TextField'
import ConsentGate from '../components/ConsentGate'
import { identityComplete } from '../lib/validation'

// CSV upload route. Collects identity + consent + a CSV file. On submit the
// file uploads to the private bucket FIRST, then a submissions row is written
// (route = csv_upload). A failed upload writes no row — handled in the service.
export default function CsvUpload({
  formData,
  setField,
  submitting,
  errorMessage,
  onSubmit,
  onBack,
  onHome,
}) {
  const [file, setFile] = useState(null)

  const canSubmit =
    identityComplete(formData) && formData.consent === true && !!file && !submitting

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit(file)
  }

  return (
    <>
      <Nav onHome={onHome} />
      <main className="tc-flow">
        <form className="tc-flow-surface" onSubmit={handleSubmit} noValidate>
          <div className="tc-flow-eyebrow tc-subhead">Upload CSV</div>
          <h1 className="tc-h2">Upload your completed questionnaire</h1>
          <p className="tc-body tc-flow-intro">
            In Excel, open your completed questionnaire and choose File → Save As → CSV. Then enter
            your details, confirm consent, and upload the file below.
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

          <ConsentGate
            checked={formData.consent === true}
            onChange={(v) => setField('consent', v)}
          />

          <label className="tc-field tc-file" htmlFor="csv_file">
            <span className="tc-field-label">
              Completed questionnaire (CSV) <span className="tc-field-req">*</span>
            </span>
            <input
              id="csv_file"
              name="csv_file"
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {errorMessage && <p className="tc-error" role="alert">{errorMessage}</p>}

          <div className="tc-step-nav">
            <button type="button" className="tc-link" onClick={onBack}>
              ← Back
            </button>
            <button type="submit" className="tc-btn-primary" disabled={!canSubmit}>
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  )
}

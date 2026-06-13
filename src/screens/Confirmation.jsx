import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { ECOVADIS_URL } from '../constants'

// Shared confirmation screen for the submitting paths. The one place to spend
// visual weight — headline scale, company name echoed. Nothing is written
// here; the write already happened on submit. When `showEcoVadisLink` is set
// (EcoVadis route), a fallback link to EcoVadis is shown in case the new tab
// was blocked by the browser.
export default function Confirmation({ companyName, onHome, showEcoVadisLink = false }) {
  return (
    <>
      <Nav onHome={onHome} />
      <main className="tc-confirm">
        <div className="tc-confirm-inner">
          <div className="tc-confirm-eyebrow tc-subhead">Submission received</div>
          <h1 className="tc-confirm-title">Thank you — submission received.</h1>
          {companyName && (
            <p className="tc-confirm-company">{companyName}</p>
          )}
          <p className="tc-confirm-body">
            {showEcoVadisLink
              ? 'Your submission has been recorded and EcoVadis should have opened in a new tab. The Corporate’s EHS team will follow up directly if anything further is needed.'
              : 'Your response has been recorded. The Corporate’s EHS team will follow up directly if anything further is needed.'}
          </p>
          {showEcoVadisLink && (
            <p style={{ marginBottom: 24 }}>
              <a
                className="tc-btn-primary"
                href={ECOVADIS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open EcoVadis
              </a>
            </p>
          )}
          <button type="button" className="tc-btn-secondary" onClick={onHome}>
            Return to start
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}

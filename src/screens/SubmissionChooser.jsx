import Nav from '../components/Nav'
import Footer from '../components/Footer'

// Submit -> chooser. Two clearly labelled options; each opens its screen.
export default function SubmissionChooser({ onChooseCsv, onChooseFill, onHome }) {
  return (
    <>
      <Nav onHome={onHome} />
      <main className="tc-flow">
        <div className="tc-flow-surface">
          <div className="tc-flow-eyebrow tc-subhead">Submit Your Response</div>
          <h1 className="tc-h2">How would you like to submit?</h1>
          <p className="tc-body tc-flow-intro">
            Choose the route that suits you. Both are captured securely for The Corporate&apos;s
            EHS team — you can complete either in one sitting.
          </p>

          <div className="tc-grid-2">
            <button type="button" className="tc-chooser-card" onClick={onChooseCsv}>
              <span className="tc-chooser-card-title">Upload completed questionnaire (CSV)</span>
              <span className="tc-chooser-card-body">
                Already filled in the Excel questionnaire? Save it as a CSV and upload it here with
                your company details.
              </span>
              <span className="tc-chooser-card-cta">Upload CSV →</span>
            </button>

            <button type="button" className="tc-chooser-card" onClick={onChooseFill}>
              <span className="tc-chooser-card-title">Fill in the questionnaire here</span>
              <span className="tc-chooser-card-body">
                Answer the ESRS questions directly through a guided, step-by-step form. Every
                question is optional.
              </span>
              <span className="tc-chooser-card-cta">Start the form →</span>
            </button>
          </div>

          <div style={{ marginTop: 32 }}>
            <button type="button" className="tc-link" onClick={onHome}>
              ← Back to start
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

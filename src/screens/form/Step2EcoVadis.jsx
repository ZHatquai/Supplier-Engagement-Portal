// Guided form, step 2: the EcoVadis branch. Yes saves a submissions row
// (route = ecovadis) FIRST, then the browser opens ecovadis.com — the
// save-before-redirect order keeps the route traceable. No continues to the
// ESRS sections. Identity + consent were already captured in step 1.
export default function Step2EcoVadis({ submitting, errorMessage, onBack, onYes, onNo }) {
  return (
    <div>
      <h1 className="tc-h2">Do you have a current EcoVadis scorecard?</h1>
      <p className="tc-body tc-flow-intro">
        If your organisation holds a valid EcoVadis scorecard, we will use it instead of the full
        questionnaire. Choosing Yes records your submission and takes you to EcoVadis in a new tab.
      </p>

      <div className="tc-grid-2">
        <button
          type="button"
          className="tc-chooser-card"
          onClick={onYes}
          disabled={submitting}
        >
          <span className="tc-chooser-card-title">Yes</span>
          <span className="tc-chooser-card-body">
            I have a current EcoVadis scorecard. Record my submission and take me to EcoVadis.
          </span>
          <span className="tc-chooser-card-cta">
            {submitting ? 'Saving…' : 'Continue to EcoVadis →'}
          </span>
        </button>

        <button
          type="button"
          className="tc-chooser-card"
          onClick={onNo}
          disabled={submitting}
        >
          <span className="tc-chooser-card-title">No</span>
          <span className="tc-chooser-card-body">
            I do not have a current scorecard. Continue to the ESRS questionnaire.
          </span>
          <span className="tc-chooser-card-cta">Continue to the questionnaire →</span>
        </button>
      </div>

      {errorMessage && <p className="tc-error" role="alert">{errorMessage}</p>}

      <div className="tc-step-nav">
        <button type="button" className="tc-link" onClick={onBack} disabled={submitting}>
          ← Back
        </button>
        <span />
      </div>
    </div>
  )
}

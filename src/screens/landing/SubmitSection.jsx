import { QUESTIONNAIRE_XLSX } from '../../constants'

// Landing submission section. Change from v1.0: the standalone "Submit
// EcoVadis Scorecard" button is removed — EcoVadis now lives inside the guided
// form. There is one front door: Submit. The Excel download is retained as the
// offline-prep action.
export default function SubmitSection({ onSubmit }) {
  return (
    <section className="section-routes" id="submit">
      <div className="tc-page">
        <h2 className="tc-h2">Submit Your Response</h2>
        <p className="tc-body" style={{ maxWidth: 580, marginTop: 16 }}>
          Both paths lead to the same outcome — a complete sustainability profile for your
          company. Prepare your answers offline, then submit when you are ready.
        </p>

        <div className="routes-grid tc-grid-2">
          <div className="route-card">
            <div className="route-card-label tc-label">Prepare Offline</div>
            <p className="route-card-body">
              Download the ESRS-aligned Excel questionnaire to review every question and prepare
              your answers. Use it as your working copy, then return it on the upload path or as a
              reference while you fill the form in here.
            </p>
            <a className="tc-btn-secondary" href={QUESTIONNAIRE_XLSX} download>
              Download Assessment
            </a>
          </div>

          <div className="route-card">
            <div className="route-card-label tc-label">Submit Your Response</div>
            <p className="route-card-body">
              When you are ready, submit directly. Upload your completed questionnaire as a CSV
              file, or fill it in through our guided, step-by-step form. Both routes are captured
              securely for The Corporate&apos;s EHS team.
            </p>
            <button type="button" className="tc-btn-primary" onClick={onSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

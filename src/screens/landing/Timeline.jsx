// "What Happens Next" timeline. Acid Lime use 2 of 2 on this page (the step
// numbers — Pattern A: lime text on black containers). Copy verbatim from v1.0.
export default function Timeline() {
  return (
    <section className="section-timeline" id="timeline">
      <div className="tc-page">
        <h2 className="tc-h2">What Happens Next.</h2>

        <div className="timeline tc-grid-4">
          <div className="timeline-step">
            <div className="timeline-step-num"><span>01</span></div>
            <div className="timeline-step-title">Portal Launch</div>
            <div className="timeline-step-body">
              You receive this link and select your submission path.
            </div>
            <div className="timeline-step-date">April 2026</div>
          </div>
          <div className="timeline-step">
            <div className="timeline-step-num"><span>02</span></div>
            <div className="timeline-step-title">Data Submission</div>
            <div className="timeline-step-body">
              Submit scorecard or complete questionnaire. 100% Tier 1 response required.
            </div>
            <div className="timeline-step-date">Deadline: 30 Sep 2026</div>
          </div>
          <div className="timeline-step">
            <div className="timeline-step-num"><span>03</span></div>
            <div className="timeline-step-title">Review &amp; Scoring</div>
            <div className="timeline-step-body">
              Our EHS and Procurement teams review submissions and flag gaps.
            </div>
            <div className="timeline-step-date">Q4 2026</div>
          </div>
          <div className="timeline-step">
            <div className="timeline-step-num"><span>04</span></div>
            <div className="timeline-step-title">Partnership Plans</div>
            <div className="timeline-step-body">
              Joint decarbonisation and improvement plans agreed with prioritised suppliers.
            </div>
            <div className="timeline-step-date">Q1 2027</div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { DELETION_EMAIL } from '../../constants'

// Key resources cards. The "View Document" / "View Policy" links remain #
// placeholders pending real URLs from the builder (carried over from v1.0).
export default function Resources() {
  return (
    <section className="section-resources" id="resources">
      <div className="tc-page">
        <h2 className="tc-h2">Key Resources</h2>
        <p className="tc-subhead" style={{ marginTop: 16 }}>Everything you need.</p>

        <div className="resources-grid tc-grid-3">
          <div className="resource-card">
            <div className="tc-label">Document</div>
            <div className="resource-card-title">Supplier Code of Conduct</div>
            <p className="resource-card-body">
              The Corporate&apos;s standards for ethical business conduct, labour rights, and
              environmental responsibility. All Tier 1 suppliers must have a signed copy on file.
            </p>
            {/* TODO (builder): replace # with the real Supplier Code of Conduct URL before deployment */}
            <a className="resource-card-link" href="#">View Document</a>
          </div>

          <div className="resource-card">
            <div className="tc-label">Policy</div>
            <div className="resource-card-title">Global Environmental Policy</div>
            <p className="resource-card-body">
              The Corporate&apos;s commitments on climate, water, PFAS, and circular economy — the
              framework that defines what we expect from our value chain partners.
            </p>
            {/* TODO (builder): replace # with the real Global Environmental Policy URL before deployment */}
            <a className="resource-card-link" href="#">View Policy</a>
          </div>

          <div className="resource-card">
            <div className="tc-label">Support</div>
            <div className="resource-card-title">EHS Help Desk</div>
            <p className="resource-card-body">
              Questions about specific ESRS requirements, measurement methodology, or technical
              aspects of the questionnaire? Contact our Environment, Health &amp; Safety team
              directly.
            </p>
            <a
              className="resource-card-link"
              href={`mailto:${DELETION_EMAIL}?subject=Supplier%20Portal%20Help%20Desk%20Query`}
            >
              Contact EHS
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

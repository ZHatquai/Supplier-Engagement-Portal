// Hero + stats row. Acid Lime use 1 of 2 on this page (the pill — Pattern A:
// lime text on a black container). Copy ported verbatim from v1.0.
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-pill">
          <span>Supplier Programme 2026</span>
        </div>

        <h1 className="hero-title">
          We don&apos;t just manufacture products. We engineer a sustainable future.
        </h1>

        <p className="hero-body">
          Our 2045 Net-Zero goal is a shared journey. This portal is your starting point —
          understand what we are asking, why it matters, and how to submit your response.
        </p>

        <div className="hero-stats tc-grid-4">
          <div>
            <div className="hero-stat-value">675,500</div>
            <div className="hero-stat-label">tCO₂e Baseline (2023)</div>
          </div>
          <div>
            <div className="hero-stat-value">72%</div>
            <div className="hero-stat-label">Scope 3 — Value Chain</div>
          </div>
          <div>
            <div className="hero-stat-value">2045</div>
            <div className="hero-stat-label">Net-Zero Target Year</div>
          </div>
          <div>
            <div className="hero-stat-value">500+</div>
            <div className="hero-stat-label">Tier 1 Suppliers</div>
          </div>
        </div>
      </div>
    </section>
  )
}

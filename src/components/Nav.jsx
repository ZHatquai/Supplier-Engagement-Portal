// Brand nav bar: boxed "C" monogram + spaced wordmark. The logo returns to
// the landing page when an onHome handler is provided.
export default function Nav({ onHome }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button
          type="button"
          className="nav-logo"
          aria-label="The Corporate — return to start"
          onClick={onHome}
        >
          <div className="nav-logo-mark">
            <span>C</span>
          </div>
          <span className="nav-logo-wordmark">The Corporate</span>
        </button>
      </div>
    </nav>
  )
}

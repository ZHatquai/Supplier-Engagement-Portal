// Guided-form progress: a tracked label ("Step 2 of 8 — EcoVadis") above a
// thin Ink fill bar. `current` and `total` are 1-based step counts.
export default function ProgressIndicator({ current, total, label }) {
  const pct = Math.max(0, Math.min(100, (current / total) * 100))
  return (
    <div className="tc-progress">
      <div className="tc-progress-label">
        Step {current} of {total}
        {label ? ` — ${label}` : ''}
      </div>
      <div className="tc-progress-track" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
        <div className="tc-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

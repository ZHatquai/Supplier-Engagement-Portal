import { useState } from 'react'
import LandingPage from './screens/LandingPage'
import SubmissionChooser from './screens/SubmissionChooser'
import CsvUpload from './screens/CsvUpload'
import GuidedForm from './screens/GuidedForm'
import Confirmation from './screens/Confirmation'
import { VIEWS, ROUTES, FIRST_ESRS_STEP, TOTAL_STEPS, ECOVADIS_URL } from './constants'
import { submitEcoVadis, submitCsv, submitFillHere } from './services/submissions'

const EMPTY_FORM = {
  company_name: '',
  contact_name: '',
  contact_email: '',
  consent: false,
}

// Single-page state machine — no router (the spec forbids resume/deep-links;
// every submission is one sitting). State: which view, which guided-form step,
// the form data, whether a write is in flight, and any error to surface.
export default function App() {
  const [view, setView] = useState(VIEWS.LANDING)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  // The company name echoed on the confirmation screen, captured at submit
  // time. Which submitting route landed here (for the EcoVadis fallback link).
  const [confirmed, setConfirmed] = useState({ companyName: '', route: null })

  function setField(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // ── Navigation ──────────────────────────────────────────────────────────
  function goHome() {
    setView(VIEWS.LANDING)
    setStep(1)
    setSubmitting(false)
    setErrorMessage(null)
  }

  function restart() {
    // Fresh start after a completed submission.
    setFormData(EMPTY_FORM)
    setConfirmed({ companyName: '', route: null })
    goHome()
  }

  function openChooser() {
    setErrorMessage(null)
    setView(VIEWS.CHOOSER)
  }

  function chooseCsv() {
    setErrorMessage(null)
    setView(VIEWS.CSV_UPLOAD)
  }

  function chooseFill() {
    setErrorMessage(null)
    setStep(1)
    setView(VIEWS.GUIDED_FORM)
  }

  // Form Back: from step 1 return to the chooser; otherwise step back one.
  function formBack() {
    setErrorMessage(null)
    if (step <= 1) {
      setView(VIEWS.CHOOSER)
    } else {
      setStep((s) => s - 1)
    }
  }

  function formNext() {
    setErrorMessage(null)
    setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  }

  function ecoVadisNo() {
    setErrorMessage(null)
    setStep(FIRST_ESRS_STEP)
  }

  // ── Submission handlers ───────────────────────────────────────────────────
  function landConfirmation(route) {
    setConfirmed({ companyName: formData.company_name.trim(), route })
    setSubmitting(false)
    setErrorMessage(null)
    setView(VIEWS.CONFIRMATION)
  }

  async function ecoVadisYes() {
    setSubmitting(true)
    setErrorMessage(null)
    try {
      // Save the submissions row FIRST (traceability), then open EcoVadis.
      await submitEcoVadis({ identity: formData, consent: formData.consent })
      window.open(ECOVADIS_URL, '_blank', 'noopener,noreferrer')
      landConfirmation(ROUTES.ECOVADIS)
    } catch (err) {
      setSubmitting(false)
      setErrorMessage(err.message)
    }
  }

  async function handleSubmitCsv(file) {
    setSubmitting(true)
    setErrorMessage(null)
    try {
      await submitCsv({ identity: formData, consent: formData.consent, file })
      landConfirmation(ROUTES.CSV_UPLOAD)
    } catch (err) {
      setSubmitting(false)
      setErrorMessage(err.message)
    }
  }

  async function handleSubmitFillHere() {
    setSubmitting(true)
    setErrorMessage(null)
    try {
      await submitFillHere({
        identity: formData,
        consent: formData.consent,
        answers: formData,
      })
      landConfirmation(ROUTES.FILL_HERE)
    } catch (err) {
      setSubmitting(false)
      setErrorMessage(err.message)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (view === VIEWS.CHOOSER) {
    return (
      <SubmissionChooser
        onChooseCsv={chooseCsv}
        onChooseFill={chooseFill}
        onHome={goHome}
      />
    )
  }

  if (view === VIEWS.CSV_UPLOAD) {
    return (
      <CsvUpload
        formData={formData}
        setField={setField}
        submitting={submitting}
        errorMessage={errorMessage}
        onSubmit={handleSubmitCsv}
        onBack={openChooser}
        onHome={goHome}
      />
    )
  }

  if (view === VIEWS.GUIDED_FORM) {
    return (
      <GuidedForm
        step={step}
        formData={formData}
        setField={setField}
        submitting={submitting}
        errorMessage={errorMessage}
        onHome={goHome}
        onBack={formBack}
        onNext={formNext}
        onEcoVadisYes={ecoVadisYes}
        onEcoVadisNo={ecoVadisNo}
        onSubmitFillHere={handleSubmitFillHere}
      />
    )
  }

  if (view === VIEWS.CONFIRMATION) {
    return (
      <Confirmation
        companyName={confirmed.companyName}
        showEcoVadisLink={confirmed.route === ROUTES.ECOVADIS}
        onHome={restart}
      />
    )
  }

  return <LandingPage onSubmit={openChooser} />
}

import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ProgressIndicator from '../components/ProgressIndicator'
import Step1Identity from './form/Step1Identity'
import Step2EcoVadis from './form/Step2EcoVadis'
import StepEsrsSection from './form/StepEsrsSection'
import { ESRS_SECTIONS } from '../data/questions'
import { FIRST_ESRS_STEP, TOTAL_STEPS } from '../constants'

// Single guided-form shell. App owns `step`; this renders the matching step
// and wires navigation. Steps: 1 identity+consent, 2 EcoVadis branch,
// 3–8 the six ESRS sections (spec order E1,E2,E3,E5,E4,S2/G1).
export default function GuidedForm({
  step,
  formData,
  setField,
  submitting,
  errorMessage,
  onHome,
  onBack,
  onNext,
  onEcoVadisYes,
  onEcoVadisNo,
  onSubmitFillHere,
}) {
  const sectionIndex = step - FIRST_ESRS_STEP
  const section = sectionIndex >= 0 ? ESRS_SECTIONS[sectionIndex] : null
  const isLast = step === TOTAL_STEPS

  let stepLabel = ''
  if (step === 1) stepLabel = 'Your details'
  else if (step === 2) stepLabel = 'EcoVadis'
  else if (section) stepLabel = `${section.code} · ${section.title}`

  return (
    <>
      <Nav onHome={onHome} />
      <main className="tc-flow">
        <div className="tc-flow-surface">
          <ProgressIndicator current={step} total={TOTAL_STEPS} label={stepLabel} />

          {step === 1 && (
            <Step1Identity
              formData={formData}
              setField={setField}
              onBack={onBack}
              onNext={onNext}
            />
          )}

          {step === 2 && (
            <Step2EcoVadis
              submitting={submitting}
              errorMessage={errorMessage}
              onBack={onBack}
              onYes={onEcoVadisYes}
              onNo={onEcoVadisNo}
            />
          )}

          {section && (
            <StepEsrsSection
              section={section}
              formData={formData}
              setField={setField}
              isLast={isLast}
              submitting={submitting}
              errorMessage={errorMessage}
              onBack={onBack}
              onNext={onNext}
              onSubmit={onSubmitFillHere}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

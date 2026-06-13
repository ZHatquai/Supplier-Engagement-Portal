import { supabase, STORAGE_BUCKET } from '../lib/supabaseClient'
import { ROUTES } from '../constants'
import { ALL_QUESTION_FIELDS, NUMERIC_FIELDS } from '../data/questions'

// All three submission routes funnel through here. Each generates the
// submission id CLIENT-SIDE (crypto.randomUUID) so the fill_here child row can
// reference it without a read-back — the anon role has no SELECT. Every
// orchestrator re-checks consent (defense in depth: the UI also gates it) and
// throws a friendly Error on failure so the caller can show it and let the
// supplier retry without advancing.

const numericSet = new Set(NUMERIC_FIELDS)

function assertConsent(consent) {
  if (consent !== true) {
    throw new Error('Consent is required before your submission can be saved.')
  }
}

function newId() {
  return crypto.randomUUID()
}

// Insert one submissions row. No .select() — anon cannot read, and the id is
// already known client-side.
async function insertSubmission(row) {
  const { error } = await supabase.from('submissions').insert(row)
  if (error) {
    throw new Error('We could not save your submission. Please try again.')
  }
}

// Coerce the raw form values into a questionnaire_responses payload. Numeric
// fields become a Number or null; text fields become a trimmed string or null.
function buildResponsePayload(submissionId, answers) {
  const payload = { submission_id: submissionId }
  for (const name of ALL_QUESTION_FIELDS) {
    const raw = answers?.[name]
    if (numericSet.has(name)) {
      if (raw === undefined || raw === null || String(raw).trim() === '') {
        payload[name] = null
      } else {
        const n = Number(raw)
        payload[name] = Number.isFinite(n) ? n : null
      }
    } else {
      const trimmed = typeof raw === 'string' ? raw.trim() : raw
      payload[name] = trimmed ? trimmed : null
    }
  }
  return payload
}

function identityRow(identity) {
  return {
    company_name: identity.company_name.trim(),
    contact_name: identity.contact_name.trim(),
    contact_email: identity.contact_email.trim(),
  }
}

// EcoVadis route: write the submissions row FIRST (so the route is always
// traceable), then the caller redirects to ecovadis.com. No questionnaire data.
export async function submitEcoVadis({ identity, consent }) {
  assertConsent(consent)
  const id = newId()
  await insertSubmission({
    id,
    ...identityRow(identity),
    route: ROUTES.ECOVADIS,
    consent_given: true,
  })
  return { id }
}

// CSV route: upload the file FIRST. If the upload fails, no submissions row is
// written (the supplier sees an error and retries). On success, write the row
// with csv_file_path set.
export async function submitCsv({ identity, consent, file }) {
  assertConsent(consent)
  if (!file) {
    throw new Error('Please choose a CSV file to upload.')
  }
  const id = newId()
  // Namespace the object by submission id to avoid collisions; the supplier
  // can only insert, never list or overwrite.
  const safeName = file.name.replace(/[^\w.\-]+/g, '_')
  const path = `${id}/${safeName}`

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType: file.type || 'text/csv',
      upsert: false,
    })
  if (uploadError) {
    throw new Error('We could not upload your file. Please try again.')
  }

  await insertSubmission({
    id,
    ...identityRow(identity),
    route: ROUTES.CSV_UPLOAD,
    consent_given: true,
    csv_file_path: path,
  })
  return { id }
}

// Fill-here route: write the submissions row, then the linked
// questionnaire_responses row holding whatever subset of answers was entered.
export async function submitFillHere({ identity, consent, answers }) {
  assertConsent(consent)
  const id = newId()
  await insertSubmission({
    id,
    ...identityRow(identity),
    route: ROUTES.FILL_HERE,
    consent_given: true,
  })

  const { error } = await supabase
    .from('questionnaire_responses')
    .insert(buildResponsePayload(id, answers))
  if (error) {
    // The submissions row is already saved; surface the error so the supplier
    // knows the answers did not save and can retry the submit.
    throw new Error(
      'Your details were saved, but we could not save your answers. Please try submitting again.',
    )
  }
  return { id }
}

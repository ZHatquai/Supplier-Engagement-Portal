// App-wide constants. Single source of truth for routes, views, copy, and the
// external links so screens and services never hardcode strings.

// submissions.route — exactly one of these three values (DB check constraint).
export const ROUTES = {
  ECOVADIS: 'ecovadis',
  CSV_UPLOAD: 'csv_upload',
  FILL_HERE: 'fill_here',
}

// Top-level screens in the single-page state machine (App.jsx).
export const VIEWS = {
  LANDING: 'landing',
  CHOOSER: 'chooser',
  CSV_UPLOAD: 'csv_upload',
  GUIDED_FORM: 'guided_form',
  CONFIRMATION: 'confirmation',
}

// Guided form step indices. Step 1 = identity + consent, Step 2 = EcoVadis
// branch, Steps 3–8 = the six ESRS sections (one per step, spec order).
export const FIRST_ESRS_STEP = 3
export const TOTAL_STEPS = 8 // 1 identity, 2 EcoVadis, 3–8 ESRS sections

export const ECOVADIS_URL = 'https://ecovadis.com'

export const DELETION_EMAIL = 'sustainability@thecorporate.com'

// GDPR data statement shown at the point of collection on BOTH paths.
// Verbatim from product-spec.md Section 7.
export const DATA_STATEMENT =
  'Your submission is stored securely and used only to assess your ' +
  "organisation's sustainability disclosures for The Corporate's supplier " +
  'assessment programme. You can request deletion at any time by contacting ' +
  DELETION_EMAIL + '.'

export const CONSENT_LABEL =
  'I consent to The Corporate storing and processing this submission.'

// The static Excel questionnaire, shipped from public/assets at this URL.
export const QUESTIONNAIRE_XLSX =
  '/assets/The_Corporate_Supplier_Questionnaire_2026.xlsx'

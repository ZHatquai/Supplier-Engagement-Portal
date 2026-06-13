// Shared validation for the only required inputs across every path: the three
// identity fields. Every questionnaire field is optional, so nothing else is
// validated. Used to gate Next (form step 1) and Submit (CSV path).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function identityComplete(formData) {
  const company = (formData?.company_name ?? '').trim()
  const contact = (formData?.contact_name ?? '').trim()
  const email = (formData?.contact_email ?? '').trim()
  return company !== '' && contact !== '' && EMAIL_RE.test(email)
}

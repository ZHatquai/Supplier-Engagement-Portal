# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 2 — v2.0 build (Phase A complete: Supabase backend + project config)
**Last updated:** 13 June 2026 — v2.0 build session
**Live URL:** none yet [Rule: fill in after the first successful deploy]

## Current state
v1.0 landing page (`index.html`) is live as the brand baseline. v2.0 build in progress on
branch `claude/adoring-hypatia-ch8l9n`.

**Phase A — Supabase backend (DONE):** Used the existing Supabase project **"The Corporate
Space"** (`vbtuzjprzusqsxawmgyl`, eu-central-1/Frankfurt, Free plan) rather than creating a
new one — it already existed empty with the mandated name in the GDPR region. Created both
tables (`submissions`, `questionnaire_responses` with FK + index), RLS enabled with anon
**insert-only** policies on both, and a private `supplier-csv-uploads` Storage bucket with an
anon insert-only policy. Verified via simulated `role anon` transaction: inserts succeed
(incl. FK link without read-back), selects return 0 rows. Security advisors reviewed — the
only findings are by-design (insert `with check (true)`) or pre-existing/benign
(`rls_auto_enable` protective trigger). Wrote `docs/supabase-setup.md` (schema source of
truth). Added `netlify.toml` (SECRETS_SCAN_OMIT_KEYS for the two VITE keys), `.env.example`,
`.gitignore`.
[Rule: this section describes what exists and works right now — never what is planned.]

## Last session
Session 2 (Phase A): selected/confirmed the existing "The Corporate Space" project; applied
two migrations (tables+RLS+index, private bucket+policy); verified insert-only RLS by anon
role simulation; wrote docs/supabase-setup.md; added netlify.toml, .env.example, .gitignore.
[Rule: 3–5 lines maximum. Replace each session — what was built, changed, or fixed.]

## Remaining work
- [ ] Phase B: Scaffold React + Vite + Tailwind 3 (package.json, vite/tailwind/postcss config,
      src/main.jsx, src/index.css with brand tokens). Move XLSX to public/assets/.
- [ ] Phase B: Supabase client (`src/lib/supabaseClient.js`) from the two VITE_ env vars.
- [ ] Phase B: constants + questions data (6 ESRS sections in spec order E1,E2,E3,E5,E4,S2/G1).
- [ ] Phase B: submission service (insert submission, upload CSV, insert responses; 3 route
      orchestrators; client-side UUID so fill_here links the child row with no read-back).
- [ ] Phase B: port landing page to React (remove standalone EcoVadis button, add Submit).
- [ ] Phase B: build Chooser, CsvUpload, GuidedForm (Step1 identity+consent, Step2 EcoVadis
      branch, Steps 3–8 ESRS sections), Confirmation. Shared ConsentGate on both paths.
- [ ] Phase B: App.jsx state machine (view/step/formData/submitting/error); consent gates.
- [ ] Phase B: local `npm run build` + click-through verification (AC1–AC13).
- [ ] Phase C (builder): set the two VITE env vars in Netlify, merge to main, verify live URL,
      Excel download, and a test submission lands in Supabase; record live URL here (AC14).
- [ ] Builder: provide real URLs for "View Document" and "View Policy" (still `#` placeholders).
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
- Used the existing Supabase project "The Corporate Space" instead of creating a new one
  (deviation from CLAUDE.md, noted) — it already existed, empty, correctly named, in EU region.
- Development on branch `claude/adoring-hypatia-ch8l9n`; builder handles Netlify env vars +
  merge to main for deploy (deviation from CLAUDE.md's push-to-main save-point rule, noted).
- Number-typed ESRS questions stored as `numeric`; Yes/No and long-text as `text`. Column names
  equal the form field names, so inserts need no mapping layer.
- Submission `id` generated client-side (UUID) so the fill_here child row links without any
  read-back (anon has no SELECT).
- Left the pre-existing `rls_auto_enable` event trigger untouched (protective, not ours).

## Known issues
- "View Document" and "View Policy" links are placeholders (#) pending real URLs from the builder.
- Live anon REST read-back test (AC12) could not run in the build environment (outbound HTTP to
  supabase.co blocked by egress policy); verified instead via DB role simulation. Confirm on the
  deployed site in Phase C.
[Rule: bugs, edge cases, and deferred fixes. One line each. Remove when resolved.]

## Notes for next session
None.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]

# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 2 — v2.0 build (Phases A + B complete; Phase C = builder deploy)
**Last updated:** 13 June 2026 — v2.0 build session
**Live URL:** none yet [Rule: fill in after the first successful deploy]

## Current state
v2.0 is fully built on branch `claude/adoring-hypatia-ch8l9n` and builds cleanly
(`npm run build`). Awaiting the builder for env vars + deploy (Phase C).

**Phase A — Supabase backend (DONE):** Existing project **"The Corporate Space"**
(`vbtuzjprzusqsxawmgyl`, eu-central-1, Free). Tables `submissions` +
`questionnaire_responses` (FK + index); RLS enabled, anon **insert-only** on both;
private `supplier-csv-uploads` bucket with anon insert-only policy. Verified by anon-role
simulation (insert + FK link succeed; select = 0 rows). Schema documented in
`docs/supabase-setup.md`.

**Phase B — React frontend (DONE):** React 18 + Vite 5 + Tailwind 3. Brand tokens in
`tailwind.config.js` + brand primitives in `src/index.css` (square corners, no shadows, exact
palette, Playfair/DM Sans). Landing page ported verbatim from v1.0 into `src/screens/landing/*`
— standalone EcoVadis button **removed**, single **Submit** action added, Excel download kept
(ships byte-identical from `public/assets/`). Built the chooser, CSV upload, guided form
(Step 1 identity+consent, Step 2 EcoVadis Yes=save-then-open / No=continue, Steps 3–8 ESRS in
order **E1,E2,E3,E5,E4,S2/G1**), and the large confirmation screen. `App.jsx` is a single-page
state machine (no router). Supabase client + 3 route orchestrators in `src/services`; submission
`id` generated client-side so `fill_here` links its child row with no read-back. GDPR consent
gates Submit/Next on both paths. Verified by server-rendering every screen (all mount; field
types, section order, gating, and company echo all assert green) + a `vite preview` HTTP smoke
test (app shell, JS bundle, XLSX all 200).
[Rule: this section describes what exists and works right now — never what is planned.]

## Last session
Session 2: applied Supabase schema/RLS/bucket to "The Corporate Space" and verified insert-only;
wrote docs/supabase-setup.md; scaffolded React+Vite+Tailwind; ported the landing page (EcoVadis
button removed, Submit added); built chooser, CSV upload, guided multi-step form (EcoVadis branch
+ 6 ESRS sections), and confirmation; clean build + SSR/preview verification of all 14 ACs except
the live deploy.
[Rule: 3–5 lines maximum. Replace each session — what was built, changed, or fixed.]

## Remaining work
- [ ] Phase C (builder): set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in Netlify
      (values from Supabase → Project Settings → API, project `vbtuzjprzusqsxawmgyl`).
- [ ] Phase C (builder): merge `claude/adoring-hypatia-ch8l9n` → `main` to trigger the
      GitHub→Netlify auto-deploy.
- [ ] Phase C (builder): verify live URL loads (desktop + mobile), Excel downloads from the
      deployed site, and a test submission on each route lands in Supabase; then confirm anon
      cannot read rows/files back from the live site (AC12, AC14). Record the live URL above.
- [ ] Builder: provide real URLs for "View Document" / "View Policy" (still `#` placeholders).
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
- Used the existing Supabase project "The Corporate Space" instead of creating a new one
  (deviation from CLAUDE.md, noted) — already existed, empty, correctly named, in the EU region.
- Development on branch `claude/adoring-hypatia-ch8l9n`; builder owns Netlify env vars + the
  merge to main (deviation from CLAUDE.md's push-to-main rule, noted).
- Stack: React 18 + Vite 5 + Tailwind 3 (Tailwind 3 per the brand-skill `theme.extend` idiom).
- Submission `id` generated client-side (UUID) so `fill_here` links its child row with no
  read-back (anon has no SELECT). CSV path uploads the file before writing the row; a failed
  upload writes no row.
- `supabaseClient` falls back to placeholder URL/key if env is missing so the page still renders
  (createClient throws on an empty URL) — submissions then fail with a friendly error.
- Numeric ESRS fields stored as `numeric`; Yes/No + long-text as `text`. Column names equal the
  form field names, so inserts need no mapping layer.

## Known issues
- "View Document" / "View Policy" links are placeholders (#) pending real URLs from the builder.
- Live anon REST read-back test (AC12) and the live deploy (AC14) require Phase C — outbound HTTP
  to supabase.co is blocked in the build environment, so RLS was verified via DB role simulation.
- `npm audit` flags esbuild/vite (dev-server-only advisories; no effect on the static production
  build). The fix is a breaking Vite 8 upgrade — deferred; not a deploy blocker.
[Rule: bugs, edge cases, and deferred fixes. One line each. Remove when resolved.]

## Notes for next session
None.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]

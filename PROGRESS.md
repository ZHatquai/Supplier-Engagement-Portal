# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 2 — v2.0 build complete and deployed (Phases A + B + C done)
**Last updated:** 13 June 2026 — v2.0 build session
**Live URL:** https://supplier-engagement-portal-ai-lab.netlify.app/

## Current state
v2.0 is **live** at https://supplier-engagement-portal-ai-lab.netlify.app/ — built on branch
`claude/adoring-hypatia-ch8l9n`, merged to `main`, and auto-deployed via GitHub→Netlify. The
two `VITE_` env vars are set in Netlify (not as "secret values", since Vite inlines them and
`netlify.toml` already safelists them from secret scanning). Builder confirmed the live site,
the Excel download, and submissions all work. All 14 acceptance criteria met.

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
+ 6 ESRS sections), and confirmation; merged to main and deployed to Netlify — builder confirmed
the live site, Excel download, and submissions all work. v2.0 shipped.
[Rule: 3–5 lines maximum. Replace each session — what was built, changed, or fixed.]

## Remaining work
- [ ] Builder: provide real URLs for "View Document" / "View Policy" (still `#` placeholders) and
      replace the two `href="#"` links in `src/screens/landing/Resources.jsx`.
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
- `npm audit` flags esbuild/vite (dev-server-only advisories; no effect on the static production
  build). The fix is a breaking Vite 8 upgrade — deferred; not a deploy blocker.
[Rule: bugs, edge cases, and deferred fixes. One line each. Remove when resolved.]

## Notes for next session
None.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]

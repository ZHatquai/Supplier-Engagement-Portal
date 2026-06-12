# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 1 — first build session
**Last updated:** 12 June 2026 — Session 1 in progress
**Live URL:** none yet [Rule: fill in after the first successful deploy]

## Current state
First Session Setup complete: docs/ created, product-spec.md moved to docs/, the-corporate-brand skill installed. Landing page rebuilt to spec Section 8 as index.html (renamed from supplier_onboarding.html): decision tree removed (no conditional rendering), both routes always visible, EcoVadis CTA opens ecovadis.com in new tab, Download Assessment serves /assets/The_Corporate_Supplier_Questionnaire_2026.xlsx via download attribute, Contact EHS mailto URL-encoded, Acid Lime reduced to exactly 2 Pattern A uses (hero pill, timeline step numbers), "Why We Are Asking" copy drafted. Local test pass complete: page 200, XLSX downloads byte-identical, all 10 acceptance criteria verified except the live-URL criterion (10).
[Rule: this section describes what exists and works right now — never what is planned. Completed checklist items get absorbed here in compressed form.]

## Last session
Session 1: First Session Setup; merged builder's questionnaire upload from main and moved it to /assets/; rebuilt landing page to spec (removed decision tree, fixed CTAs, enforced brand lime limit); drafted "Why We Are Asking" copy; local test pass.
[Rule: 3–5 lines maximum. Replace each session — what was built, changed, or fixed.]

## Remaining work
- [ ] Builder review: "Why We Are Asking" body copy (drafted this session, on the page)
- [ ] Builder: provide real URLs for "View Document" and "View Policy" (currently # with TODO comments in index.html)
- [ ] Deploy: merge to main → Netlify auto-deploy (Netlify MCP not available in this session); verify live URL and record it above
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
- Renamed supplier_onboarding.html → index.html so Netlify serves it at the site root.
- Acid Lime's 2 permitted uses allocated per spec Section 10: hero "Supplier Programme 2026" pill and timeline step numbers (both Pattern A).
- Removed the page's previous Yes/No decision tree and all JavaScript — spec forbids conditional rendering; both routes render unconditionally.
- EcoVadis card's previous mailto-submission CTA replaced with https://ecovadis.com link per Business Rules.
- Development happens on branch claude/pensive-pascal-w58g2u (session harness requirement); merges to main trigger the Netlify deploy.

## Known issues
- "View Document" and "View Policy" links are placeholders (#) pending real URLs from the builder.
[Rule: bugs, edge cases, and deferred fixes. One line each. Remove when resolved.]

## Notes for next session
None.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]

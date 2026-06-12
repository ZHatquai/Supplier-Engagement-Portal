# The Corporate Supplier Sustainability Portal 2026

## Identity
Static public landing page that routes Tier 1 suppliers to the correct ESRS sustainability assessment submission path.
Tier: 1 — static public page, no database, no login required (D1+A1)
Spec version governed: v1.0 — the version of docs/product-spec.md these rules were derived from.
Position: Standalone

## Session Protocol
At the start of every session:
1. Pull the latest from main before reading anything else.
2. Check docs/product-spec.md: if its version is newer than the "Spec version governed" line in this file, STOP. Tell the builder: "The spec has changed since this CLAUDE.md was written — re-run the Project Governor on the revised spec before building, or these rules may contradict it." Do not build against a stale CLAUDE.md.
3. Read PROGRESS.md in the project root — it is the current state of this build. If it is missing, recreate it with the structure at the end of this section, then continue.
4. Increment the session number and update the date in PROGRESS.md.
5. If "Notes for next session" has content: repeat the notes back to the builder, treat them as this session's priorities, then clear the section.
6. If this is session 1, run First Session Setup before any build work.

Save point — after completing any module, feature, or fix:
1. Update PROGRESS.md: current state, remaining work, build decisions, known issues.
2. Commit and push to main.
3. Tell the builder in one line: "Save point committed: [what changed]."
Do not start the next piece of work before the save point is pushed. Never end a session without one — an ending session is a save point.

First Session Setup (session 1 only):
1. Create docs/ and move product-spec.md into it.
2. Install the brand skill: create .claude/skills/the-corporate-brand/ and place the provided brand file there as SKILL.md (add minimal name/description frontmatter if it has none).
3. Announce what moved, then commit and push before building anything.

PROGRESS.md structure (for the recreate rule): status header (Session / Last updated / Live URL), Current state, Last session (3–5 lines, replace each session), Remaining work (shrinking checklist), Build decisions (one line each), Known issues, Notes for next session.

## Commands
```
npx serve .
```

## Tech Stack
HTML · CSS · JavaScript · Netlify
Deployment: GitHub → Netlify, auto-deploys from main. Netlify MCP is active — create the site, set environment variables, and deploy via MCP.

## Arms
Export — browser only, no server function — HTML anchor with the download attribute; file at /assets/The_Corporate_Supplier_Questionnaire_2026.xlsx

## Hard Rules
- No API keys, server functions, or database calls in this tool. All interactivity is browser-native. Any future arm or database addition requires re-running the Project Governor before building.

## Brand
Brand is governed by the the-corporate-brand skill at .claude/skills/the-corporate-brand/SKILL.md (installed in First Session Setup). Invoke it for any UI or visual work.
Hard rules that hold even if the skill is not loaded:
- Acid Lime (#C8F135): max 2 uses per page. Always on black (#000000) — never directly on light backgrounds.
- Fonts: Playfair Display (headlines), DM Sans 300 (body), DM Sans 500 (labels/emphasis) — import from Google Fonts CDN.
- border-radius: 0 on all elements. No shadows on any element.
- No blue links — underline + Ink (#000000) only.

## Business Rules
- No conditional rendering. Both submission paths (EcoVadis and Excel download) are always visible simultaneously — the supplier self-selects.
- "Submit EcoVadis Scorecard" opens https://ecovadis.com in a new tab (target="_blank" rel="noopener noreferrer").
- "Download Assessment" triggers download of /assets/The_Corporate_Supplier_Questionnaire_2026.xlsx via the HTML download attribute.
- "Contact EHS" opens mailto:sustainability@thecorporate.com?subject=Supplier%20Portal%20Help%20Desk%20Query.
- "View Document" and "View Policy": leave as # at build time; add a code comment on each flagging them for the builder to update before deployment.
- "Why We Are Asking" body copy: draft during the build session following The Corporate brand voice. Must cover ESRS/CSRD regulatory context, The Corporate's 72% Scope 3 supply chain exposure, and the shared-responsibility framing. Builder reviews before deploy.

Out of scope — do not build:
- Online form for browser-based questionnaire responses
- Internal review dashboard
- Automated email notification on Excel download
- Submission tracker
- Supplier login or saved progress
- Automated EcoVadis scorecard validation

## Reference Docs
Read before building the related part:
- docs/product-spec.md — full UI spec, section content, arm detail, acceptance criteria
- .claude/skills/the-corporate-brand/SKILL.md — full brand system (installed in session 1)
PROGRESS.md in the root is read at every session start per the Session Protocol.

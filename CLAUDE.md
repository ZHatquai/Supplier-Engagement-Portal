# The Corporate Supplier Sustainability Portal 2026

## Identity
A public supplier portal that communicates The Corporate's ESRS-aligned sustainability programme and collects supplier responses, either as an uploaded CSV or through a guided multi-step form, writing both to Supabase for the EHS and procurement team to retrieve. Tier 1 supplier contacts use it via a link sent directly by The Corporate; access is public, no login.
Tier: 2 — public submission portal, data persists to Supabase, no login required (D3+A1)
Spec version governed: v2.0 — the version of docs/product-spec.md these rules were derived from.
Position: Standalone. Does not share its Supabase project with another tool; this build creates the schema. The project is named after the organisational context so it can hold future tools later.

## Session Protocol
At the start of every session:
1. Pull the latest from main before reading anything else.
2. Check docs/product-spec.md: if its version is newer than the "Spec version governed" line above, STOP. Tell the builder: "The spec has changed since this CLAUDE.md was written — re-run the Project Governor on the revised spec before building, or these rules may contradict it." Do not build against a stale CLAUDE.md.
3. Read PROGRESS.md in the project root; it is the current state of this build. If it is missing, recreate it with the structure at the end of this section, then continue.
4. Increment the session number and update the date in PROGRESS.md.
5. If "Notes for next session" has content: repeat the notes back to the builder, treat them as this session's priorities, then clear the section.
6. If this is session 1, run First Session Setup below before any build work.

Save point — after completing any module, feature, fix, or schema change:
1. Update PROGRESS.md: current state, remaining work, build decisions, known issues.
2. If the database was touched (any table, policy, or bucket change), update docs/supabase-setup.md in the same save point.
3. Commit and push to main.
4. Tell the builder in one line: "Save point committed: [what changed]."
Do not start the next piece of work before the save point is pushed. Never end a session without one; an ending session is a save point.

First Session Setup (session 1 only):
1. Create docs/ and move product-spec.md into it.
2. Install the brand skill: create .claude/skills/the-corporate-brand/ and place the provided brand file there as SKILL.md.
3. Announce what moved, then commit and push before building anything.

PROGRESS.md structure (for the recreate rule): status header (Session / Last updated / Live URL), Current state, Last session (3–5 lines, replace each session), Remaining work (shrinking checklist), Build decisions (one line each), Known issues, Notes for next session.

## Commands
```
npm install
npm run dev
npm run build
```

## Tech Stack
React · Vite · Tailwind CSS · Netlify · Supabase
Deployment: GitHub to Netlify, auto-deploys from main. Netlify MCP is active; create the site, set environment variables, and deploy via MCP.

## Arms
Export — browser only, no server function — the pre-formatted Excel questionnaire (The_Corporate_Supplier_Questionnaire_2026.xlsx) served as a static asset from public assets, downloaded via an HTML anchor with the `download` attribute. No data is populated server-side.

## Environment Variables
VITE_SUPABASE_URL — Supabase: Project Settings → API → Project URL — Netlify env var
VITE_SUPABASE_ANON_KEY — Supabase: Project Settings → API → anon / public key — Netlify env var

Both are VITE_-prefixed, so Vite inlines them into the client bundle; this is intended. The anon key is safe to expose because RLS restricts the anon role to insert-only with no read. No value ever appears in code or in any file committed to GitHub. At session start, confirm both exist before first use and prompt the builder for any that are missing.

Netlify secret scanning will flag these two keys because their values sit in the build output and the anon key is JWT-shaped. They are intentionally public. Commit a `netlify.toml` at the repo root with, under `[build.environment]`, `SECRETS_SCAN_OMIT_KEYS = "VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY"`. If smart detection still flags the value on this plan, safelist it with `SECRETS_SCAN_SMART_DETECTION_OMIT_VALUES` (set via Netlify MCP). Never set `SECRETS_SCAN_ENABLED=false`; that removes protection for a genuinely leaked key.

## Supabase
Project: "The Corporate Space" — does not exist yet. At the start of the v2.0 build session, confirm this name with the builder, then create the project via Supabase MCP before any database work. Region: EU (Frankfurt), since GDPR applies. Plan: Free — pauses after roughly a week without traffic; the builder accepts a manual wake in the dashboard if the portal sits idle between submission waves.

Build this schema — authoritative until docs/supabase-setup.md exists:
submissions: company_name, contact_name, contact_email, route, consent_given, csv_file_path, created_at
questionnaire_responses: submission_id (FK to submissions), every ESRS questionnaire field listed in docs/product-spec.md Data Architecture (e1_*, e2_*, e3_*, e4_*, e5_*, s2_*, g1_*), created_at
Storage bucket: one private bucket for the uploaded CSVs (name at Claude Code's discretion; record it in docs/supabase-setup.md). Private — not publicly listable or readable.

RLS — build these policies, never skip:
submissions: anon — insert-only. No read, update, or delete.
questionnaire_responses: anon — insert-only. No read, update, or delete.
Storage bucket: anon — upload (insert) only. No list or read. The EHS team retrieves files through the Supabase dashboard (service role), never through the public tool.

After setup, write docs/supabase-setup.md and update it at every save point that touches the database. It must contain: project name, project ID, project URL, plan, every table with field names and types, RLS policies per table, the storage bucket name and policy, notes for future sessions, and a last-updated line with date and session number. From the moment it exists, that file is the schema source of truth.

## Hard Rules
- API keys never in any frontend file or GitHub commit. The Supabase anon key is the one intentionally public value, safe only because RLS is insert-only; it lives in a Netlify env var.
- No authentication of any kind. This is a public tool: do not add Netlify Identity, Supabase Auth, or any login or account system.
- RLS: never disabled on any table. If a query fails, fix the policy or the query, never disable RLS to work around it. RLS is the only thing stopping the public anon key from reading every supplier's data.
- GDPR: the consent checkbox and the confirmed data statement are required on both submission paths before any data is written. Personal data collected: company name, contact name, contact email, plus any detail inside the uploaded CSV. Deletion requests go to sustainability@thecorporate.com. Supabase region: EU (Frankfurt).
- Netlify secret scanning: ship the `netlify.toml` with `SECRETS_SCAN_OMIT_KEYS` for the two public VITE keys (see Environment Variables). Never disable scanning entirely.

## Brand
Brand is governed by the the-corporate-brand skill at .claude/skills/the-corporate-brand/SKILL.md (installed in First Session Setup). Invoke it for any UI or visual work. The new screens (chooser, CSV upload, guided form, confirmation) must match the ported landing page.
Hard rules that hold even if the skill is not loaded:
- Palette: Ink #000000, Stone #B6B09F, Linen #EAE4D5, Chalk #F2F2F2 (page background), White #FFFFFF — never Tailwind gray defaults
- Accent: Acid Lime #C8F135 — maximum 2 uses per page, always on #000000, never on a light background — never Tailwind blue
- Fonts: Playfair Display (headlines), DM Sans 300 (body), DM Sans 500 (labels/emphasis), via Google Fonts CDN
- Square corners (border-radius: 0), no shadows, no blue links (underline + Ink only)
- The confirmation message is the one place to spend visual weight: large headline scale so it cannot be missed

## Business Rules
- Consent gate: no write to the database on any path until consent_given is true. Submit / Next stays disabled until the consent checkbox is ticked.
- EcoVadis branch: "Yes" writes a submissions row (route = ecovadis) first, then redirects to https://ecovadis.com (new tab, rel="noopener noreferrer"). "No" continues through the ESRS section steps. Save-before-redirect is required so the EcoVadis route is always traceable.
- The three identity fields (company_name, contact_name, contact_email) plus consent are the only required inputs. Every questionnaire field is optional; a submission with any subset of answers is valid and stored as-is.
- No conditional show/hide of questions beyond the EcoVadis branch. Suppliers who answer "No" see all six ESRS sections in order: E1, E2, E3, E5, E4, then S2/G1.
- A failed CSV upload writes no submissions row: show an error and let the supplier retry.
- route is exactly one of: ecovadis, csv_upload, fill_here.

Out of scope — do not build:
- Internal review dashboard for EHS/procurement (reads happen in the Supabase dashboard)
- Parsing the uploaded CSV into structured rows (it is stored as a raw file only)
- Saved progress, resume, or supplier accounts
- Local auto-save of in-progress answers
- Any email (no supplier confirmation, no EHS notification)
- Capturing or storing the EcoVadis scorecard link
- Submission tracker or percentage-responded view
- Automated EcoVadis scorecard validation

## Reference Docs
Read before building the related part:
- docs/product-spec.md — full module specs, UI sections, logic, arm detail, the verbatim ESRS question text, and the 14 acceptance criteria
- docs/supabase-setup.md — schema source of truth (created in the v2.0 build session)
- .claude/skills/the-corporate-brand/SKILL.md — full brand system
PROGRESS.md in the root is read at every session start per the Session Protocol.

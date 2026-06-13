# Product Spec — The Corporate Supplier Sustainability Portal 2026

**Version:** 2.0
**Date:** 13 June 2026
**Author:** Zyad Hatquai
**Status:** Confirmed

---

## Section 1 — Tool Summary

**Tool name:** The Corporate Supplier Sustainability Portal 2026

**What it does:** A public supplier portal that communicates The Corporate's ESRS-aligned sustainability programme and now collects supplier responses two ways. A supplier either uploads a completed questionnaire as a CSV file or fills the questionnaire in directly through a guided, step-by-step form. Both routes write to a Supabase database that The Corporate's EHS and procurement team pulls from.

**Who uses it:** Tier 1 supplier contacts — sustainability managers, EHS leads, and procurement representatives at supplier organisations — who receive the URL directly from The Corporate's procurement or EHS team. Access is public: anyone with the link can use it, no login.

**Why it exists:** The v1.0 portal handed suppliers an Excel file and routed them to EcoVadis, but there was no structured, trackable way to collect responses back — submissions arrived by email or shared drive, scattered and manual. This version closes that gap by capturing every response in one database, identifiable by supplier, in a single place the EHS team controls.

**Build status:** Iteration. The previous version (v1.0) was a static, single-page Tier 1 landing page (`supplier_onboarding.html`) with a download button and an outbound EcoVadis link, no database. This build (v2.0) adds a Supabase database, two structured submission paths, a guided multi-step questionnaire form, and a GDPR consent layer, and moves the frontend to React. The existing landing page content, copy, and brand carry forward and are ported into the new build.

---

## Section 2 — Classification

This section defines the architecture of the tool. Every downstream decision follows from this.

### Data Model

**Decision:** D3

| Label | What it means | This tool? |
|-------|--------------|-----------|
| D1 — Hardcoded | All data is written into the code by the developer. Users cannot input anything that persists. The tool displays what the developer put in. | No |
| D2 — Session | Data enters the tool during use and disappears when the tab closes. No database. Covers both uploaded files and form inputs. | No |
| D3 — Persisted | Data is written to a database and survives after the session ends. Supabase is required. | Yes |

**Reason:** Suppliers submit responses that the EHS team must retrieve and review later, and uploaded CSV files must be stored and retrievable after the session, so data must persist in a database.

**D3 is triggered if any of the following are true — check all that apply:**
- [x] Data must be retrievable after the session ends
- [x] Multiple sessions contribute to the same dataset
- [ ] An audit trail or history is needed
- [x] Data submitted by one person must be visible to another
- [ ] Results must be accessible via a URL after the session ends
- [x] Files uploaded by users must be stored and retrievable later

---

### Access Model

**Decision:** A1

| Label | What it means | This tool? |
|-------|--------------|-----------|
| A1 — Public | Anyone with the URL can use it. No login, no account required. | Yes |
| A2 — Authentication | Users must log in. All logged-in users see the same thing and have the same permissions. | No |
| A3 — Authorization | Users must log in and have different roles. Different roles see different data or have different permissions. | No |

**Reason:** The portal is distributed to Tier 1 suppliers as a direct link. Any supplier who receives the URL can submit immediately, with no account, by explicit decision of the builder. There is no saved progress and no return-and-resume: a submission is completed in one sitting.

> **Promotion rule:** Auth requires a database. If the access model is A2 or A3, the data model is D3 — even when all displayed content is fixed. D1/D2 combined with A2/A3 are not valid classifications; they resolve to D3. (Not triggered here — this tool is A1.)

---

### Tier

**Tier:** 2

| Tier | D+A combination | Stack | Deployment |
|------|----------------|-------|------------|
| 1 | D1+A1 or D2+A1 | Netlify only | Netlify |
| 2 | D3+A1 | Netlify + Supabase (no auth) | Netlify |
| 3 | D3+A2 or D3+A3 | Netlify + Supabase (auth + RLS) | Netlify |

A public page anyone can use, backed by a Supabase database that stores what they submit. No accounts, no roles, no permission logic. Note: although there is no authentication, Row Level Security is still required so the anonymous public role can write submissions but cannot read them back (see Section 6).

---

### Standalone or Stack

**This tool is:** Standalone — it does not share a database with any other tool. There is no internal review dashboard in this build; the EHS team reads submissions directly from the Supabase dashboard.

---

## Section 3 — Arms

Arms are capabilities added to the tool. They do not change the tier. Mark each arm active or not, and complete the detail only for active arms.

---

### AI API Arm

**Active:** No

---

### Export Arm

**Active:** Yes

| Detail | Answer |
|--------|--------|
| Format | XLSX (static asset download) |
| What is exported | The pre-formatted Excel workbook — `The_Corporate_Supplier_Questionnaire_2026.xlsx` — served as a static asset from the build's public assets folder. Suppliers download it to fill the questionnaire offline, then either return it through the CSV upload path or use it as a reference while filling the form in the browser. No data is populated server-side; the download is browser-native via an HTML anchor with the `download` attribute. No server function. |
| PDF design intent | N/A — format is XLSX only |

> This arm is unchanged from v1.0. It is the supplier's source document for the offline-then-upload (CSV) path.

---

### Email Arm

**Active:** No

> Confirmed in the interview: no confirmation email to the supplier and no notification to EHS. The flow ends on the confirmation screen, and the EHS team collects everything from the Supabase dashboard. No Resend account is required for this build.

---

### Scheduled Automation Arm

**Active:** No

---

## Section 4 — Stack and Deployment

### All Tiers

| Detail | Answer |
|--------|--------|
| Frontend framework | React + Vite + Tailwind — required for the multi-step form state, the three field types, client-side validation, the submit chooser, and the Supabase client calls |
| Deployment target | Netlify |
| Netlify MCP | Active — Netlify is connected via Claude Desktop Connectors. Claude Code will create the site, set environment variables, and deploy automatically. |

**GitHub — pre-build requirement for all Tier 1, 2, and 3 tools:**
The user creates the GitHub repo before the first Claude Code session. The `product-spec.md`, `CLAUDE.md`, and `PROGRESS.md` must be uploaded to the repo root before Claude Code opens. Claude Code assumes the repo exists, commits changes regularly, and pushes to main. It does not create or configure the repo.

> This is an existing repo carried over from v1.0. The current `supplier_onboarding.html` lives in it and is the content and copy reference for the React port of the landing page.

---

### CONDITIONAL: Supabase project — Tier 2

**Supabase project status:** New — Claude Code will create it at the start of the build session.

**Supabase plan:** Free — pauses after roughly one week of no traffic. Confirmed for now; the builder accepts that the tool may need a manual wake in the Supabase dashboard if it sits idle between submission waves. Upgrade to Pro later if the portal must stay always-on for supplier traffic.

**If new:**

| Detail | Answer |
|--------|--------|
| Proposed project name | the-corporate-space |
| Confirmed project name | **The Corporate Space** |

> Claude Code will pause at the start of the session, confirm the project name, and create the Supabase project via MCP before building anything. The project ID will be recorded in `docs/supabase-setup.md` once created. The project is named after the organisational context, not this tool, so it can hold future tools for The Corporate.

---

## Section 5 — Data Architecture

### Data Model is D3 — complete this section

This section is the input Claude Code uses to build the database schema via MCP. Describe tables and fields in plain language — Claude Code handles the technical implementation.

**What data is collected or stored in this tool:**

#### Identity and metadata (captured on every submission, all routes)

| Field name | Plain language label | Data type | Who provides it | Required? |
|-----------|---------------------|-----------|----------------|-----------|
| company_name | Company name | Text | Supplier (public form) | Yes |
| contact_name | Contact name | Text | Supplier (public form) | Yes |
| contact_email | Contact email | Text | Supplier (public form) | Yes |
| route | Submission route (`ecovadis` / `csv_upload` / `fill_here`) | Text | Automatic (set by the path taken) | Yes |
| consent_given | GDPR consent ticked | Boolean | Supplier (checkbox, must be true) | Yes |
| csv_file_path | Storage path of the uploaded CSV | Text | Automatic (CSV upload route only) | No |
| created_at | Date and time submitted | Timestamp | Automatic | Yes |

#### Questionnaire answers (fill-here route only — all optional)

Stored only for `route = fill_here`. Every field is optional: a supplier may submit with any subset filled. Question text is verbatim from the Excel questionnaire so both submission paths ask the same things.

| Field name | Question (verbatim) | Data type |
|-----------|---------------------|-----------|
| e1_scope1_emissions | Scope 1 emissions, last fiscal year | Number |
| e1_scope2_emissions | Scope 2 emissions, last fiscal year | Number |
| e1_scope3_emissions | Scope 3 emissions, last fiscal year | Number |
| e1_decarbonization_roadmap | Describe your top three decarbonization projects in progress or planned for the next 24 months, including estimated tCO2e reduction and the specific technology used | Long text |
| e1_implementation_barriers | What are the primary technical or financial barriers preventing a 50% reduction in Scope 1 and 2 emissions by 2030? | Long text |
| e2_substances_of_concern_weight | Total weight of substances of concern used in production | Number |
| e2_pfas_alternative_strategy | If products contain PFAS, detail your substitution roadmap, viable non-PFAS alternatives, and target phase-out date | Long text |
| e2_wastewater_management | Describe your industrial wastewater treatment process and the measures ensuring zero leakage of hazardous chemicals into local water systems | Long text |
| e3_water_stewardship_projects | Details on water-saving or closed-loop recycling projects, and how total water intensity has changed over three years | Long text |
| e3_scarcity_contingency | If in a high-water-stress region, the operational contingency plan for severe drought to ensure supply continuity | Long text |
| e5_design_for_circularity | How circularity is incorporated into the components you supply (design for disassembly, modularity, recycled content) | Long text |
| e5_waste_reduction_diversion | Strategy for Zero Waste to Landfill, primary waste streams, and recent recycling or upcycling initiatives | Long text |
| e4_site_impact_mitigation | Initiatives to minimise operational impact on local biodiversity (land use, native planting, light and noise reduction) | Long text |
| s2_human_rights_policy | Does your organisation have a formal Human Rights and Labour Rights Policy, aligned with the UN Guiding Principles on Business and Human Rights? | Yes/No |
| s2_human_rights_due_diligence | Have you conducted a human rights due diligence assessment of your Tier 1 and Tier 2 supply chains in the last 24 months? | Yes/No |
| s2_grievance_mechanism | Describe the grievance mechanism available to workers in your supply chain, and how many grievances were filed and resolved in the last 12 months | Long text |
| g1_conflict_minerals_policy | Does your organisation have a verified conflict minerals policy (3TG: tin, tantalum, tungsten, gold) in place, including OECD Due Diligence guidance compliance? | Yes/No |
| g1_supplier_code_of_conduct | Describe your supplier code of conduct, how compliance is monitored across your own supply chain, and any third-party audits in the last 24 months | Long text |

**Tables needed:**

| Table name | What it stores | Key fields |
|-----------|---------------|-----------|
| submissions | One row per submission, all three routes. The identity and metadata record. | company_name, contact_name, contact_email, route, consent_given, csv_file_path, created_at |
| questionnaire_responses | One row per `fill_here` submission, linked to `submissions` by submission id. Holds the ESRS answers. | submission_id (FK), plus every questionnaire field above |

> The CSV upload route does not parse the file into `questionnaire_responses`. It stores the raw file and records its path on the `submissions` row only.

**File storage:** Yes
Suppliers on the CSV path upload one completed questionnaire file (CSV, converted from the Excel). Files are stored in a Supabase Storage bucket and must be retrievable later by the EHS team via the Supabase dashboard. The storage path is written to `submissions.csv_file_path`. The bucket is **private** — not publicly listable or readable (see Section 6).

**Derived or calculated data:** No
No scoring, grading, or calculation. The tool stores what is submitted.

---

## Section 6 — Access and Permissions

### Access Model is A1 — no authentication, no roles, no auth configuration

There is no login, no sign-up, no user accounts, and no role system. The auth configuration table and the A2/A3 privacy note do not apply.

**Row Level Security still applies and is mandatory.** Even though the tool is public and unauthenticated, the database must not be world-readable — it holds supplier contact details and submitted answers (personal data under GDPR). The frontend talks to Supabase using the public anonymous (`anon`) key, so RLS must lock that role to insert-only.

**RLS rules — who can read and write what:**

| Table | User type | Can read | Can insert | Can update | Can delete |
|-------|----------|----------|------------|------------|------------|
| submissions | Unauthenticated (anon) | No | Yes | No | No |
| questionnaire_responses | Unauthenticated (anon) | No | Yes | No | No |

**Storage bucket policy:** the CSV bucket is private. The `anon` role may upload (insert) objects but may not list or read them. The EHS team retrieves files through the Supabase dashboard (service role), never through the public tool.

> Claude Code builds these RLS policies and the storage bucket policy during the build session via Supabase MCP. The anon role must be able to write a submission and upload a file, and must be unable to read any submission, response, or stored file back. The Supabase QA skill can verify this after the build. This insert-only-no-read posture is the security boundary that keeps a public tool from leaking every supplier's data.

---

## Section 7 — GDPR

### MANDATORY DECISION — outcome recorded below

**GDPR outcome:** Applies — personal data is collected through the tool's forms and uploads.

> **Scope rule:** GDPR applies here because the tool collects personal data (contact name and contact email, alongside company name) through its forms and through the uploaded CSV. The builder is based in the EU (Germany) and suppliers may be EU entities. This is not auth-login email under the Section 6 privacy note; it is data collected through a public form, which triggers the consent framework.

**Personal data collected:**
- Company name
- Contact name
- Contact email
- (Plus the uploaded CSV file, which may contain further identifiable detail entered by the supplier)

**Consent checkpoint on the form:** Yes — a checkbox and data statement must appear before submission, on **both** paths. On the CSV path the checkbox sits on the upload screen. On the fill-here path it sits on the main-info screen (step 1), so consent is captured before any data is written, including before the EcoVadis save-and-redirect.

**Data statement text shown to users at the point of collection:**
> Your submission is stored securely and used only to assess your organisation's sustainability disclosures for The Corporate's supplier assessment programme. You can request deletion at any time by contacting sustainability@thecorporate.com.

**Deletion mechanism:**
A supplier requests deletion by emailing `sustainability@thecorporate.com`. The Corporate's EHS team processes the request by removing the relevant row(s) from `submissions` and `questionnaire_responses` and deleting any associated CSV file from Supabase Storage, via the Supabase dashboard.

> This is a legal requirement in the EU. The consent checkbox, data statement, and deletion mechanism must be present before Claude Code marks the submission paths complete. Submission must be blocked on both paths until the checkbox is ticked.

---

## Section 8 — Screen and UI Structure

### Landing Page (single scrolling view)

- **Purpose:** Communicate The Corporate's sustainability expectations and route suppliers to a submission path.
- **What is visible:** Navigation bar with The Corporate logo; hero section; stats row; "Why We Are Asking" context section; "What Happens Next" timeline; the Excel download action; the **Submit** action; key resources cards; footer. Existing v1.0 content, copy, and brand are preserved and ported into React.
- **User actions:** Download the Excel questionnaire (static asset, browser download); click **Submit** to open the submission chooser; click resource links; contact EHS via the existing mailto link.
- **What happens next:** Download triggers the file; Submit opens the chooser; resource and mailto links behave as in v1.0.
- **Change from v1.0:** the standalone "Submit EcoVadis Scorecard" button is **removed** from the landing page. EcoVadis now lives inside the guided form (step 2). There is one front door: Submit.

### Submission Chooser

- **Purpose:** Let the supplier self-select how to submit.
- **What is visible:** Two clearly labelled options — "Upload completed questionnaire (CSV)" and "Fill in the questionnaire here" — presented in a modal or dedicated panel.
- **User actions:** Choose one option.
- **What happens next:** CSV option opens the CSV upload screen; fill-here option opens the guided form at step 1.

### CSV Upload Screen

- **Purpose:** Collect a completed questionnaire as a file plus the supplier's identity, and store both.
- **What is visible:** Short instructions on converting the Excel to CSV (e.g. in Excel, File → Save As → CSV); the identity fields (company name, contact name, contact email); the GDPR consent checkbox and data statement; a file picker that accepts a CSV; a submit button.
- **User actions:** Read instructions, enter identity fields, tick consent, choose the CSV file, submit.
- **What happens next:** The CSV file uploads to the private Supabase Storage bucket; a `submissions` row is written with `route = csv_upload` and `csv_file_path` set; the supplier lands on the confirmation screen. Submit is blocked until consent is ticked and a file is selected.

### Guided Form — Step 1: Main Info

- **Purpose:** Capture the supplier's identity and GDPR consent before anything is written.
- **What is visible:** Company name, contact name, contact email; the GDPR consent checkbox and data statement; a Next button; a progress indicator.
- **User actions:** Enter the three fields, tick consent, click Next.
- **What happens next:** Advances to step 2. Next is blocked until the three fields are filled and consent is ticked.

### Guided Form — Step 2: EcoVadis Branch

- **Purpose:** Route EcoVadis-rated suppliers out, everyone else into the questionnaire.
- **What is visible:** The question "Do you have a current EcoVadis scorecard?" with Yes / No.
- **User actions:** Choose Yes or No.
- **What happens next:**
  - **Yes** → write a `submissions` row with `route = ecovadis` (identity and consent from step 1, no questionnaire answers), then redirect the browser to `https://ecovadis.com` (new tab, `rel="noopener noreferrer"`). The flow ends.
  - **No** → continue to the ESRS section steps.

### Guided Form — Steps 3–8: ESRS Sections

- **Purpose:** Collect the questionnaire answers, one ESRS section per step.
- **What is visible:** One section per step in this order — Climate & Decarbonization (E1), Pollution & PFAS (E2), Water & Marine Resources (E3), Circular Economy & Waste (E5), Biodiversity & Ecosystems (E4), Social, Labour & Governance (S2/G1). Each step shows that section's questions using the correct field type (number, long text, or Yes/No dropdown), a progress indicator, and Back / Next controls. The final step shows a Submit button.
- **User actions:** Fill any subset of fields (all optional), move Back and Next, submit on the last step.
- **What happens next:** On submit, write a `submissions` row with `route = fill_here` plus a linked `questionnaire_responses` row holding all entered answers; land on the confirmation screen.

### Confirmation Screen (shared by all routes that submit)

- **Purpose:** Reassure the supplier that the submission was received, unmissably.
- **What is visible:** A large, prominent "Thank you — submission received" message (headline scale, not small body text), the supplier's company name echoed back, and a line stating that the EHS team will follow up if anything further is needed.
- **User actions:** Read; close or return to the landing page.
- **What happens next:** Nothing is written here; the write already happened on submit. No email is sent.

---

## Section 9 — Logic and Calculations

### The tool applies decision rules (no scoring or calculation)

**What is decided:** the EcoVadis branch, consent gating, and partial-submission handling.

**Inputs:** the EcoVadis Yes/No answer (step 2); the consent checkbox (step 1 / CSV screen); the questionnaire fields (all optional).

**Rules:**
- Consent gate — no write to the database on any path until `consent_given` is true. Submit / Next is disabled until the checkbox is ticked.
- EcoVadis branch — Yes writes a `submissions` row (`route = ecovadis`) **first**, then redirects to ecovadis.com; No proceeds through the ESRS steps. The save-before-redirect order is required so the EcoVadis route is always traceable.
- Optional fields — every questionnaire field is optional; a submission with any subset of answers is valid and is written as-is. No field blocks submission except the consent checkbox and the three required identity fields.
- No conditional show/hide of questions beyond the EcoVadis branch. All ESRS sections are shown in sequence to suppliers who answer No.

**Output:** persisted rows in `submissions` and (for fill-here) `questionnaire_responses`; for EcoVadis, a persisted `submissions` row plus an outbound redirect.

**Edge cases:** missing optional answers are stored empty; the three identity fields and consent are the only hard requirements; if the CSV upload fails, no `submissions` row is written and the supplier is shown an error and can retry.

---

## Section 10 — Brand and Visual Direction

**Brand reference:** the-corporate-brand skill file — upload flat to the repo root; Claude Code installs it to `.claude/skills/` in the first session. All new screens (chooser, CSV upload, guided form, confirmation) follow it, matching the existing landing page.

**Visual feel:** Professional and corporate — corporate minimalism, restraint over decoration. Precise, direct, composed, authoritative.

Hard brand rules Claude Code must enforce throughout:
- Fonts: Playfair Display (headlines), DM Sans 300 (body), DM Sans 500 (labels/emphasis) — Google Fonts CDN.
- Colours: Ink (#000000), Stone (#B6B09F), Linen (#EAE4D5), Chalk (#F2F2F2), White (#FFFFFF), Acid Lime (#C8F135).
- Acid Lime: maximum 2 uses per page, always on #000000, never directly on a light background.
- Square corners (border-radius: 0) and no shadows on all elements.
- No blue links — underline + Ink only.
- The confirmation message is the one place to spend visual weight: large headline scale so it cannot be missed.

**Reference or inspiration:** the existing `supplier_onboarding.html` landing page is the visual baseline; the new screens extend it without introducing new patterns.

---

## Section 11 — API and Credentials

| Service | What it does in this tool | Key required | Where key is stored |
|---------|--------------------------|-------------|-------------------|
| Supabase | Database (two tables) and private file storage for the uploaded CSVs | Anon key (public, browser-safe) | Netlify environment variable |

The frontend uses the Supabase **anon key**, which is safe to expose in the browser because RLS restricts the anon role to insert-only with no read (Section 6). There are no server functions in this build (no AI, no email), so the **service role key** is not used by the tool — it is only used by The Corporate when reading data in the Supabase dashboard, and is never placed in any project file.

> **Security rule — no exceptions:** No API key, token, password, or credential may appear in any HTML file, any JavaScript file, or any file committed to GitHub. The Supabase anon key is stored as a Netlify environment variable. Claude Code must enforce this regardless of tier.

**Credentials readiness — for every active arm:**

| Credential | Status | Where to get it |
|-----------|--------|----------------|
| Supabase anon key | Created by Claude Code with the project | Supabase dashboard → Project Settings → API |
| Supabase service role key | Created by Claude Code with the project (used only in the dashboard, not by the tool) | Supabase dashboard → Project Settings → API |

> Nothing for the builder to create before the build session. Supabase is created by Claude Code via MCP. No AI provider account and no Resend account are needed.

---

## Section 12 — Out of Scope — Phase 2

| Deferred feature | Reason it is deferred |
|-----------------|----------------------|
| Internal review dashboard for EHS/procurement | The team reads submissions directly from the Supabase dashboard for now; a review tool would be a separate Tier 3 build in a stack |
| Parsing the uploaded CSV into structured rows | Confirmed: the CSV is stored as a raw file only; parsing is not needed to validate the collection workflow |
| Saved progress, resume, or supplier accounts | Public, one-sitting submission by decision; accounts would move the tool to Tier 3 |
| Optional local auto-save of in-progress answers | Offered and not taken; submission is strictly one sitting |
| Any email — supplier confirmation or EHS notification | Confirmed no email; EHS pulls from Supabase |
| Capturing and storing the EcoVadis scorecard link | The EcoVadis branch redirects out and records only the route; the scorecard itself is handled on EcoVadis |
| Submission tracker / percentage of suppliers responded | Belongs to a future internal review tool |
| Automated EcoVadis scorecard validation | Requires EcoVadis API access; deferred pending availability |

---

## Section 13 — Acceptance Criteria

| # | What to verify | Expected result | Done? |
|---|---------------|-----------------|-------|
| 1 | Landing page loads and all sections render | Nav, hero, stats, context, timeline, Download, Submit, resources, footer all visible; no layout breaks; standalone EcoVadis button is absent | [ ] |
| 2 | Brand identity applied throughout, including new screens | Playfair / DM Sans fonts, correct colour tokens, square corners, no shadows, Acid Lime used at most twice per page on black, no blue links | [ ] |
| 3 | Excel download works | "Download" triggers browser download of `The_Corporate_Supplier_Questionnaire_2026.xlsx`; file is the correct, complete workbook | [ ] |
| 4 | Submit opens the chooser with two options | Clicking Submit shows "Upload CSV" and "Fill in here"; each opens its respective screen | [ ] |
| 5 | CSV path stores file and record | Entering identity, ticking consent, selecting a CSV and submitting uploads the file to the private bucket and creates a `submissions` row with `route = csv_upload` and `csv_file_path` set | [ ] |
| 6 | Guided form step 1 gates on consent and identity | Next is disabled until company, contact name, contact email are filled and consent is ticked | [ ] |
| 7 | EcoVadis = Yes saves then redirects | A `submissions` row is written with `route = ecovadis` and the browser then opens ecovadis.com | [ ] |
| 8 | EcoVadis = No walks all six ESRS sections | Sections render in order with correct field types; all fields optional; Back/Next and progress work | [ ] |
| 9 | Fill-here submit stores structured data | Final submit creates a `submissions` row (`route = fill_here`) and a linked `questionnaire_responses` row with the entered answers | [ ] |
| 10 | Confirmation screen is large and unmissable | "Thank you — submission received" renders at headline scale with the company name echoed; shown for both submitting paths | [ ] |
| 11 | GDPR consent blocks submission on both paths | Neither path can submit with the consent box unticked; data statement and deletion contact are visible at the point of collection | [ ] |
| 12 | RLS is insert-only for anon | A public read attempt against `submissions`, `questionnaire_responses`, and the storage bucket returns nothing; inserts and uploads succeed | [ ] |
| 13 | Responsive on mobile | All views usable below 768px; no horizontal overflow; buttons full-width and tappable; form steps readable | [ ] |
| 14 | Deploys to Netlify | Live URL loads on desktop and mobile; Excel downloads from the deployed site; a test submission appears in Supabase | [ ] |

---

## Section 14 — Build Path

**This tool's tier:** Tier 2

---

### Pre-build steps — complete these before opening Claude Code

- [ ] Tool Architect skill — interview complete, this spec written and confirmed
- [ ] Project Governor skill — CLAUDE.md and PROGRESS.md produced from this spec (this replaces the v1.0 CLAUDE.md/PROGRESS.md — the spec version has changed)
- [ ] GitHub repo ready (existing repo from v1.0)
- [ ] product-spec.md (this file) uploaded to the repo root
- [ ] CLAUDE.md uploaded to the repo root
- [ ] PROGRESS.md uploaded to the repo root
- [ ] the-corporate-brand skill file uploaded to the repo root
- [ ] `The_Corporate_Supplier_Questionnaire_2026.xlsx` present in the repo for the build's public assets
- [ ] Netlify connected (skip — Netlify MCP is active)
- [ ] No credentials to prepare (Supabase is created by Claude Code)

> Claude Code organizes these files into the correct folder structure (docs/, .claude/skills/) automatically at the start of the first session.

---

### Tier 2 — build session

- [ ] Open Claude Code in the project folder
- [ ] Claude Code runs First Session Setup: creates docs/, moves reference files, installs the-corporate-brand skill
- [ ] Claude Code reads product-spec.md, CLAUDE.md, and PROGRESS.md
- [ ] **Supabase — new project:** Claude Code proposes "The Corporate Space", waits for confirmation, then creates the project via Supabase MCP
- [ ] Claude Code builds the two tables and the insert-only anon RLS policies, plus the private CSV storage bucket and its policy, via Supabase MCP
- [ ] Claude Code creates `docs/supabase-setup.md`
- [ ] Claude Code builds the frontend in React + Vite + Tailwind, porting the existing landing page content and removing the standalone EcoVadis button
- [ ] Claude Code wires the submit chooser, CSV upload, guided form, EcoVadis branch (save-then-redirect), and confirmation screen
- [ ] Test locally before deploying, including a full submission on each route and a check that anon cannot read data back
- [ ] **Netlify MCP active:** Claude Code sets the Supabase anon key as a Netlify environment variable and deploys automatically
- [ ] Optional post-build: run the Supabase QA skill to verify schema, RLS, and the storage policy

---

## Section 15 — Open Questions

| Question | Who answers it | Blocking? |
|----------|---------------|-----------|
| Real URLs for "View Document" (Supplier Code of Conduct) and "View Policy" (Global Environmental Policy) | Builder — provide during the build, or leave as `#` with a code comment | No — carried over from v1.0 |
| Is "Why We Are Asking" body copy already finalised in the live page, or does Claude Code reuse/refine it during the port? | Claude Code reuses existing copy; builder reviews | No — resolves during build |
| Confirm the live deployed URL after the first v2.0 deploy | Builder | No — confirmed after deploy |
| Is the EcoVadis redirect a new-tab open or a full in-place redirect? Spec assumes new tab (`target="_blank"`, `rel="noopener noreferrer"`) for consistency with v1.0 | Builder — confirm or adjust during build | No — sensible default set |

---

## Section 16 — Tool Version History

| Version | Date | What changed in the tool |
|---------|------|--------------------------|
| v1.0 | 12 June 2026 | Initial build — static, single-page Tier 1 supplier onboarding landing page (`supplier_onboarding.html`): context, stats, timeline, Excel download, standalone EcoVadis link, resources. No database. |
| v2.0 | 13 June 2026 | Upgrade to Tier 2. Added a Supabase database ("The Corporate Space") and two structured submission paths: a CSV upload stored as a raw file in private Supabase Storage, and a guided multi-step questionnaire form saved as structured data across `submissions` and `questionnaire_responses`. Moved EcoVadis inside the form as a branch with save-before-redirect; removed the standalone EcoVadis button. Added a GDPR consent framework (checkbox, data statement, deletion mechanism) on both paths, with insert-only anon RLS so the public cannot read submissions back. Added a large, prominent confirmation screen. Migrated the frontend to React + Vite + Tailwind. |

---

*This spec is written for Claude Code. It assumes zero prior context. Every decision, rule, and requirement must be explicit enough that the builder can hand this document to Claude Code without a single verbal explanation.*

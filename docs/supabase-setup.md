# Supabase Setup — The Corporate Supplier Sustainability Portal 2026

> Schema source of truth. From the moment this file exists it overrides the
> provisional schema in CLAUDE.md. Update it at every save point that touches
> the database (any table, policy, or bucket change).

## Project

| Detail | Value |
|--------|-------|
| Project name | **The Corporate Space** |
| Project ID / ref | `vbtuzjprzusqsxawmgyl` |
| Project URL | `https://vbtuzjprzusqsxawmgyl.supabase.co` |
| Organization | SustainOS - AI Lab (`igorsavpakvljlfkdrje`) |
| Region | `eu-central-1` (EU — Frankfurt; GDPR) |
| Postgres | 17 |
| Plan | Free (pauses after ~1 week idle; manual wake in dashboard if needed) |

> **Deviation from CLAUDE.md, noted:** CLAUDE.md said to *create* the project this
> session. The project "The Corporate Space" already existed (created 2026-06-13,
> empty), in the correct GDPR region, with the exact mandated name — so this build
> used the existing project rather than creating a duplicate. This matches the
> game-plan decision to use an existing project.

## Credentials (never committed)

The frontend uses the **anon key** only, supplied through Netlify env vars
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). The anon key is intentionally
public and browser-safe **only because RLS is insert-only with no read**. It is
never written to any file in the repo. Retrieve it from:
Supabase dashboard → Project Settings → API (anon / public key).
The **service role key** is used only by the EHS team in the dashboard to read
submissions and download CSVs; it never appears in the tool or the repo.

## Tables

### `submissions`
One row per submission, all three routes. Identity + GDPR consent + metadata.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default `gen_random_uuid()` (client may supply its own UUID) |
| company_name | text | not null |
| contact_name | text | not null |
| contact_email | text | not null |
| route | text | not null, check in (`ecovadis`, `csv_upload`, `fill_here`) |
| consent_given | boolean | not null |
| csv_file_path | text | nullable (set on `csv_upload` route only) |
| created_at | timestamptz | not null, default `now()` |

### `questionnaire_responses`
One row per `fill_here` submission, linked to `submissions`. All ESRS answers optional.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default `gen_random_uuid()` |
| submission_id | uuid | not null, FK → `submissions(id)` on delete cascade (indexed) |
| e1_scope1_emissions | numeric | Scope 1 emissions, last fiscal year |
| e1_scope2_emissions | numeric | Scope 2 emissions, last fiscal year |
| e1_scope3_emissions | numeric | Scope 3 emissions, last fiscal year |
| e1_decarbonization_roadmap | text | Top three decarbonization projects |
| e1_implementation_barriers | text | Barriers to 50% Scope 1&2 cut by 2030 |
| e2_substances_of_concern_weight | numeric | Total weight of substances of concern |
| e2_pfas_alternative_strategy | text | PFAS substitution roadmap |
| e2_wastewater_management | text | Industrial wastewater treatment process |
| e3_water_stewardship_projects | text | Water-saving / closed-loop projects |
| e3_scarcity_contingency | text | High-water-stress contingency plan |
| e5_design_for_circularity | text | Circularity in supplied components |
| e5_waste_reduction_diversion | text | Zero Waste to Landfill strategy |
| e4_site_impact_mitigation | text | Biodiversity impact mitigation |
| s2_human_rights_policy | text | Yes/No — formal Human Rights policy |
| s2_human_rights_due_diligence | text | Yes/No — due diligence in last 24 months |
| s2_grievance_mechanism | text | Grievance mechanism description |
| g1_conflict_minerals_policy | text | Yes/No — verified 3TG conflict minerals policy |
| g1_supplier_code_of_conduct | text | Supplier code of conduct description |
| created_at | timestamptz | not null, default `now()` |

> Number-typed questions are `numeric`; Yes/No and long-text are `text`. Column
> names match the form's `field.name` exactly, so the insert payload needs no
> mapping layer.

## Row Level Security (RLS)

RLS is **enabled** on both tables. The `anon` role is **insert-only**; there is
no SELECT/UPDATE/DELETE policy, so reads/updates/deletes default-deny. This is
the security boundary that stops the public anon key from reading supplier data.
**Never disable RLS to work around a query failure** — fix the policy or query.

| Table | Policy | Command | Role | Clause |
|-------|--------|---------|------|--------|
| submissions | `submissions_anon_insert` | INSERT | anon | `with check (true)` |
| questionnaire_responses | `questionnaire_responses_anon_insert` | INSERT | anon | `with check (true)` |

**Verified (2026-06-13, session 2):** simulating `role anon` in a rolled-back
transaction, INSERT into both tables succeeded (FK link works without read-back),
and SELECT returned 0 rows on both. Live anon REST read-back test deferred to the
deployed site (outbound HTTP to supabase.co is blocked in the build environment).

## Storage

| Detail | Value |
|--------|-------|
| Bucket | `supplier-csv-uploads` |
| Public? | No (private — not listable or readable without the service role) |
| Policy | `supplier_csv_anon_upload` on `storage.objects`: INSERT for `anon` `with check (bucket_id = 'supplier-csv-uploads')` |

The `anon` role may upload one CSV per submission; it cannot list, read, update,
or delete objects. The EHS team downloads files via the Supabase dashboard.

## Migrations applied (this build)

1. `v2_create_submissions_and_questionnaire_responses` — both tables, FK, index, RLS + anon insert policies.
2. `v2_create_supplier_csv_uploads_bucket` — private bucket + anon insert-only storage policy.

## Security advisor notes (accepted)

- **`rls_policy_always_true` (WARN, ×2)** on the two insert policies — *by design*.
  Suppliers may submit any subset of answers, so the insert check is intentionally
  unrestricted. The boundary is the absence of read/update/delete policies, not the
  insert check.
- **`anon_security_definer_function_executable` (WARN)** on `public.rls_auto_enable()`
  — *pre-existing, benign, not created by this build*. It is an event-trigger
  function (tied to the `ensure_rls` event trigger) that auto-enables RLS on any new
  `public` table — a protective safety net. It is SECURITY DEFINER because event
  triggers require it; invoking it via RPC outside an event-trigger context simply
  errors. Left untouched intentionally.

## Notes for future sessions

- The Free plan pauses after ~1 week idle. If REST calls 5xx after a quiet period,
  wake the project in the Supabase dashboard.
- To process a GDPR deletion request (sent to sustainability@thecorporate.com):
  delete the matching `submissions` row (cascades to `questionnaire_responses`) and
  delete any associated object from the `supplier-csv-uploads` bucket, via the dashboard.
- New tables created later will get RLS auto-enabled by the `ensure_rls` trigger, but
  you must still add explicit policies — auto-enable with no policy = default-deny everything.

---
_Last updated: 13 June 2026 — session 2 (v2.0 build: schema, RLS, storage bucket created)._

import { createClient } from '@supabase/supabase-js'

// One Supabase client for the whole app, built from the two VITE_ env vars
// (inlined at build time). The anon key is browser-safe ONLY because RLS is
// insert-only with no read — see docs/supabase-setup.md. No service role key
// ever touches the client.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Surfaces a clear console error in dev/preview if the env is not wired,
  // rather than failing deep inside a request. We fall back to harmless
  // placeholders below so createClient never throws and the page still
  // renders (the landing/form UI works); any submission then fails with the
  // friendly error the services surface to the supplier.
  console.error(
    'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
      '(see .env.example for local dev; Netlify env vars for deploy).',
  )
}

// createClient throws on an empty URL, which would blank the whole site if the
// env is misconfigured. Use valid-format placeholders as a safety net.
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseAnonKey || 'placeholder-anon-key'

export const supabase = createClient(url, key, {
  auth: {
    // Public, no-login tool — no session to persist or refresh.
    persistSession: false,
    autoRefreshToken: false,
  },
})

export const STORAGE_BUCKET = 'supplier-csv-uploads'

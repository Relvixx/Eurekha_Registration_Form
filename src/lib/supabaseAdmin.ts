import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service_role key.
// This file must ONLY be imported from server-side code (API routes, server components).
// NEVER import this from client components.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase server configuration');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

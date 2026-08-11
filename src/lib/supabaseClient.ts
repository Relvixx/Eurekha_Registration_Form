import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key are expected to be defined in environment variables.
// For security, only the anon key is used on the client side.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-project.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-anon-key'
);

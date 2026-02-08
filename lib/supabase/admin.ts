import { createClient } from '@supabase/supabase-js';

// Note: This client should ONLY be used in secure server-side contexts (API routes)
// as it uses the SERVICE_ROLE_KEY which can bypass Row Level Security.

// Note: This client should ONLY be used in secure server-side contexts (API routes)
// as it uses the SERVICE_ROLE_KEY which can bypass Row Level Security.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

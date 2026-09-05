import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Next.js App Router OAuth Callback Handler
 * Handles Google OAuth redirect and exchanges code for session
 */
export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fpofksbeiaftslekpbcr.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_zc9k-stbZUAM9ZzUN3PKHQ_xYE0Fxyq';

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      // Sync user profile if user role metadata was provided
      const role = data.user.user_metadata?.role || 'farmer';
      const fullName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'Google User';

      await supabase.from('profiles').upsert([
        {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          role: role,
          updated_at: new Date().toISOString(),
        },
      ]);
    }
  }

  // Redirect back to root dashboard after OAuth complete
  return NextResponse.redirect(`${requestUrl.origin}/`);
}

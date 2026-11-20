import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * Route Handler POST /auth/signout
 * Déconnecte proprement l'administrateur côté serveur et efface les cookies de session.
 */
export async function POST(request: NextRequest) {
  const supabase = createClient();
  await supabase.auth.signOut();

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = '/login';
  redirectUrl.search = '';

  return NextResponse.redirect(redirectUrl, { status: 302 });
}

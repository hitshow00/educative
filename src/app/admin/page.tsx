import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import type { Resource } from '@/types/resource';
import { AdminDashboard } from './AdminDashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Administration | Soutien Scolaire Maroc',
  robots: { index: false, follow: false },
};

/**
 * Page protégée côté serveur (défense en profondeur en plus du middleware).
 * Vérifie la session via `supabase.auth.getUser()` (jamais `getSession()` côté serveur).
 */
export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/admin');
  }

  const { data } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dl.monsite.ma';

  return (
    <AdminDashboard
      userEmail={user.email || 'Administrateur'}
      initialResources={(data as Resource[]) || []}
      siteUrl={siteUrl}
    />
  );
}

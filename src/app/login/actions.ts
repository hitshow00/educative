'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export interface LoginActionState {
  error: string | null;
}

/**
 * Server Action de connexion administrateur via Supabase Auth (Email / Mot de passe).
 */
export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const nextPath = String(formData.get('next') || '/admin');

  if (!email || !password) {
    return { error: 'Veuillez renseigner votre adresse e-mail et votre mot de passe.' };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: 'Identifiants invalides. Vérifiez votre e-mail et votre mot de passe.',
    };
  }

  // Protection contre l'open redirect : on autorise uniquement les chemins internes commençant par /
  const safeRedirect =
    nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/admin';

  revalidatePath('/admin', 'layout');
  redirect(safeRedirect);
}

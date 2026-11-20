'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Loader2, Lock } from 'lucide-react';
import { loginAction, type LoginActionState } from './actions';

const INITIAL_STATE: LoginActionState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-sm py-2.5 transition-colors flex items-center justify-center gap-2"
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{pending ? 'Connexion...' : 'Se connecter'}</span>
    </button>
  );
}

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction] = useFormState(loginAction, INITIAL_STATE);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Connexion Administrateur</h1>
          <p className="text-xs text-slate-500">
            Authentifiez-vous avec votre compte Supabase pour accéder au tableau de bord privé.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
              Adresse e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@monsite.ma"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {state.error && (
            <p
              role="alert"
              className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5"
            >
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>
      </div>
    </main>
  );
}

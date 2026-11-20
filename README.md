# Edu Maroc Safelink (Blogger + Supabase + Vercel)

Plateforme complète de gestion et de téléchargement sécurisé pour site éducatif marocain (Baccalauréat, Régional, Brevet).

## Structure du projet

- `supabase/schema.sql` : Schéma PostgreSQL complet (table `resources`, RLS, RPC `increment_download`).
- `blogger/snippet.html` : Script HTML/CSS/JS autonome à coller avant `</body>` dans Blogger.
- `src/app/download/[slug]/` : Page Safelink Mobile-First avec compte à rebours 8s et 3 emplacements publicitaires.
- `src/app/admin/page.tsx` : Panneau d'administration privé (Supabase Auth + CRUD + statistiques + générateur HTML Blogger).

## Mise en route rapide

1. **Supabase** : Exécutez `supabase/schema.sql` dans *SQL Editor*, désactivez les inscriptions publiques (*Authentication → Providers → Email*), puis créez votre compte admin dans *Authentication → Users*.
2. **Variables d'environnement** : Renseignez `.env.local` (local) et *Vercel → Environment Variables* (production) avec `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. **Développement local** :
   ```bash
   npm install
   npm run dev
   ```
4. **Déploiement Vercel** : Poussez sur GitHub, importez dans Vercel, ajoutez les variables d'environnement et liez votre sous-domaine `dl.monsite.ma` (CNAME → `cname.vercel-dns.com`).
5. **Blogger** : Collez `blogger/snippet.html` avant `</body>` dans *Thème → Modifier le code HTML*, puis insérez `<div class="edu-download-box" data-slug="votre-slug"></div>` dans vos articles.

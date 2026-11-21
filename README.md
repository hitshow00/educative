# ExamQuiz.ma — Plateforme Interactive de Quiz & Suivi Examens Maroc

Application web autonome (**Next.js 14 App Router + TypeScript + Tailwind CSS + Supabase**) conçue pour aider les élèves au Maroc à préparer activement leurs examens certifiants :

- **2ème Bac** (Examen National : Maths, PC, SVT, Philosophie, Anglais)
- **1ère Bac** (Examen Régional : Français œuvres intégrales, Histoire-Géo, Éducation Islamique)
- **3ème Année Collège** (Brevet / Régional BIOF : Maths, PC, SVT)
- **6ème Primaire** (Examen Provincial : Maths, Français, Activité Scientifique)

## Fonctionnalités principales

- **2 modes de quiz** : *Entraînement* (correction immédiate + explication + piège d'examen + combo) et *Examen Blanc* (chrono + note finale `/20` + mention marocaine + option *Refaire uniquement mes erreurs*).
- **Suivi de progression (`/progression`)** : note globale estimée `/20`, maîtrise par matière, série quotidienne (streak), points XP, historique récent.
- **Révision ciblée (`/a-revoir`)** : liste automatique des chapitres `< 12/20` en priorité puis des chapitres non tentés.
- **Persistance hybride** : sauvegarde immédiate dans `localStorage` + synchronisation cloud Supabase (`user_attempts`) si l'utilisateur est connecté.
- **Panneau Admin (`/admin`)** : protégé par `@supabase/ssr`, permet de publier de nouveaux quiz par import JSON.

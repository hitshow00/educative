import type { Quiz } from '@/types/quiz';
import { TRACKS_2BAC } from './tracks-2bac';
import { TRACKS_1BAC } from './tracks-1bac';
import { TRACKS_3AC } from './tracks-3ac';
import { TRACKS_6EME } from './tracks-6eme';

/**
 * Catalogue complet des parcours 10 niveaux (Facile → Boss Examen) :
 * - 2ème Bac : Maths (10 niv.), Physique-Chimie (10 niv.), SVT (10 niv.)
 * - 1ère Bac : Français Régional (10 niv.)
 * - 3ème Année Collège : Maths Brevet (10 niv.)
 * - 6ème Primaire : Maths Provincial (10 niv.)
 * Total : 60 niveaux progressifs prêts à jouer + extensibles via /admin (Supabase).
 */
export const CURRICULUM_QUIZZES: Quiz[] = [
  ...TRACKS_2BAC,
  ...TRACKS_1BAC,
  ...TRACKS_3AC,
  ...TRACKS_6EME,
];

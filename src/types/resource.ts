/**
 * Types TypeScript partagés pour la table `resources` (Supabase)
 */

export interface Resource {
  id: string;
  slug: string;
  title: string;
  subject: string;
  grade_level: string;
  file_size: string;
  file_format: string;
  external_url: string;
  download_count: number;
  created_at: string;
  updated_at?: string;
}

export type ResourceInput = Omit<Resource, 'id' | 'download_count' | 'created_at' | 'updated_at'>;

/**
 * Niveaux scolaires officiels au Maroc (préparation examens)
 */
export const GRADE_LEVELS = [
  '2Bac',
  '1Bac',
  'Tronc Commun',
  '3ème Année Collège (Brevet)',
  '2ème Année Collège',
  '1ère Année Collège',
  'Primaire (6ème)',
  'Concours Post-Bac',
] as const;

/**
 * Matières principales enseignées au Maroc
 */
export const SUBJECTS = [
  'Mathématiques',
  'Physique-Chimie',
  'SVT',
  'Français',
  'Arabe',
  'Anglais',
  'Philosophie',
  'Histoire-Géographie',
  'Éducation Islamique',
  'Économie & Gestion',
  'Sciences de l\'Ingénieur',
  'Informatique',
  'Pack Multi-Matières',
] as const;

/**
 * Formats de fichiers courants
 */
export const FILE_FORMATS = ['PDF', 'ZIP / PDF', 'RAR', 'DOCX', 'PPTX', 'Pack Complet'] as const;

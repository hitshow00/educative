/**
 * Génère un slug URL propre à partir d'un titre en français
 * Exemple : "Pack Maths 2ème Bac PC & SVT" -> "pack-maths-2eme-bac-pc-svt"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD') // Décompose les caractères accentués (é -> e + ´)
    .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Supprime la ponctuation et symboles
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Évite les tirets multiples
    .replace(/^-+|-+$/g, ''); // Supprime les tirets en début/fin
}

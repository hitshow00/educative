import type { Quiz, QuizDifficulty, QuizQuestion } from '@/types/quiz';

function make6emeStage(
  stage: number,
  slugSuffix: string,
  title: string,
  description: string,
  examSource: string | undefined,
  questions: QuizQuestion[]
): Quiz {
  const difficulty: QuizDifficulty =
    stage <= 3 ? 'Facile' : stage <= 6 ? 'Moyen' : stage <= 9 ? 'Difficile' : 'Boss Examen';

  return {
    id: `6eme-math-s${stage}`,
    slug: `6eme-${slugSuffix}-niv-${stage}`,
    level: '6eme',
    branch: 'Primaire',
    subject: 'Mathématiques',
    stage_number: stage,
    chapter_title: title,
    description,
    exam_type: 'Provincial',
    difficulty,
    estimated_minutes: stage === 10 ? 6 : 3,
    exam_source: examSource,
    questions,
  };
}

export const TRACKS_6EME: Quiz[] = [
  make6emeStage(1, 'maths-operations', 'Opérations & Nombres Décimaux', 'Addition, soustraction et multiplication de décimaux.', undefined, [
    { id: 'p1-1', question_text: 'Combien vaut 12,5 + 3,75 ?', options: ['15,25', '16,25', '16,15', '15,80'], correct_index: 1, explanation: '12,50 + 3,75 = 16,25.' },
    { id: 'p1-2', question_text: 'Combien vaut 0,4 × 100 ?', options: ['4', '40', '400', '0,04'], correct_index: 1, explanation: 'Multiplier par 100 décale la virgule de 2 rangs vers la droite : 40.' },
  ]),
  make6emeStage(2, 'maths-multiples', 'Multiples, Diviseurs & Critères', 'Reconnaître les multiples de 2, 3, 5 et 9.', undefined, [
    { id: 'p2-1', question_text: 'Parmi ces nombres, lequel est divisible par 9 ?', options: ['124', '234', '310', '412'], correct_index: 1, explanation: '2 + 3 + 4 = 9, qui est un multiple de 9.' },
    { id: 'p2-2', question_text: 'Un nombre divisible à la fois par 2 et par 5 se termine toujours par :', options: ['5', '0', '2', '1'], correct_index: 1, explanation: 'Pour être pair ET multiple de 5, le chiffre des unités doit être 0.' },
  ]),
  make6emeStage(3, 'maths-fractions', 'Fractions : Somme & Produit', 'Mettre au même dénominateur et simplifier.', undefined, [
    { id: 'p3-1', question_text: 'Que vaut 1/2 + 1/4 ?', options: ['2/6', '3/4', '1/6', '2/4'], correct_index: 1, explanation: '2/4 + 1/4 = 3/4.' },
    { id: 'p3-2', question_text: 'Que vaut 2/3 × 3/5 ?', options: ['2/5', '5/8', '6/8', '1/5'], correct_index: 0, explanation: '(2×3)/(3×5) = 6/15 = 2/5.' },
  ]),
  make6emeStage(4, 'maths-proportionnalite', 'Proportionnalité & Pourcentages', 'Règle de trois, remises et échelles.', undefined, [
    { id: 'p4-1', question_text: 'Un sac de 100 DH a une réduction de 20 %. Son nouveau prix est :', options: ['80 DH', '120 DH', '20 DH', '90 DH'], correct_index: 0, explanation: '100 - 20 = 80 DH.' },
    { id: 'p4-2', question_text: 'Si 3 cahiers coûtent 18 DH, combien coûtent 5 cahiers ?', options: ['25 DH', '30 DH', '36 DH', '24 DH'], correct_index: 1, explanation: '1 cahier = 6 DH, donc 5 × 6 = 30 DH.' },
  ]),
  make6emeStage(5, 'maths-unites', 'Conversions d’Unités (m, g, L, ha)', 'Convertir longueurs, masses, capacités et surfaces.', undefined, [
    { id: 'p5-1', question_text: 'Combien de mètres y a-t-il dans 2,5 km ?', options: ['250 m', '2500 m', '25 000 m', '25 m'], correct_index: 1, explanation: '1 km = 1000 m ⇒ 2,5 × 1000 = 2500 m.' },
    { id: 'p5-2', question_text: '1 hectare (1 ha) correspond à :', options: ['100 m²', '1 000 m²', '10 000 m²', '100 000 m²'], correct_index: 2, explanation: '1 ha = 1 hm² = 10 000 m².' },
  ]),
  make6emeStage(6, 'maths-angles', 'Angles & Triangles', 'Somme des angles et bissectrice.', undefined, [
    { id: 'p6-1', question_text: 'La somme des 3 angles d’un triangle vaut toujours :', options: ['90°', '180°', '360°', '100°'], correct_index: 1, explanation: 'Toujours 180° dans tout triangle.' },
    { id: 'p6-2', question_text: 'Dans un triangle rectangle, un angle aigu mesure 35°. L’autre angle aigu mesure :', options: ['55°', '65°', '145°', '45°'], correct_index: 0, explanation: '90° - 35° = 55°.' },
  ]),
  make6emeStage(7, 'maths-aires-provincial', 'Aires & Périmètres (Annales Provinciales)', 'Rectangle, triangle, disque et trapèze.', 'Examen Provincial 2023', [
    { id: 'p7-1', question_text: 'Quelle est l’aire d’un triangle de base 10 cm et de hauteur 6 cm ?', options: ['60 cm²', '30 cm²', '16 cm²', '20 cm²'], correct_index: 1, explanation: 'Aire = (Base × Hauteur) / 2 = 60 / 2 = 30 cm².', exam_source: 'Provincial 2023' },
    { id: 'p7-2', question_text: 'Le périmètre d’un carré de côté 7 cm vaut :', options: ['49 cm', '28 cm', '14 cm', '21 cm'], correct_index: 1, explanation: '4 × 7 = 28 cm.', exam_source: 'Provincial 2022' },
  ]),
  make6emeStage(8, 'maths-volumes-provincial', 'Volumes : Cube, Pavé & Cylindre', 'Calcul de volumes en cm³ et conversion en litres.', 'Examen Provincial 2023', [
    { id: 'p8-1', question_text: 'Quel est le volume d’un pavé droit de dimensions 5 cm, 4 cm et 3 cm ?', options: ['12 cm³', '60 cm³', '30 cm³', '20 cm³'], correct_index: 1, explanation: 'V = L × l × h = 5 × 4 × 3 = 60 cm³.', exam_source: 'Provincial 2023' },
    { id: 'p8-2', question_text: '1 dm³ est égal à :', options: ['1 cL', '1 L', '10 L', '100 L'], correct_index: 1, explanation: 'Relation fondamentale : 1 dm³ = 1 L.', exam_source: 'Provincial 2024' },
  ]),
  make6emeStage(9, 'maths-vitesse-provincial', 'Vitesse Moyenne & Temps (Annales)', 'v = d / t et calculs de durées.', 'Examen Provincial 2024', [
    { id: 'p9-1', question_text: 'Un bus parcourt 240 km en 3 heures. Quelle est sa vitesse moyenne ?', options: ['60 km/h', '80 km/h', '70 km/h', '90 km/h'], correct_index: 1, explanation: '240 / 3 = 80 km/h.', exam_source: 'Provincial 2024' },
    { id: 'p9-2', question_text: 'Combien de minutes y a-t-il dans 2 h 30 min ?', options: ['130 min', '150 min', '120 min', '230 min'], correct_index: 1, explanation: '2 × 60 + 30 = 150 minutes.', exam_source: 'Provincial 2023' },
  ]),
  make6emeStage(10, 'maths-boss-provincial', '🏆 BOSS : Simulation Examen Provincial 6ème', 'Épreuve finale de synthèse du Certificat d’Études Primaires.', 'Compilation Examens Provinciaux 2022–2024', [
    { id: 'p10-1', question_text: 'Calculez : (3/4 + 1/4) × 5 =', options: ['5', '4', '20', '1'], correct_index: 0, explanation: '3/4 + 1/4 = 1, puis 1 × 5 = 5.', exam_source: 'Provincial 2024' },
    { id: 'p10-2', question_text: 'Un réservoir cubique de 2 m d’arête a une capacité de :', options: ['8 000 L', '800 L', '80 L', '8 L'], correct_index: 0, explanation: 'V = 2³ = 8 m³ = 8 000 dm³ = 8 000 L.', exam_source: 'Provincial 2023' },
    { id: 'p10-3', question_text: 'Sur une carte à l’échelle 1/100 000, 4 cm représentent en réalité :', options: ['400 m', '4 km', '40 km', '400 km'], correct_index: 1, explanation: '4 × 100 000 cm = 400 000 cm = 4 000 m = 4 km.', exam_source: 'Provincial 2024' },
  ]),
];

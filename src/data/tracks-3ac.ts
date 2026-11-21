import type { Quiz, QuizDifficulty, QuizQuestion } from '@/types/quiz';

function make3AcStage(
  subject: 'Mathématiques' | 'Physique-Chimie',
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
    id: `3ac-${subject.toLowerCase().slice(0, 4)}-s${stage}`,
    slug: `3ac-${slugSuffix}-niv-${stage}`,
    level: '3ac',
    branch: 'Parcours BIOF / Général',
    subject,
    stage_number: stage,
    chapter_title: title,
    description,
    exam_type: stage >= 6 ? 'Régional' : 'Local',
    difficulty,
    estimated_minutes: stage === 10 ? 7 : 4,
    exam_source: examSource,
    questions,
  };
}

export const TRACKS_3AC: Quiz[] = [
  // =========================================================================
  // 3ÈME ANNÉE COLLÈGE — MATHÉMATIQUES (10 NIVEAUX : BASES → BOSS RÉGIONAL)
  // =========================================================================
  make3AcStage('Mathématiques', 1, 'maths-identites', 'Développement & Identités Remarquables', 'Maîtriser (a+b)², (a-b)² et a²-b² sans erreur de signe.', undefined, [
    { id: 'c1-1', question_text: 'Développez (x - 3)² :', options: ['x² - 9', 'x² - 6x + 9', 'x² + 6x + 9', 'x² - 3x + 9'], correct_index: 1, explanation: '(a - b)² = a² - 2ab + b² = x² - 6x + 9.' },
    { id: 'c1-2', question_text: 'Factorisez x² - 25 :', options: ['(x - 5)²', '(x - 5)(x + 5)', '(x + 5)²', 'x(x - 25)'], correct_index: 1, explanation: 'Identité a² - b² = (a - b)(a + b).' },
    { id: 'c1-3', question_text: 'Développez (2x + 1)² :', options: ['4x² + 1', '4x² + 4x + 1', '2x² + 4x + 1', '4x² + 2x + 1'], correct_index: 1, explanation: '(2x)² + 2(2x)(1) + 1² = 4x² + 4x + 1.' },
  ]),
  make3AcStage('Mathématiques', 2, 'maths-racines', 'Racines Carrées & Simplification', 'Calculs avec √a, √(a×b) et suppression du radical au dénominateur.', undefined, [
    { id: 'c2-1', question_text: 'Que vaut √(16 + 9) ?', options: ['7', '5', '25', '12'], correct_index: 1, explanation: '√(16 + 9) = √25 = 5. Attention : √(a+b) ≠ √a + √b !' },
    { id: 'c2-2', question_text: 'Simplifiez √50 :', options: ['25√2', '5√2', '2√5', '10√5'], correct_index: 1, explanation: '√50 = √(25×2) = 5√2.' },
    { id: 'c2-3', question_text: 'Que vaut (√7)² ?', options: ['49', '7', '14', '√14'], correct_index: 1, explanation: 'Pour tout a ≥ 0, (√a)² = a.' },
  ]),
  make3AcStage('Mathématiques', 3, 'maths-puissances', 'Puissances & Écriture Scientifique', 'Règles de calcul sur 10ⁿ et notation scientifique.', undefined, [
    { id: 'c3-1', question_text: 'Quelle est l’écriture scientifique de 450 000 ?', options: ['45 × 10⁴', '4,5 × 10⁵', '0,45 × 10⁶', '4,5 × 10⁴'], correct_index: 1, explanation: 'Un seul chiffre non nul avant la virgule : 4,5 × 10⁵.' },
    { id: 'c3-2', question_text: 'Que vaut 10³ × 10⁻⁵ ?', options: ['10⁸', '10⁻²', '10⁻¹⁵', '10²'], correct_index: 1, explanation: 'On additionne les exposants : 3 + (-5) = -2.' },
    { id: 'c3-3', question_text: 'Que vaut (2³)² ?', options: ['2⁵', '2⁶', '2⁹', '4⁵'], correct_index: 1, explanation: '(a^m)^n = a^(m×n) = 2⁶ = 64.' },
  ]),
  make3AcStage('Mathématiques', 4, 'maths-pythagore', 'Théorème de Pythagore & Réciproque', 'Calculer une longueur ou démontrer qu’un triangle est rectangle.', undefined, [
    { id: 'c4-1', question_text: 'Dans ABC rectangle en A, AB = 3 cm et AC = 4 cm. Combien vaut BC ?', options: ['5 cm', '7 cm', '12 cm', '25 cm'], correct_index: 0, explanation: 'BC² = 9 + 16 = 25 ⇒ BC = 5 cm.' },
    { id: 'c4-2', question_text: 'Un triangle a pour côtés 6 cm, 8 cm et 10 cm. Est-il rectangle ?', options: ['Non', 'Oui, car 6² + 8² = 10² (36 + 64 = 100)', 'On ne peut pas savoir', 'Il est équilatéral'], correct_index: 1, explanation: 'Par la réciproque de Pythagore, 100 = 36 + 64 donc le triangle est rectangle.' },
    { id: 'c4-3', question_text: 'Si BC = 13 cm (hypoténuse) et AB = 5 cm, combien vaut AC ?', options: ['8 cm', '12 cm', '14 cm', '18 cm'], correct_index: 1, explanation: 'AC² = 13² - 5² = 169 - 25 = 144 ⇒ AC = 12 cm.' },
  ]),
  make3AcStage('Mathématiques', 5, 'maths-thales', 'Théorème de Thalès & Parallélisme', 'Rapports égaux et démonstration de droites parallèles.', undefined, [
    { id: 'c5-1', question_text: 'Pour appliquer le théorème direct de Thalès dans ABC (M∈[AB], N∈[AC]), il faut obligatoirement :', options: ['ABC rectangle', '(MN) // (BC)', 'AB = AC', 'M milieu'], correct_index: 1, explanation: 'Le parallélisme (MN) // (BC) est indispensable.' },
    { id: 'c5-2', question_text: 'Si (MN)//(BC) avec AM = 2, AB = 6 et BC = 9, combien vaut MN ?', options: ['3', '4,5', '6', '18'], correct_index: 0, explanation: 'MN/BC = AM/AB ⇒ MN/9 = 2/6 = 1/3 ⇒ MN = 3.' },
    { id: 'c5-3', question_text: 'Pour prouver que (MN) // (BC) avec la réciproque de Thalès, on vérifie l’égalité AM/AB = AN/AC et :', options: ['L’ordre des points A, M, B et A, N, C', 'Que l’angle A = 90°', 'Que MN = BC', 'Rien d’autre'], correct_index: 0, explanation: 'Il faut toujours préciser que les points sont alignés dans le même ordre !' },
  ]),
  make3AcStage('Mathématiques', 6, 'maths-trigo', 'Trigonométrie dans le Triangle Rectangle', 'Cosinus, sinus, tangente et relation cos²x + sin²x = 1.', undefined, [
    { id: 'c6-1', question_text: 'Dans un triangle rectangle, le cosinus d’un angle aigu vaut :', options: ['Opposé / Hypoténuse', 'Adjacent / Hypoténuse', 'Opposé / Adjacent', 'Hypoténuse / Adjacent'], correct_index: 1, explanation: 'SOH-CAH-TOA : Cos = Adjacent / Hypoténuse.' },
    { id: 'c6-2', question_text: 'Pour tout angle aigu x, que vaut cos²(x) + sin²(x) ?', options: ['0', '1', '2', 'tan(x)'], correct_index: 1, explanation: 'Relation fondamentale : cos²(x) + sin²(x) = 1.' },
    { id: 'c6-3', question_text: 'Si sin(x) = 3/5, combien vaut cos(x) ?', options: ['2/5', '4/5', '1/5', '5/3'], correct_index: 1, explanation: 'cos²(x) = 1 - 9/25 = 16/25 ⇒ cos(x) = 4/5.' },
  ]),
  make3AcStage('Mathématiques', 7, 'maths-equations-regional', 'Équations & Inéquations (Annales 3AC)', 'Équations produits et changement de sens des inéquations.', 'Régional 3AC 2023 • Casa-Settat', [
    { id: 'c7-1', question_text: 'Résoudre 3x - 6 = x + 4 :', options: ['x = 1', 'x = 5', 'x = -1', 'x = 2'], correct_index: 1, explanation: '2x = 10 ⇒ x = 5.', exam_source: 'Régional 3AC 2023' },
    { id: 'c7-2', question_text: 'Quelles sont les solutions de l’équation produit (2x - 4)(x + 3) = 0 ?', options: ['2 et -3', '-2 et 3', '4 et -3', '2 et 3'], correct_index: 0, explanation: '2x - 4 = 0 ⇒ x = 2 ; ou x + 3 = 0 ⇒ x = -3.', exam_source: 'Régional 3AC 2022' },
    { id: 'c7-3', question_text: 'Résoudre l’inéquation -2x ≤ 8 :', options: ['x ≤ -4', 'x ≥ -4', 'x ≤ 4', 'x ≥ 4'], correct_index: 1, explanation: 'Diviser par -2 (négatif) inverse le sens : x ≥ -4.', exam_tip: 'Piège n°1 au Régional 3AC : inverser le symbole quand on divise par un négatif.', exam_source: 'Régional 3AC 2023' },
  ]),
  make3AcStage('Mathématiques', 8, 'maths-fonctions-regional', 'Fonctions Linéaires & Affines (Annales)', 'Coefficient directeur, image, antécédent et droite.', 'Régional 3AC 2023 • Rabat-Salé', [
    { id: 'c8-1', question_text: 'Une fonction linéaire f vérifie f(2) = 10. Son expression est :', options: ['f(x) = x + 8', 'f(x) = 5x', 'f(x) = 2x + 10', 'f(x) = 10x'], correct_index: 1, explanation: 'a = f(2)/2 = 5 ⇒ f(x) = 5x.', exam_source: 'Régional 3AC 2023' },
    { id: 'c8-2', question_text: 'Soit g(x) = 3x - 5. Quel est l’antécédent de 7 ?', options: ['16', '4', '2', '-4'], correct_index: 1, explanation: '3x - 5 = 7 ⇒ 3x = 12 ⇒ x = 4.', exam_source: 'Régional 3AC 2022' },
    { id: 'c8-3', question_text: 'La droite représentative de g(x) = -2x + 4 coupe l’axe des ordonnées au point :', options: ['(0 ; 4)', '(4 ; 0)', '(0 ; -2)', '(2 ; 0)'], correct_index: 0, explanation: 'L’ordonnée à l’origine est b = g(0) = 4, donc le point (0 ; 4).', exam_source: 'Régional 3AC 2023' },
  ]),
  make3AcStage('Mathématiques', 9, 'maths-repere-vecteurs-regional', 'Repère, Distance & Équation de Droite', 'Milieu d’un segment, distance AB et droites perpendiculaires.', 'Régional 3AC 2024 • Fès-Meknès', [
    { id: 'c9-1', question_text: 'Soient A(1 ; 2) et B(5 ; 6). Les coordonnées du milieu I de [AB] sont :', options: ['I(3 ; 4)', 'I(6 ; 8)', 'I(2 ; 2)', 'I(4 ; 4)'], correct_index: 0, explanation: 'x_I = (1+5)/2 = 3 et y_I = (2+6)/2 = 4.', exam_source: 'Régional 3AC 2024' },
    { id: 'c9-2', question_text: 'Deux droites de coefficients directeurs m et m\' sont perpendiculaires si :', options: ['m = m\'', 'm × m\' = -1', 'm + m\' = 0', 'm × m\' = 1'], correct_index: 1, explanation: 'Condition d’orthogonalité : m × m\' = -1.', exam_source: 'Régional 3AC 2023' },
    { id: 'c9-3', question_text: 'La distance entre A(0 ; 0) et B(3 ; 4) dans un repère orthonormé vaut :', options: ['7', '5', '25', '12'], correct_index: 1, explanation: 'AB = √((3-0)² + (4-0)²) = √25 = 5.', exam_source: 'Régional 3AC 2024' },
  ]),
  make3AcStage('Mathématiques', 10, 'maths-boss-regional', '🏆 BOSS : Simulation Régional Maths 3AC', 'Épreuve complète de synthèse du Brevet Maroc (2022–2024).', 'Compilation Examens Régionaux 3AC 2022–2024', [
    { id: 'c10-1', question_text: 'Résoudre le système : x + y = 10 et x - y = 2.', options: ['x = 6, y = 4', 'x = 4, y = 6', 'x = 8, y = 2', 'x = 5, y = 5'], correct_index: 0, explanation: 'En additionnant : 2x = 12 ⇒ x = 6, puis y = 10 - 6 = 4.', exam_source: 'Régional 3AC 2024' },
    { id: 'c10-2', question_text: 'Un cube d’arête 3 cm subit un agrandissement de rapport k = 2. Son nouveau volume vaut :', options: ['54 cm³', '108 cm³', '216 cm³', '27 cm³'], correct_index: 2, explanation: 'V\' = k³ × V = 2³ × 27 = 8 × 27 = 216 cm³.', exam_tip: 'Pour les volumes, on multiplie toujours par k³ (et non k ou k²).', exam_source: 'Régional 3AC 2023' },
    { id: 'c10-3', question_text: 'La moyenne de la série de notes (10, 12, 14, 16) est :', options: ['12', '13', '14', '12,5'], correct_index: 1, explanation: '(10 + 12 + 14 + 16) / 4 = 52 / 4 = 13.', exam_source: 'Régional 3AC 2022' },
    { id: 'c10-4', question_text: 'Quelle droite est parallèle à (D) : y = 3x - 1 ?', options: ['y = -3x + 2', 'y = 3x + 7', 'y = (1/3)x - 1', 'y = -x + 3'], correct_index: 1, explanation: 'Deux droites parallèles ont exactement le même coefficient directeur (ici m = 3).', exam_source: 'Régional 3AC 2024' },
  ]),
];

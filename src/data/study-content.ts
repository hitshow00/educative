import type { LevelId, Quiz } from '@/types/quiz';

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
}

export interface GuidedExercise {
  title: string;
  examSource?: string;
  statement: string;
  hint1: string;
  hint2: string;
  solution: string;
  bareme: string;
}

export interface CourseSummary {
  id: string;
  quizSlug: string;
  level: LevelId;
  subject: string;
  titleFr: string;
  titleAr: string;
  readMinutes: number;
  keyPoints: string[];
  formulas: string[];
  solvedExample: {
    problem: string;
    steps: string[];
  };
  examTraps: string[];
  flashcards: FlashcardItem[];
  exercise: GuidedExercise;
}

/**
 * Bibliothèque complète des Résumés de Cours, Flashcards et Exercices Guidés
 * couvrant les 4 niveaux officiels au Maroc (2Bac, 1Bac, 3AC, 6ème).
 */
export const COURSE_SUMMARIES: CourseSummary[] = [
  // ===================== 2ÈME BAC — MATHÉMATIQUES =====================
  {
    id: 'sum-2bac-limites',
    quizSlug: '2bac-maths-limites-bases-niv-1',
    level: '2bac',
    subject: 'Mathématiques',
    titleFr: 'Limites, Continuité & Croissances Comparées',
    titleAr: 'النهايات والاتصال ومبرهنة القيم الوسيطية',
    readMinutes: 3,
    keyPoints: [
      'Pour une fraction rationnelle en ±∞, la limite est égale à la limite du rapport des termes de plus haut degré.',
      'Le Théorème des Valeurs Intermédiaires (TVI) exige 3 conditions : f continue sur [a,b], strictement monotone, et f(a)×f(b) < 0.',
      'En +∞, l’exponentielle l’emporte sur les puissances xⁿ, qui elles-mêmes l’emportent sur ln(x).',
    ],
    formulas: [
      'lim(x→+∞) (ln x) / x = 0   |   lim(x→0⁺) x · ln(x) = 0',
      'lim(x→+∞) e^x / xⁿ = +∞   |   lim(x→-∞) xⁿ · e^x = 0',
      'lim(x→0) (e^x - 1) / x = 1   |   lim(x→1) ln(x) / (x - 1) = 1',
    ],
    solvedExample: {
      problem: 'Calculer lim(x→+∞) (x - ln x).',
      steps: [
        'On factorise par x (le terme dominant) : x - ln(x) = x · (1 - (ln x)/x).',
        'Or lim(x→+∞) (ln x)/x = 0 (limite usuelle).',
        'Donc lim(x→+∞) (1 - (ln x)/x) = 1, et par produit lim(x→+∞) (x - ln x) = +∞.',
      ],
    },
    examTraps: [
      'Ne jamais écrire "+∞ - ∞ = 0" : factorisez toujours par le terme dominant.',
      'Pour le TVI, ne pas oublier d’écrire les 3 conditions exactes pour éviter de perdre 0,5 pt.',
    ],
    flashcards: [
      { id: 'fc1', front: 'lim(x→+∞) (ln x) / x = ?', back: '0 (croissance comparée)' },
      { id: 'fc2', front: 'lim(x→-∞) x · e^x = ?', back: '0 (l’exponentielle l’emporte)' },
      { id: 'fc3', front: 'Les 3 conditions du TVI (unicité) ?', back: '1) Continue sur [a,b]  2) Strictement monotone  3) f(a)×f(b) < 0' },
      { id: 'fc4', front: 'Équation de la tangente en a ?', back: 'y = f\'(a)(x - a) + f(a)' },
    ],
    exercise: {
      title: 'Application TVI & Limite (Type National 2Bac)',
      examSource: 'Examen National 2023 • PC/SVT',
      statement: 'Soit g(x) = x³ + x - 1 sur ℝ. Montrer que l’équation g(x) = 0 admet une unique solution α dans ]0 ; 1[.',
      hint1: 'Calculez g\'(x) pour montrer que g est strictement croissante sur ℝ.',
      hint2: 'Calculez g(0) et g(1) puis vérifiez le signe de g(0) × g(1).',
      solution:
        '1) g est une fonction polynôme donc continue et dérivable sur ℝ.\n2) g\'(x) = 3x² + 1 > 0 pour tout x ∈ ℝ, donc g est strictement croissante sur [0 ; 1].\n3) g(0) = -1 < 0 et g(1) = 1 > 0, donc g(0)×g(1) < 0.\nConclusion (TVI) : g(x) = 0 admet une unique solution α ∈ ]0 ; 1[.',
      bareme: '0,25 pt continuité • 0,5 pt dérivée et monotonie • 0,25 pt g(0)×g(1) < 0 & conclusion',
    },
  },
  {
    id: 'sum-2bac-complexes',
    quizSlug: '2bac-maths-complexes-national-niv-7',
    level: '2bac',
    subject: 'Mathématiques',
    titleFr: 'Nombres Complexes & Géométrie',
    titleAr: 'الأعداد العقدية والهندسة العقدية',
    readMinutes: 3,
    keyPoints: [
      'Tout nombre complexe non nul s’écrit z = r(cos θ + i sin θ) = r·e^(iθ) avec r = |z| = √(a² + b²).',
      'Le rapport (z_C - z_A)/(z_B - z_A) donne à la fois le rapport des distances AC/AB (module) et l’angle orienté (AB, AC) (argument).',
      'Une rotation de centre Ω(ω) et d’angle θ s’écrit z\' - ω = e^(iθ)(z - ω).',
    ],
    formulas: [
      'i² = -1   |   |z| = √(a² + b²)   |   z · z̄ = |z|²',
      'Formule de Moivre : (cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ)',
      'Triangle équilatéral : (z_C - z_A)/(z_B - z_A) = e^(±iπ/3)',
    ],
    solvedExample: {
      problem: 'Écrire z = √3 + i sous forme trigonométrique.',
      steps: [
        'Module : |z| = √((√3)² + 1²) = √4 = 2.',
        'Factorisation : z = 2(√3/2 + i·1/2).',
        'On reconnaît cos(π/6) = √3/2 et sin(π/6) = 1/2, donc z = 2[cos(π/6) + i sin(π/6)].',
      ],
    },
    examTraps: [
      'Vérifiez toujours le quadrant (signe de cos θ et sin θ) pour ne pas vous tromper sur le signe de l’argument.',
      'Dans une rotation, attention au sens : (z\' - ω) = e^(iθ)(z - ω) (avec un signe MOINS devant ω).',
    ],
    flashcards: [
      { id: 'cx1', front: 'Si (z_C - z_A)/(z_B - z_A) = i, quelle est la nature de ABC ?', back: 'Triangle rectangle isocèle en A (AB = AC et angle π/2).' },
      { id: 'cx2', front: 'Module et argument de z = 1 + i ?', back: '|z| = √2 et arg(z) ≡ π/4 [2π].' },
      { id: 'cx3', front: 'Formule de la translation de vecteur u(b) ?', back: 'z\' = z + b.' },
    ],
    exercise: {
      title: 'Nature d’un triangle par les complexes',
      examSource: 'Examen National 2022 • Normale',
      statement: 'On donne A(1), B(1 + i) et C(2 + i). Calculer (z_C - z_B) / (z_A - z_B) et en déduire la nature du triangle ABC.',
      hint1: 'Calculez séparément z_C - z_B et z_A - z_B.',
      hint2: 'Divisez les deux complexes (pensez à multiplier par -i si le dénominateur est -i).',
      solution:
        'z_C - z_B = (2 + i) - (1 + i) = 1.\nz_A - z_B = 1 - (1 + i) = -i.\nDonc (z_C - z_B)/(z_A - z_B) = 1 / (-i) = i.\nModule = 1 ⇒ BC = BA ; Argument = π/2 ⇒ (BA) ⊥ (BC).\nLe triangle ABC est rectangle isocèle en B.',
      bareme: '0,5 pt calcul du rapport • 0,5 pt interprétation module + argument',
    },
  },

  // ===================== 2ÈME BAC — PHYSIQUE-CHIMIE =====================
  {
    id: 'sum-2bac-ondes',
    quizSlug: '2bac-pc-ondes-mecaniques-niv-1',
    level: '2bac',
    subject: 'Physique-Chimie',
    titleFr: 'Ondes Mécaniques, Lumineuses & Diffraction',
    titleAr: 'الموجات الميكانيكية والضوئية والحيود',
    readMinutes: 3,
    keyPoints: [
      'Une onde mécanique transporte de l’énergie SANS transport de matière.',
      'La fréquence ν d’une onde lumineuse est invariante quel que soit le milieu traversé.',
      'La diffraction met en évidence la nature ondulatoire de la lumière (tache centrale de largeur L = 2λD/a).',
    ],
    formulas: [
      'v = d / Δt   |   λ = v · T = v / N',
      'Diffraction : θ = λ / a (rad)   |   L = 2 · λ · D / a',
      'Indice de réfraction : n = c / v = λ₀ / λ',
    ],
    solvedExample: {
      problem: 'Un laser (λ = 600 nm) éclaire une fente a = 0,2 mm. Calculer L sur un écran placé à D = 2 m.',
      steps: [
        'Convertir en mètres : λ = 600×10⁻⁹ m, a = 0,2×10⁻³ m, D = 2 m.',
        'Appliquer L = 2λD / a = (2 × 600×10⁻⁹ × 2) / (2×10⁻⁴).',
        'Résultat : L = 1,2 × 10⁻² m = 1,2 cm.',
      ],
    },
    examTraps: [
      'Conversions obligatoires en SI : nm → 10⁻⁹ m, µm → 10⁻⁶ m, mm → 10⁻³ m.',
      'Attention : L est la largeur TOTALE de la tache centrale (facteur 2), tandis que θ est le demi-angle.',
    ],
    flashcards: [
      { id: 'op1', front: 'Formule de la largeur L de la tache centrale ?', back: 'L = 2 · λ · D / a' },
      { id: 'op2', front: 'Quelle grandeur reste constante entre air et verre ?', back: 'La fréquence ν (nu)' },
      { id: 'op3', front: 'Constante de temps τ d’un dipôle RC ?', back: 'τ = R × C (en secondes)' },
      { id: 'op4', front: 'Formule de Thomson (circuit LC) ?', back: 'T₀ = 2π · √(L · C)' },
    ],
    exercise: {
      title: 'Détermination de la largeur d’un fil par diffraction',
      examSource: 'Examen National 2023 • PC',
      statement: 'Avec un laser λ = 632 nm et un écran à D = 1,5 m, on mesure une tache centrale L = 1,9 cm. Calculer le diamètre a du fil.',
      hint1: 'Isolez a dans la relation L = 2 · λ · D / a.',
      hint2: 'Convertissez λ en m (632×10⁻⁹) et L en m (1,9×10⁻²).',
      solution:
        'De L = 2λD/a, on déduit a = 2λD / L.\na = (2 × 632×10⁻⁹ × 1,5) / (1,9×10⁻²) ≈ 9,98×10⁻⁵ m ≈ 0,10 mm.',
      bareme: '0,5 pt expression littérale de a • 0,5 pt application numérique + unité',
    },
  },
  {
    id: 'sum-2bac-acide-base',
    quizSlug: '2bac-pc-acide-base-national-niv-7',
    level: '2bac',
    subject: 'Physique-Chimie',
    titleFr: 'Acide-Base, pH, pKa & Dosages',
    titleAr: 'التحولات الكيميائية والحمض-قاعدة والمعايرة',
    readMinutes: 3,
    keyPoints: [
      'Un acide cède un proton H⁺ ; une base capte un proton H⁺.',
      'Le taux d’avancement final τ = xf / xmax permet de savoir si la réaction est totale (τ = 1) ou limitée (τ < 1).',
      'Sur un diagramme de prédominance : pH < pKa ⇒ acide HA prédomine ; pH > pKa ⇒ base A⁻ prédomine.',
    ],
    formulas: [
      'pH = -log([H₃O⁺])   ⇔   [H₃O⁺] = 10⁻ᵖᴴ',
      'pH = pKa + log([A⁻] / [HA])',
      'À l’équivalence d’un dosage : C_A · V_A = C_B · V_BE',
    ],
    solvedExample: {
      problem: 'On dose V_A = 20 mL d’acide éthanoïque par NaOH (C_B = 0,1 mol/L). V_BE = 15 mL. Calculer C_A.',
      steps: [
        'À l’équivalence : C_A · V_A = C_B · V_BE.',
        'C_A = (C_B · V_BE) / V_A = (0,1 × 15) / 20.',
        'C_A = 0,075 mol/L = 7,5 × 10⁻² mol/L.',
      ],
    },
    examTraps: [
      'Dans C_A·V_A = C_B·V_BE, V_A et V_BE peuvent rester en mL à condition d’être dans la MÊME unité.',
      'La constante d’équilibre K ne dépend que de la température, jamais des concentrations initiales.',
    ],
    flashcards: [
      { id: 'ch1', front: 'Si pH = pKa, que vaut le rapport [A⁻]/[HA] ?', back: '1 (donc [A⁻] = [HA])' },
      { id: 'ch2', front: 'Relation entre xf, xmax et τ ?', back: 'τ = xf / xmax (totale si τ = 1)' },
      { id: 'ch3', front: 'Anode ou Cathode : où a lieu l’oxydation ?', back: 'À l’ANODE (Anode = Oxydation)' },
    ],
    exercise: {
      title: 'Calcul du taux d’avancement final τ',
      examSource: 'Examen National 2023 • Normale',
      statement: 'Une solution d’acide HA de concentration C = 10⁻² mol/L a un pH = 3,4. Calculer τ et conclure.',
      hint1: 'Pour un acide dans l’eau, τ = [H₃O⁺]_f / C = 10⁻ᵖᴴ / C.',
      hint2: 'Calculez 10⁻³˙⁴ ≈ 3,98×10⁻⁴ puis divisez par 10⁻².',
      solution:
        'τ = [H₃O⁺]_f / C = 10⁻³˙⁴ / 10⁻² ≈ 0,0398 ≈ 4 %.\nComme τ < 1, la réaction de l’acide HA avec l’eau est limitée (acide faible).',
      bareme: '0,5 pt relation de τ • 0,5 pt valeur numérique et conclusion',
    },
  },

  // ===================== 2ÈME BAC — SVT =====================
  {
    id: 'sum-2bac-svt-energie',
    quizSlug: '2bac-svt-glycolyse-respiration-niv-1',
    level: '2bac',
    subject: 'SVT',
    titleFr: 'Consommation de la Matière Organique & ATP',
    titleAr: 'استهلاك المادة العضوية وتدفق الطاقة (ATP)',
    readMinutes: 3,
    keyPoints: [
      'La glycolyse (hyaloplasme, sans O₂) est l’étape commune à la respiration et à la fermentation : 1 Glucose → 2 Acides pyruviques + 2 ATP + 2 NADH,H⁺.',
      'En présence d’O₂, la mitochondrie assure l’oxydation complète (Cycle de Krebs + Chaîne respiratoire) : bilan = 36 à 38 ATP.',
      'En absence d’O₂, la fermentation (lactique sans CO₂, alcoolique avec CO₂) laisse un résidu organique riche en énergie : bilan = 2 ATP.',
    ],
    formulas: [
      'Respiration : C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + 38 ATP',
      'Fermentation lactique : C₆H₁₂O₆ → 2 CH₃-CHOH-COOH + 2 ATP',
      'Contraction musculaire : Ca²⁺ + ATP → glissement Actine/Myosine',
    ],
    solvedExample: {
      problem: 'Expliquer pourquoi le rendement énergétique de la respiration est supérieur à celui de la fermentation.',
      steps: [
        'La respiration réalise une dégradation COMPLÈTE du glucose en molécules minérales (CO₂ et H₂O).',
        'La fermentation réalise une dégradation INCOMPLÈTE laissant un résidu organique (acide lactique ou éthanol) qui renferme encore de l’énergie potentielle.',
      ],
    },
    examTraps: [
      'Ne jamais écrire que la fermentation lactique dégage du CO₂ (seule la fermentation alcoolique dégage du CO₂).',
      'Dans le sarcomère contracté, la bande sombre A reste constante ; seules la bande I et la zone H raccourcissent.',
    ],
    flashcards: [
      { id: 'sv1', front: 'Lieu de la glycolyse ?', back: 'Le hyaloplasme (cytoplasme)' },
      { id: 'sv2', front: 'Accepteur final d’électrons de la chaîne respiratoire ?', back: 'Le dioxygène (O₂) → forme H₂O' },
      { id: 'sv3', front: 'Ion indispensable à la contraction musculaire ?', back: 'L’ion Calcium Ca²⁺' },
      { id: 'sv4', front: 'Bilan ATP : Respiration vs Fermentation ?', back: '36–38 ATP vs 2 ATP' },
    ],
    exercise: {
      title: 'Rôle des sphères pédonculées (ATP synthase)',
      examSource: 'Examen National 2024 • SVT',
      statement: 'Expliquer comment le flux d’électrons dans la chaîne respiratoire aboutit à la synthèse d’ATP dans la mitochondrie.',
      hint1: 'Parlez de la réoxydation de NADH,H⁺ / FADH₂ et du pompage des protons H⁺ vers l’espace intermembranaire.',
      hint2: 'Expliquez le retour des H⁺ à travers les sphères pédonculées (ATP synthase).',
      solution:
        '1) La réoxydation des transporteurs (NADH,H⁺ et FADH₂) libère des électrons transférés jusqu’à O₂.\n2) L’énergie libérée pompe les protons H⁺ de la matrice vers l’espace intermembranaire, créant un gradient électrochimique.\n3) Le retour des H⁺ vers la matrice via les sphères pédonculées active l’ATP synthase qui phosphoryle ADP + Pi en ATP.',
      bareme: '0,5 pt gradient H⁺ • 0,5 pt flux retour via ATP synthase',
    },
  },

  // ===================== 1ÈRE BAC — FRANÇAIS (RÉGIONAL) =====================
  {
    id: 'sum-1bac-oeuvres',
    quizSlug: '1bac-fr-boite-bases-niv-1',
    level: '1bac',
    subject: 'Français',
    titleFr: 'Les 3 Œuvres Intégrales du Régional 1Bac',
    titleAr: 'ملخص الروايات الثلاث للامتحان الجهوي (1 باك)',
    readMinutes: 3,
    keyPoints: [
      'La Boîte à Merveilles (Ahmed Sefrioui, 1954) : roman autobiographique à Fès (Dar Chouafa), narrateur Sidi Mohammed (6 ans), thème de la solitude et des traditions.',
      'Antigone (Jean Anouilh, 1944) : tragédie moderne, conflit entre Antigone (absolu / devoir moral) et Créon (raison d’État / bonheur quotidien).',
      'Le Dernier Jour d’un Condamné (Victor Hugo, 1829) : roman à thèse plaidant pour l’abolition de la peine de mort (narrateur anonyme, fille Marie).',
    ],
    formulas: [
      'La Boîte à Merveilles (1954) = Roman autobiographique (Maroc)',
      'Antigone (1944) = Tragédie moderne (Anachronismes + Chœur)',
      'Le Dernier Jour d’un Condamné (1829) = Roman à thèse (Focalisation interne)',
    ],
    solvedExample: {
      problem: 'Comment répondre à la question du tableau de présentation au Régional ?',
      steps: [
        'Toujours indiquer exactement : Titre, Auteur, Genre littéraire, Date de publication (ou siècle).',
        'Exemple : « Antigone » | Jean Anouilh | Tragédie moderne | 1944 (XXe siècle).',
      ],
    },
    examTraps: [
      'Ne pas confondre les genres : Boîte à Merveilles = autobiographique, Condamné = roman à thèse, Antigone = tragédie moderne.',
      'Au discours indirect au passé, pensez à changer à la fois le temps du verbe ET l’indicateur de temps (demain → le lendemain).',
    ],
    flashcards: [
      { id: 'fr1', front: 'Genre et date de « La Boîte à Merveilles » ?', back: 'Roman autobiographique — 1954 (Ahmed Sefrioui)' },
      { id: 'fr2', front: 'Thèse de « Le Dernier Jour d’un Condamné » ?', back: 'L’abolition de la peine de mort (Victor Hugo, 1829)' },
      { id: 'fr3', front: 'Oxymore vs Antithèse ?', back: 'Oxymore = 2 contraires collés (« obscure clarté ») ; Antithèse = 2 contraires séparés dans la phrase.' },
    ],
    exercise: {
      title: 'Transformation au Discours Indirect (Régional 1Bac)',
      examSource: 'Examen Régional 2024 • Rabat-Salé',
      statement: 'Transposez au discours indirect : Créon déclara à Antigone : « Tu mourras demain si tu refuses de m’obéir ici. »',
      hint1: 'Le verbe introducteur « déclara » est au passé : appliquez la concordance des temps.',
      hint2: 'Futur simple → conditionnel présent ; présent → imparfait ; demain → le lendemain ; ici → là.',
      solution:
        'Créon déclara à Antigone qu’elle mourrait le lendemain si elle refusait de lui obéir là.',
      bareme: '0,25 pt par transformation correcte (pronoms, temps, indicateurs)',
    },
  },

  // ===================== 3ÈME ANNÉE COLLÈGE — MATHÉMATIQUES =====================
  {
    id: 'sum-3ac-geometrie',
    quizSlug: '3ac-maths-pythagore-niv-4',
    level: '3ac',
    subject: 'Mathématiques',
    titleFr: 'Pythagore, Thalès, Racines & Fonctions (3AC)',
    titleAr: 'فيتاغورس وطاليس والجذور والدوال (3 إعدادي)',
    readMinutes: 3,
    keyPoints: [
      'Pythagore direct sert à calculer une longueur dans un triangle rectangle ; la réciproque sert à prouver qu’un triangle est rectangle.',
      'Thalès direct exige (MN) // (BC) pour écrire AM/AB = AN/AC = MN/BC.',
      'Multiplier ou diviser une inéquation par un nombre NÉGATIF inverse toujours le sens du symbole (< devient >).',
    ],
    formulas: [
      '(a + b)² = a² + 2ab + b²   |   (a - b)² = a² - 2ab + b²   |   a² - b² = (a-b)(a+b)',
      'Pythagore : BC² = AB² + AC²   |   cos²x + sin²x = 1',
      'Distance : AB = √((x_B - x_A)² + (y_B - y_A)²)',
    ],
    solvedExample: {
      problem: 'Résoudre l’inéquation : -3x + 6 ≤ 0.',
      steps: [
        'On isole -3x : -3x ≤ -6.',
        'On divise par -3 (NÉGATIF → on inverse le sens !) : x ≥ (-6)/(-3).',
        'Donc x ≥ 2. Les solutions sont tous les réels supérieurs ou égaux à 2.',
      ],
    },
    examTraps: [
      'Ne jamais écrire √(a + b) = √a + √b ! (Ex. √(16 + 9) = √25 = 5, et NON 4 + 3 = 7).',
      'Pour les volumes agrandis par un rapport k, on multiplie le volume par k³ (et non par k).',
    ],
    flashcards: [
      { id: 'c3f1', front: 'Condition pour que deux droites y=mx+p et y=m\'x+p\' soient perpendiculaires ?', back: 'm × m\' = -1' },
      { id: 'c3f2', front: 'Que devient un volume V après un agrandissement de rapport k ?', back: 'V\' = k³ × V' },
      { id: 'c3f3', front: 'Coordonnées du milieu I de [AB] ?', back: 'I((x_A + x_B)/2 ; (y_A + y_B)/2)' },
    ],
    exercise: {
      title: 'Application de Pythagore et Trigonométrie (Brevet 3AC)',
      examSource: 'Régional 3AC 2023 • Casa-Settat',
      statement: 'Soit ABC un triangle rectangle en A tel que AB = 6 cm et AC = 8 cm. Calculer BC puis cos(B̂).',
      hint1: 'Utilisez le théorème direct de Pythagore pour trouver BC.',
      hint2: 'Dans le triangle rectangle, cos(B̂) = côté adjacent / hypoténuse = AB / BC.',
      solution:
        '1) ABC est rectangle en A, donc BC² = AB² + AC² = 6² + 8² = 36 + 64 = 100 ⇒ BC = √100 = 10 cm.\n2) cos(B̂) = AB / BC = 6 / 10 = 3/5 = 0,6.',
      bareme: '0,5 pt théorème + calcul BC • 0,5 pt cos(B̂)',
    },
  },

  // ===================== 6ÈME PRIMAIRE — MATHÉMATIQUES =====================
  {
    id: 'sum-6eme-essentiel',
    quizSlug: '6eme-maths-fractions-niv-3',
    level: '6eme',
    subject: 'Mathématiques',
    titleFr: 'L’Essentiel de l’Examen Provincial 6ème Maths',
    titleAr: 'ملخص الرياضيات الشامل للامتحان الإقليمي (6 ابتدائي)',
    readMinutes: 2,
    keyPoints: [
      'Pour additionner deux fractions, il faut d’abord les réduire au même dénominateur.',
      'Pour calculer une réduction de 20 %, on calcule (Prix × 20) / 100 puis on soustrait du prix initial.',
      'Retenir les conversions d’examen : 1 dm³ = 1 L, 1 m³ = 1000 L, et 1 ha = 10 000 m².',
    ],
    formulas: [
      'Aire rectangle = L × l   |   Aire triangle = (Base × Hauteur) / 2',
      'Volume pavé = L × l × h   |   1 dm³ = 1 L',
      'Vitesse moyenne : v = d / t',
    ],
    solvedExample: {
      problem: 'Un terrain rectangulaire mesure 50 m de long et 20 m de large. Quelle est son aire en m² ?',
      steps: [
        'Formule : Aire = Longueur × largeur.',
        'Calcul : 50 × 20 = 1 000 m².',
      ],
    },
    examTraps: [
      'Pour le triangle, ne pas oublier de DIVISER par 2 : (B × h) / 2.',
      'Pour les durées, 1 heure = 60 minutes (et non 100 minutes !).',
    ],
    flashcards: [
      { id: 'p6f1', front: '1 dm³ équivaut à combien de litres ?', back: '1 Litre (1 L)' },
      { id: 'p6f2', front: 'Somme des 3 angles d’un triangle ?', back: '180°' },
      { id: 'p6f3', front: '1 hectare (1 ha) = combien de m² ?', back: '10 000 m²' },
    ],
    exercise: {
      title: 'Problème de vitesse et de volume (Examen Provincial 6ème)',
      examSource: 'Examen Provincial 2024',
      statement: 'Un réservoir cubique a une arête de 2 m. Quel est son volume en m³ puis sa capacité en Litres ?',
      hint1: 'Volume d’un cube = arête × arête × arête.',
      hint2: '1 m³ = 1 000 dm³ = 1 000 L.',
      solution:
        'V = 2 × 2 × 2 = 8 m³.\nComme 1 m³ = 1 000 L, sa capacité est 8 × 1 000 = 8 000 Litres.',
      bareme: '0,5 pt volume en m³ • 0,5 pt conversion en Litres',
    },
  },
];

/**
 * Retourne le pack d'étude (Résumé Express + Flashcards + Exercice Guidé) pour N'IMPORTE QUEL des 60 niveaux.
 * Utilise le résumé dédié s'il existe, sinon génère un pack pédagogique propre à partir du quiz lui-même !
 */
export function getStudyPackForQuiz(quiz: Quiz): CourseSummary {
  const exact = COURSE_SUMMARIES.find((s) => s.quizSlug === quiz.slug);
  if (exact) return exact;

  // Fallback intelligent et riche généré à partir des questions & explications du niveau
  const firstQ = quiz.questions[0];
  return {
    id: `auto-${quiz.slug}`,
    quizSlug: quiz.slug,
    level: quiz.level,
    subject: quiz.subject,
    titleFr: quiz.chapter_title,
    titleAr: quiz.chapter_title,
    readMinutes: 2,
    keyPoints: quiz.questions.map((q) => q.explanation),
    formulas: quiz.questions
      .filter((q) => q.exam_tip)
      .map((q) => q.exam_tip as string)
      .concat(
        quiz.questions.some((q) => q.exam_tip)
          ? []
          : [`Notions clés vérifiées : ${quiz.description}`]
      ),
    solvedExample: {
      problem: firstQ ? firstQ.question_text : quiz.description,
      steps: firstQ
        ? [
            `Réponse attendue : ${firstQ.options[firstQ.correct_index]}`,
            `Justification : ${firstQ.explanation}`,
          ]
        : [quiz.description],
    },
    examTraps: quiz.questions
      .map((q) => q.exam_tip)
      .filter((t): t is string => Boolean(t)),
    flashcards: quiz.questions.map((q, idx) => ({
      id: `${quiz.slug}-fc-${idx}`,
      front: q.question_text,
      back: `${q.options[q.correct_index]} — ${q.explanation}`,
    })),
    exercise: {
      title: `Exercice d’application — ${quiz.chapter_title}`,
      examSource: quiz.exam_source,
      statement: firstQ
        ? `Expliquez et justifiez étape par étape : ${firstQ.question_text}`
        : `Résumez les règles principales de : ${quiz.chapter_title}.`,
      hint1: 'Identifiez d’abord les données et la propriété du cours correspondante.',
      hint2: firstQ?.exam_tip || 'Vérifiez les unités, les signes et les conditions d’application.',
      solution: firstQ
        ? `Réponse : ${firstQ.options[firstQ.correct_index]}.\nDémonstration : ${firstQ.explanation}`
        : quiz.description,
      bareme: '0,5 pt méthode & propriété • 0,5 pt résultat justifié',
    },
  };
}

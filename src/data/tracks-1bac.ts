import type { Quiz, QuizDifficulty, QuizQuestion } from '@/types/quiz';

function make1BacStage(
  subject: 'Français' | 'Histoire-Géographie' | 'Éducation Islamique',
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
    id: `1bac-${subject.toLowerCase().slice(0, 4)}-s${stage}`,
    slug: `1bac-${slugSuffix}-niv-${stage}`,
    level: '1bac',
    branch: 'Toutes filières 1Bac',
    subject,
    stage_number: stage,
    chapter_title: title,
    description,
    exam_type: 'Régional',
    difficulty,
    estimated_minutes: stage === 10 ? 7 : 4,
    exam_source: examSource,
    questions,
  };
}

export const TRACKS_1BAC: Quiz[] = [
  // =========================================================================
  // 1ÈRE BAC — FRANÇAIS (10 NIVEAUX : BASES → BOSS EXAMEN RÉGIONAL)
  // =========================================================================
  make1BacStage(
    'Français',
    1,
    'fr-boite-bases',
    'La Boîte à Merveilles : Auteur, Genre & Lieux',
    'Les repères essentiels sur le roman autobiographique d’Ahmed Sefrioui.',
    undefined,
    [
      {
        id: 'f1-1',
        question_text: 'Qui est l’auteur de « La Boîte à Merveilles » (publié en 1954) ?',
        options: ['Tahar Ben Jelloun', 'Ahmed Sefrioui', 'Driss Chraïbi', 'Mohammed Khaïr-Eddine'],
        correct_index: 1,
        explanation: 'Ahmed Sefrioui (1915–2004) est l’un des fondateurs de la littérature marocaine d’expression française.',
      },
      {
        id: 'f1-2',
        question_text: 'Dans quelle ville se déroule l’histoire de Sidi Mohammed ?',
        options: ['Marrakech', 'Fès', 'Rabat', 'Tanger'],
        correct_index: 1,
        explanation: 'Tout le récit se déroule dans la médina de Fès.',
      },
      {
        id: 'f1-3',
        question_text: 'Comment s’appelle la maison où habite la famille du narrateur ?',
        options: ['Dar Kitoune', 'Dar Chouafa', 'Dar El Makhzen', 'Dar Sidi El Arafi'],
        correct_index: 1,
        explanation: 'La famille vit au 2ème étage de Dar Chouafa (maison de la voyante Kanza).',
      },
    ]
  ),
  make1BacStage(
    'Français',
    2,
    'fr-boite-personnages',
    'La Boîte à Merveilles : Personnages & Famille',
    'Maâlem Abdeslam, Lalla Zoubida, Rahma, Zineb et Lalla Aïcha.',
    undefined,
    [
      {
        id: 'f2-1',
        question_text: 'Quel métier exerce le père de Sidi Mohammed (Maâlem Abdeslam) ?',
        options: ['Boucher', 'Tisserand', 'Cordonnier', 'Épicier'],
        correct_index: 1,
        explanation: 'Maâlem Abdeslam est tisserand dans la médina de Fès.',
      },
      {
        id: 'f2-2',
        question_text: 'Qui est l’amie intime et confidente de Lalla Zoubida ?',
        options: ['Rahma', 'Fatma Bziouya', 'Lalla Aïcha', 'Kanza'],
        correct_index: 2,
        explanation: 'Lalla Aïcha est l’ancienne voisine et grande amie de Lalla Zoubida.',
      },
      {
        id: 'f2-3',
        question_text: 'Pourquoi Maâlem Abdeslam quitte-t-il Fès pendant un mois vers la fin du roman ?',
        options: ['Pour faire le pèlerinage', 'Pour travailler comme moissonneur après avoir perdu son capital au souk', 'Pour divorcer', 'Pour rendre visite à son frère'],
        correct_index: 1,
        explanation: 'Après la perte de son capital, il part travailler aux champs aux environs de Fès pour payer ses dettes.',
      },
    ]
  ),
  make1BacStage(
    'Français',
    3,
    'fr-boite-themes',
    'La Boîte à Merveilles : Symboles & Traditions',
    'Le Msid, le bain maure, Achoura et la solitude de l’enfant.',
    undefined,
    [
      {
        id: 'f3-1',
        question_text: 'Que représente la « Boîte à Merveilles » pour Sidi Mohammed ?',
        options: ['Un coffre plein d’or', 'Un refuge imaginaire contre la solitude', 'Un cartable d’école', 'Un cadeau du fqih'],
        correct_index: 1,
        explanation: 'Les objets ordinaires dans sa boîte deviennent des amis fabuleux qui nourrissent son imagination.',
      },
      {
        id: 'f3-2',
        question_text: 'Quelle grande fête religieuse est préparée avec enthousiasme au Msid dans le roman ?',
        options: ['L’Aïd Al-Adha', 'Achoura', 'Le Ramadan', 'Le Mawlid'],
        correct_index: 1,
        explanation: 'Achoura est un moment central : nettoyage du Msid, habits neufs, jouets et tambours.',
      },
      {
        id: 'f3-3',
        question_text: 'Quel sanctuaire Lalla Zoubida et Lalla Aïcha visitent-elles pour conjurer le mauvais sort ?',
        options: ['Sidi Ali Boughaleb', 'Moulay Idriss uniquement', 'Sidi Mohammed Ben Abdellah', 'Sidi Kacem'],
        correct_index: 0,
        explanation: 'Elles se rendent au mausolée de Sidi Ali Boughaleb (et consultent aussi le voyant aveugle Sidi El Arafi).',
      },
    ]
  ),
  make1BacStage(
    'Français',
    4,
    'fr-antigone-bases',
    'Antigone : Tragédie Moderne & Personnages',
    'Jean Anouilh (1944), Thèbes, Antigone, Créon, Ismène et Hémon.',
    undefined,
    [
      {
        id: 'f4-1',
        question_text: 'Quel est le genre exact de la pièce « Antigone » de Jean Anouilh ?',
        options: ['Une comédie classique', 'Une tragédie moderne', 'Un roman à thèse', 'Une fable'],
        correct_index: 1,
        explanation: 'Anouilh réécrit le mythe antique de Sophocle sous forme de tragédie moderne avec des anachronismes.',
      },
      {
        id: 'f4-2',
        question_text: 'Pourquoi Créon interdit-il d’enterrer Polynice ?',
        options: ['Parce qu’il était inconnu', 'Pour faire un exemple politique car Polynice s’est révolté contre Thèbes', 'Parce qu’il manquait de terre', 'Sur ordre d’Ismène'],
        correct_index: 1,
        explanation: 'Créon choisit la raison d’État : un frère en héros (Étéocle), l’autre en traître (Polynice).',
      },
      {
        id: 'f4-3',
        question_text: 'Qui est le fiancé d’Antigone dans la pièce ?',
        options: ['Polynice', 'Hémon (le fils de Créon)', 'Le Garde Jonas', 'Le Messager'],
        correct_index: 1,
        explanation: 'Hémon est le fils de Créon ; il se donne la mort auprès d’Antigone à la fin.',
      },
    ]
  ),
  make1BacStage(
    'Français',
    5,
    'fr-antigone-conflit',
    'Antigone : Le Face-à-Face avec Créon',
    'Bonheur médiocre vs absolu, fatalité et rôle du Chœur.',
    undefined,
    [
      {
        id: 'f5-1',
        question_text: 'Quel mot prononcé par Créon fait basculer Antigone dans le refus définitif ?',
        options: ['Le mot « guerre »', 'Le mot « bonheur » (un petit bonheur quotidien et médiocre)', 'Le mot « richesse »', 'Le mot « exil »'],
        correct_index: 1,
        explanation: 'Antigone rejette le « sale bonheur » fait de compromis que lui décrit Créon ; elle veut tout, tout de suite.',
      },
      {
        id: 'f5-2',
        question_text: 'Comment appelle-t-on le fait d’introduire des objets modernes (café, cigarettes, cartes) dans une pièce antique ?',
        options: ['Un néologisme', 'Un anachronisme', 'Un oxymore', 'Une ellipse'],
        correct_index: 1,
        explanation: 'L’anachronisme modernise le mythe et le rend universel.',
      },
      {
        id: 'f5-3',
        question_text: 'À qui Antigone dicte-t-elle sa dernière lettre avant de mourir ?',
        options: ['À la Nourrice', 'Au Garde Jonas', 'À Ismène', 'À Eurydice'],
        correct_index: 1,
        explanation: 'Elle paie le garde Jonas avec sa bague en or pour qu’il écrive sa lettre destinée à Hémon.',
      },
    ]
  ),
  make1BacStage(
    'Français',
    6,
    'fr-condamne-bases',
    'Le Dernier Jour d’un Condamné : Thèse & Lieux',
    'Victor Hugo (1829), Bicêtre, la Conciergerie, l’Hôtel de Ville et la Grève.',
    undefined,
    [
      {
        id: 'f6-1',
        question_text: 'Quelle thèse défend Victor Hugo dans « Le Dernier Jour d’un Condamné » ?',
        options: ['La réforme des écoles', 'L’abolition de la peine de mort', 'La défense de la guillotine', 'La monarchie absolue'],
        correct_index: 1,
        explanation: 'C’est un roman à thèse humaniste contre la peine capitale.',
      },
      {
        id: 'f6-2',
        question_text: 'Pourquoi le narrateur reste-t-il anonyme et son crime inconnu ?',
        options: ['Par oubli de l’auteur', 'Pour universaliser son combat : tout condamné est un être humain', 'Parce qu’il est innocent', 'Pour créer du suspense policier'],
        correct_index: 1,
        explanation: 'L’anonymat empêche le lecteur de juger le crime et le force à voir la souffrance humaine.',
      },
      {
        id: 'f6-3',
        question_text: 'Comment s’appelle la petite fille du condamné qui ne le reconnaît plus lors de sa visite ?',
        options: ['Cosette', 'Marie', 'Jeanne', 'Claire'],
        correct_index: 1,
        explanation: 'Sa fille de 3 ans s’appelle Marie ; cette scène pathétique est au chapitre 43.',
      },
    ]
  ),
  make1BacStage(
    'Français',
    7,
    'fr-figures-style-regional',
    'Figures de Style (Annales Régionales)',
    'Métaphore, comparaison, hyperbole, oxymore, antithèse, personnification.',
    'Examen Régional 2023 • Casablanca-Settat',
    [
      {
        id: 'f7-1',
        question_text: 'Quelle figure de style identifie-t-on dans : « Cette obscure clarté » ?',
        options: ['Une hyperbole', 'Un oxymore', 'Une anaphore', 'Une périphrase'],
        correct_index: 1,
        explanation: 'L’oxymore réunit deux termes de sens contraires côte à côte.',
        exam_source: 'Régional 2023 • Casa-Settat',
      },
      {
        id: 'f7-2',
        question_text: 'Quelle figure de style apparaît dans : « Ma boîte à merveilles me parlait comme une amie » ?',
        options: ['Personnification et comparaison', 'Litote', 'Euphémisme', 'Chiasme'],
        correct_index: 0,
        explanation: 'La boîte « parle » (personnification) et « comme » introduit une comparaison.',
        exam_source: 'Régional 2022 • Rabat-Salé',
      },
      {
        id: 'f7-3',
        question_text: 'Dans « Condamné à mort ! Voilà cinq semaines que j’habite avec cette pensée », quelle figure de style est utilisée ?',
        options: ['Une personnification', 'Une antithèse', 'Une litote', 'Une synecdoque'],
        correct_index: 0,
        explanation: 'L’idée de la condamnation est traitée comme un être vivant avec lequel il « habite ».',
        exam_source: 'Régional 2023 • Fès-Meknès',
      },
    ]
  ),
  make1BacStage(
    'Français',
    8,
    'fr-registres-regional',
    'Registres Littéraires & Focalisation (Annales)',
    'Pathétique, tragique, ironique, lyrique et points de vue narratifs.',
    'Examen Régional 2022 • Marrakech-Safi',
    [
      {
        id: 'f8-1',
        question_text: 'Quel registre domine lors de la visite de la petite Marie à son père condamné ?',
        options: ['Comique', 'Pathétique', 'Épique', 'Fantastique'],
        correct_index: 1,
        explanation: 'Le registre pathétique vise à inspirer une profonde compassion et pitié face à la souffrance.',
        exam_source: 'Régional 2022 • Marrakech-Safi',
      },
      {
        id: 'f8-2',
        question_text: 'Quel type de focalisation (point de vue) est utilisé dans « Le Dernier Jour d’un Condamné » ?',
        options: ['Focalisation zéro', 'Focalisation interne (à la 1ère personne « je »)', 'Focalisation externe', 'Aucune'],
        correct_index: 1,
        explanation: 'Le lecteur perçoit tout à travers les pensées et sensations intimes du condamné.',
        exam_source: 'Régional 2023 • Tanger-Tétouan',
      },
      {
        id: 'f8-3',
        question_text: 'Lorsque le narrateur de « La Boîte à Merveilles » adulte porte un regard amusé sur les querelles des voisines, le ton est :',
        options: ['Tragique', 'Ironique / Comique', 'Polémique', 'Didactique'],
        correct_index: 1,
        explanation: 'Le narrateur adulte utilise souvent une douce ironie pour décrire les scènes du quotidien.',
        exam_source: 'Régional 2021 • Casa-Settat',
      },
    ]
  ),
  make1BacStage(
    'Français',
    9,
    'fr-langue-discours-regional',
    'Discours Rapporté & Subordonnées (Annales)',
    'Passer du discours direct au discours indirect et valeurs des temps.',
    'Examen Régional 2024 • Rabat-Salé-Kénitra',
    [
      {
        id: 'f9-1',
        question_text: 'Transposez au discours indirect : Il a dit : « Je partirai demain. »',
        options: [
          'Il a dit qu’il partira demain.',
          'Il a dit qu’il partirait le lendemain.',
          'Il a dit qu’il est parti hier.',
          'Il a dit qu’il partirait demain.',
        ],
        correct_index: 1,
        explanation: 'Verbe introducteur au passé ⇒ futur simple devient conditionnel présent, et « demain » devient « le lendemain ».',
        exam_tip: 'Ne jamais oublier de transformer les indicateurs de temps (demain → le lendemain, ici → là-bas).',
        exam_source: 'Régional 2024 • Rabat-Salé',
      },
      {
        id: 'f9-2',
        question_text: 'Quelle est la valeur de l’imparfait dans : « Tous les vendredis, nous allions au bain maure » ?',
        options: ['Action soudaine', 'Imparfait d’habitude (répétition)', 'Futur proche', 'Hypothèse'],
        correct_index: 1,
        explanation: '« Tous les vendredis » indique une action répétée dans le passé : imparfait d’habitude.',
        exam_source: 'Régional 2023 • Oriental',
      },
      {
        id: 'f9-3',
        question_text: 'Dans « Bien qu’il soit fatigué, il continue ses révisions », la subordonnée exprime :',
        options: ['La cause', 'La conséquence', 'La concession / opposition', 'Le but'],
        correct_index: 2,
        explanation: '« Bien que + subjonctif » exprime la concession.',
        exam_source: 'Régional 2024 • Casa-Settat',
      },
    ]
  ),
  make1BacStage(
    'Français',
    10,
    'fr-boss-regional',
    '🏆 BOSS : Simulation Examen Régional Français',
    'Épreuve finale mêlant les 3 œuvres intégrales, figures de style et langue.',
    'Compilation Examens Régionaux 1Bac 2022–2024',
    [
      {
        id: 'f10-1',
        question_text: 'Associez correctement l’œuvre et sa date de publication : « Le Dernier Jour d’un Condamné » a été publié en :',
        options: ['1829', '1944', '1954', '1862'],
        correct_index: 0,
        explanation: '1829 : Le Dernier Jour d’un Condamné ; 1944 : Antigone ; 1954 : La Boîte à Merveilles.',
        exam_source: 'Régional 2024',
      },
      {
        id: 'f10-2',
        question_text: 'Dans « Antigone », comment meurt Eurydice (la femme de Créon) ?',
        options: ['Elle s’exile', 'Elle se coupe la gorge en apprenant la mort de son fils Hémon', 'Elle est exécutée', 'Elle meurt de vieillesse'],
        correct_index: 1,
        explanation: 'Eurydice se suicide en apprenant la mort de Hémon, laissant Créon totalement seul.',
        exam_source: 'Régional 2023',
      },
      {
        id: 'f10-3',
        question_text: 'Dans « La Boîte à Merveilles », qui raconte des histoires merveilleuses dans sa boutique ?',
        options: ['Abdallah l’épicier', 'Driss El Aouad', 'Le Fqih', 'Moulay Larbi'],
        correct_index: 0,
        explanation: 'Abdallah l’épicier fascine Sidi Mohammed par ses récits mystérieux.',
        exam_source: 'Régional 2022',
      },
      {
        id: 'f10-4',
        question_text: 'Quelle figure de style est présente dans : « La guillotine, cette hideuse machine qui avale les hommes » ?',
        options: ['Périphrase et personnification', 'Litote', 'Anaphore', 'Oxymore'],
        correct_index: 0,
        explanation: 'Désignation imagée (périphrase) + action humaine « avale » (personnification).',
        exam_source: 'Régional 2024',
      },
    ]
  ),
];

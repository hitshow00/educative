import type { LevelId, QuizDifficulty } from '@/types/quiz';

export type Lang = 'fr' | 'ar';

export const SUBJECT_AR: Record<string, string> = {
  'Mathématiques': 'الرياضيات',
  'Physique-Chimie': 'الفيزياء والكيمياء',
  'SVT': 'علوم الحياة والأرض',
  'Français': 'اللغة الفرنسية',
  'Philosophie': 'الفلسفة',
  'Anglais': 'اللغة الإنجليزية',
  'Histoire-Géographie': 'التاريخ والجغرافيا',
  'Éducation Islamique': 'التربية الإسلامية',
  'Activité Scientifique': 'النشاط العلمي',
};

export const LEVEL_AR: Record<LevelId, { label: string; shortLabel: string; examTitle: string }> = {
  '2bac': {
    label: 'الثانية باكالوريا',
    shortLabel: '2 باك',
    examTitle: 'الامتحان الوطني',
  },
  '1bac': {
    label: 'الأولى باكالوريا',
    shortLabel: '1 باك',
    examTitle: 'الامتحان الجهوي',
  },
  '3ac': {
    label: 'الثالثة إعدادي',
    shortLabel: '3 إعدادي',
    examTitle: 'الموحد الجهوي',
  },
  '6eme': {
    label: 'السادس ابتدائي',
    shortLabel: '6 ابتدائي',
    examTitle: 'الامتحان الإقليمي',
  },
};

export const DIFFICULTY_AR: Record<QuizDifficulty, string> = {
  Facile: 'سهل',
  Moyen: 'متوسط',
  Difficile: 'صعب',
  'Boss Examen': 'تحدي الامتحان',
};

export const LEAGUE_AR: Record<string, string> = {
  bronze: 'دوري البرونز',
  argent: 'دوري الفضة',
  or: 'دوري الذهب',
  platine: 'دوري البلاتين',
  diamant: 'الأول على الدفعة',
};

export const CITY_AR: Record<string, string> = {
  Casablanca: 'الدار البيضاء',
  Rabat: 'الرباط',
  Marrakech: 'مراكش',
  Fès: 'فاس',
  Tanger: 'طنجة',
  Agadir: 'أكادير',
  Meknès: 'مكناس',
  Oujda: 'وجدة',
  Kénitra: 'القنيطرة',
  Tétouan: 'تطوان',
  Salé: 'سلا',
  Mohammédia: 'المحمدية',
  'El Jadida': 'الجديدة',
  'Béni Mellal': 'بني ملال',
  Nador: 'الناظور',
  Safi: 'آسفي',
};

export const BADGES_AR: Record<string, { title: string; desc: string }> = {
  'first-win': { title: 'الخطوة الأولى', desc: 'إتمام أول مستوى بنجاح' },
  'perfect-20': { title: 'العلامة الكاملة 20/20', desc: 'الحصول على 20/20 في اختبار' },
  'combo-3': { title: 'سلسلة نارية (x3)', desc: '3 إجابات صحيحة متتالية' },
  'stars-15': { title: 'صائد النجوم', desc: 'جمع 15 نجمة أو أكثر' },
  'streak-3': { title: 'المواظبة 3 أيام', desc: 'المراجعة 3 أيام متتالية' },
  'boss-10': { title: 'بطل الامتحان', desc: 'اجتياز المستوى 10 (≥ 12/20)' },
};

export function translateSubject(subject: string, lang: Lang): string {
  if (lang === 'ar') return SUBJECT_AR[subject] || subject;
  return subject;
}

export function translateDifficulty(diff: QuizDifficulty, lang: Lang): string {
  if (lang === 'ar') return DIFFICULTY_AR[diff] || diff;
  return diff;
}

export function translateCity(city: string, lang: Lang): string {
  if (lang === 'ar') return CITY_AR[city] || city;
  return city;
}

export function translateLeague(leagueId: string, fallbackFr: string, lang: Lang): string {
  if (lang === 'ar') return LEAGUE_AR[leagueId] || fallbackFr;
  return fallbackFr;
}

export function translateMention(score20: number, lang: Lang): string {
  if (lang === 'ar') {
    if (score20 >= 16) return 'ميزة حسن جداً';
    if (score20 >= 14) return 'ميزة حسن';
    if (score20 >= 12) return 'ميزة مستحسن';
    if (score20 >= 10) return 'مقبول — تم فتح المستوى التالي';
    return 'يحتاج مراجعة (< 10/20)';
  }
  if (score20 >= 16) return 'Mention Très Bien';
  if (score20 >= 14) return 'Mention Bien';
  if (score20 >= 12) return 'Mention Assez Bien';
  if (score20 >= 10) return 'Passable — Niveau débloqué';
  return 'À revoir (< 10/20)';
}

export const UI_TEXT = {
  fr: {
    brandSub: 'Arène Examens Maroc',
    navRoadmap: 'Parcours',
    navCourses: 'Cours',
    navLeaderboard: 'Classement',
    navProgress: 'Progrès',
    navReview: 'À revoir',
    footerCopy: 'Entraînement aux examens scolaires au Maroc.',
    footerAdmin: 'Administration',
    daysShort: 'j',
    dayLabel: 'jour',
    daysLabel: 'jours',
    rankLabel: 'Rang',
    heroTitle: 'Franchis les 10 niveaux jusqu’au Boss Examen National !',
    heroMoreXpBefore: 'Encore',
    heroMoreXpMiddle: 'pour dépasser',
    heroMoreXpAfter: 'au classement',
    heroTopRank: 'Tu es en tête du classement ! Garde ton avance.',
    playLevel: 'Jouer Niveau',
    seeLeaderboard: 'Voir le classement',
    dailyChallenge: 'Défi du Jour',
    dailyDoneTitle: 'Défi accompli aujourd’hui !',
    dailyTodoTitle: 'Obtiens au moins 14 / 20 sur un niveau',
    dailyDoneDesc: 'Tu as remporté ton bonus +100 XP. Reviens demain pour garder ta série !',
    dailyTodoDesc: 'Valide n’importe quel niveau avec 14/20 ou plus pour décrocher le bonus.',
    dailyDoneBadge: 'Bonus +100 XP validé',
    dailyTodoBadge: 'En cours — 0 / 1 réussi',
    step1Title: '1. Ton niveau scolaire',
    officialSources: 'Sources : Programme Officiel & Annales Maroc',
    starsLabel: 'étoiles',
    freeAccessOn: 'Accès libre actif',
    unlockAll: 'Débloquer tout',
    trackSubtitle: 'du Niveau 1 (Bases) au Niveau 10 (Boss Examen)',
    validatedLabel: 'validés',
    levelPrefix: 'Niveau',
    recordLabel: 'Record',
    improveBtn: 'Améliorer',
    bossBtn: 'Affronter le Boss',
    playBtn: 'Jouer',
    validatePrev: 'Valide Niv.',
    // Leaderboard
    lbTitle: 'Classement & Ligues Maroc',
    lbSub: 'Cumule des XP sur les 10 niveaux, monte de ligue et bats les meilleurs élèves de ta ville !',
    lbAllMorocco: 'Tout le Maroc',
    lbProfileTitle: 'Ton profil dans le classement',
    lbSaved: 'Enregistré',
    lbPseudo: 'Ton Pseudo',
    lbCity: 'Ta Ville',
    lbUpdateBtn: 'Mettre à jour mon pseudo',
    lbNextLeagueBefore: 'Encore',
    lbNextLeagueAfter: 'XP pour la ligue supérieure',
    lbMaxLeague: 'Ligue maximale atteinte — Bravo !',
    lbTopStudents: 'Top Élèves',
    lbYou: 'Toi',
    lbAvg: 'Moy.',
    lbBadgesTitle: 'Tes Badges & Trophées',
    // Progression
    progTitle: 'Tableau de Progression',
    progSub: 'Suis ton niveau de préparation',
    progEstScore: 'Note estimée',
    progCompleted: 'Quiz complétés',
    progStreak: 'Série active',
    progXp: 'Points XP',
    progMastery: 'Maîtrise par matière',
    progToReviewLink: 'chapitre(s) à revoir',
    progRecent: 'Activité récente',
    progEmpty: 'Tu n’as pas encore terminé de quiz pour ce niveau.',
    progStartFirst: 'Lancer mon premier quiz',
    progCorrectAnswers: 'bonnes réponses',
    progReset: 'Réinitialiser ma progression locale',
    progResetConfirm: 'Réinitialiser toute votre progression enregistrée sur cet appareil ?',
    // Review
    revTitle: 'À revoir en priorité',
    revSub: 'Concentre tes révisions sur les chapitres < 12/20 et ceux pas encore tentés',
    revAllGoodTitle: 'Bravo ! Tous les chapitres de ce niveau sont au-dessus de 12/20 !',
    revAllGoodSub: 'Continue en mode Examen Blanc pour viser la mention Très Bien.',
    revBackCatalog: 'Revoir le parcours',
    revHighPriority: 'Priorité haute — Note inférieure à 12/20',
    revBestScore: 'Meilleure note',
    revReviewNow: 'Réviser ce niveau maintenant',
    revUntried: 'Pas encore tentés',
    revTestMe: 'Tester mes connaissances',
    // Quiz Player
    qBackTrack: 'Retour au parcours 10 niveaux',
    qModeTraining: 'Entraînement',
    qModeExam: 'Examen Blanc',
    qQuestion: 'Question',
    qCombo: 'Combo',
    qExplanation: 'Explication',
    qExamTip: 'Piège fréquent à l’examen :',
    qNextQuestion: 'Question suivante',
    qFinishScore: 'Terminer et voir mon score / 20',
    qBossWon: '🏆 Boss Examen Vaincu !',
    qLevelPassed: 'Niveau Validé !',
    qKeepTrying: 'Continue ton entraînement !',
    qUnlockedNextBefore: 'Niveau',
    qUnlockedNextAfter: 'débloqué !',
    qDailyBonusWon: 'Défi du jour réussi : +100 XP bonus !',
    qYourScore20: 'Ta note sur 20',
    qSuccess: 'Réussite',
    qTime: 'Temps',
    qMaxCombo: 'Combo max',
    qInARow: 'd’affilée',
    qGoNextLevel: 'Passer au Niveau',
    qRetryErrorsBefore: 'Refaire mes',
    qRetryErrorsAfter: 'erreur(s)',
    qReplay: 'Rejouer',
    qSeeMyRank: 'Voir mon rang',
    qDetailedCorrection: 'Correction détaillée',
    qYourAnswer: 'Ta réponse :',
    qCorrectAnswer: 'Bonne réponse :',
    qBiofNote: 'Note : les énoncés scientifiques suivent le programme officiel marocain (BIOF / Français).',
  },
  ar: {
    brandSub: 'ساحة الامتحانات بالمغرب',
    navRoadmap: 'المسار',
    navCourses: 'الملخصات',
    navLeaderboard: 'الترتيب',
    navProgress: 'التقدم',
    navReview: 'للمراجعة',
    footerCopy: 'منصة تفاعلية للتحضير للامتحانات المدرسية بالمغرب.',
    footerAdmin: 'الإدارة',
    daysShort: 'ي',
    dayLabel: 'يوم',
    daysLabel: 'أيام',
    rankLabel: 'الرتبة',
    heroTitle: 'اجتز المستويات الـ 10 وصولاً إلى تحدي الامتحان الوطني!',
    heroMoreXpBefore: 'تحتاج فقط',
    heroMoreXpMiddle: 'لتجاوز',
    heroMoreXpAfter: 'في ترتيب',
    heroTopRank: 'أنت في صدارة الترتيب! حافظ على تقدمك.',
    playLevel: 'ابدأ المستوى',
    seeLeaderboard: 'عرض الترتيب',
    dailyChallenge: 'تحدي اليوم',
    dailyDoneTitle: 'أحسنت! أتممت تحدي اليوم',
    dailyTodoTitle: 'احصل على 14 / 20 على الأقل في أي مستوى',
    dailyDoneDesc: 'حصلت على مكافأة +100 XP. عد غداً للحفاظ على سلسلتك!',
    dailyTodoDesc: 'أنجز أي مستوى بنقطة 14/20 أو أكثر لربح المكافأة اليومية.',
    dailyDoneBadge: 'تم تفعيل مكافأة +100 XP',
    dailyTodoBadge: 'قيد الإنجاز — 0 / 1',
    step1Title: '1. اختر مستواك الدراسي',
    officialSources: 'المصادر: الأطر المرجعية والامتحانات الرسمية بالمغرب',
    starsLabel: 'نجوم',
    freeAccessOn: 'الفتح الحر مفعل',
    unlockAll: 'فتح جميع المستويات',
    trackSubtitle: 'من المستوى 1 (الأساسيات) إلى المستوى 10 (تحدي الامتحان)',
    validatedLabel: 'مكتمل',
    levelPrefix: 'المستوى',
    recordLabel: 'أعلى نقطة',
    improveBtn: 'تحسين النقطة',
    bossBtn: 'خوض تحدي الامتحان',
    playBtn: 'ابدأ',
    validatePrev: 'أكمل م.',
    // Leaderboard
    lbTitle: 'الترتيب والدوريات بالمغرب',
    lbSub: 'اجمع نقاط XP عبر المستويات الـ 10، ارتقِ في الدوريات وتفوق على تلاميذ مدينتك!',
    lbAllMorocco: 'كل المغرب',
    lbProfileTitle: 'ملفك في الترتيب',
    lbSaved: 'تم الحفظ',
    lbPseudo: 'اسمك المستعار',
    lbCity: 'مدينتك',
    lbUpdateBtn: 'تحديث بياناتي',
    lbNextLeagueBefore: 'تبقى',
    lbNextLeagueAfter: 'نقطة XP للصعود للدوري التالي',
    lbMaxLeague: 'بلغت أعلى دوري — مبروك!',
    lbTopStudents: 'أفضل التلاميذ',
    lbYou: 'أنت',
    lbAvg: 'المعدل',
    lbBadgesTitle: 'أوسمتك وإنجازاتك',
    // Progression
    progTitle: 'لوحة متابعة التقدم',
    progSub: 'تابع جاهزيتك للامتحان',
    progEstScore: 'النقطة التقديرية',
    progCompleted: 'الاختبارات المكتملة',
    progStreak: 'سلسلة الأيام',
    progXp: 'مجموع XP',
    progMastery: 'نسبة التمكن حسب المادة',
    progToReviewLink: 'دروس للمراجعة',
    progRecent: 'النشاط الأخير',
    progEmpty: 'لم تنهِ أي اختبار في هذا المستوى بعد.',
    progStartFirst: 'ابدأ أول اختبار الآن',
    progCorrectAnswers: 'إجابات صحيحة',
    progReset: 'إعادة تعيين تقدمي المحلي',
    progResetConfirm: 'هل تريد حقاً مسح كل تقدمك المحفوظ على هذا الجهاز؟',
    // Review
    revTitle: 'دروس للمراجعة بالأولوية',
    revSub: 'ركّز مراجعتك على الدروس التي حصلت فيها على أقل من 12/20 أو التي لم تجربها بعد',
    revAllGoodTitle: 'ممتاز! جميع دروس هذا المستوى فوق 12/20!',
    revAllGoodSub: 'واصل التدريب بوضع الامتحان التجريبي لضمان ميزة حسن جداً.',
    revBackCatalog: 'العودة إلى المسار',
    revHighPriority: 'أولوية قصوى — نقطة أقل من 12/20',
    revBestScore: 'أفضل نقطة',
    revReviewNow: 'راجع هذا المستوى الآن',
    revUntried: 'مستويات لم تجربها بعد',
    revTestMe: 'اختبر معارفي',
    // Quiz Player
    qBackTrack: 'العودة إلى مسار الـ 10 مستويات',
    qModeTraining: 'وضع التدريب',
    qModeExam: 'امتحان تجريبي',
    qQuestion: 'السؤال',
    qCombo: 'سلسلة',
    qExplanation: 'الشرح والتوضيح',
    qExamTip: 'فخ شائع في الامتحان:',
    qNextQuestion: 'السؤال التالي',
    qFinishScore: 'إنهاء وعرض النقطة على 20',
    qBossWon: '🏆 تهانينا! اجتزت تحدي الامتحان!',
    qLevelPassed: 'أحسنت! تم اجتياز المستوى!',
    qKeepTrying: 'واصل التدريب لتحسين نقطتك!',
    qUnlockedNextBefore: 'تم فتح المستوى',
    qUnlockedNextAfter: '!',
    qDailyBonusWon: 'أتممت تحدي اليوم: +100 XP إضافية!',
    qYourScore20: 'نقطتك على 20',
    qSuccess: 'نسبة النجاح',
    qTime: 'المدة',
    qMaxCombo: 'أطول سلسلة',
    qInARow: 'متتالية',
    qGoNextLevel: 'الانتقال إلى المستوى',
    qRetryErrorsBefore: 'إعادة',
    qRetryErrorsAfter: 'أخطائي فقط',
    qReplay: 'إعادة الاختبار',
    qSeeMyRank: 'عرض ترتيبي',
    qDetailedCorrection: 'التصحيح المفصل',
    qYourAnswer: 'إجابتك:',
    qCorrectAnswer: 'الإجابة الصحيحة:',
    qBiofNote: 'ملاحظة: أسئلة المسالك العلمية مقدمة وفق صياغة الامتحانات الرسمية (المسلك الدولي BIOF).',
  },
} as const;

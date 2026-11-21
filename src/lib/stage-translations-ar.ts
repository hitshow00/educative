import type { Lang } from './i18n';

/**
 * Traductions arabes complètes de tous les 60 niveaux (titres, descriptions et sources d'examens)
 */
const STAGE_AR_MAP: Record<string, { title: string; desc: string; source?: string }> = {
  // 2Bac Maths (1–10)
  '2bac-maths-limites-bases-niv-1': {
    title: 'النهايات الاعتيادية والأشكال البسيطة',
    desc: 'الأساسيات الأولى لحساب النهايات عند ±∞ وعند 0.',
  },
  '2bac-maths-continuite-tvi-niv-2': {
    title: 'الاتصال ومبرهنة القيم الوسيطية (TVI)',
    desc: 'إثبات وجود ووحدانية الحل α في مجال معين.',
  },
  '2bac-maths-derivation-niv-3': {
    title: 'الاشتقاق ومعادلة المماس',
    desc: 'المشتقات المركبة، تغيرات الدالة ونقطة الانعطاف.',
  },
  '2bac-maths-suites-niv-4': {
    title: 'المتتاليات العددية والتقارب',
    desc: 'المتتاليات الهندسية، الترجع وتقارب المتتاليات الرتيبة.',
  },
  '2bac-maths-logarithme-niv-5': {
    title: 'الدالة اللوغاريتمية النيبيرية (ln)',
    desc: 'مجموعة التعريف، الخصائص الجبرية والنهايات الأساسية.',
  },
  '2bac-maths-exponentielle-niv-6': {
    title: 'الدالة الأسية وحل المعادلات',
    desc: 'النهايات الاعتيادية، الاشتقاق وتغيير المتغير.',
  },
  '2bac-maths-complexes-national-niv-7': {
    title: 'الأعداد العقدية (امتحانات وطنية)',
    desc: 'الشكل المثلثي، المعيار، العمدة والهندسة العقدية.',
    source: 'الامتحان الوطني 2022 • الدورة العادية',
  },
  '2bac-maths-integrales-national-niv-8': {
    title: 'الحساب التكاملي والمساحات (وطني)',
    desc: 'الدوال الأصلية، المكاملة بالأجزاء وحساب المساحة بـ cm².',
    source: 'الامتحان الوطني 2023 • الدورة العادية',
  },
  '2bac-maths-probas-espace-national-niv-9': {
    title: 'الاحتمالات والهندسة الفضائية (وطني)',
    desc: 'السحب آنياً، الفلكة والمستوى في الفضاء.',
    source: 'الامتحان الوطني 2024 • الدورة العادية',
  },
  '2bac-maths-boss-national-niv-10': {
    title: '🏆 التحدي النهائي: محاكاة الوطني للرياضيات',
    desc: 'اختبار شامل لأهم محاور الامتحان الوطني (2022–2024).',
    source: 'تجميع الامتحانات الوطنية 2022–2024',
  },

  // 2Bac PC (1–10)
  '2bac-pc-ondes-mecaniques-niv-1': {
    title: 'الموجات الميكانيكية المتوالية',
    desc: 'سرعة الانتشار، التأخر الزمني وطبيعة الموجة.',
  },
  '2bac-pc-ondes-lumineuses-niv-2': {
    title: 'الموجات الضوئية والحيود',
    desc: 'ظاهرة الحيود، الموشور ومعامل الانكسار.',
  },
  '2bac-pc-nucleaire-niv-3': {
    title: 'التناقص الإشعاعي والنوى والطاقة',
    desc: 'قوانين صودي، عمر النصف t₁/₂ ونقص الكتلة.',
  },
  '2bac-pc-dipole-rc-niv-4': {
    title: 'ثنائي القطب RC (الشحن والتفريغ)',
    desc: 'ثابتة الزمن τ = RC والطاقة الكهربائية في المكثف.',
  },
  '2bac-pc-dipole-rl-rlc-niv-5': {
    title: 'ثنائي القطب RL والتذبذبات RLC',
    desc: 'ثابتة الزمن L/R، الدور الخاص T₀ والطاقة المغناطيسية.',
  },
  '2bac-pc-cinetique-chimie-niv-6': {
    title: 'التتبع الزمني والسرعة الحجمية',
    desc: 'زمن نصف التفاعل والعوامل الحركية والحفاز.',
  },
  '2bac-pc-acide-base-national-niv-7': {
    title: 'الحمض-قاعدة، pH والمعايرة (وطني)',
    desc: 'نسبة التقدم τ، ثابتة الحمضية pKa ونقطة التكافؤ.',
    source: 'الامتحان الوطني 2023 • فيزياء',
  },
  '2bac-pc-piles-electrolyse-national-niv-8': {
    title: 'الأعمدة والتحليل الكهربائي (وطني)',
    desc: 'الأنود والكاثود، منحى التيار وكمية الكهرباء Q.',
    source: 'الامتحان الوطني 2022 • فيزياء',
  },
  '2bac-pc-mecanique-newton-national-niv-9': {
    title: 'قوانين نيوتن والأقمار الاصطناعية (وطني)',
    desc: 'المستوى المائل، السقوط الحر والقانون الثالث لكيبلر.',
    source: 'الامتحان الوطني 2024 • فيزياء',
  },
  '2bac-pc-boss-national-niv-10': {
    title: '🏆 التحدي النهائي: محاكاة الوطني فيزياء-كيمياء',
    desc: 'اختبار شامل: موجات، كهرباء، كيمياء وميكانيك (2022–2024).',
    source: 'تجميع الامتحانات الوطنية 2022–2024',
  },

  // 2Bac SVT (1–10)
  '2bac-svt-glycolyse-respiration-niv-1': {
    title: 'انحلال الكليكوز والتنفس الخلوي',
    desc: 'مراحل هدم الكليكوز في الجبلة الشفافة والميتوكوندري.',
  },
  '2bac-svt-fermentation-niv-2': {
    title: 'التخمر اللبني والكحولي',
    desc: 'مقارنة المردود الطاقي في وسط لا هوائي.',
  },
  '2bac-svt-muscle-niv-3': {
    title: 'التقلص العضلي وتجديد ATP',
    desc: 'الساركومير، أيونات Ca²⁺ وطرق تجديد الطاقة.',
  },
  '2bac-svt-adn-replication-niv-4': {
    title: 'الـ ADN ومضاعفته خلال الطور S',
    desc: 'البنية اللولبية، تكامل القواعد والمضاعفة نصف المحافظة.',
  },
  '2bac-svt-expression-genetique-niv-5': {
    title: 'النسخ والترجمة (تركيب البروتينات)',
    desc: 'من الـ ADN إلى ARNm ثم إلى البروتين عبر الرمز الوراثي.',
  },
  '2bac-svt-mitose-meiose-niv-6': {
    title: 'الانقسام غير المباشر والانقسام الاختزالي',
    desc: 'العبور الصبغي والتخليط الوراثي.',
  },
  '2bac-svt-mendel-national-niv-7': {
    title: 'قوانين مندل والتزاوجات (وطني)',
    desc: 'الهجونة الأحادية والثنائية والمورثات المرتبطة والمستقلة.',
    source: 'الامتحان الوطني 2023 • علوم الحياة والأرض',
  },
  '2bac-svt-genetique-humaine-national-niv-8': {
    title: 'الوراثة البشرية وشجرات النسب (وطني)',
    desc: 'الانتقال الصبغي الجسدي والجنسي، السائد والمتنحي.',
    source: 'الامتحان الوطني 2022 • علوم الحياة والأرض',
  },
  '2bac-svt-geologie-national-niv-9': {
    title: 'الجيولوجيا: الطمر والطفو والاصطدام',
    desc: 'السلاسل الجبلية الحديثة، التحول والأوفيوليت.',
    source: 'الامتحان الوطني 2024 • علوم الحياة والأرض',
  },
  '2bac-svt-boss-national-niv-10': {
    title: '🏆 التحدي النهائي: محاكاة الوطني SVT',
    desc: 'اختبار شامل: الطاقة، الوراثة، المناعة والجيولوجيا.',
    source: 'تجميع الامتحانات الوطنية SVT 2022–2024',
  },

  // 1Bac Français (1–10)
  '1bac-fr-boite-bases-niv-1': {
    title: 'La Boîte à Merveilles: الكاتب والنوع والأماكن',
    desc: 'المعلومات الأساسية حول الرواية السيرية لأحمد الصفريوي.',
  },
  '1bac-fr-boite-personnages-niv-2': {
    title: 'La Boîte à Merveilles: الشخصيات والعائلة',
    desc: 'المعلم عبد السلام، لالة زبيدة، رحمة ولالة عائشة.',
  },
  '1bac-fr-boite-themes-niv-3': {
    title: 'La Boîte à Merveilles: الرموز والتقاليد',
    desc: 'المسيد، الحمام، عاشوراء وعزلة الطفل سيدي محمد.',
  },
  '1bac-fr-antigone-bases-niv-4': {
    title: 'Antigone: التراجيديا الحديثة والشخصيات',
    desc: 'جان أنوي (1944)، أنتيغون، كريون، إسمين وهيمون.',
  },
  '1bac-fr-antigone-conflit-niv-5': {
    title: 'Antigone: المواجهة بين أنتيغون وكريون',
    desc: 'مفهوم السعادة، الحتمية التراجيدية والمفارقة الزمنية.',
  },
  '1bac-fr-condamne-bases-niv-6': {
    title: 'Le Dernier Jour d’un Condamné: الأطروحة',
    desc: 'فيكتور هوغو (1829) ومناهضة عقوبة الإعدام.',
  },
  '1bac-fr-figures-style-regional-niv-7': {
    title: 'الأساليب البلاغية Figures de Style (جهوي)',
    desc: 'التشبيه، الاستعارة، المبالغة والطباق.',
    source: 'الامتحان الجهوي 2023 • الدار البيضاء-سطات',
  },
  '1bac-fr-registres-regional-niv-8': {
    title: 'النبر الأدبي وزوايا السرد (جهوي)',
    desc: 'المأساوي، التراجيدي، الساخر والتبئير السردي.',
    source: 'الامتحان الجهوي 2022 • مراكش-آسفي',
  },
  '1bac-fr-langue-discours-regional-niv-9': {
    title: 'الخطاب المباشر وغير المباشر واللغة (جهوي)',
    desc: 'تحويل الجمل والأزمنة في الامتحان الجهوي.',
    source: 'الامتحان الجهوي 2024 • الرباط-سلا-القنيطرة',
  },
  '1bac-fr-boss-regional-niv-10': {
    title: '🏆 التحدي النهائي: محاكاة الجهوي للفرنسية',
    desc: 'اختبار شامل للروايات الثلاث والأساليب واللغة.',
    source: 'تجميع الامتحانات الجهوية 1 باك 2022–2024',
  },

  // 3AC Maths (1–10)
  '3ac-maths-identites-niv-1': {
    title: 'النشر والتعميل والمتطابقات الهامة',
    desc: 'إتقان المتطابقات الثلاث دون أخطاء الإشارة.',
  },
  '3ac-maths-racines-niv-2': {
    title: 'الجذور المربعة والتبسيط',
    desc: 'الحساب بالجذور وحذف الجذر من المقام.',
  },
  '3ac-maths-puissances-niv-3': {
    title: 'القوى والكتابة العلمية',
    desc: 'قواعد حساب قوى العدد 10 والكتابة العلمية.',
  },
  '3ac-maths-pythagore-niv-4': {
    title: 'مبرهنة فيتاغورس والمبرهنة العكسية',
    desc: 'حساب الأطوال وإثبات أن المثلث قائم الزاوية.',
  },
  '3ac-maths-thales-niv-5': {
    title: 'مبرهنة طاليس والتوازي',
    desc: 'النسب المتساوية وإثبات توازي مستقيمين.',
  },
  '3ac-maths-trigo-niv-6': {
    title: 'الحساب المثلثي في المثلث القائم',
    desc: 'جيب التمام، الجيب، الظل والعلاقة الأساسية.',
  },
  '3ac-maths-equations-regional-niv-7': {
    title: 'المعادلات والمتراجحات (جهوي 3 إعدادي)',
    desc: 'معادلة الجداء المنعدم وتغيير رمز المتراجحة.',
    source: 'الموحد الجهوي 3 إعدادي 2023',
  },
  '3ac-maths-fonctions-regional-niv-8': {
    title: 'الدوال الخطية والتآلفية (جهوي)',
    desc: 'المعامل الموجه، الصورة، السابق والتمثيل المبياني.',
    source: 'الموحد الجهوي 3 إعدادي 2023',
  },
  '3ac-maths-repere-vecteurs-regional-niv-9': {
    title: 'المعلم في المستوى ومعادلة مستقيم',
    desc: 'إحداثيات المنتصف، المسافة وتعامل مستقيمين.',
    source: 'الموحد الجهوي 3 إعدادي 2024',
  },
  '3ac-maths-boss-regional-niv-10': {
    title: '🏆 التحدي النهائي: محاكاة الجهوي 3 إعدادي',
    desc: 'اختبار شامل للنظمة، التكبير والتصغير والإحصاء.',
    source: 'تجميع الامتحانات الجهوية 3 إعدادي 2022–2024',
  },

  // 6ème Maths (1–10)
  '6eme-maths-operations-niv-1': {
    title: 'العمليات والأعداد العشرية',
    desc: 'الجمع والطرح والضرب في 10 و100 و1000.',
  },
  '6eme-maths-multiples-niv-2': {
    title: 'المضاعفات والقواسم وقابلية القسمة',
    desc: 'التعرف على مضاعفات 2 و3 و5 و9.',
  },
  '6eme-maths-fractions-niv-3': {
    title: 'الأعداد الكسرية: الجمع والضرب',
    desc: 'توحيد المقامات والاختزال.',
  },
  '6eme-maths-proportionnalite-niv-4': {
    title: 'التناسبية والنسبة المئوية',
    desc: 'القاعدة الثلاثية، التخفيضات والسلالم.',
  },
  '6eme-maths-unites-niv-5': {
    title: 'تحويل وحدات القياس (الطول والمساحة)',
    desc: 'الكيلومتر، المتر، الهكتار واللتر.',
  },
  '6eme-maths-angles-niv-6': {
    title: 'الزوايا ومجموع زوايا المثلث',
    desc: 'حساب قياسات الزوايا في المثلثات.',
  },
  '6eme-maths-aires-provincial-niv-7': {
    title: 'المساحات والمحيطات (إقليمي 6 ابتدائي)',
    desc: 'المستطيل، المربع والمثلث.',
    source: 'الامتحان الإقليمي 2023',
  },
  '6eme-maths-volumes-provincial-niv-8': {
    title: 'الحجوم: المكعب ومتوازي المستطيلات',
    desc: 'حساب الحجوم والتحويل إلى اللتر.',
    source: 'الامتحان الإقليمي 2023',
  },
  '6eme-maths-vitesse-provincial-niv-9': {
    title: 'السرعة المتوسطة والمدد الزمنية (إقليمي)',
    desc: 'العلاقة بين المسافة والمدة والسرعة.',
    source: 'الامتحان الإقليمي 2024',
  },
  '6eme-maths-boss-provincial-niv-10': {
    title: '🏆 التحدي النهائي: محاكاة الإقليمي 6 ابتدائي',
    desc: 'اختبار شامل لنيل شهادة الدروس الابتدائية.',
    source: 'تجميع الامتحانات الإقليمية 2022–2024',
  },
};

export function getLocalizedStage(
  slug: string,
  fallback: { title: string; desc: string; source?: string },
  lang: Lang
): { title: string; desc: string; source?: string } {
  if (lang !== 'ar') return fallback;
  const ar = STAGE_AR_MAP[slug];
  if (!ar) return fallback;
  return {
    title: ar.title,
    desc: ar.desc,
    source: ar.source || fallback.source,
  };
}

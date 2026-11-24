import fs from 'node:fs';
import path from 'node:path';

const SOURCE_DIR = process.env.LOCAL_COURSES_DIR || 'C:\\Users\\hit\\Desktop\\cour';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'data');

const LEVEL_FOLDERS = {
  '01_Scientifique 2.bac': '2bac',
  '01_Scientifique 1.bac': '1bac',
  '3eme_College': '3ac',
  '6eme_Primaire': '6eme',
};

function detectSubject(fullRelPath) {
  const lower = fullRelPath.toLowerCase();
  if (fullRelPath.includes('الرياضيات') || lower.includes('math')) return 'Mathématiques';
  if (fullRelPath.includes('الفيزياء') || lower.includes('physique') || lower.includes('chimie'))
    return 'Physique-Chimie';
  if (fullRelPath.includes('علوم الحياة') || lower.includes('svt')) return 'SVT';
  if (fullRelPath.includes('علوم المهندس') || lower.includes('ingenieur'))
    return "Sciences de l'Ingénieur";
  if (fullRelPath.includes('الفرنسية') || lower.includes('francais') || lower.includes('français'))
    return 'Français';
  if (fullRelPath.includes('العربية') || lower.includes('arabe')) return 'Arabe';
  if (fullRelPath.includes('الاجتماعيات') || fullRelPath.includes('التاريخ'))
    return 'Histoire-Géographie';
  if (fullRelPath.includes('التربية الاسلامية') || fullRelPath.includes('التربية الإسلامية'))
    return 'Éducation Islamique';
  if (fullRelPath.includes('النشاط العلمي')) return 'Activité Scientifique';
  if (fullRelPath.includes('الفلسفة') || lower.includes('philo')) return 'Philosophie';
  if (fullRelPath.includes('انجليزية') || fullRelPath.includes('الإنجليزية') || lower.includes('anglais'))
    return 'Anglais';
  return 'Autres Matières';
}

function detectCategory(parts) {
  const joined = parts.join('/').toLowerCase();
  if (joined.includes('_examens') || joined.includes('امتحانات')) return 'Examens';
  if (joined.includes('_controles') || joined.includes('فروض')) return 'Contrôles';
  if (joined.includes('/resumes') || joined.includes('ملخص')) return 'Résumés';
  if (joined.includes('/exercices') || joined.includes('تمارين')) return 'Exercices';
  return 'Cours';
}

function detectTrack(fullRelPath) {
  const lower = fullRelPath.toLowerCase();
  if (lower.includes('biof') || fullRelPath.includes('خيار فرنسي') || fullRelPath.includes('خيار فرنسية')) {
    if (fullRelPath.includes('علوم رياضية')) return 'BIOF SM';
    if (fullRelPath.includes('علوم فيزيائية')) return 'BIOF PC';
    if (fullRelPath.includes('علوم الحياة')) return 'BIOF SVT';
    return 'BIOF';
  }
  if (fullRelPath.includes('خيار انجليزية')) return 'Option Anglais';
  return 'Arabe / Général';
}

function cleanTitle(filename) {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function walkFiles(dir, baseDir, results) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, baseDir, results);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase().replace('.', '');
      if (!['pdf', 'doc', 'docx', 'zip'].includes(ext)) continue;
      const stat = fs.statSync(full);
      const rel = path.relative(baseDir, full).split(path.sep).join('/');
      results.push({
        rel,
        name: entry.name,
        ext,
        sizeKb: Math.max(1, Math.round(stat.size / 1024)),
      });
    }
  }
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Dossier source introuvable : ${SOURCE_DIR}`);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const meta = {
    generatedAt: new Date().toISOString(),
    totalFiles: 0,
    levels: {},
  };

  for (const [folderName, levelId] of Object.entries(LEVEL_FOLDERS)) {
    const levelDir = path.join(SOURCE_DIR, folderName);
    if (!fs.existsSync(levelDir)) {
      console.warn(`Dossier manquant : ${levelDir}`);
      continue;
    }

    const rawFiles = [];
    walkFiles(levelDir, SOURCE_DIR, rawFiles);

    const items = rawFiles.map((f) => {
      const parts = f.rel.split('/');
      return {
        t: cleanTitle(f.name),
        sub: detectSubject(f.rel),
        cat: detectCategory(parts),
        tr: detectTrack(f.rel),
        sz: f.sizeKb,
        e: f.ext,
        p: f.rel,
      };
    });

    // Statistiques par matière et catégorie
    const subjects = {};
    const categories = {};
    for (const item of items) {
      subjects[item.sub] = (subjects[item.sub] || 0) + 1;
      categories[item.cat] = (categories[item.cat] || 0) + 1;
    }

    const outPath = path.join(OUTPUT_DIR, `library-${levelId}.json`);
    fs.writeFileSync(outPath, JSON.stringify(items), 'utf8');

    meta.totalFiles += items.length;
    meta.levels[levelId] = {
      count: items.length,
      subjects,
      categories,
    };

    console.log(
      `[OK] ${levelId} (${folderName}) -> ${items.length} fichiers indexés (${(
        fs.statSync(outPath).size / 1024
      ).toFixed(1)} Ko JSON)`
    );
  }

  const metaPath = path.join(OUTPUT_DIR, 'library-meta.json');
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
  console.log(`\nTotal indexé : ${meta.totalFiles} fichiers -> ${metaPath}`);
}

main();

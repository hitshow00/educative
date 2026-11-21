'use client';

import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import {
  BookOpenCheck,
  ExternalLink,
  FileJson,
  Loader2,
  LogOut,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { slugify } from '@/lib/slugify';
import { LEVELS, type LevelId, type Quiz } from '@/types/quiz';

const SAMPLE_QUESTIONS_JSON = JSON.stringify(
  [
    {
      question_text: 'Exemple : Quelle est la dérivée de f(x) = x² ?',
      options: ['x', '2x', 'x²', '2'],
      correct_index: 1,
      explanation: 'La dérivée de x^n est n·x^(n-1), donc (x²)\' = 2x.',
      exam_tip: 'Vérifiez toujours les exposants avant de dériver.',
    },
  ],
  null,
  2
);

interface AdminDashboardProps {
  userEmail: string;
  initialSupabaseQuizzes: Quiz[];
  builtInCount: number;
}

export function AdminDashboard({
  userEmail,
  initialSupabaseQuizzes,
  builtInCount,
}: AdminDashboardProps) {
  const supabase = useMemo(() => createClient(), []);
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialSupabaseQuizzes);
  const [loading, setLoading] = useState(false);

  // Formulaire de création d'un quiz + import JSON de questions
  const [level, setLevel] = useState<LevelId>('2bac');
  const [subject, setSubject] = useState('Mathématiques');
  const [branch, setBranch] = useState('Sciences PC / SVT');
  const [chapterTitle, setChapterTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [examType, setExamType] = useState<'National' | 'Régional' | 'Local' | 'Provincial'>(
    'National'
  );
  const [questionsJson, setQuestionsJson] = useState(SAMPLE_QUESTIONS_JSON);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const refreshQuizzes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('quizzes')
      .select(
        'id, slug, level, branch, subject, chapter_title, description, exam_type, difficulty, estimated_minutes, questions(id, question_text, options, correct_index, explanation, exam_tip, order_index)'
      )
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      setQuizzes(data as unknown as Quiz[]);
    }
    setLoading(false);
  }, [supabase]);

  async function handleCreateQuiz(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    let parsedQuestions: Array<{
      question_text: string;
      options: string[];
      correct_index: number;
      explanation: string;
      exam_tip?: string;
    }>;

    try {
      parsedQuestions = JSON.parse(questionsJson);
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        throw new Error('Le JSON doit contenir un tableau d’au moins 1 question.');
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `JSON invalide : ${err instanceof Error ? err.message : 'vérifiez la syntaxe'}`,
      });
      return;
    }

    const cleanSlug = slugify(slug || `${level}-${subject}-${chapterTitle}`);
    if (!cleanSlug) {
      setFeedback({ type: 'error', message: 'Le slug est obligatoire.' });
      return;
    }

    setSubmitting(true);

    const { data: insertedQuiz, error: quizErr } = await supabase
      .from('quizzes')
      .insert([
        {
          slug: cleanSlug,
          level,
          branch: branch.trim() || 'Général',
          subject: subject.trim(),
          chapter_title: chapterTitle.trim(),
          description: description.trim(),
          exam_type: examType,
          difficulty: 'Moyen',
          estimated_minutes: Math.max(3, parsedQuestions.length),
          is_published: true,
        },
      ])
      .select('id')
      .single();

    if (quizErr || !insertedQuiz) {
      setFeedback({
        type: 'error',
        message:
          quizErr?.message ||
          'Erreur lors de la création (vérifiez que votre compte a le rôle admin dans app_metadata).',
      });
      setSubmitting(false);
      return;
    }

    const questionRows = parsedQuestions.map((q, idx) => ({
      quiz_id: insertedQuiz.id,
      question_text: q.question_text,
      options: q.options,
      correct_index: q.correct_index,
      explanation: q.explanation,
      exam_tip: q.exam_tip || null,
      order_index: idx,
    }));

    const { error: qErr } = await supabase.from('questions').insert(questionRows);
    if (qErr) {
      setFeedback({
        type: 'error',
        message: `Quiz créé mais erreur sur les questions : ${qErr.message}`,
      });
    } else {
      setFeedback({
        type: 'success',
        message: `Quiz "${chapterTitle}" publié avec ${questionRows.length} question(s) !`,
      });
      setChapterTitle('');
      setSlug('');
      setDescription('');
      await refreshQuizzes();
    }

    setSubmitting(false);
  }

  async function handleDeleteQuiz(item: Quiz) {
    if (!window.confirm(`Supprimer le quiz "${item.chapter_title}" de Supabase ?`)) return;
    const { error } = await supabase.from('quizzes').delete().eq('id', item.id);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
    } else {
      setQuizzes((prev) => prev.filter((q) => q.id !== item.id));
      setFeedback({ type: 'success', message: 'Quiz supprimé.' });
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Administration des Quiz</h1>
          <p className="text-xs text-slate-500">
            Connecté en tant que <strong>{userEmail}</strong> • {builtInCount} quiz intégrés +{' '}
            {quizzes.length} quiz Supabase
          </p>
        </div>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </form>
      </div>

      {feedback && (
        <div
          className={`rounded-xl px-4 py-3 text-sm border flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span>{feedback.message}</span>
          <button type="button" onClick={() => setFeedback(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Formulaire de publication rapide d'un quiz (Import JSON) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-600" />
          <span>Publier un nouveau quiz (avec import JSON des questions)</span>
        </h2>

        <form onSubmit={handleCreateQuiz} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Niveau *</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as LevelId)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white"
            >
              {LEVELS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label} ({l.examTitle})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Type d’examen *
            </label>
            <select
              value={examType}
              onChange={(e) =>
                setExamType(e.target.value as 'National' | 'Régional' | 'Local' | 'Provincial')
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white"
            >
              <option value="National">National</option>
              <option value="Régional">Régional</option>
              <option value="Local">Local</option>
              <option value="Provincial">Provincial</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Matière *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Mathématiques, Physique-Chimie, SVT, Français..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Filière</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="Sciences PC / SVT / SM"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Titre du chapitre *
            </label>
            <input
              type="text"
              required
              value={chapterTitle}
              onChange={(e) => {
                setChapterTitle(e.target.value);
                setSlug(slugify(`${level}-${subject}-${e.target.value}`));
              }}
              placeholder="Ex : Nombres Complexes & Géométrie"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Slug URL *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="2bac-maths-nombres-complexes"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description courte *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Forme trigonométrique, module, argument et transformations."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileJson className="w-4 h-4 text-indigo-600" />
              <span>Questions QCM (format JSON) *</span>
            </label>
            <textarea
              rows={9}
              required
              value={questionsJson}
              onChange={(e) => setQuestionsJson(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs font-mono bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold text-sm px-6 py-2.5 transition-colors"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Publier le quiz</span>
            </button>
          </div>
        </form>
      </section>

      {/* Liste des quiz enregistrés dans Supabase */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="w-4 h-4 text-emerald-600" />
            <span>Quiz publiés dans Supabase ({quizzes.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Aucun quiz personnalisé dans Supabase pour le moment. Les {builtInCount} quiz intégrés
            du programme officiel sont déjà actifs sur le site.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {quizzes.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.chapter_title}</p>
                  <p className="text-xs text-slate-500">
                    {item.level.toUpperCase()} • {item.subject} • {item.questions?.length || 0} QCM
                    • /{item.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/quiz/${item.slug}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Voir</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuiz(item)}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

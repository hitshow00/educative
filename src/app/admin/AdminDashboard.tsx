'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  BarChart3,
  Check,
  Code2,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  Loader2,
  LogOut,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { slugify } from '@/lib/slugify';
import {
  FILE_FORMATS,
  GRADE_LEVELS,
  SUBJECTS,
  type Resource,
  type ResourceInput,
} from '@/types/resource';

const EMPTY_FORM: ResourceInput = {
  title: '',
  slug: '',
  subject: 'Mathématiques',
  grade_level: '2Bac',
  file_size: '',
  file_format: 'PDF',
  external_url: '',
};

interface AdminDashboardProps {
  userEmail: string;
  initialResources: Resource[];
  siteUrl: string;
}

export function AdminDashboard({
  userEmail,
  initialResources,
  siteUrl,
}: AdminDashboardProps) {
  const supabase = useMemo(() => createClient(), []);

  // === ÉTAT DONNÉES CRUD ===
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('ALL');

  // === ÉTAT FORMULAIRE (AJOUT / ÉDITION) ===
  const [form, setForm] = useState<ResourceInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const normalizedSiteUrl = siteUrl.replace(/\/$/, '');

  // Rafraîchissement des ressources depuis Supabase
  const fetchResources = useCallback(async () => {
    setLoadingData(true);
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setFeedback({ type: 'error', message: `Erreur de chargement : ${error.message}` });
    } else {
      setResources((data as Resource[]) || []);
    }
    setLoadingData(false);
  }, [supabase]);

  // Mise à jour du titre avec génération automatique du slug
  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugManuallyEdited ? prev.slug : slugify(value),
    }));
  }

  // Soumission Création / Modification
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    const cleanSlug = slugify(form.slug || form.title);
    if (!cleanSlug) {
      setFeedback({ type: 'error', message: 'Le slug est obligatoire.' });
      return;
    }

    if (!/^https?:\/\//i.test(form.external_url.trim())) {
      setFeedback({
        type: 'error',
        message: 'L\'URL externe doit commencer par http:// ou https://',
      });
      return;
    }

    setSubmitting(true);

    const payload: ResourceInput = {
      title: form.title.trim(),
      slug: cleanSlug,
      subject: form.subject,
      grade_level: form.grade_level,
      file_size: form.file_size.trim(),
      file_format: form.file_format,
      external_url: form.external_url.trim(),
    };

    if (editingId) {
      const { error } = await supabase.from('resources').update(payload).eq('id', editingId);

      if (error) {
        setFeedback({ type: 'error', message: `Échec de la modification : ${error.message}` });
      } else {
        setFeedback({ type: 'success', message: 'Ressource mise à jour avec succès.' });
        resetForm();
        await fetchResources();
      }
    } else {
      const { error } = await supabase.from('resources').insert([payload]);

      if (error) {
        const msg =
          error.code === '23505'
            ? 'Ce slug existe déjà. Choisissez un slug unique.'
            : `Échec de l'ajout : ${error.message}`;
        setFeedback({ type: 'error', message: msg });
      } else {
        setFeedback({
          type: 'success',
          message: `Ressource ajoutée ! Copiez le code Blogger pour "${cleanSlug}" ci-dessous.`,
        });
        resetForm();
        await fetchResources();
      }
    }

    setSubmitting(false);
  }

  function startEdit(item: Resource) {
    setEditingId(item.id);
    setSlugManuallyEdited(true);
    setForm({
      title: item.title,
      slug: item.slug,
      subject: item.subject,
      grade_level: item.grade_level,
      file_size: item.file_size,
      file_format: item.file_format || 'PDF',
      external_url: item.external_url,
    });
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setSlugManuallyEdited(false);
    setForm(EMPTY_FORM);
  }

  async function handleDelete(item: Resource) {
    const confirmed = window.confirm(
      `Supprimer définitivement "${item.title}" ?\nLes blocs Blogger utilisant le slug "${item.slug}" ne fonctionneront plus.`
    );
    if (!confirmed) return;

    const { error } = await supabase.from('resources').delete().eq('id', item.id);
    if (error) {
      setFeedback({ type: 'error', message: `Erreur de suppression : ${error.message}` });
    } else {
      setFeedback({ type: 'success', message: 'Ressource supprimée.' });
      setResources((prev) => prev.filter((r) => r.id !== item.id));
    }
  }

  async function copyToClipboard(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      window.prompt('Copiez ce texte :', text);
    }
  }

  // Statistiques globales
  const stats = useMemo(() => {
    const totalDownloads = resources.reduce((sum, r) => sum + (r.download_count || 0), 0);
    const topResource = resources.reduce<Resource | null>(
      (top, r) => (!top || r.download_count > top.download_count ? r : top),
      null
    );
    return { totalResources: resources.length, totalDownloads, topResource };
  }, [resources]);

  // Liste filtrée
  const filteredResources = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return resources.filter((r) => {
      const matchGrade = filterGrade === 'ALL' || r.grade_level === filterGrade;
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q);
      return matchGrade && matchSearch;
    });
  }, [resources, searchQuery, filterGrade]);

  const previewBloggerHtml = form.slug
    ? `<div class="edu-download-box" data-slug="${slugify(form.slug)}"></div>`
    : '';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barre supérieure */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              E
            </span>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900">
                Panneau Admin — Ressources
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">{userEmail}</p>
            </div>
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Statistiques */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total fichiers</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalResources}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total téléchargements</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalDownloads.toLocaleString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Ressource la plus populaire</p>
              <p className="text-sm font-bold text-slate-900 truncate">
                {stats.topResource ? stats.topResource.title : '—'}
              </p>
            </div>
          </div>
        </section>

        {/* Message de retour */}
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

        {/* Formulaire Ajout / Modification */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {editingId ? (
                <Edit3 className="w-4 h-4 text-amber-600" />
              ) : (
                <Plus className="w-4 h-4 text-emerald-600" />
              )}
              <span>{editingId ? 'Modifier la ressource' : 'Ajouter un nouveau fichier'}</span>
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Annuler la modification
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Titre du cours / pack *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: Pack Maths 2Bac PC & SVT — Cours + Examens Nationaux"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Slug (auto-généré, unique) *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  setForm((prev) => ({ ...prev, slug: e.target.value }));
                }}
                placeholder="pack-maths-2bac-pc-svt"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lien externe (Up-4ever, MediaFire, Google Drive) *
              </label>
              <input
                type="url"
                required
                value={form.external_url}
                onChange={(e) => setForm((prev) => ({ ...prev, external_url: e.target.value }))}
                placeholder="https://www.mediafire.com/file/..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Niveau *</label>
                <select
                  value={form.grade_level}
                  onChange={(e) => setForm((prev) => ({ ...prev, grade_level: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white focus:border-emerald-500 focus:outline-none"
                >
                  {GRADE_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Matière *</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white focus:border-emerald-500 focus:outline-none"
                >
                  {SUBJECTS.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Taille du fichier *
                </label>
                <input
                  type="text"
                  required
                  value={form.file_size}
                  onChange={(e) => setForm((prev) => ({ ...prev, file_size: e.target.value }))}
                  placeholder="Ex: 145 Mo ou 1.2 Go"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Format *</label>
                <select
                  value={form.file_format}
                  onChange={(e) => setForm((prev) => ({ ...prev, file_format: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white focus:border-emerald-500 focus:outline-none"
                >
                  {FILE_FORMATS.map((fmt) => (
                    <option key={fmt} value={fmt}>
                      {fmt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Aperçu en direct du code HTML Blogger */}
            {previewBloggerHtml && (
              <div className="md:col-span-2 rounded-xl bg-slate-900 text-slate-100 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400 mb-1">
                    Code HTML à coller dans votre article Blogger :
                  </p>
                  <code className="text-xs text-emerald-400 break-all">{previewBloggerHtml}</code>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(previewBloggerHtml, 'preview')}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold"
                >
                  {copiedKey === 'preview' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedKey === 'preview' ? 'Copié' : 'Copier'}</span>
                </button>
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-sm px-6 py-2.5 transition-colors"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{editingId ? 'Enregistrer les modifications' : 'Ajouter la ressource'}</span>
              </button>
            </div>
          </form>
        </section>

        {/* Liste des ressources */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre, matière ou slug..."
                className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="ALL">Tous les niveaux</option>
              {GRADE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {loadingData ? (
            <div className="p-10 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Aucune ressource trouvée.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredResources.map((item) => {
                const bloggerSnippet = `<div class="edu-download-box" data-slug="${item.slug}"></div>`;
                const safelinkUrl = `${normalizedSiteUrl}/download/${item.slug}`;

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
                          {item.grade_level}
                        </span>
                        <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
                          {item.subject}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {item.file_size} • {item.file_format || 'PDF'}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      <p className="text-xs font-mono text-slate-500 truncate">/{item.slug}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700">
                        <Download className="w-3.5 h-3.5 text-emerald-600" />
                        {item.download_count.toLocaleString('fr-FR')}
                      </span>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(bloggerSnippet, `html-${item.id}`)}
                        title="Copier le code HTML pour Blogger"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                      >
                        {copiedKey === `html-${item.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span>{copiedKey === `html-${item.id}` ? 'Copié' : 'HTML Blogger'}</span>
                      </button>

                      <a
                        href={safelinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Tester la page de téléchargement"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 p-1.5 text-slate-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        title="Modifier"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:text-amber-700 p-1.5 text-slate-600"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        title="Supprimer"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:text-red-700 p-1.5 text-slate-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

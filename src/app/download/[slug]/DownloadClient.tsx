'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  HardDrive,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import type { Resource } from '@/types/resource';
import { AdSlot } from '@/components/AdSlot';

const COUNTDOWN_SECONDS = 8;

interface DownloadClientProps {
  resource: Resource;
  blogUrl: string;
}

export function DownloadClient({ resource, blogUrl }: DownloadClientProps) {
  const supabase = useMemo(() => createClient(), []);
  const [secondsLeft, setSecondsLeft] = useState<number>(COUNTDOWN_SECONDS);
  const [downloadCount, setDownloadCount] = useState<number>(resource.download_count);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  // Compte à rebours dynamique de 8 secondes
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const isReady = secondsLeft === 0;
  const progressPercent = Math.round(
    ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS) * 100
  );

  // Appelle la fonction RPC sécurisée `increment_download` puis redirige vers le lien externe
  async function handleFinalDownload() {
    if (!isReady || isRedirecting) return;

    setIsRedirecting(true);

    try {
      const { data: updatedCount, error } = await supabase.rpc('increment_download', {
        resource_slug: resource.slug,
      });

      if (!error && typeof updatedCount === 'number') {
        setDownloadCount(updatedCount);
      } else {
        setDownloadCount((prev) => prev + 1);
      }
    } catch (err) {
      // Même en cas d'erreur réseau temporaire sur le compteur, on ne bloque pas l'élève
      console.error('Erreur lors de l\'incrémentation du compteur :', err);
    } finally {
      // Redirection vers Up-4ever / MediaFire / Google Drive
      window.location.href = resource.external_url;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* En-tête rassurant */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <a
            href={blogUrl}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-emerald-600 transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </span>
            <span>Soutien Scolaire Maroc</span>
          </a>

          <a
            href={blogUrl}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Retour aux cours</span>
          </a>
        </div>
      </header>

      {/* Contenu principal (Mobile-First) */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* === EMPLACEMENT PUBLICITAIRE 1 : HAUT === */}
        <AdSlot position="haut" minHeightClass="min-h-[95px]" />

        {/* Carte principale d'information du fichier */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Bandeau supérieur */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Lien vérifié • Téléchargement gratuit</span>
            </div>
            <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">
              {resource.grade_level}
            </span>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            {/* Badges & Titre */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {resource.subject}
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {resource.file_format || 'PDF'}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {resource.title}
              </h1>
            </div>

            {/* Grille des métadonnées */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
                <HardDrive className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <p className="text-[11px] text-slate-500">Taille</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                  {resource.file_size}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
                <FileText className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <p className="text-[11px] text-slate-500">Format</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                  {resource.file_format || 'PDF'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
                <Download className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <p className="text-[11px] text-slate-500">Téléchargements</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                  {downloadCount.toLocaleString('fr-FR')}
                </p>
              </div>
            </div>

            {/* === EMPLACEMENT PUBLICITAIRE 2 : MILIEU === */}
            <AdSlot position="milieu" minHeightClass="min-h-[250px]" />

            {/* Zone Compte à rebours + Bouton final */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-center space-y-4">
              {!isReady ? (
                <>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Clock className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span>Préparation de votre lien sécurisé...</span>
                  </div>

                  {/* Compteur numérique */}
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center shadow-sm">
                      <span className="text-2xl font-extrabold text-emerald-700 tabular-nums">
                        {secondsLeft}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Veuillez patienter {secondsLeft} seconde{secondsLeft > 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Barre de progression */}
                  <div className="w-full max-w-sm mx-auto h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Votre fichier est prêt !</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleFinalDownload}
                    disabled={isRedirecting}
                    className="w-full sm:w-auto sm:min-w-[280px] inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-70 text-white font-bold text-base py-3.5 px-6 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    {isRedirecting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Redirection en cours...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Accéder au téléchargement</span>
                        <ExternalLink className="w-4 h-4 opacity-80" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500">
                    Vous allez être redirigé vers le serveur de téléchargement externe.
                  </p>
                </div>
              )}
            </div>

            {/* Conseils utiles pour les élèves */}
            <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-4 text-xs text-blue-900 space-y-1.5">
              <p className="font-semibold">Conseil pour les élèves sur smartphone :</p>
              <p className="text-blue-800/90 leading-relaxed">
                Si le fichier est au format <strong>ZIP / RAR</strong>, utilisez une application
                gratuite comme <em>ZArchiver</em> ou <em>Files by Google</em> pour l&apos;extraire et
                lire les PDF facilement sur votre téléphone.
              </p>
            </div>
          </div>
        </section>

        {/* === EMPLACEMENT PUBLICITAIRE 3 : BAS === */}
        <AdSlot position="bas" minHeightClass="min-h-[120px]" />
      </main>

      {/* Pied de page minimal */}
      <footer className="py-5 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        <p>© {new Date().getFullYear()} Soutien Scolaire Maroc — Tous droits réservés.</p>
      </footer>
    </div>
  );
}

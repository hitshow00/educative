import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import type { Resource } from '@/types/resource';
import { DownloadClient } from './DownloadClient';

// Désactive le cache statique pour afficher le compteur de téléchargements
// et les liens mis à jour en temps réel depuis Supabase.
export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    slug: string;
  };
}

async function getResourceBySlug(slug: string): Promise<Resource | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('resources')
    .select(
      'id, slug, title, subject, grade_level, file_size, file_format, external_url, download_count, created_at'
    )
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Resource;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resource = await getResourceBySlug(params.slug);

  if (!resource) {
    return {
      title: 'Fichier introuvable | Espace Téléchargement',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Télécharger : ${resource.title} (${resource.grade_level})`,
    description: `Téléchargement gratuit — ${resource.subject} (${resource.grade_level}) • Taille : ${resource.file_size}`,
    // Empêche Google d'indexer la page Safelink (le trafic SEO reste sur vos articles Blogger)
    robots: { index: false, follow: false },
  };
}

export default async function DownloadPage({ params }: PageProps) {
  const resource = await getResourceBySlug(params.slug);

  if (!resource) {
    notFound();
  }

  const blogUrl = process.env.NEXT_PUBLIC_BLOG_URL || 'https://www.monsite.ma';

  return <DownloadClient resource={resource} blogUrl={blogUrl} />;
}

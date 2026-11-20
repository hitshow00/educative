'use client';

interface AdSlotProps {
  /** Identifiant de l'emplacement : "haut", "milieu" ou "bas" */
  position: 'haut' | 'milieu' | 'bas';
  /** Hauteur minimale pour éviter le Cumulative Layout Shift (CLS) */
  minHeightClass?: string;
}

const POSITION_LABELS: Record<AdSlotProps['position'], string> = {
  haut: 'Emplacement Publicitaire — HAUT (Bannière 728x90 / Responsive)',
  milieu: 'Emplacement Publicitaire — MILIEU (Rectangle 336x280 / Responsive)',
  bas: 'Emplacement Publicitaire — BAS (Bannière Responsive / Multiplex)',
};

/**
 * Composant réutilisable pour vos encarts publicitaires (Google AdSense, Ezoic, etc.).
 * Remplacez le contenu placeholder par votre balise `<ins className="adsbygoogle" ... />`
 * une fois votre sous-domaine validé.
 */
export function AdSlot({ position, minHeightClass = 'min-h-[100px]' }: AdSlotProps) {
  return (
    <aside
      aria-label={`Publicité ${position}`}
      className={`w-full ${minHeightClass} rounded-xl border border-dashed border-slate-300 bg-slate-100/80 flex flex-col items-center justify-center p-4 text-center`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
        Publicité
      </span>
      <p className="text-xs font-medium text-slate-500">{POSITION_LABELS[position]}</p>
      <p className="text-[11px] text-slate-400 mt-1">
        Insérez ici votre code AdSense (data-ad-slot=&quot;{position}&quot;)
      </p>
    </aside>
  );
}

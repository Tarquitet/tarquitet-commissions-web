import { useState } from 'react';
import { content } from '../data/content';
import type { ArtPiece } from '../data/sheets';
import { getImagePath } from '../utils/formatters';

const CATEGORY_LABELS: Record<string, string> = {
  FullColor: 'Full Color',
  FlatColor: 'Flat Color',
  Sketch: 'Sketch',
};

const normalizeBodyType = (bodyType: string): string => {
  const lower = bodyType.toLowerCase();
  if (lower.includes('head') || lower.includes('portrait')) return 'portrait';
  if (lower.includes('half')) return 'halfbody';
  if (lower.includes('full')) return 'fullbody';
  return 'portrait';
};

const normalizeCategory = (category: string): string => {
  return category.toLowerCase().replace(/\s+/g, '');
};

interface ArtModalProps {
  selectedGroup: ArtPiece[] | null;
  currentView: ArtPiece | null;
  prices: Array<{
    tier: string;
    original_price: string;
    discount_price: string;
    description: string;
    features: string;
  }>;
  onClose: () => void;
  onViewChange: (art: ArtPiece) => void;
}

export default function ArtModal({ selectedGroup, currentView, prices, onClose, onViewChange }: ArtModalProps) {
  const [expandedFeatures, setExpandedFeatures] = useState<string | null>(null);

  // OBTENER PRECIO: busca por tier + body_type (matriz exacta)
  const getPriceForVersion = (targetCategory: string, bodyType: string) => {
    const normTier = normalizeCategory(targetCategory);
    const normDesc = normalizeBodyType(bodyType);

    const priceMatch = prices.find(
      (p) => normalizeCategory(p.tier) === normTier && p.description?.toLowerCase() === normDesc,
    );

    if (!priceMatch) return { original: 'Consultar', discount: '', showDiscount: false };

    const original = priceMatch.original_price || 'Consultar';
    const discount = priceMatch.discount_price || '';
    const showDiscount = discount.trim() !== '' && discount !== original;

    return { original, discount, showDiscount };
  };

  // OBTENER FEATURES: busca SOLO por tier (independiente del body_type)
  // Usa portrait como fuente principal porque suele tener los features completos
  const getFeaturesForTier = (targetCategory: string) => {
    const normTier = normalizeCategory(targetCategory);

    // Primero buscar en portrait (que tiene los features detallados)
    let priceMatch = prices.find(
      (p) => normalizeCategory(p.tier) === normTier && p.description?.toLowerCase() === 'portrait',
    );

    // Si no hay o está vacío, buscar en cualquier descripción que tenga features
    if (!priceMatch || !priceMatch.features || priceMatch.features.trim() === '') {
      priceMatch = prices.find((p) => normalizeCategory(p.tier) === normTier && p.features && p.features.trim() !== '');
    }

    return priceMatch?.features || '';
  };

  const handleViewChange = (cat: string) => {
    if (!selectedGroup || !currentView) return;

    const normCat = normalizeCategory(cat);
    const normBody = normalizeBodyType(currentView.body_type);

    const version = selectedGroup.find(
      (v) => normalizeCategory(v.category) === normCat && normalizeBodyType(v.body_type) === normBody,
    );

    if (version) {
      onViewChange(version);
      setExpandedFeatures(null);
    }
  };

  const toggleFeatures = (category: string) => {
    setExpandedFeatures(expandedFeatures === category ? null : category);
  };

  if (!selectedGroup || !currentView) return null;

  // Precio exacto para la versión actual
  const priceData = getPriceForVersion(currentView.category, currentView.body_type);
  // Features del tier (independiente del body_type)
  const features = getFeaturesForTier(currentView.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85" onClick={onClose}>
      <div
        className="relative w-full max-w-6xl bg-beige rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-brand-red text-beige flex items-center justify-center hover:bg-brand-darkred transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* CONTENEDOR DE IMÁGENES (TAMAÑO NATURAL + CROSSFADE) */}
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative p-4">
          {selectedGroup.map((art) => {
            const isActive = art.filename === currentView.filename;
            return (
              <img
                key={art.filename}
                src={getImagePath(art.filename)}
                alt={art.title}
                className={`max-w-full max-h-[85vh] object-contain drop-shadow-2xl transition-opacity duration-500 ease-in-out ${
                  isActive ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 m-auto z-0 pointer-events-none'
                }`}
              />
            );
          })}
        </div>

        {/* PANEL DE INFORMACIÓN */}
        <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col bg-beige overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-black text-brand-red uppercase italic tracking-tighter mb-1">
                {currentView.title}
              </h3>
              <p className="text-text/50 text-sm font-mono">
                {currentView.date} • {currentView.body_type}
              </p>
            </div>

            {/* 1. BOTONES COMPACTOS DE SELECCIÓN */}
            <div>
              <p className="text-text/60 text-xs uppercase tracking-widest font-bold mb-3">
                {content.sections.commissions.modal.versionsTitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {['Sketch', 'FlatColor', 'FullColor'].map((cat) => {
                  const normCat = normalizeCategory(cat);
                  const normBody = normalizeBodyType(currentView.body_type);
                  const hasVersion = selectedGroup.some(
                    (v) => normalizeCategory(v.category) === normCat && normalizeBodyType(v.body_type) === normBody,
                  );
                  const isActive = normalizeCategory(currentView.category) === normCat;

                  return (
                    <button
                      key={cat}
                      disabled={!hasVersion}
                      onClick={() => handleViewChange(cat)}
                      className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border-2 ${
                        isActive
                          ? 'bg-brand-red text-beige border-brand-red'
                          : hasVersion
                            ? 'bg-transparent text-text border-brand-red/30 hover:border-brand-red hover:bg-brand-red/5'
                            : 'bg-text/5 text-text/30 border-text/10 cursor-not-allowed line-through decoration-text/30'
                      }`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. BLOQUE DE PRECIO */}
            <div className="flex items-center justify-center gap-3 py-4 border-y border-brand-red/10">
              {priceData.showDiscount ? (
                <>
                  <span className="text-lg text-text/40 line-through decoration-2">{priceData.original}</span>
                  <span className="text-3xl font-black text-brand-red">{priceData.discount}</span>
                </>
              ) : (
                <span className="text-3xl font-black text-brand-red">{priceData.original}</span>
              )}
            </div>

            {/* 3. "QUÉ INCLUYE" (Ahora usa features por tier, no por body_type) */}
            {features.trim() !== '' && (
              <div className="space-y-2">
                <button
                  onClick={() => toggleFeatures(currentView.category)}
                  className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-text/60 hover:text-brand-red transition-colors flex items-center justify-between bg-brand-red/5 rounded-lg"
                >
                  <span>{content.sections.commissions.modal.whatIncludes}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${expandedFeatures === currentView.category ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedFeatures === currentView.category && (
                  <div className="px-4 py-3 bg-beige-dark/30 rounded-lg border border-brand-red/10 animate-in slide-in-from-top-2 duration-300">
                    <div className="text-xs text-text/80 leading-relaxed whitespace-pre-line">{features}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. MENSAJE DE CONTACTO */}
          <div className="mt-auto pt-8">
            <div className="text-center p-4 rounded-xl border-2 border-dashed border-brand-red/30 bg-brand-red/5">
              <p className="text-sm font-medium text-text/80 italic">{content.sections.commissions.modal.ctaMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

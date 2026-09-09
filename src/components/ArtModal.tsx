import { useState } from 'react';
import { content } from '../data/content';
import type { ArtPiece } from '../data/sheets';
import FadeImage from './FadeImage';
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

    if (!priceMatch) return 'Consultar';

    const finalPrice =
      priceMatch.discount_price && priceMatch.discount_price.trim() !== ''
        ? priceMatch.discount_price
        : priceMatch.original_price;

    return finalPrice ? `${finalPrice}` : 'Consultar';
  };

  // OBTENER FEATURES: busca solo por tier (independiente del body_type)
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl bg-beige rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-brand-red text-beige flex items-center justify-center hover:bg-brand-darkred transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full md:w-3/5 bg-black flex items-center justify-center">
          <FadeImage
            src={getImagePath(currentView.filename)}
            alt={currentView.title}
            className="max-w-full max-h-[50vh] md:max-h-[80vh] object-contain"
            containerClass="w-full h-full flex items-center justify-center"
          />
        </div>

        <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-beige overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-black text-brand-red uppercase italic tracking-tighter mb-1">
                {currentView.title}
              </h3>
              <p className="text-text/50 text-sm font-mono">
                {currentView.date} • {currentView.body_type}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-text/60 text-xs uppercase tracking-widest font-bold mb-2">
                {content.sections.commissions.modal.versionsTitle}
              </p>

              {['Sketch', 'FlatColor', 'FullColor'].map((cat) => {
                const normCat = normalizeCategory(cat);
                const normBody = normalizeBodyType(currentView.body_type);

                const hasVersion = selectedGroup.some(
                  (v) => normalizeCategory(v.category) === normCat && normalizeBodyType(v.body_type) === normBody,
                );

                const isActive = normalizeCategory(currentView.category) === normCat;
                const price = getPriceForVersion(cat, currentView.body_type);

                // Features ahora se obtienen por tier, no por body_type
                const features = getFeaturesForTier(cat);
                const hasFeatures = features.trim() !== '';

                return (
                  <div key={cat} className="space-y-2">
                    <button
                      disabled={!hasVersion}
                      onClick={() => handleViewChange(cat)}
                      className={`w-full py-3 px-4 rounded-lg font-bold uppercase text-sm tracking-wider transition-all border-2 flex justify-between items-center ${
                        isActive
                          ? 'bg-brand-red text-beige border-brand-red'
                          : hasVersion
                            ? 'bg-transparent text-text border-brand-red/30 hover:border-brand-red hover:bg-brand-red/5'
                            : 'bg-text/5 text-text/30 border-text/10 cursor-not-allowed'
                      }`}
                    >
                      <span>{CATEGORY_LABELS[cat]}</span>
                      <span
                        className={`font-black text-lg ${isActive ? 'text-beige' : hasVersion ? 'text-text' : 'text-text/30'}`}
                      >
                        {price}
                      </span>
                    </button>

                    {hasVersion && hasFeatures && (
                      <button
                        onClick={() => toggleFeatures(cat)}
                        className="w-full text-left px-4 py-2 text-xs text-text/60 hover:text-brand-red transition-colors flex items-center justify-between"
                      >
                        <span>{content.sections.commissions.modal.whatIncludes}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${expandedFeatures === cat ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}

                    {expandedFeatures === cat && hasFeatures && (
                      <div className="px-4 py-3 bg-beige-dark/50 rounded-lg border border-brand-red/10">
                        <div className="text-xs text-text/80 leading-relaxed whitespace-pre-line">{features}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <a
            href={content.sections.contact.contactDetails.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 block w-full py-4 bg-brand-red text-beige text-center font-black uppercase tracking-widest rounded-lg hover:bg-brand-darkred transition-colors shadow-lg"
          >
            {content.sections.commissions.modal.requestButton}
          </a>
        </div>
      </div>
    </div>
  );
}

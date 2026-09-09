import { useState, useEffect, useMemo } from 'react';
import {
  getSheetArtworks,
  getSheetPrices,
  getSheetYCH,
  type ArtPiece,
  type PricingTier,
  type YCHPiece,
} from '../data/sheets';
import { content } from '../data/content';
import FadeImage from './FadeImage';
import { getImagePath } from '../utils/formatters';
import ArtModal from './ArtModal';

const CATEGORY_HIERARCHY: Record<string, number> = {
  FullColor: 3,
  FlatColor: 2,
  Sketch: 1,
};

const CATEGORY_LABELS: Record<string, string> = {
  FullColor: 'Full Color',
  FlatColor: 'Flat Color',
  Sketch: 'Sketch',
};

export default function CommissionGallery() {
  const [artworks, setArtworks] = useState<ArtPiece[]>([]);
  const [prices, setPrices] = useState<PricingTier[]>([]);
  const [ychPieces, setYchPieces] = useState<YCHPiece[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState<'custom' | 'ych'>('custom');

  const [selectedGroup, setSelectedGroup] = useState<ArtPiece[] | null>(null);
  const [currentView, setCurrentView] = useState<ArtPiece | null>(null);

  useEffect(() => {
    async function loadData() {
      const [artData, priceData, ychData] = await Promise.all([getSheetArtworks(), getSheetPrices(), getSheetYCH()]);
      setArtworks(artData);
      setPrices(priceData);
      setYchPieces(ychData);
      setLoading(false);
    }
    loadData();
  }, []);

  const galleryItems = useMemo(() => {
    const groups: Record<string, ArtPiece[]> = {};
    artworks.forEach((art) => {
      if (!groups[art.title]) groups[art.title] = [];
      groups[art.title].push(art);
    });

    return Object.values(groups).map((group) => {
      group.sort((a, b) => (CATEGORY_HIERARCHY[b.category] || 0) - (CATEGORY_HIERARCHY[a.category] || 0));
      return {
        title: group[0].title,
        versions: group,
        thumbnail: group[0],
      };
    });
  }, [artworks]);

  const openModal = (group: ArtPiece[]) => {
    setSelectedGroup(group);
    setCurrentView(group[0]);
  };

  const closeModal = () => {
    setSelectedGroup(null);
    setCurrentView(null);
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-64 border-2 rounded-2xl"
        style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}
      >
        <p className="text-brand-red font-mono text-xs uppercase tracking-widest animate-pulse">
          {content.sections.commissions.loadingText}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setViewMode('custom')}
          className={`px-6 py-3 rounded-lg font-black uppercase tracking-wider transition-all border-2 ${
            viewMode === 'custom'
              ? 'bg-brand-red text-beige border-brand-red'
              : 'bg-transparent border-brand-red/30 hover:border-brand-red'
          }`}
          style={{ color: viewMode === 'custom' ? 'var(--bg-color)' : 'var(--text-color)' }}
        >
          {content.sections.commissions.customButton}
        </button>
        <button
          onClick={() => setViewMode('ych')}
          className={`px-6 py-3 rounded-lg font-black uppercase tracking-wider transition-all border-2 ${
            viewMode === 'ych'
              ? 'bg-brand-red text-beige border-brand-red'
              : 'bg-transparent border-brand-red/30 hover:border-brand-red'
          }`}
          style={{ color: viewMode === 'ych' ? 'var(--bg-color)' : 'var(--text-color)' }}
        >
          {content.sections.commissions.ychButton}
        </button>
      </div>

      {viewMode === 'custom' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.title}
              onClick={() => openModal(item.versions)}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 hover:border-brand-red transition-all duration-300"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            >
              <FadeImage
                src={getImagePath(item.thumbnail.filename)}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                containerClass="w-full h-full"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-beige font-black text-sm uppercase tracking-tighter">{item.title}</p>
                <p className="text-brand-red text-xs font-mono">
                  {item.thumbnail.date} • {CATEGORY_LABELS[item.thumbnail.category]} • {item.thumbnail.body_type}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-20 border-2 border-dashed rounded-2xl"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            {content.sections.commissions.ychPlaceholder}
          </p>
        </div>
      )}

      {/* MODAL */}
      <ArtModal
        selectedGroup={selectedGroup}
        currentView={currentView}
        prices={prices}
        onClose={closeModal}
        onViewChange={setCurrentView}
      />
    </div>
  );
}

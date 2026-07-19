import { useState, useMemo, useEffect, useRef, memo } from 'react';
import { getSheetArtworks, type ArtPiece } from '../data/sheets';
import SecurityWatermark from './SecurityWatermark';
import { formatHumanTitle, getImagePath } from '../utils/formatters';
import FadeImage from './FadeImage';

export default function PortfolioGallery() {
  const [artworks, setArtworks] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);

  const gallerySliderRef = useRef<HTMLDivElement>(null);

  // Carga inicial
  useEffect(() => {
    getSheetArtworks().then((data) => {
      setArtworks(data);
      setLoading(false);
    });
  }, []);

  // Lógica para bloquear el scroll y usar la tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedArt(null);
    };

    if (selectedArt) {
      document.body.style.overflow = 'hidden'; // Bloquea el scroll de la página
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = ''; // Restaura el scroll
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedArt]);

  const categories = useMemo(() => {
    const cats = new Set(artworks.map((a) => a.category));
    return ['All', ...Array.from(cats)];
  }, [artworks]);

  const filteredArtworks = useMemo(() => {
    if (activeFilter === 'All') return artworks;
    return artworks.filter((art) => art.category === activeFilter);
  }, [activeFilter, artworks]);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (gallerySliderRef.current) {
      const amt = window.innerWidth > 768 ? 400 : 300;
      gallerySliderRef.current.scrollBy({ left: direction === 'left' ? -amt : amt, behavior: 'smooth' });
    }
  };

  if (loading)
    return (
      <div className="h-64 flex items-center justify-center font-mono text-brand-red/40 animate-pulse uppercase tracking-widest">
        Loading gallery...
      </div>
    );

  return (
    <div className="relative" id="portfolio">
      <div className="animate-in fade-in duration-700">
        {/* BARRA DE FILTROS */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-3 snap-x no-scrollbar px-4 md:px-8 border-b border-brand-red/20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`snap-start whitespace-nowrap shrink-0 px-6 py-3 rounded-xl font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-brand-red text-black shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-105'
                  : 'bg-black/50 border border-brand-red/20 text-brand-light/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {formatHumanTitle(cat)}
            </button>
          ))}
        </div>

        {/* GALERÍA DE IMÁGENES */}
        <div className="relative group/slider">
          <button
            aria-label="Scroll left"
            onClick={() => scrollSlider('left')}
            className="absolute left-4 top-[40%] -translate-y-1/2 z-40 bg-black/80 border border-brand-red/50 text-brand-red w-12 h-12 rounded-full items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hidden md:flex hover:bg-brand-red hover:text-black scale-110"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div
            ref={gallerySliderRef}
            className="flex overflow-x-auto gap-6 pb-10 snap-x snap-mandatory no-scrollbar px-4 md:px-8 scroll-smooth"
          >
            {filteredArtworks.map((art) => (
              <ArtCard key={art.filename} art={art} onClick={() => setSelectedArt(art)} />
            ))}
          </div>

          <button
            aria-label="Scroll right"
            onClick={() => scrollSlider('right')}
            className="absolute right-4 top-[40%] -translate-y-1/2 z-40 bg-black/80 border border-brand-red/50 text-brand-red w-12 h-12 rounded-full items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hidden md:flex hover:bg-brand-red hover:text-black scale-110"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* MODAL: PANTALLA COMPLETA HUMANIZADA */}
      {selectedArt && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-300"
          onClick={() => setSelectedArt(null)}
        >
          {/* BARRA SUPERIOR DE CIERRE */}
          <div className="w-full flex justify-end p-4 md:p-6 sticky top-0 z-[110]">
            <button
              className="flex items-center gap-2 bg-brand-red text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              onClick={() => setSelectedArt(null)}
            >
              CLOSE
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* CONTENEDOR PRINCIPAL */}
          <div
            className="w-full max-w-6xl mx-auto px-4 pb-12 flex flex-col items-center justify-center flex-grow"
            onClick={(e) => e.stopPropagation()}
          >
            {/* IMAGEN GIGANTE */}
            <div className="relative w-full max-h-[75vh] flex items-center justify-center mb-8">
              <FadeImage
                key={selectedArt.filename}
                src={getImagePath(selectedArt.filename)}
                alt={selectedArt.title}
                className="max-w-full max-h-full object-contain rounded-lg drop-shadow-2xl"
                containerClass="w-full h-full flex items-center justify-center"
              />
              <SecurityWatermark />
            </div>

            {/* INFORMACIÓN EXTRA ABAJO */}
            <div className="w-full bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-white font-black text-3xl md:text-4xl uppercase tracking-tighter">
                  {formatHumanTitle(selectedArt.title)}
                </h2>
                <p className="text-brand-light/80 font-bold tracking-widest uppercase text-sm mt-1">
                  Completed in {selectedArt.date}
                </p>
              </div>

              {/* TAGS LIMPIOS */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                <span className="px-4 py-2 bg-brand-red/10 border border-brand-red/30 text-brand-red rounded-lg text-xs font-bold uppercase tracking-widest">
                  {formatHumanTitle(selectedArt.category)}
                </span>
                <span className="px-4 py-2 bg-white/5 border border-white/10 text-brand-light rounded-lg text-xs font-bold uppercase tracking-widest">
                  {formatHumanTitle(selectedArt.body_type)}
                </span>
                <span className="px-4 py-2 bg-white/5 border border-white/10 text-brand-light rounded-lg text-xs font-bold uppercase tracking-widest">
                  {formatHumanTitle(selectedArt.render_type)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ArtCard = memo(({ art, onClick }: { art: any; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="group relative flex-none w-[85vw] sm:w-[320px] md:w-96 aspect-[4/5] snap-center md:snap-start border border-brand-red/10 rounded-2xl overflow-hidden cursor-zoom-in bg-[#050000]"
    >
      <FadeImage
        src={getImagePath(art.filename)}
        alt={art.title}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
        containerClass="w-full h-full"
      />
      <SecurityWatermark />
      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        <h4 className="text-white font-black text-xl uppercase tracking-tight">{formatHumanTitle(art.title)}</h4>
      </div>
    </div>
  );
});

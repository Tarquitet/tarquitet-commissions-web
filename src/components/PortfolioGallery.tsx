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

  useEffect(() => {
    getSheetArtworks().then((data) => {
      // Ordenamos para que los dibujos más recientes salgan primero
      const sorted = data.sort((a, b) => parseInt(b.date) - parseInt(a.date));
      setArtworks(sorted);
      setLoading(false);
    });
  }, []);

  // Extraemos dinámicamente las categorías (Sketch, Full Color, etc.)
  const categories = useMemo(() => {
    const cats = new Set(artworks.map((a) => a.category));
    return ['All', ...Array.from(cats)];
  }, [artworks]);

  // Filtramos la galería en tiempo real
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
      <div className="h-64 flex items-center justify-center font-mono text-brand-red/40 animate-pulse uppercase tracking-[0.5em]">
        // Sincronizando_Archivos
      </div>
    );

  return (
    <div className="relative" id="portfolio">
      <div className="animate-in fade-in duration-700">
        {/* BARRA DE FILTROS SIMPLE Y DIRECTA */}
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
            onClick={() => scrollSlider('right')}
            className="absolute right-4 top-[40%] -translate-y-1/2 z-40 bg-black/80 border border-brand-red/50 text-brand-red w-12 h-12 rounded-full items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hidden md:flex hover:bg-brand-red hover:text-black scale-110"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* MODAL: FICHA TÉCNICA (Se mantiene intacta) */}
      {selectedArt && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10 animate-in fade-in duration-500"
          onClick={() => setSelectedArt(null)}
        >
          <button className="absolute top-8 right-8 text-brand-red hover:text-white z-50 transition-colors focus:outline-none">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative flex flex-col md:flex-row gap-10 max-w-7xl w-full h-full md:h-[85vh] items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* LADO IZQUIERDO */}
            <div className="relative flex-1 h-full w-full flex items-center justify-center bg-[#050000] rounded-lg overflow-hidden group">
              <FadeImage
                key={selectedArt.filename}
                src={getImagePath(selectedArt.filename)}
                alt={selectedArt.title}
                className="max-w-full max-h-full object-contain relative z-10"
                containerClass="w-full h-full flex items-center justify-center"
              />
              <SecurityWatermark />
              <div className="absolute inset-0 bg-transparent z-20 cursor-default"></div>
            </div>

            {/* LADO DERECHO */}
            <div className="w-full md:w-96 flex flex-col justify-center border-l-0 md:border-l border-brand-red/20 md:pl-10">
              <span className="text-brand-red font-mono text-[10px] tracking-[0.5em] mb-4 uppercase">
                Data_Stream // Reporte_Visual
              </span>

              <h2 className="text-white font-black text-4xl md:text-5xl uppercase italic tracking-tighter mb-2">
                {formatHumanTitle(selectedArt.title)}
              </h2>

              <div className="h-1 w-20 bg-brand-red mb-8 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>

              <div className="grid grid-cols-1 gap-y-5">
                <div className="border-l-2 border-brand-red/20 pl-4 py-1">
                  <p className="text-brand-red/40 font-mono text-[9px] uppercase tracking-widest mb-1">Categoría</p>
                  <p className="text-white font-bold text-lg uppercase tracking-tight italic">
                    {formatHumanTitle(selectedArt.category)}
                  </p>
                </div>
                <div className="border-l-2 border-brand-red/20 pl-4 py-1">
                  <p className="text-brand-red/40 font-mono text-[9px] uppercase tracking-widest mb-1">Encuadre</p>
                  <p className="text-white font-bold text-lg uppercase tracking-tight italic">
                    {formatHumanTitle(selectedArt.body_type)}
                  </p>
                </div>
                <div className="border-l-2 border-brand-red/20 pl-4 py-1">
                  <p className="text-brand-red/40 font-mono text-[9px] uppercase tracking-widest mb-1">Renderizado</p>
                  <p className="text-brand-light font-bold text-md uppercase tracking-tight italic">
                    {formatHumanTitle(selectedArt.render_type)}
                  </p>
                </div>
                <div className="border-l-2 border-brand-red/20 pl-4 py-1">
                  <p className="text-brand-red/40 font-mono text-[9px] uppercase tracking-widest mb-1">Entorno</p>
                  <p className="text-brand-light font-bold text-md uppercase tracking-tight italic">
                    {formatHumanTitle(selectedArt.background)}
                  </p>
                </div>
                <div className="border-l-2 border-brand-red/20 pl-4 py-1">
                  <p className="text-brand-red/40 font-mono text-[9px] uppercase tracking-widest mb-1">Registro</p>
                  <p className="text-white font-bold text-lg uppercase tracking-tight italic">Año {selectedArt.date}</p>
                </div>
              </div>

              <div className="mt-10 p-4 bg-brand-red/5 border border-brand-red/10 rounded-lg">
                <p className="text-brand-red/40 text-[8px] font-black uppercase tracking-[0.3em] leading-relaxed">
                  SYSTEM_NOTICE: Propiedad intelectual de Tarquitet. Prohibida la redistribución sin autorización
                  expresa del autor.
                </p>
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
      className="group relative flex-none w-[85vw] sm:w-[320px] md:w-95 aspect-4/5 snap-center md:snap-start border border-brand-red/10 rounded-2xl overflow-hidden cursor-zoom-in bg-[#050000]"
    >
      <FadeImage
        src={getImagePath(art.filename)}
        alt={art.title}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
        containerClass="w-full h-full"
      />
      <SecurityWatermark />
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        <h4 className="text-white font-black text-xl uppercase italic tracking-tight">{formatHumanTitle(art.title)}</h4>
      </div>
    </div>
  );
});

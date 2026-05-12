// PortfolioGallery.tsx

import { useState, useMemo, useEffect, useRef, memo } from 'react';
import { getSheetArtworks, type ArtPiece } from '../data/sheets';
import SecurityWatermark from './SecurityWatermark';
import { formatHumanTitle, preventActions, getImagePath } from '../utils/formatters';
import FadeImage from './FadeImage';

export default function PortfolioGallery() {
  const [artworks, setArtworks] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);

  const yearsSliderRef = useRef<HTMLDivElement>(null);
  const gallerySliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSheetArtworks().then((data) => {
      setArtworks(data);
      setLoading(false);
    });
  }, []);

  const groupedByYear = useMemo(() => {
    const groups: Record<string, ArtPiece[]> = {};
    artworks.forEach((art) => {
      if (!groups[art.date]) groups[art.date] = [];
      groups[art.date].push(art);
    });
    return groups;
  }, [artworks]);

  const sortedYears = Object.keys(groupedByYear).sort((a, b) => parseInt(b) - parseInt(a));

  const yearCovers = useMemo(() => {
    const covers: Record<string, string> = {};
    sortedYears.forEach((year) => {
      covers[year] = groupedByYear[year][0]?.filename;
    });
    return covers;
  }, [groupedByYear, sortedYears]);

  const filteredArtworks = useMemo(() => {
    const current = activeYear ? groupedByYear[activeYear] : [];
    if (activeFilter === 'All') return current;
    return current.filter((art) => art.category === activeFilter);
  }, [activeFilter, activeYear, groupedByYear]);

  const categories = useMemo(() => {
    if (!activeYear) return [];
    const cats = new Set(groupedByYear[activeYear].map((a) => a.category));
    return ['All', ...Array.from(cats)];
  }, [activeYear, groupedByYear]);

  const scrollSlider = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const amt = window.innerWidth > 768 ? 400 : 300;
      ref.current.scrollBy({ left: direction === 'left' ? -amt : amt, behavior: 'smooth' });
    }
  };

  if (loading)
    return (
      <div className="h-64 flex items-center justify-center font-mono text-brand-red/40 animate-pulse uppercase tracking-[0.5em]">
        // Sincronizando_Archivos
      </div>
    );

  return (
    <div className="relative">
      {/* VISTA 1: TIMELINE DE AÑOS */}
      {!activeYear && (
        <div className="animate-in fade-in duration-500">
          <div className="relative group/slider">
            <button
              onClick={() => scrollSlider('left', yearsSliderRef)}
              className="absolute left-4 top-[40%] -translate-y-1/2 z-40 bg-black/80 border border-brand-red/50 text-brand-red w-12 h-12 rounded-full items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hidden md:flex"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div
              ref={yearsSliderRef}
              className="flex overflow-x-auto gap-6 pb-10 snap-x snap-mandatory no-scrollbar px-4 md:px-8 scroll-smooth"
            >
              {sortedYears.map((year) => (
                <YearCard
                  key={year}
                  year={year}
                  count={groupedByYear[year].length}
                  cover={yearCovers[year]}
                  onClick={() => {
                    setActiveYear(year);
                    setActiveFilter('All');
                    window.scrollTo({ top: document.getElementById('portfolio')?.offsetTop || 0, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => scrollSlider('right', yearsSliderRef)}
              className="absolute right-4 top-[40%] -translate-y-1/2 z-40 bg-black/80 border border-brand-red/50 text-brand-red w-12 h-12 rounded-full items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hidden md:flex"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* VISTA 2: GALERÍA POR AÑO */}
      {activeYear && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-brand-red/20 pb-8 px-4 md:px-8">
            <button
              onClick={() => setActiveYear(null)}
              className="text-brand-red/50 hover:text-white font-mono text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 transition-colors"
            >
              &lt; Volver al Timeline
            </button>
            <div className="flex overflow-x-auto pb-4 -mb-4 gap-3 w-full md:w-auto snap-x no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`snap-start whitespace-nowrap shrink-0 px-5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${
                    activeFilter === cat
                      ? 'bg-brand-red text-black'
                      : 'bg-black/50 border border-brand-red/20 text-brand-light/60'
                  }`}
                >
                  {formatHumanTitle(cat)}
                </button>
              ))}
            </div>
          </div>
          <div className="relative group/slider">
            <button
              onClick={() => scrollSlider('left', gallerySliderRef)}
              className="absolute left-4 top-[40%] -translate-y-1/2 z-40 bg-black/80 border border-brand-red/50 text-brand-red w-12 h-12 rounded-full items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hidden md:flex"
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
                <ArtCard
                  key={art.filename} // CLAVE: art.filename obliga a FadeImage a reiniciarse al cambiar filtros
                  art={art}
                  onClick={() => setSelectedArt(art)}
                />
              ))}
            </div>
            <button
              onClick={() => scrollSlider('right', gallerySliderRef)}
              className="absolute right-4 top-[40%] -translate-y-1/2 z-40 bg-black/80 border border-brand-red/50 text-brand-red w-12 h-12 rounded-full items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hidden md:flex"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: FICHA TÉCNICA COMPLETA */}
      {selectedArt && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10 animate-in fade-in duration-500"
          onClick={() => setSelectedArt(null)}
        >
          {/* BOTÓN CERRAR */}
          <button className="absolute top-8 right-8 text-brand-red hover:text-white z-50 transition-colors focus:outline-none">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative flex flex-col md:flex-row gap-10 max-w-7xl w-full h-full md:h-[85vh] items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* LADO IZQUIERDO: VISOR DE IMAGEN */}
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

            {/* LADO DERECHO: PANEL DE DATOS (REPORT) */}
            <div className="w-full md:w-96 flex flex-col justify-center border-l-0 md:border-l border-brand-red/20 md:pl-10">
              <span className="text-brand-red font-mono text-[10px] tracking-[0.5em] mb-4 uppercase">
                Data_Stream // Reporte_Visual
              </span>

              <h2 className="text-white font-black text-4xl md:text-5xl uppercase italic tracking-tighter mb-2">
                {formatHumanTitle(selectedArt.title)}
              </h2>

              <div className="h-1 w-20 bg-brand-red mb-8 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>

              {/* REJILLA DE METADATOS */}
              <div className="grid grid-cols-1 gap-y-5">
                {/* CATEGORÍA */}
                <div className="border-l-2 border-brand-red/20 pl-4 py-1">
                  <p className="text-brand-red/40 font-mono text-[9px] uppercase tracking-widest mb-1">Categoría</p>
                  <p className="text-white font-bold text-lg uppercase tracking-tight italic">
                    {formatHumanTitle(selectedArt.category)}
                  </p>
                </div>

                {/* ENCUADRE (Body Type) */}
                <div className="border-l-2 border-brand-red/20 pl-4 py-1">
                  <p className="text-brand-red/40 font-mono text-[9px] uppercase tracking-widest mb-1">Encuadre</p>
                  <p className="text-white font-bold text-lg uppercase tracking-tight italic">
                    {formatHumanTitle(selectedArt.body_type)}
                  </p>
                </div>

                {/* RENDERIZADO (Render Type) */}
                <div className="border-l-2 border-brand-red/20 pl-4 py-1">
                  <p className="text-brand-red/40 font-mono text-[9px] uppercase tracking-widest mb-1">Renderizado</p>
                  <p className="text-brand-light font-bold text-md uppercase tracking-tight italic">
                    {formatHumanTitle(selectedArt.render_type)}
                  </p>
                </div>

                {/* ENTORNO (Background) */}
                <div className="border-l-2 border-brand-red/20 pl-4 py-1">
                  <p className="text-brand-red/40 font-mono text-[9px] uppercase tracking-widest mb-1">Entorno</p>
                  <p className="text-brand-light font-bold text-md uppercase tracking-tight italic">
                    {formatHumanTitle(selectedArt.background)}
                  </p>
                </div>

                {/* REGISTRO TEMPORAL */}
                <div className="border-l-2 border-brand-red/20 pl-4 py-1">
                  <p className="text-brand-red/40 font-mono text-[9px] uppercase tracking-widest mb-1">Registro</p>
                  <p className="text-white font-bold text-lg uppercase tracking-tight italic">Año {selectedArt.date}</p>
                </div>
              </div>

              {/* NOTA DE SEGURIDAD */}
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

// SUBCOMPONENTES CON LÓGICA DE FADE
const YearCard = memo(({ year, count, cover, onClick }: any) => {
  return (
    <div
      onClick={onClick}
      className="group relative flex-none w-70 aspect-4/5 snap-start bg-[#050000] border border-brand-red/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
    >
      <FadeImage
        src={getImagePath(cover)}
        alt={`Timeline ${year}`}
        className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-1000"
        containerClass="w-full h-full"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-10"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-30">
        <h3 className="text-white font-black text-7xl italic tracking-tighter group-hover:scale-110 transition-all duration-500">
          {year}
        </h3>
        <p className="mt-4 text-brand-red font-mono text-[10px] uppercase tracking-widest bg-black/60 px-3 py-1 border border-brand-red/20">
          {count} Entradas
        </p>
      </div>
    </div>
  );
});

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
      <div className="absolute bottom-0 left-0 w-full p-6 bg-linear-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        <h4 className="text-white font-black text-xl uppercase italic tracking-tight">{formatHumanTitle(art.title)}</h4>
      </div>
    </div>
  );
});

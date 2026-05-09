import { useState, useMemo, useEffect, useRef } from 'react';
import { getSheetArtworks, type ArtPiece } from '../data/sheets';

// ============================================================================
// UTILIDAD: Formateador de Títulos (CamelCase -> Human Readable)
// ============================================================================
function formatHumanTitle(titleFromSheet: string): string {
  if (!titleFromSheet) return 'No Data';

  let humanTitle = titleFromSheet.replace(/([A-Z])/g, ' $1').trim();
  humanTitle = humanTitle.replace(/([a-zA-Z])(\d+)/g, '$1 $2');

  const corrections: Record<string, string> = {
    Prctice: 'Practice',
    Pretice: 'Practice',
    Hhalf: 'Half',
    Ssketch: 'Sketch',
    Lockx: 'Lockx',
  };

  Object.keys(corrections).forEach((errorText) => {
    const regex = new RegExp(errorText, 'gi');
    humanTitle = humanTitle.replace(regex, corrections[errorText]);
  });

  return humanTitle
    .toLowerCase()
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ============================================================================
// SUB-COMPONENTE: Sistema de Seguridad / Marca de Agua
// ============================================================================
const SecurityWatermark = () => (
  <div className="absolute inset-0 z-[15] flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-20 mix-blend-overlay">
    <div className="transform -rotate-[35deg] flex flex-col gap-8 md:gap-16">
      {/* Generamos múltiples líneas para asegurar que cubra toda la imagen sin importar el aspecto */}
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <span
          key={i}
          className="text-white font-black text-3xl md:text-5xl uppercase tracking-[0.4em] whitespace-nowrap drop-shadow-lg"
        >
          PREVIEW ONLY // NO ROBAR // PREVIEW ONLY // NO ROBAR // PREVIEW ONLY
        </span>
      ))}
    </div>
  </div>
);

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function PortfolioGallery() {
  const [artworks, setArtworks] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getSheetArtworks();
      setArtworks(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Optimizaciones con useMemo para evitar re-renders costosos
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

  const currentArtworks = activeYear ? groupedByYear[activeYear] : [];

  const categories = useMemo(() => {
    if (!activeYear) return [];
    const cats = new Set(currentArtworks.map((a) => a.category));
    return ['Todos', ...Array.from(cats)];
  }, [activeYear, currentArtworks]);

  const filteredArtworks = useMemo(() => {
    if (activeFilter === 'Todos') return currentArtworks;
    return currentArtworks.filter((art) => art.category === activeFilter);
  }, [activeFilter, currentArtworks]);

  // Handlers y Utilidades
  const getImagePath = (filename: string) => (filename.startsWith('http') ? filename : `/portfolio/${filename}`);
  const preventActions = (e: React.SyntheticEvent) => {
    e.preventDefault();
    return false;
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 400 : 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Render de Carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 border border-brand-red/10 bg-[#050000] rounded-2xl">
        <p className="text-brand-red/60 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">
          // Sincronizando Archivos_
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* VISTA 1: LÍNEA DE TIEMPO (AÑOS) */}
      {!activeYear && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {sortedYears.map((year) => (
            <div
              key={year}
              onClick={() => {
                setActiveYear(year);
                setActiveFilter('Todos');
                window.scrollTo({ top: document.getElementById('portfolio')?.offsetTop || 0, behavior: 'smooth' });
              }}
              className="group relative h-64 md:h-80 bg-[#050000] border border-brand-red/20 rounded-2xl overflow-hidden cursor-pointer hover:border-brand-red transition-all duration-500"
            >
              <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                <img
                  src={getImagePath(yearCovers[year])}
                  alt={`Portada ${year}`}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  loading="eager"
                  decoding="sync"
                  referrerPolicy="no-referrer"
                  onContextMenu={preventActions}
                  onDragStart={preventActions}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-transparent z-20"></div>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-30">
                <h3 className="text-white font-black text-7xl italic tracking-tighter group-hover:scale-110 transition-all duration-500 drop-shadow-2xl">
                  {year}
                </h3>
                <p className="mt-4 text-brand-red font-mono text-[10px] uppercase tracking-widest bg-black/60 px-3 py-1 border border-brand-red/20">
                  {groupedByYear[year].length} Entradas
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VISTA 2: GALERÍA FILTRADA (SLIDER HORIZONTAL) */}
      {activeYear && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Cabecera y Filtros */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-brand-red/20 pb-8">
            <button
              onClick={() => setActiveYear(null)}
              className="text-brand-red/50 hover:text-white font-mono text-[13px] uppercase tracking-[0.3em] flex items-center gap-2 transition-colors"
            >
              &lt; Volver al Timeline
            </button>

            <div className="flex overflow-x-auto pb-4 -mb-4 gap-3 w-full md:w-auto snap-x no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`snap-start whitespace-nowrap flex-shrink-0 px-5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all duration-300 ${
                    activeFilter === cat
                      ? 'bg-brand-red text-black border-brand-red shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                      : 'bg-black/50 border border-brand-red/20 text-brand-light/60 hover:border-brand-red hover:text-white'
                  }`}
                >
                  {formatHumanTitle(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Contenedor del Slider */}
          <div className="relative group/slider mt-4">
            {/* Control Izquierdo */}
            <button
              onClick={() => scrollSlider('left')}
              className="absolute left-4 top-[40%] -translate-y-1/2 z-40 bg-black/80 backdrop-blur-sm border border-brand-red/50 text-brand-red w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-brand-red hover:text-black hover:scale-110 hidden md:flex shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              aria-label="Anterior"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Pista del Slider */}
            <div
              ref={sliderRef}
              className="flex overflow-x-auto gap-6 pb-10 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-2 md:px-8"
            >
              {filteredArtworks.map((art, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedArt(art)}
                  className="group relative aspect-[4/5] w-[85vw] sm:w-[320px] md:w-[380px] flex-none snap-center md:snap-start bg-black border border-brand-red/10 rounded-2xl overflow-hidden cursor-zoom-in"
                >
                  <img
                    src={getImagePath(art.filename)}
                    alt={formatHumanTitle(art.title)}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 pointer-events-none select-none"
                    referrerPolicy="no-referrer"
                    onContextMenu={preventActions}
                    onDragStart={preventActions}
                    loading="lazy"
                  />

                  <SecurityWatermark />

                  <div className="absolute inset-0 bg-transparent z-20"></div>

                  {/* Etiqueta de Categoría Global (Siempre visible) */}
                  <div className="absolute top-5 left-5 z-30">
                    <span className="bg-black/80 backdrop-blur-md border border-brand-red/30 text-brand-red font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                      {formatHumanTitle(art.category)}
                    </span>
                  </div>

                  {/* Metadatos (Visible en hover) */}
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex flex-col">
                    <span className="text-brand-light/60 font-mono text-[10px] uppercase tracking-widest mb-1">
                      Render: {formatHumanTitle(art.render_type)}
                    </span>
                    <h4 className="text-white font-black text-xl uppercase italic tracking-tight">
                      {formatHumanTitle(art.title)}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Control Derecho */}
            <button
              onClick={() => scrollSlider('right')}
              className="absolute right-4 top-[40%] -translate-y-1/2 z-40 bg-black/80 backdrop-blur-sm border border-brand-red/50 text-brand-red w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-brand-red hover:text-black hover:scale-110 hidden md:flex shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              aria-label="Siguiente"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="flex justify-center mt-2 opacity-40">
            <span className="text-brand-red font-mono text-[12px] uppercase tracking-[0.4em] flex items-center gap-3">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Deslizar
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
          </div>
        </div>
      )}

      {/* MODAL: FICHA TÉCNICA DETALLADA */}
      {selectedArt && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10 animate-in fade-in slide-in-from-left-8 duration-700 ease-out"
          onClick={() => setSelectedArt(null)}
        >
          <button className="absolute top-8 right-8 text-brand-red hover:text-white z-50 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative flex flex-col md:flex-row gap-10 max-w-7xl w-full h-full md:h-[85vh] items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex-1 h-full w-full flex items-center justify-center group">
              <img
                src={getImagePath(selectedArt.filename)}
                className="max-w-full max-h-full object-contain shadow-[0_0_80px_rgba(220,38,38,0.2)] pointer-events-none select-none"
                referrerPolicy="no-referrer"
                onContextMenu={preventActions}
                onDragStart={preventActions}
              />
              <SecurityWatermark />
              <div className="absolute inset-0 bg-transparent z-20 cursor-default"></div>
            </div>

            <div className="w-full md:w-96 flex flex-col justify-center border-l-0 md:border-l border-brand-red/20 md:pl-10">
              <span className="text-brand-red font-mono text-[10px] tracking-[0.5em] mb-4 uppercase">
                Data_Stream // Reporte_Visual
              </span>

              <h2 className="text-white font-black text-4xl md:text-5xl uppercase italic tracking-tighter mb-2">
                {formatHumanTitle(selectedArt.title)}
              </h2>

              <div className="h-1 w-20 bg-brand-red mb-8"></div>

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
                  <p className="text-brand-red/40 font-mono text-[9px] uppercase tracking-widest mb-1">Render</p>
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
                  ADVERTENCIA: Propiedad intelectual de Tarquitet. El acceso a este archivo no otorga derechos de uso,
                  edición o distribución comercial.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

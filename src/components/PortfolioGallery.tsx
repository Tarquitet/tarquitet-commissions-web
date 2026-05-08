import { useState, useMemo, useEffect } from 'react';
import { getSheetArtworks, type ArtPiece } from '../data/sheets';

// ============================================================================
// UTILIDAD: Transformador de Nombres de Archivo a Títulos Legibles
// ============================================================================
function formatHumanTitle(titleFromSheet: string): string {
  if (!titleFromSheet) return 'Entrada Sin Título';

  // 1. Insertar espacio antes de mayúsculas (CamelCase split)
  let humanTitle = titleFromSheet.replace(/([A-Z])/g, ' $1').trim();

  // 2. Insertar espacio antes de números
  humanTitle = humanTitle.replace(/([a-zA-Z])(\d+)/g, '$1 $2');

  // 3. Diccionario de Corrección (Añade aquí errores comunes de exportación)
  const corrections: Record<string, string> = {
    Prctice: 'Practice',
    Pretice: 'Practice',
    Hhalf: 'Half',
    Ssketch: 'Sketch',
    Lockx: 'Lock X',
  };

  Object.keys(corrections).forEach((errorText) => {
    const regex = new RegExp(errorText, 'gi');
    humanTitle = humanTitle.replace(regex, corrections[errorText]);
  });

  // 4. Asegurar Capitalización (Title Case)
  return humanTitle
    .toLowerCase()
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function PortfolioGallery() {
  const [artworks, setArtworks] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getSheetArtworks();
      setArtworks(data);
      setLoading(false);
    }
    loadData();
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
      const pieces = groupedByYear[year];
      covers[year] = pieces[0].filename;
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

  const getImagePath = (filename: string) => {
    return filename.startsWith('http') ? filename : `/portfolio/${filename}`;
  };

  const preventActions = (e: React.SyntheticEvent) => {
    e.preventDefault();
    return false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 border border-brand-red/10 bg-[#050000] rounded-2xl">
        <p className="text-brand-red/60 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">
          // Sincronizando Archivos...
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* VISTA 1: CARTAS DE AÑOS */}
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

      {/* VISTA 2: GALERÍA FILTRADA */}
      {activeYear && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-brand-red/20 pb-8">
            <button
              onClick={() => setActiveYear(null)}
              className="text-brand-red/50 hover:text-brand-red font-mono text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 transition-colors"
            >
              &lt; Volver al Timeline
            </button>

            {/* Contenedor de filtros adaptado para móvil */}
            <div className="flex overflow-x-auto pb-4 -mb-4 gap-3 w-full md:w-auto snap-x no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`snap-start whitespace-nowrap flex-shrink-0 px-5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all duration-300 ${
                    activeFilter === cat
                      ? 'bg-brand-red text-black border-brand-red shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                      : 'bg-black/50 border border-brand-red/20 text-brand-light/60 hover:border-brand-red hover:text-brand-light'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((art, index) => (
              <div
                key={index}
                onClick={() => setSelectedArt(art)}
                className="group relative aspect-[4/5] bg-black border border-brand-red/10 rounded-2xl overflow-hidden cursor-zoom-in"
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
                <div className="absolute inset-0 bg-transparent z-20"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  <h4 className="text-white font-black text-lg uppercase italic">{formatHumanTitle(art.title)}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL PANTALLA COMPLETA */}
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
                alt={formatHumanTitle(selectedArt.title)}
                className="max-w-full max-h-full object-contain shadow-[0_0_80px_rgba(220,38,38,0.2)] pointer-events-none select-none"
                referrerPolicy="no-referrer"
                onContextMenu={preventActions}
                onDragStart={preventActions}
              />
              <div className="absolute inset-0 bg-transparent z-20 cursor-default"></div>
            </div>

            <div className="w-full md:w-80 flex flex-col justify-center border-l-0 md:border-l border-brand-red/20 md:pl-10">
              <span className="text-brand-red font-mono text-[10px] tracking-[0.5em] mb-4 uppercase">
                Archivo Seleccionado
              </span>
              <h2 className="text-white font-black text-4xl md:text-5xl uppercase italic tracking-tighter mb-2">
                {formatHumanTitle(selectedArt.title)}
              </h2>
              <div className="h-1 w-20 bg-brand-red mb-8"></div>

              <div className="space-y-6">
                <div>
                  <p className="text-brand-red/60 font-mono text-[10px] uppercase tracking-widest mb-1">Categoría</p>
                  <p className="text-white font-bold text-lg uppercase tracking-tight italic">{selectedArt.category}</p>
                </div>
                <div>
                  <p className="text-brand-red/60 font-mono text-[10px] uppercase tracking-widest mb-1">
                    Registro Temporal
                  </p>
                  <p className="text-white font-bold text-lg uppercase tracking-tight italic">Año {selectedArt.date}</p>
                </div>
              </div>

              <p className="mt-12 text-brand-red/40 text-[9px] font-bold uppercase tracking-[0.3em] leading-relaxed">
                Propiedad Intelectual de Tarquitet. Prohibida la redistribución y uso no autorizado.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

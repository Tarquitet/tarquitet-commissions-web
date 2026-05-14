import { useState, useEffect, memo, useRef } from 'react';
import { getSheetYCH, type YCHPiece } from '../data/sheets';
import SecurityWatermark from './SecurityWatermark';
import { formatHumanTitle, preventActions, getImagePath } from '../utils/formatters';
import FadeImage from './FadeImage';

export default function YCHSlider() {
  const [items, setItems] = useState<YCHPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYCH, setSelectedYCH] = useState<YCHPiece | null>(null);

  // Variables para el Carrusel
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    getSheetYCH().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  // Lógica del Scroll y los Puntitos
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    // Asumimos el ancho de la tarjeta + gap (aprox 280px + 24px)
    // En Tailwind, calculamos dinámicamente con el primer hijo
    const itemElement = scrollRef.current.children[0] as HTMLElement;
    if (!itemElement) return;

    const itemWidth = itemElement.offsetWidth + 24; // 24px es el gap-6
    const newIndex = Math.round(scrollPosition / itemWidth);
    setActiveIndex(newIndex);
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const itemElement = scrollRef.current.children[0] as HTMLElement;
    if (!itemElement) return;

    const itemWidth = itemElement.offsetWidth + 24;
    scrollRef.current.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth',
    });
  };

  if (loading)
    return (
      <section className="py-20 flex justify-center animate-pulse text-brand-red/60 font-mono text-xs uppercase tracking-[0.5em]">
        // Syncing YCH Bases_
      </section>
    );

  return (
    <section className="relative px-4 md:px-8">
      {/* CARRUSEL DE YCH (Reemplaza a la antigua Grilla) */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory custom-scrollbar"
      >
        {items.map((ych) => (
          <YCHCard key={ych.filename} ych={ych} onClick={() => setSelectedYCH(ych)} />
        ))}
      </div>

      {/* PUNTITOS DE PAGINACIÓN (Se muestran si hay más de 1 item) */}
      {items.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 mb-8">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`transition-all duration-300 rounded-full ${
                activeIndex === i
                  ? 'w-8 h-2 bg-brand-red shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Ir a la base YCH ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* MODAL: FICHA TÉCNICA COMPLETA */}
      {selectedYCH && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10 animate-in fade-in duration-500"
          onClick={() => setSelectedYCH(null)}
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
            {/* LADO IZQUIERDO: VISOR DE IMAGEN */}
            <div className="relative flex-1 h-full w-full flex items-center justify-center bg-[#050000] rounded-lg overflow-hidden group border border-white/5 shadow-2xl">
              <FadeImage
                key={selectedYCH.filename}
                src={getImagePath(selectedYCH.filename)}
                alt={selectedYCH.title}
                className="max-w-full max-h-full object-contain relative z-10"
                containerClass="w-full h-full flex items-center justify-center"
              />
              <SecurityWatermark />
              <div className="absolute inset-0 bg-transparent z-20 cursor-default" onContextMenu={preventActions}></div>
            </div>

            {/* LADO DERECHO: PANEL DE DATOS */}
            <div className="w-full md:w-96 flex flex-col justify-center border-l-0 md:border-l border-brand-red/20 md:pl-10">
              <span className="text-brand-red font-mono text-[10px] tracking-[0.5em] mb-4 uppercase">
                Data_Stream // YCH_Base
              </span>

              <h2 className="text-white font-black text-4xl md:text-5xl uppercase italic tracking-tighter mb-2">
                {formatHumanTitle(selectedYCH.title)}
              </h2>

              <div className="h-1 w-20 bg-brand-red mb-8 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>

              <div className="grid grid-cols-1 gap-y-5">
                <div className="border-l-2 border-brand-red/20 pl-4 py-1">
                  <p className="text-brand-red/40 font-mono text-[9px] uppercase tracking-widest mb-1">Prece</p>
                  <p className="text-brand-red font-black text-4xl uppercase tracking-tight italic">
                    {selectedYCH.price} <span className="text-sm text-white">USD</span>
                  </p>
                </div>

                <div className="border-l-2 border-brand-red/20 pl-4 py-1 mt-4">
                  <p className="text-brand-red/40 font-mono text-[9px] uppercase tracking-widest mb-1">Type</p>
                  <p className="text-white font-bold text-lg uppercase tracking-tight italic">
                    {formatHumanTitle(selectedYCH.body_type)}
                  </p>
                </div>
              </div>

              <div className="mt-10 p-4 bg-brand-red/5 border border-brand-red/10 rounded-lg">
                <p className="text-brand-red/40 text-[8px] font-black uppercase tracking-[0.3em] leading-relaxed">
                  WARNING! Final price can increase by the difficulty of the YCH / Character complexity / Extra
                  Accessories requested.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// SUBCOMPONENTE DE LA TARJETA
// Ahora tiene w-[280px] shrink-0 y snap-center snap-always
const YCHCard = memo(({ ych, onClick }: { ych: YCHPiece; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="shrink-0 w-[280px] sm:w-[300px] snap-center snap-always flex flex-col border border-brand-red/10 rounded-2xl overflow-hidden group/card relative bg-[#050000] cursor-zoom-in hover:border-brand-red/50 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-4/5 relative">
        <FadeImage
          src={getImagePath(ych.filename)}
          alt={ych.title}
          className="w-full h-full object-cover opacity-70 group-hover/card:opacity-100 transition-all duration-700 group-hover/card:scale-105"
          containerClass="w-full h-full"
        />
        <SecurityWatermark />

        <div className="absolute top-4 right-4 z-30 bg-brand-red text-black font-black px-3 py-1 text-[10px] uppercase italic rounded-sm shadow-lg">
          {ych.price} USD
        </div>
      </div>

      <div className="p-5 bg-linear-to-b from-[#080000] to-transparent flex-1 flex flex-col justify-between z-20">
        <h4 className="text-white font-black text-xl uppercase italic mb-3 tracking-tight leading-none group-hover/card:text-brand-red transition-colors">
          {formatHumanTitle(ych.title)}
        </h4>
        <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-brand-light/40 border-t border-brand-red/10 pt-3 flex items-center gap-2">
          <span className="w-1 h-1 bg-brand-red"></span>
          {formatHumanTitle(ych.body_type)}
        </div>
      </div>
    </div>
  );
});
